import React from 'react'
import { Box } from '@mui/material'
import { Streaming } from './streaming'
import { RadioTv } from './radio-tv'
import { Others } from './others'
import { Remote } from './remote'
import { Weather } from '../weather/weather'
import { useChromeCast, useSSEString } from '../../core/data'

export function Controller() {
    const cast = useChromeCast('stuen')

    const avScene = useSSEString('stuen', 'avctrl', 'scene') ?? ''

    if (avScene.toLocaleLowerCase() === 'off' || cast === undefined) {
        return <Weather />
    }

    const isStreaming = avScene.toLocaleLowerCase().includes('stream')

    const streamingMedia =
    cast.media?.metadata_type !== null &&
    cast.media?.metadata_type !== undefined 
        ?   <Streaming media={cast.media} capabilities={cast.capabilities} />
        :   <RadioTv media={cast.media} capabilities={cast.capabilities} />

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'auto min-content' }}>
            {isStreaming ? streamingMedia : <Others deviceType={avScene} />}
            <Remote />
        </Box>
    )
}
