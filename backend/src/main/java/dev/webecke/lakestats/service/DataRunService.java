package dev.webecke.lakestats.service;

import dev.webecke.lakestats.dao.DataAccessException;
import dev.webecke.lakestats.dao.DatabaseAccess;
import dev.webecke.lakestats.datarunner.CurrentConditionsDataRunner;
import dev.webecke.lakestats.model.LakeSystemSettings;
import dev.webecke.lakestats.model.RunResult;
import dev.webecke.lakestats.model.features.CurrentConditions;
import dev.webecke.lakestats.model.geography.Lake;
import dev.webecke.lakestats.utils.SystemTimer;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class DataRunService {
    private final LakeStatsLogger logger = new LakeStatsLogger(DataRunService.class);
    private final DatabaseAccess databaseAccess;

    // DATA RUNNERS
    private final CurrentConditionsDataRunner currentConditionsDataRunner;

    public DataRunService(DatabaseAccess databaseAccess, CurrentConditionsDataRunner currentConditionsDataRunner) {
        this.databaseAccess = databaseAccess;
        this.currentConditionsDataRunner = currentConditionsDataRunner;
    }

    public RunResult triggerAllDataRunners() {
        SystemTimer timer = new SystemTimer();
        List<String> lakeIds = databaseAccess.getAllLakeIds();
        List<RunResult> lakeRunResults = new ArrayList<>();

        for (String lakeId : lakeIds) {
            LakeSystemSettings lakeSystemSettings = databaseAccess.getLakeSystemSettings(lakeId);
            if (lakeSystemSettings.status().equals(LakeSystemSettings.Status.DISABLED)) {
                logger.info("Skipping data run for lake " + lakeId + " as it is disabled.");
                continue;
            }

            lakeRunResults.add(triggerDataRunner(lakeId));
        }

        return RunResult.buildSystemResult(lakeRunResults, timer.end());
    }

    public RunResult triggerDataRunner(String lakeId) {
        Lake lake;
        try {
            lake = databaseAccess.getLakeDetails(lakeId);
        } catch (DataAccessException e) {
            logger.error("Error retrieving lake details for: " + lakeId, e);
            return RunResult.failure(lakeId, "Failed to retrieve lake details", e);
        }

        if (lake == null) {
            return RunResult.failure(lakeId, "Lake not found");
        }

        return dataRunnerForLake(lake);
    }

    private RunResult dataRunnerForLake(Lake lake) {
        SystemTimer timer = new SystemTimer();
        List<RunResult> featureResults = new ArrayList<>();

        featureResults.add(runCurrentConditions(lake));

        return RunResult.buildLakeResult(lake.id(), featureResults, timer.end());
    }

    private RunResult runCurrentConditions(Lake lake) {
        SystemTimer timer = new SystemTimer();
        try {
            CurrentConditions currentConditions = currentConditionsDataRunner.runCurrentConditionsData(lake);
            databaseAccess.publishCurrentConditions(currentConditions);
        } catch (Exception e) {
            logger.error("Error running current conditions data for lake: " + lake.id(), e);
            return RunResult.failure(lake.id(), "Failed to run current conditions data", e);
        }
        return RunResult.success(lake.id(), "Current Conditions was run successfully", timer.end());
    }

}
