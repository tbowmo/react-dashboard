import * as React from 'react'
import { Typography } from '@mui/material'
import { keyframes } from '@mui/system'
import { MediaCard } from './media-card'
import { Chromecast } from '@dashboard/types'

function secondsToHms(d) {
  const lz = (n: number): string => (n > 9 ? `${n}` : `0${n}`)

  d = Number(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)

  return (h > 0 ? `${h}:` : '') + `${lz(m)}:${lz(s)}`
}

let timer: ReturnType<typeof setInterval> | undefined = undefined

const blink = keyframes`
    0%{opacity: 0;}
    25%{opacity: .5;}
    50%{opacity: 1;}
    75%{opacity: .5;}
    100%{opacity: 0;}
`

export function Duration(props: {
  media: Chromecast.Media
  state: Chromecast.Capabilities['state']
}) {
  const { media, state } = props

  const [time, setTime] = React.useState<number>(0)
  const [remaining, setRemaining] = React.useState<boolean>(false)
  const current_time = media.current_time

  React.useEffect(() => {
    fetch(`/media/stuen/update`).then(() => {})
  }, [])

  React.useEffect(() => {
    if (timer === undefined) {
      timer = setInterval(() => {
        if (state === 'PLAYING') {
          setTime(time + 1)
        }
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
        timer = undefined
      }
    }
  }, [media, setTime, time])

  React.useEffect(() => {
    setTime(current_time || 0)
  }, [current_time])

  const { totalTime, currentTime, fontSize, remainingTime } =
    React.useMemo(() => {
      return {
        totalTime: secondsToHms(media.duration),
        currentTime: secondsToHms(time),
        remainingTime: secondsToHms(media.duration || 0 - time),
        fontSize: media.duration || 0 > 3600 ? '32pt' : '40pt',
      }
    }, [media, time])

  if ((media.duration || 0) < 1) {
    return null
  }

  function toggleRemaining() {
    setRemaining(!remaining)
  }

  return (
    <MediaCard onClick={toggleRemaining} label="Tid">
      <Typography
        align="center"
        gutterBottom={false}
        sx={{
          animation:
            state === 'PAUSED' ? `${blink} 2s linear infinite` : undefined,
          fontSize,
        }}
      >
        {state === 'PAUSED'
          ? 'PAUSE'
          : `${currentTime} - ${remaining ? remainingTime : totalTime}`}
      </Typography>
    </MediaCard>
  )
}
