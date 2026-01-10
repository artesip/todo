package postgres

import (
	"context"
	"errors"
	"fmt"
	"grpc-auth/internal/domain"

	"github.com/jackc/pgx/v5"
)

var (
	UserExists = errors.New("user already exists")
)

func (r *repository) Registration(ctx context.Context, username string, passwordHash domain.PasswordHash) (string, error) {
	const userExistsQuery = `
		SELECT EXISTS (
		    SELECT 1 FROM users 
		    WHERE username = @username
		);
	`

	var exists bool
	err := r.pool.QueryRow(ctx, userExistsQuery, pgx.NamedArgs{"username": username}).Scan(&exists)
	if exists {
		return "", UserExists
	}

	const query = `
		INSERT INTO users (username, password)
		VALUES (@username, @password)
		RETURNING id
	`

	var id string

	err = r.pool.QueryRow(ctx, query, pgx.NamedArgs{"username": username, "password": passwordHash}).Scan(&id)
	if err != nil {
		return "", fmt.Errorf("exec error: %w", err)
	}

	return id, nil
}
