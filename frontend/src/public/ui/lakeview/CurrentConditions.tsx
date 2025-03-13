import React from 'react';
import StatItem from './StatItem.tsx';
import './LakeViewStyles.css';

interface CurrentConditionsProps {
    currentElevation: number;
    dayChange: number;
    weekChange: number;
    yearChange: number;
    tenYearDiff: number;
}

const CurrentConditions: React.FC<CurrentConditionsProps> = ({
                                                                 currentElevation,
                                                                 dayChange,
                                                                 weekChange,
                                                                 yearChange,
                                                                 tenYearDiff
                                                             }) => {
    return (
        <div className="current-conditions">
            <StatItem
                value={currentElevation}
                label="Current Elevation"
                className="current-elevation"
                isCurrentElevation={true}
            />

            <div className="stat-row">
                <StatItem
                    value={dayChange}
                    label="Since Yesterday"
                    className="day-change"
                />
                <StatItem
                    value={weekChange}
                    label="Last 2 Weeks"
                    className="week-change"
                />
            </div>

            <div className="stat-row">
                <StatItem
                    value={yearChange}
                    label="Since A Year Ago"
                    className="year-change"
                />
                <StatItem
                    value={tenYearDiff}
                    label="From 10 Year Avg"
                    className="ten-year-diff"
                />
            </div>
        </div>
    );
};

export default CurrentConditions;
