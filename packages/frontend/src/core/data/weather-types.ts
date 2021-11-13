interface WeatherDto {
  id: number
  main: string
  description: string
  icon: string
}

export interface CurrentWeatherDto {
  coord: {
    lon: number
    lat: number
  }
  weather: WeatherDto[]
  base: string
  main: {
    temp: number
    pressure: number
    humidity: number
    temp_min: number
    temp_max: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    message: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export interface ForecastDto {
  cod: number
  message: number
  cnt: number
  city: {
    id: number
    name: string
    coord: {
      lat: number
      lon: number
    }
    country: string
    timezone: number
    sunrise: number
    sunset: number
  }
  list: ForecastTupple[]
}

export interface ForecastTupple {
  dt: number
  main: {
    temp: number
    temp_min: number
    temp_max: number
    pressure: number
    sea_level: number
    grnd_level: number
    humidity: number
    temp_kf: number
  }
  weather: WeatherDto[]
  clouds: {
    all: number
  }
  wind: {
    speed: number
    deg: number
  }
  sys: {
    pod: string
  }
  dt_txt: string
}
