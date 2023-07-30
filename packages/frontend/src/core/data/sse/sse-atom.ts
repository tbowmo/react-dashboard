import {
    StrongDevice,
    Device,
    Misc,
    SSETopic,
} from '@dashboard/types'
import {
    RecoilState,
    atomFamily,
    useRecoilCallback,
    useRecoilValue,
} from 'recoil'

type DeviceLocator = Pick<SSETopic, 'room' | 'sensorGroup'>

const sseStoreAtom = atomFamily<Device | undefined, DeviceLocator>({
    key: 'sseStoreAtom',
    default: {},
})

export function strongStore<T extends Device = Misc>(room: string, sensorGroup: string) {
    return sseStoreAtom({ room, sensorGroup }) as RecoilState<StrongDevice<T> | undefined>
}

export function useStrongTypedDevices<T extends Device>(
    room: string,
    type: string,
): StrongDevice<T> | undefined {
    return useRecoilValue(strongStore<T>(room, type))
}

export function useLocation(room: string | undefined, sensorGroup: string | undefined) {
    const locator: DeviceLocator = {
        room: room ?? '',
        sensorGroup: sensorGroup ?? '',
    }
    return useRecoilValue(sseStoreAtom(locator))
}

export function useLocationUpdater() {
    return useRecoilCallback(
        ({ set, snapshot }) =>
            async (data: SSETopic) => {
                let value = data.payload
                try {
                    value = JSON.parse(data.payload)
                    // eslint-disable-next-line no-empty
                } catch { }

                const { room, sensorGroup, sensor } = data
                if (!room || !sensorGroup || !sensor) {
                    return
                }

                const locator: DeviceLocator = { room, sensorGroup }

                const deviceTypeState = (await snapshot.getPromise(sseStoreAtom(locator))) || {}

                const newDeviceTypeState = {
                    ...deviceTypeState,
                    [sensor]: value,
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
                for (const room of Object.keys(data)) {
                    for (const sensorGroup of Object.keys(data[room])) {
                        set(sseStoreAtom({ room, sensorGroup }), data[room][sensorGroup])
                    }
                }
            },
        [],
    )
}
