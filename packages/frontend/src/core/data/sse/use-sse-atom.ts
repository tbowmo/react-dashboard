import { ChromeCast } from '@dashboard/types'
import { useLocation, useStrongTypedDevices } from './sse-atom'

export function useSSEString(
    room: string | undefined,
    deviceType: string | undefined,
    device: string | undefined,
): string | undefined {
    const data = useLocation(room, deviceType)
    if (!room || !deviceType || !device) {
        return undefined
    }

    return data?.[device]?.toString()
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

export function useChromeCast(room = 'stuen'): ChromeCast | undefined {
    return useStrongTypedDevices<ChromeCast>(room, 'media')
}

export function useDevices(room: string, type: string): string[] {
    const data = useLocation(room, type)
    if (data) {
        return Object.keys(data)
    }
    return []
}
