import * as React from 'react'
import {
  useCurrentWeather,
  useForecastWeather,
  ForecastTupple,
  useSSENumber,
} from '../../core/data'
import {
  WeatherCloudy,
  WeatherFog,
  WeatherSunny,
  WeatherSnowy,
  WeatherRainy,
  WeatherNightPartlyCloudy,
  WeatherNight,
  WeatherLightning,
  ArrowRightThinCircleOutline,
} from 'mdi-material-ui'
import moment from 'moment'
import { getCompassHeading, wind } from './weather-functions'
import { Box } from '@mui/system'
import { CardContent, Grid, Typography } from '@mui/material'
import { GridCard } from '../../core/card-2-line/grid-card'
import { SvgIconComponent } from '@mui/icons-material'

const iconMap = {
  '01d': WeatherSunny,
  '01n': WeatherNight,
  '02d': WeatherCloudy,
  '02n': WeatherNightPartlyCloudy,
  '03d': WeatherCloudy,
  '03n': WeatherCloudy,
  '04d': WeatherCloudy,
  '04n': WeatherCloudy,
  '09d': WeatherRainy,
  '09n': WeatherRainy,
  '10d': WeatherRainy,
  '10n': WeatherRainy,
  '11d': WeatherLightning,
  '11n': WeatherLightning,
  '13d': WeatherSnowy,
  '13n': WeatherSnowy,
  '50d': WeatherFog,
  '50n': WeatherFog,
}

function round(value: number, precission: number = 1): number {
  let v = value
  if (typeof value === 'number') {
    if (precission === 0) {
      v = Math.round(value)
    } else {
      v = Math.round(value * (10 * precission)) / (10 * precission)
    }
  }
  return v
}

export function Weather() {
  const weather = useCurrentWeather()

  const temperature = useSSENumber('garden', 'climacell', 'temperature')

  if (weather === undefined) {
    return null
  }

  const WeatherIcon: SvgIconComponent =
    iconMap[weather?.weather[0]?.icon] || null
  const iconSize = '180px'
  return (
    <Box sx={{ display: 'grid', gridTemplateRows: 'auto min-content' }}>
      <Grid container>
        <GridCard xs={9}>
          <CardContent>
            <Typography sx={{ fontSize: '30pt', fontWeight: 'bold' }}>
              {round(temperature || -99)}&deg;C
            </Typography>
            <Typography>
              {round(weather?.main?.temp_min ?? -99)}&deg;C -{' '}
              {round(weather?.main?.temp_max ?? -99)}&deg;C
            </Typography>
            <Typography fontSize="large">
              {weather?.weather ? weather.weather[0]?.description ?? '' : ''}
              &nbsp;
              {weather?.clouds?.all ?? 0 > 20
                ? `- ${weather?.clouds?.all ?? ''}% skydække`
                : ''}
            </Typography>
          </CardContent>
        </GridCard>
        <GridCard xs>
          <CardContent>
            <WeatherIcon
              sx={{
                height: iconSize,
                width: iconSize,
              }}
            />
          </CardContent>
        </GridCard>
        <GridCard xs={9}>
          <CardContent>
            <Typography>
              Vind: {wind(weather?.wind?.speed || 0).label}
            </Typography>
            <Typography fontSize="large">
              Retning {getCompassHeading(weather?.wind?.deg ?? 0).direction} (
              {weather?.wind?.speed || 0}m/s - {weather?.wind?.deg ?? 0}&deg;)
            </Typography>
          </CardContent>
        </GridCard>
        <GridCard xs>
          <CardContent>
            <ArrowRightThinCircleOutline
              sx={{
                transform: `rotate(${
                  weather?.wind?.deg ? weather.wind.deg - 90 : 0
                }deg)`,
                gridArea: 'direction',
                height: iconSize,
                width: iconSize,
              }}
            />
          </CardContent>
        </GridCard>
      </Grid>
      <Forecast />
    </Box>
  )
}

function Forecast() {
  const forecast = useForecastWeather()

  if (forecast === undefined || forecast.list === undefined) {
    return null
  }

  return (
    <Grid container>
      {forecast.list.slice(1, 6).map((f) => (
        <GridCard xs key={`weather-${f.dt}`}>
          <CardContent>
            <SingleForecast data={f} />
          </CardContent>
        </GridCard>
      ))}
    </Grid>
  )
}

function SingleForecast(props: { data: ForecastTupple }) {
  const { data } = props
  const Icon: SvgIconComponent = iconMap[data.weather[0].icon] || null
  const timeObj = moment.unix(data.dt)
  const timeStr = timeObj.format('HH:mm')
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto min-content',
        gridTemplateRows: 'repeat(3 fr)',
        gridTemplateAreas: `"time icon"
            "weather icon"
            "temperature icon"`,
      }}
    >
      <Box sx={{ gridArea: 'time' }}>Kl. {timeStr}</Box>
      <Box sx={{ gridArea: 'weather' }}>
        {data?.weather ? data.weather[0]?.description || '' : ''}
      </Box>
      <Box sx={{ gridArea: 'temperature' }}>
        {round(data?.main?.temp_max || -99)} /{' '}
        {round(data?.main?.temp_min || -99)}&deg;C
      </Box>
      <Box sx={{ gridArea: 'icon' }}>
        <Icon fontSize="large" />
      </Box>
    </Box>
  )
}
