package dev.webecke.lakestats.model;

import java.time.ZonedDateTime;

public record UsgsTimeSeriesEntry(
        float value,
        ZonedDateTime date
) {}
