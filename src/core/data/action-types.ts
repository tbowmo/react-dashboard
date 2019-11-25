import { MqttClient } from 'mqtt'
import {
    CurrentWeatherDto,
    ForecastDto
} from './weather-types'

export type Subscribe = {
    type: 'subscribe',
    payload: string,
}

export type Incomming = {
    type: 'incomming',
    payload: {
        topic: string,
        payload: string,
    },
}

export type Connect = {
    type: 'connect',
    payload: MqttClient,
}

// --- Weather types
export type FetchCurrentWeatherPending = {
    type: 'FETCH_CURRENT_WEATHER_PENDING',
}

export type FetchCurrentWeatherSuccess = {
    type: 'FETCH_CURRENT_WEATHER_SUCCESS',
    payload: CurrentWeatherDto, 
}

export type FetchForecastPending = {
    type: 'FETCH_FORECAST_PENDING'
}

export type FetchForecastSuccess = {
    type: 'FETCH_FORECAST_SUCCESS',
    payload: ForecastDto,
}

export type MqttActions =
    | Subscribe
    | Incomming
    | Connect

export type WeatherActions =
    | FetchCurrentWeatherPending
    | FetchCurrentWeatherSuccess
    | FetchForecastPending
    | FetchForecastSuccess
