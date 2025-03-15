import React, { useState } from 'react';
import { AccessPoint } from '../../../shared/services/data';
import { Button } from '../../../shared/components/Button';
import './AccessPointManager.css';

interface AccessPointFormProps {
    accessPoint?: AccessPoint;
    onSave: (accessPoint: AccessPoint) => void;
    onCancel: () => void;
    existingIds: string[];
}

const AccessPointForm: React.FC<AccessPointFormProps> = ({
                                                             accessPoint,
                                                             onSave,
                                                             onCancel,
                                                             existingIds
                                                         }) => {
    // Default form data
    const defaultFormData: AccessPoint = {
        id: '',
        name: '',
        type: 'BOAT_RAMP',
        minSafeElevation: 0,
        minUsableElevation: 0,
        googleMapsLink: '',
        sortOrder: 0 // This will be set automatically in the parent component
    };

    // Initialize with access point data if available, otherwise use defaults
    const [formData, setFormData] = useState<AccessPoint>(
        accessPoint ? { ...defaultFormData, ...accessPoint } : defaultFormData
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when field is edited
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
        } else if (existingIds.includes(formData.id)) {
            newErrors.id = 'Access point ID must be unique';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Access point name is required';
        }

        if (isNaN(formData.minSafeElevation)) {
            newErrors.minSafeElevation = 'Minimum safe elevation must be a number';
        }

        if (isNaN(formData.minUsableElevation)) {
            newErrors.minUsableElevation = 'Minimum usable elevation must be a number';
        }

        if (formData.minUsableElevation > formData.minSafeElevation) {
            newErrors.minUsableElevation = 'Minimum usable elevation must be less than or equal to minimum safe elevation';
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
                <div className="form-field">
                    <label htmlFor="id">Access Point ID</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        disabled={!!accessPoint} // Disable editing ID for existing access points
                        placeholder="e.g., north-ramp, east-marina"
                        className={errors.id ? 'error' : ''}
                    />
                    {errors.id && <div className="error-message">{errors.id}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="name">Access Point Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., North Boat Ramp"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="type">Access Point Type</label>
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

                <div className="form-field">
                    <label htmlFor="minSafeElevation">Minimum Safe Elevation (ft)</label>
                    <input
                        type="number"
                        id="minSafeElevation"
                        name="minSafeElevation"
                        value={formData.minSafeElevation}
                        onChange={handleChange}
                        step="0.1"
                        placeholder="e.g., 3500.0"
                        className={errors.minSafeElevation ? 'error' : ''}
                    />
                    <div className="form-field-help">
                        The minimum lake elevation at which this access point is considered safe to use
                    </div>
                    {errors.minSafeElevation && (
                        <div className="error-message">{errors.minSafeElevation}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="minUsableElevation">Minimum Usable Elevation (ft)</label>
                    <input
                        type="number"
                        id="minUsableElevation"
                        name="minUsableElevation"
                        value={formData.minUsableElevation}
                        onChange={handleChange}
                        step="0.1"
                        placeholder="e.g., 3498.0"
                        className={errors.minUsableElevation ? 'error' : ''}
                    />
                    <div className="form-field-help">
                        The minimum lake elevation at which this access point can be used (may be hazardous)
                    </div>
                    {errors.minUsableElevation && (
                        <div className="error-message">{errors.minUsableElevation}</div>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="googleMapsLink">Google Maps Link</label>
                    <input
                        type="text"
                        id="googleMapsLink"
                        name="googleMapsLink"
                        value={formData.googleMapsLink || ''}
                        onChange={handleChange}
                        placeholder="https://goo.gl/maps/..."
                    />
                    <div className="form-field-help">
                        Optional. Provide a Google Maps link to this access point
                    </div>
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

export default AccessPointForm;
