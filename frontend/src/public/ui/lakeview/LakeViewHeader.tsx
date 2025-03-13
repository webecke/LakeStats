import React from 'react';
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LakeViewStyles.css';

interface LakeViewHeaderProps {
    lakeName: string;
    date: string;
}

const LakeViewHeader: React.FC<LakeViewHeaderProps> = ({ lakeName, date }) => {
    return (
        <div className="lake-header">
            <div className="lake-header-content">
                <Link to="/" className="home-link">
                    <Home className="home-icon" size={24} />
                </Link>
                <h1 className="lake-title">{lakeName}</h1>
            </div>
            <p className="lake-date">Data updated {date}</p>
        </div>
    );
};

export default LakeViewHeader;
