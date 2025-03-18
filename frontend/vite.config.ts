import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: [
                'favicon/favicon.ico',
                'favicon/apple-touch-icon.png',
                'favicon/favicon-96x96.png',
                'favicon/favicon.svg',
                'favicon/web-app-manifest-192x192.png',
                'favicon/web-app-manifest-512x512.png'
            ],
            manifest: {
                name: 'LakeStats',
                short_name: 'LakeStats',
                description: 'Monitor real-time water levels, access points, and conditions for major lakes',
                theme_color: '#00D3FF',
                background_color: '#121212',
                display: 'standalone',
                icons: [
                    {
                        src: '/favicon/web-app-manifest-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/favicon/web-app-manifest-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any maskable'
                    }
                ]
            },
            // Enable service worker for offline functionality
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg}'],
                runtimeCaching: [
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-cache',
                            expiration: {
                                maxEntries: 10,
                                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^https:\/\/www\.usbr\.gov\/uc\/water\/hydrodata\/reservoir_data\/.*/i,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'lake-data-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 // 1 day
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            }
        })
    ],
});
