import React, { useState } from "react";
import { AccessPoint, LakeMetaData, LakeRegion } from "../../../shared/services/data";
import "./RegionManager.css";
import { Button } from "../../../shared/components/Button";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import AccessPointManager from "./AccessPointManager";
import RegionForm from "./RegionForm";

interface RegionManagerProps {
    lakeData: LakeMetaData;
    onLakeDataChange: (updatedLakeData: LakeMetaData) => void;
}

const RegionManager: React.FC<RegionManagerProps> = ({ lakeData, onLakeDataChange }) => {
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
    const [isAddingRegion, setIsAddingRegion] = useState(false);
    const [isEditingRegion, setIsEditingRegion] = useState(false);

    // Get array of regions from the record
    const regionsList = Object.values(lakeData.regions || {}).sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );

    // Calculate max sort order for new regions
    const getMaxSortOrder = () => {
        if (regionsList.length === 0) return 0;
        return Math.max(...regionsList.map((region) => region.sortOrder || 0));
    };

    // Handle adding a new region
    const handleAddRegion = () => {
        setIsAddingRegion(true);
        setIsEditingRegion(false);
        setSelectedRegionId(null);
    };

    // Handle editing an existing region
    const handleEditRegion = (regionId: string) => {
        setSelectedRegionId(regionId);
        setIsEditingRegion(true);
        setIsAddingRegion(false);
    };

    // Handle deleting a region
    const handleDeleteRegion = (regionId: string) => {
        if (
            !window.confirm(
                `Are you sure you want to delete this region and all its access points?`
            )
        ) {
            return;
        }

        const updatedRegions = { ...lakeData.regions };
        delete updatedRegions[regionId];

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions,
        });

        if (selectedRegionId === regionId) {
            setSelectedRegionId(null);
            setIsEditingRegion(false);
        }
    };

    // Handle moving a region up in sort order
    const handleMoveUp = (regionId: string) => {
        const sortedRegions = regionsList.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        const currentIndex = sortedRegions.findIndex((r) => r.id === regionId);

        if (currentIndex <= 0) return; // Already at the top

        const currentRegion = sortedRegions[currentIndex];
        const previousRegion = sortedRegions[currentIndex - 1];

        // Swap sort orders
        const updatedRegions = { ...lakeData.regions };
        updatedRegions[currentRegion.id] = {
            ...currentRegion,
            sortOrder: previousRegion.sortOrder || 0,
        };
        updatedRegions[previousRegion.id] = {
            ...previousRegion,
            sortOrder: currentRegion.sortOrder || 0,
        };

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions,
        });
    };

    // Handle moving a region down in sort order
    const handleMoveDown = (regionId: string) => {
        const sortedRegions = regionsList.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        const currentIndex = sortedRegions.findIndex((r) => r.id === regionId);

        if (currentIndex === -1 || currentIndex === sortedRegions.length - 1) return; // Already at the bottom

        const currentRegion = sortedRegions[currentIndex];
        const nextRegion = sortedRegions[currentIndex + 1];

        // Swap sort orders
        const updatedRegions = { ...lakeData.regions };
        updatedRegions[currentRegion.id] = {
            ...currentRegion,
            sortOrder: nextRegion.sortOrder || 0,
        };
        updatedRegions[nextRegion.id] = {
            ...nextRegion,
            sortOrder: currentRegion.sortOrder || 0,
        };

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions,
        });
    };

    // Handle saving a new or edited region
    const handleSaveRegion = (region: LakeRegion) => {
        // For new regions, automatically assign the highest sort order + 1
        if (!lakeData.regions[region.id]) {
            region = {
                ...region,
                sortOrder: getMaxSortOrder() + 1,
            };
        }

        const updatedRegions = {
            ...lakeData.regions,
            [region.id]: region,
        };

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions,
        });

        setSelectedRegionId(region.id);
        setIsAddingRegion(false);
        setIsEditingRegion(false);
    };

    // Handle canceling region add/edit
    const handleCancelRegion = () => {
        setIsAddingRegion(false);
        setIsEditingRegion(false);
    };

    // Handle updating access points in a region
    const handleUpdateAccessPoints = (regionId: string, accessPoints: AccessPoint[]) => {
        if (!lakeData.regions[regionId]) return;

        const updatedRegion = {
            ...lakeData.regions[regionId],
            accessPoints,
        };

        const updatedRegions = {
            ...lakeData.regions,
            [regionId]: updatedRegion,
        };

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions,
        });
    };

    return (
        <div className="region-manager">
            <div className="region-manager__header">
                <h2 className="region-manager__title">Lake Regions</h2>
                <Button
                    variant="primary"
                    onClick={handleAddRegion}
                    disabled={isAddingRegion || isEditingRegion}
                >
                    <Plus size={16} />
                    Add Region
                </Button>
            </div>

            <div className="region-manager__content">
                <div className="region-manager__sidebar">
                    {regionsList.length === 0 ? (
                        <div className="region-manager__empty">
                            No regions defined yet. Add your first region to get started.
                        </div>
                    ) : (
                        <ul className="region-manager__list">
                            {regionsList.map((region, index) => (
                                <li
                                    key={region.id}
                                    className={`region-manager__list-item ${selectedRegionId === region.id ? "active" : ""}`}
                                >
                                    <div className="region-manager__list-order-buttons">
                                        <button
                                            className="region-manager__action-button"
                                            onClick={() => handleMoveUp(region.id)}
                                            disabled={
                                                index === 0 || isAddingRegion || isEditingRegion
                                            }
                                            title="Move up"
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            className="region-manager__action-button"
                                            onClick={() => handleMoveDown(region.id)}
                                            disabled={
                                                index === regionsList.length - 1 ||
                                                isAddingRegion ||
                                                isEditingRegion
                                            }
                                            title="Move down"
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>

                                    <button
                                        className="region-manager__list-button"
                                        onClick={() => setSelectedRegionId(region.id)}
                                    >
                                        {region.name}
                                    </button>

                                    <div className="region-manager__list-actions">
                                        <button
                                            className="region-manager__action-button"
                                            onClick={() => handleEditRegion(region.id)}
                                            title="Edit region"
                                            disabled={isAddingRegion || isEditingRegion}
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            className="region-manager__action-button region-manager__action-button--delete"
                                            onClick={() => handleDeleteRegion(region.id)}
                                            title="Delete region"
                                            disabled={isAddingRegion || isEditingRegion}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="region-manager__detail">
                    {isAddingRegion && (
                        <RegionForm
                            onSave={handleSaveRegion}
                            onCancel={handleCancelRegion}
                            existingRegionIds={Object.keys(lakeData.regions || {})}
                        />
                    )}

                    {isEditingRegion && selectedRegionId && (
                        <RegionForm
                            region={lakeData.regions[selectedRegionId]}
                            onSave={handleSaveRegion}
                            onCancel={handleCancelRegion}
                            existingRegionIds={Object.keys(lakeData.regions || {}).filter(
                                (id) => id !== selectedRegionId
                            )}
                        />
                    )}

                    {!isAddingRegion && !isEditingRegion && selectedRegionId && (
                        <AccessPointManager
                            region={lakeData.regions[selectedRegionId]}
                            onUpdateAccessPoints={(accessPoints) =>
                                handleUpdateAccessPoints(selectedRegionId, accessPoints)
                            }
                        />
                    )}

                    {!isAddingRegion &&
                        !isEditingRegion &&
                        !selectedRegionId &&
                        regionsList.length > 0 && (
                            <div className="region-manager__select-prompt">
                                Select a region from the list to manage its access points, or add a
                                new region.
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

export default RegionManager;
