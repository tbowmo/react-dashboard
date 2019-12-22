import style from './scene.module.scss'
import * as React from 'react'
import { IconType } from 'react-icons/lib/cjs'
import {
    MdAlbum,
    MdGames,
    MdMusicNote,
    MdVideoLabel,
    MdPowerSettingsNew,
} from 'react-icons/md'
import { LightDimmer } from './mqtt-light-dimmer'
import { MqttButton } from './mqtt-button'

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
    return (
        <div className={style.scene}>
            <div className={style.remote}>
                { actionList.map((action) => (
                    <MqttButton
                        key={action.label}
                        label={action.label}
                        mqttTopic="avctrl/in/scene"
                        mqttPayload={action.action}
                        icon={action.icon}
                    />
                ))}
            </div>
            <div className={style.lights}>
                <LightDimmer label="sofabord" mqttTopic="sofabord" />
                <LightDimmer label="spisebord" mqttTopic="spisebord" />
                <LightDimmer label="fjernsyn" mqttTopic="tv" />
                <LightDimmer label="Alt stuen" mqttTopic="all" />
            </div>
        </div>
    )
}
