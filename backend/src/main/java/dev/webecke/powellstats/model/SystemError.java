package dev.webecke.powellstats.model;

import java.time.LocalDateTime;

public class SystemError {
    LocalDateTime timestamp;
    String message;
    Throwable cause;

    public SystemError(String message) {
        this(message, null);
    }

    public SystemError(String message, Throwable cause) {
        timestamp = LocalDateTime.now();
        this.message = message;
        this.cause = cause;
    }
}
