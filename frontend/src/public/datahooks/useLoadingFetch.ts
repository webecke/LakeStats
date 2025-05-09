import { useState, useEffect } from "react";

export interface LoadingFetchResult<T> {
    loading: boolean;
    error: string | null;
    data: T | null;
}

/**
 * Generic hook for fetching data with consistent loading/error handling
 * @param fetchFn - The function that returns a promise with the data
 * @param dependencies - Array of dependencies that should trigger a refetch
 */
export default function useLoadingFetch<T>(
    fetchFn: () => Promise<T | null>,
    dependencies: React.DependencyList = []
): LoadingFetchResult<T> {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<T | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchFn();
                setData(result);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err instanceof Error ? err.message : "Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, dependencies);

    return { loading, error, data };
}
