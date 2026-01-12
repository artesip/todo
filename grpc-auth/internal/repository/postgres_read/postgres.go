package postgres_read

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
}

func New(pool *pgxpool.Pool) Repository {
	return &repository{pool: pool}
}
