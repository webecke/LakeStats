package dev.webecke.powellstats.model;

import java.time.LocalDate;
import java.util.List;

public record RawLakeLevelData(String lake, List<LakeLevelEntry> data) {
    public record LakeLevelEntry(float elevationFeet, LocalDate date) {}
}
