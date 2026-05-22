/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_CURRENCY_SYMBOL: string;
    // add other VITE_ env vars here as needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';
declare module '*.webp';
