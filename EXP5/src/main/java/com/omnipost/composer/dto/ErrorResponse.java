package com.omnipost.composer.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standardized error response envelope returned by the global exception handler.
 * Includes the correlation ID so errors can be traced back to their request logs.
 */
public class ErrorResponse {

    private boolean success = false;
    private String message;
    private int status;
    private String path;
    private String correlationId;
    private List<String> details;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ErrorResponse(String message, int status, String path, String correlationId, List<String> details) {
        this.message = message;
        this.status = status;
        this.path = path;
        this.correlationId = correlationId;
        this.details = details;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }

    public String getPath() {
        return path;
    }

    public String getCorrelationId() {
        return correlationId;
    }

    public List<String> getDetails() {
        return details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
