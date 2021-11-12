import * as React from 'react'
import TextTruncate from 'react-text-truncate'
import { MediaCard } from './media-card'
import { Typography } from '@mui/material'

type Props = {
    label: string,
    lines?: number,
    value?: string,
}

export function MediaProp(props: Props) {
    const {
        label,
        lines = 1,
        value,
    } = props

    if (!value) {
        return null
    }
    return (
        <MediaCard label={label}>
            <Typography fontSize="large">
                <TextTruncate
                    line={lines}
                    truncateText="…"
                    text={value}
                />
            </Typography>
        </MediaCard>
    )
}