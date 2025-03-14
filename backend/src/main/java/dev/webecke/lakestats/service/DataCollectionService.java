package dev.webecke.lakestats.service;

import dev.webecke.lakestats.aggregator.CurrentConditionsAggregator;
import dev.webecke.lakestats.aggregator.ErrorAggregator;
import dev.webecke.lakestats.collector.BureauOfReclamationDataCollector;
import dev.webecke.lakestats.dao.DataAccessException;
import dev.webecke.lakestats.dao.DatabaseAccess;
import dev.webecke.lakestats.model.*;
import dev.webecke.lakestats.model.features.CurrentConditions;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DataCollectionService {
    private final ErrorAggregator errorAggregator;
    private final BureauOfReclamationDataCollector bureauOfReclamationDataCollector;
    private final CurrentConditionsAggregator currentConditionsAggregator;
    private final DatabaseAccess databaseAccess;

    public DataCollectionService(ErrorAggregator errorAggregator,
                                 BureauOfReclamationDataCollector bureauOfReclamationDataCollector,
                                 CurrentConditionsAggregator currentConditionsAggregator,
                                 DatabaseAccess databaseAccess) {
        this.errorAggregator = errorAggregator;
        this.bureauOfReclamationDataCollector = bureauOfReclamationDataCollector;
        this.currentConditionsAggregator = currentConditionsAggregator;
        this.databaseAccess = databaseAccess;
    }

    public int dailyDataCollection() {
        List<String> lakeIds = databaseAccess.getAllLakeIds();

        for (String lakeId : lakeIds) {
            LakeSystemSettings settings = databaseAccess.getLakeSystemSettings(lakeId);

            if (settings.status() == LakeSystemSettings.Status.DISABLED)  { continue; }

            collectDataForLake(lakeId);
        }

        List<SystemError> errors = errorAggregator.flushErrors();
        databaseAccess.publishErrors(errors);
        return errors.size();
    }

    public void collectDataForLake(String lakeId) {
        try {
            Lake lake = databaseAccess.getLakeDetails(lakeId);
            collectDataForLake(lake);
        } catch (Exception e) {
            errorAggregator.add("Error while getting lake details for data for lake: " + lakeId, e, lakeId);
            return;
        }
    }

    public void collectDataForLake(Lake lake) {
        try {
            CollectorResponse<TimeSeriesData> elevationData = bureauOfReclamationDataCollector.collectData(lake, DataType.ELEVATION);
            CurrentConditions currentConditions = currentConditionsAggregator.aggregateCurrentConditions(elevationData, lake);

            try {
                databaseAccess.publishCurrentConditions(currentConditions);
                databaseAccess.publishLakeInfo(lake);
            } catch (DataAccessException e) {
                errorAggregator.add("Error while publishing data for lake: " + lake.id(), e, lake.id());
            }
        } catch (Exception e) {
            errorAggregator.add("Unknown error while collecting data for lake: " + lake.id(), e, lake.id());
        }
    }
}
