package dev.webecke.lakestats.model;

import dev.webecke.lakestats.model.measurements.DataType;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;

/**
 * Historical data for a specific time period.
 * This is different from a {@link TimeSeriesData} object. <code>HistoricalPeriodData</code> is designed for storage in
 * firebase and use by the frontend, while TimeSeriesData is designed for data processing and use by the backend. <br/>
 * <b>Do not use canonical constructor! Use <code>HistoricalPeriodData.create()</code></b>
 * @param lakeId the name of the lakeId this data came from
 * @param startDate the starting date of the data
 * @param endDate the last date of the data (inclusive)
 * @param type the type of period this data represents
 * @param dataType the type of data stored in this object
 * @param data the actual data
 */
public record HistoricalPeriodData(
        String lakeId,
        LocalDate startDate,
        LocalDate endDate,
        PeriodType type,
        DataType dataType,
        List<TimeSeriesData.TimeSeriesEntry> data
) {
    public enum PeriodType {
        CALENDAR_YEAR,
        ROLLING_YEAR,
        CUSTOM
    }

    /**
     * Creates a new HistoricalPeriodData object, and ensures that the data is sorted in ascending order. (oldest entries first)
     */
    public static HistoricalPeriodData create(String lakeId, PeriodType type, DataType dataType, List<TimeSeriesData.TimeSeriesEntry> data) {
        if (data.isEmpty()) {
            throw new IllegalArgumentException("Data cannot be empty");
        }

        // The historical data aggregator should be feeding in already sorted data, in which case
        // this runs in basically O(n) time. This is just to guarantee that the data is sorted
        List<TimeSeriesData.TimeSeriesEntry> sortedData = data.stream()
                .sorted(Comparator.comparing(TimeSeriesData.TimeSeriesEntry::date))
                .toList();

        return new HistoricalPeriodData(
                lakeId,
                sortedData.getFirst().date(),
                sortedData.getLast().date(),
                type,
                dataType,
                sortedData
        );
    }
}
