import { Grid } from '@mui/material'
import { useSurveilance } from '../../core'
import { useState } from 'react'
import { useTabs } from '../../core/tabs'

export function Surveilance() {
    const surveilance = useSurveilance()

    const [focusStream, setFocusStream] = useState<string>()
    const { startTimer } = useTabs()
    
    if (!surveilance.length) {
        return
    }
    
    const width = 1200 / surveilance.length
    function focus(streamUrl: string) {
        setFocusStream(streamUrl)
        startTimer()
    }
    return (
        <Grid container>
            {focusStream 
                ? (
                    <Grid item xs={12}>
                        <img src={focusStream} alt="" />
                    </Grid>
                )
                : surveilance.map((item) => (
                    <Grid item xs={6} key={item.url} onClick={() => focus(item.url)}>
                        <img
                            width={width}
                            src={item.url}
                            alt=""
                        />
                    </Grid>
                ))}
        </Grid>
    )
}
