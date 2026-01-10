package org.example.service;

import org.example.grpc.AuthServiceGrpc;
import org.example.grpc.TokenRequest;
import org.example.grpc.IsValidTokenRequest;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.springframework.stereotype.Service;

@Service
public class AuthClient {

    @GrpcClient("auth-service")
    private AuthServiceGrpc.AuthServiceBlockingStub authStub;

    public boolean isTokenValid(String token) {
        try {
            TokenRequest request = TokenRequest.newBuilder().setToken(token).build();
            IsValidTokenRequest response = authStub.isValidToken(request);
            return response.getValid();
        } catch (Exception e) {
            return false;
        }
    }
}