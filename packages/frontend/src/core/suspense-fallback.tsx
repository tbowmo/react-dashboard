import React from 'react'
import { Grid } from '@mui/material'
import { GridCard } from './card-2-line/grid-card'

export function SuspenseFallback() {
    return (
        <Grid container>
            <GridCard>Loading data</GridCard>
        </Grid>
    )
}
