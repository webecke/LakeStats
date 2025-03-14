package dev.webecke.lakestats.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CurrentConditions(
        String lakeId,
        LocalDateTime timeOfCollection,
        LocalDate date,
        float currentLevel,
        float oneDayChange,
        float twoWeekChange,
        float oneYearChange,
        float differenceFromTenYearAverage,
        float differenceFromFullPool,
        float differenceFromMinPowerPool,
        float differenceFromDeadPool
) {}
