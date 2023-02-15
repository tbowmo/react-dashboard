import { enableMapSet } from 'immer'
import { combineReducers } from '@reduxjs/toolkit'
import SSEReducer from './sse/sse.slice'
import WeatherReducer from './weather/weather.slice'
import utilityReducer from './utility/utility.slice'
import drReducer from './dr-media/dr-media.slice'

enableMapSet()

const rootReducer = combineReducers({
  sse: SSEReducer,
  weather: WeatherReducer,
  utility: utilityReducer,
  drMedia: drReducer,
})

export default rootReducer
