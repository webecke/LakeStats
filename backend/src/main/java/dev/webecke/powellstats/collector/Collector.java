package dev.webecke.powellstats.collector;

import dev.webecke.powellstats.model.CollectorResponse;

public interface Collector<T> {
    /**
    Gathers the pool level data from the internet.
     Level Entries should be in order of most recent to oldest.
     */
    CollectorResponse<T> collectData();
}
