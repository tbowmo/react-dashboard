import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material'
import { RecoilRoot } from 'recoil'
import { theme } from './theme'
import { App } from './app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Router>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RecoilRoot>
            <App />
          </RecoilRoot>
        </ThemeProvider>
      </StyledEngineProvider>
    </Router>
  </React.StrictMode>,
)
