import { HomeEntity, StrongHomeEntity } from '@dashboard/types'
import { atomFamily, useRecoilCallback, useRecoilValue } from 'recoil'

export const sseStoreAtom = atomFamily<HomeEntity | undefined, string>({
  key: 'sseStoreAtom',
  default: {},
})

export function useStrongTypedLocation<T extends HomeEntity>(
  room: string,
): StrongHomeEntity<T> {
  return useRecoilValue(sseStoreAtom(room)) as StrongHomeEntity<T>
}

export function useLocation(location: string | undefined) {
  return useRecoilValue(sseStoreAtom(location || ''))
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
