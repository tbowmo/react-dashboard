import { Card2Line, colSize, rowSize } from '../card-2-line/card-2-line'
import * as React from 'react'
import { useSSENumber } from '../data'

type Props = {
    room: string,
    sensorName: string,
    sensorType?: string,
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
        sensorName,
        sensorType = 'sensors',
        room,
        label,
        precission = 1,
        rows,
        cols,
        onClick,
    } = props
    const sensorValue = useSSENumber(room, sensorType, sensorName)


    const {
        unit,
        value,
    } = React.useMemo(() => {
        if (props.unit !== undefined && Array.isArray(props.unit) && sensorValue) {
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