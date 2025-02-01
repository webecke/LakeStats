package dev.webecke.lakestats.model;

import java.util.List;

public record LakeSystemStatus(
        String lakeId,
        String lakeName,
        String brandedName,
        Status status,
        List<LakeSystemFeatures> features
) {
    public enum Status {
        ENABLED,
        DISABLED,
        TESTING
    }
}
