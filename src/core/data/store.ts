import {
    createStore,
    applyMiddleware,
    combineReducers,
} from 'redux'
import thunk from 'redux-thunk'
import {
    mqttReducer,
    MqttState,
} from './mqtt/reducer'
import {
    weatherReducer,
    WeatherState,
} from './weather/reducer'
import {
    streamReducer,
    StreamState,
} from './streams/reducer'
import { composeWithDevTools } from 'redux-devtools-extension'

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
    if (process.env.NODE_ENV === 'development') {
        return createStore(reducers, 
            initialState, composeWithDevTools(
                applyMiddleware(thunk),
            ))
    }

    return createStore(
        reducers,
        initialState,
        applyMiddleware(thunk),
    )
}
