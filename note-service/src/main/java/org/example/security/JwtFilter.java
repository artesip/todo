package org.example.security;

import com.fasterxml.jackson.databind.JsonNode;
import org.example.service.AuthClient;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {
    private final AuthClient authClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public JwtFilter(AuthClient authClient) {
        this.authClient = authClient;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String token = null;
        if (request.getCookies() != null) {
            token = Arrays.stream(request.getCookies())
                    .filter(c -> "auth".equals(c.getName()))
                    .map(Cookie::getValue)
                    .findFirst()
                    .orElse(null);
        }

        if (token == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token missing in cookies");
            return;
        }

        if (authClient.isTokenValid(token)) {
            try {
                String[] parts = token.split("\\.");
                if (parts.length < 2) {
                    throw new IllegalArgumentException("Invalid JWT format");
                }

                String payload = new String(Base64.getUrlDecoder().decode(parts[1]));
                JsonNode jsonNode = objectMapper.readTree(payload);

                String userId = jsonNode.get("sub").asText();

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userId, null,
                                Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            } catch (Exception e) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Error parsing token data");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}