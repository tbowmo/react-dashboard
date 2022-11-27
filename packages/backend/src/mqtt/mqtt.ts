import * as MQTT from 'mqtt'
import match = require('mqtt-match')

export type Callback = (topic: string, payload: string) => void

type CallbackHandlers = {
  callback: Callback
  topic: string
}

export class Mqtt {
  private static instance: Mqtt

  private client: MQTT.MqttClient

  private callbacks: CallbackHandlers[] = []

  public static getInstance(host?: string) {
    if (!Mqtt.instance) {
      if (host === undefined) {
        throw new Error('Host is not defined in initial call!')
      }
      Mqtt.instance = new Mqtt(host)
    }
    return Mqtt.instance
  }

  private constructor(host: string) {
    this.client = MQTT.connect(host)
    // eslint-disable-next-line no-console
    this.client.on('error', (error) => console.log(error))
    this.client.on('message', (topic, payload) => {
      this.handleCallbacks(topic, payload)
    })
    this.client.on('disconnect', () => {
      this.client.reconnect()
    })
    this.client.on('connect', () => {
      this.callbacks.forEach((cb) => {
        this.client.subscribe(cb.topic)
      })
    })
  }

  public addListener(topic: string, callback: Callback) {
    this.client.subscribe(topic)
    this.callbacks.push({
      topic,
      callback,
    })
  }

  private handleCallbacks(topic: string, payload: Buffer) {
    this.callbacks.forEach((callback) => {
      if (match(callback.topic, topic)) {
        callback.callback(topic, payload.toString())
      }
    })
  }

  public publish(topic: string, message: string | unknown) {
    if (typeof message === 'string') {
      this.client.publish(topic, message)
    } else {
      this.client.publish(topic, JSON.stringify(message))
    }
  }
}
