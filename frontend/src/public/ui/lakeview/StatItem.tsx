import React from 'react';
import { TrendingDown, TrendingUp, MinusCircle } from 'lucide-react';
import './LakeViewStyles.css';

interface StatItemProps {
    value: number;
    label: string;
    className?: string;
    isCurrentElevation?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
                                               value,
                                               label,
                                               className = '',
                                               isCurrentElevation = false
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

    // For the current elevation, we don't want the + or - prefix
    const prefix = isCurrentElevation ? "" : value > 0 ? "+" : value < 0 ? "-" : "";

    return (
        <div className={`stat-item ${className}`}>
            <p className={`stat-value ${numberClass}`}>
                {prefix}{displayValue}<span className="unit">ft</span>{!isCurrentElevation && icon}
            </p>
            <p className="stat-label">{label}</p>
        </div>
    );
};

export default StatItem;
