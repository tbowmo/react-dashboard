import * as React from 'react'
import {
    useStreams,
    StreamDto,
} from '../../core/data'
import moment from 'moment'
import { useTabs } from '../../core/tabs/tabs-context'
import { Grid, CardContent, Typography, Avatar } from '@mui/material'
import { GridCard } from '../../core/card-2-line/grid-card'
import { Box } from '@mui/system'

type Props = {
    type: 'radio' | 'tv',
}


export function Streams(props: Props) {
    const {
        type,
    } = props

    const [ active, setActive ] = React.useState<string>('')
    const streams = useStreams(type)

    function SelectStream(stream: StreamDto) {
        setActive(stream.link)
        console.log('Selecting stream')
        const xhttp = new XMLHttpRequest()
        xhttp.open('POST', '/media/stuen/play', true)
        xhttp.setRequestHeader('Content-type', 'application/json')
        xhttp.send(JSON.stringify(stream))
    }

    const {startTimer} = useTabs()

    React.useEffect( () => {
        if (active !== '') {
            const timer = setTimeout(() => {
                setActive('')
                startTimer(200)
            }, 200)
            return () => {clearTimeout(timer)}
        }
    }, [active, startTimer])

    return (
        <Grid container sx={{width: '100%'}}>
            {streams?.map((streamEntry) => (
                <GridCard item xs={3}
                    key={streamEntry.xmlid}
                    onClick={() => SelectStream(streamEntry)}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                    <CardContent sx={{
                            width: '100%',
                            display: 'grid',
                            gridTemplateColumns: 'min-content auto',
                            gridTemplateRows: 'min-content auto',
                            gridTemplateAreas: `"icon time"
                            "programme programme"`
                        }}>
                            <Avatar sx={{gridArea: 'icon', height: '80px', width: '80px'}} src={streamEntry.icon} />
                            <Box sx={{gridArea: 'time'}}>
                                { streamEntry.programmes[0].start !== streamEntry.programmes[0].end ? (
                                    <React.Fragment>
                                        <label>Start</label>
                                        <div>{moment(streamEntry.programmes[0].start).format('HH:mm')}</div>
                                        <label>Slut</label>
                                        <div>{moment(streamEntry.programmes[0].end).format('HH:mm')}</div>
                                    </React.Fragment>
                                ) : null }
                            </Box>
                            <Typography sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'elipsis',
                                gridArea: 'programme'
                            }}>
                                {streamEntry.programmes[0].title}
                            </Typography>
                    </CardContent>
                    </Box>
                </GridCard>
            ))}
        </Grid>
    )
}
