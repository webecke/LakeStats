package dev.webecke.powellstats.dao;

import dev.webecke.powellstats.model.CurrentConditions;
import dev.webecke.powellstats.model.SystemError;

import java.util.List;

public interface PublishingDao {
    void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException;
    void publishErrors(List<SystemError> errors) throws DataAccessException;
}
