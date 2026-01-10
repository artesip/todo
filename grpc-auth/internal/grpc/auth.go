package grpc

import (
	"context"
	"grpc-auth/pkg/jwt"
	grpc_auth "grpc-auth/proto"

	"github.com/lestrrat-go/jwx/v2/jwk"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type Server struct {
	grpc_auth.UnsafeAuthServiceServer

	key jwk.Key
}

func New(key jwk.Key) *Server {
	return &Server{
		key: key,
	}
}

func (s *Server) IsValidToken(_ context.Context, request *grpc_auth.TokenRequest) (*grpc_auth.IsValidTokenRequest, error) {
	if request == nil {
		return nil, status.Errorf(codes.InvalidArgument, "empty token")
	}

	_, err := jwt.ValidateJwt([]byte(request.Token), s.key, jwt.Issuer)
	if err != nil {
		return &grpc_auth.IsValidTokenRequest{Valid: false}, nil
	}
	return &grpc_auth.IsValidTokenRequest{Valid: true}, nil
}
