import React from 'react'
import { Box } from '@mui/material'
import { Card2Line, SensorValue } from '../card-2-line/card-2-line'
import { useFormatDate } from '../date-time'

export function Clock() {
    const [time, setTime] = React.useState<Date>(new Date())

    const dateFormat = useFormatDate()

    React.useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000)
        
        return () => {
            clearInterval(timerId)
        }
    }, [])

    return (
        <Card2Line
            label={dateFormat(time, 'compactDateWithDay')}
        >
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
                <Box sx={{ margin: 'auto' }}>
                    <SensorValue value={dateFormat(time, 'longTime')} />
                </Box>
            </Box>
        </Card2Line>
    )
}
