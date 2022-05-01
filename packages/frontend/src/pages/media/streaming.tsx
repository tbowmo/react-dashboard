import * as React from 'react'
import { Media, Capabilities } from '@dashboard/types'
import { Duration } from './duration'
import { MediaProp } from './media-prop'
import { Box } from '@mui/material'

type Props = {
  media: Media
  capabilities: Capabilities
}

export function Streaming(props: Props) {
  const { media, capabilities } = props

  const [showAlbumCover, setShowAlbumCover] = React.useState<boolean>(false)

  function clickAlbumCover() {
    setShowAlbumCover(true)
  }

  React.useEffect(() => {
    let timeOut: NodeJS.Timeout
    if (showAlbumCover) {
      timeOut = setTimeout(() => setShowAlbumCover(false), 5000)
    }
    return () => {
      clearTimeout(timeOut)
    }
  }, [showAlbumCover])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr',
        gridTemplateAreas: `"image album"`,
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
        style={{ gridArea: 'image', maxHeight: 600, maxWidth: 600 }}
        src={media?.album_art || capabilities?.app_icon}
        alt={media?.album}
        onClick={() => clickAlbumCover()}
        aria-hidden="true"
      />
      <Box sx={{ display: 'grid', gridTemplateRows: 'repeat(4, 1fr)' }}>
        <Duration media={media} state={capabilities.state} />
        <MediaProp label="Kunstner" value={media?.artist} />
        <MediaProp label="Album" value={media?.album} />
        <MediaProp label="Titel" value={media?.title} />
      </Box>
    </Box>
  )
}
