import { HomeEntity, StrongHomeEntity } from '@dashboard/types'
import { atomFamily, useRecoilCallback, useRecoilValue } from 'recoil'

const homeAtom = atomFamily<HomeEntity | undefined, string>({
  key: 'AtomSSE',
  default: {},
})

export function useStrongTypedLocation<T extends HomeEntity>(
  room: string,
): StrongHomeEntity<T> {
  return useRecoilValue(homeAtom(room)) as StrongHomeEntity<T>
}

export function useLocation(location: string | undefined) {
  return useRecoilValue(homeAtom(location || ''))
}

export function useLocationUpdater() {
  return useRecoilCallback(
    ({ set, snapshot }) =>
      async (topic: string, payload: string) => {
        let value = payload
        try {
          value = JSON.parse(payload)
          // eslint-disable-next-line no-empty
        } catch {}

        const [, location, deviceType, device] =
          topic.match(/home\/([\w-]+)\/([\w-]+)\/([\w-]+)/) || []

        const roomState = (await snapshot.getPromise(homeAtom(location))) || {}
        const typeState = roomState[deviceType] || {}

        const locationState = {
          ...roomState,
          [deviceType]: {
            ...typeState,
            [device]: value,
          },
        }

        set(homeAtom(location), locationState)
      },
    [],
  )
}

export function useLoadInitialRoom() {
  return useRecoilCallback(
    ({ set }) =>
      (location: string, value: HomeEntity) => {
        set(homeAtom(location), value)
      },
    [],
  )
}
