import { configureStore, Action } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { ThunkAction } from 'redux-thunk'

// eslint-disable-next-line import/no-cycle
import rootReducer from './root-reducer'

const store = configureStore({
  reducer: rootReducer,
  devTools: import.meta.env.DEV,
})

if (import.meta.env.DEV) {
  // module.hot.accept('./root-reducer', () => {
  //   // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  //   const newRootReducer = require('./root-reducer').default
  //   store.replaceReducer(newRootReducer)
  // })
}

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()

export type AppThunk = ThunkAction<void, RootState, unknown, Action<string>>
export type RootState = ReturnType<typeof rootReducer>
export default store
