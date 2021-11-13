import { Request } from 'express'
import { Mqtt } from '../../mqtt/mqtt'
import { MemoryStore } from '../../mqtt/memory-store'

export class RemoteController {
  private mqtt: Mqtt = Mqtt.getInstance()
  private readonly scenes = ['dvd', 'audio', 'video', 'wii', 'off', 'ps2']
  private store = MemoryStore.get()

  async remote(request: Request) {
    const { room, command } = request.params
    if (this.scenes.includes(command)) {
      this.mqtt.publish(`home/${room}/avctrl/scene/set`, command)
    } else {
      this.mqtt.publish(`home/${room}/avctrl/control/set`, command)
    }
    return 204
  }

  async mediaPlay(request: Request) {
    const { room } = request.params
    const payload = request.body
    if (payload.hasOwnProperty('link')) {
      this.mqtt.publish(`home/${room}/media/control/play`, payload)
      return 204
    }
    return 400
  }

  async deviceSet(request: Request) {
    const { room, type, device, value } = request.params

    const state = this.store.getStore()
    if (
      Object.keys(state).includes(room) &&
      ['light', 'switch', 'chicken', 'avctrl'].includes(type)
    ) {
      this.mqtt.publish(`home/${room}/${type}/${device}/set`, value)
      return 204
    } else {
      return 400
    }
  }

  async updateMedia(request: Request) {
    const { room } = request.params

    this.mqtt.publish(`home/${room}/media/control/update`, '1')
    return 204
  }
}
