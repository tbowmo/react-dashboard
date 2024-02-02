import { CurrentWeatherDto, ForecastDto } from './weather-types'
import { api } from '../use-api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { time } from '../../time-constants'

export function useCurrentWeather(): CurrentWeatherDto | undefined {
    const { data } = useSuspenseQuery({
        queryKey: ['weather', 'current'],
        queryFn: () => api<CurrentWeatherDto>('/api/weather/current'),
        refetchInterval: 10 * time.minute,
    })

    return data
}

export function useForecastWeather(): ForecastDto | undefined {
    const { data } = useSuspenseQuery({
        queryKey: ['weather', 'forecast'],
        queryFn: () => api<ForecastDto>('/api/weather/forecast'),
        refetchInterval: 30 * time.minute,
    })

    return data
}
