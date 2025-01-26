package dev.webecke.powellstats.service;

import dev.webecke.powellstats.aggregator.CurrentConditionsAggregator;
import dev.webecke.powellstats.collector.Collector;
import dev.webecke.powellstats.collector.PowellLakeLevelCollector;
import dev.webecke.powellstats.dao.PublishingDao;
import dev.webecke.powellstats.model.CollectorResponse;
import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.LakeLevelDataset;
import org.springframework.stereotype.Service;

@Service
public class DataCollectionService {
    private final Collector<LakeLevelDataset> powellLakeLevelCollector;
    private final CurrentConditionsAggregator currentConditionsAggregator;
    private final PublishingDao publishingDao;

    public DataCollectionService(PowellLakeLevelCollector powellLakeLevelCollector,
                                 CurrentConditionsAggregator currentConditionsAggregator,
                                 PublishingDao publishingDao) {
        this.powellLakeLevelCollector = powellLakeLevelCollector;
        this.currentConditionsAggregator = currentConditionsAggregator;
        this.publishingDao = publishingDao;
    }

    public CurrentConditions dailyDataCollection() {
        CollectorResponse<LakeLevelDataset> powellData = powellLakeLevelCollector.collectData();
        CurrentConditions currentConditions = currentConditionsAggregator.aggregateCurrentConditions(powellData);
        publishingDao.publishCurrentConditions(currentConditions);
        return currentConditions;
    }
}
