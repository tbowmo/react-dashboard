import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '../use-api'
import { addHours } from 'date-fns'

type SpotPrice = {
  SpotPriceEUR: number
  HourUTC: string
  HourDK: string
  _full_text: string
  _id: number
  PriceArea: string
  SpotPriceDKK: number | undefined
}

type Tarrifs = {
  data: { [hour in number]: number }
  loaded: boolean
  validToDate: string | undefined
}

export type UtilityState = {
  prices: SpotPrice[]
  tarrifs: Tarrifs
}

const initialState: UtilityState = {
  prices: [],
  tarrifs: {
    data: {},
    loaded: false,
    validToDate: undefined,
  },
}

const baseUrl = 'https://api.energidataservice.dk/datastore_search_sql?sql='

type DataHub<T> = {
  result: {
    records: T
  }
}

type TransportTarrif = {
  TransparentInvoicing: string
  ChargeTypeCode: string
  Note: string
  ValidFrom: string
  ChargeOwner: string
  Description: string
  ResolutionDuration: string
  ValidTo: string
  'GLN-Number': string
  _id: number
  _full_text: string
  TaxIndicator: string
  ChargeType: string
  VATClass: string
  Price1: number
  Price2: number
  Price3: number
  Price4: number
  Price5: number
  Price6: number
  Price7: number
  Price8: number
  Price9: number
  Price10: number
  Price11: number
  Price12: number
  Price13: number
  Price14: number
  Price15: number
  Price16: number
  Price17: number
  Price18: number
  Price19: number
  Price20: number
  Price21: number
  Price22: number
  Price23: number
  Price24: number
}

export const fetchTarrifs = createAsyncThunk(
  'utility/tarrifs',
  async (): Promise<Tarrifs['data']> => {
    const [todayDate] = new Date().toISOString().split('T')
    const conditions = [
      `"ValidTo">'${todayDate}'`,
      `"ValidFrom"<='${todayDate}'`,
      '"ChargeTypeCode" like \'CD%\'', // Nettarif C
      '"ChargeType"=\'D03\'', // Tarif
      '"GLN-Number"=\'5790001089030\'',
    ]

    const sql = `SELECT * from "datahubpricelist" where ${conditions.join(
      ' and ',
    )}`
    const data = api<DataHub<TransportTarrif[]>>(`${baseUrl}${sql}`).then(
      (response) => {
        return response.result.records
          .map((item) => {
            const prices: number[] = []
            for (let i = 1; i <= 24; i += 1) {
              prices.push(item[`Price${i}`] as number)
            }
            return prices
          })
          .reduce((sum: { [i in number]: number }, a: number[]) => {
            const c: { [i in number]: number } = {}
            a.forEach((b, i) => {
              c[i] = (sum[i] || 0) + b
            })
            return c
          }, {})
      },
    )
    return data
  },
)

export const fetchPrices = createAsyncThunk('utility/prices', async () => {
  const dateTime = addHours(new Date(), -1).toISOString()

  const conditions = ['"PriceArea"=\'DK1\'', `"HourDK">'${dateTime}'`]

  const sql = `SELECT * from "elspotprices" where ${conditions.join(
    ' and ',
  )} order by "HourDK" asc`

  const data = api<DataHub<SpotPrice[]>>(`${baseUrl}${sql}`).then(
    (response) => {
      return response.result.records.map((item) => {
        return {
          ...item,
          SpotPriceEUR: item.SpotPriceEUR,
          SpotPriceDKK: item.SpotPriceDKK ? item.SpotPriceDKK : undefined,
        }
      })
    },
  )
  return data
})

const utility = createSlice({
  name: 'Weather',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTarrifs.fulfilled, (state, action) => ({
      ...state,
      tarrifs: {
        ...state.tarrifs,
        data: action.payload,
        loaded: true,
      },
    }))

    builder.addCase(fetchPrices.fulfilled, (state, action) => ({
      ...state,
      prices: action.payload,
    }))
  },
})

export default utility.reducer
