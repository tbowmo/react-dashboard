import { useEffect } from 'react'
import {
  atom,
  DefaultValue,
  selector,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil'
import { CurrentWeatherDto, ForecastDto } from './weather-types'
import { api } from '../use-api'

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

const forecastTrigger = atom<number>({
  key: 'forecastTrigger',
  default: 0,
})

const forecastSelector = selector<ForecastDto>({
  key: 'ForecastSelector',
  get: ({ get }) => {
    get(forecastTrigger)
    return api<ForecastDto>('/weather/forecast')
  },
  set: ({ set }, value) => {
    if (value instanceof DefaultValue) {
      set(forecastTrigger, (v) => v + 1)
    }
  },
})

const weatherTrigger = atom<number>({
  key: 'weatherTrigger',
  default: 0,
})

const weatherSelector = selector<CurrentWeatherDto>({
  key: 'WeatherSelector',
  get: ({ get }) => {
    get(weatherTrigger)
    return api<CurrentWeatherDto>('/weather/current')
  },
  set: ({ set }, value) => {
    if (value instanceof DefaultValue) {
      set(weatherTrigger, (v) => v + 1)
    }
  },
})

export function useCurrentWeather(): CurrentWeatherDto | undefined {
  const weather = useRecoilValue(weatherSelector)
  const resetWeather = useResetRecoilState(weatherSelector)

  useEffect(() => {
    if (weatherTimer.timer === undefined) {
      weatherTimer.timer = setInterval(() => {
        resetWeather()
      }, 600000)
    }
    weatherTimer.active += 1
    return () => {
      weatherTimer.active -= 1
      if (weatherTimer.active === 0 && weatherTimer.timer !== undefined) {
        clearInterval(weatherTimer.timer)
        weatherTimer.timer = undefined
      }
    }
  }, [resetWeather])

  return weather
}

export function useForecastWeather(): ForecastDto | undefined {
  const forecast = useRecoilValue(forecastSelector)
  const resetForecast = useResetRecoilState(forecastSelector)

  useEffect(() => {
    if (forecastTimer.timer === undefined) {
      forecastTimer.timer = setInterval(() => {
        resetForecast()
      }, 1800000)
    }
    forecastTimer.active += 1
    return () => {
      forecastTimer.active -= 1
      if (forecastTimer.active === 0 && forecastTimer.timer !== undefined) {
        clearInterval(forecastTimer.timer)
        forecastTimer.timer = undefined
      }
    }
  }, [resetForecast])

  return forecast
}
