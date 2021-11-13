import * as React from 'react'
import { Chromecast } from '@dashboard/types'
import { Duration } from './duration'
import { MediaProp } from './media-prop'
import { Box } from '@mui/system'

type Props = {
  media: Chromecast.Media
  state: Chromecast.Capabilities['state']
}

export function RadioTv(props: Props) {
  const { media, state } = props
  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'min-content min-content auto',
      }}
    >
      <Duration media={media} state={state} />
      <MediaProp label="Program" value={media?.album} />
      <MediaProp label="Beskrivelse" value={media?.title} lines={4} />
    </Box>
  )
}
