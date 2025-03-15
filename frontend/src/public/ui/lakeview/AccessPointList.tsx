import React from "react";
import AccessPointItem from "./AccessPointItem";
import { useSelectedRegion } from "./RegionContext";
import "./AccessPointList.css";

interface AccessPointListProps {
    currentElevation: number;
}

const AccessPointList: React.FC<AccessPointListProps> = ({ currentElevation }) => {
    // Get selected region from context
    const { selectedRegion } = useSelectedRegion();

    // Get access points from the selected region
    const accessPoints = selectedRegion.accessPoints;
    // Count open access points
    const openAccessPoints = accessPoints.filter(
        (ap) => currentElevation >= ap.minSafeElevation
    ).length;

    return (
        <div className="access-point-list">
            <div className="access-point-list-header">
                <h2 className="access-point-list-title">Access Points</h2>
                <div className="access-point-stats">
                    <span className="open-count">{openAccessPoints}</span> of {accessPoints.length}{" "}
                    open
                </div>
            </div>

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
                                currentElevation={currentElevation}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default AccessPointList;
