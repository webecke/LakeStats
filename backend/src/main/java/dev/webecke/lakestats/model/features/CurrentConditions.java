package dev.webecke.lakestats.model.features;

import java.time.ZonedDateTime;

public record CurrentConditions(
        String lakeId,
        String measurementSiteName,
        ZonedDateTime timeConditionsCalculated,
        ZonedDateTime currentReadingTimestamp,
        float levelToday,
        float level24HoursAgo,
        float levelTwoWeeksAgo,
        float levelOneYearAgo,
        float levelTenYearAverage
) {}
