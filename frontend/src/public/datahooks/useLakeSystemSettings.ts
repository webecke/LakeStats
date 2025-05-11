import { dataService, LakeSystemSettings } from "../../shared/services/data";
import useLoadingFetch, { LoadingFetchResult } from "./useLoadingFetch.ts";

/**
 * Custom hook to fetch basic lake information using the dataService
 * @param lakeId - The ID of the lake to fetch information for
 */
export const useLakeSystemSettings = (
    lakeId: string | undefined
): LoadingFetchResult<LakeSystemSettings> => {
    return useLoadingFetch<LakeSystemSettings>(async () => {
        if (!lakeId) throw new Error("Lake ID is required");

        return await dataService.getLakeSystemSetting(lakeId);
    }, [lakeId]);
};
