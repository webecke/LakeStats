package dev.webecke.lakestats.model;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Hierarchical result of running collection operations.
 * Can represent results at system level, lake level, or feature level.
 * The status will always reflect the most severe status of any child results.
 */
public record RunResult(
        LocalDateTime timestamp,
        ResultStatus status,
        String message,
        long durationInMillis,
        String lakeId,              // Optional - null for system-level results
        List<RunResult> children,   // Optional - for parent operations with child operations
        Throwable error             // Optional - for error capture
) {
    // Validation in compact constructor to ensure status reflects children
    public RunResult {
        if (children != null && !children.isEmpty()) {
            // Calculate most severe status from all children
            ResultStatus worstChildStatus = children.stream()
                    .map(RunResult::status)
                    .reduce(ResultStatus.SUCCESS, ResultStatus::getMoreSevereStatus);

            // Override status if children have more severe issues
            if (ResultStatus.getMoreSevereStatus(status, worstChildStatus) != status) {
                status = worstChildStatus;
            }
        }

        // Ensure children is never null
        if (children == null) {
            children = Collections.emptyList();
        }
    }

    // Helper methods
    public boolean isSuccess() {
        return status == ResultStatus.SUCCESS || status == ResultStatus.SOURCE_DATA_NOT_UPDATED;
    }

    public boolean isSystemLevel() {
        return lakeId == null;
    }

    // Convenience method to get error details if present
    public Optional<Throwable> getError() {
        return Optional.ofNullable(error);
    }

    // Static factory methods for common usage patterns

    /**
     * Create a successful result for a specific lake
     */
    public static RunResult success(String lakeId, String message, long durationInMillis) {
        return new RunResult(
                LocalDateTime.now(),
                ResultStatus.SUCCESS,
                message,
                durationInMillis,
                lakeId,
                Collections.emptyList(),
                null
        );
    }

    /**
     * Create a successful result for a system-level operation
     */
    public static RunResult success(String message, long durationInMillis) {
        return new RunResult(
                LocalDateTime.now(),
                ResultStatus.SUCCESS,
                message,
                durationInMillis,
                null,
                Collections.emptyList(),
                null
        );
    }

    /**
     * Create a failure result for a specific lake
     */
    public static RunResult failure(String lakeId, String message) {
        return new RunResult(
                LocalDateTime.now(),
                ResultStatus.SYSTEM_EXCEPTION,
                message,
                0,
                lakeId,
                Collections.emptyList(),
                null
        );
    }

    /**
     * Create a failure result with specific status for a lake
     */
    public static RunResult failure(String lakeId, ResultStatus status, String message) {
        return new RunResult(
                LocalDateTime.now(),
                status,
                message,
                0,
                lakeId,
                Collections.emptyList(),
                null
        );
    }

    /**
     * Create a failure result with exception for a lake
     */
    public static RunResult failure(String lakeId, String message, Throwable error) {
        return new RunResult(
                LocalDateTime.now(),
                ResultStatus.SYSTEM_EXCEPTION,
                message,
                0,
                lakeId,
                Collections.emptyList(),
                error
        );
    }

    /**
     * Build a system result from individual lake results
     */
    public static RunResult buildSystemResult(List<RunResult> lakeResults, long totalDurationInMillis) {
        if (lakeResults.isEmpty()) {
            return new RunResult(
                    LocalDateTime.now(),
                    ResultStatus.SUCCESS,
                    "No lakes to process",
                    totalDurationInMillis,
                    null,
                    Collections.emptyList(),
                    null
            );
        }

        // Create appropriate message
        String message;
        Map<ResultStatus, Long> statusCounts = lakeResults.stream()
                .collect(Collectors.groupingBy(
                        RunResult::status,
                        Collectors.counting()
                ));

        if (statusCounts.size() == 1 && statusCounts.containsKey(ResultStatus.SUCCESS)) {
            message = "All lake collectors completed successfully";
        } else {
            StringBuilder sb = new StringBuilder("Lake collection completed with issues: ");
            statusCounts.forEach((status, count) -> {
                if (status != ResultStatus.SUCCESS) {
                    sb.append(count).append(" ").append(status).append(", ");
                }
            });
            // Remove trailing comma and space
            if (sb.length() > 2) {
                message = sb.substring(0, sb.length() - 2);
            } else {
                message = sb.toString();
            }
        }

        return new RunResult(
                LocalDateTime.now(),
                ResultStatus.SUCCESS, // Will be overridden by constructor based on child statuses
                message,
                totalDurationInMillis,
                null,
                lakeResults,
                null
        );
    }

    /**
     * Build a lake result from individual feature results
     */
    public static RunResult buildLakeResult(String lakeId, List<RunResult> featureResults, long durationInMillis) {
        if (featureResults.isEmpty()) {
            return new RunResult(
                    LocalDateTime.now(),
                    ResultStatus.SUCCESS,
                    "No features to process for lake " + lakeId,
                    durationInMillis,
                    lakeId,
                    Collections.emptyList(),
                    null
            );
        }

        // Create appropriate message
        String message;
        Map<ResultStatus, Long> statusCounts = featureResults.stream()
                .collect(Collectors.groupingBy(
                        RunResult::status,
                        Collectors.counting()
                ));

        if (statusCounts.size() == 1 && statusCounts.containsKey(ResultStatus.SUCCESS)) {
            message = "All features for lake " + lakeId + " completed successfully";
        } else {
            StringBuilder sb = new StringBuilder("Lake " + lakeId + " processing completed with issues: ");
            statusCounts.forEach((status, count) -> {
                if (status != ResultStatus.SUCCESS) {
                    sb.append(count).append(" ").append(status).append(", ");
                }
            });
            // Remove trailing comma and space
            if (sb.length() > 2) {
                message = sb.substring(0, sb.length() - 2);
            } else {
                message = sb.toString();
            }
        }

        return new RunResult(
                LocalDateTime.now(),
                ResultStatus.SUCCESS, // Will be overridden by constructor based on child statuses
                message,
                durationInMillis,
                lakeId,
                featureResults,
                null
        );
    }
}
