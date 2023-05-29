export type DeviceType = 'light' | 'switch' | 'chicken' | 'avctrl'

export function deviceSet(
    room: string,
    deviceType: DeviceType,
    device: string,
    value: string,
) {
    fetch(`/deviceSet/${room}/${deviceType}/${device}/${value}`)
}
