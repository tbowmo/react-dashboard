import React from 'react'
import {
  Album,
  Games,
  MusicNote,
  VideoLabel,
  PowerSettingsNew,
  SvgIconComponent,
} from '@mui/icons-material'
import { Box } from '@mui/material'
import { LightDimmer } from './mqtt-light-dimmer'
import { MqttButton } from './mqtt-button'
import { MqttToggle } from './mqtt-toggle'
import { useSSEString } from '../../core/data'

type Action = {
  label: string
  action: string
  icon: SvgIconComponent
}

const actionList: Action[] = [
  {
    label: 'OFF',
    action: 'off',
    icon: PowerSettingsNew,
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
    label: 'DVD',
    action: 'dvd',
    icon: Album,
  },
  {
    label: 'WII',
    action: 'wii',
    icon: Games,
  },
]

type DeviceProps = {
  legend: string
  icon?: SvgIconComponent
}

const dimmableLights: { [device in string]: DeviceProps } = {
  all: { legend: 'Alt lys' },
  tv: { legend: 'TV' },
  spisebord: { legend: 'Spisebord' },
  corner: { legend: 'Chalottes hjørne' },
  sofabord: { legend: 'Sofabord' },
  sofagruppe: { legend: 'Sofagruppe' },
}

const dumbSwitches: { [device in string]: DeviceProps } = {
  followchrome: {
    legend: 'Følg chromecast',
  },
}

export function Scene() {
  const activeScene = (
    useSSEString('stuen', 'avctrl', 'scene') || ''
  ).toLowerCase()

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gridTemplateRows: 'repeat(3, auto)',
        height: '100%',
      }}
    >
      {actionList.map((action) => (
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
      {Object.entries(dimmableLights).map(([device, deviceProps]) => (
        <LightDimmer key={device} label={deviceProps.legend} device={device} />
      ))}
      {Object.entries(dumbSwitches).map(([device, deviceProps]) => (
        <MqttToggle
          key={device}
          label={deviceProps.legend}
          device={device}
          onPayload
          offPayload={false}
        />
      ))}
      {/* <MqttToggle
        label="Hønsehus"
        device="door"
        room="garden"
        type="chicken"
        onPayload={1}
        offPayload={0}
        iconOn={MeetingRoom}
        iconOff={DoorBack}
      /> */}
    </Box>
  )
}
