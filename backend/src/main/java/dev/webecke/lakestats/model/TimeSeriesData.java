package dev.webecke.lakestats.model;

import dev.webecke.lakestats.model.measurements.DataType;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Stores time series data
 * @param lakeId the name of the lakeId this data came from
 * @param chronologicalData an ordered list (newest entries first) of daily data entries
 * @param dateIndex the same data as 'chronologicalData', but in a map to provided O(1) access to specific dates
 * @param type the type of data stored in this object
 */
public record TimeSeriesData(
        String lakeId,
        List<TimeSeriesEntry> chronologicalData,
        Map<LocalDate, TimeSeriesEntry> dateIndex,
        DataType type
) {
    public record TimeSeriesEntry(
            float value,    // Changed from elevationFeet to be more generic
            LocalDate date
    ) {}

    public TimeSeriesData(String lakeId, List<TimeSeriesEntry> data, DataType type) {
        this(
                lakeId,
                data.stream()
                        .sorted((a, b) -> b.date().compareTo(a.date()))
                        .toList(),
                data.stream().collect(Collectors.toMap(
                        TimeSeriesEntry::date,
                        entry -> entry
                )),
                type
        );
    }
}
