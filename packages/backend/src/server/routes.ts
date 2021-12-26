import { WeatherController } from './controller/WeatherController'
import { ChannelController } from './controller/ChannelController'
import { RemoteController } from './controller/remote'

type Route = {
  method: 'get' | 'post' | 'delete'
  route: string
  action: string
  controller: WeatherController | ChannelController | RemoteController
}

export function Routes(): Route[] {
  const weatherController = new WeatherController()
  const channelController = new ChannelController()
  const remoteController = new RemoteController()
  return [
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
      route: '/channels/list/:type',
      controller: channelController,
      action: 'channelList',
    },
    {
      method: 'get',
      route: '/channels/current/:xmlid',
      controller: channelController,
      action: 'currentProgramme',
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
