import * as React from 'react'
import { Card2Line } from '../card-2-line/card-2-line'
import moment from 'moment'
import { Sensor } from '../sensor/sensor'
import { useCurrentWeather } from '../data/'
import './dash-top.scss'

type TotalEntry = {
    label: string,
    sensor: number,
    div: number,
}

const totals: TotalEntry[] = [
    {
        label: 'El dag',
        sensor: 2,
        div: 1,
    },
    {
        label: 'El uge',
        sensor: 3,
        div: 1000,
    },
    {
        label: 'El måned',
        sensor: 4,
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
    const scale=['Wh', 'kWh']

    return (
        <div className="topdashboard">
            <Card2Line value={main?.temp || ''} cols="1" label="Udendørs" unit="&deg;C" />
            <Card2Line value={main?.humidity || ''} cols="1" label="Udendørs" unit="RH%" />
            <Sensor sensorId={10} type={0} child={1} cols="1" label="Stuen" unit="&deg;C" />
            <Sensor sensorId={10} type={1} cols="1" label="Stuen" unit="RH%" />
            <Sensor 
                onClick={() => {elClick()}}
                sensorId={99}
                type={18}
                child={total.sensor}
                cols="1"
                label={total.label}
                unit="wH"
                precission={2}
                scale={scale}
            />
            <Sensor
                cols="1"
                sensorId={99}
                type={17}
                child={1}
                label="EL aktuelt"
                precission={0}
                unit="watt"
            />
            <Card2Line cols="2" value={date.format('HH:mm:ss')} label={date.format('dddd Do MMMM - YYYY')} />
        </div>
    )
}
