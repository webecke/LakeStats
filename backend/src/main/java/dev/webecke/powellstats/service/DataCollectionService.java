package dev.webecke.powellstats.service;

import dev.webecke.powellstats.collector.LakeLevelCollector;
import dev.webecke.powellstats.collector.PowellLakeLevelCollector;
import dev.webecke.powellstats.model.LakeLevelData;
import org.springframework.stereotype.Service;

@Service
public class DataCollectionService {
    private final LakeLevelCollector powellLakeLevelCollector;

    public DataCollectionService(LakeLevelCollector powellLakeLevelCollector) {
        this.powellLakeLevelCollector = powellLakeLevelCollector;
    }

    public LakeLevelData dailyDataCollection() {
        LakeLevelData powellLevelData = powellLakeLevelCollector.collectData();
        return powellLevelData;
    }
}
