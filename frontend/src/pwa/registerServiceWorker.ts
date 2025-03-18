import { registerSW } from 'virtual:pwa-register';

// Using a try-catch to handle potential module import issues
// This provides better compatibility with different build environments

// This helper will register the service worker and handle updates
export function registerServiceWorker() {
    // Check if service workers are supported
    if ('serviceWorker' in navigator) {
        try {
            // Using dynamic import for better compatibility
            import('virtual:pwa-register').then(({ registerSW }) => {
                // Register the service worker from virtual:pwa-register
                const updateSW = registerSW({
                    onNeedRefresh() {
                        // When a new version is available, we could show a notification
                        console.log('New content is available, please refresh.');
                        // You can add custom UI to prompt for refresh here if desired
                    },
                    onOfflineReady() {
                        // When offline content is ready
                        console.log('App is ready for offline use.');
                    },
                    onRegistered(registration) {
                        // SW registration succeeded
                        console.log('Service worker registered successfully:', registration);
                    },
                    onRegisterError(error) {
                        // SW registration failed
                        console.error('Service worker registration failed:', error);
                    }
                });

                // Make the updater function available globally if needed
                window.updateSW = () => {
                    updateSW(true).catch(console.error);
                };
            });
        } catch (error) {
            console.error('PWA registration failed:', error);
        }
    }
}
