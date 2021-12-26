import { Home, Media, Room } from '@dashboard/types'
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
      throw new Error('SSE is not specified')
    }
    return MemoryStore.myself
  }

  private static isEmpty(test: string | undefined): boolean {
    return !test || test === ''
  }

  private static async handleMedia(media: Media): Promise<Media> {
    let mediaReplace: Partial<Media> = {}
    if (MemoryStore.isEmpty(media.artist) && MemoryStore.isEmpty(media.title)) {
      const channel = await getRepository(Channel)
        .createQueryBuilder()
        .leftJoinAndSelect('Channel.programmes', 'programme')
        .where('link = :link', { link: media.content_id })
        .andWhere('datetime(start) <= datetime(:date)', {
          date: new Date().toISOString(),
        })
        .andWhere('datetime(end) >= datetime(:date)', {
          date: new Date().toISOString(),
        })
        .getOne()

      if (channel) {
        const duration =
          ((channel.programmes[0]?.end?.getTime() || 0) -
            (channel.programmes[0]?.start?.getTime() || 0)) /
          1000
        mediaReplace = {
          album_art: channel.icon,
          album: channel.programmes[0].title,
          start_time: (channel.programmes[0]?.start?.getTime() || 0) / 1000,
          duration,
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

  private static decodeTopic(topic: string): {
    room: string
    type: string
    sensor: string
  } {
    const [, room, type, sensor] =
      topic.match(/home\/(\w+)\/(\w+)\/(\w+)/) || []
    return {
      room,
      type,
      sensor,
    }
  }

  private static async enrichPayload(
    topic: string,
    value: string,
  ): Promise<Media | string> {
    const { type, sensor } = MemoryStore.decodeTopic(topic)
    if (type === 'media' && sensor === 'media') {
      return MemoryStore.handleMedia(JSON.parse(value))
    }
    try {
      return JSON.parse(value)
      // eslint-disable-next-line no-empty
    } catch {
      return value
    }
  }

  private static isRoom(room): room is Room {
    return (<Room>room).media !== undefined
  }

  private async updateMedia() {
    const now = Date.now()
    if (now - this.lastMediaUpdate > 60000) {
      this.lastMediaUpdate = now

      Object.entries(this.store).forEach(([roomKey, room]) => {
        if (MemoryStore.isRoom(room)) {
          const oldMedia = room?.media?.media
          MemoryStore.handleMedia({
            ...oldMedia,
            artist: '',
            title: '',
          }).then((newMedia) => {
            if (
              !MemoryStore.isEmpty(newMedia.title) &&
              !MemoryStore.isEmpty(newMedia.artist)
            ) {
              const updatedRoom = {
                ...room,
                ...{
                  media: {
                    ...room.media,
                    media: newMedia,
                  },
                },
              }

              this.store = {
                ...this.store,
                [roomKey]: updatedRoom,
              }
              this.sse.updateInit(this.store, 'initial')
              this.sse.send(
                {
                  payload: newMedia,
                  topic: `home/${room}/media/media`,
                },
                'updates',
              )
            }
          })
        }
      })
    }
  }

  public async updateStore(topic: string, value: string): Promise<void> {
    let changed = false
    const { room, type, sensor } = MemoryStore.decodeTopic(topic)

    const v = await MemoryStore.enrichPayload(topic, value)
    changed = !(this.store?.[room]?.[type]?.[sensor] === v)

    this.store = {
      ...this.store,
      [room]: {
        ...this.store[room],
        [type]: {
          ...this.store?.[room]?.[type],
          [sensor]: v,
        },
      },
    }

    if (changed) {
      this.sse.send(
        {
          payload: v,
          topic,
        },
        'updates',
      )
      this.sse.updateInit(this.store, 'initial')
    }
    this.updateMedia()
  }

  public getStore(): Home {
    return this.store
  }
}
