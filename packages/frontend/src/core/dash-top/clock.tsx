import * as React from 'react'
import { Card2Line } from '../card-2-line/card-2-line'
import moment from 'moment'

export function Clock() {
  const [date, setDate] = React.useState<moment.Moment>(moment())

  React.useEffect(() => {
    const timerID = setInterval(() => setDate(moment()), 1000)
    return () => {
      clearInterval(timerID)
    }
  })

  return (
    <Card2Line
      xs
      value={date.format('HH:mm:ss')}
      label={date.format('dddd Do MMMM - YYYY')}
    />
  )
}
