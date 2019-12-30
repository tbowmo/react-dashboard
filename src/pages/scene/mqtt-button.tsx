import * as React from 'react'
import style from './scene.module.scss'
import { useMqttClient } from '../../core/data'
import { IconType } from 'react-icons/lib/cjs'
import { resetTimer } from '../../core/tabs/tabs'
import clsx from 'clsx'

export type Props = {
    className: string,
    label?: string,
    mqttTopic: string,
    mqttPayload?: string,
    icon?: IconType,
}

export function MqttButton(props: Props) {
    const [ keyActivated, setKey ] = React.useState<boolean>(false)
    const mqtt = useMqttClient()

    function click() {
        setKey(true)
    } 

    React.useEffect( () => {
        if (keyActivated) {
            const timer = setTimeout(() => {
                setKey(false)
                resetTimer(200)
            }, 200)
            mqtt.publish(props.mqttTopic, props.mqttPayload || '')
            return () => {clearTimeout(timer)}
        } 
    }, [keyActivated, mqtt, props])

    return (
        <div className={clsx(style.mqttBase, keyActivated && style.active, props.className)} onClick={click}>
            { props.icon ? (<div className={style.center}><props.icon /></div>) : null }
            <div className={style.center}>{props.label}</div>
        </div>
    )
}
