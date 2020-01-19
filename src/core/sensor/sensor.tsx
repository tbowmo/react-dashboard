import { useSubscribeNumberPayload } from '../data/use-mqtt'
import { Card2Line } from '../card-2-line/card-2-line'
import * as React from 'react'
import { colSize, rowSize } from '../card-2-line/card-2-line'

type Props = {
    sensorId?: number,
    type? : number,
    child?: number,
    label: string,
    unit?: string | string[],
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
    } = props
    const child = props.child || '+'
    const topic = `dashboard/sensors/${sensorId}/${child}/1/+/${type}`
    const sensorValue = useSubscribeNumberPayload(topic)


    const {
        unit,
        value,
    } = React.useMemo(() => {
        if (props.unit !== undefined && Array.isArray(props.unit)) {
            let value = sensorValue
            let scaleIndex = 0
            while (value > 999 && scaleIndex < props.unit.length) {
                value = value / 1000
                scaleIndex++
            }
            return {
                unit: props.unit[scaleIndex],
                value,
            }
        } else if ( props.unit !== undefined && typeof props.unit === 'string'){
            return {
                unit: props.unit,
                value: sensorValue,
            }
        }
        return {
            value: sensorValue,
        }
    }, [props.unit, sensorValue])

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