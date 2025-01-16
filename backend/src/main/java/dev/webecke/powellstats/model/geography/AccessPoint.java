package dev.webecke.powellstats.model.geography;

public record AccessPoint(
        String id,
        String name,
        float minElevation,
        String location,
        AccessType type
) {}
