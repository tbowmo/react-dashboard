import React from 'react'
import { useSSE } from 'react-hooks-sse'
import { useLoadInitialRoom, useLocationUpdater } from './sse-atom'

type Props = {
  children?: React.ReactNode
}

export function SSEAtomHandler(props: Props) {
  const { children } = props

  const loadInitialRoom = useLoadInitialRoom()
  const updateLocation = useLocationUpdater()

  const initial = useSSE(
    'initial',
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
      for (const location of Object.keys(initial)) {
        loadInitialRoom(location, initial[location])
      }
    }
  }, [initial, loadInitialRoom])

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
      updateLocation(updates.topic, updates.payload)
    }
  }, [updateLocation, updates])

  return <React.Fragment>{children}</React.Fragment>
}
