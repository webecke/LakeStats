import React, { useState, useEffect } from 'react';
import { LakeRegion } from '../../../shared/services/data';
import Tooltip from '../../components/Tooltip';
import './RegionSelector.css';
import { RegionProvider } from './RegionContext';

interface RegionSelectorProps {
    regions: Record<string, LakeRegion>;
    children: React.ReactNode;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ regions, children }) => {
    // Convert regions record to array and sort by sortOrder
    const regionArray = Object.values(regions)
        .sort((a, b) => {
            // First sort by sortOrder if available
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
                return a.sortOrder - b.sortOrder;
            }
            // Fallback to sorting by name
            return a.name.localeCompare(b.name);
        });

    // State for the selected region ID
    const [selectedRegionId, setSelectedRegionId] = useState<string>('');

    // Set the initial selected region when the component mounts or regions change
    useEffect(() => {
        if (regionArray.length > 0) {
            setSelectedRegionId(regionArray[0].id);
        }
    }, [regions]);

    // If no regions, render nothing
    if (regionArray.length === 0) {
        return null;
    }

    // Get the currently selected region
    const selectedRegion = regions[selectedRegionId];

    // If no selected region (should not happen given the useEffect), render nothing
    if (!selectedRegion) {
        return null;
    }

    return (
        <div className="region-container">
            {/* Only show the tabs if there is more than one region */}
            {regionArray.length > 1 && (
                <div className="region-tabs">
                    {regionArray.map((region) => (
                        <Tooltip
                            key={region.id}
                            content={region.description || null}
                        >
                            <button
                                className={`region-tab ${selectedRegionId === region.id ? 'active' : ''}`}
                                onClick={() => setSelectedRegionId(region.id)}
                            >
                                {region.name}
                            </button>
                        </Tooltip>
                    ))}
                </div>
            )}

            <div className="region-content">
                <RegionProvider value={{ selectedRegion, setSelectedRegionId }}>
                    {children}
                </RegionProvider>
            </div>
        </div>
    );
};

export default RegionSelector;
