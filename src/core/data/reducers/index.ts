import { combineReducers } from "redux"
import { mqttReducer, MqttState } from './mqtt'
import { weatherReducer, WeatherState } from './weather'

export const reducers = combineReducers({
    mqtt: mqttReducer,
    weather: weatherReducer,
})

export type combinedState = {
    mqtt: MqttState,
    weather: WeatherState
}
export * from './mqtt'
export * from './weather'
