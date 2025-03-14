import React from 'react';
import { TrendingDown, TrendingUp, MinusCircle } from 'lucide-react';
import './LakeViewStyles.css';

interface StatItemProps {
    value: number;
    label: string;
    className?: string;
    isCurrentElevation?: boolean;
    isTrendStat?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
                                               value,
                                               label,
                                               className = '',
                                               isCurrentElevation = false,
                                               isTrendStat = true
                                           }) => {
    // Determine if value is positive, negative, or zero
    let icon;
    let numberClass = "";

    if (value > 0) {
        icon = <TrendingUp className="trend-icon trend-up" />;
        numberClass = "positive";
    } else if (value < 0) {
        icon = <TrendingDown className="trend-icon trend-down" />;
        numberClass = "negative";
    } else {
        icon = <MinusCircle className="trend-icon trend-neutral" />;
        numberClass = "neutral";
    }

    // Format the value for display (remove negative sign if present)
    const displayValue = Math.abs(value).toFixed(2);

    // Determine prefix based on component type
    let prefix = "";

    if (isCurrentElevation) {
        // Current elevation: no prefix
        prefix = "";
    } else if (isTrendStat) {
        // Trend stats: always show + or - prefix
        prefix = value > 0 ? "+" : value < 0 ? "-" : "";
    } else {
        // Non-trend stats: only show - for negative values
        prefix = value < 0 ? "-" : "";
    }

    return (
        <div className={`stat-item ${className}`}>
            <p className={`stat-value ${numberClass}`}>
                {prefix}{displayValue}<span className="unit">ft</span>{!isCurrentElevation && isTrendStat && icon}
            </p>
            <p className="stat-label">{label}</p>
        </div>
    );
};

export default StatItem;
