import { format } from 'date-fns'
import React from 'react'
import { da } from 'date-fns/locale'
import { Box } from '@mui/material'
import { Card2Line, SensorValue } from '../card-2-line/card-2-line'

export function Clock() {
  const [time, setTime] = React.useState<Date>(new Date())

  React.useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000)
    return function cleanup() {
      clearInterval(timerId)
    }
  }, [])

  return (
    <Card2Line
      label={format(time, 'eee dd. MMMM - yyyy', { locale: da })}
      onClick={() => {}}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
        <Box sx={{ margin: 'auto' }}>
          <SensorValue value={format(time, 'HH:mm:ss')} />
        </Box>
      </Box>
    </Card2Line>
  )
}
