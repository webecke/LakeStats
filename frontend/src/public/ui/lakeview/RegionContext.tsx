import React, { createContext, useContext } from 'react';
import { LakeRegion } from '../../../shared/services/data';

interface RegionContextProps {
    selectedRegion: LakeRegion;
    setSelectedRegionId: (id: string) => void;
}

// Create the context
const RegionContext = createContext<RegionContextProps | undefined>(undefined);

// Create a hook to use the region context
export const useSelectedRegion = () => {
    const context = useContext(RegionContext);
    if (context === undefined) {
        throw new Error('useSelectedRegion must be used within a RegionProvider');
    }
    return context;
};

// Create the provider component
interface RegionProviderProps {
    children: React.ReactNode;
    value: RegionContextProps;
}

export const RegionProvider: React.FC<RegionProviderProps> = ({ children, value }) => {
    return (
        <RegionContext.Provider value={value}>
            {children}
        </RegionContext.Provider>
    );
};
