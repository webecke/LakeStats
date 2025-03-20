package dev.webecke.lakestats.model;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Stores time series data
 * @param sourceLabel the name of the source (e.g., siteId) this data came from
 * @param chronologicalData an ordered list (newest entries first) of daily data entries
 * @param dateIndex the same data as 'chronologicalData', but in a map to provided O(1) access to specific datetimes
 */
public record ContinuousTimeSeriesData(
        String sourceLabel,
        List<ContinuousTimeSeriesEntry> chronologicalData,
        Map<ZonedDateTime, ContinuousTimeSeriesEntry> dateIndex
) {
    public ContinuousTimeSeriesData(List<ContinuousTimeSeriesEntry> data) {
        this(data, "undefined");
    }

    public ContinuousTimeSeriesData(List<ContinuousTimeSeriesEntry> data, String sourceLabel) {
        this(
                sourceLabel,
                data.stream()
                        .sorted((a, b) -> b.date().compareTo(a.date()))
                        .toList(),
                data.stream().collect(Collectors.toMap(
                        ContinuousTimeSeriesEntry::date,
                        entry -> entry
                ))
        );
    }

    /**
     * Returns the newest entry in the time series.
     * @return Optional containing the newest entry, or empty if the series is empty
     */
    public Optional<ContinuousTimeSeriesEntry> getNewestEntry() {
        if (chronologicalData.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(chronologicalData.get(0));
    }

    /**
     * Returns the oldest entry in the time series.
     * @return Optional containing the oldest entry, or empty if the series is empty
     */
    public Optional<ContinuousTimeSeriesEntry> getOldestEntry() {
        if (chronologicalData.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(chronologicalData.get(chronologicalData.size() - 1));
    }
}
