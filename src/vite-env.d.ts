
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_VISION_API_KEY: string;
  readonly VITE_USE_REAL_GOOGLE_VISION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
