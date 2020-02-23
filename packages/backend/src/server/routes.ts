import { WeatherController } from './controller/WeatherController'
import { StreamController } from './controller/StreamController'
import { RemoteController } from './controller/remote'

type Route = {
    method: 'get' | 'post' | 'delete',
    route: string,
    action: string,
    controller: Object,
}

export const Routes: Route[] = [{
    method: 'get',
    route: '/weather/forecast',
    controller: WeatherController,
    action: 'forecast',
}, {
    method: 'get',
    route: '/weather/current',
    controller: WeatherController,
    action: 'currentWeather',
}, {
    method: 'get',
    route: '/streams/list/:type',
    controller: StreamController,
    action: 'streamList',
}, {
    method: 'get',
    route: '/remote/:room/:command',
    controller: RemoteController,
    action: 'remote',
}, {
    method: 'get',
    route: '/deviceSet/:room/:type/:device/:value',
    controller: RemoteController,
    action: 'deviceSet',
}, {
    method: 'post',
    route: '/media/:room/play',
    controller: RemoteController,
    action: 'mediaPlay',
},
]
