import { SSEProvider } from 'react-hooks-sse'
import { Box } from '@mui/material'
import React from 'react'
import { DashTop } from './core/dash-top/dash-top'
import { IotTabs } from './core/tabs/tabs'
import { TabsProvider } from './core/tabs/tabs-context'
import { SSEAtomHandler } from './core/data/sse/sse-atom-handler'
import { SuspenseFallback } from './core/suspense-fallback'

export function App() {
  return (
    <SSEProvider endpoint="/api/sse">
      <SSEAtomHandler>
        <TabsProvider>
          <Box
            sx={{
              display: 'grid',
              gridTemplateRows: 'min-content 1fr',
              height: '100vh',
              width: '100vw',
            }}
          >
            <React.Suspense fallback={<SuspenseFallback />}>
              <DashTop />
              <IotTabs />
            </React.Suspense>
          </Box>
        </TabsProvider>
      </SSEAtomHandler>
    </SSEProvider>
  )
}
