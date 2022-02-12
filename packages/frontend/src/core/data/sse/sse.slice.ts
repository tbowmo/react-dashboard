import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Home } from '@dashboard/types'

type SSEState = Home

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

type IncommingTopic = {
  topic: string
  payload: string
}

const SSE = createSlice({
  name: 'sse',
  initialState,
  reducers: {
    incommingData(state, { payload }: PayloadAction<IncommingTopic>) {
      const [, room, type, device] =
        payload.topic.match(/home\/(\w+)\/(\w+)\/(\w+)/) || []
      let value = payload.payload
      try {
        value = JSON.parse(payload.payload)
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
    },
    initialData(state, { payload }: PayloadAction<Home>) {
      return {
        ...state,
        ...payload,
      }
    },
  },
})

export const { incommingData, initialData } = SSE.actions

export default SSE.reducer
