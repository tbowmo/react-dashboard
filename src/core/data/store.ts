import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { mqttReducer, MqttState } from './mqtt/reducer'
import { weatherReducer, WeatherState } from './weather/reducer'
import { streamReducer, StreamState } from './streams/reducer'

export const reducers = combineReducers({
    mqtt: mqttReducer,
    weather: weatherReducer,
    streams: streamReducer,
})

export type combinedState = {
    mqtt: MqttState,
    weather: WeatherState,
    streams: StreamState,
}

export default function configureStore(initialState?) {
    return createStore(
        reducers,
        initialState,
        applyMiddleware(thunk)
    )
}
