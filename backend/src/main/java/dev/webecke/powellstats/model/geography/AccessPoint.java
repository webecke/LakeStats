package dev.webecke.powellstats.model.geography;

public record AccessPoint(
        String id,
        String name,
        float minSafeElevation,
        float minUsableElevation,
        String googleMapsLink,
        AccessType type
) {}
