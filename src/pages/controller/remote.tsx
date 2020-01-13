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
import { useMqttClient, useCapabilities } from '../../core/data'

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

let interVal: any

export function Remote() {
    const [ key, setKey ] = React.useState<string>('')
    const [ repeat, setRepeat ] = React.useState<string>('')

    const mqttClient = useMqttClient()
    const capabilities = useCapabilities()
    
    function onMouseDown(target: controlKey) {
        if (target.repeat) {
            setRepeat(target.key)
        }
    }

    function onMouseUp(target: controlKey) {
        if (target.repeat) {
            setRepeat('')
        } else {
            setKey(target.key)
            if (mqttClient && !target.repeat) {
                if (target.key === 'off') {
                    mqttClient.publish('avctrl/in/scene', target.key)
                } else {
                    mqttClient.publish('avctrl/in/control', target.key)
                }
            }
        }

    }

    React.useEffect(() => {
        if (mqttClient && repeat !== '') {
            mqttClient.publish('avctrl/in/control', repeat)   
            setKey(repeat)  
            interVal = setInterval( () => {
                mqttClient.publish('avctrl/in/control', repeat)   
                setKey(repeat)  
            }, 300)
        } else {
            clearInterval(interVal)
        }
        return () => {
            clearInterval(interVal)
        }
    }, [repeat, mqttClient])

    React.useEffect(() => {
        if (key !== '') {
            setTimeout(() => {setKey('')}, 200)
        }
    }, [key, setKey])
 
    return (
        <div className={style.remoteControl}>
            { functions.filter((link) => {
                return link.state === 'ALL' || link.state === capabilities.state
            }).map((link) => (
                <div 
                    key={link.key}
                    className={clsx(style.remoteButton, (link.key === key) && style.active)}
                    //onClick={() => onClick(link)}
                    onMouseDown={() => onMouseDown(link)}
                    onMouseUp={() => onMouseUp(link)}
                >
                    <div className={style.center}>
                        <link.icon />
                    </div>
                </div>
            ))}
        </div>
    )
}