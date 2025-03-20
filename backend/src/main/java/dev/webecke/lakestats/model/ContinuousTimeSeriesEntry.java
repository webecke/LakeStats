package dev.webecke.lakestats.model;

import java.time.ZonedDateTime;

public record ContinuousTimeSeriesEntry(
        float value,
        ZonedDateTime date
) {}
