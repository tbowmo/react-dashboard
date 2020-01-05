import * as React from 'react'
import {
    useCurrentWeather,
    useForecastWeather,
    ForecastTupple,
} from '../../core/data'
import './weather.scss'
import { 
    WiDaySunny,
    WiDayCloudy,
    WiCloudy,
    WiShowers,
    WiDayRain,
    WiDayThunderstorm,
    WiNightClear,
    WiNightCloudy,
    WiDayFog,
    WiNightThunderstorm,
    WiNightFog,
    WiNightRain,
    WiDaySnow,
    WiNightSnow,
    WiWindDeg,
} from 'react-icons/wi'
import {
    MdQuestionAnswer, 
} from 'react-icons/md'
import moment from 'moment'
import { isNumber } from 'util'
import { getCompassHeading, wind } from './weather-functions'


const iconMap = {
    '01d': WiDaySunny,
    '02d': WiDayCloudy,
    '03d': WiCloudy,
    '04d': WiCloudy,
    '09d': WiShowers,
    '10d': WiDayRain,
    '11d': WiDayThunderstorm,
    '13d': WiDaySnow,
    '50d': WiDayFog,
    '01n': WiNightClear,
    '02n': WiNightCloudy,
    '03n': WiCloudy,
    '04n': WiCloudy,
    '09n': WiShowers,
    '10n': WiNightRain,
    '11n': WiNightThunderstorm,
    '13n': WiNightSnow,
    '50n': WiNightFog,
}

function round(value: number, precission: number = 1): number {
    let v = value
    if (isNumber(value)) {
        if (precission === 0) {
            v = Math.round(value)
        } else {
            v = Math.round(value * (10*precission)) / (10*precission)
        }
    }
    return v
}

export function Weather() {
    const weather = useCurrentWeather()

    if (weather === undefined) {
        return null
    }

    const Icon = weather?.weather ? iconMap[weather.weather[0].icon] : MdQuestionAnswer

    return (
        <div className="mainWeather">
            <div className="weatherRows">
                <div className="main">
                    {round(weather?.main?.temp || -99)}&deg;C
                </div>
                <div className="secondary">
                    {round(weather?.main?.temp_min ?? -99)}&deg;C - {round(weather?.main?.temp_max ?? -99)}&deg;C
                </div>
                <div className="secondary">
                    {weather?.weather ? weather.weather[0]?.description ?? '' : ''}&nbsp;
                    {weather?.clouds?.all ?? 0 > 20 ? `- ${weather?.clouds?.all ?? ''}% skydække` : ''}
                </div>
            </div>
            <div className="symbol">
                <Icon />
            </div>
            <div className="weatherRows">
                <div className="main">
                    Vind: {wind(weather?.wind?.speed || 0).label}
                </div>
                <div className="secondary">
                    Retning {getCompassHeading(weather?.wind?.deg ?? 0).direction} ({weather?.wind?.speed || 0}m/s - {weather?.wind?.deg ?? 0}&deg;)
                </div> 
            </div>
            <div className="symbol">
                <WiWindDeg style={{ transform: `rotate(${weather?.wind?.deg ?? 0}deg)` }} />
            </div>
            <Forecast />
        </div>
    )
}

export function Forecast() {
    const forecast = useForecastWeather()

    if (forecast === undefined || forecast.list === undefined) {
        return null
    }

    return (
        <div className="forecast">
            { forecast.list.slice(1, 7).map((f) => (
                <SingleForecast key={`weather-${f.dt}`} data={f} />
            ))}
        </div>
    )
}

function SingleForecast(props: {data: ForecastTupple} ) {
    const { data } = props
    const Icon = data?.weather ? iconMap[data.weather[0].icon] : MdQuestionAnswer
    const timeObj = moment.unix(data.dt)
    const timeStr = timeObj.format('HH:mm')
    return (
        <div className='rw-day'>
            <div className="rw-date">Kl. {timeStr}</div>
            <Icon className="wicon" />
            <div className="rw-desc">{data?.weather ? data.weather[0]?.description || '' : ''}</div>
            <div className="rw-range">{round(data?.main?.temp_max || -99)} / {round(data?.main?.temp_min || -99)}&deg;C</div>
        </div>
    )
}
