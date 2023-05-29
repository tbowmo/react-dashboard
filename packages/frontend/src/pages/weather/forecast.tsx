import React from 'react'
import {
    Grid,
    Box,
    Typography,
} from '@mui/material'
import { SvgIconComponent } from '@mui/icons-material'
import { format } from 'date-fns'
import { iconMap, round } from './weather-functions'
import { GridCard } from '../../core/card-2-line/grid-card'
import { useForecastWeather, ForecastTupple } from '../../core/data'

function SingleForecast(props: { data: ForecastTupple }) {
    const { data } = props
    const Icon: SvgIconComponent = iconMap[data.weather[0].icon] || null

    const timeStr = React.useMemo((): string => {
        return format(data.dt * 1000, 'HH:mm')
    }, [data.dt])

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
            <Typography fontSize="large" sx={{ gridArea: 'time' }}>
                Kl. {timeStr}
            </Typography>
            <Typography
                fontSize="large"
                sx={{ gridArea: 'weather', whiteSpace: 'nowrap' }}
            >
                {data.weather?.[0]?.description || ''}
            </Typography>
            <Typography
                fontSize="large"
                sx={{
                    gridArea: 'temperature',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}
            >
                {round(data.main?.temp_min)} / {round(data.main?.temp_max)}&deg;C
            </Typography>
            <Box sx={{ gridArea: 'icon' }}>
                <Icon
                    sx={{
                        fontSize: '40pt',
                    }}
                />
            </Box>
        </Box>
    )
}

export function Forecast() {
    const forecast = useForecastWeather()

    if (forecast === undefined || forecast.list === undefined) {
        return null
    }

    return (
        <Grid container>
            {forecast.list.slice(1, 6).map((f) => (
                <GridCard key={`weather-${f.dt}`}>
                    <SingleForecast data={f} />
                </GridCard>
            ))}
        </Grid>
    )
}
