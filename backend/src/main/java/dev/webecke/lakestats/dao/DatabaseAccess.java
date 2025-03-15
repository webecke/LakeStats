package dev.webecke.lakestats.dao;

import dev.webecke.lakestats.model.features.CurrentConditions;
import dev.webecke.lakestats.model.LakeSystemSettings;
import dev.webecke.lakestats.model.SystemError;
import dev.webecke.lakestats.model.geography.Lake;

import java.util.List;

public interface DatabaseAccess {
    void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException;
    void publishLakeInfo(Lake lake) throws DataAccessException;
    List<String> getAllLakeIds() throws DataAccessException;
    LakeSystemSettings getLakeSystemSettings(String lakeId) throws DataAccessException;
    Lake getLakeDetails(String lakeId) throws DataAccessException;
}
