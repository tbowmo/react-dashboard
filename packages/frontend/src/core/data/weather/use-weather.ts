import { CurrentWeatherDto, ForecastDto } from './weather-types'
import { api } from '../use-api'
import { useSuspenseQuery } from '@tanstack/react-query'
import { time } from '../../time-constants'

export function useCurrentWeather(): CurrentWeatherDto | undefined {
    const { data } = useSuspenseQuery({
        queryKey: ['weathcer', 'current'],
        queryFn: () => api<CurrentWeatherDto>('/weather/current'),
        refetchInterval: 10 * time.minute,
    })

    return data
}

export function useForecastWeather(): ForecastDto | undefined {
    const { data } = useSuspenseQuery({
        queryKey: ['weather', 'forecast'],
        queryFn: () => api<ForecastDto>('/weather/forecast'),
        refetchInterval: 30 * time.minute,
    })

    return data
}
