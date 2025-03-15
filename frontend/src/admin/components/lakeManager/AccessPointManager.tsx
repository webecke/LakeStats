import React, { useState } from 'react';
import { AccessPoint, LakeRegion } from '../../../shared/services/data';
import { Button } from '../../../shared/components/Button';
import { Plus, Edit, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import AccessPointForm from './AccessPointForm';
import './AccessPointManager.css';

interface AccessPointManagerProps {
    region: LakeRegion;
    onUpdateAccessPoints: (accessPoints: AccessPoint[]) => void;
}

const AccessPointManager: React.FC<AccessPointManagerProps> = ({ region, onUpdateAccessPoints }) => {
    const [selectedAccessPointId, setSelectedAccessPointId] = useState<string | null>(null);
    const [isAddingAccessPoint, setIsAddingAccessPoint] = useState(false);
    const [isEditingAccessPoint, setIsEditingAccessPoint] = useState(false);

    // Sort access points by sortOrder
    const sortedAccessPoints = [...(region.accessPoints || [])].sort(
        (a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)
    );

    // Calculate max sort order for new access points
    const getMaxSortOrder = () => {
        if (sortedAccessPoints.length === 0) return 0;
        return Math.max(...sortedAccessPoints.map(ap => ap.sortOrder || 0));
    };

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

        const updatedAccessPoints = region.accessPoints.filter(point => point.id !== id);
        onUpdateAccessPoints(updatedAccessPoints);

        if (selectedAccessPointId === id) {
            setSelectedAccessPointId(null);
            setIsEditingAccessPoint(false);
        }
    };

    // Handle moving an access point up in sort order
    const handleMoveUp = (id: string) => {
        const currentIndex = sortedAccessPoints.findIndex(ap => ap.id === id);

        if (currentIndex <= 0) return; // Already at the top

        const currentAP = sortedAccessPoints[currentIndex];
        const previousAP = sortedAccessPoints[currentIndex - 1];

        // Swap sort orders
        const updatedAccessPoints = [...region.accessPoints];

        // Find the actual indices in the original array
        const currentOrig = updatedAccessPoints.findIndex(ap => ap.id === currentAP.id);
        const prevOrig = updatedAccessPoints.findIndex(ap => ap.id === previousAP.id);

        // Swap sort orders
        updatedAccessPoints[currentOrig] = {
            ...updatedAccessPoints[currentOrig],
            sortOrder: previousAP.sortOrder || 0
        };

        updatedAccessPoints[prevOrig] = {
            ...updatedAccessPoints[prevOrig],
            sortOrder: currentAP.sortOrder || 0
        };

        onUpdateAccessPoints(updatedAccessPoints);
    };

    // Handle moving an access point down in sort order
    const handleMoveDown = (id: string) => {
        const currentIndex = sortedAccessPoints.findIndex(ap => ap.id === id);

        if (currentIndex === -1 || currentIndex === sortedAccessPoints.length - 1) return; // Already at the bottom

        const currentAP = sortedAccessPoints[currentIndex];
        const nextAP = sortedAccessPoints[currentIndex + 1];

        // Swap sort orders
        const updatedAccessPoints = [...region.accessPoints];

        // Find the actual indices in the original array
        const currentOrig = updatedAccessPoints.findIndex(ap => ap.id === currentAP.id);
        const nextOrig = updatedAccessPoints.findIndex(ap => ap.id === nextAP.id);

        // Swap sort orders
        updatedAccessPoints[currentOrig] = {
            ...updatedAccessPoints[currentOrig],
            sortOrder: nextAP.sortOrder || 0
        };

        updatedAccessPoints[nextOrig] = {
            ...updatedAccessPoints[nextOrig],
            sortOrder: currentAP.sortOrder || 0
        };

        onUpdateAccessPoints(updatedAccessPoints);
    };

    const handleSaveAccessPoint = (accessPoint: AccessPoint) => {
        let updatedAccessPoints: AccessPoint[];

        // Check if this is a new access point or an edit
        const existingIndex = region.accessPoints.findIndex(point => point.id === accessPoint.id);

        if (existingIndex === -1) {
            // For new access points, automatically assign the next highest sort order
            accessPoint = {
                ...accessPoint,
                sortOrder: getMaxSortOrder() + 1
            };
            updatedAccessPoints = [...region.accessPoints, accessPoint];
        } else {
            // For existing access points, update while preserving sort order
            updatedAccessPoints = region.accessPoints.map(point =>
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

    return (
        <div className="access-point-manager">
            <div className="access-point-manager__header">
                <h2 className="access-point-manager__title">
                    Access Points for {region.name}
                </h2>
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
                    {sortedAccessPoints.length === 0 ? (
                        <div className="access-point-manager__empty">
                            No access points defined for this region yet.
                        </div>
                    ) : (
                        <ul className="access-point-manager__list">
                            {sortedAccessPoints.map((accessPoint, index) => (
                                <li
                                    key={accessPoint.id}
                                    className={`access-point-manager__list-item ${
                                        selectedAccessPointId === accessPoint.id ? 'active' : ''
                                    }`}
                                >
                                    <div className="access-point-manager__list-order-buttons">
                                        <button
                                            className="access-point-manager__action-button"
                                            onClick={() => handleMoveUp(accessPoint.id)}
                                            disabled={index === 0 || isAddingAccessPoint || isEditingAccessPoint}
                                            title="Move up"
                                        >
                                            <ChevronUp size={14} />
                                        </button>
                                        <button
                                            className="access-point-manager__action-button"
                                            onClick={() => handleMoveDown(accessPoint.id)}
                                            disabled={index === sortedAccessPoints.length - 1 || isAddingAccessPoint || isEditingAccessPoint}
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
                    {isAddingAccessPoint && (
                        <AccessPointForm
                            onSave={handleSaveAccessPoint}
                            onCancel={handleCancelAccessPoint}
                            existingIds={region.accessPoints.map(point => point.id)}
                        />
                    )}

                    {isEditingAccessPoint && selectedAccessPointId && (
                        <AccessPointForm
                            accessPoint={region.accessPoints.find(point => point.id === selectedAccessPointId)}
                            onSave={handleSaveAccessPoint}
                            onCancel={handleCancelAccessPoint}
                            existingIds={region.accessPoints
                                .filter(point => point.id !== selectedAccessPointId)
                                .map(point => point.id)}
                        />
                    )}

                    {!isAddingAccessPoint && !isEditingAccessPoint && selectedAccessPointId && (
                        <div className="access-point-manager__view">
                            {renderAccessPointDetails(
                                region.accessPoints.find(point => point.id === selectedAccessPointId)!
                            )}
                        </div>
                    )}

                    {!isAddingAccessPoint && !isEditingAccessPoint && !selectedAccessPointId && sortedAccessPoints.length > 0 && (
                        <div className="access-point-manager__select-prompt">
                            Select an access point from the list to view details, or add a new access point.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function to render access point details
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
                    <strong>Google Maps:</strong>{' '}
                    <a href={accessPoint.googleMapsLink} target="_blank" rel="noopener noreferrer">
                        View on Google Maps
                    </a>
                </div>
            )}
        </div>
    );
};

export default AccessPointManager;
