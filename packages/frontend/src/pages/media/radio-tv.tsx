import * as React from 'react'
import { Media, Capabilities } from '@dashboard/types'
import { Duration } from './duration'
import { MediaProp } from './media-prop'
import { Box } from '@mui/material'
import { useDrMedia } from '../../core/data'

type Props = {
  media: Media
  capabilities: Capabilities
}

export function RadioTv(props: Props) {
  const { media, capabilities } = props
  const drMedia = useDrMedia()
  const selectedChannel = React.useMemo(
    () => drMedia?.find((item) => item.link === media.content_id),
    [drMedia, media],
  )
  const timers = React.useMemo(
    (): { current_time: number; duration: number } => ({
      current_time:
        (Date.now() - (selectedChannel?.startTime.getTime() || 0)) / 1000,
      duration: selectedChannel?.duration || 0,
    }),
    [selectedChannel],
  )

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr',
        gridTemplateAreas: '"image album"',
      }}
    >
      {(media?.album_art ?? '') !== '' &&
      (capabilities?.app_icon ?? '') !== '' ? (
        <img
          style={{
            gridArea: 'image',
            zIndex: 50,
            height: '100px',
            opacity: '0.2',
          }}
          src={capabilities?.app_icon}
          alt={capabilities?.app}
        />
      ) : null}
      <img
        style={{ gridArea: 'image', maxHeight: 600 }}
        src={selectedChannel?.avatar || capabilities?.app_icon}
        alt={media?.album}
        aria-hidden="true"
      />
      <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)' }}>
        <Duration media={timers} state={capabilities.state} />
        <MediaProp label="Kanal" value={selectedChannel?.id} />
        <MediaProp label="Program" value={selectedChannel?.title} />
      </Box>
    </Box>
  )
}
