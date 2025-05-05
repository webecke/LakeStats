package dev.webecke.lakestats.service;

import dev.webecke.lakestats.aggregator.CurrentConditionsAggregator;
import dev.webecke.lakestats.collector.BureauOfReclamationDataCollector;
import dev.webecke.lakestats.dao.DataAccessException;
import dev.webecke.lakestats.dao.DatabaseAccess;
import dev.webecke.lakestats.model.*;
import dev.webecke.lakestats.model.features.CurrentConditions;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.model.measurements.DataType;
import dev.webecke.lakestats.utils.SystemTimer;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DataCollectionService {
    private final BureauOfReclamationDataCollector bureauOfReclamationDataCollector;
    private final CurrentConditionsAggregator currentConditionsAggregator;
    private final DatabaseAccess databaseAccess;
    private final LakeStatsLogger logger = new LakeStatsLogger(DataCollectionService.class);

    public DataCollectionService(BureauOfReclamationDataCollector bureauOfReclamationDataCollector,
                                 CurrentConditionsAggregator currentConditionsAggregator,
                                 DatabaseAccess databaseAccess) {
        this.bureauOfReclamationDataCollector = bureauOfReclamationDataCollector;
        this.currentConditionsAggregator = currentConditionsAggregator;
        this.databaseAccess = databaseAccess;
    }

    public RunSystemResult dailyDataCollection() {
        SystemTimer timer = new SystemTimer();
        List<String> lakeIds = databaseAccess.getAllLakeIds();
        List<RunLakeCollectorResult> lakeCollectorResults = new ArrayList<>();
        ResultStatus status = ResultStatus.SUCCESS;

        for (String lakeId : lakeIds) {
            LakeSystemSettings settings = databaseAccess.getLakeSystemSettings(lakeId);

            if (settings.status() == LakeSystemSettings.Status.DISABLED)  { continue; }

            RunLakeCollectorResult result = collectDataForLake(lakeId);
            lakeCollectorResults.add(result);
            status = ResultStatus.getMoreSevereStatus(status, result.status());
        }

        return new RunSystemResult(LocalDateTime.now(), status, "Data collection completed without exploding",
                timer.end(), lakeCollectorResults);
    }

    public RunLakeCollectorResult collectDataForLake(String lakeId) {
        Lake lake;
        try {
            lake = databaseAccess.getLakeDetails(lakeId);
        } catch (Exception e) {
            String resultMessage = "Error while getting lake details";
            logger.errorForLake(resultMessage, lakeId, e);
            return new RunLakeCollectorResult(
                    LocalDateTime.now(),
                    lakeId,
                    ResultStatus.CONFIGURATION_ERROR,
                    resultMessage,
                    -1,
                    null
            );
        }

        return collectDataForLake(lake);
    }

    public RunLakeCollectorResult collectDataForLake(Lake lake) {
        logger.infoForLake("Running collector for lake %s".formatted(lake.id()), lake.id());

        SystemTimer timer = new SystemTimer();
        ResultStatus status;
        String resultMessage = "Data collection completed and successfully published";

        try {
            CollectorResponse<TimeSeriesData> elevationData = bureauOfReclamationDataCollector.collectData(lake, DataType.ELEVATION);
            CurrentConditions currentConditions = currentConditionsAggregator.aggregateCurrentConditions(elevationData, lake);

            try {
                databaseAccess.publishCurrentConditions(currentConditions);
                databaseAccess.publishLakeInfo(lake);
                status = ResultStatus.SUCCESS;
            } catch (DataAccessException e) {
                status = ResultStatus.PUBLICATION_ERROR;
                resultMessage = "Error while publishing data to the database";
                logger.errorForLake(resultMessage, lake.id(), e);
            }

            LocalDate utahToday = ZonedDateTime.now(ZoneId.of("America/Denver")).toLocalDate();
            if (currentConditions.date().isBefore(utahToday)) {
                status = ResultStatus.SOURCE_DATA_NOT_UPDATED;
                resultMessage = "Source data has not been updated for today [last update: %s]".formatted(currentConditions.date());
                logger.warnForLake(resultMessage, lake.id());
            }

        } catch (LakeStatsException e) {
            status = e.getType();
            resultMessage = e.getMessage();
            logger.errorForLake(resultMessage, lake.id(), e);
        } catch (Exception e) {
            status = ResultStatus.SYSTEM_EXCEPTION;
            resultMessage = "Unknown error while collecting data";
            logger.errorForLake(resultMessage, lake.id(), e);
        }

        logger.infoForLake("Collector for %s has been run in %d milliseconds".formatted(lake.id(), timer.end()), lake.id());
        return new RunLakeCollectorResult(
                LocalDateTime.now(),
                lake.id(),
                status,
                resultMessage,
                timer.getElapsedTime(),
                null
        );
    }
}
