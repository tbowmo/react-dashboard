type SupportedFeatures = {
  skip_fwd: boolean
  skip_bck: boolean
  pause: boolean
  volume: boolean
  mute: boolean
}

export type Media = {
  title: string
  artist: string
  album: string
  album_art: string
  metadata_type: number
  content_id: string
  duration: number
  current_time: number
  start_time: number
  type: number
}

export type Capabilities = {
  app: string
  state: string
  volume: number
  muted: boolean
  app_icon: string
  supported_features: SupportedFeatures
}

export type ChromeCast = {
  app: Capabilities['app']
  capabilities: Capabilities
  device: string
  media: Media
  state: Capabilities['state']
}

export type RoomSensor = {
  temperature?: number
  dewpoint?: number
  humidity?: number
  barometer?: number
}

export type Room = {
  sensors?: RoomSensor
  avctrl?: {
    scene: string
  }
  media?: ChromeCast
  light?: Record<string, number>
}

export type Garden = {
  chickencoop: {
    door: boolean
  }
  climacell: Record<string, number>
}

export type Presence = Record<string, Record<string, boolean>>

export type Utility = {
  hour_Wh: number
  day_Wh: number
  week_Wh: number
  month_Wh: number
  year_Wh: number
  current_W: number
  current_Wh: number
  spot_price_eur: number
  spot_price_dkk: number
  transport_tarif_dkk: number
  spot_price_kwh_eur: number
  spot_price_kwh_dkk: number
  kwh_dkk: number
  gov_charge_dkk: number
}

export type Heating = Record<string, number>
export type Wifi = Record<string, string>
export type Misc = Record<string, string | number>

export type Global = {
  utility?: Utility
  heating?: Heating
  wifi?: Wifi
  misc?: Misc
}

export type HomeEntity = Room | Presence | Global | Garden

export type StrongHomeEntity<T extends HomeEntity> = T extends Room
  ? Room
  : T extends Garden
  ? Garden
  : T extends Global
  ? Global
  : Presence

export type Home = Record<string, HomeEntity>

export type Device = ChromeCast | RoomSensor | Utility | Presence | Heating | Wifi | Misc


export type StrongDevice<T extends Device> = T extends ChromeCast
  ? ChromeCast
  : T extends RoomSensor
  ? Garden
  : T extends Utility
  ? Utility
  : T extends Presence
  ? Presence
  : T extends Heating
  ? Heating
  : T extends Wifi
  ? Wifi
  : Misc
