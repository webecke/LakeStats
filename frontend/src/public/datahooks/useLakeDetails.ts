import { dataService, LakeMetaData } from "../../shared/services/data";
import useLoadingFetch, { LoadingFetchResult } from "./useLoadingFetch.ts";

/**
 * Custom hook to fetch detailed lake information including regions
 * @param lakeId - The ID of the lake to fetch details for
 */
export const useLakeDetails = (lakeId: string | undefined): LoadingFetchResult<LakeMetaData> => {
    return useLoadingFetch<LakeMetaData>(
        async () => {
            if (!lakeId) throw new Error("Lake ID is required");

            return await dataService.getLakeInfo(lakeId);
        },
        [lakeId]
    );
};
