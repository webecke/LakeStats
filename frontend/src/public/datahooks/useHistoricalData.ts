import useLoadingFetch, { LoadingFetchResult } from "./useLoadingFetch.ts";
import { dataService, HistoricalPeriodData } from "../../shared/services/data";

/**
 * Custom hook to fetch current conditions for a lake using the dataService
 * @param lakeId - The ID of the lake to fetch conditions for
 */
export const usePast365Days = (
    lakeId: string | undefined
): LoadingFetchResult<HistoricalPeriodData> => {
    return useLoadingFetch<HistoricalPeriodData>(async () => {
        if (!lakeId) throw new Error("Lake ID is required");

        return await dataService.getPast365Days(lakeId);
    }, [lakeId]);
};
