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
} from './weather/actions'
import { useEffect } from 'react'

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
        if (!currentWeather.pending) {
            dispatch(fetchCurrentWeatherPending)
            fetch(`${apiUrl}/weather?id=${city}&appid=${apiKey}&lang=da&units=metric`)
                .then((resp) => resp.json())
                .then((data) => dispatch(fetchCurrentWeatherSuccess(data)))
        }
    }
}

function forecastWeather() {
    return (dispatch, getState) => {
        const { weather } = getState()
        const forecastWeather = (weather as WeatherState).forecast
        if (!forecastWeather.pending) {
            dispatch(fetchForecastPending)
            fetch(`${apiUrl}/forecast?id=${city}&appid=${apiKey}&lang=da&units=metric`)
                .then((response) => response.json())
                .then((data) => dispatch(fetchForecastSuccess(data)))
        }
    }
}

export function useCurrentWeather(): CurrentWeatherDto | undefined {
    const weatherState = useSelector((state: combinedState) => state.weather.currentWeather) as CurrentWeather || {
        pending: false,
        data: undefined,
    }
    const dispatch = useDispatch()

    useEffect(() => {
        if (weatherState.data === undefined && !weatherState.pending) {
            dispatch(currentWeather())
        }
        if (weatherTimer.timer === undefined) {
            weatherTimer.timer = setInterval(() => {
                dispatch(currentWeather())
            }, 600000)
        }
        weatherTimer.active++
        return () => {
            weatherTimer.active--
            if (weatherTimer.active === 0) {
                window.clearTimeout(weatherTimer.timer)
                weatherTimer.timer = undefined
            }
        }
    }, [dispatch, weatherState])

    return weatherState.data
}

export function useForecastWeather(): ForecastDto | undefined {
    const forecastState = useSelector((state: combinedState) => state.weather.forecast) as ForecastWeather || {
        pending: false,
        data: undefined,
    }
    const dispatch = useDispatch()

    useEffect(() => {
        if (forecastState.data === undefined ) {
            dispatch(forecastWeather())
        }
        if (forecastTimer.timer === undefined) {
            forecastTimer.timer = setInterval(() => {
                dispatch(forecastWeather())
            }, 1800000)
        }
        forecastTimer.active++
        return () => {
            forecastTimer.active--
            if (forecastTimer.active === 0) {
                window.clearTimeout(weatherTimer.timer)
                forecastTimer.timer = undefined
            }
        }
    }, [dispatch, forecastState])

    return forecastState.data
}
