import { responsiveFontSizes, createTheme } from '@mui/material'

const newTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#427AB2',
      light: '#246068',
      dark: '#012e34',
      contrastText: '#fff',
    },
    secondary: {
      main: '#D4B36A',
      light: 'AA8639',
      dark: '553A00',
      contrastText: '#000',
    },
    background: {
      default: '#123',
      paper: '',
    },
  },
})

export const theme = responsiveFontSizes(newTheme)
