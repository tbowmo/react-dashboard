import { Request, Response } from 'express'
import axios from 'axios'

type RequestType = 'weather' | 'forecast'
type Cache = {
  timestamp: number
  json: string
}

const cache: Record<RequestType, Cache | undefined> = {
  forecast: undefined,
  weather: undefined,
}

export class WeatherController {
  readonly apiUrl = 'https://api.openweathermap.org/data/2.5'

  readonly city = process.env.REACT_APP_OW_CITYID

  readonly apiKey = process.env.REACT_APP_OW_KEY

  private buildOWUrl(type: RequestType): string {
    return `${this.apiUrl}/${type}?id=${this.city}&appid=${this.apiKey}&lang=da&units=metric`
  }

  /**
   * Caching (in memory) data from weather open weather map.
   */
  async getWeatherCaching(
    requestType: RequestType,
    timeout: number,
  ): Promise<string | undefined> {
    const cachedValue = cache[requestType]
    if (!cachedValue || cachedValue.timestamp < Date.now() / 1000 - timeout) {
      try {
        // eslint-disable-next-line no-console
        console.log(`Fetching weather data for ${requestType}`)
        const response = await axios.get(this.buildOWUrl(requestType))
        cache[requestType] = {
          timestamp: Date.now() / 1000,
          json: JSON.stringify(response.data),
        }
        return response.data
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    // eslint-disable-next-line no-console
    console.log(`cached value for ${requestType}`)
    return cachedValue?.json
  }

  async currentWeather(_request: Request, response: Response) {
    const weather = await this.getWeatherCaching('weather', 600)
    if (!weather) {
      response.status(404).send('Cannot get current weather')
      return undefined
    }
    return weather
  }

  async forecast(_request: Request, response: Response) {
    const weather = await this.getWeatherCaching('forecast', 600)
    if (!weather) {
      response.status(404).send('Cannot get forecast')
      return undefined
    }
    return weather
  }
}
