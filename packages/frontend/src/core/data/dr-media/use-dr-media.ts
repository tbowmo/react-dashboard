import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../store'
import { fetchDrMedia } from './dr-media.slice'
import { addMinutes, isBefore } from 'date-fns'

export type Media = {
  id: string
  startTime: Date
  endTime: Date
  title: string
  link: string
  type: string
  avatar: string
  duration: number
}

function dateConverter(d: string): Date {
  return new Date(Number(d.match(/(\d+)/)?.[1]))
}

function parseDuration(duration: string): number {
  const regex = /PT(\d+)H((\d+)M)?/
  const m = duration.match(regex)
  if (m) {
    const [, hours, , minutes] = m
    return Number(hours) * 60 + (minutes ? Number(minutes) : 0)
  }
  return 0
}

export function isNotUndefined<T>(input: T): input is Exclude<T, undefined> {
  return input !== undefined
}

export function useDrMedia(): Media[] | undefined {
  const { channels, pending } = useSelector((state: RootState) => state.drMedia)
  const dispatch = useAppDispatch()

  const filteredChannels = useMemo(
    (): Media[] | undefined =>
      channels
        ?.filter(
          (channel) =>
            channel.entries.length > 0 &&
            (!channel.channel.isDistrictChannel ||
              channel.channel.districtName === 'Nordjylland'),
        )
        .map((channel): Media | undefined => {
          const prg = channel.entries?.filter((programme) =>
            isBefore(dateConverter(programme.actualStart), Date.now()),
          )?.[0]
          if (!prg) {
            return undefined
          }
          const startTime = dateConverter(prg.actualStart)
          const duration = parseDuration(prg.duration)
          const endTime = addMinutes(startTime, duration)
          return {
            id: channel.channel.id,
            startTime,
            endTime,
            title: prg.title || channel.channel.title,
            link: channel.channel.mediaAssetsLive.mp3Url,
            avatar: prg.imagesWithRatio[0].url,
            duration,
            type: 'audio',
          }
        })
        .filter(isNotUndefined),
    [channels],
  )

  useEffect(() => {
    if (!filteredChannels?.length) {
      dispatch(fetchDrMedia())
    }
  }, [filteredChannels, pending, dispatch])
  return filteredChannels
}
