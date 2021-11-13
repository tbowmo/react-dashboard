import { Request, Response } from 'express'
import axios from 'axios'
import { Weather } from '../entity/weather'
import { getRepository } from 'typeorm'

type RequestType = 'weather' | 'forecast'

export class WeatherController {
  readonly apiUrl = 'https://api.openweathermap.org/data/2.5'
  readonly city = process.env.REACT_APP_OW_CITYID
  readonly apiKey = process.env.REACT_APP_OW_KEY

  private readonly cacheRepository = getRepository(Weather)

  private buildOWUrl(type: RequestType): string {
    return `${this.apiUrl}/${type}?id=${this.city}&appid=${this.apiKey}&lang=da&units=metric`
  }

  private async getCachedValue(
    requestType: RequestType,
  ): Promise<Weather | undefined> {
    const cache = await this.cacheRepository
      .createQueryBuilder('cache')
      .where('cache.type = :weatherType', { weatherType: requestType })
      .orderBy('cache.timestamp', 'DESC')
      .getOne()
    return cache
  }

  private async setCachedValue(
    requestType: RequestType,
    json: string,
  ): Promise<void> {
    await this.cacheRepository.save({
      type: requestType,
      json,
      timestamp: Date.now() / 1000,
    })
  }

  async getWeather(
    requestType: RequestType,
    timeout: number,
  ): Promise<string | undefined> {
    let cachedValue = await this.getCachedValue(requestType)
    if (!cachedValue || cachedValue.timestamp < Date.now() / 1000 - timeout) {
      try {
        const response = await axios.get(this.buildOWUrl(requestType))
        await this.setCachedValue(requestType, JSON.stringify(response.data))
        return response.data
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    return cachedValue?.json
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async currentWeather(request: Request, response: Response) {
    const weather = await this.getWeather('weather', 600)
    if (!weather) {
      response.status(404).send('Cannot get current weather')
      return
    }
    return weather
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forecast(request: Request, response: Response) {
    const weather = await this.getWeather('forecast', 600)
    if (!weather) {
      response.status(404).send('Cannot get forecast')
      return
    }
    return weather
  }
}
