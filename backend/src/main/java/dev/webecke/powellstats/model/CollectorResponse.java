package dev.webecke.powellstats.model;

import java.time.LocalDateTime;

public record CollectorResponse<T>(
        T data,
        boolean successful,
        LocalDateTime collectedAt
) {}
