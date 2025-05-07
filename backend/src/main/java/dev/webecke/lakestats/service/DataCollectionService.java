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

import java.time.*;
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
        ResultStatus worstStatusSoFar = ResultStatus.SUCCESS;
        int successCount = 0;
        int dataNotUpdatedCount = 0;

        for (String lakeId : lakeIds) {
            LakeSystemSettings settings = databaseAccess.getLakeSystemSettings(lakeId);
            if (settings.status() == LakeSystemSettings.Status.DISABLED)  { continue; }

            RunLakeCollectorResult result = collectDataForLake(lakeId);
            lakeCollectorResults.add(result);

            // Handle status conditions and tracking
            if (result.status() == ResultStatus.SUCCESS || result.status() == ResultStatus.SKIPPED) successCount++;
            else if (result.status() == ResultStatus.SOURCE_DATA_NOT_UPDATED) dataNotUpdatedCount++;
            worstStatusSoFar = ResultStatus.getMoreSevereStatus(worstStatusSoFar, result.status());
        }

        // Override outdated source status if more lakes are up to date than are outdated
        if (worstStatusSoFar == ResultStatus.SOURCE_DATA_NOT_UPDATED) {
            if (successCount > dataNotUpdatedCount) worstStatusSoFar = ResultStatus.SUCCESS;
        }

        return new RunSystemResult(LocalDateTime.now(), worstStatusSoFar, "Data collection completed without exploding",
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
        try { /// Check if the lake has already been run today successfully
            RunLakeCollectorResult lastRunResult = databaseAccess.getLastRunResult(lake.id());
            if (lastRunResult != null &&
                    lastRunResult.success() &&
                    lastRunResult.timestamp().isAfter(LocalDateTime.of(LocalDate.now(), LocalTime.of(1, 0)))) {
                return new RunLakeCollectorResult(
                        LocalDateTime.now(),
                        lake.id(),
                        ResultStatus.SKIPPED,
                        "Data for this lake has already been updated today at %s".formatted(lastRunResult.timestamp().toString()),
                        -1,
                        null
                );
            }
        } catch (DataAccessException e) {
            logger.errorForLake("Unknown error while checking last run result", lake.id(), e);
            return new RunLakeCollectorResult(
                    LocalDateTime.now(),
                    lake.id(),
                    ResultStatus.SYSTEM_EXCEPTION,
                    "Unknown error while checking last run result",
                    -1,
                    null
            );
        }

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

        logger.infoForLake("Collector for %s has been run in %d milliseconds with status %s".formatted(lake.id(), timer.end(), status), lake.id());
        RunLakeCollectorResult result = new RunLakeCollectorResult(
                LocalDateTime.now(),
                lake.id(),
                status,
                resultMessage,
                timer.getElapsedTime(),
                null
        );

        try {
            databaseAccess.publishLastRunResult(result);
        } catch (DataAccessException e) {
            logger.errorForLake("Error while publishing last run result", lake.id(), e);
        }

        return result;
    }
}
