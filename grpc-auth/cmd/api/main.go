package main

import (
	"context"
	"fmt"
	"grpc-auth/internal/db"
	"grpc-auth/internal/domain"
	mygrpc "grpc-auth/internal/grpc"
	"grpc-auth/internal/handler"
	"grpc-auth/internal/repository/postgres_read"
	"grpc-auth/internal/repository/postgres_write"
	"grpc-auth/pkg/config"
	"grpc-auth/pkg/jwt"
	grpc_auth "grpc-auth/proto"
	"log/slog"
	"net"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/labstack/echo/v4/middleware"
	"github.com/labstack/gommon/log"
	"github.com/lestrrat-go/jwx/v2/jwk"
	"google.golang.org/grpc"

	"github.com/labstack/echo/v4"
)

const (
	jwtPath    = "jwt.key"
	configPath = "config.yml"
)

func main() {
	cfg, err := config.LoadConfig(configPath)
	if err != nil {
		panic(err)
	}

	readRepo, writeRepo := initialize(&cfg)
	serverStart(&cfg, readRepo, writeRepo)
}

func initPool(url string) *pgxpool.Pool {
	dbCfg, err := pgxpool.ParseConfig(url)
	if err != nil {
		panic(err)
	}

	pool, err := db.NewDBPool(context.Background(), dbCfg)
	if err != nil {
		panic(err)
	}

	return pool
}

func initialize(cfg *domain.Config) (postgres_read.Repository, postgres_write.Repository) {
	readPool := initPool(cfg.DB.ReadUrl)
	writePool := initPool(cfg.DB.WriteUrl)

	return postgres_read.New(readPool), postgres_write.New(writePool)
}

func serverStart(cfg *domain.Config, readRepo postgres_read.Repository, writeRepo postgres_write.Repository) {
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.RequestLoggerWithConfig(middleware.RequestLoggerConfig{
		LogStatus:  true,
		LogURI:     true,
		LogError:   true,
		LogMethod:  true,
		LogLatency: true,
		LogValuesFunc: func(c echo.Context, v middleware.RequestLoggerValues) error {
			fmt.Printf("%v: uri: %v, status: %v, error: %v, latency:%v\n", v.Method, v.URI, v.Status, v.Error, v.Latency)
			return nil
		},
	}))
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{}))

	key, err := jwt.LoadKey(jwtPath)
	if err != nil {
		panic(err)
	}

	authHandler := handler.NewAuthHandler(readRepo, writeRepo, key)

	e.POST("/auth/login", authHandler.Login)
	e.POST("/auth/logout", authHandler.Logout)
	e.POST("/auth/registration", authHandler.Registration)

	go grpcServerStart(cfg, key)

	err = e.Start(fmt.Sprintf("0.0.0.0:%s", cfg.Server.RestPort))

	if err != nil {
		panic(err)
	}
}

func grpcServerStart(cfg *domain.Config, key jwk.Key) {
	server := mygrpc.New(key)

	lis, err := net.Listen("tcp", fmt.Sprintf("0.0.0.0:%s", cfg.Server.GrpcPort))
	if err != nil {
		panic(fmt.Sprintf("failed to listen: %v", err))
	}

	s := grpc.NewServer(
		grpc.UnaryInterceptor(func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo,
			handler grpc.UnaryHandler) (interface{}, error) {
			start := time.Now()

			resp, err := handler(ctx, req)

			duration := time.Since(start)

			log.Info("gRPC request received ",
				slog.String("method", info.FullMethod),
				slog.Duration("duration", duration),
				slog.Any("error", err),
			)

			return resp, err
		}),
	)

	grpc_auth.RegisterAuthServiceServer(s, server)
	fmt.Printf("grpc server listening at %v\n", lis.Addr())
	if err := s.Serve(lis); err != nil {
		panic(fmt.Sprintf("failed to serve: %v", err))
	}
}
