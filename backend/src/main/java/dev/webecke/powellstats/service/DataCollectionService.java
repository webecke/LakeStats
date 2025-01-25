package dev.webecke.powellstats.service;

import dev.webecke.powellstats.aggregator.CurrentConditionsAggregator;
import dev.webecke.powellstats.collector.Collector;
import dev.webecke.powellstats.collector.PowellLakeLevelCollector;
import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.LakeLevelDataset;
import org.springframework.stereotype.Service;

@Service
public class DataCollectionService {
    private final Collector<LakeLevelDataset> powellLakeLevelCollector;
    private final CurrentConditionsAggregator currentConditionsAggregator;

    public DataCollectionService(PowellLakeLevelCollector powellLakeLevelCollector,
                                 CurrentConditionsAggregator currentConditionsAggregator) {
        this.powellLakeLevelCollector = powellLakeLevelCollector;
        this.currentConditionsAggregator = currentConditionsAggregator;
    }

    public CurrentConditions dailyDataCollection() {
        CollectorResponse<LakeLevelDataset> powellData = powellLakeLevelCollector.collectData();
        CurrentConditions currentConditions = currentConditionsAggregator.aggregateCurrentConditions(powellData);
        return currentConditions;
    }
}
