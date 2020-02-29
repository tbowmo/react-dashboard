import * as express from 'express'
import * as SSE from 'express-sse'
import { Mqtt } from '../../mqtt/mqtt'
import { updateStore, getStore } from '../../mqtt/memory-store'
const app = express()

const sse = new SSE({}, { initialEvent: 'initial' })
app.get('/api/sse', sse.init)

const mqtt = Mqtt.getInstance('mqtt://192.168.1.64')

function initMqttListener() {
    mqtt.addListener('home/#', async (topic: string, payload: string) => {
        if (!topic.endsWith('/dt')
            && !topic.endsWith('/set')
            && !topic.endsWith('/control')
        ) {
            const enrichedPayload = await updateStore(topic, payload)
            if (enrichedPayload !== undefined) {
                sse.send({
                    payload: enrichedPayload,
                    topic,
                }, 'updates')
                sse.updateInit(getStore(), 'initial')
            }
        }
    })

}

// Delay mqtt listener startup, in order to stabilize database layer.
setTimeout(initMqttListener, 2000)

export default app
