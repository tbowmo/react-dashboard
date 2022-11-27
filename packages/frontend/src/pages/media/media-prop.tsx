import * as React from 'react'
import { MediaCard } from './media-card'
import { Typography } from '@mui/material'

type Props = {
  label: string
  lines?: number
  value?: string
}

export function MediaProp(props: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { label, lines = 1, value } = props

  if (!value) {
    return null
  }
  return (
    <MediaCard label={label}>
      <Typography
        sx={{
          fontSize: '22pt',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {value}
      </Typography>
    </MediaCard>
  )
}
