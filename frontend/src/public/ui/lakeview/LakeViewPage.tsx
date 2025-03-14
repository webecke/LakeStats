import React from 'react';
import LakeViewHeader from './LakeViewHeader';
import CurrentConditions from './CurrentConditions';
import LoadingSpinner from '../../../shared/components/LoadingSpinner.tsx';
import {useBasicLakeInfo} from '../../datahooks/useBasicLakeInfo';
import {useCurrentConditions} from '../../datahooks/useCurrentConditions';
import './LakeViewStyles.css';
import {useParams, useNavigate} from "react-router-dom";
import AsyncContainer from "../../components/AsyncContainer.tsx";
import {PageTitle} from "../../components/PageTitle.tsx";
import {handleNotFoundRedirect} from "../../../routes.tsx";

const LakeViewPage: React.FC = () => {
    const navigate = useNavigate();

    // Get lakeId from URL parameters
    const { lakeId } = useParams<{ lakeId: string }>();

    if (!lakeId) {
        return <div>Lake ID is required. How did you get to this page?</div>;
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
        handleNotFoundRedirect(lakeId, navigate);
        return null;
    }

    if (lakeInfo.status === 'DISABLED') {
        return <div className="lake-view-error">This lake is currently disabled</div>;
    }

    // Rest of your component remains the same
    const accentColorStyle = lakeInfo.accentColor ?
        { "--brand-accent": lakeInfo.accentColor } as React.CSSProperties :
        {};

    return (
        <div className="lake-view" style={accentColorStyle}>
            <PageTitle title={lakeInfo.lakeName + " Conditions"} />
            <LakeViewHeader
                lakeName={lakeInfo.lakeName}
                brandColor={lakeInfo.accentColor}
                brandedName={lakeInfo.brandedName}
                date={formattedDate || 'No data available'}
            />

            <AsyncContainer isLoading={loadingConditions} error={conditionsError} data={currentConditions}>
                {(data) => (
                    <CurrentConditions data={data} />
                )}
            </AsyncContainer>
        </div>
    );
};

export default LakeViewPage;
