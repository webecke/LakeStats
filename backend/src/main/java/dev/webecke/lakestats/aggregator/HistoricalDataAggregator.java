package dev.webecke.lakestats.aggregator;

import dev.webecke.lakestats.model.HistoricalPeriodData;
import dev.webecke.lakestats.model.TimeSeriesData;
import dev.webecke.lakestats.service.LakeStatsLogger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class HistoricalDataAggregator {
    private final LakeStatsLogger logger = new LakeStatsLogger(HistoricalDataAggregator.class);

    public HistoricalPeriodData past365days(TimeSeriesData dataset) {
        List<TimeSeriesData.TimeSeriesEntry> resultData = new ArrayList<>();
        List<TimeSeriesData.TimeSeriesEntry> chronologicalData = dataset.chronologicalData();

        if (chronologicalData.size() < 365) {
            logger.warn("Less than 365 days of %s data found for %s while calculating aggregating past 365 days".formatted(dataset.type() ,dataset.lakeId()), dataset.lakeId());
            return null;
        }

        LocalDate oneYearAgo = LocalDate.now().minusYears(1);
        for (int i = 0; i < 365; i++) {
            TimeSeriesData.TimeSeriesEntry entry = chronologicalData.get(i);

            // If we somehow have more than 365 days of data, or there were holes in the data
            // resulting in reaching past a year within 365 datapoints, break the loop and be done
            if (entry.date().isBefore(oneYearAgo)) {
                break;
            }

            resultData.add(entry);
        }

        return HistoricalPeriodData.create(
                dataset.lakeId(),
                HistoricalPeriodData.PeriodType.ROLLING_YEAR,
                dataset.type(),
                resultData
        );
    }
}
