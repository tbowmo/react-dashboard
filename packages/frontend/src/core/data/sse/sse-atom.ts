import {
    StrongDevice,
    Device,
    Misc,
} from '@dashboard/types'
import {
    RecoilState,
    atomFamily,
    useRecoilCallback,
    useRecoilValue,
} from 'recoil'

type DeviceLocator = { location: string, deviceType: string}

const sseStoreAtom = atomFamily<Device | undefined, DeviceLocator>({
    key: 'sseStoreAtom',
    default: {},
})

export function strongStore<T extends Device = Misc>(location: string, deviceType: string) {
    return sseStoreAtom({ location, deviceType }) as RecoilState<StrongDevice<T> | undefined>
}

export function useStrongTypedDevices<T extends Device>(
    room: string,
    type: string,
): StrongDevice<T> | undefined {
    return useRecoilValue(strongStore<T>(room, type))
}

export function useLocation(location: string | undefined, deviceType: string | undefined) {
    const locator: DeviceLocator = {
        location: location ?? '',
        deviceType: deviceType ?? '',
    }
    return useRecoilValue(sseStoreAtom(locator))
}

export function useLocationUpdater() {
    return useRecoilCallback(
        ({ set, snapshot }) =>
            async (data: { topic: string; payload: string }) => {
                let value = data.payload
                try {
                    value = JSON.parse(data.payload)
                    // eslint-disable-next-line no-empty
                } catch { }

                const [, location, deviceType, device] =
                    data.topic.match(/home\/([\w-]+)\/([\w-]+)\/([\w-]+)/) || []
                const locator: DeviceLocator = { location, deviceType }

                const deviceTypeState =
                    (await snapshot.getPromise(sseStoreAtom(locator))) || {}

                const newDeviceTypeState = {
                    ...deviceTypeState,
                    [device]: value,
                }
                set(sseStoreAtom(locator), newDeviceTypeState)
            },
        [],
    )
}

export function useLoadInitialRoom() {
    return useRecoilCallback(
        ({ set }) =>
            (data: Record<string, object>) => {
                for (const location of Object.keys(data)) {
                    for (const deviceType of Object.keys(data[location])) {
                        set(sseStoreAtom({ location, deviceType }), data[location][deviceType])
                    }
                }
            },
        [],
    )
}
