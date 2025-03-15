import React from "react";
import { AccessPoint } from "../../../shared/services/data";
import { MapPin } from "lucide-react";
import "./AccessPointItem.css";

interface AccessPointItemProps {
    accessPoint: AccessPoint;
    currentElevation: number;
}

const AccessPointItem: React.FC<AccessPointItemProps> = ({ accessPoint, currentElevation }) => {
    // Calculate differences to safe and usable elevations
    const usableElevationDiff = +(currentElevation - accessPoint.minUsableElevation).toFixed(2);

    // Format the difference WITHOUT a + sign when positive
    const formattedDifference =
        usableElevationDiff >= 0
            ? `${usableElevationDiff.toFixed(2)} ft`
            : `${usableElevationDiff.toFixed(2)} ft`;

    // Determine status
    let status, statusClass;

    if (currentElevation >= accessPoint.minSafeElevation) {
        // Above safe elevation - fully open
        status = "OPEN";
        statusClass = "status-open";
    } else if (currentElevation < accessPoint.minUsableElevation) {
        // Below usable elevation - closed
        status = "CLOSED";
        statusClass = "status-closed";
    } else {
        // Between usable and safe - caution
        status = "CAUTION";
        statusClass = "status-caution";
    }

    // Format the access point type for display
    const formatAccessType = (type: string) => {
        return type
            .split("_")
            .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
            .join(" ");
    };

    // Handle opening Google Maps
    const handleOpenMaps = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (accessPoint.googleMapsLink) {
            window.open(accessPoint.googleMapsLink, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div className={`access-point-item ${statusClass}`}>
            <div className="access-point-content">
                <div className="access-point-name">{accessPoint.name}</div>
                <div className="access-point-type">{formatAccessType(accessPoint.type)}</div>
            </div>

            {accessPoint.googleMapsLink && (
                <button
                    className="map-button"
                    aria-label="Open in Google Maps"
                    onClick={handleOpenMaps}
                >
                    <MapPin size={20} />
                </button>
            )}

            <div className="access-point-details">
                <div className={`status-text ${statusClass}`}>{status}</div>
                <div className={`elevation-difference ${statusClass}`}>{formattedDifference}</div>
            </div>
        </div>
    );
};

export default AccessPointItem;
