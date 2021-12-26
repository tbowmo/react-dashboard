import 'reflect-metadata'
import { createConnection } from 'typeorm'
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { Request, Response } from 'express'
import { Routes } from './server/routes'
import * as path from 'path'
import { Weather } from './server/entity/weather'
import * as dotenv from 'dotenv'
import * as fs from 'fs'
import ServerSide from './server/controller/sse'
import { Channel } from './server/entity/channel'
import { Programme } from './server/entity/programme'
import * as cron from 'node-cron'
import { loadXmlTv } from './cronjobs/load-xml-tv'
import { XmlFile } from './server/entity/xmlfile'

import cors = require('cors')

let envFile = path.resolve('..', '..', '.env')

let database = 'database.sqlite'
let xmlDir = 'xmltv'
let logging = true
if (process.env.NODE_ENV === 'production') {
  database = '/data/database.sqlite'
  xmlDir = '/data/xmltv'
  logging = false
  envFile = path.resolve('.env')
}

if (fs.existsSync(path.resolve('/data/.env'))) {
  database = path.resolve('/data/database.sqlite')
  xmlDir = path.resolve('/data/xmltv')
  logging = false
  envFile = path.resolve('/', 'data', '.env')
}

dotenv.config({
  path: envFile,
})

createConnection(
  {
    type: 'sqlite',
    database,
    synchronize: true,
    logging,
    entities: [Channel, Programme, Weather, XmlFile],
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
)
  .then(async () => {
    loadXmlTv(xmlDir)

    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cors())
    app.use(ServerSide)

    // register express routes from defined application routes
    Routes().forEach(({ route, controller, method, action }) => {
      app[method](route, (req: Request, res: Response, next) => {
        const task = controller[action](req, res, next)
        if (task instanceof Promise) {
          task.then((result) =>
            result !== null && result !== undefined
              ? res.send(result)
              : undefined,
          )
        } else if (task !== null && task !== undefined) {
          res.json(task)
        }
      })
    })

    app.use(express.static(path.resolve('packages', 'frontend', 'build')))

    app.get('*', (_req, res) => {
      if (_req.url.toLowerCase().endsWith('.png')) {
        const file = path.parse(_req.url).base
        res.sendFile(path.resolve(xmlDir, file))
      } else {
        res.sendFile(
          path.resolve('packages', 'frontend', 'build', 'index.html'),
        )
      }
    })

    cron.schedule('0 0 * * *', () => {
      loadXmlTv(xmlDir)
    })
    // start express server
    app.listen(5000)
  })
  // eslint-disable-next-line no-console
  .catch((error) => console.log(error))
