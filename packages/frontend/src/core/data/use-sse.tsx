import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ChromeCast, Room } from '@dashboard/types'
import { SSEState } from './sse/reducer'
import { useSSE } from 'react-hooks-sse'
import { initialData, incomming } from './sse/actions'
import { combinedState } from './store'

type Props = {
  children?: React.ReactNode
}

export function SSEHandler(props: Props) {
  const { children } = props
  const dispatch = useDispatch()

  const initial = useSSE(
    'message',
    {},
    {
      stateReducer(_state, changes) {
        return changes.data
      },
      parser(input: string) {
        return JSON.parse(input)
      },
    },
  )

  React.useEffect(() => {
    if (initial) {
      dispatch(initialData(initial))
    }
  }, [initial, dispatch])

  const updates = useSSE(
    'updates',
    { topic: '', payload: '' },
    {
      stateReducer(_state, changes) {
        return changes.data
      },
      parser(input: string) {
        return JSON.parse(input)
      },
    },
  )

  React.useEffect(() => {
    if (updates) {
      dispatch(incomming(updates.topic, updates.payload))
    }
  }, [updates, dispatch])

  return <React.Fragment>{children}</React.Fragment>
}

export function useSSEString(
  room: string | undefined,
  deviceType: string | undefined,
  device: string | undefined,
): string | undefined {
  const data = useSelector((state: combinedState) => state.sse) as SSEState
  if (!room || !deviceType || !device) {
    return undefined
  }
  return data[room]?.[deviceType]?.[device]
}

export function useSSENumber(
  room: string | undefined,
  deviceType: string | undefined,
  device: string | undefined,
): number | undefined {
  const value = useSSEString(room, deviceType, device)
  return value ? parseFloat(value) : undefined
}

export function useSSEBoolean(
  room: string | undefined,
  deviceType: string | undefined,
  device: string | undefined,
): boolean | undefined {
  const value = useSSEString(room, deviceType, device)

  try {
    const bool = JSON.parse(value || '0')
    return bool === 1 || bool === '1' || bool || false
  } catch {
    // Empty on purpose
  }

  return undefined
}

export function useChromecast(room = 'stuen'): ChromeCast | undefined {
  const data = useSelector((state: combinedState) => state.sse) as SSEState
  if (data[room]) {
    return (data[room] as Room)?.media
  }
  return undefined
}

export function useDevices(room: string, type: string): string[] {
  const data = useSelector((state: combinedState) => state.sse) as SSEState
  if (data[room] && data[room]?.[type]) {
    return Object.keys(data[room]?.[type])
  }
  return []
}
