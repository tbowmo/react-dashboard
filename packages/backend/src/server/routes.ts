import { WeatherController } from './controller/WeatherController'
import { RemoteController } from './controller/remote'
import { Mqtt } from '../mqtt/mqtt'
import { SurveillanceController } from './controller/surveillance'

type Route = {
  method: 'get' | 'post' | 'delete'
  route: string
  action: string
  controller: WeatherController | RemoteController | SurveillanceController
}

export function Routes(mqtt: Mqtt, base = '/api'): Route[] {
    const weatherController = new WeatherController()
    const remoteController = new RemoteController(mqtt)
    const surveillanceController = new SurveillanceController()

    return [
        {
            method: 'get',
            route: `${base}/surveillance/streams`,
            controller: surveillanceController,
            action: 'streams',
        },
        {
            method: 'get',
            route: `${base}/weather/forecast`,
            controller: weatherController,
            action: 'forecast',
        },
        {
            method: 'get',
            route: `${base}/weather/current`,
            controller: weatherController,
            action: 'currentWeather',
        },
        {
            method: 'get',
            route: `${base}/remote/:room/:command`,
            controller: remoteController,
            action: 'remote',
        },
        {
            method: 'get',
            route: `${base}/deviceSet/:room/:type/:device/:value`,
            controller: remoteController,
            action: 'deviceSet',
        },
        {
            method: 'post',
            route: `${base}/media/:room/play`,
            controller: remoteController,
            action: 'mediaPlay',
        },
        {
            method: 'get',
            route: `${base}/media/:room/update`,
            controller: remoteController,
            action: 'updateMedia',
        },
    ]
}
