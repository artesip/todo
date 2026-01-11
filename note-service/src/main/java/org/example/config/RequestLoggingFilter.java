package org.example.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC; // Добавьте этот импорт
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Value("${spring.application.name:unknown-service}")
    private String serviceName;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        MDC.put("instance", serviceName);

        String method = request.getMethod();
        String uri = request.getRequestURI();

        log.info(">>> RECEIVED {} {}", method, uri);

        try {
            filterChain.doFilter(request, response);
        } finally {
            int status = response.getStatus();
            log.info("<<< COMPLETED {} | STATUS: {}", uri, status);

            MDC.remove("instance");
        }
    }
}