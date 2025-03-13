import { useState, useEffect } from 'react';
import { dataService, LakeSystemSettings } from '../../shared/services/data';

interface BasicLakeInfoResult {
    loading: boolean;
    error: string | null;
    lakeInfo: LakeSystemSettings | null;
}

/**
 * Custom hook to fetch basic lake information using the dataService
 * @param lakeId - The ID of the lake to fetch information for
 */
export const useBasicLakeInfo = (lakeId: string): BasicLakeInfoResult => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lakeInfo, setLakeInfo] = useState<LakeSystemSettings | null>(null);

    useEffect(() => {
        const fetchLakeInfo = async () => {
            if (!lakeId) {
                setError('Lake ID is required');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Use the existing dataService to fetch lake system settings
                const settings = await dataService.getLakeSystemSetting(lakeId);

                if (!settings) {
                    throw new Error(`Lake with ID ${lakeId} not found`);
                }

                setLakeInfo(settings);
            } catch (err) {
                console.error('Error fetching lake info:', err);
                setError(err instanceof Error ? err.message : 'Failed to load lake information');
            } finally {
                setLoading(false);
            }
        };

        fetchLakeInfo();
    }, [lakeId]);

    return { loading, error, lakeInfo };
};
