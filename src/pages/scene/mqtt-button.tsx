import * as React from 'react'
import style from './scene.module.scss'
import { useMqttClient } from '../../core/data'
import { IconType } from 'react-icons/lib/cjs'
import { Card } from '../../core/card/card'
import { resetTimer } from '../../core/tabs/tabs'

export type Props = {
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
        <Card className={`${style.device} ` + ( keyActivated ? style.active : '')} onClick={click}>
            {props.label}
            { props.icon ? (<props.icon />) : null }
        </Card>
    )
}
