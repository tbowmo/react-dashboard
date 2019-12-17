import * as React from 'react'
import { LightDimmer } from '../scene/mqtt-light-dimmer'
import './scene.scss'
import { MqttSwitch } from './mqtt-switch'
import { MqttButton } from './mqtt-button'

export function Scene() {
    return (
        <div className="scene">
            <LightDimmer mqttPath="test" label="stuen" />
            <MqttSwitch mqttPath="" label="tv" />
            <MqttButton mqttPath="" label="tv" />
        </div>
    )
}
