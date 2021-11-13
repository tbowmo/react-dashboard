import * as React from 'react'
import { useSSENumber } from '../data'
import { Grid, GridProps, Typography } from '@mui/material'
import { Card2Line, SensorValue } from '../card-2-line/card-2-line'

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
}

function round(value: number, precission: number = 1) {
  if (precission === 0) {
    return Math.round(value)
  } else {
    return Math.round(value * (10 * precission)) / (10 * precission)
  }
}

function useScaledValue(
  sensorValue: number | undefined,
  unit: string | string[] | undefined,
  precission: number = 1,
): { value: number; unit?: string } | undefined {
  return React.useMemo(() => {
    if (!sensorValue) {
      return
    }
    if (unit !== undefined && Array.isArray(unit) && sensorValue) {
      let value = sensorValue
      let scaleIndex = 0
      while (value > 999 && scaleIndex < unit.length) {
        value = value / 1000
        scaleIndex++
      }
      return {
        unit: unit[scaleIndex],
        value: round(value, precission),
      }
    } else if (unit !== undefined && typeof unit === 'string') {
      return {
        unit,
        value: round(sensorValue, precission),
      }
    }
    return {
      value: round(sensorValue, precission),
    }
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
    ...restProps
  } = props
  const sensorValue1 = useSSENumber(room, sensorType, sensorName1)
  const sensorValue2 = useSSENumber(room, sensorType, sensorName2)

  const value1 = useScaledValue(sensorValue1, unit1, precission)
  const value2 = useScaledValue(sensorValue2, unit2, precission)

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

/*
            value={value}
            label={label}
            unit={unit}
            precission={precission}
            rows={rows}
            cols={cols}
            onClick={onClick}
*/
