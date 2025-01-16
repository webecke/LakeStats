package dev.webecke.powellstats.model;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record CurrentConditions(
        String lake,
        LocalDateTime timeOfCollection,
        LocalDate date,
        float currentLevel,
        float oneDayChange,
        float twoWeekChange,
        float oneYearChange,
        float differenceFromTenYearAverage
) {}
