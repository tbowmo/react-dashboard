import * as React from 'react'
import { Card2Line } from '../../core/card-2-line/card-2-line'

type Props = {
    mqttPath: string,
    label: string,
}

export function MqttButton(props:Props) {
    return (
        <Card2Line cols="1" label={props.label}>
        </Card2Line>
    )
}