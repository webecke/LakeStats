import React from 'react';
import { usePWA } from './PWAContext';
import './OfflineBanner.css';
import { WifiOff, RefreshCw } from 'lucide-react';

const OfflineBanner: React.FC = () => {
    const { isOffline, checkConnection } = usePWA();

    if (!isOffline) return null;

    return (
        <div className="offline-banner">
            <div className="offline-banner__content">
                <WifiOff size={16} />
                <span>You are currently offline</span>
            </div>
            <button
                className="offline-banner__retry"
                onClick={checkConnection}
                aria-label="Check connection"
            >
                <RefreshCw size={16} />
                <span>Retry</span>
            </button>
        </div>
    );
};

export default OfflineBanner;
