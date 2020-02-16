import * as React from 'react'
import {
    MdFastRewind,
    MdFastForward,
    MdPause,
    MdPowerSettingsNew,
    MdVolumeDown,
    MdVolumeUp,
    MdPlayArrow,
} from 'react-icons/md'
import { IconType } from 'react-icons/lib/cjs'
import style from './controller.module.scss'
import clsx from 'clsx'
import { useChromecast } from '../../core/data'

type controlKey = {
    icon: IconType,
    key: string,
    state: 'ALL' | 'PAUSED' | 'PLAYING',
    repeat?: boolean,
}

const functions: controlKey[] = [
    {
        icon: MdVolumeUp,
        key: 'volumeup',
        state: 'ALL',
        repeat: true,
    },
    {
        icon: MdVolumeDown,
        key : 'volumedown',
        state: 'ALL',
        repeat: true,
    },
    {
        icon: MdFastRewind,
        key: 'prev',
        state: 'ALL',
    },
    {
        icon: MdPause,
        key: 'pause',
        state: 'PLAYING',
    },
    {
        icon: MdPlayArrow,
        key: 'play',
        state: 'PAUSED',
    },
    {
        icon: MdFastForward,
        key: 'next',
        state: 'ALL',
    },
    {
        icon: MdPowerSettingsNew,
        key: 'off',
        state: 'ALL',
    },
]

let repeatIntervalTimer: ReturnType<typeof setInterval> | undefined

function stopInterval() {
    if (repeatIntervalTimer) {
        clearInterval(repeatIntervalTimer)
        repeatIntervalTimer = undefined
    }
}

export function Remote() {
    const [ activeKey, setActiveKey ] = React.useState<string>('')
    const [ repeat, setRepeat ] = React.useState<controlKey | undefined>(undefined)

    const capabilities = useChromecast('stuen')

    function buttonDown(target: controlKey) {
        setRepeat(target)
        setActiveKey(target.key)
        fetch(`/remote/stuen/${target.key}`).then(() => {})
    }

    function buttonRelease() {
        setRepeat(undefined)
    }

    React.useEffect(() => {
        if (
            repeat?.repeat 
            && repeatIntervalTimer === undefined
        ) {
            repeatIntervalTimer = setInterval( () => {
                setActiveKey(repeat.key)
                fetch(`/remote/stuen/${repeat.key}`).then(() => {})
            }, 400)
        } else {
            stopInterval()
        }
        return () => stopInterval()
    }, [repeat, setActiveKey])

    React.useEffect(() => {
        if (activeKey !== '') {
            setTimeout(() => setActiveKey(''), 200)
        }
    }, [activeKey, setActiveKey])
 
    return (
        <div className={style.remoteControl}>
            { functions.filter((link) => {
                return link.state === 'ALL' || link.state === capabilities?.state || ''
            }).map((link) => (
                <div 
                    key={link.key}
                    className={clsx(style.remoteButton, (link.key === activeKey) && style.active)}
                    onTouchStart={() => buttonDown(link)}
                    onTouchEnd={() => buttonRelease()}
                    onMouseDown={() => buttonDown(link)}
                    onMouseUp={() => buttonRelease()}
                >
                    <div className={style.center}>
                        <link.icon />
                    </div>
                </div>
            ))}
        </div>
    )
}