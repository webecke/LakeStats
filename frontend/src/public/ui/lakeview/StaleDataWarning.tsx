import React from "react";
import { AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

interface StaleDataWarningProps {
    recentDataDate: Date;
}

const StaleDataWarning: React.FC<StaleDataWarningProps> = ({ recentDataDate }) => {
    return (
        new Date().getTime() - recentDataDate.getTime() > 36 * 60 * 60 * 1000 && (
            <div className="outdated-data-warning">
                <AlertTriangle size={18} />
                <div>
                    <p>
                        This data is out of date. The Bureau of Reclamation occasionally experiences
                        delays in reporting.
                    </p>
                    <p className="outdated-data-link">
                        <Link to="/data">Learn more</Link>
                    </p>
                </div>
            </div>
        )
    );
};

export default StaleDataWarning;
