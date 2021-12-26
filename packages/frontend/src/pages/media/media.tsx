import * as React from 'react'
import { useChromecast, useSSEString } from '../../core/data'
import { Weather } from '../weather/weather'
import { Music } from './music'
import { RadioTv } from './radio-tv'
import { Others } from './others'
import { Remote } from './remote'
import { Box } from '@mui/material'

export function Controller() {
  const [showAlbumCover, setShowAlbumCover] = React.useState<boolean>(false)

  const cast = useChromecast('stuen')

  const avcenter = useSSEString('stuen', 'avctrl', 'scene') || ''

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

  if (`${avcenter}`.toLocaleLowerCase() === 'off' || cast === undefined) {
    return <Weather />
  }

  const isStreaming = avcenter.toLocaleLowerCase().includes('stream')

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto min-content' }}>
      {isStreaming ? (
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
          {(cast.media?.album_art ?? '') !== '' &&
          (cast.capabilities?.app_icon ?? '') !== '' ? (
            <img
              style={{
                gridArea: 'image',
                zIndex: 50,
                height: '100px',
                opacity: '0.2',
              }}
              src={cast.capabilities?.app_icon}
              alt={cast.capabilities?.app}
            />
          ) : null}
          <img
            style={{ gridArea: 'image', maxHeight: 600 }}
            src={cast.media?.album_art || cast.capabilities?.app_icon}
            alt={cast.media?.album}
            onClick={() => clickAlbumCover()}
            aria-hidden="true"
          />
          {cast.media?.metadata_type === 3 ? (
            <Music media={cast.media} state={cast.state} />
          ) : (
            <RadioTv media={cast.media} state={cast.state} />
          )}
        </Box>
      ) : (
        <Others deviceType={avcenter} />
      )}
      <Remote />
    </Box>
  )
}
