package dev.webecke.powellstats.aggregator;

import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.RawLakeLevelData;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CurrentConditionsAggregator {
    public CurrentConditions aggregateCurrentConditions(CollectorResponse<RawLakeLevelData> lakeLevelData) {
        if (!lakeLevelData.successful()) { return null; }

        RawLakeLevelData dataObject = lakeLevelData.data();
        List<RawLakeLevelData.LakeLevelEntry> entries = dataObject.data();

        RawLakeLevelData.LakeLevelEntry mostRecentEntry = entries.get(0);

        float oneDayChange = entries.get(0).elevationFeet() - entries.get(1).elevationFeet();
        float twoWeekChange = entries.get(0).elevationFeet() - entries.get(14).elevationFeet();
        float oneYearChange = entries.get(0).elevationFeet() - entries.get(365).elevationFeet();

        float tenYearAverage = (float) entries.stream()
                .filter(entry -> {
                    // Same month and day as current entry
                    return entry.date().getMonth() == mostRecentEntry.date().getMonth()
                            && entry.date().getDayOfMonth() == mostRecentEntry.date().getDayOfMonth()
                            // Within last 10 years (not counting current year)
                            && entry.date().getYear() < mostRecentEntry.date().getYear()
                            && entry.date().getYear() >= mostRecentEntry.date().getYear() - 10;
                })
                .mapToDouble(RawLakeLevelData.LakeLevelEntry::elevationFeet)
                .average()
                .orElseThrow();

        return new CurrentConditions(
                dataObject.lake(),
                lakeLevelData.collectedAt(),
                mostRecentEntry.date(),
                mostRecentEntry.elevationFeet(),
                oneDayChange,
                twoWeekChange,
                oneYearChange,
                tenYearAverage - mostRecentEntry.elevationFeet()
        );
    }
}
