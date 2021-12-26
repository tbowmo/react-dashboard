import { useApi } from './use-api'
import axios from 'axios'

type Programme = {
  id: number
  title: string
  start: Date
  end: Date
  description: string
  category: string
}

export type StreamDto = {
  name: string
  xmlid: string
  link: string
  type: string
  icon: string
  programmes: Programme[]
}

export function useStreams(type: 'radio' | 'tv'): StreamDto[] | undefined {
  const result = useApi<StreamDto[]>(() => {
    return axios.get(`/channels/list/${type}`)
  }, [type])

  return result.result
}
