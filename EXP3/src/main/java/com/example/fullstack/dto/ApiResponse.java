package com.example.fullstack.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Standard envelope for every API response (success or error) as required by
 * Experiment 2.1.1 ("consistent request-response structures").
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;
    private Object errors;
    private String correlationId;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    public static <T> ApiResponse<T> success(String message, T data, String correlationId) {
        return ApiResponse.<T>builder()
                .success(true)
                .message(message)
                .data(data)
                .correlationId(correlationId)
                .timestamp(LocalDateTime.now())
                .build();
    }

    public static <T> ApiResponse<T> error(String message, Object errors, String correlationId) {
        return ApiResponse.<T>builder()
                .success(false)
                .message(message)
                .errors(errors)
                .correlationId(correlationId)
                .timestamp(LocalDateTime.now())
                .build();
    }
}
