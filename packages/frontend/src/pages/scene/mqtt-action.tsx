import { SvgIconComponent } from '@mui/icons-material'
import { Typography } from '@mui/material'
import React from 'react'
import { GridCard, GridCardProps } from '../../core/card-2-line/grid-card'

type Props = GridCardProps & {
  icon: SvgIconComponent | null | undefined
  iconColor?: string
  label?: string
}

export function MqttAction(props: Props) {
  const { icon: Icon, label, iconColor, sx, ...restProps } = props

  return (
    <GridCard
      sx={{
        display: 'grid',
        gridTemplateColumns: 'min-content auto',
        height: '100%',
        width: '100%',
        ...sx,
      }}
      {...restProps}
    >
      {Icon ? (
        <Icon
          sx={{
            margin: 'auto',
            color: iconColor,
            height: '70px',
            width: '70px',
          }}
        />
      ) : null}
      <Typography sx={{ margin: 'auto' }}>
        {label?.toLocaleUpperCase()}
      </Typography>
    </GridCard>
  )
}
