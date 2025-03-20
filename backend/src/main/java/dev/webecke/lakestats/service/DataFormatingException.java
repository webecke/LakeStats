package dev.webecke.lakestats.service;

public class DataFormatingException extends Exception {
    public DataFormatingException(String message) {
        super(message);
    }
    public DataFormatingException(String message, Throwable cause) {
        super(message, cause);
    }
}
