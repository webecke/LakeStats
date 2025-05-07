import React from "react";
import StatItem from "./StatItem";
import "./LakeViewStyles.css";
import type { CurrentConditions as CurrentConditionsType } from "../../../shared/services/data";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface CurrentConditionsProps {
    data: CurrentConditionsType;
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({ data }) => {
    const dateString = data.date.toLocaleDateString("default", {
        month: "long",
        day: "numeric",
    });
    return (
        <div className="current-conditions">
            {new Date().getTime() - data.date.getTime() > 36 * 60 * 60 * 1000 && (
                <div className="outdated-data-warning">
                    <AlertTriangle size={18} />
                    <div>
                        <p>This data is out of date. The Bureau of Reclamation occasionally experiences delays in reporting.</p>
                        <p className="outdated-data-link">
                            <Link to="/data">Learn more</Link>
                        </p>
                    </div>
                </div>
            )}

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
                        <p>
                            The surface elevation of the lake in feet above sea
                            level at 12:00AM on {dateString}
                        </p>
                        <em>Exact reading: {data.levelToday}</em>
                    </div>
                }
            />

            <div className="stat-row">
                <StatItem
                    value={data.levelToday - data.levelYesterday}
                    label="Since Yesterday"
                    className="day-change"
                    tooltip={`Change in lake level since yesterday's reading [${data.levelYesterday} ft]`}
                />
                <StatItem
                    value={data.levelToday - data.levelTwoWeeksAgo}
                    label="Last 2 Weeks"
                    className="week-change"
                    tooltip={`Change in lake level over the past two weeks [${data.levelTwoWeeksAgo} ft]`}
                />
            </div>

            <div className="stat-row">
                <StatItem
                    value={data.levelToday - data.levelOneYearAgo}
                    label="Since A Year Ago"
                    className="year-change"
                    tooltip={`Change in lake level compared to the same date last year [${data.levelOneYearAgo} ft]`}
                />
                <StatItem
                    value={data.levelToday - data.levelTenYearAverage}
                    label="From 10 Year Avg"
                    className="ten-year-diff"
                    tooltip={
                        <p>
                            Difference between the current level and average for {dateString} of the last 10 years [{data.levelTenYearAverage.toFixed(3)} ft]
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
                            <p>Distance from the dam's designed capacity which is {data.referenceLevelFullPool} ft</p>
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
                                Distance from the lowest level that the dam can generate electricity which is {data.referenceLevelMinPowerPool} ft
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
                            <p>Distance from the lowest level that lets water out of the dam which is {data.referenceLevelDeadPool} ft</p>
                        </div>
                    }
                />
            </div>
        </div>
    );
};

export default CurrentConditions;
