package dev.webecke.lakestats.model;

import dev.webecke.lakestats.model.features.LakeSystemFeatures;

import java.time.LocalDateTime;

/**
 * Result of running collectors for a specific lake.
 */
public record RunLakeCollectorResult(
        LocalDateTime timestamp,
        String lakeId,
        ResultStatus status,
        String message,
        long durationInMillis,
        LakeSystemFeatures[] featuresRun
) {
    public boolean success() {
        return status == ResultStatus.SUCCESS;
    }
}
