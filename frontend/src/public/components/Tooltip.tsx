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
    const [isMobile, setIsMobile] = useState(false);

    // If content is null, don't add any tooltip functionality
    if (content === null) {
        return <>{children}</>;
    }

    // Check if we're on a mobile device on mount
    useEffect(() => {
        // Simple but effective mobile detection
        setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    }, []);

    const calculatePosition = () => {
        if (!tooltipRef.current || !targetRef.current) return;

        const targetRect = targetRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        let top = 0;
        let left = 0;

        // On mobile, prefer top or bottom positioning for better UX
        const effectivePosition = isMobile && (position === 'left' || position === 'right')
            ? 'top'
            : position;

        switch (effectivePosition) {
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

        // Prevent tooltip from going off-screen horizontally
        const viewportWidth = window.innerWidth;
        const absoluteLeft = targetRect.left + left;
        const tooltipRight = absoluteLeft + tooltipRect.width;

        if (tooltipRight > viewportWidth - 10) {
            left -= (tooltipRight - viewportWidth + 10);
        }

        if (absoluteLeft < 10) {
            left += (10 - absoluteLeft);
        }

        setTooltipPosition({ top, left });
    };

    // Set up event listeners and cleanup
    useEffect(() => {
        // Handle clicks outside the tooltip (for mobile)
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                isVisible &&
                targetRef.current &&
                !targetRef.current.contains(e.target as Node) &&
                tooltipRef.current &&
                !tooltipRef.current.contains(e.target as Node)
            ) {
                setIsVisible(false);
            }
        };

        // Handle window resize to recalculate tooltip position
        const handleResize = () => {
            if (isVisible) {
                calculatePosition();
            }
        };

        // Add event listeners
        if (isVisible) {
            document.addEventListener('click', handleOutsideClick);
            window.addEventListener('resize', handleResize);

            // Calculate position after render
            setTimeout(calculatePosition, 0);
        }

        // Cleanup
        return () => {
            document.removeEventListener('click', handleOutsideClick);
            window.removeEventListener('resize', handleResize);

            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, [isVisible]);

    // Desktop hover handlers
    const handleMouseEnter = () => {
        if (!isMobile) {
            timeoutRef.current = window.setTimeout(() => {
                setIsVisible(true);
            }, delay);
        }
    };

    const handleMouseLeave = () => {
        if (!isMobile) {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
            setIsVisible(false);
        }
    };

    // Click handler for both mobile and desktop
    const handleClick = (e: React.MouseEvent) => {
        if (isMobile) {
            e.preventDefault();
            setIsVisible(!isVisible);
        }
    };

    return (
        <div
            className={`tooltip-container ${isMobile ? 'tooltip-container--mobile' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            ref={targetRef}
            role={isMobile ? "button" : undefined}
            aria-expanded={isMobile && isVisible ? true : undefined}
            tabIndex={isMobile ? 0 : undefined}
        >
            {children}
            {isVisible && (
                <div
                    className={`tooltip tooltip--${position} ${className}`}
                    style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
                    ref={tooltipRef}
                    onClick={(e) => e.stopPropagation()}
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
