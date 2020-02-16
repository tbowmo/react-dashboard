import * as express from 'express'
import * as SSE from 'express-sse'
import { Mqtt } from '../../mqtt/mqtt'
import { updateStore, getStore } from '../../mqtt/memory-store'
const app = express()

const sse = new SSE({}, { initialEvent: 'initial' })
app.get('/api/sse', sse.init)

const mqtt = Mqtt.getInstance('mqtt://192.168.1.64')

mqtt.addListener('home/#', (topic: string, payload: string) => {
    const type = updateStore(topic, payload)
    if (type) {
        sse.send({
            payload, 
            topic
        }, 'updates')
        sse.updateInit(getStore(), 'initial')
    }
})

export default app