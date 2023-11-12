import React from 'react'
import { SvgIconComponent } from '@mui/icons-material'
import { deviceSet, DeviceType } from './device-set'
import { MqttAction } from './mqtt-action'
import { useTabs } from '../../core/tabs'

export type Props = {
  label?: string
  room?: string
  type?: DeviceType
  device: string
  payload: string
  icon?: SvgIconComponent
  active?: boolean
}

export function MqttButton(props: Props) {
    const {
        room = 'stuen',
        type = 'avctrl',
        device,
        payload,
        icon,
        label,
        active,
    } = props
    const [keyActivated, setKey] = React.useState<boolean>(false)

    function click() {
        setKey(true)
        deviceSet(room, type, device, payload)
    }

    const { startTimer } = useTabs()

    React.useEffect(() => {
        let timer: NodeJS.Timeout
        if (keyActivated) {
            timer = setTimeout(() => {
                setKey(false)
                startTimer(500)
            }, 200)
        }
        return () => {
            clearTimeout(timer)
        }
    }, [keyActivated, startTimer])

    return (
        <MqttAction
            onClick={() => click()}
            icon={icon}
            label={label}
            iconColor={active ? '#ff8c00' : '#151515'}
        />
    )
}
