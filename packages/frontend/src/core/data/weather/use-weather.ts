import { CurrentWeatherDto, ForecastDto } from './weather-types'
import { useSelector } from 'react-redux'
import type { CurrentWeather, ForecastWeather } from './weather.slice'
import { RootState, useAppDispatch } from '../store'
import { fetchCurrent, fetchForecast } from './weather.slice'
import { useEffect } from 'react'

type TimerType = {
  timer?: ReturnType<typeof setInterval>
  active: number
}

const weatherTimer: TimerType = {
  active: 0,
}

const forecastTimer: TimerType = {
  active: 0,
}

export function useCurrentWeather(): CurrentWeatherDto | undefined {
  const weatherState = useSelector(
    (state: RootState) => state.weather.currentWeather,
  ) as CurrentWeather

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!weatherState.failed) {
      if (!weatherState.data && !weatherState.pending) {
        dispatch(fetchCurrent())
      }
      if (weatherTimer.timer === undefined) {
        weatherTimer.timer = setInterval(() => {
          dispatch(fetchCurrent())
        }, 600000)
      }
      weatherTimer.active += 1
    }
    return () => {
      weatherTimer.active -= 1
      if (weatherTimer.active === 0 && weatherTimer.timer !== undefined) {
        clearInterval(weatherTimer.timer)
        weatherTimer.timer = undefined
      }
    }
  }, [dispatch, weatherState])

  return weatherState.data
}

export function useForecastWeather(): ForecastDto | undefined {
  const forecastState = useSelector(
    (state: RootState) => state.weather.forecast,
  ) as ForecastWeather

  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!forecastState.failed) {
      if (!forecastState.data && !forecastState.pending) {
        dispatch(fetchForecast())
      }
      if (forecastTimer.timer === undefined) {
        forecastTimer.timer = setInterval(() => {
          dispatch(fetchForecast())
        }, 1800000)
      }
      forecastTimer.active += 1
    }
    return () => {
      forecastTimer.active -= 1
      if (forecastTimer.active === 0 && forecastTimer.timer !== undefined) {
        clearInterval(forecastTimer.timer)
        forecastTimer.timer = undefined
      }
    }
  }, [dispatch, forecastState])

  return forecastState.data
}
