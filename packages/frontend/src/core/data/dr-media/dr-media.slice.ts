import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { DRMedia } from './dr-media-type'
import { api } from '../use-api'

export type DrMediaState = {
  channels: DRMedia[] | undefined
  lastFetch: number
  pending: boolean
}

const initialState: DrMediaState = {
  channels: [],
  lastFetch: 0,
  pending: false,
}

export const fetchDrMedia = createAsyncThunk<
  DRMedia[],
  void,
  {
    state: {
      drMedia: DrMediaState
    }
  }
>(
  'drmedia/channels',
  async (): Promise<DRMedia[]> => {
    const data = api<DRMedia[]>(
      'https://api.dr.dk/radio/v2/schedules/all/now-next',
    ).then((blob) => {
      return blob
    })
    return data
  },
  {
    condition: (_void, { getState }) => {
      const { drMedia } = getState()
      return !drMedia.pending
    },
  },
)

const DrMedia = createSlice({
  name: 'drMedia',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDrMedia.fulfilled, (state, action) => ({
      ...state,
      channels: action.payload,
      pending: false,
      lastFetch: Math.round(new Date().getTime() / 1000),
    }))

    builder.addCase(fetchDrMedia.pending, (state) => ({
      ...state,
      pending: true,
    }))
  },
})

export default DrMedia.reducer
