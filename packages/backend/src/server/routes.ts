import { WeatherController } from './controller/WeatherController'
import { ChannelController } from './controller/ChannelController'
import { RemoteController } from './controller/remote'

type Route = {
  method: 'get' | 'post' | 'delete'
  route: string
  action: string
  controller: Object
}

export const Routes: Route[] = [
  {
    method: 'get',
    route: '/weather/forecast',
    controller: WeatherController,
    action: 'forecast',
  },
  {
    method: 'get',
    route: '/weather/current',
    controller: WeatherController,
    action: 'currentWeather',
  },
  {
    method: 'get',
    route: '/channels/list/:type',
    controller: ChannelController,
    action: 'channelList',
  },
  {
    method: 'get',
    route: '/channels/current/:xmlid',
    controller: ChannelController,
    action: 'currentProgramme',
  },
  {
    method: 'get',
    route: '/remote/:room/:command',
    controller: RemoteController,
    action: 'remote',
  },
  {
    method: 'get',
    route: '/deviceSet/:room/:type/:device/:value',
    controller: RemoteController,
    action: 'deviceSet',
  },
  {
    method: 'post',
    route: '/media/:room/play',
    controller: RemoteController,
    action: 'mediaPlay',
  },
  {
    method: 'get',
    route: '/media/:room/update',
    controller: RemoteController,
    action: 'updateMedia',
  },
]
