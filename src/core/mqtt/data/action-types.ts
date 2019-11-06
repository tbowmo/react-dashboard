import { MqttClient } from "mqtt"

export type Subscribe = {
    type: 'subscribe',
    payload: string,
}

export type Incomming = {
    type: 'incomming',
    payload: {
        topic: string,
        payload: string,
    }
}

export type Connect = {
    type: 'connect',
    payload: MqttClient,
}

export type MqttActions =
    | Subscribe
    | Incomming
    | Connect
