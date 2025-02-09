import {useEffect, useState} from "react";
import {dataService, LakeSystemStatus} from "../../../services/data";
import LakeDashboardItem from "./LakeDashboardItem.tsx";
import "./LakeDashboardItemList.css";

export default function LakeDashboardItemList() {
    const [lakes, setLakes] = useState<LakeSystemStatus[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLakes();
    }, []);

    const loadLakes = async () => {
        try {
            const allLakes = await dataService.getAllLakes();
            setLakes(allLakes);
        } catch (error) {
            console.error('Error loading lakes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const enabledLakes = lakes.filter(lake => lake.status === 'ENABLED');
    const testingLakes = lakes.filter(lake => lake.status === 'TESTING');
    const disabledLakes = lakes.filter(lake => lake.status === 'DISABLED');

    return (
        <div className="lake-list">
            {enabledLakes.length > 0 && (
                <section className="lake-list__section">
                    <h2 className="lake-list__section-title">Enabled Lakes</h2>
                    {enabledLakes.map(lake => (
                        <LakeDashboardItem
                            key={lake.lakeId}
                            lake={lake}
                        />
                    ))}
                </section>
            )}

            {testingLakes.length > 0 && (
                <section className="lake-list__section">
                    <h2 className="lake-list__section-title">Testing Lakes</h2>
                    {testingLakes.map(lake => (
                        <LakeDashboardItem
                            key={lake.lakeId}
                            lake={lake}
                        />
                    ))}
                </section>
            )}

            {disabledLakes.length > 0 && (
                <section className="lake-list__section">
                    <h2 className="lake-list__section-title">Disabled Lakes</h2>
                    {disabledLakes.map(lake => (
                        <LakeDashboardItem
                            key={lake.lakeId}
                            lake={lake}
                        />
                    ))}
                </section>
            )}
        </div>
    );
}
