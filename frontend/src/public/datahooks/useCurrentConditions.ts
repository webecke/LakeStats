import { useState, useEffect } from 'react';
import { dataService, CurrentConditions } from '../../shared/services/data';

interface CurrentConditionsResult {
    loading: boolean;
    error: string | null;
    currentConditions: CurrentConditions | null;
    formattedDate: string;
}

/**
 * Custom hook to fetch current conditions for a lake using the dataService
 * @param lakeId - The ID of the lake to fetch conditions for
 */
export const useCurrentConditions = (lakeId: string): CurrentConditionsResult => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentConditions, setCurrentConditions] = useState<CurrentConditions | null>(null);
    const [formattedDate, setFormattedDate] = useState<string>('');

    useEffect(() => {
        const fetchCurrentConditions = async () => {
            if (!lakeId) {
                setError('Lake ID is required');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Use the existing dataService to fetch current conditions
                const conditions = await dataService.getCurrentConditions(lakeId);

                if (!conditions) {
                    console.warn(`No current conditions found for lake ${lakeId}`);
                    setCurrentConditions(null);
                    setFormattedDate('');
                    return;
                }

                setCurrentConditions(conditions);

                // Format the date
                if (conditions.timeOfCollection) {
                    try {
                        const date = new Date(conditions.timeOfCollection);
                        const options: Intl.DateTimeFormatOptions = {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'America/Denver' // Mountain Time (Utah)
                        };

                        const formatted = date.toLocaleDateString('en-US', options);
                        setFormattedDate(formatted);
                    } catch (err) {
                        console.error('Error formatting date:', err);
                        setFormattedDate('');
                    }
                }
            } catch (err) {
                console.error('Error fetching current conditions:', err);
                setError(err instanceof Error ? err.message : 'Failed to load current conditions');
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentConditions();
    }, [lakeId]);

    return { loading, error, currentConditions, formattedDate };
};
