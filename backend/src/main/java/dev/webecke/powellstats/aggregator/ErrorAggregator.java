package dev.webecke.powellstats.aggregator;

import dev.webecke.powellstats.model.SystemError;
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

    public void add(String errorMessage, Throwable cause) {
        errors.add(new SystemError(errorMessage, cause));
    }
}
