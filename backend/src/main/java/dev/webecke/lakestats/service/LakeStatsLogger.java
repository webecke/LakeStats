package dev.webecke.lakestats.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;

public class LakeStatsLogger {
    private final Logger logger;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    public LakeStatsLogger(Class<?> clazz) {
        this.logger = LoggerFactory.getLogger(clazz);
    }

    // Basic logging methods
    public void info(String message) {
        logger.info(message);
    }

    public void error(String message) {
        logger.error(message);
    }

    public void error(String message, Throwable throwable) {
        logger.error(message, throwable);
    }

    public void debug(String message) {
        logger.debug(message);
    }

    public void warn(String message) {
        logger.warn(message);
    }

    // Structured logging with any object as context
    public void info(String message, Object context) {
        try {
            String contextJson = objectMapper.writeValueAsString(context);
            logger.info("{} - context: {}", message, contextJson);
        } catch (Exception e) {
            logger.info(message + " (failed to serialize context)");
        }
    }

    public void warn(String message, Object context) {
        try {
            String contextJson = objectMapper.writeValueAsString(context);
            logger.warn("{} - context: {}", message, contextJson);
        } catch (Exception e) {
            logger.warn(message + " (failed to serialize context)");
        }
    }

    public void error(String message, Object context) {
        try {
            String contextJson = objectMapper.writeValueAsString(context);
            logger.error("{} - context: {}", message, contextJson);
        } catch (Exception e) {
            logger.error(message + " (failed to serialize context)");
        }
    }

    public void error(String message, Object context, Throwable throwable) {
        try {
            String contextJson = objectMapper.writeValueAsString(context);
            logger.error("{} - context: {} - exception: {}", message, contextJson, throwable.getMessage(), throwable);
        } catch (Exception e) {
            logger.error(message, throwable);
        }
    }

    // Simple convenience method for lake operations
    public void infoForLake(String message, String lakeId) {
        info(message, new LakeContext(lakeId));
    }

    public void warnForLake(String message, String lakeId) {
        warn(message, new LakeContext(lakeId));
    }

    public void errorForLake(String message, String lakeId, Throwable throwable) {
        error(message, new LakeContext(lakeId), throwable);
    }

    // Simple context class for lake operations
    public static class LakeContext {
        public String lakeId;

        public LakeContext(String lakeId) {
            this.lakeId = lakeId;
        }
    }
}
