import React from 'react';
import LakeViewHeader from './LakeViewHeader';
import CurrentConditions from './CurrentConditions';
import RegionSelector from './RegionSelector';
import AccessPointList from './AccessPointList';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import {useBasicLakeInfo} from '../../datahooks/useBasicLakeInfo';
import {useLakeDetails} from '../../datahooks/useLakeDetails';
import {useCurrentConditions} from '../../datahooks/useCurrentConditions';
import './LakeViewStyles.css';
import {useNavigate, useParams} from "react-router-dom";
import AsyncContainer from "../../components/AsyncContainer";
import {PageTitle} from "../../components/PageTitle";
import {handleNotFoundRedirect} from "../../../routes";
import {LakeSystemFeatures} from "../../../shared/services/data";

const LakeViewPage: React.FC = () => {
    const navigate = useNavigate();

    // Get lakeId from URL parameters
    const { lakeId } = useParams<{ lakeId: string }>();

    if (!lakeId) {
        return <div>Lake ID is required</div>;
    }

    // Fetch basic lake info (name, status, etc.)
    const {
        loading: loadingInfo,
        error: infoError,
        lakeInfo
    } = useBasicLakeInfo(lakeId);

    // Fetch detailed lake data including regions
    const {
        loading: loadingDetails,
        error: detailsError,
        lakeDetails
    } = useLakeDetails(lakeId);

    // Fetch current conditions data
    const {
        loading: loadingConditions,
        error: conditionsError,
        currentConditions,
    } = useCurrentConditions(lakeId);

    // Show loading state if any data is still loading
    if (loadingInfo || loadingDetails) {
        return <LoadingSpinner />;
    }

    // Show error if lake info couldn't be loaded
    if (infoError || !lakeInfo) {
        handleNotFoundRedirect(lakeId, navigate);
        return null;
    }

    // Show error if lake details couldn't be loaded
    if (detailsError || !lakeDetails) {
        return <div className="lake-view-error">Failed to load lake details: {detailsError}</div>;
    }

    // Check if lake is disabled
    if (lakeInfo.status === 'DISABLED') {
        return <div className="lake-view-error">This lake is currently disabled</div>;
    }

    // Custom accent color style
    const accentColorStyle = lakeInfo.accentColor ?
        { "--brand-accent": lakeInfo.accentColor } as React.CSSProperties :
        {};

    // Determine if regions section should be shown
    const hasRegions = lakeDetails.regions && Object.keys(lakeDetails.regions).length > 0;

    return (
        <div className="lake-view" style={accentColorStyle}>
            <PageTitle title={lakeInfo.lakeName + " Conditions"} />
            <LakeViewHeader
                lakeName={lakeInfo.lakeName}
                brandColor={lakeInfo.accentColor}
                brandedName={lakeInfo.brandedName}
            />

            <AsyncContainer isLoading={loadingConditions} error={conditionsError} data={currentConditions}>
                {(data) => (
                    <>
                        {/* Current Conditions Section */}
                        <CurrentConditions data={data} />

                        {/* Regions and Access Points Section - using direct children */}
                        {hasRegions && (
                            <RegionSelector regions={lakeDetails.regions}>
                                {lakeInfo?.features.includes(LakeSystemFeatures.ACCESS_POINTS) && (
                                    <AccessPointList currentElevation={data.currentLevel} />
                                )}
                            </RegionSelector>
                        )}
                    </>
                )}
            </AsyncContainer>
        </div>
    );
};

export default LakeViewPage;
