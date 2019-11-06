import { createStore } from 'redux'
import { mqttReducer } from './reducer'

export const store = createStore(mqttReducer)
