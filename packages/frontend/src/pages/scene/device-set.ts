export type DeviceType = 'light' | 'switch' | 'chicken' | 'avctrl'

export function deviceSet(room: string, deviceType: 'light' | 'switch' | 'chicken' | 'avctrl', device: string, value: string) {
    fetch(`/deviceSet/${room}/${deviceType}/${device}/${value}`)
}
