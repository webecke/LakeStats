import React from "react";
import StatItem from "./StatItem";
import "./LakeViewStyles.css";
import type {
    CurrentConditions as CurrentConditionsType,
    LakeMetaData,
} from "../../../shared/services/data";
import StaleDataWarning from "./StaleDataWarning.tsx";

interface CurrentConditionsProps {
    currentConditionsData: CurrentConditionsType;
    lakeDetails: LakeMetaData;
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({
    currentConditionsData,
    lakeDetails,
}) => {
    const dateString = currentConditionsData.date.toLocaleDateString("default", {
        month: "long",
        day: "numeric",
    });
    return (
        <div className="current-conditions">
            <StaleDataWarning recentDataDate={currentConditionsData.date} />

            <StatItem
                value={currentConditionsData.levelToday}
                label="Current Elevation"
                secondaryLabel={
                    "Last reading: " +
                    currentConditionsData.date.toLocaleDateString("default", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    })
                }
                className="current-elevation"
                isCurrentElevation={true}
                tooltip={
                    <div>
                        <p>
                            The surface elevation of the lake in feet above sea level at 12:00AM on{" "}
                            {dateString}
                        </p>
                        <em>Exact reading: {currentConditionsData.levelToday}</em>
                    </div>
                }
            />

            <div className="stat-row">
                <StatItem
                    value={currentConditionsData.levelToday - currentConditionsData.levelYesterday}
                    label="vs Yesterday"
                    className="day-change"
                    tooltip={`Change in lake level since yesterday's reading [${currentConditionsData.levelYesterday} ft]`}
                />
                <StatItem
                    value={
                        currentConditionsData.levelToday - currentConditionsData.levelTwoWeeksAgo
                    }
                    label="vs 2 Weeks Ago"
                    className="week-change"
                    tooltip={`Change in lake level over the past two weeks [${currentConditionsData.levelTwoWeeksAgo} ft]`}
                />
            </div>

            <div className="stat-row">
                <StatItem
                    value={currentConditionsData.levelToday - currentConditionsData.levelOneYearAgo}
                    label="vs 1 Year Ago"
                    className="year-change"
                    tooltip={`Change in lake level compared to the same date last year [${currentConditionsData.levelOneYearAgo} ft]`}
                />
                <StatItem
                    value={
                        currentConditionsData.levelToday - currentConditionsData.levelTenYearAverage
                    }
                    label="vs 10 Year Avg"
                    className="ten-year-diff"
                    tooltip={
                        <p>
                            Difference between the current level and average for {dateString} of the
                            last 10 years [{currentConditionsData.levelTenYearAverage.toFixed(3)}{" "}
                            ft]
                        </p>
                    }
                />
            </div>

            <div className="stat-row pool-levels">
                <StatItem
                    showStat={!!lakeDetails.fullPoolElevation}
                    value={currentConditionsData.levelToday - lakeDetails.fullPoolElevation}
                    label="vs Full Pool"
                    isTrendStat={false}
                    tooltip={
                        <div>
                            <strong>Full Pool</strong>
                            <p>
                                Distance from the dam's designed capacity which is{" "}
                                {lakeDetails.fullPoolElevation} ft
                            </p>
                        </div>
                    }
                />
                <StatItem
                    showStat={!!lakeDetails.minPowerPoolElevation}
                    value={currentConditionsData.levelToday - lakeDetails.minPowerPoolElevation}
                    label="vs Power Pool"
                    isTrendStat={false}
                    tooltip={
                        <div>
                            <strong>Min Power Pool</strong>
                            <p>
                                Distance from the lowest level that the dam can generate electricity
                                which is {lakeDetails.minPowerPoolElevation} ft
                            </p>
                        </div>
                    }
                />
                <StatItem
                    showStat={!!lakeDetails.deadPoolElevation}
                    value={currentConditionsData.levelToday - lakeDetails.deadPoolElevation}
                    label="vs Dead Pool"
                    isTrendStat={false}
                    tooltip={
                        <div>
                            <strong>Dead Pool</strong>
                            <p>
                                Distance from the lowest level that lets water out of the dam which
                                is {lakeDetails.deadPoolElevation} ft
                            </p>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default CurrentConditions;
