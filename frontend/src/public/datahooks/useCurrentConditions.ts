import useLoadingFetch, { LoadingFetchResult } from "./useLoadingFetch.ts";
import { CurrentConditions, dataService } from "../../shared/services/data";

/**
 * Custom hook to fetch current conditions for a lake using the dataService
 * @param lakeId - The ID of the lake to fetch conditions for
 */
export const useCurrentConditions = (lakeId: string | undefined): LoadingFetchResult<CurrentConditions> => {
    return useLoadingFetch<CurrentConditions>(
        async () => {
            if (!lakeId) throw new Error("Lake ID is required");

            return await dataService.getCurrentConditions(lakeId);
        },
        [lakeId]
    );
};
