import React from 'react'
import { DashTop } from './core/dash-top/dash-top'
import { IotTabs } from './core/tabs/tabs'
import { SSEProvider } from 'react-hooks-sse'
import { SSEHandler } from './core/data'
import { Box } from '@mui/material'
import { TabsProvider } from './core/tabs/tabs-context'

export function App() {
  return (
    <SSEProvider
      endpoint={
        process.env.NODE_ENV === 'development'
          ? 'http://localhost:5000/api/sse'
          : '/api/sse'
      }
    >
      <SSEHandler>
        <TabsProvider>
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: 'min-content 1fr',
              height: '100vh',
              width: '100vw',
            }}
          >
            <DashTop />
            <IotTabs />
          </Box>
        </TabsProvider>
      </SSEHandler>
    </SSEProvider>
  )
}
