import React, { useEffect, useState } from "react";
import LakeViewHeader from "./LakeViewHeader";
import CurrentConditions from "./CurrentConditions";
import RegionSelector from "./RegionSelector";
import AccessPointList from "./AccessPointList";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import { useLakeSystemSettings } from "../../datahooks/useLakeSystemSettings.ts";
import { useLakeDetails } from "../../datahooks/useLakeDetails";
import { useCurrentConditions } from "../../datahooks/useCurrentConditions";
import "./LakeViewStyles.css";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitle } from "../../components/PageTitle";
import { handleNotFoundRedirect } from "../../../routes";
import { LakeSystemFeatures } from "../../../shared/services/data";
import { Callout } from "../../components/Callout.tsx";
import { Button } from "../../../shared/components/Button";
import { getFeetAndInchesWithFraction } from "../dataRenderTools.ts";
import Past365Days from "./Past365Days.tsx";

const LakeViewPage: React.FC = () => {
    const navigate = useNavigate();
    const { lakeId } = useParams<{ lakeId: string }>();

    const [showBetaFeedback, setShowBetaFeedback] = useState(
        localStorage.getItem("hideBetaFeedback") !== "true"
    );
    const [summaryString, setSummaryString] = useState("");

    // Fetch all the data
    const {
        loading: loadingSettings,
        error: settingsError,
        data: lakeSettings,
    } = useLakeSystemSettings(lakeId);
    const {
        loading: loadingDetails,
        error: detailsError,
        data: lakeDetails,
    } = useLakeDetails(lakeId);
    const {
        loading: loadingConditions,
        error: conditionsError,
        data: currentConditions,
    } = useCurrentConditions(lakeId);

    useEffect(() => {
        const formatValue = (value: number) => {
            const { feet, inches, fraction } = getFeetAndInchesWithFraction(Math.abs(value));
            const prefix = value >= 0 ? "up" : "down";

            if (feet > 0) {
                return `${feet} feet ${inches}${fraction ? " " + fraction : ""} inches ${prefix}`;
            } else {
                return `${inches}${fraction ? " " + fraction : ""} inches ${prefix}`;
            }
        };

        if (lakeSettings && currentConditions) {
            const summary: string =
                `Latest stats for ${lakeSettings.lakeName} \n` +
                `Current elevation: ${currentConditions.levelToday} ft\n` +
                `${formatValue(currentConditions.levelToday - currentConditions.levelYesterday)} vs yesterday\n` +
                `${formatValue(currentConditions.levelToday - currentConditions.levelOneYearAgo)} vs 1 year ago\n`;
            setSummaryString(summary);
        }
    }, [lakeSettings, lakeId, currentConditions]);

    if (!lakeId) {
        return <div>Lake ID is required</div>;
    }

    // Show loading state if any data is still loading
    if (loadingSettings || loadingDetails) {
        return <LoadingSpinner />;
    }

    // Show error if lake info couldn't be loaded
    if (settingsError || !lakeSettings) {
        handleNotFoundRedirect(lakeId, navigate);
        return null;
    }

    // Show error if lake details couldn't be loaded
    if (detailsError || !lakeDetails) {
        return <div className="lake-view-error">Failed to load lake details: {detailsError}</div>;
    }

    // Check if lake is disabled
    if (lakeSettings.status === "DISABLED") {
        return <div className="lake-view-error">This lake is currently disabled</div>;
    }

    // Custom accent color style
    const accentColorStyle = lakeSettings.accentColor
        ? ({ "--brand-accent": lakeSettings.accentColor } as React.CSSProperties)
        : {};

    const handleCloseFeedback = () => {
        localStorage.setItem("hideBetaFeedback", "true");
        setShowBetaFeedback(false);
    };

    return (
        <div className="lake-view" style={accentColorStyle}>
            <PageTitle title={lakeSettings.lakeName + " Conditions"} />
            <LakeViewHeader
                lakeId={lakeId}
                lakeName={lakeSettings.lakeName}
                brandColor={lakeSettings.accentColor}
                brandedName={lakeSettings.brandedName}
                summaryString={summaryString}
            />

            <CurrentConditions
                lakeDetails={lakeDetails}
                currentConditionsData={currentConditions}
                isLoading={loadingConditions}
                loadingError={conditionsError}
            />

            <Callout
                visible={showBetaFeedback}
                type={"info"}
                title={"Give us feedback!"}
                onClose={handleCloseFeedback}
            >
                <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem" }}>
                    <p>Help us improve LakeStats! Take 60 seconds to share your thoughts</p>
                    <a href="https://forms.gle/tQ6yU7WRMDdUHZdz9" target="_blank">
                        <Button>Take survey</Button>
                    </a>
                </div>
            </Callout>

            <Past365Days
                lakeSettings={lakeSettings}
                todayLevel={currentConditions?.levelToday || 0}
            />

            <RegionSelector
                regions={lakeDetails.regions}
                showSelector={lakeSettings?.features.includes(LakeSystemFeatures.REGIONS)}
            >
                <AccessPointList
                    lakeSystemSettings={lakeSettings}
                    currentElevation={currentConditions && currentConditions.levelToday}
                    isLoading={loadingConditions}
                    loadingError={conditionsError}
                />
            </RegionSelector>
        </div>
    );
};

export default LakeViewPage;
