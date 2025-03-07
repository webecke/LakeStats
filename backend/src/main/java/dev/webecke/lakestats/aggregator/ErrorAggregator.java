package dev.webecke.lakestats.aggregator;

import dev.webecke.lakestats.model.SystemError;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ErrorAggregator {
    private List<SystemError> errors;

    public ErrorAggregator() {
        errors = new ArrayList<>();
    }

    /**
     * Clears the current list of aggregated errors
     * @return list of aggregated errors, before it was cleared
     */
    public List<SystemError> flushErrors() {
        List<SystemError> temp = errors;
        errors = new ArrayList<>();
        return temp;
    }

    public void add(String errorMessage) {
        errors.add(new SystemError(errorMessage));
    }

    public void add(String errorMessage, String lakeId) {
        errors.add(new SystemError(errorMessage, lakeId));
    }

    public void add(String errorMessage, Throwable cause) {
        errors.add(new SystemError(errorMessage, cause));
    }

    public void add(String errorMessage, Throwable cause, String lakeId) {
        errors.add(new SystemError(errorMessage, cause, lakeId));
    }
}
