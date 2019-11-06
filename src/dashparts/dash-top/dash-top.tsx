import * as React from 'react'
import './dash-top.scss'
import { Card2Line } from '../../core/card-2-line/card-2-line'
import moment from 'moment'
import { Sensor } from '../../core/sensor/sensor'

export function DashTop() {
    const [date, setDate] = React.useState(moment())

    React.useEffect(() => {
        const timerID = setInterval(() => tick(), 1000)
        return () => {
            clearInterval(timerID)
        };
    })

    function tick() {
        setDate(moment())
    }
    
    return (
        <div className="topdashboard">
            <Card2Line cols="3" value="-" label="Vejrudsigt for Veddum" />
            <Card2Line cols="3" value={date.format('HH:mm:ss')} label={date.format('dddd Do MMMM - YYYY')}/>
            <Sensor sensorId={11} type={0} cols="1" label="Udendørs" unit="&deg;C" />
            <Sensor sensorId={11} type={1} cols="1" label="Udendørs" unit="RH%" />
            <Sensor sensorId={11} type={4} cols="1" label="Baro" unit="hPa" />
            <Sensor sensorId={10} type={0} child={1} cols="1" label="Stuen" unit="&deg;C" />
            <Sensor sensorId={10} type={1} cols="1" label="Stuen" unit="RH%" />
            <Sensor sensorId={20} type={0} child={0} cols="1" label="Gulvvarme" unit="&deg;C" />
        </div>
    )
}
