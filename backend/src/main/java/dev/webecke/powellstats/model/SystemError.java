package dev.webecke.powellstats.model;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.stream.Collectors;

public record SystemError(
        LocalDateTime timestamp,
        String message,
        String errorType,      // Instead of Throwable
        String errorMessage,   // From Throwable.getMessage()
        String stackTrace,     // Formatted stack trace
        String lakeId)
{
    public static final String SYSTEM_ERROR_ID = "system";

    public SystemError(String message) {
        this(message, null, SYSTEM_ERROR_ID);
    }

    public SystemError(String message, String lakeId) {
        this(message, null, lakeId);
    }

    public SystemError(String message, Throwable cause) {
        this(message, cause, SYSTEM_ERROR_ID);
    }

    public SystemError(String message, Throwable cause, String lakeId) {
        this(
                LocalDateTime.now(),
                message,
                cause != null ? cause.getClass().getName() : null,
                cause != null ? cause.getMessage() : null,
                cause != null ? Arrays.stream(cause.getStackTrace())
                        .map(StackTraceElement::toString)
                        .collect(Collectors.joining("\n"))
                        : null,
                lakeId
        );
    }
}
