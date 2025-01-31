package dev.webecke.powellstats.model.geography;

public record AccessPoint(
        String id,
        String name,
        AccessType type,
        float minSafeElevation,
        float minUsableElevation,
        String googleMapsLink
) {}
