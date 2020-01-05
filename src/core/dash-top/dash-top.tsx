import * as React from 'react'
import { Card2Line } from '../card-2-line/card-2-line'
import moment from 'moment'
import { Sensor } from '../sensor/sensor'
import { useCurrentWeather } from '../data/'
import './dash-top.scss'

export function DashTop() {
    const [date, setDate] = React.useState(moment())
  
    React.useEffect(() => {
        const timerID = setInterval(() => setDate(moment()), 1000)
        return () => {
            clearInterval(timerID)
        }
    })
    
    const currentWeather = useCurrentWeather()
    if (!currentWeather) {
        return null
    }
    const { main } = currentWeather
    
    return (
        <div className="topdashboard">
            <Card2Line value={main?.temp || ''} cols="1" label="Udendørs" unit="&deg;C" />
            <Card2Line value={main?.humidity || ''} cols="1" label="Udendørs" unit="RH%" />
            <Sensor sensorId={10} type={0} child={1} cols="1" label="Stuen" unit="&deg;C" />
            <Sensor sensorId={10} type={1} cols="1" label="Stuen" unit="RH%" />
            <Card2Line cols="2" value={date.format('HH:mm:ss')} label={date.format('dddd Do MMMM - YYYY')} />
        </div>
    )
}
