package dev.webecke.lakestats.dao;

import dev.webecke.lakestats.model.CurrentConditions;
import dev.webecke.lakestats.model.SystemError;

import java.util.List;

public interface PublishingDao {
    void publishCurrentConditions(CurrentConditions conditions) throws DataAccessException;
    void publishErrors(List<SystemError> errors) throws DataAccessException;
}
