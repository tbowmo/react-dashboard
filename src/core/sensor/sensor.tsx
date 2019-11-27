import { useSubscribeNumberPayload } from '../data/use-mqtt'
import { Card2Line } from '../card-2-line/card-2-line'
import * as React from 'react'
import { colSize, rowSize } from '../card/card'

type Props = {
    sensorId?: number,
    type? : number,
    child?: number,
    label: string,
    unit?: string,
    precission?: number,
    cols?: colSize,
    rows?: rowSize,
}

export function Sensor(props: Props) {
    const {
        label,
        sensorId,
        type = 2,
        unit,
        precission = 1,
        rows,
        cols,
    } = props
    const child = props.child || '+'
    const topic = `dashboard/sensors/${sensorId}/${child}/1/+/${type}`
    const value = useSubscribeNumberPayload(topic)
    return (
        <Card2Line
            value={value}
            label={label}
            unit={unit}
            precission={precission}
            rows={rows}
            cols={cols}
        />
    )
}