import {
    Request,
} from 'express'
import { Mqtt } from '../../mqtt/mqtt'
import { getStore } from '../../mqtt/memory-store'

export class RemoteController {
    private mqtt: Mqtt = Mqtt.getInstance()
    private readonly scenes = ['dvd', 'audio', 'video', 'wii', 'off', 'ps2']
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async remote(request: Request) {
        const { room, command } = request.params
        if (this.scenes.includes(command)) {
            this.mqtt.publish(`home/${room}/avctrl/scene/set`, command)
        } else {
            this.mqtt.publish(`home/${room}/avctrl/control/set`, command)
        }
        return 'ok'
    }

    async light(request: Request) {
        const {
            room,
            device,
            value,
        } = request.params
        this.mqtt.publish(`home/${room}/lights/${device}/set`, value)
        return 'ok'
    }

    async switch(request: Request) {
        const {
            room,
            device,
            value,
        } = request.params
        this.mqtt.publish(`home/${room}/switch/${device}/set`, value)
        return 'ok'
    }

    async deviceSet(request: Request) {
        const {
            room,
            type,
            device,
            value,
        } = request.params

        const state = getStore()
        if (Object.keys(state).includes(room) && type in ['light', 'switch', 'chicken']) {
            this.mqtt.publish(`home/${room}/${type}/${device}/set`, value)
            return 'ok'
        }
    }
}
