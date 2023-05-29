import React from 'react'
import { useSSE } from 'react-hooks-sse'
import { useLoadInitialRoom, useLocationUpdater } from './sse-atom'

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
    useSseTopic('updates', { topic: '', payload: '' }, updateLocation)

    return <React.Fragment>{children}</React.Fragment>
}
