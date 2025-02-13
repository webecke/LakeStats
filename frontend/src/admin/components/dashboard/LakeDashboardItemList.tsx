import {useEffect, useState} from "react";
import {dataService, LakeSystemSettings} from "../../../shared/services/data";
import LakeDashboardItem from "./LakeDashboardItem.tsx";
import "./LakeDashboardItemList.css";

export default function LakeDashboardItemList() {
    const [lakes, setLakes] = useState<LakeSystemSettings[]>([]);
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

    const handleMoveUp = async (lake: LakeSystemSettings) => {
        const sameCategoryLakes = lakes
            .filter(l => l.status === lake.status)
            .sort((a, b) => a.sortOrder - b.sortOrder);

        const currentIndex = sameCategoryLakes.findIndex(l => l.lakeId === lake.lakeId);
        if (currentIndex <= 0) return;

        try {
            await dataService.reorderLakes([
                { lakeId: lake.lakeId, sortOrder: sameCategoryLakes[currentIndex - 1].sortOrder },
                { lakeId: sameCategoryLakes[currentIndex - 1].lakeId, sortOrder: lake.sortOrder }
            ]);
            await loadLakes(); // Refresh the list
        } catch (error) {
            console.error('Error reordering lakes:', error);
        }
    };

    const handleMoveDown = async (lake: LakeSystemSettings) => {
        const sameCategoryLakes = lakes
            .filter(l => l.status === lake.status)
            .sort((a, b) => a.sortOrder - b.sortOrder);

        const currentIndex = sameCategoryLakes.findIndex(l => l.lakeId === lake.lakeId);
        if (currentIndex === -1 || currentIndex === sameCategoryLakes.length - 1) return;

        try {
            await dataService.reorderLakes([
                { lakeId: lake.lakeId, sortOrder: sameCategoryLakes[currentIndex + 1].sortOrder },
                { lakeId: sameCategoryLakes[currentIndex + 1].lakeId, sortOrder: lake.sortOrder }
            ]);
            await loadLakes(); // Refresh the list
        } catch (error) {
            console.error('Error reordering lakes:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const enabledLakes = lakes
        .filter(lake => lake.status === 'ENABLED')
        .sort((a, b) => a.sortOrder - b.sortOrder);
    const testingLakes = lakes
        .filter(lake => lake.status === 'TESTING')
        .sort((a, b) => a.sortOrder - b.sortOrder);
    const disabledLakes = lakes
        .filter(lake => lake.status === 'DISABLED')
        .sort((a, b) => a.sortOrder - b.sortOrder);

    const renderLakeItems = (lakesList: LakeSystemSettings[]) => {
        return lakesList.map((lake, index) => (
            <LakeDashboardItem
                key={lake.lakeId}
                lake={lake}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                isFirst={index === 0}
                isLast={index === lakesList.length - 1}
            />
        ));
    };

    return (
        <div className="lake-list">
            {enabledLakes.length > 0 && (
                <section className="lake-list__section">
                    <h2 className="lake-list__section-title">Enabled Lakes</h2>
                    {renderLakeItems(enabledLakes)}
                </section>
            )}

            {testingLakes.length > 0 && (
                <section className="lake-list__section">
                    <h2 className="lake-list__section-title">Testing Lakes</h2>
                    {renderLakeItems(testingLakes)}
                </section>
            )}

            {disabledLakes.length > 0 && (
                <section className="lake-list__section">
                    <h2 className="lake-list__section-title">Disabled Lakes</h2>
                    {renderLakeItems(disabledLakes)}
                </section>
            )}
        </div>
    );
}
