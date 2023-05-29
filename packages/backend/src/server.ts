import 'reflect-metadata'
import * as path from 'path'
import * as fs from 'fs'
import express, { Request, Response } from 'express'
import * as bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import cors = require('cors')
import { Routes } from './server/routes'
import { registerSse } from './server/controller/sse'
import { Mqtt } from './mqtt/mqtt'

let envFile = path.resolve('..', '..', '.env')

if (process.env.NODE_ENV === 'production') {
    envFile = path.resolve('.env')
}

if (fs.existsSync(path.resolve('/data/.env'))) {
    envFile = path.resolve('/', 'data', '.env')
}

dotenv.config({
    path: envFile,
})

const mqtt = Mqtt.getInstance(
    process.env.BACKEND_MQTT_HOST || 'mqtt://localhost',
)

// create express app
const app = express()
app.use(bodyParser.json())
app.use(cors())
registerSse(app, mqtt)

// register express routes from defined application routes
Routes(mqtt).forEach(({ route, controller, method, action }) => {
    app[method](route, (req: Request, res: Response, next) => {
        const task = controller[action](req, res, next)
        if (task instanceof Promise) {
            task.then((result) =>
                result !== null && result !== undefined ? res.send(result) : undefined,
            )
        } else if (task !== null && task !== undefined) {
            res.json(task)
        }
    })
})

app.use(express.static(path.resolve('packages', 'frontend', 'dist')))

app.get('*', (_req, res) => {
    res.sendFile(path.resolve('packages', 'frontend', 'dist', 'index.html'))
})

// start express server
app.listen(5000)
