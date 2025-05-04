import React from "react";
import StatItem from "./StatItem";
import "./LakeViewStyles.css";
import type { CurrentConditions as CurrentConditionsType } from "../../../shared/services/data";

interface CurrentConditionsProps {
    data: CurrentConditionsType;
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({ data }) => {
    const dateString = data.date.toLocaleDateString("default", {
        month: "long",
        day: "2-digit",
    });
    return (
        <div className="current-conditions">
            <StatItem
                value={data.levelToday}
                label="Current Elevation"
                secondaryLabel={
                    "Last reading: " +
                    data.date.toLocaleDateString("default", {
                        month: "long",
                        day: "2-digit",
                        year: "numeric",
                    })
                }
                className="current-elevation"
                isCurrentElevation={true}
                tooltip={
                    <div>
                        <strong>Lake Elevation</strong>
                        <p>
                            The current surface elevation of the lake, measured in feet above sea
                            level at 11:59PM on {dateString}
                        </p>
                    </div>
                }
            />

            <div className="stat-row">
                <StatItem
                    value={data.levelToday - data.levelYesterday}
                    label="Since Yesterday"
                    className="day-change"
                    tooltip="Change in lake level since yesterday's reading"
                />
                <StatItem
                    value={data.levelToday - data.levelTwoWeeksAgo}
                    label="Last 2 Weeks"
                    className="week-change"
                    tooltip="Change in lake level over the past two weeks"
                />
            </div>

            <div className="stat-row">
                <StatItem
                    value={data.levelToday - data.levelOneYearAgo}
                    label="Since A Year Ago"
                    className="year-change"
                    tooltip="Change in lake level compared to the same date last year"
                />
                <StatItem
                    value={data.levelToday - data.levelTenYearAverage}
                    label="From 10 Year Avg"
                    className="ten-year-diff"
                    tooltip={
                        <p>
                            Difference between the current level and 10-year average for this date:{" "}
                            {dateString}
                        </p>
                    }
                />
            </div>

            <div className="stat-row pool-levels">
                <StatItem
                    showStat={!!data.referenceLevelFullPool}
                    value={data.levelToday - data.referenceLevelFullPool}
                    label="vs Full Pool"
                    isTrendStat={false}
                    tooltip={
                        <div>
                            <strong>Full Pool</strong>
                            <p>Distance from the dam's designed capacity</p>
                        </div>
                    }
                />
                <StatItem
                    showStat={!!data.referenceLevelMinPowerPool}
                    value={data.levelToday - data.referenceLevelMinPowerPool}
                    label="vs Power Pool"
                    isTrendStat={false}
                    tooltip={
                        <div>
                            <strong>Min Power Pool</strong>
                            <p>
                                Distance from the lowest level that the dam can generate electricity
                            </p>
                        </div>
                    }
                />
                <StatItem
                    showStat={!!data.referenceLevelDeadPool}
                    value={data.levelToday - data.referenceLevelDeadPool}
                    label="vs Dead Pool"
                    isTrendStat={false}
                    tooltip={
                        <div>
                            <strong>Dead Pool</strong>
                            <p>Distance from the lowest level that lets water out of the dam</p>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default CurrentConditions;
