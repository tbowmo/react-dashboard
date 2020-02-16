import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./server/routes";
import * as path from 'path'
import { Weather } from "./server/entity/Weather";
import * as dotenv from 'dotenv'
import * as fs from "fs";
import ServerSide from './server/controller/sse'

const cors = require('cors');

let envFile = path.resolve('..', '..', '.env')

let database = 'database.sqlite'
let logging = true
if (process.env.NODE_ENV === 'production') {
    database = '/data/database.sqlite'
    logging = false
    envFile = path.resolve('.env')
}

if (fs.existsSync('/data/.env')) {
    envFile = path.resolve('/', 'data', '.env')
}

console.log(envFile)

dotenv.config({
    path: envFile
})

createConnection(
    {
        type: 'sqlite',
        database: database,
        synchronize: true,
        logging: logging,
        entities: [
            Weather
        ]
    }
).then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json())
    app.use(cors())
    app.use(ServerSide)
    // register express routes from defined application routes
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

    // setup express app here
    // ...

    console.log(path.resolve('packages',  'frontend', 'build'))
    app.use(express.static(path.resolve('packages',  'frontend', 'build')));

    app.get('*', (req,res) =>{
        res.sendFile(path.resolve('packages', 'frontend', 'build', 'index.html'));
    });
    
    // start express server
    app.listen(5000);
}).catch(error => console.log(error));
