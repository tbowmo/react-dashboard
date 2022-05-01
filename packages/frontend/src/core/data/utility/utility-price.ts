import { parseISO } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from '../store'
import { fetchPrices, fetchTarrifs } from './utility.slice'

function useTarrifs() {
  const tarrifs = useSelector((state: RootState) => state.utility.tarrifs)

  const dispatch = useAppDispatch()
  useEffect(() => {
    if (!tarrifs.loaded) {
      dispatch(fetchTarrifs())
    }
  }, [tarrifs.loaded, dispatch])
  return Object.values(tarrifs.data)
}

export function useUtilityPrices(hoursAhead: number) {
  const prices = useSelector((state: RootState) => state.utility.prices)
  const dispatch = useAppDispatch()
  const tarrifs = useTarrifs()
  const filteredPrices = useMemo(
    () =>
      prices
        .filter((item) => new Date(item.HourDK) > new Date())
        .slice(0, hoursAhead),
    [prices, hoursAhead],
  )

  useEffect(() => {
    if (filteredPrices.length < hoursAhead) {
      dispatch(fetchPrices())
    }
  }, [filteredPrices, hoursAhead, dispatch])

  return useMemo(() => {
    return filteredPrices.map((item) => {
      const hour = parseISO(item.HourDK).getHours()
      const tarrif = tarrifs[hour]
      const price = (item.SpotPriceDKK || item.SpotPriceEUR * 7.5) / 1000
      return {
        hour: item.HourDK,
        price,
        tarrif,
        totalPrice: price + tarrif,
      }
    })
  }, [filteredPrices, tarrifs])
}
