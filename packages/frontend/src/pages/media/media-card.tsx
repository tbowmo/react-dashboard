import React from 'react'
import { Box, Typography } from '@mui/material'
import { GridCard } from '../../core/card-2-line/grid-card'

type Props = {
  label: string
  children: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export function MediaCard(props: Props) {
    const { label, children, onClick } = props

    return (
        <GridCard onClick={onClick}>
            <Box
                sx={{ display: 'grid', gridTemplateRows: 'max-content auto', gap: 1 }}
            >
                <Typography fontStyle="italic" sx={{ textDecoration: 'underline' }}>
                    {label}
                </Typography>
                {children}
            </Box>
        </GridCard>
    )
}
