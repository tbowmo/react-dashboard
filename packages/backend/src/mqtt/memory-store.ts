import { Home, Chromecast, Room } from '@dashboard/types'
import { getRepository } from 'typeorm'
import { Channel } from '../server/entity/channel'
import * as SSE from 'express-sse'

export class MemoryStore {
    private store: Home = {}
    private static myself: MemoryStore
    private lastMediaUpdate = Date.now()
    private readonly sse: SSE

    private constructor(sse: SSE) {
        this.sse = sse
    }

    public static get(sse?: SSE) {
        if (sse && !MemoryStore.myself) {
            MemoryStore.myself = new MemoryStore(sse)
        }
        if (!sse && !MemoryStore.myself) {
            throw ('SSE is not specified')
        }
        return MemoryStore.myself
    }

    private isEmpty(test: string | undefined): boolean {
        return (!test || test === '')
    }

    private async handleMedia(media: Chromecast.Media ): Promise<Chromecast.Media> {
        let mediaReplace: Partial<Chromecast.Media> = {}
        if (this.isEmpty(media.artist) && this.isEmpty(media.title)) {
            const channel = await getRepository(Channel).createQueryBuilder()
                .leftJoinAndSelect('Channel.programmes', 'programme')
                .where('link = :link', { link: media.content_id })
                .andWhere('datetime(start) <= datetime(:date)', { date: new Date().toISOString() })
                .andWhere('datetime(end) >= datetime(:date)', { date: new Date().toISOString() })
                .getOne()

            if (channel) {
                const duration = ((channel.programmes[0]?.end?.getTime() || 0) - (channel.programmes[0]?.start?.getTime() || 0)) / 1000
                mediaReplace = {
                    album_art: channel.icon,
                    album: channel.programmes[0].title,
                    start_time: (channel.programmes[0]?.start?.getTime() ||0) / 1000,
                    duration: duration,
                    title: channel.programmes[0].description,
                    artist: channel.type,
                }
            }
        }

        return {
            ...media,
            ...mediaReplace,
        }
    }

    private decodeTopic(topic: string): {
        room: string,
        type: string,
        sensor: string,
    } {
        const [, room, type, sensor] = topic.match(/home\/(\w+)\/(\w+)\/(\w+)/) || []
        return {
            room,
            type,
            sensor,
        }
    }

    private async enrichPayload(topic: string, value: string): Promise<any> {
        const { type, sensor } = this.decodeTopic(topic)
        let v = value
        if (type === 'media' && sensor === 'media') {
            v = await this.handleMedia(JSON.parse(value)) as any
        } else {
            try {
                v = JSON.parse(value)
            // eslint-disable-next-line no-empty
            } catch {}
        }
        return v
    }

    private isRoom(room): room is Room {
        return (<Room>room).media !== undefined
    }

    private async updateMedia() {
        const now = Date.now()
        if (now - this.lastMediaUpdate > 60000) {
            this.lastMediaUpdate = now
            for (const roomKey of Object.keys(this.store)) {
                const room = this.store[roomKey]
                if (this.isRoom(room)) {
                    const oldMedia = room?.media?.media
                    const newMedia = await this.handleMedia({
                        ...oldMedia,
                        artist: '',
                        title : '',
                    })
                    if (!this.isEmpty(newMedia.title) && !this.isEmpty(newMedia.artist)) {
                        const updatedRoom = {
                            ...room, 
                            ...{
                                media: {
                                    ...room.media,
                                    media: newMedia
                                }
                            }
                        }
    
                        this.store = {
                            ...this.store,
                            [roomKey]: updatedRoom, 
                        }
                        this.sse.updateInit(this.store, 'initial')
                        this.sse.send({
                            payload: newMedia,
                            topic: `home/${room}/media/media`,
                        }, 'updates')
                    }
                }
            }
        }
    }

    public async updateStore(topic: string, value: string): Promise<void> {
        let changed = false
        const { room, type, sensor } = this.decodeTopic(topic)
  
        const v = await this.enrichPayload(topic, value)
        changed = !(this.store?.[room]?.[type]?.[sensor] === v)

        this.store = {
            ...this.store,
            [room]: {
                ...this.store[room],
                [type]: {
                    ...this.store?.[room]?.[type],
                    [sensor] : v                     
                }
            },
        }

        if (changed) {
            this.sse.send({
                payload: v,
                topic,
            }, 'updates')
            this.sse.updateInit(this.store, 'initial')
        }
        this.updateMedia()
    }

    public getStore(): Home {
        return this.store
    }
}