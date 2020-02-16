export namespace Chromecast {
    type supportedFeatures = {
        skip_fwd: boolean,
        skip_bck: boolean,
        pause: boolean,
        volume: boolean,
        mute: boolean,
    }

    export type Media = {
        title: string,
        artist: string,
        album: string,
        album_art: string,
        metadata_type: number,
        content_id: string,
        duration: number,
        current_time: number,
        start_time: number,
        type: number,
    }

    export type Capabilities = {
        app: string,
        state: string,
        volume: number,
        muted: boolean, 
        app_icon: string,
        supported_features: supportedFeatures
    }

    export type Chrome = {
        app: Capabilities['app'],
        capabilities: Capabilities,
        device: string,
        media: Media,
        state: Capabilities['state'],
    }

}

export type RoomSensor = {
    temperature?: number,
    dewpoint?: number,
    humidity?: number,
    barometer?: number,
}

export type Room = {
    sensors: RoomSensor,
    avctrl: {
        scene: string,
    }
    media?: Chromecast.Chrome,
    light: {
        [key: string]: number,
    }
}
export type Garden = {
    chickencoop: {

    }
}

export type Presence = {
    [person: string]: {
        [device: string] : boolean,
    } 
}

export type Global = {
    utility: {
        [key: string]: number
    },
    heating: {
        [key: string]: number,
    }
}

export type Home = {
    [keys: string]: Room | Presence | Global | Garden
}

