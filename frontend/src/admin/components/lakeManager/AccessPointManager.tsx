import React, { useState } from 'react';
import { AccessPoint, LakeRegion } from '../../../shared/services/data';
import { Button } from '../../../shared/components/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import './AccessPointManager.css';

interface AccessPointManagerProps {
    region: LakeRegion;
    onUpdateAccessPoints: (accessPoints: AccessPoint[]) => void;
}

const AccessPointManager: React.FC<AccessPointManagerProps> = ({ region, onUpdateAccessPoints }) => {
    const [isAddingAccessPoint, setIsAddingAccessPoint] = useState(false);
    const [editingAccessPointId, setEditingAccessPointId] = useState<string | null>(null);

    // Sort access points by name
    const sortedAccessPoints = [...region.accessPoints].sort((a, b) =>
        a.name.localeCompare(b.name)
    );

    // Handle adding a new access point
    const handleAddAccessPoint = () => {
        setIsAddingAccessPoint(true);
        setEditingAccessPointId(null);
    };

    // Handle editing an existing access point
    const handleEditAccessPoint = (accessPointId: string) => {
        setEditingAccessPointId(accessPointId);
        setIsAddingAccessPoint(false);
    };

    // Handle deleting an access point
    const handleDeleteAccessPoint = (accessPointId: string) => {
        if (!window.confirm('Are you sure you want to delete this access point?')) {
            return;
        }

        const updatedAccessPoints = region.accessPoints.filter(ap => ap.id !== accessPointId);
        onUpdateAccessPoints(updatedAccessPoints);

        if (editingAccessPointId === accessPointId) {
            setEditingAccessPointId(null);
        }
    };

    // Handle saving a new or edited access point
    const handleSaveAccessPoint = (accessPoint: AccessPoint) => {
        let updatedAccessPoints: AccessPoint[];

        if (editingAccessPointId) {
            // Update existing access point
            updatedAccessPoints = region.accessPoints.map(ap =>
                ap.id === editingAccessPointId ? accessPoint : ap
            );
        } else {
            // Add new access point
            updatedAccessPoints = [...region.accessPoints, accessPoint];
        }

        onUpdateAccessPoints(updatedAccessPoints);
        setIsAddingAccessPoint(false);
        setEditingAccessPointId(null);
    };

    // Handle canceling access point add/edit
    const handleCancelAccessPoint = () => {
        setIsAddingAccessPoint(false);
        setEditingAccessPointId(null);
    };

    return (
        <div className="access-point-manager">
            <div className="access-point-manager__header">
                <h2 className="access-point-manager__title">
                    {region.name} Access Points
                </h2>
                <Button
                    variant="primary"
                    onClick={handleAddAccessPoint}
                    disabled={isAddingAccessPoint || !!editingAccessPointId}
                >
                    <Plus size={16} />
                    Add Access Point
                </Button>
            </div>

            <div className="access-point-manager__description">
                {region.description}
            </div>

            {isAddingAccessPoint || editingAccessPointId ? (
                <AccessPointForm
                    accessPoint={editingAccessPointId
                        ? region.accessPoints.find(ap => ap.id === editingAccessPointId)
                        : undefined
                    }
                    onSave={handleSaveAccessPoint}
                    onCancel={handleCancelAccessPoint}
                    existingAccessPointIds={region.accessPoints.map(ap => ap.id)
                        .filter(id => id !== editingAccessPointId)
                    }
                />
            ) : (
                <>
                    {sortedAccessPoints.length === 0 ? (
                        <div className="access-point-manager__empty">
                            No access points defined for this region yet. Add your first access point to get started.
                        </div>
                    ) : (
                        <div className="access-point-list">
                            {sortedAccessPoints.map(accessPoint => (
                                <div className="access-point-item" key={accessPoint.id}>
                                    <div className="access-point-item__info">
                                        <div className="access-point-item__name">
                                            {accessPoint.name}
                                        </div>
                                        <div className="access-point-item__type">
                                            {formatAccessType(accessPoint.type)}
                                        </div>
                                    </div>

                                    <div className="access-point-item__elevations">
                                        <div className="elevation-item">
                                            <span className="elevation-label">Min Safe:</span>
                                            <span className="elevation-value">{accessPoint.minSafeElevation} ft</span>
                                        </div>
                                        <div className="elevation-item">
                                            <span className="elevation-label">Min Usable:</span>
                                            <span className="elevation-value">{accessPoint.minUsableElevation} ft</span>
                                        </div>
                                    </div>

                                    <div className="access-point-item__actions">
                                        <button
                                            className="access-point-action-button"
                                            onClick={() => handleEditAccessPoint(accessPoint.id)}
                                            title="Edit access point"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="access-point-action-button access-point-action-button--delete"
                                            onClick={() => handleDeleteAccessPoint(accessPoint.id)}
                                            title="Delete access point"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

// Helper function to format access point type
const formatAccessType = (type: string): string => {
    return type.replace('_', ' ').split(' ')
        .map(word => word.charAt(0) + word.slice(1).toLowerCase())
        .join(' ');
};

// Access Point Form Component
interface AccessPointFormProps {
    accessPoint?: AccessPoint;
    onSave: (accessPoint: AccessPoint) => void;
    onCancel: () => void;
    existingAccessPointIds: string[];
}

const AccessPointForm: React.FC<AccessPointFormProps> = ({
                                                             accessPoint,
                                                             onSave,
                                                             onCancel,
                                                             existingAccessPointIds
                                                         }) => {
    const [formData, setFormData] = useState<AccessPoint>(
        accessPoint || {
            id: '',
            name: '',
            type: 'BOAT_RAMP',
            minSafeElevation: 0,
            minUsableElevation: 0,
            googleMapsLink: ''
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        // Parse numerical inputs
        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error for field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.id.trim()) {
            newErrors.id = 'Access point ID is required';
        } else if (
            !accessPoint &&
            existingAccessPointIds.includes(formData.id.trim())
        ) {
            newErrors.id = 'Access point ID must be unique';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (formData.minSafeElevation <= 0) {
            newErrors.minSafeElevation = 'Must be greater than 0';
        }

        if (formData.minUsableElevation <= 0) {
            newErrors.minUsableElevation = 'Must be greater than 0';
        }

        if (formData.minUsableElevation > formData.minSafeElevation) {
            newErrors.minUsableElevation = 'Must be less than or equal to safe elevation';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSave({
                ...formData,
                id: formData.id.trim(),
                name: formData.name.trim(),
                googleMapsLink: formData.googleMapsLink.trim()
            });
        }
    };

    return (
        <div className="access-point-form">
            <h3>{accessPoint ? 'Edit Access Point' : 'Add New Access Point'}</h3>

            <form onSubmit={handleSubmit}>
                <div className="access-point-form__grid">
                    <div className="form-field">
                        <label htmlFor="id">Access Point ID</label>
                        <input
                            type="text"
                            id="id"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            disabled={!!accessPoint} // Disable editing ID for existing access points
                            placeholder="e.g., wahweap-main"
                            className={errors.id ? 'error' : ''}
                        />
                        {errors.id && <div className="error-message">{errors.id}</div>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Wahweap Main Ramp"
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <div className="error-message">{errors.name}</div>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="type">Type</label>
                        <select
                            id="type"
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                        >
                            <option value="BOAT_RAMP">Boat Ramp</option>
                            <option value="PRIMITIVE_LAUNCH">Primitive Launch</option>
                            <option value="CHANNEL">Channel</option>
                            <option value="MARINA">Marina</option>
                        </select>
                    </div>
                </div>

                <div className="access-point-form__grid">
                    <div className="form-field">
                        <label htmlFor="minSafeElevation">Minimum Safe Elevation (ft)</label>
                        <input
                            type="number"
                            id="minSafeElevation"
                            name="minSafeElevation"
                            value={formData.minSafeElevation}
                            onChange={handleChange}
                            step="0.01"
                            className={errors.minSafeElevation ? 'error' : ''}
                        />
                        {errors.minSafeElevation && <div className="error-message">{errors.minSafeElevation}</div>}
                    </div>

                    <div className="form-field">
                        <label htmlFor="minUsableElevation">Minimum Usable Elevation (ft)</label>
                        <input
                            type="number"
                            id="minUsableElevation"
                            name="minUsableElevation"
                            value={formData.minUsableElevation}
                            onChange={handleChange}
                            step="0.01"
                            className={errors.minUsableElevation ? 'error' : ''}
                        />
                        {errors.minUsableElevation && <div className="error-message">{errors.minUsableElevation}</div>}
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="googleMapsLink">Google Maps Link (optional)</label>
                    <input
                        type="text"
                        id="googleMapsLink"
                        name="googleMapsLink"
                        value={formData.googleMapsLink}
                        onChange={handleChange}
                        placeholder="https://maps.google.com/?q=..."
                    />
                </div>

                <div className="form-actions">
                    <Button variant="secondary" onClick={onCancel} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {accessPoint ? 'Save Changes' : 'Add Access Point'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default AccessPointManager;
