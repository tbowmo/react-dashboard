import style from './scene.module.scss'
import * as React from 'react'
import { useMqttClient } from '../../core/data'
import { Card } from '../../core/card/card'
import { IconType } from 'react-icons/lib/cjs'
import {
    MdAlbum,
    MdGames,
    MdMusicNote,
    MdVideoLabel,
    MdPowerSettingsNew,
} from 'react-icons/md'
import history from '../../history'
import { LightDimmer } from './mqtt-light-dimmer'

type Action = {
    label: string,
    action: string,
    icon: IconType,
}

const actionList: Action[] = [
    {
        label: 'DVD', 
        action: 'dvd', 
        icon: MdAlbum,
    },
    {
        label: 'WII', 
        action: 'wii', 
        icon: MdGames,
    },
    {
        label: 'Musik', 
        action: 'audio',
        icon: MdMusicNote,
    },
    {
        label: 'Video', 
        action: 'video', 
        icon: MdVideoLabel,
    },
    {
        label: 'OFF',
        action: 'off',
        icon: MdPowerSettingsNew,
    },
]

export function Scene() {
    const [ key, setKey ] = React.useState<string>('')
    const mqtt = useMqttClient()

    function click(action: Action) {
        setKey(action.action)
        mqtt.publish('avctrl/in/scene', action.action)
    } 

    React.useEffect(() => {
        if (key !== '') {
            setTimeout(() => {
                setKey('')
                history.replace('/')
            }, 200)
        }
    }, [key, setKey])

    return (
        <div className={style.scene}>
            { actionList.map((action) => (
                <Card key={action.action} className={`${style.device} ` + (action.action === key ? style.active : '')} onClick={() => click(action)}>
                    {action.label} <br />
                    <action.icon />
                </Card>
            ))}
            <LightDimmer label="test" mqttPath="test" />
        </div>
    )
}