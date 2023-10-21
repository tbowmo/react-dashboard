import {
    CssBaseline,
    ThemeProvider,
    StyledEngineProvider,
} from '@mui/material'
import React from 'react'
import { SSEHandler } from '../data/sse/sse-handler'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { RecoilRoot } from 'recoil'
import { theme } from './theme'
import { AppRoutes } from './app-routes'
import { time } from '../time-constants'
import ErrorBoundary from './error-boundary'

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: time.minute * 10,
            gcTime: time.hour * 5,
            suspense: true,
        },
    },
})

export function App() {
    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ErrorBoundary>
                    <RecoilRoot>
                        <SSEHandler>
                            <QueryClientProvider client={queryClient}>
                                <ReactQueryDevtools />
                                <AppRoutes />
                            </QueryClientProvider>
                        </SSEHandler>
                    </RecoilRoot>
                </ErrorBoundary>
            </ThemeProvider>
        </StyledEngineProvider>
    )
}
