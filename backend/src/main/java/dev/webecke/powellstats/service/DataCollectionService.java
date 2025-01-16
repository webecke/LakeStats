package dev.webecke.powellstats.service;

import dev.webecke.powellstats.aggregator.CurrentConditionsAggregator;
import dev.webecke.powellstats.collector.Collector;
import dev.webecke.powellstats.collector.PowellLakeLevelCollector;
import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.RawLakeLevelData;
import org.springframework.stereotype.Service;

@Service
public class DataCollectionService {
    private final Collector<RawLakeLevelData> powellLakeLevelCollector;
    private final CurrentConditionsAggregator currentConditionsAggregator;

    public DataCollectionService(PowellLakeLevelCollector powellLakeLevelCollector,
                                 CurrentConditionsAggregator currentConditionsAggregator) {
        this.powellLakeLevelCollector = powellLakeLevelCollector;
        this.currentConditionsAggregator = currentConditionsAggregator;
    }

    public CurrentConditions dailyDataCollection() {
        CollectorResponse<RawLakeLevelData> powellData = powellLakeLevelCollector.collectData();
        CurrentConditions currentConditions = currentConditionsAggregator.aggregateCurrentConditions(powellData);
        return currentConditions;
    }
}
