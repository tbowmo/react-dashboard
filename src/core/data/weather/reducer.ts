import { WeatherActions } from './action-types'
import { ForecastDto, CurrentWeatherDto } from '../weather-types'

export type CurrentWeather = {
    pending: boolean,
    failed: boolean,
    lastFetchTime: number,
    data: CurrentWeatherDto | undefined,
}

export type ForecastWeather = {
    pending: boolean,
    failed: boolean,
    lastFetchTime: number,
    data: ForecastDto | undefined,
}

export type WeatherState = {
    forecast: ForecastWeather,
    currentWeather: CurrentWeather,
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

export function weatherReducer(state: WeatherState = initialState, action: WeatherActions) {
    switch (action.type) {
    case 'FETCH_CURRENT_WEATHER_SUCCESS':
        return {
            ...state,
            currentWeather: {
                ...state.currentWeather,
                pending: false,
                data: action.payload,
                lastFetch: Math.round((new Date()).getTime() / 1000),
            },
        }
    case 'FETCH_FORECAST_SUCCESS':
        return {
            ...state,
            forecast: {
                ...state.forecast,
                pending: false,
                data: action.payload,
                lastFetch: Math.round((new Date()).getTime() / 1000),
            },
        }
    case 'FETCH_FORECAST_PENDING':
        return {
            ...state,
            currentWeather: {
                ...state.currentWeather,
                pending: true,
            },
        }
    case 'FETCH_CURRENT_WEATHER_PENDING':
        return {
            ...state,
            forecast: {
                ...state.forecast,
                pending: true,
            },
        }
    case 'FETCH_FORECAST_FAILED':
        return {
            ...state,
            forecast: {
                ...state.forecast,
                failed: true,
            },
        }
    case 'FETCH_CURRENT_WEATHER_FAILED':
        return {
            ...state,
            currentWeather: {
                ...state.currentWeather,
                failed: true,
            },
        }
    default:
        return state
    }
}
