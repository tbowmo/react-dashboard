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
}

type ScaledValue = {
    value: number,
    unit?: string,
}

function useScaledValue(
    sensorValue: number | undefined,
    unit: string | string[] | undefined,
): ScaledValue | undefined {
    return React.useMemo((): { value: number; unit?: string } | undefined => {
        if (sensorValue === undefined) {
            return undefined
        }

        let returnValue: ScaledValue
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
                    value: value,
                }
            } else {
                returnValue = {
                    unit,
                    value: sensorValue,
                }
            }
        else {
            returnValue = {
                value: sensorValue,
            }
        }
        return returnValue
    }, [unit, sensorValue])
}

function SingleValue(props: {
  unit: string | string[] | undefined
  precission?: number
  sensorName?: string
  sensorType?: string
  room?: string
  sensorValue?: number
}) {
    const {
        unit,
        precission,
        sensorName,
        sensorType = 'sensors',
        room,
        sensorValue,
    } = props

    const valueSensor = useSSENumber(room, sensorType, sensorName) ?? sensorValue
    const value = useScaledValue(
        valueSensor,
        unit,
    )

    return (
        <Box>
            <SensorValue value={value?.value.toFixed(precission) ?? -99} />
            <Typography
                sx={{
                    textAlign: 'center',
                    fontSize: '10pt',
                }}
            >
                {value?.unit ?? ''}
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
                            precission={precission}
                        />
                    </React.Fragment>
                ) : null}
            </Box>
        </Card2Line>
    )
}
