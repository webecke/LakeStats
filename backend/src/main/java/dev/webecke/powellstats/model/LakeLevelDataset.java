package dev.webecke.powellstats.model;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Stores lake level data on a daily basis
 * @param lake the name of the lake this data came from
 * @param chronologicalData an ordered list (newest entries first) of daily Lake Level entries
 * @param dateIndex the same data as 'chronologicalData', but in a map to provided O(1) access to specific dates
 */
public record LakeLevelDataset(
        String lake,
        List<LakeLevelEntry> chronologicalData,
        Map<LocalDate, LakeLevelEntry> dateIndex
) {
    public record LakeLevelEntry(float elevationFeet, LocalDate date) {}

    public LakeLevelDataset(String lake, List<LakeLevelEntry> data) {
        this(
                lake,
                data.stream()
                        .sorted((a, b) -> b.date().compareTo(a.date()))
                        .toList(),
                data.stream().collect(Collectors.toMap(
                        LakeLevelEntry::date,
                        entry -> entry
                ))
        );
    }
}
