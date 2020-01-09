import { MqttClient } from 'mqtt'
import * as React from 'react'
import {
    useDispatch,
    useSelector,
} from 'react-redux'
import {
    connectMqtt,
    incommingMsg,
    subscribe,
} from './mqtt/actions'
import { MqttDataEntry, MqttState } from './mqtt/reducer'

const match = require('mqtt-match')

type Props = {
    mqttHost: string,
    children?: any,
}

export function MqttConnect(props: Props) {
    const dispatch = useDispatch()
    dispatch(connectMqtt(props.mqttHost))
    const client = useSelector((state) => state.mqtt.client)
    if (client !== undefined) {
        client.on('message', (topic, payload) => {
            dispatch(incommingMsg(topic, payload.toString()))
        })
    }
    return (
        props.children
    )
}

function useSubscribe(topic: string): {topic: string, payload: string} | undefined {
    const dispatch = useDispatch()
    const { data, subscriptions } = useSelector( (state) => state.mqtt ) as MqttState
    
    const x = React.useMemo(() => {
        let d = data[topic]
        if (d === undefined) {
            const key = Object.values(data)
                .sort((a: MqttDataEntry, b: MqttDataEntry) => b.timestamp - a.timestamp)
                .find((b: MqttDataEntry) => {
                    return match(topic, b.topic)
                }) as MqttDataEntry
            if (key !== undefined) {
                d = data[key.topic]
            }
        }
        return d
    }, [data, topic])

    React.useEffect(() => {
        const s = subscriptions.find((sub) => match(topic, sub))
        if (s === undefined) {
            dispatch(subscribe(topic))
        }
    }, [subscriptions, dispatch, topic])
    return x
}

export function useSubscribeStringPayload(topic: string): string | undefined {
    const value = useSubscribe(topic)
    if (value) {
        return value.payload
    }
}

export function useSubscribeNumberPayload(topic: string): number | undefined {
    const value = useSubscribe(topic)
    if (value) {
        return parseFloat(value.payload)
    }
}

export type Capabilities = {
    app: string,
    state: string,
    volume: number,
    muted: boolean, 
    app_icon: string,
    supported_features: {
        skip_fwd: boolean,
        skip_bck: boolean,
        pause: boolean,
        volume: boolean,
        mute: boolean,
    },
}

export type Media = {
    title: string,
    artist: string,
    album: string,
    album_art: string,
    media_type: number,
    type: number,
    duration: number,
    current_time: number,
    start_time: number,
}

export function useCapabilities(): Capabilities | undefined {
    const capabilities = useSubscribe('media/stuen/capabilities')
    return React.useMemo(() => {
        if (capabilities) {
            return JSON.parse(capabilities.payload)
        }
    }, [capabilities])
}

export function useMedia(): Media | undefined {
    const media = useSubscribe('media/stuen/media')
    return React.useMemo(() => {
        if (media) {
            return JSON.parse(media.payload)
        }
    }, [media])
}

export function useMqttClient(): MqttClient | undefined {
    return useSelector( (state) => state.mqtt.client)
}