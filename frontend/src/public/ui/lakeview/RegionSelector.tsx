import React, { useState, useEffect } from "react";
import { LakeRegion } from "../../../shared/services/data";
import "./RegionSelector.css";
import { RegionProvider } from "./RegionContext";

interface RegionSelectorProps {
    regions: Record<string, LakeRegion>;
    children: React.ReactNode;
    /** If true, show the region selector tabs. If false, only show the first region. */
    showSelector: boolean;
}

const RegionSelector: React.FC<RegionSelectorProps> = ({ regions, children, showSelector }) => {
    // Convert regions record to array and sort by sortOrder
    const regionArray = Object.values(regions).sort((a, b) => {
        // First sort by sortOrder if available
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
            return a.sortOrder - b.sortOrder;
        }
        // Fallback to sorting by name
        return a.name.localeCompare(b.name);
    });

    // State for the selected region ID
    const [selectedRegionId, setSelectedRegionId] = useState<string>("");

    useEffect(() => {
        const sortedRegions = Object.values(regions).sort((a, b) => {
            if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
                return a.sortOrder - b.sortOrder;
            }
            return a.name.localeCompare(b.name);
        });

        if (sortedRegions.length > 0) {
            setSelectedRegionId(sortedRegions[0].id);
        }
    }, [regions]);

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
            {regionArray.length > 1 && showSelector && (
                <div className="region-tabs">
                    {regionArray.map((region) => (
                        <button
                            className={`region-tab ${selectedRegionId === region.id ? "active" : ""}`}
                            onClick={() => setSelectedRegionId(region.id)}
                        >
                            {region.name}
                        </button>
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
