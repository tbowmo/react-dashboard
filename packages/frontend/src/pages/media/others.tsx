import * as React from 'react'
import { 
    Album,
    Tv,
    Games,
} from '@mui/icons-material'
import { MediaProp } from './media-prop'
import { Box } from '@mui/material'

type Props = {
    type: string,
}

export function Others(props: Props) {

    const Icon = React.useMemo(() => {
        switch (props.type.toLowerCase())
        {
            case 'tv' :
                return Tv
            case 'wii':
            case 'ps2':
                return Games
            default:
                return Album
        }
    }, [props.type])

    return (
        <Box sx={{
            width: '100%',
            height: '100%',            
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <Icon sx={{fontSize: '80pt'}} />
            </Box>
            <MediaProp
                label=""
                value="Ingen information"
            />
        </Box>
    )
}

