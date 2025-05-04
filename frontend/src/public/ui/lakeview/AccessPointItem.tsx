import React from "react";
import { AccessPoint } from "../../../shared/services/data";
import { MapPin } from "lucide-react";
import "./AccessPointItem.css";
import { getFeetAndInchesWithFraction } from "../dataRenderTools.ts";
import Tooltip from "../../components/Tooltip.tsx";

interface AccessPointItemProps {
    accessPoint: AccessPoint;
    currentElevation: number;
}

const AccessPointItem: React.FC<AccessPointItemProps> = ({ accessPoint, currentElevation }) => {
    // Calculate differences to safe and usable elevations
    const usableElevationDiff = +(currentElevation - accessPoint.minUsableElevation);

    // Format the difference WITHOUT a + sign when positive
    const { feet, inches } = getFeetAndInchesWithFraction(usableElevationDiff);
    const prefix = usableElevationDiff >= 0 ? "" : "-";
    const feetDisplay = feet ? `${feet}ft ` : "";
    const formattedDifference = `${prefix}${feetDisplay}${inches}in`;

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

    const tooltipContent = (
        <div>
            <div><strong>Safe level:</strong> {accessPoint.minSafeElevation} ft</div>
            <div><strong>Usable level:</strong> {accessPoint.minUsableElevation} ft</div>
            <p style={{fontSize: "0.625rem", lineHeight: "1", fontStyle: "italic"}}>
                Difference shown is between current level and "usable" level. These aren't official numbers, verify levels yourself.
            </p>
        </div>
    );

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

            <Tooltip content={tooltipContent}>
                <div className="access-point-details">
                    <div className={`status-text ${statusClass}`}>{status}</div>
                    <div className={`elevation-difference ${statusClass}`}>{formattedDifference}</div>
                </div>
            </Tooltip>
        </div>
    );
};

export default AccessPointItem;
