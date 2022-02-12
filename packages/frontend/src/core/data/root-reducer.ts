import { enableMapSet } from 'immer'
import SSEReducer from './sse/sse.slice'
import WeatherReducer from './weather/weather.slice'
import utilityReducer from './utility/utility.slice'
import drReducer from './dr-media/dr-media.slice'
import { combineReducers } from '@reduxjs/toolkit'

enableMapSet()

const rootReducer = combineReducers({
  sse: SSEReducer,
  weather: WeatherReducer,
  utility: utilityReducer,
  drMedia: drReducer,
})

export default rootReducer
