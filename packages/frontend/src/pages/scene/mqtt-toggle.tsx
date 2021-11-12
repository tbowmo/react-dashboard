import * as React from 'react'
import style from './scene.module.scss'
import { useSSEBoolean } from '../../core/data'
import {
    ToggleOff,
    ToggleOn,
} from '@mui/icons-material'
import { deviceSet, DeviceType } from './device-set'
import { GridCard } from '../../core/card-2-line/grid-card'
import { CardContent, Box, Typography } from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'

type Props = {
    className?: string,
    label: string,
    room?: string,
    type?: DeviceType,
    device: string,
    onPayload: boolean | string | number,
    offPayload: boolean | string | number,
    iconOn?: SvgIconComponent,
    iconOff?: SvgIconComponent,
}

export function MqttToggle(props: Props) {
    const {
        iconOn: IconOn = ToggleOn,
        iconOff: IconOff = ToggleOff,
        room = 'stuen',
        type = 'switch',
        device,
    } = props
    const [ active, setActive ] = React.useState(false)

    const currentState = useSSEBoolean(room, type, device)

    function onClick() {
        const value = active ? props.offPayload : props.onPayload
        deviceSet(room, type, device, value.toString())
    }

    React.useEffect(() => {
        if (currentState !== undefined) {
            setActive(currentState === props.onPayload)
        }
    }, [currentState, props])

    const StateIcon = active ? IconOn : IconOff
    return (
        <GridCard onClick={onClick} xs>
            <CardContent>
            <StateIcon fontSize="large" />
            <Typography>{props.label}</Typography>
            </CardContent>
        </GridCard>
    )
}