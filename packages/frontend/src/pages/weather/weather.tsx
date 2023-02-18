import { ArrowRightThinCircleOutline } from 'mdi-material-ui'
import { Grid, Typography, Box } from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'
import { getCompassHeading, wind, iconMap, round } from './weather-functions'
import { Forecast } from './forecast'
import { GridCard } from '../../core/card-2-line/grid-card'
import { useCurrentWeather, useSSENumber } from '../../core/data'

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
        <GridCard columns={9}>
          <Typography sx={{ fontSize: '30pt', fontWeight: 'bold' }}>
            {round(temperature)}&deg;C
          </Typography>
          <Typography>
            {round(weather?.main?.temp_min)}&deg;C -{' '}
            {round(weather?.main?.temp_max)}&deg;C
          </Typography>
          <Typography fontSize="large">
            {weather?.weather ? weather.weather[0]?.description ?? '' : ''}
            &nbsp;
            {weather?.clouds?.all ?? 0 > 20
              ? `- ${weather?.clouds?.all ?? ''}% skydække`
              : ''}
          </Typography>
        </GridCard>
        <GridCard>
          <WeatherIcon
            sx={{
              height: iconSize,
              width: iconSize,
            }}
          />
        </GridCard>
        <GridCard columns={9}>
          <Typography>Vind: {wind(weather?.wind?.speed || 0).label}</Typography>
          <Typography fontSize="large">
            Retning {getCompassHeading(weather?.wind?.deg ?? 0).direction} (
            {weather?.wind?.speed ?? 0}m/s - {weather?.wind?.deg ?? 0}&deg;)
          </Typography>
        </GridCard>
        <GridCard>
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
        </GridCard>
      </Grid>
      <Forecast />
    </Box>
  )
}
