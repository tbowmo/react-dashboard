export type SpotPrice = {
  SpotPriceEUR: number
  HourUTC: string
  HourDK: string
  _full_text: string
  _id: number
  PriceArea: string
  SpotPriceDKK: number | undefined
}

export type TransportTarrif = {
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

export type DataHub<T> = {
  records: T
}
