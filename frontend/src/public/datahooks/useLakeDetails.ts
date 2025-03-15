import { useState, useEffect } from "react";
import { dataService, LakeMetaData } from "../../shared/services/data";

interface LakeDetailsResult {
    loading: boolean;
    error: string | null;
    lakeDetails: LakeMetaData | null;
}

/**
 * Custom hook to fetch detailed lake information including regions
 * @param lakeId - The ID of the lake to fetch details for
 */
export const useLakeDetails = (lakeId: string | undefined): LakeDetailsResult => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [lakeDetails, setLakeDetails] = useState<LakeMetaData | null>(null);

    useEffect(() => {
        const fetchLakeDetails = async () => {
            if (!lakeId) {
                setError("Lake ID is required");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                // Use the dataService to fetch lake details including regions
                const details = await dataService.getLakeInfo(lakeId);

                if (!details) {
                    throw new Error(`Lake details for ID ${lakeId} not found`);
                }

                setLakeDetails(details);
            } catch (err) {
                console.error("Error fetching lake details:", err);
                setError(err instanceof Error ? err.message : "Failed to load lake details");
            } finally {
                setLoading(false);
            }
        };

        fetchLakeDetails();
    }, [lakeId]);

    return { loading, error, lakeDetails };
};
