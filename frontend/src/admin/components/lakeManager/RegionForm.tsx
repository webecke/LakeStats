import React, { useState } from 'react';
import { LakeRegion } from '../../../shared/services/data';
import { Button } from '../../../shared/components/Button';

interface RegionFormProps {
    region?: LakeRegion;
    onSave: (region: LakeRegion) => void;
    onCancel: () => void;
    existingRegionIds: string[];
}

const RegionForm: React.FC<RegionFormProps> = ({
                                                   region,
                                                   onSave,
                                                   onCancel,
                                                   existingRegionIds
                                               }) => {
    // Create default form data, being careful with optional region
    const defaultFormData: LakeRegion = {
        id: '',
        name: '',
        description: '',
        sortOrder: 0,  // This will be overridden in the parent component
        accessPoints: []
    };

    // Initialize with region data if available, otherwise use defaults
    const [formData, setFormData] = useState<LakeRegion>(
        region ? {
            ...defaultFormData,
            ...region
        } : defaultFormData
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

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
            newErrors.id = 'Region ID is required';
        } else if (existingRegionIds.includes(formData.id)) {
            newErrors.id = 'Region ID must be unique';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Region name is required';
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
                description: formData.description.trim(),
                accessPoints: formData.accessPoints || []
            });
        }
    };

    return (
        <div className="region-form">
            <h3>{region ? 'Edit Region' : 'Add New Region'}</h3>

            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="id">Region ID</label>
                    <input
                        type="text"
                        id="id"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        disabled={!!region} // Disable editing ID for existing regions
                        placeholder="e.g., north, south"
                        className={errors.id ? 'error' : ''}
                    />
                    {errors.id && <div className="error-message">{errors.id}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="name">Region Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., North Lake, South Lake"
                        className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <div className="error-message">{errors.name}</div>}
                </div>

                <div className="form-field">
                    <label htmlFor="description">Region Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Brief description of this region"
                        rows={3}
                    />
                </div>

                <div className="form-actions">
                    <Button variant="secondary" onClick={onCancel} type="button">
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        {region ? 'Save Changes' : 'Add Region'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default RegionForm;
