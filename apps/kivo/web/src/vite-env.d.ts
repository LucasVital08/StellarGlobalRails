/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KIVO_API_MODE?: 'mock' | 'http';
  readonly VITE_KIVO_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
