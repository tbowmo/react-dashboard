import { useEffect, useState } from 'react'

const apiUrl = 'https://api.openweathermap.org/data/2.5'
const apiKey = process.env.REACT_APP_OW_KEY
const city = process.env.REACT_APP_OW_CITYID

interface Weather {
  id: number,
  main: string,
  description: string,
  icon: string,
}

interface CurrentWeather {
    coord: {
      lon: number,
      lat: number,
    },
    weather: Weather[],
    base: string,
    main: {
      temp: number,
      pressure: number,
      humidity: number,
      temp_min: number,
      temp_max: number,
    },
    visibility: number,
    wind: {
      speed: number,
      deg: number,
    },
    clouds: {
      all: number,
    },
    dt: number,
    sys: {
      type: number,
      id: number,
      message: number,
      country: string,
      sunrise: number,
      sunset: number,
    },
    timezone: number,
    id: number,
    name: string,
    cod: number,
}

interface Forecast {
  cod: number,
  message: number,
  cnt: number,
  city: {
    id: number,
    name: string,
    coord: {
        lat: number,
        lon: number,
    },
    country: string,
    timezone: number,
    sunrise: number,
    sunset: number,
  },
  list: ForecastTupple[],
}

interface ForecastTupple {
  dt: number,
  main: {
      temp: number,
      temp_min: number,
      temp_max: number,
      pressure: number,
      sea_level: number,
      grnd_level: number,
      humidity: number,
      temp_kf: number,
  },
  weather: Weather[],
  clouds: {
      all: number,
  },
  wind: {
      speed: number,
      deg: number,
  },
  sys: {
      pod: string,
  },
  dt_txt: string,
}

export function useCurrentWeather(): CurrentWeather | undefined {
    const [weather, setWeather] = useState<CurrentWeather | undefined> (undefined)

    useEffect(() => {
        if (weather === undefined) {
            fetch(`${apiUrl}/weather?id=${city}&appid=${apiKey}&lang=da&units=metric`)
                .then((response) => response.json())
                .then((data) => setWeather(data))
        }
    }, [weather, setWeather])
    return weather
}

export function useForecastWeather(): Forecast | undefined {
    const [weather, setWeather] = useState<Forecast | undefined>(undefined)

    useEffect(() => {
        if (weather === undefined) {
            fetch(`${apiUrl}/forecast?id=${city}&appid=${apiKey}&lang=da&units=metric`)
                .then((response) => response.json())
                .then((data) => setWeather(data))
        }
    }, [weather, setWeather])
    return weather
}
