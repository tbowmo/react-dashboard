import { Card, GridProps, Grid } from '@mui/material'
import * as React from 'react'

export function GridCard(props: GridProps) {
  const { sx, children, ...restProps } = props
  return (
    <Grid
      item
      component={Card}
      sx={{ borderRadius: 5, boxShadow: 2, margin: 1, ...sx }}
      {...restProps}
    >
      {children}
    </Grid>
  )
}
