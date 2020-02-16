import * as React from 'react'
import style from './scene.module.scss'
import { IconType } from 'react-icons/lib/cjs'
import { useSubscribeBooleanPayload } from '../../core/data'
import clsx from 'clsx'
import {
    FaToggleOff,
    FaToggleOn,
} from 'react-icons/fa'

type Props = {
    className?: string,
    label: string,
    room?: string,
    device: string,
    onPayload: boolean,
    offPayload: boolean,
    iconOn?: IconType,
    iconOff?: IconType,
}

export function MqttToggle(props: Props) {
    const {
        iconOn: IconOn = FaToggleOn,
        iconOff: IconOff = FaToggleOff,
        room = 'stuen',
        device,
    } = props
    const [ active, setActive ] = React.useState(false)

    const currentState = useSubscribeBooleanPayload(room, 'switch', device)

    function onClick() {
        const value = active ? props.offPayload : props.onPayload
        fetch(`/switch/${room}/${device}/${value}`).then(() => {})
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