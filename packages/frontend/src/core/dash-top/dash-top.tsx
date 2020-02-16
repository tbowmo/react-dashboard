import * as React from 'react'
import { Card2Line } from '../card-2-line/card-2-line'
import moment from 'moment'
import { Sensor } from '../sensor/sensor'
import { useCurrentWeather } from '../data/'
import './dash-top.scss'

type TotalEntry = {
    label: string,
    sensor: string,
    div: number,
}

const totals: TotalEntry[] = [
    {
        label: 'El dag',
        sensor: 'day_Kwh',
        div: 1,
    },
    {
        label: 'El uge',
        sensor: 'week_Kwh',
        div: 1000,
    },
    {
        label: 'El måned',
        sensor: 'month_Kwh',
        div: 1000,
    },
]

export function DashTop() {
    const [date, setDate] = React.useState(moment())
    const [totalIndex, setTotalIndex] = React.useState(0)
  
    React.useEffect(() => {
        const timerID = setInterval(() => setDate(moment()), 1000)
        return () => {
            clearInterval(timerID)
        }
    })

    const elClick = () => { 
        setTotalIndex(totalIndex + 1)
        if (totalIndex >= totals.length-1) {
            setTotalIndex(0)
        }
    }

    React.useEffect(() => {
        if (totalIndex !== 0) {
            const timeout = setTimeout(() => {
                setTotalIndex(0)
            }, 5000)
            return () => {clearTimeout(timeout)}
        }
    }, [totalIndex])
    
    const currentWeather = useCurrentWeather()
    if (!currentWeather) {
        return null
    }
    const { main } = currentWeather

    const total = totals[totalIndex]
    const scale=['Wh', 'kWh', 'MWh']

    return (
        <div className="topdashboard">
            <Card2Line value={main?.temp || ''} cols="1" label="Udendørs" unit="&deg;C" />
            <Card2Line value={main?.humidity || ''} cols="1" label="Udendørs" unit="RH%" />
            <Sensor room='stuen' sensorName='temperature' cols="1" label="Stuen" unit="&deg;C" />
            <Sensor room="stuen" sensorName="humidity" cols="1" label="Stuen" unit="RH%" />
            <Sensor 
                onClick={() => {elClick()}}
                room='global'
                sensorType="utility"
                sensorName={total.sensor}
                cols="1"
                label={total.label}
                precission={1}
                unit={scale}
            />
            <Sensor
                cols="1"
                room="global"
                sensorType="utility"
                sensorName="current_W"
                label="EL aktuelt"
                precission={0}
                unit="watt"
            />
            <Card2Line cols="2" value={date.format('HH:mm:ss')} label={date.format('dddd Do MMMM - YYYY')} />
        </div>
    )
}
