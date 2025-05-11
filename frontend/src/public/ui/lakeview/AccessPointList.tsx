import React from "react";
import AccessPointItem from "./AccessPointItem";
import { useSelectedRegion } from "./RegionContext";
import "./AccessPointList.css";
import { LakeSystemFeatures, LakeSystemSettings } from "../../../shared/services/data";
import AsyncContainer from "../../components/AsyncContainer.tsx";

interface AccessPointListProps {
    currentElevation: number | null;
    lakeSystemSettings: LakeSystemSettings;
    isLoading: boolean;
    loadingError: string | null;
}

const AccessPointList: React.FC<AccessPointListProps> = ({
    currentElevation,
    lakeSystemSettings,
    isLoading,
    loadingError,
}) => {
    if (!lakeSystemSettings.features.includes(LakeSystemFeatures.ACCESS_POINTS)) {
        return null;
    }

    // Get selected region from context
    const { selectedRegion } = useSelectedRegion();

    // Get access points from the selected region
    const accessPoints = selectedRegion.accessPoints;
    // Count open access points
    const openAccessPoints = accessPoints.filter(
        (ap) => (currentElevation || 0) >= ap.minSafeElevation
    ).length;

    return (
        <div className="access-point-list">
            <div className="feature-header">
                <h2 className="feature-title">Access Points</h2>
                <div className="access-point-stats">
                    <span className="open-count">{openAccessPoints}</span> of {accessPoints.length}{" "}
                    open
                </div>
            </div>

            <AsyncContainer isLoading={isLoading} error={loadingError} data={currentElevation}>
                {(levelData) => (
                    <div className="access-point-items">
                        {!accessPoints.length ? (
                            <div className="no-access-points">
                                No access points available in this region
                            </div>
                        ) : (
                            <>
                                {accessPoints.map((accessPoint) => (
                                    <AccessPointItem
                                        key={accessPoint.id}
                                        accessPoint={accessPoint}
                                        currentElevation={levelData}
                                    />
                                ))}
                            </>
                        )}
                    </div>
                )}
            </AsyncContainer>
        </div>
    );
};

export default AccessPointList;
