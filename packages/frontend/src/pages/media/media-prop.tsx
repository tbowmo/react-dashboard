import { Typography } from '@mui/material'
import { MediaCard } from './media-card'

type Props = {
  label: string
  value?: string
}

export function MediaProp(props: Props) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { label, value } = props

    if (!value) {
        return null
    }
    return (
        <MediaCard label={label}>
            <Typography
                sx={{
                    fontSize: '22pt',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}
            >
                {value}
            </Typography>
        </MediaCard>
    )
}
