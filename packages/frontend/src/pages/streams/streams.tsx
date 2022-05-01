import * as React from 'react'
import { useTabs } from '../../core/tabs/tabs-context'
import {
  CardContent,
  Typography,
  Avatar,
  Box,
  CardHeader,
  Card,
} from '@mui/material'
import { format } from 'date-fns'
import { useDrMedia, Media } from '../../core/data'

export function Streams() {
  const media = useDrMedia()

  const { startTimer } = useTabs()

  function SelectStream(stream: Media) {
    const xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/media/stuen/play', true)
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(stream))
    startTimer(200)
  }

  return (
    <Box sx={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
      {media?.map((streamEntry) => (
        <Box sx={{ flexBasis: '33%', padding: 1 }} key={streamEntry.id}>
          <Card key={streamEntry.id} onClick={() => SelectStream(streamEntry)}>
            <CardHeader
              sx={{ paddingBottom: 0 }}
              avatar={
                <Avatar>
                  <streamEntry.channelIcon />
                </Avatar>
              }
              title={streamEntry.channelName}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <CardContent
                sx={{
                  width: '100%',
                  display: 'grid',
                  gridTemplateColumns: 'min-content 1fr',
                  gridTemplateRows: 'min-content auto',
                  gridTemplateAreas: `"icon time"
                            "icon programme"`,
                  gridGap: '10px',
                }}
              >
                <Avatar
                  sx={{ gridArea: 'icon', height: '80px', width: '80px' }}
                  src={streamEntry.avatar}
                />
                <Box sx={{ gridArea: 'time' }}>
                  {`${format(streamEntry.startTime, 'HH:mm')} - ${format(
                    streamEntry.endTime,
                    'HH:mm',
                  )}`}
                </Box>
                <Typography
                  sx={{
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'elipsis',
                    gridArea: 'programme',
                  }}
                >
                  {streamEntry.title}
                </Typography>
              </CardContent>
            </Box>
          </Card>
        </Box>
      ))}
    </Box>
  )
}
