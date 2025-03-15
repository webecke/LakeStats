package dev.webecke.lakestats.model;

public enum ResultStatus {
    /**
     * Operation was successful. No errors occurred
     */
    SUCCESS,
    /**
     * Operation was successful, but the source of the data hasn't been updated.
     * The system should retry the operation later when the data source has been updated.
     */
    SOURCE_DATA_NOT_UPDATED,
    /**
     * Operation was not successful due to an error in the configuration of the system.
     * This could be due to missing or incorrect settings.
     */
    CONFIGURATION_ERROR,
    /**
     * Operation was not successful due to some sort of exception or error that occurred during the operation.
     */
    SYSTEM_EXCEPTION,
    /**
     * Operation was successful, but there was an error while publishing the data to the database.
     */
    PUBLICATION_ERROR;

    public static ResultStatus getMoreSevereStatus(ResultStatus status1, ResultStatus status2) {
        if (status1 == ResultStatus.SYSTEM_EXCEPTION || status2 == ResultStatus.SYSTEM_EXCEPTION) {
            return ResultStatus.SYSTEM_EXCEPTION;
        }
        if (status1 == ResultStatus.CONFIGURATION_ERROR || status2 == ResultStatus.CONFIGURATION_ERROR) {
            return ResultStatus.CONFIGURATION_ERROR;
        }
        if (status1 == ResultStatus.PUBLICATION_ERROR || status2 == ResultStatus.PUBLICATION_ERROR) {
            return ResultStatus.PUBLICATION_ERROR;
        }
        if (status1 == ResultStatus.SOURCE_DATA_NOT_UPDATED || status2 == ResultStatus.SOURCE_DATA_NOT_UPDATED) {
            return ResultStatus.SOURCE_DATA_NOT_UPDATED;
        }
        return ResultStatus.SUCCESS;
    }
}
