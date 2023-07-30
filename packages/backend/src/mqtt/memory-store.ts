import { Home, SSETopic } from '@dashboard/types'
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

    private static decodeTopic(topic: string): Omit<SSETopic, 'payload'> {
        const [, room, sensorGroup, sensor] = topic.match(/home\/(\w+)\/(\w+)\/(\w+)/) || []

        return {
            room,
            sensorGroup,
            sensor,
        }
    }

    private static enrichPayload(
        value: string,
    ): Record<string, unknown> | string {
        try {
            return JSON.parse(value)
        } catch (e) {
            return value
        }
    }

    public async updateStore(topic: string, value: string): Promise<void> {
        const { room, sensorGroup, sensor } = MemoryStore.decodeTopic(topic)

        const v = MemoryStore.enrichPayload(value)
        const currentValue = this.store?.[room]?.[sensorGroup]?.[sensor]
        const alreadyStored = isEqual(currentValue, v)
        
        if (alreadyStored)   {
            return
        }

        this.store = {
            ...this.store,
            [room]: {
                ...this.store[room],
                [sensorGroup]: {
                    ...this.store?.[room]?.[sensorGroup],
                    [sensor]: v,
                },
            },
        }

        this.sse.broadcast(
            {
                payload: v,
                room,
                sensor,
                sensorGroup,
            },
            'updates',
        )
    }

    public getStore(): Home {
        return this.store
    }
}
