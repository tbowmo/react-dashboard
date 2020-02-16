import {
    Incomming,
    Initial,
} from './action-types'
import { Home } from '@dashboard/types'


export function initialData(data: Home): Initial {
    return {
        type: 'initial',
        payload: data,
    }
}

export function incomming(topic: string, payload: string): Incomming {
    return {
        type: 'incomming',
        payload: {
            topic,
            payload,
        },
    }
}

