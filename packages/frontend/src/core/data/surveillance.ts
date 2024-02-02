import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from './use-api'
import { SurveillanceStream } from '@dashboard/types'

export function useSurveillance() {
    const { data } = useSuspenseQuery({
        queryKey: ['surveillance', 'streams'],
        queryFn: () => api<SurveillanceStream[]>('/api/surveillance/streams'),
    })

    return data
}
