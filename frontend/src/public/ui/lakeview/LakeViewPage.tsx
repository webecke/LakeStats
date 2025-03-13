import React from 'react';
import LakeViewHeader from './LakeViewHeader';
import CurrentConditions from './CurrentConditions';
import LoadingSpinner from '../../../shared/components/LoadingSpinner.tsx';
import { useBasicLakeInfo } from '../../datahooks/useBasicLakeInfo';
import { useCurrentConditions } from '../../datahooks/useCurrentConditions';
import './LakeViewStyles.css';
import {useParams} from "react-router-dom";
import AsyncContainer from "../../components/AsyncContainer.tsx";

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

    if (loadingInfo) {
        return <LoadingSpinner />;
    }

    // Show error if lake info couldn't be loaded
    if (infoError || !lakeInfo) {
        return <div className="lake-view-error">Error: {infoError || 'Failed to load lake information'}</div>;
    }

    if (lakeInfo.status === 'DISABLED') {
        return <div className="lake-view-error">This lake is currently disabled</div>;
    }

    // Use the accent color from lake settings if available
    const accentColorStyle = lakeInfo.accentColor ?
        { "--brand-accent": lakeInfo.accentColor } as React.CSSProperties :
        {};

    return (
        <div className="lake-view" style={accentColorStyle}>
            <LakeViewHeader
                lakeName={lakeInfo.lakeName}
                brandColor={lakeInfo.accentColor}
                brandedName={lakeInfo.brandedName}
                date={formattedDate || 'No data available'}
            />

            <AsyncContainer isLoading={loadingConditions} error={conditionsError} data={currentConditions}>
                {(data) => (
                    <CurrentConditions
                        currentElevation={data.currentLevel}
                        dayChange={data.oneDayChange}
                        weekChange={data.twoWeekChange}
                        yearChange={data.oneYearChange}
                        tenYearDiff={data.differenceFromTenYearAverage}
                    />
                )}
            </AsyncContainer>
        </div>
    );
};

export default LakeViewPage;
