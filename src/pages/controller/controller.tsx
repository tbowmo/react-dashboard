import * as React from 'react'
import style from './controller.module.scss'
import {
    MdFastRewind,
    MdFastForward,
    MdPause,
    MdPowerSettingsNew,
    MdVolumeDown,
    MdVolumeUp,
} from 'react-icons/md'
import {
    useCapabilities,
    useMedia,
    useMqttClient,
    useSubscribeStringPayload,
} from '../../core/data/'
import { Weather } from '../weather/weather'
import { IconType } from 'react-icons/lib/cjs'
import { Music } from './music'
import { RadioTv } from './radio-tv'

type controlKey = {
    icon: IconType,
    key: string,
}

const functions: controlKey[] = [
    {
        icon: MdVolumeUp,
        key: 'volumeup',
    },
    {
        icon: MdVolumeDown,
        key : 'volumedown',
    },
    {
        icon: MdFastRewind,
        key: 'prev',
    },
    {
        icon: MdPause,
        key: 'pause',
    },
    {
        icon: MdFastForward,
        key: 'next',
    },
    {
        icon: MdPowerSettingsNew,
        key: 'off',
    },
]

export function Controller() {
    const [ key, setKey ] = React.useState<string>('')

    const mqttClient = useMqttClient()

    function onClick(target: controlKey) {
        setKey(target.key)
        if (mqttClient) {
            if (target.key === 'off') {
                mqttClient.publish('avctrl/in/scene', target.key)
            } else {
                mqttClient.publish('avctrl/in/control', target.key)
            }
        }
    }

    React.useEffect(() => {
        if (key !== '') {
            setTimeout(() => {setKey('')}, 200)
        }
    }, [key, setKey])
    const media = useMedia()
    const capabilities = useCapabilities()
    const avcenter = useSubscribeStringPayload('avctrl/out/scene') || ''

    if (media === undefined || capabilities === undefined) {
        return null
    }
    
    if (avcenter.toLocaleLowerCase() === 'off') {   
        return (
            <Weather />
        )
    }

    return (
        <div className={style.controller}>
            <div 
                className={style.mediaInfo} 
                style={{ 
                    backgroundImage: `url(${capabilities.app_icon})`, 
                    backgroundSize: '50px 50px', 
                    backgroundRepeat: 'no-repeat',
                }}
            >
                <div className={style.albumCover}>
                    <img src={media.album_art || capabilities.app_icon} alt={media.album} />
                </div>
                { media.type === 0 ? (<Music media={media} />) : (<RadioTv media={media} />) }
            </div>
            <div className={style.remoteControl}>
                { functions.map((link) => (
                    <div key={link.key} className={`${style.remoteButton} ` + (link.key === key ? style.active : '')} onClick={() => onClick(link)}>
                        <div className={style.center}>
                            <link.icon />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
