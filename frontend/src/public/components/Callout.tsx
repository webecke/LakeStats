import React from "react";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Flame } from "lucide-react";
import "./Callout.css";

export type CalloutType = "success" | "warning" | "error" | "info" | "important";

export interface CalloutProps {
    visible?: boolean;
    children: React.ReactNode;
    type?: CalloutType;
    /** Optional custom icon to override the default */
    customIcon?: React.ReactNode;
    /** Optional title text */
    title?: string;
    /** Additional CSS classes */
    className?: string;
}

const defaultIcons = {
    success: <CheckCircle className="callout__icon" />,
    warning: <AlertTriangle className="callout__icon" />,
    error: <AlertCircle className="callout__icon" />,
    info: <Info className="callout__icon" />,
    important: <Flame className="callout__icon" />,
};

export const Callout: React.FC<CalloutProps> = ({
                                                    visible = true,
                                                    children,
                                                    type = "info",
                                                    customIcon,
                                                    title,
                                                    className = "",
                                                }) => {
    if (!visible) return null;

    const icon = customIcon || defaultIcons[type];

    return (
        <div className={`callout callout--${type} ${className}`}>
            <div className="callout__header">
                {icon}
                {title && <h3 className="callout__title">{title}</h3>}
            </div>
            <div className="callout__content">{children}</div>
        </div>
    );
};
