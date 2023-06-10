import {
    HomeEntity,
    StrongHomeEntity,
    Global,
} from '@dashboard/types'
import {
    RecoilState,
    atomFamily,
    useRecoilCallback,
    useRecoilValue,
} from 'recoil'

const sseStoreAtom = atomFamily<HomeEntity | undefined, string>({
    key: 'sseStoreAtom',
    default: {},
})

export function strongStore<T extends HomeEntity = Global>(room: string) {
    return sseStoreAtom(room) as RecoilState<StrongHomeEntity<T> | undefined>
}

export function useStrongTypedLocation<T extends HomeEntity>(
    room: string,
): StrongHomeEntity<T> | undefined {
    return useRecoilValue(strongStore<T>(room))
}

export function useLocation(location: string | undefined) {
    return useRecoilValue(sseStoreAtom(location ?? ''))
}

export function useLocationUpdater() {
    return useRecoilCallback(
        ({ set, snapshot }) =>
            async (data: { topic: string; payload: string }) => {
                let value = data.payload
                try {
                    value = JSON.parse(data.payload)
                    // eslint-disable-next-line no-empty
                } catch {}

                const [, location, deviceType, device] =
          data.topic.match(/home\/([\w-]+)\/([\w-]+)\/([\w-]+)/) || []

                const roomState =
          (await snapshot.getPromise(sseStoreAtom(location))) || {}
                const typeState = roomState[deviceType] || {}

                const locationState = {
                    ...roomState,
                    [deviceType]: {
                        ...typeState,
                        [device]: value,
                    },
                }

                set(sseStoreAtom(location), locationState)
            },
        [],
    )
}

export function useLoadInitialRoom() {
    return useRecoilCallback(
        ({ set }) =>
            (data: Record<string, object>) => {
                for (const location of Object.keys(data)) {
                    set(sseStoreAtom(location), data[location])
                }
            },
        [],
    )
}
