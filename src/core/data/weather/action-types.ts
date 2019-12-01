
import {
    CurrentWeatherDto,
    ForecastDto,
} from '../weather-types'

export type FetchCurrentWeatherPending = {
    type: 'FETCH_CURRENT_WEATHER_PENDING',
}

export type FetchCurrentWeatherSuccess = {
    type: 'FETCH_CURRENT_WEATHER_SUCCESS',
    payload: CurrentWeatherDto, 
}

export type FetchForecastPending = {
    type: 'FETCH_FORECAST_PENDING',
}

export type FetchForecastSuccess = {
    type: 'FETCH_FORECAST_SUCCESS',
    payload: ForecastDto,
}

export type WeatherActions =
    | FetchCurrentWeatherPending
    | FetchCurrentWeatherSuccess
    | FetchForecastPending
    | FetchForecastSuccess
