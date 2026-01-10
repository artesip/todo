package db

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

func NewDBPool(ctx context.Context, cfg *pgxpool.Config) (*pgxpool.Pool, error) {
	pool, err := pgxpool.NewWithConfig(ctx, cfg)

	if err != nil {
		return nil, fmt.Errorf("error connecting to the database: %w", err)
	}
	return pool, nil
}
