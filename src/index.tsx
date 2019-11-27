import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { Router } from 'react-router-dom'
import history from './history'
import { MqttConnect } from './core/data/use-mqtt'
import { Provider } from 'react-redux'
import configureStore from './core/data/store'

const store = configureStore()

ReactDOM.render(
    <Router history={history}>
        <Provider store={store}>
            <MqttConnect mqttHost={process.env.REACT_APP_MQTT_HOST}>
                <App />
            </MqttConnect>
        </Provider>
    </Router>, 
    document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
