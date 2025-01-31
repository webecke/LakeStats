package dev.webecke.powellstats.model.geography;

import java.time.LocalDate;
import java.util.Map;

public record Lake(
        String id,
        String name,
        String description,
        float fullPoolElevation,
        float minPowerPoolElevation,
        float deadPoolElevation,
        Map<String, LakeRegion> regions,
        DataSources dataSources,
        String googleMapsLinkToDam,
        LocalDate fillDate)
{
    public record DataSources(
            String elevation,
            String inflow,
            String totalRelease,
            String spillwayRelease,
            String bypassRelease,
            String powerRelease,
            String evaporation,
            String activeStorage,
            String bankStorage,
            String deltaStorage
    ) {}
}
