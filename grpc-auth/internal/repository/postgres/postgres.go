package postgres

import (
	"context"
	"grpc-auth/internal/domain"

	"github.com/jackc/pgx/v5/pgxpool"
)

type repository struct {
	pool *pgxpool.Pool
}

type Repository interface {
	Login(ctx context.Context, username string) (domain.UserDTO, error)
	Registration(ctx context.Context, username string, password domain.PasswordHash) (string, error)
}

func New(pool *pgxpool.Pool) Repository {
	return &repository{pool: pool}
}
