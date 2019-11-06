import { MqttActions } from "./action-types";
import { MqttClient } from "mqtt";

export type MqttDataEntry = {
    timestamp: number,
    topic: string, 
    payload: string,
}

export type MqttState = {
    subscriptions: string[],
    data: {
        [topic: string]: MqttDataEntry
    },
    client: MqttClient | undefined,
}

const initialState: MqttState = {
    subscriptions: [],
    data: {},
    client: undefined,
}

export function mqttReducer(state: MqttState = initialState, action: MqttActions) {
    switch (action.type) {
        case 'connect':
            return {
                ...state,
                client: action.payload
            }
        case 'subscribe':
            if (state.client && !state.subscriptions.includes(action.payload)) {
                state.client.subscribe(action.payload)
                return {
                    ...state,
                    subscriptions: [
                        ...state.subscriptions,
                        action.payload
                    ]
                }
            } else {
                return state
            }
        case 'incomming':
            return {
                ...state,
                data: {
                    ...state.data,
                    [action.payload.topic]: {
                        ...action.payload,
                        timestamp: Date.now(),
                    },
                }
            }
        default:
            return state;
    }
}
