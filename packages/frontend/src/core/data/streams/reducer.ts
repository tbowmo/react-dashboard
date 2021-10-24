import { StreamDto } from './stream-type'
import { StreamActions } from './action-types'

export type StreamState = {
    pending: boolean,
    streams: {
        [streamtype: string] : undefined | StreamDto[],
    },
}

const initialState: StreamState = {
    pending: false,
    streams: {
        radio : [],
        tv: [],
    },
}

export function streamReducer(state: StreamState = initialState, action: StreamActions) {
    switch (action.type) {
    case 'FETCH_STREAM_SUCCESS':
        return {
            ...state,
            streams: {
                ...state.streams,
                [action.payload.type]: action.payload.data,
            },
        }
    default:
        return state
    }
}
