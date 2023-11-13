import { WeatherController } from './controller/WeatherController'
import { RemoteController } from './controller/remote'
import { Mqtt } from '../mqtt/mqtt'
import { SurveilanceController } from './controller/surveilance'

type Route = {
  method: 'get' | 'post' | 'delete'
  route: string
  action: string
  controller: WeatherController | RemoteController | SurveilanceController
}

export function Routes(mqtt: Mqtt): Route[] {
    const weatherController = new WeatherController()
    const remoteController = new RemoteController(mqtt)
    const surveilanceController = new SurveilanceController()

    return [
        {
            method: 'get',
            route: '/surveilance/streams',
            controller: surveilanceController,
            action: 'streams',
        },
        {
            method: 'get',
            route: '/weather/forecast',
            controller: weatherController,
            action: 'forecast',
        },
        {
            method: 'get',
            route: '/weather/current',
            controller: weatherController,
            action: 'currentWeather',
        },
        {
            method: 'get',
            route: '/remote/:room/:command',
            controller: remoteController,
            action: 'remote',
        },
        {
            method: 'get',
            route: '/deviceSet/:room/:type/:device/:value',
            controller: remoteController,
            action: 'deviceSet',
        },
        {
            method: 'post',
            route: '/media/:room/play',
            controller: remoteController,
            action: 'mediaPlay',
        },
        {
            method: 'get',
            route: '/media/:room/update',
            controller: remoteController,
            action: 'updateMedia',
        },
    ]
}
