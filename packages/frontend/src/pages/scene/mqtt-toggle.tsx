import React from 'react'
import {
    ToggleOff,
    ToggleOn,
    SvgIconComponent,
} from '@mui/icons-material'
import { deviceSet, DeviceType } from './device-set'
import { MqttAction } from './mqtt-action'
import { useSSEBoolean } from '../../core/data'

type Props = {
  label: string
  room?: string
  type?: DeviceType
  device: string
  onPayload: boolean | string | number
  offPayload: boolean | string | number
  iconOn?: SvgIconComponent
  iconOff?: SvgIconComponent
}

export function MqttToggle(props: Props) {
    const {
        iconOn: IconOn = ToggleOn,
        iconOff: IconOff = ToggleOff,
        room = 'stuen',
        type = 'switch',
        device,
        label,
        offPayload,
        onPayload,
    } = props
    const [active, setActive] = React.useState(false)

    const currentState = useSSEBoolean(room, type, device)

    function onClick() {
        const value = active ? offPayload : onPayload
        deviceSet(room, type, device, value.toString())
    }

    React.useEffect(() => {
        if (currentState !== undefined) {
            setActive(currentState === onPayload)
        }
    }, [currentState, onPayload])

    const StateIcon = active ? IconOn : IconOff
    return (
        <MqttAction
            onClick={() => onClick()}
            icon={StateIcon}
            label={label}
            iconColor={active ? '#ff8c00' : '#151515'}
        />
    )
}
