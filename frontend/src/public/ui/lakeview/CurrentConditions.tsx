import React from 'react';
import StatItem from './StatItem.tsx';
import './LakeViewStyles.css';
import type {CurrentConditions} from "../../../shared/services/data";

interface CurrentConditionsProps {
    data: CurrentConditions
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({data}) => {
    return (
        <div className="current-conditions">
            <StatItem
                value={data.currentLevel}
                label="Current Elevation"
                className="current-elevation"
                isCurrentElevation={true}
            />

            <div className="stat-row">
                <StatItem
                    value={data.oneDayChange}
                    label="Since Yesterday"
                    className="day-change"
                />
                <StatItem
                    value={data.twoWeekChange}
                    label="Last 2 Weeks"
                    className="week-change"
                />
            </div>

            <div className="stat-row">
                <StatItem
                    value={data.oneYearChange}
                    label="Since A Year Ago"
                    className="year-change"
                />
                <StatItem
                    value={data.differenceFromTenYearAverage}
                    label="From 10 Year Avg"
                    className="ten-year-diff"
                />
            </div>

            <div className="stat-row">
                <StatItem
                    value={data.differenceFromFullPool}
                    label="VS Full Pool"
                    isTrendStat={false}
                />
                <StatItem
                    value={data.differenceFromMinPowerPool}
                    label="VS Power Pool"
                    isTrendStat={false}
                />
                <StatItem
                    value={data.differenceFromDeadPool}
                    label="VS Dead Pool"
                    isTrendStat={false}
                />
            </div>
        </div>
    );
};

export default CurrentConditions;
