import { Card, Button, Box, Grid, BoxProps, GridSize } from '@mui/material'
import React from 'react'

export type GridCardProps = BoxProps & { columns?: GridSize }

export function GridCard(props: GridCardProps) {
  const { sx, children, onClick, columns, ...restProps } = props

  function onClickHandler(event: React.MouseEvent<HTMLDivElement>) {
    if (onClick) {
      setTimeout(() => {}, 100)
      onClick(event)
    }
  }

  return (
    <Grid
      item
      component={onClick ? Button : Card}
      sx={{
        borderRadius: 5,
        boxShadow: 2,
        margin: 1,
        touchAction: 'none',
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        color: '#fff',
      }}
      xs={columns || true}
      onClick={(event) => onClickHandler(event)}
      {...restProps}
    >
      <Box sx={{ padding: 2, height: '100%', ...sx }}>{children}</Box>
    </Grid>
  )
}
