import { Home } from '@dashboard/types'

const store: Home = {}

export function updateStore(topic: string, value: string): boolean {
    if (topic.endsWith('/dt') || topic.endsWith('/set')) {
        return false
    }
    let changed = false
    const [, room, type, sensor] = topic.match(/home\/(\w+)\/(\w+)\/(\w+)/) || []
    if (!store[room]) {
        store[room] = {}
    }
    if (!store[room][type]) {
        store[room][type] = {}
    }

    let v = value
    try {
        v = JSON.parse(value)
    // eslint-disable-next-line no-empty
    } catch {}
    changed = !(store[room][type][sensor] === v)
    store[room][type][sensor] = v

    return changed
}

export function getStore(): Home {
    return store
}
