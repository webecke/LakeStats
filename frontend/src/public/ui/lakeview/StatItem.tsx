import React from 'react';
import { TrendingDown, TrendingUp, MinusCircle } from 'lucide-react';
import './LakeViewStyles.css';
import Tooltip from '../../components/Tooltip.tsx';

interface StatItemProps {
    value: number;
    label: string;
    secondaryLabel?: string;
    className?: string;
    isCurrentElevation?: boolean;
    isTrendStat?: boolean;
    tooltip?: React.ReactNode | null;
}

const StatItem: React.FC<StatItemProps> = ({
                                               value,
                                               label,
                                               secondaryLabel,
                                               className = '',
                                               isCurrentElevation = false,
                                               isTrendStat = true,
                                               tooltip = null
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

    // Create the inner content
    const innerContent = (
        <>
            <p className={`stat-value ${numberClass}`}>
                {prefix}{displayValue}<span className="unit">ft</span>{!isCurrentElevation && isTrendStat && icon}
            </p>
            <p className="stat-label">{label}</p>
            {secondaryLabel && <p className="stat-label">{secondaryLabel}</p>}
        </>
    );

    // If tooltip is provided, wrap the inner content with Tooltip, but always preserve the stat-item div as the outermost container
    return (
        <div className={`stat-item ${className}`}>
            {tooltip !== null ? (
                <Tooltip content={tooltip}>
                    <div className="stat-item-inner">
                        {innerContent}
                    </div>
                </Tooltip>
            ) : innerContent}
        </div>
    );
};

export default StatItem;
