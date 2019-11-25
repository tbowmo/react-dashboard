import { CurrentWeatherDto, ForecastDto } from '../data/weather-types'
import {
  useDispatch,
  useSelector,
} from 'react-redux'
import { CurrentWeather, combinedState } from '../data/reducers'
import { fetchCurrentWeatherPending, fetchCurrentWeatherSuccess } from '../data/weather-actions'

const apiUrl = 'https://api.openweathermap.org/data/2.5'
const apiKey = process.env.REACT_APP_OW_KEY
const city = process.env.REACT_APP_OW_CITYID


function currentWeather() {
    return (dispatch) => {
        dispatch(fetchCurrentWeatherPending)
        fetch(`${apiUrl}/weather?id=${city}&appid=${apiKey}&lang=da&units=metric`)
          .then((resp) => resp.json())
          .then((data) => {
            dispatch(fetchCurrentWeatherSuccess(data))
          })
    }
}

export function useCurrentWeather() {
    const weatherState = useSelector((state: combinedState) =>  state.weather.currentWeather) as CurrentWeather || {pending: false, data: undefined}
    const dispatch = useDispatch()
    if (weatherState.data === undefined && !weatherState.pending) {
        dispatch(currentWeather())
    }
    return weatherState.data
}

/*
export function useForecastWeather(): Forecast | undefined {
    const [weather, setWeather] = React.useState<Forecast | undefined>(undefined)

    React.useEffect(() => {
        if (weather === undefined) {
            fetch(`${apiUrl}/forecast?id=${city}&appid=${apiKey}&lang=da&units=metric`)
                .then((response) => response.json())
                .then((data) => setWeather(data))
        }
    }, [weather, setWeather])
    return weather
}
*/