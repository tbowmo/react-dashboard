import React from 'react'
import { SSEProvider, useSSE } from 'react-hooks-sse'
import { useLoadInitialData, useUpdateLocation } from './sse-atom'
import { SSETopic } from '@dashboard/types'

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

function InnerSSe(props: React.PropsWithChildren) {
    const { children } = props

    const loadInitialData = useLoadInitialData()
    const updateLocation = useUpdateLocation()

    useSseTopic('initial', {}, loadInitialData)
    useSseTopic<SSETopic>('updates', { room: '', sensor: '', sensorGroup: '', payload: '' }, updateLocation)
    return children
}

export function SSEHandler(props: React.PropsWithChildren) {
    const { children } = props

    return (
        <SSEProvider endpoint="/api/sse">
            <InnerSSe>
                {children}
            </InnerSSe>
        </SSEProvider>
    )
}
