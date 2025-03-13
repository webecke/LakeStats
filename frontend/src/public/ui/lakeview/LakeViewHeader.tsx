import React from 'react';
import './LakeViewStyles.css';

interface LakeViewHeaderProps {
    lakeName: string;
    date: string;
}

const LakeViewHeader: React.FC<LakeViewHeaderProps> = ({ lakeName, date }) => {
    return (
        <div className="lake-header">
            <h1 className="lake-title">{lakeName}</h1>
            <p className="lake-date">{date}</p>
        </div>
    );
};

export default LakeViewHeader;
