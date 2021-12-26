import * as React from 'react'
import { useSSENumber } from '../data'
import { Grid, GridProps, Typography } from '@mui/material'
import { Card2Line, SensorValue } from './card-2-line'

type Props = Omit<GridProps, 'children'> & {
  room: string
  sensorName1: string
  sensorName2?: string
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

export function Sensor(props: Props) {
  const {
    sensorName1,
    sensorName2,
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
  const sensorValue1 = useSSENumber(room, sensorType, sensorName1)
  const sensorValue2 = useSSENumber(room, sensorType, sensorName2)

  const value1 = useScaledValue(
    sensorValue1 ? sensorValue1 / divisor1 : -99,
    unit1,
    precission,
  )
  const value2 = useScaledValue(
    sensorValue2 ? sensorValue2 / divisor2 : -99,
    unit2,
    precission,
  )

  return (
    <Card2Line label={label} {...restProps}>
      <Grid container direction="row" alignContent="center">
        <Grid item xs={5}>
          <SensorValue value={value1?.value || -99} />
          <Typography
            sx={{
              textAlign: 'center',
              fontSize: '10pt',
            }}
          >
            {value1?.unit || unit1}
          </Typography>
        </Grid>
        {value2 ? (
          <React.Fragment>
            <Grid item xs={2}>
              <SensorValue value="/" />
            </Grid>
            <Grid item xs={5}>
              <SensorValue value={value2.value || -99} />
              <Typography
                sx={{
                  textAlign: 'center',
                  fontSize: '10pt',
                }}
              >
                {value2?.unit || unit2}
              </Typography>
            </Grid>
          </React.Fragment>
        ) : null}
      </Grid>
    </Card2Line>
  )
}
