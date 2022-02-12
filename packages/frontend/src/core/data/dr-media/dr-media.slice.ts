import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../use-api'
import { DRMedia } from './dr-media-type'

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
      'https://www.dr.dk/mu-psapi/medium/0/nownextliveepg',
    ).then((blob) => {
      // eslint-disable-next-line no-console
      console.log(blob)
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
