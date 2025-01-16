package dev.webecke.powellstats.model.geography;

import java.util.List;

public record LakeRegion(
        String id,
        String name,
        String description,
        List<AccessPoint> accessPoints
){}
