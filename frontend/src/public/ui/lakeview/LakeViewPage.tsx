import React from 'react';
import LakeViewHeader from './LakeViewHeader';
import CurrentConditions from './CurrentConditions';
import LoadingSpinner from '../../../shared/components/LoadingSpinner.tsx';
import { useBasicLakeInfo } from '../../datahooks/useBasicLakeInfo';
import { useCurrentConditions } from '../../datahooks/useCurrentConditions';
import './LakeViewStyles.css';
import {useParams} from "react-router-dom";

const LakeViewPage: React.FC = () => {
    // Get lakeId from URL parameters
    const { lakeId } = useParams<{ lakeId: string }>();

    if (!lakeId) {
        return <div>Lake ID is required</div>;
    }

    // Use specialized hooks to fetch different pieces of data
    const {
        loading: loadingInfo,
        error: infoError,
        lakeInfo
    } = useBasicLakeInfo(lakeId);

    const {
        loading: loadingConditions,
        error: conditionsError,
        currentConditions,
        formattedDate
    } = useCurrentConditions(lakeId);

    // Show loading state if any data is still loading
    if (loadingInfo || loadingConditions) {
        return <LoadingSpinner />;
    }

    // Show error if lake info couldn't be loaded
    if (infoError || !lakeInfo) {
        return <div className="lake-view-error">Error: {infoError || 'Failed to load lake information'}</div>;
    }

    // Use the accent color from lake settings if available
    const accentColorStyle = lakeInfo.accentColor ?
        { "--brand-accent": lakeInfo.accentColor } as React.CSSProperties :
        {};

    return (
        <div className="lake-view" style={accentColorStyle}>
            <LakeViewHeader
                lakeName={lakeInfo.brandedName || lakeInfo.lakeName || lakeId}
                date={formattedDate || 'No data available'}
            />

            {conditionsError && (
                <div className="lake-view-error">Error loading conditions: {conditionsError}</div>
            )}

            {!conditionsError && currentConditions ? (
                <CurrentConditions
                    currentElevation={currentConditions.currentLevel}
                    dayChange={currentConditions.oneDayChange}
                    weekChange={currentConditions.twoWeekChange}
                    yearChange={currentConditions.oneYearChange}
                    tenYearDiff={currentConditions.differenceFromTenYearAverage}
                />
            ) : (
                <div className="lake-view-no-data">No current conditions available</div>
            )}
        </div>
    );
};

export default LakeViewPage;
