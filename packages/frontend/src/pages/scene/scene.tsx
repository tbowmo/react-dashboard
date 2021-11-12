import style from './scene.module.scss'
import * as React from 'react'
import {
    Album,
    Games,
    MusicNote,
    VideoLabel,
    PowerSettingsNew,
    SvgIconComponent,
    MeetingRoom,
    DoorBack,
} from '@mui/icons-material'
import { LightDimmer } from './mqtt-light-dimmer'
import { MqttButton } from './mqtt-button'
import { MqttToggle } from './mqtt-toggle'
import { useSSEString, useDevices } from '../../core/data'
import clsx from 'clsx'
import { Box, Grid } from '@mui/material'

type Action = {
    label: string,
    action: string,
    icon: SvgIconComponent,
}

const actionList: Action[] = [
    {
        label: 'DVD',
        action: 'dvd',
        icon: Album,
    },
    {
        label: 'WII',
        action: 'wii',
        icon: Games,
    },
    {
        label: 'Musik',
        action: 'audio',
        icon: MusicNote,
    },
    {
        label: 'Video',
        action: 'video',
        icon: VideoLabel,
    },
    {
        label: 'OFF',
        action: 'off',
        icon: PowerSettingsNew,
    },
]

export function Scene() {
    const activeScene = (useSSEString('stuen', 'avctrl', 'scene') || '').toLowerCase()
    const lights = (useDevices('stuen', 'light') || []).sort()
    const switches = (useDevices('stuen', 'switch') || []).sort()
    return (
        <Box sx={{display: 'grid', gridTemplateColumns: 'min-content auto'}}>
            <Box>
                { actionList.map((action) => (
                    <MqttButton
                        active={activeScene.includes(action.action.toLowerCase())}
                        key={action.label}
                        label={action.label}
                        type="avctrl"
                        device="scene"
                        payload={action.action}
                        icon={action.icon}                        
                    />
                ))}
            </Box>
            <Box>
                <Grid container>
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
                    iconOn={MeetingRoom}
                    iconOff={DoorBack}
                />
                </Grid>
            </Box>
        </Box>
    )
}
