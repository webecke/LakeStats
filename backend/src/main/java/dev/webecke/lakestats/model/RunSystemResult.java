package dev.webecke.lakestats.model;

import java.time.LocalDateTime;

/**
 * Result of running collectors for all lakes.
 */
public record RunSystemResult (
        LocalDateTime timestamp,
        ResultStatus status,
        String message,
        long durationInMillis,
        java.util.List<RunLakeCollectorResult> lakeResults
) {
    public boolean success() {
        return status == ResultStatus.SUCCESS;
    }
}
