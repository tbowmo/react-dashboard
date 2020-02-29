import { Home, Chromecast } from '@dashboard/types'
import { getRepository } from 'typeorm'
import { Channel } from '../server/entity/channel'

const store: Home = {}

function isEmpty(test: string | undefined): boolean {
    return (!test || test === '')
}

async function handleMedia(media: Chromecast.Media ): Promise<Chromecast.Media> {
    let mediaReplace: Partial<Chromecast.Media> = {}
    if (isEmpty(media.artist) && isEmpty(media.title)) {
        const channel = await getRepository(Channel).createQueryBuilder()
            .leftJoinAndSelect('Channel.programmes', 'programme')
            .where('link = :link', { link: media.content_id })
            .andWhere('datetime(start) <= datetime(:date)', { date: new Date().toISOString() })
            .andWhere('datetime(end) >= datetime(:date)', { date: new Date().toISOString() })
            .getOne()

        const duration = ((channel?.programmes[0]?.end?.getTime() || 0) - (channel?.programmes[0]?.start?.getTime() || 0)) / 1000

        mediaReplace = {
            album_art: channel?.icon,
            album: channel?.programmes[0].title,
            start_time: (channel?.programmes[0]?.start?.getTime() ||0) / 1000,
            duration: duration,
            title: channel?.programmes[0].description,
            artist: channel?.type,
        }
    }

    return {
        ...media,
        ...mediaReplace,
    }
}

function decodeTopic(topic: string): {
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

export async function enrichPayload(topic: string, value: string): Promise<any> {
    const { type, sensor } = decodeTopic(topic)
    let v = value
    if (type === 'media' && sensor === 'media') {
        v = await handleMedia(JSON.parse(value)) as any
    } else {
        try {
            v = JSON.parse(value)
        // eslint-disable-next-line no-empty
        } catch {}
    }
    return v
}

export async function updateStore(topic: string, value: string): Promise<any> {
    let changed = false
    const { room, type, sensor } = decodeTopic(topic)
    if (!store[room]) {
        store[room] = {}
    }
    if (!store[room][type]) {
        store[room][type] = {}
    }
    const v = await enrichPayload(topic, value)
    changed = !(store[room][type][sensor] === v)
    store[room][type][sensor] = v

    return changed ? v : undefined
}

export function getStore(): Home {
    return store
}
