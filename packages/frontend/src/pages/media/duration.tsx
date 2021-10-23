import { useChromecast } from '../../core/data'
import * as React from 'react'
import clsx from 'clsx'
import style from './media.module.scss'

function secondsToHms(d) {

    const lz = (n: number):string => n>9 ? `${n}` : `0${n}`

    d = Number(d)
    const h = Math.floor(d / 3600)
    const m = Math.floor(d % 3600 / 60)
    const s = Math.floor(d % 3600 % 60)

    return ((h>0)? `${h}:`: '') + `${lz(m)}:${lz(s)}`
}

let timer: ReturnType<typeof setInterval> | undefined = undefined

export function Duration() {

    const media = useChromecast()

    const [time, setTime] = React.useState<number>(0)
    const [remaining, setRemaining] = React.useState<boolean>(false)
    const current_time = media?.media?.current_time

    React.useEffect(() => {
        fetch(`/media/stuen/update`).then(() => {})
    }, [])

    React.useEffect(() => {
        if (timer === undefined) {
            timer = setInterval(() => {
                if (media?.state === 'PLAYING') {
                    setTime(time+1)
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

    const { totalTime, currentTime, fontSize, remainingTime } = React.useMemo(() => {
        if (media?.media?.duration || 0 > 3600) {
            return {
                totalTime: secondsToHms(media?.media?.duration),
                currentTime: secondsToHms(time),
                remainingTime: secondsToHms(media?.media?.duration || 0 - time),
                fontSize: '32pt',
            }
        } else {
            return {
                totalTime: secondsToHms(media?.media?.duration),
                currentTime: secondsToHms(time),
                remainingTime: secondsToHms(media?.media?.duration ||  - time),
                fontSize: '40pt',
            }
        }
    }, [media, time])

    if ((media?.media?.duration || 0) < 1) {
        return null
    }

    function toggleRemaining() {
        setRemaining(!remaining)
    }

    return (
        <div className={clsx(style.time, style.info)} onClick={toggleRemaining}>
            <label className={style.label}>
                Tid
            </label>
            { media?.state === 'PAUSED' ? (
                <div className={style.blink}> PAUSE </div>
            ) : (
                <div style={{ fontSize }}>
                    {currentTime} - {remaining ? remainingTime : `${totalTime}`}
                </div>
            )}
        </div>
    )
}