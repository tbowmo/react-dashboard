/// <reference types="react-scripts" />
declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test'
        PUBLIC_URL: string
        REACT_APP_HASH: string
        REACT_APP_API_URI: string
        REACT_APP_WS_URI: string
        REACT_APP_MQTT_HOST: string
        REACT_APP_BACKEND: string 
        REACT_APP_OW_KEY: string
        REACT_APP_OW_CITYID: string
        REACT_APP_ACTION_TIMEOUT: number        
    }
}
    