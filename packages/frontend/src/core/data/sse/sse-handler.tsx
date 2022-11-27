import * as React from 'react'
import { useAppDispatch } from '../store'
import { useSSE } from 'react-hooks-sse'
import { incommingData, initialData } from './sse.slice'

type Props = {
  children?: React.ReactNode
}

export function SSEHandler(props: Props) {
  const { children } = props
  const dispatch = useAppDispatch()

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
      dispatch(incommingData(updates))
    }
  }, [updates, dispatch])

  return <React.Fragment>{children}</React.Fragment>
}
