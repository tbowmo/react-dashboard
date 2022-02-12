import * as React from 'react'
import { useTabs } from '../../core/tabs/tabs-context'
import { Grid, CardContent, Typography, Avatar, Box } from '@mui/material'
import { GridCard } from '../../core/card-2-line/grid-card'
import { format } from 'date-fns'
import { useDrMedia, Media } from '../../core/data'

function Time(props: { label: string; time: Date }) {
  const { label, time } = props
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '60px 1fr',
      }}
    >
      <Typography>{label}</Typography>
      <Typography>{format(time, 'HH:mm')}</Typography>
    </Box>
  )
}

export function Streams() {
  const [active, setActive] = React.useState<string>('')

  const media = useDrMedia()

  function SelectStream(stream: Media) {
    setActive(stream.id)

    const xhttp = new XMLHttpRequest()
    xhttp.open('POST', '/media/stuen/play', true)
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(JSON.stringify(stream))
  }

  const { startTimer } = useTabs()

  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null
    if (active !== '') {
      timer = setTimeout(() => {
        setActive('')
        startTimer(200)
      }, 200)
    }
    return () => {
      if (timer !== null) {
        clearTimeout(timer)
      }
    }
  }, [active, startTimer])

  return (
    <Grid container sx={{ width: '100%' }}>
      {media?.map((streamEntry) => (
        <GridCard
          item
          xs={3}
          key={streamEntry.id}
          onClick={() => SelectStream(streamEntry)}
        >
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
                <React.Fragment>
                  <Time label="Start" time={streamEntry.startTime} />
                  <Time label="Slut" time={streamEntry.endTime} />
                </React.Fragment>
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
        </GridCard>
      ))}
    </Grid>
  )
}
