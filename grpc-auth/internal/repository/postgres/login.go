package postgres

import (
	"context"
	"errors"
	"fmt"
	"grpc-auth/internal/domain"

	"github.com/jackc/pgx/v5"
)

var UserNotFound = errors.New("user not found")

func (r *repository) Login(ctx context.Context, username string) (domain.UserDTO, error) {
	const query = `
		SELECT id, username, password
		FROM users
		WHERE username = @username
		LIMIT 1
	`

	var user domain.UserDTO
	err := r.pool.QueryRow(ctx, query, pgx.NamedArgs{"username": username}).
		Scan(&user.ID, &user.Username, &user.Password)

	if errors.Is(err, pgx.ErrNoRows) {
		return domain.UserDTO{}, UserNotFound
	}

	if err != nil {
		return domain.UserDTO{}, fmt.Errorf("exec error: %w", err)
	}

	return user, nil
}
