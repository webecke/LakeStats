package dev.webecke.lakestats.model;

import dev.webecke.lakestats.model.features.LakeSystemFeatures;

/**
 * Result of running collectors for all lakes.
 * @param successful
 * @param message
 * @param durationInMillis
 * @param lakeResults
 */
public record RunCollectorsResult(
        boolean successful,
        String message,
        long durationInMillis,
        LakeRunCollectorResult[] lakeResults
) {
    /**
     * Result of running collectors for a specific lake.
     * @param lakeId
     * @param successful
     * @param message
     * @param durationInMillis
     */
    record LakeRunCollectorResult(
            String lakeId,
            boolean successful,
            String message,
            long durationInMillis,
            LakeSystemFeatures[] featuresGenerated
    ) {}
}
