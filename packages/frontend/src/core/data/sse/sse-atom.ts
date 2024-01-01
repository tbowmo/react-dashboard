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

export function useUpdateLocation() {
    return useRecoilCallback(
        ({ set, snapshot }) =>
            async (data: SSETopic) => {
                const { room, sensorGroup, sensor } = data
                if (!room || !sensorGroup || !sensor) {
                    return
                }

                let payload = data.payload
                try {
                    payload = JSON.parse(payload)
                    // eslint-disable-next-line no-empty
                } catch { }

                const locator: DeviceLocator = { room, sensorGroup }

                const previousDeviceState = (await snapshot.getPromise(sseStoreAtom(locator))) ?? {}
                if (previousDeviceState[sensor] !== payload) {
                    const newDeviceState = {
                        ...previousDeviceState,
                        [sensor]: payload,
                    }
                    set(sseStoreAtom(locator), newDeviceState)
                }
            },
        [],
    )
}

export function useLoadInitialData() {
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
