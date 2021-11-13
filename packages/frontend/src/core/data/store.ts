import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { weatherReducer, WeatherState } from './weather/reducer'
import { streamReducer, StreamState } from './streams/reducer'
import { composeWithDevTools } from 'redux-devtools-extension'
import { SSEState, sseReducer } from './sse/reducer'

export const reducers = combineReducers({
  weather: weatherReducer,
  streams: streamReducer,
  sse: sseReducer,
})

export type combinedState = {
  sse: SSEState
  weather: WeatherState
  streams: StreamState
}

export default function configureStore(initialState?) {
  if (process.env.NODE_ENV === 'development') {
    return createStore(
      reducers,
      initialState,
      composeWithDevTools(applyMiddleware(thunk)),
    )
  }

  return createStore(reducers, initialState, applyMiddleware(thunk))
}
