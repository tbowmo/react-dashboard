import { useSelector } from 'react-redux'
import { ChromeCast, Room } from '@dashboard/types'
import { RootState } from '../store'

export function useSSEString(
  room: string | undefined,
  deviceType: string | undefined,
  device: string | undefined,
): string | undefined {
  const data = useSelector((state: RootState) => state.sse)
  if (!room || !deviceType || !device) {
    return undefined
  }
  return data[room]?.[deviceType]?.[device]
}

export function useSSENumber(
  room: string | undefined,
  deviceType: string | undefined,
  device: string | undefined,
): number | undefined {
  const value = useSSEString(room, deviceType, device)
  return value ? parseFloat(value) : undefined
}

export function useSSEBoolean(
  room: string | undefined,
  deviceType: string | undefined,
  device: string | undefined,
): boolean | undefined {
  const value = useSSEString(room, deviceType, device)

  try {
    const bool = JSON.parse(value || '0')
    return bool === 1 || bool === '1' || bool || false
  } catch {
    // Empty on purpose
  }

  return undefined
}

export function useChromecast(room = 'stuen'): ChromeCast | undefined {
  const data = useSelector((state: RootState) => state.sse)
  if (data[room]) {
    return (data[room] as Room)?.media
  }
  return undefined
}

export function useDevices(room: string, type: string): string[] {
  const data = useSelector((state: RootState) => state.sse)
  if (data[room] && data[room]?.[type]) {
    return Object.keys(data[room]?.[type])
  }
  return []
}
