import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './core/data/store'
import { CssBaseline, ThemeProvider, StyledEngineProvider } from '@mui/material'
import { theme } from './theme'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <Router>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <App />
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  </Router>,
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
