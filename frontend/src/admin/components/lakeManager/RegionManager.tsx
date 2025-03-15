import React, { useState } from 'react';
import { LakeMetaData, LakeRegion } from '../../../shared/services/data';
import './RegionManager.css';
import { Button } from '../../../shared/components/Button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import AccessPointManager from './AccessPointManager';

interface RegionManagerProps {
    lakeData: LakeMetaData;
    onLakeDataChange: (updatedLakeData: LakeMetaData) => void;
}

const RegionManager: React.FC<RegionManagerProps> = ({ lakeData, onLakeDataChange }) => {
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
    const [isAddingRegion, setIsAddingRegion] = useState(false);
    const [isEditingRegion, setIsEditingRegion] = useState(false);

    // Get array of regions from the record
    const regionsList = Object.values(lakeData.regions || {});

    // Handle adding a new region
    const handleAddRegion = () => {
        setIsAddingRegion(true);
        setIsEditingRegion(false);
        setSelectedRegionId(null);
    };

    // Handle editing an existing region
    const handleEditRegion = (regionId: string) => {
        setSelectedRegionId(regionId);
        setIsEditingRegion(true);
        setIsAddingRegion(false);
    };

    // Handle deleting a region
    const handleDeleteRegion = (regionId: string) => {
        if (!window.confirm(`Are you sure you want to delete this region and all its access points?`)) {
            return;
        }

        const updatedRegions = { ...lakeData.regions };
        delete updatedRegions[regionId];

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions
        });

        if (selectedRegionId === regionId) {
            setSelectedRegionId(null);
            setIsEditingRegion(false);
        }
    };

    // Handle saving a new or edited region
    const handleSaveRegion = (region: LakeRegion) => {
        const updatedRegions = {
            ...lakeData.regions,
            [region.id]: region
        };

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions
        });

        setSelectedRegionId(region.id);
        setIsAddingRegion(false);
        setIsEditingRegion(false);
    };

    // Handle canceling region add/edit
    const handleCancelRegion = () => {
        setIsAddingRegion(false);
        setIsEditingRegion(false);
    };

    // Handle updating access points in a region
    const handleUpdateAccessPoints = (regionId: string, accessPoints: any[]) => {
        if (!lakeData.regions[regionId]) return;

        const updatedRegion = {
            ...lakeData.regions[regionId],
            accessPoints
        };

        const updatedRegions = {
            ...lakeData.regions,
            [regionId]: updatedRegion
        };

        onLakeDataChange({
            ...lakeData,
            regions: updatedRegions
        });
    };

    return (
        <div className="region-manager">
            <div className="region-manager__header">
                <h2 className="region-manager__title">Lake Regions</h2>
                <Button
                    variant="primary"
                    onClick={handleAddRegion}
                    disabled={isAddingRegion || isEditingRegion}
                >
                    <Plus size={16} />
                    Add Region
                </Button>
            </div>

            <div className="region-manager__content">
                <div className="region-manager__sidebar">
                    {regionsList.length === 0 ? (
                        <div className="region-manager__empty">
                            No regions defined yet. Add your first region to get started.
                        </div>
                    ) : (
                        <ul className="region-manager__list">
                            {regionsList.map(region => (
                                <li
                                    key={region.id}
                                    className={`region-manager__list-item ${selectedRegionId === region.id ? 'active' : ''}`}
                                >
                                    <button
                                        className="region-manager__list-button"
                                        onClick={() => setSelectedRegionId(region.id)}
                                    >
                                        {region.name}
                                    </button>

                                    <div className="region-manager__list-actions">
                                        <button
                                            className="region-manager__action-button"
                                            onClick={() => handleEditRegion(region.id)}
                                            title="Edit region"
                                            disabled={isAddingRegion || isEditingRegion}
                                        >
                                            <Edit size={14} />
                                        </button>
                                        <button
                                            className="region-manager__action-button region-manager__action-button--delete"
                                            onClick={() => handleDeleteRegion(region.id)}
                                            title="Delete region"
                                            disabled={isAddingRegion || isEditingRegion}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="region-manager__detail">
                    {isAddingRegion && (
                        <RegionForm
                            onSave={handleSaveRegion}
                            onCancel={handleCancelRegion}
                            existingRegionIds={Object.keys(lakeData.regions || {})}
                        />
                    )}

                    {isEditingRegion && selectedRegionId && (
                        <RegionForm
                            region={lakeData.regions[selectedRegionId]}
                            onSave={handleSaveRegion}
                            onCancel={handleCancelRegion}
                            existingRegionIds={Object.keys(lakeData.regions || {}).filter(id => id !== selectedRegionId)}
                        />
                    )}

                    {!isAddingRegion && !isEditingRegion && selectedRegionId && (
                        <AccessPointManager
                            region={lakeData.regions[selectedRegionId]}
                            onUpdateAccessPoints={(accessPoints) =>
                                handleUpdateAccessPoints(selectedRegionId, accessPoints)
                            }
                        />
                    )}

                    {!isAddingRegion && !isEditingRegion && !selectedRegionId && regionsList.length > 0 && (
                        <div className="region-manager__select-prompt">
                            Select a region from the list to manage its access points, or add a new region.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Region Form Component for adding/editing regions
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
    const [formData, setFormData] = useState<LakeRegion>(
        region || {
            id: '',
            name: '',
            description: '',
            accessPoints: []
        }
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

export default RegionManager;
