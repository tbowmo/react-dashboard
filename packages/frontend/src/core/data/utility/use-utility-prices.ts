import {
    format,
    isBefore,
    parseISO,
} from 'date-fns'
import { useMemo } from 'react'
import {
    DataHub,
    SpotPrice,
    TransportTarrif,
} from './utility-type'
import { api } from '../use-api'
import { strongStore } from '../sse/sse-atom'
import { Utility } from '@dashboard/types'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useRecoilValue } from 'recoil'

const baseUrl = 'https://api.energidataservice.dk/dataset/'

function useTarrif(): { [hour in number]: number } | undefined {
    const { data } = useQuery({
        queryKey: ['utility', 'tarrif'],
        queryFn: async () => {
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

    return data
}

function useSpotPrices() {
    const { data } = useQuery({
        queryKey: ['utility', 'spot'],
        queryFn: async () => {
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
    return data
}


export function useUtilityPrices(hoursAhead = 12) {
    const tarrifs = useTarrif()
    const prices = useSpotPrices()
    const govCharge = useRecoilValue(strongStore<Utility>('global', 'utility'))?.gov_charge_dkk ?? 0

    return useMemo(() => {
        if (!tarrifs || !prices) {
            return
        }

        const tarrifValues = Object.values(tarrifs)
        const currentDate = new Date()
        const futurePrices = prices.filter(
            (item) => new Date(item.HourDK) > currentDate,
        )

        const calculatedPrices = futurePrices
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
        return calculatedPrices?.slice(0, hoursAhead)
    }, [govCharge, hoursAhead, prices, tarrifs])
}

export function useLastUpdated(): Date | undefined {
    const client = useQueryClient()
    const cache = client.getQueryCache()
    const spotUpdated = cache.find({ queryKey: ['utility', 'spot'] })?.state.dataUpdatedAt

    return spotUpdated ? new Date(spotUpdated) : undefined
}
