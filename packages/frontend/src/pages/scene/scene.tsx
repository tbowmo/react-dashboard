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
import {
    FaDoorOpen,
    FaDoorClosed,
} from 'react-icons/fa'
import { LightDimmer } from './mqtt-light-dimmer'
import { MqttButton } from './mqtt-button'
import { MqttToggle } from './mqtt-toggle'
import { useSubscribeStringPayload, useDevices } from '../../core/data'
import clsx from 'clsx'

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
    const activeScene = (useSubscribeStringPayload('stuen', 'avctrl', 'scene') || '').toLowerCase()
    const lights = (useDevices('stuen', 'light') || []).sort()
    const switches = (useDevices('stuen', 'switch') || []).sort()
    return (
        <div className={style.scene}>
            <div className={style.remote}>
                { actionList.map((action) => (
                    <MqttButton
                        className={clsx(((activeScene.includes(action.action.toLowerCase())) && style.activeDevice) )}
                        key={action.label}
                        label={action.label}
                        type="avctrl"
                        device="scene"
                        payload={action.action}
                        icon={action.icon}
                    />
                ))}
            </div>
            <div className={style.lights}>
                {lights.map((device) => (
                    <LightDimmer key={device} label={device} device={device} />
                ))}
                {switches.map((device) => (
                    <MqttToggle
                        key={device}
                        label="Auto lys"
                        device={device}
                        onPayload={true}
                        offPayload={false}
                    />
                ))}
                <MqttToggle
                    label="Hønsehus"
                    device="door"
                    room="garden"
                    type="chicken"
                    onPayload={1}
                    offPayload={0}
                    iconOn={FaDoorOpen}
                    iconOff={FaDoorClosed}
                />
            </div>
        </div>
    )
}
