package dev.webecke.lakestats.utils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Objects;

public class SystemTimer {
    private LocalDateTime startTime = null;
    private LocalDateTime endTime = null;

    public SystemTimer() {
        this(true);
    }

    public SystemTimer(boolean startImmediately) {
        if (startImmediately) {
            start();
        }
    }

    public void start() {
        if (startTime != null) {
            throw new IllegalStateException("Timer is already running.");
        }
        startTime = LocalDateTime.now();
    }

    public long end() {
        if (startTime == null) {
            throw new IllegalStateException("Timer has not been started.");
        }
        if (endTime != null) {
            throw new IllegalStateException("Timer has already been stopped.");
        }
        endTime = LocalDateTime.now();

        return java.time.Duration.between(startTime, endTime).toMillis();
    }

    public long getElapsedTime() {
        if (startTime == null) {
            throw new IllegalStateException("Timer has not been started.");
        }
        return Duration.between(startTime, Objects.requireNonNullElseGet(endTime, LocalDateTime::now)).toMillis();
    }

    public void reset() {
        reset(true);
    }
    public void reset(boolean restartImmediately) {
        startTime = null;
        endTime = null;
        if (restartImmediately) {
            start();
        }
    }
}
