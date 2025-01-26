package dev.webecke.powellstats.dao;

import dev.webecke.powellstats.model.CurrentConditions;

public interface PublishingDao {
    void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException;
}
