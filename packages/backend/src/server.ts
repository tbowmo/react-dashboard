import 'reflect-metadata'
import express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { Routes } from './server/routes'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import { registerSse } from './server/controller/sse'
import cors = require('cors')
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

const mqtt = Mqtt.getInstance('mqtt://192.168.3.117')

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

app.use(express.static(path.resolve('packages', 'frontend', 'build')))

app.get('*', (_req, res) => {
  res.sendFile(path.resolve('packages', 'frontend', 'build', 'index.html'))
})

// start express server
app.listen(5000)
