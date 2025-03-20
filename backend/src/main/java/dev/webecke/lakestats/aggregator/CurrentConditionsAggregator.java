package dev.webecke.lakestats.aggregator;

import dev.webecke.lakestats.model.CollectorResponse;
import dev.webecke.lakestats.model.features.CurrentConditions;
import dev.webecke.lakestats.model.TimeSeriesData;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import dev.webecke.lakestats.service.LakeStatsLogger;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Map;

@Service
public class CurrentConditionsAggregator {
    private final LakeStatsLogger logger = new LakeStatsLogger(CurrentConditionsAggregator.class);

    public CurrentConditionsAggregator() {}

    public CurrentConditions aggregateCurrentConditions(CollectorResponse<TimeSeriesData> collectorResponse, Lake lake) {
        if (!collectorResponse.successful()) { return null; }
        if (collectorResponse.data().lakeId() != lake.id()) {
            throw new IllegalArgumentException("Lake ID mismatch: data is for %s, but got lake info for %s".formatted(lake.id(), collectorResponse.data().lakeId()));
        }
        if (collectorResponse.data().type() != DataType.ELEVATION) {
            throw new IllegalArgumentException("Unexpected data type: %s. Was expecting ELEVATION".formatted(collectorResponse.data().type()));
        }

        TimeSeriesData dataset = collectorResponse.data();

        TimeSeriesData.TimeSeriesEntry today = dataset.chronologicalData().getFirst();
        LocalDate todayDate = today.date();

        return new CurrentConditions(
                dataset.lakeId(),
                "BOR",
                collectorResponse.collectedAt().atZone(ZoneId.of("America/Denver")),
                todayDate.atStartOfDay(ZoneId.of("America/Denver")),
                today.value(),
                dataset.dateIndex().get(todayDate.minusDays(1)).value(),
                dataset.dateIndex().get(todayDate.minusWeeks(2)).value(),
                dataset.dateIndex().get(todayDate.minusYears(1)).value(),
                multiYearAverageOnThisDate(todayDate, 10, dataset),
                lake.fullPoolElevation(),
                lake.minPowerPoolElevation(),
                lake.deadPoolElevation()
        );
    }

    private float multiYearAverageOnThisDate(LocalDate startDate, Integer years, TimeSeriesData dataset) {
        Map<LocalDate, TimeSeriesData.TimeSeriesEntry> indexedData = dataset.dateIndex();

        float runningSum = 0;
        for (int i = 0; i < years; i++) {
            TimeSeriesData.TimeSeriesEntry entry = indexedData.get(startDate.minusYears(i + 1));

            if (entry == null) {
                logger.warn(
                        "Less than %d years of data found for %s while calculating multiYearAverageOnThisDate"
                                .formatted(years, dataset.lakeId()), dataset.lakeId());
                break;
            }

            runningSum += entry.value();
        }

        return runningSum / years;
    }
}
