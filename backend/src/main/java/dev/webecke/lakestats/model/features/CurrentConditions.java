package dev.webecke.lakestats.model.features;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record CurrentConditions(
        String lakeId,
        LocalDateTime timeOfCollection,
        LocalDate date,
        float levelToday,
        float levelYesterday,
        float levelTwoWeeksAgo,
        float levelOneYearAgo,
        float levelTenYearAverage
) {}
