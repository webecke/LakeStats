import { ButtonHTMLAttributes, forwardRef } from "react";
import "./button.css";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
                                                               className = '',
                                                               children,
                                                               variant = 'primary',
                                                               size = 'md',
                                                               isLoading = false,
                                                               disabled,
                                                               ...props
                                                           }, ref) => {
    const classes = [
        'button',
        `button--${variant}`,
        `button--${size}`,
        isLoading && 'button--loading',
        className
    ].filter(Boolean).join(' ');

    return (
        <button
            className={classes}
            disabled={disabled || isLoading}
            ref={ref}
            {...props}
        >
            {isLoading && (
                <span className="button__spinner">
                    <svg
                        className="button__spinner-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="button__spinner-circle"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="button__spinner-path"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                </span>
            )}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
