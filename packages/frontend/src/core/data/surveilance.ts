import { useSuspenseQuery } from '@tanstack/react-query'
import { api } from './use-api'
import { SurveilanceStream } from '@dashboard/types'

export function useSurveilance() {
    const { data } = useSuspenseQuery({
        queryKey: ['sureveilance', 'streams'],
        queryFn: () => api<SurveilanceStream[]>('/surveilance/streams'),
    })

    return data
}
