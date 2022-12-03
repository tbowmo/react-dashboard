import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './core/data/store'
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material'
import { theme } from './theme'
import { RecoilRoot } from 'recoil'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <Router>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Provider store={store}>
            <RecoilRoot>
              <App />
            </RecoilRoot>
          </Provider>
        </ThemeProvider>
      </StyledEngineProvider>
    </Router>
  </React.StrictMode>,
)
