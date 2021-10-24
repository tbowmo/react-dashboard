import * as express from 'express'
import * as SSE from 'express-sse'
import { Mqtt } from '../../mqtt/mqtt'
import { MemoryStore } from '../../mqtt/memory-store'
const app = express()

const sse = new SSE()
app.get('/api/sse', sse.init)

const store = MemoryStore.get(sse)

const mqtt = Mqtt.getInstance('mqtt://192.168.3.117')

function initMqttListener() {
    mqtt.addListener('home/#', async (topic: string, payload: string) => {
        if (!topic.endsWith('/dt')
            && !topic.endsWith('/set')
            && !topic.endsWith('/control')
        ) {
            await store.updateStore(topic, payload)
        }
    })
}

// Delay mqtt listener startup, in order to stabilize database layer.
setTimeout(initMqttListener, 2000)

export default app
