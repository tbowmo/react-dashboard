import React from 'react'
import { Grid, CircularProgress } from '@mui/material'
import { GridCard } from '../card-2-line/grid-card'

export function Spinner() {
    return (
        <Grid container>
            <GridCard sx={{ textAlign: 'center' }}>
                <CircularProgress size={630}/>
            </GridCard>
        </Grid>
    )
}
