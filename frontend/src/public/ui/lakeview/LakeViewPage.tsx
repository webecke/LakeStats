import React from 'react';
import LakeViewHeader from './LakeViewHeader.tsx';
import CurrentConditions from './CurrentConditions.tsx';
import './LakeViewStyles.css';

interface LakeViewProps {
    lakeName?: string;
    date?: string;
    currentElevation?: number;
    dayChange?: number;
    weekChange?: number;
    yearChange?: number;
    tenYearDiff?: number;
}

const LakeViewPage: React.FC<LakeViewProps> = ({
                                               lakeName = "PowellStats",
                                               date = "June 13, 2025",
                                               currentElevation = 3570.25,
                                               dayChange = -0.09,
                                               weekChange = -1.90,
                                               yearChange = 3.10,
                                               tenYearDiff = -10.42
                                           }) => {
    return (
        <div className="lake-view">
            <LakeViewHeader lakeName={lakeName} date={date} />
            <CurrentConditions
                currentElevation={currentElevation}
                dayChange={dayChange}
                weekChange={weekChange}
                yearChange={yearChange}
                tenYearDiff={tenYearDiff}
            />
        </div>
    );
};

export default LakeViewPage;
