/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACTION_TIMEOUT: number
  readonly VITE_BACKEND: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
