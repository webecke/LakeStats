import { ReactElement } from "react";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import "./AsyncContainer.css";

interface AsyncContainerProps<T> {
    isLoading: boolean;
    error: string | null;
    data: T | null | undefined;
    children: (data: T) => ReactElement;
}

export default function AsyncContainer<T>({
    isLoading,
    error,
    data,
    children,
}: AsyncContainerProps<T>) {
    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="async-container-error">
                <div className="async-container-error-message">{error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="async-container-error">
                <div className="async-container-error-message">
                    <p>Nothing to show here</p>
                </div>
            </div>
        );
    }

    return <>{children(data)}</>;
}
