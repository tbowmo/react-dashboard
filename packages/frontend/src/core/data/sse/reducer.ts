import { Home } from '@dashboard/types'
import { SSEActions } from './action-types'

export type SSEState = Home

const initialState: SSEState = {
  garden: {
    chickencoop: {},
  },
  global: {
    heating: {},
    utility: {},
  },
  presence: {},
  rooms: {},
}

export function sseReducer(state: SSEState = initialState, action: SSEActions) {
  switch (action.type) {
    case 'incomming': {
      const [, room, type, device] =
        action.payload.topic.match(/home\/(\w+)\/(\w+)\/(\w+)/) || []
      let value = action.payload.payload
      try {
        value = JSON.parse(action.payload.payload)
        // eslint-disable-next-line no-empty
      } catch {}
      let roomState = state[room]
      if (!roomState) {
        roomState = {}
      }
      let typeState = roomState[type]
      if (!typeState) {
        typeState = {}
      }
      roomState = {
        ...roomState,
        [type]: {
          ...typeState,
          [device]: value,
        },
      }
      return {
        ...state,
        [room]: roomState,
      }
    }
    case 'initial':
      return action.payload
    default:
      return state
  }
}
