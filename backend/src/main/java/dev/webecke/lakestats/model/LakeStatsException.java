package dev.webecke.lakestats.model;

public class LakeStatsException extends RuntimeException {
  private final ResultStatus type;

  public LakeStatsException(String message, ResultStatus type, Throwable cause) {
    super(message, cause);
    this.type = type;
  }

  public LakeStatsException(String message, ResultStatus type) {
    super(message);
    this.type = type;
  }

  public LakeStatsException(String message) {
    super(message);
    this.type = ResultStatus.SYSTEM_EXCEPTION;
  }

  public LakeStatsException(Throwable cause) {
    super(cause.getMessage(), cause);
    this.type = ResultStatus.SYSTEM_EXCEPTION;
  }

  public ResultStatus getType() {
    return type;
  }
}
