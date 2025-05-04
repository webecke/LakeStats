import React from "react";
import { TrendingDown, TrendingUp, MinusCircle } from "lucide-react";
import "./LakeViewStyles.css";
import Tooltip from "../../components/Tooltip.tsx";
import { getFeetAndInchesWithFraction } from "../dataRenderTools.ts";

interface StatItemProps {
    value: number;
    label: string;
    secondaryLabel?: string;
    className?: string;
    isCurrentElevation?: boolean;
    isTrendStat?: boolean;
    tooltip?: React.ReactNode | null;
    showStat?: boolean;
}

const StatItem: React.FC<StatItemProps> = ({
    value,
    label,
    secondaryLabel,
    className = "",
    isCurrentElevation = false,
    isTrendStat = true,
    tooltip = null,
    showStat = true,
}) => {
    if (!showStat) return null;

    // Get icon and styling based on value
    const icon = value > 0 ? <TrendingUp className="trend-icon trend-up" /> :
        value < 0 ? <TrendingDown className="trend-icon trend-down" /> :
            <MinusCircle className="trend-icon trend-neutral" />;

    const numberClass = value > 0 ? "positive" :
        value < 0 ? "negative" : "neutral";

    // Determine prefix
    const prefix = isCurrentElevation ? "" :
        isTrendStat ? (value > 0 ? "+" : value < 0 ? "-" : "") :
            (value < 0 ? "-" : "");

    const { feet, inches, fraction } = getFeetAndInchesWithFraction(value);

    // Create display value
    const displayValue = (
        <>
            {prefix}
            {feet > 0 ? (
                <>
                    {feet}
                    <span className="unit">ft</span>
                    {" "}
                    {inches}
                    <span className="unit">in</span>
                </>
            ) :
                (inches || fraction ?
                    <>
                        {inches}
                        {" " + fraction}
                        <span className="unit">in</span>
                    </>
                : (value !== 0 ?
                        <>
                            {'< ⅛'}
                            <span className="unit">in</span>
                        </>
                            :
                        <>
                            {'0'}
                            <span className="unit">in</span>
                        </>
                    )
                )
            }

            {!isCurrentElevation && isTrendStat && icon}
        </>
    );

    const content = (
        <>
            <p className={`stat-value ${numberClass}`}>{displayValue}</p>
            <p className="stat-label">{label}</p>
            {secondaryLabel && <p className="stat-label">{secondaryLabel}</p>}
        </>
    );

    return (
        <div className={`stat-item ${className}`}>
            {tooltip !== null ? (
                <Tooltip content={tooltip}>
                    <div className="stat-item-inner">{content}</div>
                </Tooltip>
            ) : (
                content
            )}
        </div>
    );
};

export default StatItem;
