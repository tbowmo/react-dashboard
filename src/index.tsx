import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom'
import history from './history'
import { MqttConnect } from './core/mqtt/mqtt';
import { Provider } from 'react-redux'
import { store } from './core/mqtt/data/store';

ReactDOM.render(
    <Router history={history}>
        <Provider store={store}>
            <MqttConnect mqttHost="wss://mqtt.juletraesfoden.dk:443/">
                <App />
            </MqttConnect>
        </Provider>
    </Router>, 
document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
