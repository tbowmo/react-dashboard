import { Grid } from '@mui/material'
import * as React from 'react'

export function Surveilance() {
    return (
        <Grid container>
            <Grid item xs={6}>   
                <img width={600} src="https://zm.juletraesfoden.dk/zm/cgi-bin/nph-zms?scale=100&width=640px&height=480px&mode=jpeg&maxfps=30&monitor=6&user=viewonly&pass=ViewOnly123" alt="" />
            </Grid>
            <Grid item xs={6}>
                <img width={600} src="https://zm.juletraesfoden.dk/zm/cgi-bin/nph-zms?scale=100&width=640px&height=480px&mode=jpeg&maxfps=30&monitor=4&user=viewonly&pass=ViewOnly123" alt="" />
            </Grid>
        </Grid>
    )
}
