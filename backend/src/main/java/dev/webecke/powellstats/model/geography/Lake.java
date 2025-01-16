package dev.webecke.powellstats.model.geography;

import java.util.Map;

public record Lake(
        String id,
        String name,
        float fullPoolElevation,
        float minPowerPoolElevation,
        float deadPoolElevation,
        Map<String, LakeRegion> regions)
{}
