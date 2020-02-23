import * as React from 'react'
import style from './scene.module.scss'
import { IconType } from 'react-icons/lib/cjs'
import { useSubscribeBooleanPayload } from '../../core/data'
import clsx from 'clsx'
import {
    FaToggleOff,
    FaToggleOn,
} from 'react-icons/fa'
import { deviceSet, DeviceType } from './device-set'

type Props = {
    className?: string,
    label: string,
    room?: string,
    type?: DeviceType,
    device: string,
    onPayload: boolean | string,
    offPayload: boolean | string,
    iconOn?: IconType,
    iconOff?: IconType,
}

export function MqttToggle(props: Props) {
    const {
        iconOn: IconOn = FaToggleOn,
        iconOff: IconOff = FaToggleOff,
        room = 'stuen',
        type = 'switch',
        device,
    } = props
    const [ active, setActive ] = React.useState(false)

    const currentState = useSubscribeBooleanPayload(room, type, device)

    function onClick() {
        const value = active ? props.offPayload : props.onPayload
        deviceSet(room, type, device, value.toString())
    }

    React.useEffect(() => {
        if (currentState !== undefined) {
            setActive(currentState === props.onPayload)
        }
    }, [currentState, props])

    return (
        <div className={clsx(style.mqttBase, props.className)} onClick={onClick}>
            <div className={clsx(style.center, active && style.active)}>
                { active ? (<IconOn />) : (<IconOff />) }
            </div>
            <div className={style.center}>{props.label}</div>
        </div>
    )
}