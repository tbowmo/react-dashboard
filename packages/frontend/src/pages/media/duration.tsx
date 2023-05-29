import React from 'react'
import { Typography } from '@mui/material'
import { keyframes } from '@mui/system'
import { Media, Capabilities } from '@dashboard/types'
import { MediaCard } from './media-card'

function secondsToHms(seconds: number) {
    const lz = (n: number): string => (n > 9 ? `${n}` : `0${n}`)

    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor((seconds % 3600) % 60)
    const hour = h > 0 ? `${h}:` : ''
    return `${hour}${lz(m)}:${lz(s)}`
}

let timer: ReturnType<typeof setInterval> | undefined

const blink = keyframes`
    0%{opacity: 0;}
    25%{opacity: .5;}
    50%{opacity: 1;}
    75%{opacity: .5;}
    100%{opacity: 0;}
`

export function Duration(props: {
  media: Pick<Media, 'current_time' | 'duration'>
  state: Capabilities['state']
}) {
    const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
        media: { current_time, duration },
        state,
    } = props

    const [time, setTime] = React.useState<number>(0)
    const [remaining, setRemaining] = React.useState<boolean>(false)

    React.useEffect(() => {
        fetch('/media/stuen/update')
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
    }, [state, setTime, time])

    React.useEffect(() => {
        setTime(current_time || 0)
    }, [current_time])

    const { totalTime, currentTime, fontSize, remainingTime } =
    React.useMemo(() => {
        return {
            totalTime: secondsToHms(duration),
            currentTime: secondsToHms(time),
            remainingTime: secondsToHms((duration || 0) - time),
            fontSize: duration || 0 > 3600 ? '32pt' : '40pt',
        }
    }, [duration, time])

    if ((duration || 0) < 1) {
        return null
    }

    function toggleRemaining() {
        setRemaining(!remaining)
    }

    const remainingOrTotal = remaining ? remainingTime : totalTime

    return (
        <MediaCard onClick={() => toggleRemaining()} label="Tid">
            <Typography
                align="center"
                gutterBottom={false}
                sx={{
                    animation:
            state === 'PAUSED' ? `${blink} 2s linear infinite` : undefined,
                    fontSize,
                    fontFamily: 'Orbitron, serif',
                }}
            >
                {state === 'PAUSED'
                    ? 'PAUSE'
                    : `${currentTime} - ${remainingOrTotal}`}
            </Typography>
        </MediaCard>
    )
}
