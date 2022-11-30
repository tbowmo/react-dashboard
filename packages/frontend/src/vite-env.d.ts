/// <reference types="vite/client" />
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    PUBLIC_URL: string
    VITE_BACKEND: string
    VITE_APP_ACTION_TIMEOUT: number
  }
}
