import * as React from 'react'
import {
    useDispatch,
    useSelector,
} from 'react-redux'
import { Chromecast, Home, Room } from '@dashboard/types'
import { SSEState } from './sse/reducer'
import { useSSE } from 'react-hooks-sse'
import { initialData, incomming } from './sse/actions'
import { combinedState } from './store'

type Props = {
    children?: any,
}

export function SSEHandler(props: Props) {
    const dispatch = useDispatch()
    const initial = useSSE('initial', {
        initialState: undefined,
        stateReducer(_state, changes) {
            return changes.data[0]
        },
        parser(input) {
            return JSON.parse(input)
        },
    }) as Home
    React.useEffect(() => {
        if (initial) {
            dispatch(initialData(initial))
        }
    }, [initial, dispatch])

    const updates = useSSE('updates', {
        initialState: undefined,
        stateReducer(_state, changes) {
            return changes.data
        },
        parser(input) {
            return JSON.parse(input)
        },
    })

    React.useEffect(() => {
        if (updates) {
            dispatch(incomming(updates.topic, updates.payload))
        }
    }, [updates, dispatch])
    return (
        props.children
    )
}

export function useSSEString(room: string, deviceType: string, device: string): string | undefined {
    const data = useSelector( (state: combinedState) => state.sse ) as SSEState
    if (data[room] && data[room][deviceType]) {
        return data[room][deviceType][device]
    }
}

export function useSSENumber(room: string, deviceType: string, device: string): number | undefined {
    return parseFloat(useSSEString(room, deviceType, device) || '-9999')
}

export function useSSEBoolean(room: string, deviceType: string, device: string): boolean {
    const value = useSSEString(room, deviceType, device)
    let bool: any
    try {
        bool = JSON.parse(value || '0')
    } catch {}
    return bool === 1 || bool === '1' || bool || false
}

export function useChromecast(room: string = 'stuen'): Chromecast.Chrome | undefined {
    const data = useSelector( (state: combinedState) => state.sse ) as SSEState
    if (data[room]) {
        return (data[room] as Room)?.media
    }
}

export function useDevices(room: string, type: string): string[] {
    const data = useSelector((state: combinedState) => state.sse) as SSEState
    if (data[room] && data[room][type]) {
        return Object.keys(data[room][type])
    }
    return []
}
