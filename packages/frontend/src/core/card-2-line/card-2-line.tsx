import { Typography } from '@mui/material'
import { GridCard, GridCardProps } from './grid-card'

type Props = GridCardProps & {
  value?: string | number
  label: string
}

export function SensorValue(props: { value: string | number | undefined }) {
  const { value } = props
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
      {value}
    </Typography>
  )
}

export function Card2Line(props: Props) {
  const { value, label, children, sx, ...restProps } = props

  return (
    <GridCard {...restProps}>
      {value ? <SensorValue value={value} /> : children}
      <Typography sx={{ textAlign: 'center' }}>{label}</Typography>
    </GridCard>
  )
}
