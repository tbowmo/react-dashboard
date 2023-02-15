import { SSEProvider } from 'react-hooks-sse'
import { Box } from '@mui/material'
import { DashTop } from './core/dash-top/dash-top'
import { IotTabs } from './core/tabs/tabs'
import { SSEHandler } from './core/data'
import { TabsProvider } from './core/tabs/tabs-context'

export function App() {
  return (
    <SSEProvider endpoint="/api/sse">
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
