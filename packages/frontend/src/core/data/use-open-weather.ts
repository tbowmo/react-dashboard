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

// const apiUrl = 'https://api.openweathermap.org/data/2.5'
// const apiKey = process.env.REACT_APP_OW_KEY
// const city = process.env.REACT_APP_OW_CITYID
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

        // Ensure that we do not flood OWM with requests
        const secondsSinceLast = Math.round((new Date()).getTime() / 1000) - currentWeather.lastFetchTime
        const secondsBeforeRefetch = 300

        if (!currentWeather.pending && secondsSinceLast > secondsBeforeRefetch) { 
            dispatch(fetchCurrentWeatherPending)
            fetch('/weather/current')
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

        // Ensure that we do not flood OWM with requests
        const secondsSinceLast = Math.round((new Date()).getTime() / 1000) - forecastWeather.lastFetchTime
        const secondsBeforeRefetch = 900
        
        if (!forecastWeather.pending && secondsSinceLast > secondsBeforeRefetch) {
            dispatch(fetchForecastPending)
            fetch('/weather/forecast')
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

    useEffect(() => {
        if (!weatherState.failed) {
            if (weatherState.data === undefined && !weatherState.pending) {
                dispatch(currentWeather())
            }
            if (weatherTimer.timer === undefined) {
                weatherTimer.timer = setInterval(() => {
                    dispatch(currentWeather())
                }, 600000)
            }
            weatherTimer.active++
        }
        return () => {
            weatherTimer.active--
            if (weatherTimer.active === 0 && weatherTimer.timer !== undefined) {
                clearInterval(weatherTimer.timer)
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
        failed: false,
    }
    const dispatch = useDispatch()

    useEffect(() => {
        if (!forecastState.failed) {
            if (forecastState.data === undefined ) {
                dispatch(forecastWeather())
            }
            if (forecastTimer.timer === undefined) {
                forecastTimer.timer = setInterval(() => {
                    dispatch(forecastWeather())
                }, 1800000)
            }
            forecastTimer.active++
        }
        return () => {
            forecastTimer.active--
            if (forecastTimer.active === 0 && forecastTimer.timer !== undefined) {
                clearInterval(forecastTimer.timer)
                forecastTimer.timer = undefined
            }
        }
    }, [dispatch, forecastState])

    return forecastState.data
}

export function useWeatherFailure(): {forecastFailed: boolean, currentWeatherFailed: boolean } {
    const { failed: forecastFailed } = useSelector((state: combinedState) => state.weather.forecast) as ForecastWeather || {
        failed: false,
    }
    const { failed: currentWeatherFailed } = useSelector((state: combinedState) => state.weather.currentWeather) as CurrentWeather || {
        failed: false,
    }

    return {
        forecastFailed,
        currentWeatherFailed,
    }
}
