import { Express } from 'express'
import { createSession, createChannel } from 'better-sse'
import { Mqtt } from '../../mqtt/mqtt'
import { MemoryStore } from '../../mqtt/memory-store'

const channel = createChannel()
const store = MemoryStore.get(channel)

function initMqttListener(mqtt: Mqtt) {
  mqtt?.addListener('home/#', async (topic: string, payload: string) => {
    if (
      !topic.endsWith('/dt') &&
      !topic.endsWith('/set') &&
      !topic.endsWith('/control')
    ) {
      await store.updateStore(topic, payload)
    }
  })
}

export function registerSse(app: Express, mqtt: Mqtt) {
  // Delay mqtt listener startup, in order to stabilize database layer.
  setTimeout(() => initMqttListener(mqtt), 2000)
  return app.get('/api/sse', async (req, res) => {
    const session = await createSession(req, res)
    channel.register(session)
    session.push(store.getStore(), 'initial')
  })
}
