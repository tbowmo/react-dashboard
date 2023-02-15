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
}

export type Presence = Record<string, Record<string, boolean>>

export type Global = {
  utility?: Record<string, number>
  heating?: Record<string, number>
}

export type Home = Record<string, Room | Presence | Global | Garden>
