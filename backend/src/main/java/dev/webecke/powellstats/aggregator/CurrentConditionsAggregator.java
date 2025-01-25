package dev.webecke.powellstats.aggregator;

import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.LakeLevelDataset;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Map;

@Service
public class CurrentConditionsAggregator {
    public CurrentConditions aggregateCurrentConditions(CollectorResponse<LakeLevelDataset> collectorResponse) {
        if (!collectorResponse.successful()) { return null; }

        LakeLevelDataset dataset = collectorResponse.data();

        LakeLevelDataset.LakeLevelEntry today = dataset.chronologicalData().getFirst();
        float todayElevation = today.elevationFeet();
        LocalDate todayDate = today.date();

        float oneDayChange = todayElevation - dataset.dateIndex().get(todayDate.minusDays(1)).elevationFeet();
        float twoWeekChange = todayElevation - dataset.dateIndex().get(todayDate.minusWeeks(2)).elevationFeet();
        float oneYearChange = todayElevation - dataset.dateIndex().get(todayDate.minusYears(1)).elevationFeet();

        float tenYearAverage = multiYearAverageOnThisDate(todayDate, 10, dataset);

        return new CurrentConditions(
                dataset.lake(),
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

    private float multiYearAverageOnThisDate(LocalDate startDate, Integer years, LakeLevelDataset dataset) {
        Map<LocalDate, LakeLevelDataset.LakeLevelEntry> indexedData = dataset.dateIndex();

        float runningSum = 0;
        for (int i = 0; i < years; i++) {
            LakeLevelDataset.LakeLevelEntry entry = indexedData.get(startDate.minusYears(i + 1));

            if (entry == null) {
                //TODO: Notify ErrorAggregator that data ran out
                break;
            }

            runningSum += entry.elevationFeet();
        }

        return runningSum / years;
    }
}
