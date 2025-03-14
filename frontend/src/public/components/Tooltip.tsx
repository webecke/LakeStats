import React, { useState, ReactNode, useRef, useEffect } from 'react';
import './Tooltip.css';

export interface TooltipProps {
    children: ReactNode;
    content: ReactNode | null;
    position?: 'top' | 'bottom' | 'left' | 'right';
    delay?: number;
    className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
                                             children,
                                             content,
                                             position = 'top',
                                             delay = 300,
                                             className = '',
                                         }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
    const tooltipRef = useRef<HTMLDivElement>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<number | null>(null);

    // If content is null, don't add any tooltip functionality
    if (content === null) {
        return <>{children}</>;
    }

    const calculatePosition = () => {
        if (!tooltipRef.current || !targetRef.current) return;

        const targetRect = targetRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        switch (position) {
            case 'top':
                top = -tooltipRect.height - 8;
                left = (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = targetRect.height + 8;
                left = (targetRect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = (targetRect.height - tooltipRect.height) / 2;
                left = -tooltipRect.width - 8;
                break;
            case 'right':
                top = (targetRect.height - tooltipRect.height) / 2;
                left = targetRect.width + 8;
                break;
        }

        setTooltipPosition({ top, left });
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleMouseEnter = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsVisible(true);
            // Calculate position after rendering the tooltip
            setTimeout(calculatePosition, 0);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsVisible(false);
    };

    // Recalculate position if window is resized while tooltip is visible
    useEffect(() => {
        if (isVisible) {
            const handleResize = () => calculatePosition();
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isVisible]);

    return (
        <div
            className="tooltip-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={targetRef}
        >
            {children}
            {isVisible && (
                <div
                    className={`tooltip tooltip--${position} ${className}`}
                    style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
                    ref={tooltipRef}
                >
                    <div className="tooltip__content">
                        {content}
                    </div>
                    <div className={`tooltip__arrow tooltip__arrow--${position}`} />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
