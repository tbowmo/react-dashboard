import { WeatherActions } from './action-types'
import { ForecastDto, CurrentWeatherDto } from '../weather-types'

export type CurrentWeather = {
    pending: boolean,
    data: CurrentWeatherDto | undefined,
}

export type ForecastWeather = {
    pending: boolean,
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
    },
    currentWeather: {
        pending: false,
        data: undefined,
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
            }
        }
    case 'FETCH_FORECAST_SUCCESS':
        return {
            ...state,
            forecast: {
                ...state.forecast,
                pending: false,
                data: action.payload,
            }
        }
    case 'FETCH_FORECAST_PENDING':
        return {
            ...state,
            currentWeather: {
                ...state.currentWeather,
                pending: true,
            }
        }
    case 'FETCH_CURRENT_WEATHER_PENDING':
        return {
            ...state,
            forecast: {
                ...state.forecast,
                pending: true,
            }
        }
    default:
        return state
    }
}
