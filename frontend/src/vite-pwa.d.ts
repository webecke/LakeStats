/// <reference types="vite-plugin-pwa/client" />

// Define the virtual module for PWA registration
declare module 'virtual:pwa-register' {
    export interface RegisterSWOptions {
        immediate?: boolean;
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
        onRegisterError?: (error: any) => void;
    }

    export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>;
}

// Extend Window interface to include our custom properties
declare global {
    interface Window {
        updateSW?: (reloadPage?: boolean) => Promise<void>;
    }
}

export {};
