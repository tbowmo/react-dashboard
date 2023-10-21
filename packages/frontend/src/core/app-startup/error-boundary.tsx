import React from 'react'
import { Box, Button } from '@mui/material'

type MyProps = {
    children: React.ReactNode
}

type MyState = {
    hasError: boolean
}

export default class ErrorBoundary extends React.Component<MyProps, MyState> {

    constructor(props: MyProps) {
        super(props)
        this.state = { hasError: false }
    }

    componentDidCatch(error: Error) {
        // eslint-disable-next-line no-console
        console.log(error)
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    reload() {
        window.location.reload()
    }

    render() {
        const { children } = this.props
        if (this.state.hasError) {
            return (
                <Box sx={{ width: '100%', height: '100%' }}>
                    Something happened, <Button variant="contained" onClick={() => this.reload()}>reload page</Button>
                </Box>    
            )
        }
        return children
    }
}
