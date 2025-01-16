package dev.webecke.powellstats.collector;

import dev.webecke.powellstats.model.LakeLevelData;

public interface LakeLevelCollector {
    abstract LakeLevelData collectData();
}
