import { Media, useCapabilities } from '../../core/data'
import * as React from 'react'
import clsx from 'clsx'
import moment from 'moment'
import style from './controller.module.scss'

type Props = {
    media: Media,
}

function getTimePast(start_time): number {
    return Math.floor((new Date()).getTime() / 1000 - start_time)
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
                totalTime: moment.unix(media.duration).format('HH:mm:ss'),
                currentTime: moment.unix(time).format('HH:mm:ss'),
                remainingTime: moment.unix(media.duration - time).format('HH:mm:ss'),
                fontSize: '25pt',
            }
        } else {
            return {
                totalTime: moment.unix(media.duration).format('mm:ss'),
                currentTime: moment.unix(time).format('mm:ss'),
                remainingTime: moment.unix(media.duration - time).format('mm:ss'),
                fontSize: '30pt',
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
                Tid {remaining ? 'tilbage' : ''}
            </label>
            { capabilities.state === 'PAUSED' ? (
                <div className={style.blink}> PAUSE </div>
            ) : (
                <div style={{ fontSize }}>
                    {remaining ? remainingTime : `${currentTime} - ${totalTime}`}
                </div>
            )}
        </div>
    )
}