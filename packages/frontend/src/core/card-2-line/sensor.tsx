import React from 'react'
import { Typography, Box } from '@mui/material'
import { Card2Line, SensorValue } from './card-2-line'
import { GridCardProps } from './grid-card'
import { useSSENumber } from '../data'

type Props = Omit<GridCardProps, 'children'> & {
  room: string
  sensorName1?: string
  sensorValue1?: number
  sensorName2?: string
  sensorValue2?: number
  sensorType?: string
  label: string
  unit1?: string | string[]
  unit2?: string | string[]
  precission?: number
  scale?: string[]
  divisor1?: number
  divisor2?: number
}

function round(value: number, precission = 1): number {
    if (precission === 0) {
        return Math.round(value)
    }

    return Math.round(value * (10 * precission)) / (10 * precission)
}

function useScaledValue(
    sensorValue: number | undefined,
    unit: string | string[] | undefined,
    precission = 1,
): { value: number; unit?: string } | undefined {
    return React.useMemo((): { value: number; unit?: string } | undefined => {
        if (!sensorValue) {
            return undefined
        }
        let returnValue: { value: number; unit?: string }
        if (unit !== undefined)
            if (Array.isArray(unit)) {
                let value = sensorValue
                let scaleIndex = 0
                while (value > 999 && scaleIndex < unit.length) {
                    value /= 1000
                    scaleIndex += 1
                }
                returnValue = {
                    unit: unit[scaleIndex],
                    value: round(value, precission),
                }
            } else {
                returnValue = {
                    unit,
                    value: round(sensorValue, precission),
                }
            }
        else {
            returnValue = {
                value: round(sensorValue, precission),
            }
        }
        return returnValue
    }, [unit, sensorValue, precission])
}

function SingleValue(props: {
  unit: string | string[] | undefined
  divisor?: number
  precission?: number
  sensorName?: string
  sensorType?: string
  room?: string
  sensorValue?: number
}) {
    const {
        unit,
        divisor = 1,
        precission,
        sensorName,
        sensorType = 'sensors',
        room,
        sensorValue,
    } = props

    const valueSensor = useSSENumber(room, sensorType, sensorName) ?? sensorValue
    const value = useScaledValue(
        valueSensor ? valueSensor / divisor : -99,
        unit,
        precission,
    )

    return (
        <Box>
            <SensorValue value={value?.value ?? -99} />
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: '10pt',
                }}
            >
                {value?.unit ?? unit}
            </Typography>
        </Box>
    )
}

export function Sensor(props: Props) {
    const {
        sensorName1,
        sensorValue1,
        sensorName2,
        sensorValue2,
        sensorType = 'sensors',
        room,
        label,
        precission,
        unit1,
        unit2,
        divisor1 = 1,
        divisor2 = 1,
        ...restProps
    } = props

    return (
        <Card2Line label={label} {...restProps}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <SingleValue
                    sensorName={sensorName1}
                    sensorValue={sensorValue1}
                    room={room}
                    sensorType={sensorType}
                    unit={unit1}
                    divisor={divisor1}
                    precission={precission}
                />
                {sensorName2 ? (
                    <React.Fragment>
                        <SensorValue value="/" />
                        <SingleValue
                            sensorName={sensorName2}
                            sensorValue={sensorValue2}
                            room={room}
                            sensorType={sensorType}
                            unit={unit2}
                            divisor={divisor2}
                            precission={precission}
                        />
                    </React.Fragment>
                ) : null}
            </Box>
        </Card2Line>
    )
}
