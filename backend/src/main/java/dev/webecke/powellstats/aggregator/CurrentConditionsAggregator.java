package dev.webecke.powellstats.aggregator;

import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.TimeSeriesData;
import dev.webecke.powellstats.model.measurements.DataType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
public class CurrentConditionsAggregator {
    ErrorAggregator errorAggregator;

    public CurrentConditionsAggregator(ErrorAggregator errorAggregator) {
        this.errorAggregator = errorAggregator;
    }

    public CurrentConditions aggregateCurrentConditions(CollectorResponse<TimeSeriesData> collectorResponse) {
        if (!collectorResponse.successful()) { return null; }
        if (collectorResponse.data().type() != DataType.ELEVATION) {
            errorAggregator.add("Unexpected data type received while aggregating current conditions: %s on %s"
                    .formatted(collectorResponse.data().type()), collectorResponse.data().lakeId());
            return null;
        }

        TimeSeriesData dataset = collectorResponse.data();

        TimeSeriesData.TimeSeriesEntry today = dataset.chronologicalData().getFirst();
        float todayElevation = today.value();
        LocalDate todayDate = today.date();

        float oneDayChange = todayElevation - dataset.dateIndex().get(todayDate.minusDays(1)).value();
        float twoWeekChange = todayElevation - dataset.dateIndex().get(todayDate.minusWeeks(2)).value();
        float oneYearChange = todayElevation - dataset.dateIndex().get(todayDate.minusYears(1)).value();

        float tenYearAverage = multiYearAverageOnThisDate(todayDate, 10, dataset);

        return new CurrentConditions(
                dataset.lakeId(),
                collectorResponse.collectedAt(),
                todayDate,
                todayElevation,
                oneDayChange,
                twoWeekChange,
                oneYearChange,
                todayElevation - tenYearAverage,
                ""
        );
    }

    private float multiYearAverageOnThisDate(LocalDate startDate, Integer years, TimeSeriesData dataset) {
        Map<LocalDate, TimeSeriesData.TimeSeriesEntry> indexedData = dataset.dateIndex();

        float runningSum = 0;
        for (int i = 0; i < years; i++) {
            TimeSeriesData.TimeSeriesEntry entry = indexedData.get(startDate.minusYears(i + 1));

            if (entry == null) {
                errorAggregator.add(
                        "Less than %d years of data found for %s while calculating multiYearAverageOnThisDate"
                                .formatted(years, dataset.lakeId()), dataset.lakeId());
                break;
            }

            runningSum += entry.value();
        }

        return runningSum / years;
    }
}
