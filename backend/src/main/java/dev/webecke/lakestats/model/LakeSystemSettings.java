package dev.webecke.lakestats.model;

import java.util.List;

public record LakeSystemSettings(
        String lakeId,
        String lakeName,
        String brandedName,
        Status status,
        String accentColor,
        List<LakeSystemFeatures> features
) {
    public enum Status {
        ENABLED,
        DISABLED,
        TESTING
    }
}
