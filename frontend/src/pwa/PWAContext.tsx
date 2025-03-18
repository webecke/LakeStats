import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Define a type for the BeforeInstallPromptEvent which isn't in standard TypeScript types
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

interface PWAContextType {
    isOffline: boolean;
    checkConnection: () => void;
    deferredPrompt: BeforeInstallPromptEvent | null;
    setDeferredPrompt: React.Dispatch<React.SetStateAction<BeforeInstallPromptEvent | null>>;
    showInstallPrompt: boolean;
    setShowInstallPrompt: React.Dispatch<React.SetStateAction<boolean>>;
    isPWAInstalled: boolean;
}

const PWAContext = createContext<PWAContextType | undefined>(undefined);

export const PWAProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);
    const [isPWAInstalled, setIsPWAInstalled] = useState<boolean>(false);

    // Check if app is installed (there are several ways to detect this, not 100% reliable)
    useEffect(() => {
        // Check for display-mode: standalone
        const isInStandaloneMode = () => {
            return (
                window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as any).standalone ||
                document.referrer.includes('android-app://')
            );
        };

        setIsPWAInstalled(isInStandaloneMode());

        // Also check when display mode changes
        const mediaQueryList = window.matchMedia('(display-mode: standalone)');
        const handleChange = (e: MediaQueryListEvent) => {
            setIsPWAInstalled(e.matches);
        };

        if (mediaQueryList.addEventListener) {
            mediaQueryList.addEventListener('change', handleChange);
            return () => mediaQueryList.removeEventListener('change', handleChange);
        }
    }, []);

    // Monitor online/offline status
    useEffect(() => {
        const handleOnline = () => setIsOffline(false);
        const handleOffline = () => setIsOffline(true);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Handle beforeinstallprompt event
    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            setDeferredPrompt(e);
            // Only show install button if the app is not already installed
            if (!isPWAInstalled) {
                setShowInstallPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, [isPWAInstalled]);

    // Function to manually check connection
    const checkConnection = () => {
        setIsOffline(!navigator.onLine);
    };

    return (
        <PWAContext.Provider
            value={{
                isOffline,
                checkConnection,
                deferredPrompt,
                setDeferredPrompt,
                showInstallPrompt,
                setShowInstallPrompt,
                isPWAInstalled
            }}
        >
            {children}
        </PWAContext.Provider>
    );
};

export const usePWA = () => {
    const context = useContext(PWAContext);
    if (context === undefined) {
        throw new Error('usePWA must be used within a PWAProvider');
    }
    return context;
};
