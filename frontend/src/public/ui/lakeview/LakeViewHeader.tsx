import React from "react";
import { Home, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import "./LakeViewStyles.css";

interface LakeViewHeaderProps {
    lakeName: string;
    brandedName: string;
    brandColor?: string;
    onShare?: () => void;
}

const LakeViewHeader: React.FC<LakeViewHeaderProps> = ({ lakeName, brandedName, brandColor, onShare }) => {
    const brandStyle = brandColor ? { color: brandColor } : {};

    return (
        <div className="lake-header">
            <div className="lake-header-content">
                <Link to="/" className="home-link">
                    <Home className="home-icon" size={24} />
                </Link>
                <h1 className="lake-title">
                    <span className="lake-branded-name" style={brandStyle}>
                        {brandedName}
                    </span>
                </h1>
                <div
                    className="home-link"
                    onClick={onShare}
                    aria-label="Share"
                    style={{ right: 0, left: 'auto' }}
                >
                    <Share2 className="home-icon" size={24} />
                </div>
            </div>
            <p>The latest data for {lakeName}</p>
        </div>
    );
};

export default LakeViewHeader;
