import React from 'react'
import {
    Album,
    Tv,
    Games,
} from '@mui/icons-material'
import { Box } from '@mui/material'
import { MediaProp } from './media-prop'

type Props = {
  deviceType: string
}

export function Others(props: Props) {
    const { deviceType } = props
    const Icon = React.useMemo(() => {
        switch (deviceType.toLowerCase()) {
        case 'tv':
            return Tv
        case 'wii':
        case 'ps2':
            return Games
        default:
            return Album
        }
    }, [deviceType])

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Icon sx={{ fontSize: '80pt' }} />
            </Box>
            <MediaProp label="" value="Ingen information" />
        </Box>
    )
}
