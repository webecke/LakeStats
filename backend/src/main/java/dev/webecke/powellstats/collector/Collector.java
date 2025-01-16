package dev.webecke.powellstats.collector;

import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.RawLakeLevelData;

public interface Collector<T> {
    /**
    Gathers the pool level data from the internet.
     Level Entries should be in order of most recent to oldest.
     */
    abstract CollectorResponse<T> collectData();
}
