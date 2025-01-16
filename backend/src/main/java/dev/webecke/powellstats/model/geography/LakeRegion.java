package dev.webecke.powellstats.model.geography;

import java.util.Map;

public record LakeRegion(
        String id,
        String name,
        String description,
        Map<String, AccessPoint> accessPoints
){}
