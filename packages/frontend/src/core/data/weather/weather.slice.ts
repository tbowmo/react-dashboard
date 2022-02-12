import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CurrentWeatherDto, ForecastDto } from './weather-types'
import { api } from '../use-api'

export type CurrentWeather = {
  pending: boolean
  failed: boolean
  lastFetchTime: number
  data: CurrentWeatherDto | undefined
}

export type ForecastWeather = {
  pending: boolean
  failed: boolean
  lastFetchTime: number
  data: ForecastDto | undefined
}

export type WeatherState = {
  forecast: ForecastWeather
  currentWeather: CurrentWeather
}

const initialState: WeatherState = {
  forecast: {
    pending: false,
    data: undefined,
    failed: false,
    lastFetchTime: 0,
  },
  currentWeather: {
    pending: false,
    data: undefined,
    failed: false,
    lastFetchTime: 0,
  },
}

export const fetchForecast = createAsyncThunk<
  ForecastDto,
  void,
  {
    state: {
      weather: WeatherState
    }
  }
>('weather/forecast', () => api<ForecastDto>('/weather/forecast'), {
  condition: (_void, { getState }) => {
    const {
      weather: { forecast },
    } = getState()
    return !forecast.pending
  },
})

export const fetchCurrent = createAsyncThunk<
  CurrentWeatherDto,
  void,
  {
    state: {
      weather: WeatherState
    }
  }
>('weather/current', () => api<CurrentWeatherDto>('/weather/current'), {
  condition: (_void, { getState }) => {
    const {
      weather: { currentWeather },
    } = getState()
    return !currentWeather.pending
  },
})

const Weather = createSlice({
  name: 'Weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchForecast.pending, (state) => ({
      ...state,
      forecast: {
        ...state.forecast,
        pending: true,
      },
    }))
    builder.addCase(fetchForecast.fulfilled, (state, action) => ({
      ...state,
      forecast: {
        ...state.forecast,
        data: action.payload,
        pending: false,
        lastFetch: Math.round(new Date().getTime() / 1000),
      },
    }))

    builder.addCase(fetchCurrent.pending, (state) => ({
      ...state,
      currentWeather: {
        ...state.currentWeather,
        pending: true,
      },
    }))
    builder.addCase(fetchCurrent.fulfilled, (state, action) => ({
      ...state,
      currentWeather: {
        ...state.currentWeather,
        data: action.payload,
        pending: false,
        lastFetch: Math.round(new Date().getTime() / 1000),
      },
    }))
  },
})

export default Weather.reducer
