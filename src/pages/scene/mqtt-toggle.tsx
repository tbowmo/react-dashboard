import * as React from 'react'
import style from './scene.module.scss'
import { IconType } from 'react-icons/lib/cjs'
import { useSubscribeStringPayload, useMqttClient } from '../../core/data'
import clsx from 'clsx'
import {
    FaToggleOff,
    FaToggleOn,
} from 'react-icons/fa'
type Props = {
    className?: string,
    label: string,
    mqttTopic: string,
    onPayload: string,
    offPayload: string,
    iconOn?: IconType,
    iconOff?: IconType,
}
export function MqttToggle(props: Props) {
    const {
        iconOn: IconOn = FaToggleOn,
        iconOff: IconOff = FaToggleOff,
    } = props
    const [ active, setActive ] = React.useState(false)
    const mqttClient = useMqttClient()
    const mqttCurrentState = useSubscribeStringPayload(props.mqttTopic)

    function onClick() {
        mqttClient.publish(
            props.mqttTopic, 
            active ? props.offPayload : props.onPayload,
        )
    }

    React.useEffect(() => {
        if (mqttCurrentState !== undefined) {
            setActive(mqttCurrentState.toLocaleLowerCase() === props.onPayload.toLocaleLowerCase())
        } 
    }, [mqttCurrentState, props])

    return (
        <div className={clsx(style.mqttBase, props.className)} onClick={onClick}>
            <div className={clsx(style.center, active && style.active)}>
                { active ? (<IconOn />) : (<IconOff />) }
            </div>
            <div className={style.center}>{props.label}</div>
        </div>
    )
} 