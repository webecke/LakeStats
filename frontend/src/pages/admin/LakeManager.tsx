import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import './LakeManager.css';
import {dataService, Lake, LakeSystemStatus} from "../../services/data";
import LoadingSpinner from "../../components/shared/LoadingSpinner.tsx";
import LakeDetails from "../../components/admin/lakeManager/LakeDetails.tsx";
import LakeSystemConfig from "../../components/admin/lakeManager/LakeSystemConfig.tsx";
import Notification from "../../components/shared/Notification.tsx";
import DataSources from "../../components/admin/lakeManager/DataSources.tsx";

interface NotificationState {
    message: string;
    type: 'success' | 'error';
}

export default function LakeManager() {
    const { lakeId } = useParams();
    const [systemConfig, setSystemConfig] = useState<LakeSystemStatus | null>(null);
    const [lakeData, setLakeData] = useState<Lake | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState<NotificationState | null>(null);

    useEffect(() => {
        async function loadData() {
            if (!lakeId) return;

            try {
                setIsLoading(true);
                const [systemData, lakeDetails] = await Promise.all([
                    dataService.getLakeSystem(lakeId),
                    dataService.getLakeInfo(lakeId)
                ]);

                if (!systemData) {
                    throw new Error(`No system config found for lake ${lakeId}`);
                }

                if (!lakeDetails) {
                    const newLake: Lake = {
                        id: lakeId,
                        description: '',
                        fillDate: '',
                        googleMapsLinkToDam: '',
                        fullPoolElevation: 0,
                        minPowerPoolElevation: 0,
                        deadPoolElevation: 0,
                        dataSources: new Map(),
                        regions: {}
                    };
                    setLakeData(newLake);
                } else {
                    setLakeData(lakeDetails as Lake);
                }

                setSystemConfig(systemData);
            } catch (error) {
                console.error('Error loading lake data:', error);
                setNotification({
                    message: 'Failed to load lake data',
                    type: 'error'
                });
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [lakeId]);

    const handleSave = async () => {
        if (!lakeId || !lakeData || !systemConfig) return;

        try {
            await dataService.updateLake(lakeId, {
                system: systemConfig,
                info: lakeData
            });
            setNotification({
                message: 'Changes saved successfully',
                type: 'success'
            });
        } catch (error) {
            console.error('Error saving lake data:', error);
            setNotification({
                message: 'Failed to save changes',
                type: 'error'
            });
        }
    };

    if (isLoading) {
        return <LoadingSpinner/>;
    }

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'dataSources', label: 'Data Sources' },
        { id: 'regions', label: 'Regions' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="content-panel">
                        <div className="content-panel__header">
                            <h2 className="content-panel__title">Lake Overview</h2>
                        </div>
                        <div className="content-panel__content content-panel__content--overview">
                            <LakeSystemConfig config={systemConfig!} onChange={setSystemConfig} />
                            <LakeDetails lake={lakeData!} setLake={setLakeData} />
                        </div>
                    </div>
                );
            case 'dataSources':
                return (
                    <div className="content-panel">
                        <div className="content-panel__header">
                            <h2 className="content-panel__title">Data Sources</h2>
                        </div>
                        <div className="content-panel__content">
                            <DataSources
                                sources={lakeData!.dataSources}
                                onChange={(newSources) => setLakeData(prev => prev ? {
                                    ...prev,
                                    dataSources: newSources
                                } : prev)}
                            />
                        </div>
                    </div>
                );
            case 'regions':
                return (
                    <div className="content-panel">
                        <div className="content-panel__header">
                            <h2 className="content-panel__title">Regions</h2>
                        </div>
                        <div className="content-panel__content">
                            <p>REGION MANAGER</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="lake-manager">
            <div className="lake-manager__header">
                <h1 className="lake-manager__title">
                    {lakeId}
                </h1>
                <Button variant="outline" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>

            <div className="tabs">
                <div className="tabs__list">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tabs__trigger ${
                                activeTab === tab.id ? 'tabs__trigger--active' : ''
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {renderContent()}
            </div>

            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
        </div>
    );
}
