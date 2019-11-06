import { Subscribe, Incomming, Connect } from "./action-types";
import { connect } from "mqtt";

export function connectMqtt(host: string): Connect {
    const client = connect(host)
    return {
        type: 'connect',
        payload: client
    }
}

export function subscribe(topic: string): Subscribe {
    return {
        type: 'subscribe',
        payload: topic,
    }
}

export function incommingMsg(topic: string, payload: string): Incomming {
    return {
        type: 'incomming',
        payload: {
            topic,
            payload,
        }
    }
}
