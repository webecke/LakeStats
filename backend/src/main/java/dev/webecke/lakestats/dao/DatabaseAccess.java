package dev.webecke.lakestats.dao;

import dev.webecke.lakestats.model.HistoricalPeriodData;
import dev.webecke.lakestats.model.RunLakeCollectorResult;
import dev.webecke.lakestats.model.features.CurrentConditions;
import dev.webecke.lakestats.model.LakeSystemSettings;
import dev.webecke.lakestats.model.geography.Lake;

import java.util.List;

public interface DatabaseAccess {
    void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException;
    void publishLakeInfo(Lake lake) throws DataAccessException;
    List<String> getAllLakeIds() throws DataAccessException;
    LakeSystemSettings getLakeSystemSettings(String lakeId) throws DataAccessException;
    Lake getLakeDetails(String lakeId) throws DataAccessException;
    RunLakeCollectorResult getLastRunResult(String lakeId) throws DataAccessException;
    void publishLastRunResult(RunLakeCollectorResult result) throws DataAccessException;
    void publishPast365Days(HistoricalPeriodData data) throws DataAccessException;
}
