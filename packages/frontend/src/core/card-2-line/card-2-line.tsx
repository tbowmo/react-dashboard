import * as React from 'react'
import { CardContent, GridProps, Typography } from '@mui/material'
import { GridCard } from './grid-card'

type Props = GridProps & {
  value?: string | number
  label: string
}

export function SensorValue(props: { value: string | number | undefined }) {
  return (
    <Typography
      sx={{
        color: '#ff8c00',
        fontFamily: 'Orbitron, serif',
        fontWeight: 'bold',
        fontSize: '30pt',
        textAlign: 'center',
      }}
    >
      {props.value}
    </Typography>
  )
}

export function Card2Line(props: Props) {
  const { value, label, children, sx, ...restProps } = props

  return (
    <GridCard {...restProps}>
      <CardContent>
        {value ? <SensorValue value={value} /> : children}
      </CardContent>
      <CardContent>
        <Typography sx={{ textAlign: 'center' }}>{label}</Typography>
      </CardContent>
    </GridCard>
  )
}
