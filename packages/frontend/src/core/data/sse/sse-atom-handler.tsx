import React from 'react'
import { useSSE } from 'react-hooks-sse'
import { useLoadInitialRoom, useLocationUpdater } from './sse-atom'
import { SSETopic } from '@dashboard/types'

type Props = {
    children?: React.ReactNode
}


function useSseTopic<T extends object>(
    topic: string,
    empty: T,
    callback: (data: T) => void,
) {
    const data = useSSE<T>(topic, empty, {
        stateReducer(_state, changes) {
            return changes.data
        },
        parser(input: string) {
            return JSON.parse(input)
        },
    })

    React.useEffect(() => {
        callback(data)
    }, [data, callback])
}

export function SSEAtomHandler(props: Props) {
    const { children } = props

    const loadInitialRoom = useLoadInitialRoom()
    const updateLocation = useLocationUpdater()

    useSseTopic('initial', {}, loadInitialRoom)
    useSseTopic<SSETopic>('updates', { room: '', sensor: '', sensorGroup: '', payload: '' }, updateLocation)

    return <React.Fragment>{children}</React.Fragment>
}
