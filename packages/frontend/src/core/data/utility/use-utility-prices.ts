import {
    format,
    isAfter,
    isBefore,
    parseISO,
    startOfHour,
    subHours,
} from 'date-fns'
import { useMemo } from 'react'
import {
    DataHub,
    SpotPrice,
    TransportTarrif,
} from './utility-type'
import { api } from '../use-api'
import { useStrongTypedDevices } from '../sse/sse-atom'
import { Utility } from '@dashboard/types'
import { useSuspenseQuery, useQueryClient } from '@tanstack/react-query'

const baseUrl = 'https://api.energidataservice.dk/dataset/'

function useTarrif(): { [hour in number]: number } | undefined {
    const { data } = useSuspenseQuery({
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
    const { data } = useSuspenseQuery({
        queryKey: ['utility', 'spot'],
        queryFn: async () => {
            const filter = JSON.stringify({ PriceArea: 'DK1' })
            
            const date = subHours(startOfHour(Date.now()), 1)
            const dateStr = format(date, "yyyy-MM-dd'T'HH:mm")

            const response = await api<DataHub<SpotPrice[]>>(
                `${baseUrl}ElspotPrices?start=${dateStr}&filter=${filter}&sort=HourDK`,
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
    const govCharge = useStrongTypedDevices<Utility>('global', 'utility')?.gov_charge_dkk ?? 0

    return useMemo(() => {
        if (!tarrifs || !prices) {
            return
        }

        const tarrifValues = Object.values(tarrifs)
        const currentDate = subHours(startOfHour(new Date()), 1)
        const futurePrices = prices.filter(
            (item) => isAfter(new Date(item.HourDK), currentDate),
        )

        const calculatedPrices = futurePrices
            .map((item) => {
                const hour = parseISO(item.HourDK).getHours()
                const tarrif = tarrifValues[hour]

                const price = (item.SpotPriceDKK || item.SpotPriceEUR * 7.5) / 1000

                return {
                    date: parseISO(item.HourDK),
                    price,
                    tarrif,
                    govCharge,
                    totalPrice: (price + tarrif + govCharge) * 1.25,
                }
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .map((item) => ({
                ...item,
                hour: format(item.date, 'HH:mm'),
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
