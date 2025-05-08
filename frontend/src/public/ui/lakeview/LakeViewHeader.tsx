import React from "react";
import { Home, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import "./LakeViewStyles.css";

interface LakeViewHeaderProps {
    lakeName: string;
    brandedName: string;
    lakeId: string;
    brandColor?: string;
    summaryString?: string;
}

const LakeViewHeader: React.FC<LakeViewHeaderProps> = ({
    lakeName,
    brandedName,
    lakeId,
    brandColor,
    summaryString,
}) => {
    const brandStyle = brandColor ? { color: brandColor } : {};

    const onShare = () => {
        const shareText = summaryString || `Check out the latest stats for ${lakeName}`;

        if (navigator.share) {
            navigator
                .share({
                    title: `Latest ${lakeName} Stats`,
                    text: shareText,
                    url: `/${lakeId}`,
                })
                .catch(console.error);
        } else {
            // Fallback: Copy to clipboard
            try {
                const clipboardText = `${shareText}\nStay up to date at lakestats.com/${lakeId}`;
                navigator.clipboard
                    .writeText(clipboardText)
                    .then(() => {
                        alert("Summary of stats copied to clipboard!");
                    })
                    .catch((err) => {
                        console.error("Failed to copy: ", err);
                        alert("Couldn't copy to clipboard. Please try again.");
                    });
            } catch (err) {
                console.error("Clipboard API not available", err);
                alert(
                    `Sharing is unavailable on your browser. Try just copying this link: lakestats.com/${lakeId}`
                );
            }
        }
    };

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
                    style={{ right: 0, left: "auto" }}
                >
                    <Share2 className="home-icon" size={24} />
                </div>
            </div>
            <p>The latest data for {lakeName}</p>
        </div>
    );
};

export default LakeViewHeader;
