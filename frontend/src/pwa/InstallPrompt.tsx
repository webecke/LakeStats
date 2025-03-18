import React from 'react';
import { usePWA } from './PWAContext';
import './InstallPrompt.css';
import { Download } from 'lucide-react';

const InstallPrompt: React.FC = () => {
    const { showInstallPrompt, deferredPrompt, setDeferredPrompt, setShowInstallPrompt } = usePWA();

    //if (!showInstallPrompt) return null;

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const choiceResult = await deferredPrompt.userChoice;

        // Regardless of outcome, we no longer need the prompt
        setDeferredPrompt(null);
        setShowInstallPrompt(false);

        // Log the outcome for analytics
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
    };

    return (
        <div className="install-prompt">
            <div className="install-prompt__content">
                <div className="install-prompt__message">
                    <h3>Get the best experience</h3>
                    <p>Install LakeStats for faster access and offline use</p>
                </div>
                <div className="install-prompt__actions">
                    <button
                        className="install-prompt__install-btn"
                        onClick={handleInstallClick}
                    >
                        <Download size={16} />
                        <span>Install</span>
                    </button>
                    <button
                        className="install-prompt__dismiss-btn"
                        onClick={handleDismiss}
                        aria-label="Dismiss"
                    >
                        &times;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
