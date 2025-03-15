import React, { useState } from "react";
import { AccessPoint, LakeRegion } from "../../../shared/services/data";
import { Button } from "../../../shared/components/Button";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import AccessPointForm from "./AccessPointForm";
import "./AccessPointManager.css";

interface AccessPointManagerProps {
    region: LakeRegion;
    onUpdateAccessPoints: (accessPoints: AccessPoint[]) => void;
}

const AccessPointManager: React.FC<AccessPointManagerProps> = ({
    region,
    onUpdateAccessPoints,
}) => {
    const [selectedAccessPointId, setSelectedAccessPointId] = useState<string | null>(null);
    const [isAddingAccessPoint, setIsAddingAccessPoint] = useState(false);
    const [isEditingAccessPoint, setIsEditingAccessPoint] = useState(false);

    // Simply use the accessPoints array in its current order
    const accessPoints = region.accessPoints || [];

    const handleAddAccessPoint = () => {
        setIsAddingAccessPoint(true);
        setIsEditingAccessPoint(false);
        setSelectedAccessPointId(null);
    };

    const handleEditAccessPoint = (id: string) => {
        setSelectedAccessPointId(id);
        setIsEditingAccessPoint(true);
        setIsAddingAccessPoint(false);
    };

    const handleDeleteAccessPoint = (id: string) => {
        if (!window.confirm("Are you sure you want to delete this access point?")) {
            return;
        }

        // Filter out the deleted access point
        const updatedAccessPoints = accessPoints.filter((point) => point.id !== id);
        onUpdateAccessPoints(updatedAccessPoints);

        if (selectedAccessPointId === id) {
            setSelectedAccessPointId(null);
            setIsEditingAccessPoint(false);
        }
    };

    // Move an access point up in the array
    const handleMoveUp = (id: string) => {
        const currentIndex = accessPoints.findIndex((ap) => ap.id === id);

        if (currentIndex <= 0) return; // Already at the top

        // Create a new array with the items swapped
        const updatedAccessPoints = [...accessPoints];

        // Swap the items
        [updatedAccessPoints[currentIndex], updatedAccessPoints[currentIndex - 1]] = [
            updatedAccessPoints[currentIndex - 1],
            updatedAccessPoints[currentIndex],
        ];

        // Update with the new array order
        onUpdateAccessPoints(updatedAccessPoints);
    };

    // Move an access point down in the array
    const handleMoveDown = (id: string) => {
        const currentIndex = accessPoints.findIndex((ap) => ap.id === id);

        if (currentIndex === -1 || currentIndex === accessPoints.length - 1) return; // Already at the bottom

        // Create a new array with the items swapped
        const updatedAccessPoints = [...accessPoints];

        // Swap the items
        [updatedAccessPoints[currentIndex], updatedAccessPoints[currentIndex + 1]] = [
            updatedAccessPoints[currentIndex + 1],
            updatedAccessPoints[currentIndex],
        ];

        // Update with the new array order
        onUpdateAccessPoints(updatedAccessPoints);
    };

    const handleSaveAccessPoint = (accessPoint: AccessPoint) => {
        // Check if we're adding or editing
        const existingIndex = accessPoints.findIndex((point) => point.id === accessPoint.id);

        let updatedAccessPoints: AccessPoint[];

        if (existingIndex === -1) {
            // For new access points, add to the end of the array
            updatedAccessPoints = [...accessPoints, accessPoint];
        } else {
            // For existing access points, update in place
            updatedAccessPoints = accessPoints.map((point) =>
                point.id === accessPoint.id ? accessPoint : point
            );
        }

        onUpdateAccessPoints(updatedAccessPoints);
        setIsAddingAccessPoint(false);
        setIsEditingAccessPoint(false);
        setSelectedAccessPointId(accessPoint.id);
    };

    const handleCancelAccessPoint = () => {
        setIsAddingAccessPoint(false);
        setIsEditingAccessPoint(false);
    };

    // Rest of the component remains largely the same
    return (
        <div className="access-point-manager">
            <div className="access-point-manager__header">
                <h2 className="access-point-manager__title">Access Points for {region.name}</h2>
                <Button
                    variant="primary"
                    onClick={handleAddAccessPoint}
                    disabled={isAddingAccessPoint || isEditingAccessPoint}
                >
                    <Plus size={16} />
                    Add Access Point
                </Button>
            </div>

            <div className="access-point-manager__content">
                <div className="access-point-manager__sidebar">
                    {accessPoints.length === 0 ? (
                        <div className="access-point-manager__empty">
                            No access points defined for this region yet.
                        </div>
                    ) : (
                        <ul className="access-point-manager__list">
                            {accessPoints.map((accessPoint, index) => (
                                <li
                                    key={accessPoint.id}
                                    className={`access-point-manager__list-item ${
                                        selectedAccessPointId === accessPoint.id ? "active" : ""
                                    }`}
                                >
                                    <div className="access-point-manager__list-order-buttons">
                                        <button
                                            className="access-point-manager__action-button"
                                            onClick={() => handleMoveUp(accessPoint.id)}
                                            disabled={
                                                index === 0 ||
                                                isAddingAccessPoint ||
                                                isEditingAccessPoint
                                            }
                                            title="Move up"
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            className="access-point-manager__action-button"
                                            onClick={() => handleMoveDown(accessPoint.id)}
                                            disabled={
                                                index === accessPoints.length - 1 ||
                                                isAddingAccessPoint ||
                                                isEditingAccessPoint
                                            }
                                            title="Move down"
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>

                                    <button
                                        className="access-point-manager__list-button"
                                        onClick={() => setSelectedAccessPointId(accessPoint.id)}
                                    >
                                        {accessPoint.name}
                                        <span className="access-point-manager__list-item-type">
                                            {accessPoint.type}
                                        </span>
                                    </button>

                                    <div className="access-point-manager__list-actions">
                                        <button
                                            className="access-point-manager__action-button"
                                            onClick={() => handleEditAccessPoint(accessPoint.id)}
                                            title="Edit access point"
                                            disabled={isAddingAccessPoint || isEditingAccessPoint}
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            className="access-point-manager__action-button access-point-manager__action-button--delete"
                                            onClick={() => handleDeleteAccessPoint(accessPoint.id)}
                                            title="Delete access point"
                                            disabled={isAddingAccessPoint || isEditingAccessPoint}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="access-point-manager__detail">
                    {/* Rest of the component remains the same */}
                    {isAddingAccessPoint && (
                        <AccessPointForm
                            onSave={handleSaveAccessPoint}
                            onCancel={handleCancelAccessPoint}
                            existingIds={accessPoints.map((point) => point.id)}
                        />
                    )}

                    {isEditingAccessPoint && selectedAccessPointId && (
                        <AccessPointForm
                            accessPoint={accessPoints.find(
                                (point) => point.id === selectedAccessPointId
                            )}
                            onSave={handleSaveAccessPoint}
                            onCancel={handleCancelAccessPoint}
                            existingIds={accessPoints
                                .filter((point) => point.id !== selectedAccessPointId)
                                .map((point) => point.id)}
                        />
                    )}

                    {!isAddingAccessPoint && !isEditingAccessPoint && selectedAccessPointId && (
                        <div className="access-point-manager__view">
                            {renderAccessPointDetails(
                                accessPoints.find((point) => point.id === selectedAccessPointId)!
                            )}
                        </div>
                    )}

                    {!isAddingAccessPoint &&
                        !isEditingAccessPoint &&
                        !selectedAccessPointId &&
                        accessPoints.length > 0 && (
                            <div className="access-point-manager__select-prompt">
                                Select an access point from the list to view details, or add a new
                                access point.
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
};

// Helper function to render access point details (unchanged)
const renderAccessPointDetails = (accessPoint: AccessPoint) => {
    return (
        <div className="access-point-details">
            <h3 className="access-point-details__title">{accessPoint.name}</h3>
            <div className="access-point-details__type">
                <strong>Type:</strong> {accessPoint.type}
            </div>
            <div className="access-point-details__elevation">
                <strong>Minimum Safe Elevation:</strong> {accessPoint.minSafeElevation} ft
            </div>
            <div className="access-point-details__elevation">
                <strong>Minimum Usable Elevation:</strong> {accessPoint.minUsableElevation} ft
            </div>
            {accessPoint.googleMapsLink && (
                <div className="access-point-details__map">
                    <strong>Google Maps:</strong>{" "}
                    <a href={accessPoint.googleMapsLink} target="_blank" rel="noopener noreferrer">
                        View on Google Maps
                    </a>
                </div>
            )}
        </div>
    );
};

export default AccessPointManager;
