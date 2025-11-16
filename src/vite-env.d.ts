/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_SUFIX: string
  readonly VITE_USER_REFRESH_INTERVAL?: string
  readonly VITE_USER_REFRESH_ONLY_VISIBLE?: string
  readonly VITE_USER_REFRESH_ON_VISIBILITY_CHANGE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
