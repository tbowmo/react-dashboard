import { format, isAfter, isBefore, parseISO } from 'date-fns'
import { useEffect, useMemo } from 'react'
import {
  atom,
  DefaultValue,
  selector,
  useRecoilValue,
  useResetRecoilState,
} from 'recoil'
import { DataHub, SpotPrice, TransportTarrif } from './utility-type'
import { api } from '../use-api'

const baseUrl = 'https://api.energidataservice.dk/dataset/'

const refreshData = atom<number>({
  key: 'RefreshData',
  default: 0,
})

const tarrifSelector = selector<{ [hour in number]: number } | undefined>({
  key: 'TarrifSelector',
  get: async ({ get }) => {
    get(refreshData)
    const filter = JSON.stringify({
      ChargeTypeCode: 'CD,CD R', // Nettarif C
      ChargeType: 'D03', // Tarif
      GLN_Number: '5790001089030',
    })

    const response = await api<DataHub<TransportTarrif[]>>(
      `${baseUrl}DatahubPricelist?filter=${filter}`,
    )

    return response.records
      .filter(
        (item) =>
          isBefore(parseISO(item.ValidFrom), Date.now()) &&
          isAfter(parseISO(item.ValidTo), Date.now()),
      )
      .map((item) => {
        const prices: number[] = []
        for (let i = 1; i <= 24; i += 1) {
          prices.push(item[`Price${i}`] as number)
        }
        return prices
      })
      .reduce(
        (
          sum: {
            [i in number]: number
          },
          a: number[],
        ) => {
          const c: {
            [i in number]: number
          } = {}
          a.forEach((b, i) => {
            c[i] = (sum[i] || 0) + b
          })
          return c
        },
        {},
      )
  },
})

const spotPriceSelector = selector({
  key: 'SpotPriceSelector',
  get: async ({ get }) => {
    get(refreshData)
    const filter = JSON.stringify({ PriceArea: 'DK1' })

    const response = await api<DataHub<SpotPrice[]>>(
      `${baseUrl}ElspotPrices?start=Now&filter=${filter}&sort=HourDK`,
    )
    return response.records.map((item) => {
      return {
        ...item,
        SpotPriceEUR: item.SpotPriceEUR,
        SpotPriceDKK: item.SpotPriceDKK ? item.SpotPriceDKK : undefined,
      }
    })
  },
})

export const priceSelector = selector({
  key: 'totalPriceSelector',
  get: ({ get }) => {
    const tarrifs = get(tarrifSelector)
    const prices = get(spotPriceSelector)

    if (!tarrifs || !prices) {
      return
    }

    const tarrifValues = Object.values(tarrifs)
    const currentDate = new Date()
    const futurePrices = prices.filter(
      (item) => new Date(item.HourDK) > currentDate,
    )

    return futurePrices
      .map((item) => {
        const hour = parseISO(item.HourDK).getHours()
        const tarrif = tarrifValues[hour]
        const price = (item.SpotPriceDKK || item.SpotPriceEUR * 7.5) / 1000
        return {
          hour: item.HourDK,
          price,
          tarrif,
          totalPrice: (price + tarrif + 0.008) * 1.25,
        }
      })
      .sort((a, b) => new Date(a.hour).getTime() - new Date(b.hour).getTime())
      .map((item) => ({
        ...item,
        hour: format(parseISO(item.hour), 'HH:mm'),
      }))
  },
  set: ({ set }, value) => {
    if (value instanceof DefaultValue) {
      set(refreshData, (v) => v + 1)
    }
  },
})

export function useUtilityPrices(hoursAhead = 12) {
  const prices = useRecoilValue(priceSelector)
  const resetPrices = useResetRecoilState(priceSelector)

  useEffect(() => {
    if (prices && prices.length < hoursAhead) {
      resetPrices()
    }
  }, [prices, hoursAhead, resetPrices])
  return useMemo(() => prices?.slice(0, hoursAhead), [hoursAhead, prices])
}
