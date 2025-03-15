import React from 'react';
import { AccessPoint } from '../../../shared/services/data';
import AccessPointItem from './AccessPointItem';
import { useSelectedRegion } from './RegionContext';
import './AccessPointList.css';

interface AccessPointListProps {
    currentElevation: number;
}

const AccessPointList: React.FC<AccessPointListProps> = ({ currentElevation }) => {
    // Get selected region from context
    const { selectedRegion } = useSelectedRegion();

    // Get access points from the selected region
    const accessPoints = selectedRegion.accessPoints;

    // If there are no access points, show a message
    if (!accessPoints || accessPoints.length === 0) {
        return <div className="no-access-points">No access points available in this region</div>;
    }

    // Determine status for each access point
    const getAccessPointStatus = (ap: AccessPoint) => {
        if (currentElevation >= ap.minSafeElevation) {
            return 'OPEN';
        } else if (currentElevation < ap.minUsableElevation) {
            return 'CLOSED';
        } else {
            return 'CAUTION';
        }
    };

    // Sort access points with priority logic:
    // 1. Status (OPEN first, then CAUTION, then CLOSED)
    // 2. sortOrder (if available)
    // 3. name (as fallback)
    const sortedAccessPoints = [...accessPoints].sort((a, b) => {
        const aStatus = getAccessPointStatus(a);
        const bStatus = getAccessPointStatus(b);

        // First sort by status priority
        if (aStatus !== bStatus) {
            if (aStatus === 'OPEN') return -1;
            if (bStatus === 'OPEN') return 1;
            if (aStatus === 'CAUTION') return -1;
            if (bStatus === 'CAUTION') return 1;
        }

        // Then sort by sortOrder if available
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
            return a.sortOrder - b.sortOrder;
        }

        // Finally fall back to name
        return a.name.localeCompare(b.name);
    });

    // Count open access points
    const openAccessPoints = sortedAccessPoints.filter(ap =>
        currentElevation >= ap.minSafeElevation
    ).length;

    return (
        <div className="access-point-list">
            <div className="access-point-list-header">
                <h2 className="access-point-list-title">Access Points</h2>
                <div className="access-point-stats">
                    <span className="open-count">{openAccessPoints}</span> of {accessPoints.length} open
                </div>
            </div>

            <div className="access-point-items">
                {sortedAccessPoints.map(accessPoint => (
                    <AccessPointItem
                        key={accessPoint.id}
                        accessPoint={accessPoint}
                        currentElevation={currentElevation}
                    />
                ))}
            </div>
        </div>
    );
};

export default AccessPointList;
