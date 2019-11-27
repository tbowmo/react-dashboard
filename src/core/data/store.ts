import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { mqttReducer, MqttState } from './mqtt/reducer'
import { weatherReducer, WeatherState } from './weather/reducer'

export const reducers = combineReducers({
    mqtt: mqttReducer,
    weather: weatherReducer,
})

export type combinedState = {
    mqtt: MqttState,
    weather: WeatherState
}

export default function configureStore(initialState?) {
    return createStore(
        reducers,
        initialState,
        applyMiddleware(thunk)
    )
}
