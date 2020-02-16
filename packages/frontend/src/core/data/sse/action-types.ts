import { Home } from '@dashboard/types'

export type Incomming = {
    type: 'incomming',
    payload: {
        topic: string,
        payload: string,
    },
}

export type Initial = {
    type: 'initial',
    payload: Home,
}
export type SSEActions =
    | Incomming
    | Initial
