package handler

import (
	"errors"
	"fmt"
	"grpc-auth/internal/domain"
	"grpc-auth/internal/repository/postgres_read"
	"grpc-auth/internal/repository/postgres_write"
	"grpc-auth/pkg/hash"
	"grpc-auth/pkg/jwt"
	"net/http"
	"time"

	"github.com/labstack/echo/v4"
	"github.com/lestrrat-go/jwx/v2/jwk"
)

type authHandler struct {
	repo   postgres_read.Repository
	repoWr postgres_write.Repository
	key    jwk.Key
}

type AuthHandler interface {
	Login(c echo.Context) error
	Logout(c echo.Context) error
	Registration(c echo.Context) error
}

func NewAuthHandler(readRepo postgres_read.Repository, writeRepo postgres_write.Repository, key jwk.Key) AuthHandler {
	return &authHandler{repo: readRepo, repoWr: writeRepo, key: key}
}

func (h *authHandler) Login(c echo.Context) error {
	var login domain.LoginDTO
	if err := c.Bind(&login); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	user, err := h.repo.Login(c.Request().Context(), login.Username)
	if err != nil && errors.Is(err, postgres_read.UserNotFound) {
		return echo.NewHTTPError(http.StatusNotFound, err.Error())
	} else if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	isEqual := hash.CheckPasswordHash(login.Password, user.Password)

	if !isEqual {
		return echo.NewHTTPError(http.StatusUnauthorized, "wrong username or password")
	}

	err = h.addJwtCookie(c, user.ID)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, user.ID)
}

func (h *authHandler) Registration(c echo.Context) error {
	var registration domain.RegisterDTO
	if err := c.Bind(&registration); err != nil {
		return echo.NewHTTPError(http.StatusBadRequest, err.Error())
	}

	pwdHash, err := hash.HashPassword(registration.Password)
	id, err := h.repoWr.Registration(c.Request().Context(), registration.Username, domain.PasswordHash(pwdHash))

	if err != nil && errors.Is(err, postgres_write.UserExists) {
		return echo.NewHTTPError(http.StatusConflict, err.Error())
	} else if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	err = h.addJwtCookie(c, id)
	if err != nil {
		return echo.NewHTTPError(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusOK, id)
}

func (h *authHandler) Logout(c echo.Context) error {
	c.SetCookie(&http.Cookie{
		Name:     "auth",
		SameSite: http.SameSiteLaxMode,
		Value:    "",
		Expires:  time.Time{},
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
		MaxAge:   -1,
	})

	return c.NoContent(http.StatusNoContent)
}

func (h *authHandler) addJwtCookie(c echo.Context, userID string) error {
	expireAt := time.Now().Add(time.Hour * 24)

	token, err := jwt.CreateJwt(userID, jwt.Issuer, expireAt, h.key)
	if err != nil {
		return fmt.Errorf("jwt cookie add error: %w", err)
	}

	c.SetCookie(&http.Cookie{
		Name:     "auth",
		SameSite: http.SameSiteLaxMode,
		Value:    string(token),
		Expires:  expireAt,
		Path:     "/",
		Secure:   false,
		HttpOnly: true,
	})

	return nil
}
