import React, { useState } from "react";
import LakeViewHeader from "./LakeViewHeader";
import CurrentConditions from "./CurrentConditions";
import RegionSelector from "./RegionSelector";
import AccessPointList from "./AccessPointList";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { useBasicLakeInfo } from "../../datahooks/useBasicLakeInfo";
import { useLakeDetails } from "../../datahooks/useLakeDetails";
import { useCurrentConditions } from "../../datahooks/useCurrentConditions";
import "./LakeViewStyles.css";
import { useNavigate, useParams } from "react-router-dom";
import AsyncContainer from "../../components/AsyncContainer";
import { PageTitle } from "../../components/PageTitle";
import { handleNotFoundRedirect } from "../../../routes";
import { LakeSystemFeatures } from "../../../shared/services/data";
import { Callout } from "../../components/Callout.tsx";
import { Button } from "../../../shared/components/Button";

const LakeViewPage: React.FC = () => {
    const navigate = useNavigate();

    // Get lakeId from URL parameters
    const { lakeId } = useParams<{ lakeId: string }>();

    // Fetch basic lake info (name, status, etc.)
    const { loading: loadingInfo, error: infoError, lakeInfo } = useBasicLakeInfo(lakeId);

    // Fetch detailed lake data including regions
    const { loading: loadingDetails, error: detailsError, lakeDetails } = useLakeDetails(lakeId);

    const [showBetaFeedback, setShowBetaFeedback] = useState(localStorage.getItem("hideBetaFeedback") !== "true");

    // Fetch current conditions data
    const {
        loading: loadingConditions,
        error: conditionsError,
        currentConditions,
    } = useCurrentConditions(lakeId);

    if (!lakeId) {
        return <div>Lake ID is required</div>;
    }

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
    if (lakeInfo.status === "DISABLED") {
        return <div className="lake-view-error">This lake is currently disabled</div>;
    }

    // Custom accent color style
    const accentColorStyle = lakeInfo.accentColor
        ? ({ "--brand-accent": lakeInfo.accentColor } as React.CSSProperties)
        : {};

    const handleCloseFeedback = () => {
        localStorage.setItem("hideBetaFeedback", "true")
        setShowBetaFeedback(false);
    }

    return (
        <div className="lake-view" style={accentColorStyle}>
            <PageTitle title={lakeInfo.lakeName + " Conditions"} />
            <LakeViewHeader
                lakeName={lakeInfo.lakeName}
                brandColor={lakeInfo.accentColor}
                brandedName={lakeInfo.brandedName}
            />

            <AsyncContainer
                isLoading={loadingConditions}
                error={conditionsError}
                data={currentConditions}
            >
                {(data) => (
                    <>
                        <CurrentConditions data={data} />

                        <Callout
                            visible={showBetaFeedback}
                            type={"info"}
                            title={"Give us feedback!"}
                            onClose={handleCloseFeedback}>
                            <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
                                <p>Help us improve LakeStats! Take 60 seconds to share your thoughts</p>
                                <a href="https://forms.gle/tQ6yU7WRMDdUHZdz9" target="_blank"><Button>Take survey</Button></a>
                            </div>
                        </Callout>

                        <RegionSelector regions={lakeDetails.regions} showSelector={lakeInfo?.features.includes(LakeSystemFeatures.REGIONS)}>
                            {lakeInfo?.features.includes(LakeSystemFeatures.ACCESS_POINTS) && (
                                <AccessPointList currentElevation={data.levelToday} />
                            )}
                        </RegionSelector>
                    </>
                )}
            </AsyncContainer>
        </div>
    );
};

export default LakeViewPage;
