package postgres_write

import (
	"context"
	"grpc-auth/internal/domain"

	"github.com/jackc/pgx/v5/pgxpool"
)

type repository struct {
	pool *pgxpool.Pool
}

type Repository interface {
	Registration(ctx context.Context, username string, password domain.PasswordHash) (string, error)
}

func New(pool *pgxpool.Pool) Repository {
	return &repository{pool: pool}
}
