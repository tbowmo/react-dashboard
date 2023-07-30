import {
    format,
    isBefore,
    parseISO,
} from 'date-fns'
import { useEffect, useMemo } from 'react'
import {
    atom,
    DefaultValue,
    selector,
    useRecoilValue,
    useResetRecoilState,
} from 'recoil'
import {
    DataHub,
    SpotPrice,
    TransportTarrif,
} from './utility-type'
import { api } from '../use-api'
import { strongStore } from '../sse/sse-atom'
import { Utility } from '@dashboard/types'

const baseUrl = 'https://api.energidataservice.dk/dataset/'

const refreshData = atom<number>({
    key: 'RefreshData',
    default: Date.now(),
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

        const now = Date.now()
        return response.records
            .filter(
                (item) =>
                    isBefore(parseISO(item.ValidFrom), now) &&
          isBefore(now, parseISO(item.ValidTo || '3000-01-01')),
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

const priceSelector = selector({
    key: 'totalPriceSelector',
    get: ({ get }) => {
        const tarrifs = get(tarrifSelector)
        const prices = get(spotPriceSelector)

        const govCharge = (get(strongStore<Utility>('global', 'utility')))?.gov_charge_dkk ?? 0

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
                    govCharge,
                    totalPrice: (price + tarrif + govCharge) * 1.25,
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
            set(refreshData, Date.now())
        }
    },
})

export function useUtilityPrices(hoursAhead = 12) {
    const prices = useRecoilValue(priceSelector)
    const resetPrices = useResetRecoilState(priceSelector)
    const currentFetchedTime = useRecoilValue(refreshData)

    useEffect(() => {
        const timeSinceLast = Date.now() - currentFetchedTime
        if (prices && prices.length < hoursAhead && (timeSinceLast > 15 * 60 * 1000)) {
            resetPrices()
        }
    }, [prices, hoursAhead, resetPrices, currentFetchedTime])

    return useMemo(() => prices?.slice(0, hoursAhead), [hoursAhead, prices])
}

export function useLastUpdated(): Date {
    const timeStamp = useRecoilValue(refreshData)
    return useMemo(() => new Date(timeStamp), [timeStamp])
}
