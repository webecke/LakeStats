package dev.webecke.powellstats.model;

import java.time.LocalDate;
import java.util.List;

public record LakeLevelData(String lake, List<LakeLevelEntry> data) {
    public record LakeLevelEntry(float elevationFeet, LocalDate day) {}
}
