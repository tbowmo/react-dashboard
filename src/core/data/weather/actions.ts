import { CurrentWeatherDto, ForecastDto } from '../weather-types'
import {
    FetchCurrentWeatherSuccess,
    FetchForecastSuccess,
    FetchCurrentWeatherPending,
    FetchForecastPending,
} from './action-types'

export function fetchCurrentWeatherSuccess(data: CurrentWeatherDto): FetchCurrentWeatherSuccess {
    return {
        type: 'FETCH_CURRENT_WEATHER_SUCCESS',
        payload: data,
    }
}

export function fetchForecastSuccess(data: ForecastDto): FetchForecastSuccess {
    return {
        type: 'FETCH_FORECAST_SUCCESS',
        payload: data,
    }
}

export function fetchCurrentWeatherPending(): FetchCurrentWeatherPending {
    return {
        type: 'FETCH_CURRENT_WEATHER_PENDING',
    }
}

export function fetchForecastPending(): FetchForecastPending {
    return {
        type: 'FETCH_FORECAST_PENDING',
    }
}
