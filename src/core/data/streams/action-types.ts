import { StreamDto } from './stream-type'

export type FetchStreamsSuccess = {
    type : 'FETCH_STREAM_SUCCESS',
    payload : {
        type: string,
        data: StreamDto[],
    },
}

export type StreamActions =
    | FetchStreamsSuccess
