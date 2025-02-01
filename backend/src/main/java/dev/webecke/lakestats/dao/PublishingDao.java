package dev.webecke.lakestats.dao;

import dev.webecke.lakestats.model.CurrentConditions;
import dev.webecke.lakestats.model.SystemError;
import dev.webecke.lakestats.model.geography.Lake;

import java.util.List;

public interface PublishingDao {
    void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException;
    void publishErrors(List<SystemError> errors) throws DataAccessException;
    void publishLakeInfo(Lake lake) throws DataAccessException;
}
