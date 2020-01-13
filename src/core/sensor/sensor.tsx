import { useSubscribeNumberPayload } from '../data/use-mqtt'
import { Card2Line } from '../card-2-line/card-2-line'
import * as React from 'react'
import { colSize, rowSize } from '../card-2-line/card-2-line'

type Props = {
    sensorId?: number,
    type? : number,
    child?: number,
    label: string,
    unit?: string,
    precission?: number,
    cols?: colSize,
    rows?: rowSize,
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void,
    scale?: string[],
}

export function Sensor(props: Props) {
    const {
        label,
        sensorId,
        type = 2,
        precission = 1,
        rows,
        cols,
        onClick,
        scale,
    } = props
    const child = props.child || '+'
    const topic = `dashboard/sensors/${sensorId}/${child}/1/+/${type}`
    let value = useSubscribeNumberPayload(topic)
    let scaleIndex = 0
    if (scale !== undefined) {
        while (value > 999 && scaleIndex < scale.length) {
            value = value / 1000
            scaleIndex++
        }
    }
    const unit = scale ? scale[scaleIndex] : props.unit
    return (
        <Card2Line
            value={value}
            label={label}
            unit={unit}
            precission={precission}
            rows={rows}
            cols={cols}
            onClick={onClick}
        />
    )
}