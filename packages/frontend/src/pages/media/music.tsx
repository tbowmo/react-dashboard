import * as React from 'react'
import { Chromecast } from '@dashboard/types'
import { Duration } from './duration'
import { MediaProp } from './media-prop'
import { Box } from '@mui/system'

type Props = {
  media: Chromecast.Media
  state: Chromecast.Capabilities['state']
}

export function Music(props: Props) {
  const { media, state } = props

  return (
    <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)' }}>
      <Duration media={media} state={state} />
      <MediaProp label="Kunstner" value={media?.artist} />
      <MediaProp label="Album" value={media?.album} />
      <MediaProp label="Titel" value={media?.title} />
    </Box>
  )
}
