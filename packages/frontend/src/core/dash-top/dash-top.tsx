import * as React from 'react'
import moment from 'moment'
import { Sensor } from '../card-2-line/sensor'
import { Grid } from '@mui/material'
import { Card2Line } from '../card-2-line/card-2-line'

type TotalEntry = {
  label: string
  sensor: string
  div: number
}

const totals: TotalEntry[] = [
  {
    label: 'El time',
    sensor: 'hour_Wh',
    div: 1,
  },
  {
    label: 'El dag',
    sensor: 'day_Wh',
    div: 1,
  },
  {
    label: 'El uge',
    sensor: 'week_Wh',
    div: 1000,
  },
  {
    label: 'El måned',
    sensor: 'month_Wh',
    div: 1000,
  },
]

type HumidDewP = {
  sensor: string
  unit: string
}

const humidDewPoint: HumidDewP[] = [
  {
    sensor: 'humidity',
    unit: 'RH%',
  },
  {
    sensor: 'dewpoint',
    unit: 'dp °C',
  },
]
export function DashTop() {
  const [date, setDate] = React.useState(moment())
  const [totalIndex, setTotalIndex] = React.useState<number>(0)
  const [dpIndex, setDpIndex] = React.useState<number>(0)
  React.useEffect(() => {
    const timerID = setInterval(() => setDate(moment()), 1000)
    return () => {
      clearInterval(timerID)
    }
  })

  const elClick = () => {
    setTotalIndex(totalIndex + 1)
    if (totalIndex >= totals.length - 1) {
      setTotalIndex(0)
    }
  }

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (totalIndex !== 0) {
      timeout = setTimeout(() => {
        setTotalIndex(0)
      }, 5000)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [totalIndex])

  const dpClick = () => {
    setDpIndex(dpIndex + 1)
    if (dpIndex >= humidDewPoint.length - 1) {
      setDpIndex(0)
    }
  }

  React.useEffect(() => {
    let timeout: NodeJS.Timeout
    if (dpIndex !== 0) {
      timeout = setTimeout(() => {
        setDpIndex(0)
      }, 5000)
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout)
      }
    }
  }, [dpIndex])

  const total = totals[totalIndex]
  const humidDp = humidDewPoint[dpIndex]
  const scale = ['Wh', 'kWh', 'MWh']

  return (
    <Grid container sx={{ width: '100%' }}>
      <Sensor
        room="garden"
        sensorType="climacell"
        sensorName1="temperature"
        sensorName2={humidDp.sensor}
        label="Udendørs"
        unit1="&deg;C"
        unit2={humidDp.unit}
        onClick={() => {
          dpClick()
        }}
        xs
      />
      <Sensor
        xs
        room="stuen"
        sensorName1="temperature"
        sensorName2={humidDp.sensor}
        label="Stuen"
        unit1="&deg;C"
        unit2={humidDp.unit}
        onClick={() => {
          dpClick()
        }}
      />
      <Sensor
        xs
        onClick={() => {
          elClick()
        }}
        room="global"
        sensorType="utility"
        sensorName1="spot_price_dkk"
        divisor1={10}
        sensorName2={total.sensor}
        label={total.label}
        precission={2}
        unit1="Ører/kWh"
        unit2={scale}
      />
      <Card2Line
        xs
        value={date.format('HH:mm:ss')}
        label={date.format('dddd Do MMMM - YYYY')}
      />
    </Grid>
  )
}
