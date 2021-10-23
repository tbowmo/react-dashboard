import * as React from 'react'
import { Card2Line } from '../card-2-line/card-2-line'
import moment from 'moment'
import { Sensor } from '../sensor/sensor'
import './dash-top.scss'

type TotalEntry = {
    label: string,
    sensor: string,
    div: number,
}

const totals: TotalEntry[] = [
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
    sensor: string,
    unit: string,
}

const humidDewPoint: HumidDewP[] = [
    {
        sensor: 'humidity',
        unit: 'RH%'
    },
    {
        sensor: 'dewpoint',
        unit: 'dp °C'
    }
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

    const dpClick = () => { 
        setDpIndex(dpIndex + 1)
        if (dpIndex >= humidDewPoint.length-1) {
            setDpIndex(0)
        }
    }

    React.useEffect(() => {
        if (dpIndex !== 0) {
            const timeout = setTimeout(() => {
                setDpIndex(0)
            }, 5000)
            return () => {clearTimeout(timeout)}
        }
    }, [dpIndex])

    const total = totals[totalIndex]
    const humidDp = humidDewPoint[dpIndex]
    const scale=['Wh', 'kWh', 'MWh']

    return (
        <div className="topdashboard">
            <Sensor room="garden" sensorType="climacell" sensorName="temperature" cols="1" label="Udendørs" unit="&deg;C" />
            <Sensor 
                onClick={() => {dpClick()}}
                room="garden"
                sensorType="climacell"
                sensorName={humidDp.sensor}
                cols="1"
                label="Udendørs"
                unit={humidDp.unit}
            />
            <Sensor room='stuen' sensorName='temperature' cols="1" label="Stuen" unit="&deg;C" />
            <Sensor 
                onClick={() => {dpClick()}}
                room="stuen"
                sensorName={humidDp.sensor}
                cols="1"
                label="Stuen"
                unit={humidDp.unit}
            />
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
