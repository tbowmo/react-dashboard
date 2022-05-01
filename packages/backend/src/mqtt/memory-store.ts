import { Home, Media, Room } from '@dashboard/types'
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

  private static async enrichPayload(value: string): Promise<Media | string> {
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

  public async updateStore(topic: string, value: string): Promise<void> {
    let changed = false
    const { room, type, sensor } = MemoryStore.decodeTopic(topic)

    const v = await MemoryStore.enrichPayload(value)
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
  }

  public getStore(): Home {
    return this.store
  }
}
