import { Home } from '@dashboard/types'
import { Channel } from 'better-sse'
import { isEqual } from 'lodash'

export class MemoryStore {
  private store: Home = {}

  private static myself: MemoryStore

  private readonly sse: Channel

  private constructor(sse: Channel) {
    this.sse = sse
  }

  public static get(sse?: Channel) {
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

  private static enrichPayload(
    value: string,
  ): Record<string, unknown> | string {
    try {
      return JSON.parse(value)
      // eslint-disable-next-line no-empty
    } catch (e) {
      return value
    }
  }

  public async updateStore(topic: string, value: string): Promise<void> {
    const { room, type, sensor } = MemoryStore.decodeTopic(topic)

    const v = MemoryStore.enrichPayload(value)
    const currentValue = this.store?.[room]?.[type]?.[sensor]
    const equal = isEqual(currentValue, v)

    if (equal) {
      // eslint-disable-next-line no-console
      console.log({ room, type, sensor, v })
      return
    }

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

    this.sse.broadcast(
      {
        payload: v,
        topic,
      },
      'updates',
    )
  }

  public getStore(): Home {
    return this.store
  }
}
