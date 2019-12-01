import { StreamDto } from './stream-type'
import { FetchStreamsSuccess } from './action-types'

export function fetchStreamSuccess(type: string, data: StreamDto[]): FetchStreamsSuccess {
    return {
        type: 'FETCH_STREAM_SUCCESS',
        payload: {
            type,
            data,
        },
    }
}
