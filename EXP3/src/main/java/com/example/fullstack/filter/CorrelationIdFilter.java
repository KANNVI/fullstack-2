package com.example.fullstack.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

/**
 * Experiment 2.1.2: intercepts every request, assigns/propagates a correlation ID
 * via MDC (Mapped Diagnostic Context) so every log line for a request can be
 * traced end-to-end, and logs request path + execution time.
 */
@Slf4j
@Component
@Order(1)
public class CorrelationIdFilter extends HttpFilter {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-Id";
    public static final String MDC_KEY = "correlationId";

    @Override
    protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        String correlationId = request.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isBlank()) {
            correlationId = UUID.randomUUID().toString();
        }

        MDC.put(MDC_KEY, correlationId);
        response.setHeader(CORRELATION_ID_HEADER, correlationId);

        long startTime = System.currentTimeMillis();
        try {
            log.info("Incoming request: {} {}", request.getMethod(), request.getRequestURI());
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            log.info("Completed request: {} {} -> status={} ({} ms)",
                    request.getMethod(), request.getRequestURI(), response.getStatus(), duration);
            MDC.remove(MDC_KEY);
        }
    }
}
