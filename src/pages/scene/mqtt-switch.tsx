import * as React from 'react'
import { Card2Line } from '../../core/card-2-line/card-2-line'
import { Switch } from '@material-ui/core'

type Props = {
    mqttPath: string,
    label: string,
}

export function MqttSwitch(props:Props) {
    return (
        <Card2Line cols="1" label={props.label}>
            <div className="light">
                <Switch color="primary" />
            </div>
        </Card2Line>
    )
}