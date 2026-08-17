package com.example.fullstack.exception;

import com.example.fullstack.dto.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

import static com.example.fullstack.filter.CorrelationIdFilter.MDC_KEY;

/**
 * Experiment 2.1.2: centralizes exception handling for every controller so every
 * error response — validation failure, not-found, business rule, or unexpected —
 * shares the same standardized shape (ApiResponse.error) and carries the
 * request's correlation ID for traceability.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private String correlationId() {
        String id = MDC.get(MDC_KEY);
        return id != null ? id : "N/A";
    }

    /** Bean Validation failures (@Valid on @RequestBody DTOs). */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(MethodArgumentNotValidException ex,
                                                                  HttpServletRequest req) {
        List<String> details = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .toList();

        log.warn("Validation failed on {} {} -> {}", req.getMethod(), req.getRequestURI(), details);

        ApiResponse<Object> body = ApiResponse.error("Validation failed", details, correlationId());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    /** Resource lookups that fail (e.g. GET/PUT/DELETE on a missing id). */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFound(ResourceNotFoundException ex,
                                                                HttpServletRequest req) {
        log.warn("Resource not found: {} ({} {})", ex.getMessage(), req.getMethod(), req.getRequestURI());

        ApiResponse<Object> body = ApiResponse.error(ex.getMessage(), null, correlationId());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    /** Domain/business rule violations. */
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ApiResponse<Object>> handleBusinessRule(BusinessRuleException ex,
                                                                    HttpServletRequest req) {
        log.warn("Business rule violation: {} ({} {})", ex.getMessage(), req.getMethod(), req.getRequestURI());

        ApiResponse<Object> body = ApiResponse.error(ex.getMessage(), null, correlationId());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    /** Fallback for anything unhandled — never leak stack traces to the client. */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGeneric(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception on {} {}", req.getMethod(), req.getRequestURI(), ex);

        ApiResponse<Object> body = ApiResponse.error("An unexpected error occurred", null, correlationId());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}
