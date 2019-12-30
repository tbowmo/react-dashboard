import { CurrentWeatherDto, ForecastDto } from './weather-types'
import {
    useDispatch,
    useSelector,
} from 'react-redux'
import {
    CurrentWeather,
    WeatherState,
    ForecastWeather,
} from './weather/reducer'
import { combinedState } from './store'
import {
    fetchCurrentWeatherPending,
    fetchCurrentWeatherSuccess,
    fetchForecastPending,
    fetchForecastSuccess,
    fetchCurrentWeatherFailed,
    fetchForecastFailed,
} from './weather/actions'
import { useEffect } from 'react'
import { useMqttClient } from './use-mqtt'

const apiUrl = 'https://api.openweathermap.org/data/2.5'
const apiKey = process.env.REACT_APP_OW_KEY
const city = process.env.REACT_APP_OW_CITYID
type TimerType = {
    timer?: ReturnType<typeof setInterval>,
    active: number,
}

const weatherTimer: TimerType = {
    active: 0,
}

const forecastTimer: TimerType = {
    active: 0,
}

function currentWeather() {
    return (dispatch, getState) => {
        const { weather } = getState()
        const currentWeather = (weather as WeatherState).currentWeather
        if (!currentWeather.pending && !currentWeather.failed) {
            dispatch(fetchCurrentWeatherPending)
            fetch(`${apiUrl}/weather?id=${city}&appid=${apiKey}&lang=da&units=metric`)
                .then((resp) => resp.json())
                .then((data) => dispatch(fetchCurrentWeatherSuccess(data)))
                .catch(() => {
                    dispatch(fetchCurrentWeatherFailed)
                })
        }
    }
}

function forecastWeather() {
    return (dispatch, getState) => {
        const { weather } = getState()
        const forecastWeather = (weather as WeatherState).forecast
        if (!forecastWeather.pending && !forecastWeather.failed) {
            dispatch(fetchForecastPending)
            fetch(`${apiUrl}/forecast?id=${city}&appid=${apiKey}&lang=da&units=metric`)
                .then((response) => response.json())
                .then((data) => dispatch(fetchForecastSuccess(data)))
                .catch(() => {
                    dispatch(fetchForecastFailed)
                })
        }
    }
}

export function useCurrentWeather(): CurrentWeatherDto | undefined {
    const weatherState = useSelector((state: combinedState) => state.weather.currentWeather) as CurrentWeather || {
        pending: false,
        data: undefined,
        failed: false,
    }
    const dispatch = useDispatch()
    const mqtt = useMqttClient()

    useEffect(() => {
        if (!weatherState.failed) {
            if (weatherState.data === undefined && !weatherState.pending) {
                mqtt.publish('dash/fetchWeather', '1')
                dispatch(currentWeather())
            }
            if (weatherTimer.timer === undefined) {
                weatherTimer.timer = setInterval(() => {
                    dispatch(currentWeather())
                    mqtt.publish('dash/fetchWeather', '2')
                }, 600000)
            }
            weatherTimer.active++
        }
        return () => {
            weatherTimer.active--
            if (weatherTimer.active === 0) {
                window.clearTimeout(weatherTimer.timer)
                weatherTimer.timer = undefined
            }
        }
    }, [dispatch, weatherState, mqtt])

    return weatherState.data
}

export function useForecastWeather(): ForecastDto | undefined {
    const forecastState = useSelector((state: combinedState) => state.weather.forecast) as ForecastWeather || {
        pending: false,
        data: undefined,
        failed: false,
    }
    const dispatch = useDispatch()
    const mqtt = useMqttClient()

    useEffect(() => {
        if (!forecastState.failed) {
            if (forecastState.data === undefined ) {
                mqtt.publish('dash/fetcForecast', '1')
                dispatch(forecastWeather())
            }
            if (forecastTimer.timer === undefined) {
                forecastTimer.timer = setInterval(() => {
                    mqtt.publish('dash/fetcForecast', '2')
                    dispatch(forecastWeather())
                }, 1800000)
            }
            forecastTimer.active++
        }
        return () => {
            forecastTimer.active--
            if (forecastTimer.active === 0) {
                window.clearTimeout(weatherTimer.timer)
                forecastTimer.timer = undefined
            }
        }
    }, [dispatch, forecastState, mqtt])

    return forecastState.data
}

export function useFailureStatus(): {forecastFailed: boolean, currentWeatherFailed: boolean } {
    const forecastState = useSelector((state: combinedState) => state.weather.forecast) as ForecastWeather
    const currentWeatherState = useSelector((state: combinedState) => state.weather.currentWeather) as CurrentWeather
    return {
        forecastFailed: forecastState.failed,
        currentWeatherFailed: currentWeatherState.failed,
    }
}
