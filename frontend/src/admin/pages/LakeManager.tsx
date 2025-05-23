import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "../../shared/components/Button";
import "./LakeManager.css";
import {
    dataService,
    DataType,
    LakeMetaData,
    LakeSystemSettings,
} from "../../shared/services/data";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import LakeDetails from "../components/lakeManager/LakeDetails";
import LakeSystemConfig from "../components/lakeManager/LakeSystemConfig";
import DataSources from "../components/lakeManager/DataSources";
import RegionManager from "../components/lakeManager/RegionManager";
import { useNotifications } from "../../shared/components/Notification/NotificationContext";

export default function LakeManager() {
    const { lakeId } = useParams();
    const [systemConfig, setSystemConfig] = useState<LakeSystemSettings | null>(null);
    const [lakeData, setLakeData] = useState<LakeMetaData | null>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);
    const { showNotification } = useNotifications();

    useEffect(() => {
        async function loadData() {
            if (!lakeId) return;

            try {
                setIsLoading(true);
                const [systemData, lakeDetails] = await Promise.all([
                    dataService.getLakeSystemSetting(lakeId),
                    dataService.getLakeInfo(lakeId),
                ]);

                if (!systemData) {
                    throw new Error(`No system config found for lake ${lakeId}`);
                }

                if (!lakeDetails) {
                    const newLake: LakeMetaData = {
                        id: lakeId,
                        description: "",
                        fillDate: "",
                        googleMapsLinkToDam: "",
                        fullPoolElevation: 0,
                        minPowerPoolElevation: 0,
                        deadPoolElevation: 0,
                        dataSources: new Map(),
                        regions: {},
                    };
                    setLakeData(newLake);
                } else {
                    setLakeData(lakeDetails as LakeMetaData);
                }

                setSystemConfig(systemData);
            } catch (error) {
                console.error("Error loading lake data:", error);
                showNotification("Failed to load lake data", "error");
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, [lakeId, showNotification]);

    const handleSave = async () => {
        if (!lakeId || !lakeData || !systemConfig) return;

        if (systemConfig.status !== "DISABLED") {
            if (!lakeData.dataSources.has(DataType.ELEVATION)) {
                showNotification("Non-disabled lakes must have an elevation data source", "error");
                return;
            } else if (
                !lakeData.dataSources
                    .get(DataType.ELEVATION)
                    ?.startsWith("https://www.usbr.gov/uc/water/hydrodata/reservoir_data/")
            ) {
                showNotification("Elevation data source must be a valid USBR link", "error");
                return;
            }
        }

        try {
            await dataService.updateLake(lakeId, {
                system: systemConfig,
                info: lakeData,
            });
            showNotification("Changes saved successfully", "success");
        } catch (error) {
            console.error("Error saving lake data:", error);
            showNotification("Failed to save changes", "error");
            return;
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    const tabs = [
        { id: "overview", label: "Overview" },
        { id: "dataSources", label: "Data Sources" },
        { id: "regions", label: "Regions" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "overview":
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
            case "dataSources":
                return (
                    <div className="content-panel">
                        <div className="content-panel__header">
                            <h2 className="content-panel__title">Data Sources</h2>
                        </div>
                        <div className="content-panel__content">
                            <DataSources
                                sources={lakeData!.dataSources}
                                onChange={(newSources) =>
                                    setLakeData((prev) =>
                                        prev
                                            ? {
                                                  ...prev,
                                                  dataSources: newSources,
                                              }
                                            : prev
                                    )
                                }
                            />
                        </div>
                    </div>
                );
            case "regions":
                return (
                    <div className="content-panel">
                        <div className="content-panel__content">
                            <RegionManager lakeData={lakeData!} onLakeDataChange={setLakeData} />
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="lake-manager">
            <div className="lake-manager__header">
                <h1 className="lake-manager__title">{lakeId}</h1>
                <Button variant="outline" onClick={handleSave}>
                    Save Changes
                </Button>
            </div>

            <div className="tabs">
                <div className="tabs__list">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`tabs__trigger ${
                                activeTab === tab.id ? "tabs__trigger--active" : ""
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {renderContent()}
            </div>
        </div>
    );
}
