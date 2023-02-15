import React from 'react'
import { Box } from '@mui/material'
import { Streaming } from './streaming'
import { RadioTv } from './radio-tv'
import { Others } from './others'
import { Remote } from './remote'
import { Weather } from '../weather/weather'
import { useChromecast, useSSEString } from '../../core/data'

export function Controller() {
  const cast = useChromecast('stuen')

  const avcenter = useSSEString('stuen', 'avctrl', 'scene') || ''

  if (`${avcenter}`.toLocaleLowerCase() === 'off' || cast === undefined) {
    return <Weather />
  }

  const isStreaming = avcenter.toLocaleLowerCase().includes('stream')

  const streamingMedia =
    cast.media?.metadata_type !== null &&
    cast.media?.metadata_type !== undefined ? (
      <Streaming media={cast.media} capabilities={cast.capabilities} />
    ) : (
      <RadioTv media={cast.media} capabilities={cast.capabilities} />
    )

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto min-content' }}>
      {isStreaming ? streamingMedia : <Others deviceType={avcenter} />}
      <Remote />
    </Box>
  )
}
