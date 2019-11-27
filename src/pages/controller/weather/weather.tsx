import * as React from 'react'
import {
    useCurrentWeather,
    useForecastWeather,
    ForecastTupple,
} from '../../../core/data/'
import './weather.scss'
import { 
    WiDaySunny,
    WiDayCloudy,
    WiCloudy,
    WiShowers,
    WiDayRain,
    WiDayThunderstorm,
    WiDaySnowThunderstorm,
    WiNightClear,
    WiNightCloudy,
    WiDayFog,
    WiNightThunderstorm,
    WiNightSnowThunderstorm,
    WiNightFog,
    WiNightRain,
} from 'react-icons/wi'
import moment from 'moment'

export const icons = {
    '01d': WiDaySunny,
    '02d': WiDayCloudy,
    '03d': WiCloudy,
    '04d': WiCloudy,
    '09d': WiShowers,
    '10d': WiDayRain,
    '11d': WiDayThunderstorm,
    '13d': WiDaySnowThunderstorm,
    '50d': WiDayFog,
    '01n': WiNightClear,
    '02n': WiNightCloudy,
    '03n': WiCloudy,
    '04n': WiCloudy,
    '09n': WiShowers,
    '10n': WiNightRain,
    '11n': WiNightThunderstorm,
    '13n': WiNightSnowThunderstorm,
    '50n': WiNightFog,
}

export function Weather() {
    const weather = useCurrentWeather()

    if (weather === undefined) {
        return null
    }

    const Icon = icons[weather.weather[0].icon]
    return (
        <div className="mainWeather">
            <div className="weatherRows">
                <div>
                    <div className="temp">{weather.main.temp}&deg;C</div>
                    <div className="minmax">{weather.main.temp_min}&deg;C / {weather.main.temp_max}&deg;C</div>
                    <div className="description">{weather.weather[0].description} { weather.clouds.all>20 ? `- ${weather.clouds.all}%` : ''} </div>
                </div>
                <div>
                    Vind: {weather.wind.speed} m/sec<br/>retning {weather.wind.deg}<br />
                </div>
            </div>
            <div className="symbol">
                <Icon />
            </div>
            <Forecast />
        </div>
    )
}

export function Forecast() {
    const forecast = useForecastWeather()

    if (forecast === undefined) {
        return null
    }

    return (
        <div className="forecast">
            { forecast.list.slice(1,7).map((f) => (
                <SingleForecast data={f} />
            ))}
        </div>
    )
}

function SingleForecast(props: {data: ForecastTupple} ) {
    const { data } = props
    const Icon = icons[data.weather[0].icon]
    const timeObj = moment.unix(data.dt).local(false)
    const dateStr = timeObj.format("DD-MM-YY")
    const timeStr = timeObj.format('HH:mm')
    return (
        <div className='rw-day'>
            <div className="rw-date">Kl. {timeStr}</div>
            <Icon className="wicon" />
            <div className="rw-desc">{data.weather[0].description}</div>
            <div className="rw-range">{data.main.temp_max} / {data.main.temp_min}&deg;C</div>
        </div>
    )
}