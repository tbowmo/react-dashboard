import { Media, useCapabilities } from '../../core/data'
import * as React from 'react'
import clsx from 'clsx'
import style from './controller.module.scss'

type Props = {
    media: Media,
}

function getTimePast(start_time): number {
    return Math.floor((Date.now() / 1000) - start_time)
}

function secondsToHms(d) {

    const lz = (n: number):string => n>9 ? `${n}` : `0${n}`

    d = Number(d)
    const h = Math.floor(d / 3600)
    const m = Math.floor(d % 3600 / 60)
    const s = Math.floor(d % 3600 % 60)

    return ((h>0)? `${h}:`: '') + `${lz(m)}:${lz(s)}`
}

let timer: ReturnType<typeof setInterval> | undefined = undefined

export function Duration(props: Props) {
    const { media } = props

    const capabilities = useCapabilities()

    const [time, setTime] = React.useState<number>(0)
    const [remaining, setRemaining] = React.useState<boolean>(false)

    React.useEffect(() => {
        if (timer === undefined) {
            setTime(getTimePast(media.start_time))
            timer = setInterval(() => {
                if (capabilities.state === 'PLAYING') {
                    setTime(getTimePast(media.start_time))
                }
            }, 1000)
        }
        return () => {
            clearInterval(timer)
            timer = undefined
        }
    }, [media.start_time, capabilities])

    const { totalTime, currentTime, fontSize, remainingTime } = React.useMemo(() => {
        if (media.duration > 3600) {
            return {
                totalTime: secondsToHms(media.duration),
                currentTime: secondsToHms(time),
                remainingTime: secondsToHms(media.duration - time),
                fontSize: '32pt',
            }
        } else {
            return {
                totalTime: secondsToHms(media.duration),
                currentTime: secondsToHms(time),
                remainingTime: secondsToHms(media.duration - time),
                fontSize: '40pt',
            }
        }
    }, [media.duration, time])

    if (media.duration < 1) {
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
            { capabilities.state === 'PAUSED' ? (
                <div className={style.blink}> PAUSE </div>
            ) : (
                <div style={{ fontSize }}>
                    {currentTime} - {remaining ? remainingTime : `${totalTime}`}
                </div>
            )}
        </div>
    )
}