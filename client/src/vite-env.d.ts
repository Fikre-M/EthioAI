/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_TOKEN_KEY: string
  readonly VITE_MAPBOX_TOKEN: string
  readonly VITE_ENABLE_CHAT: string
  readonly VITE_ENABLE_MARKETPLACE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
