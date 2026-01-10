package jwt

import (
	"fmt"
	"time"

	"github.com/lestrrat-go/jwx/v2/jwa"
	"github.com/lestrrat-go/jwx/v2/jwk"
	"github.com/lestrrat-go/jwx/v2/jwt"
)

const Issuer = "todo_auth_service"

func CreateJwt(subject string, issuer string, expireAt time.Time, prvKey jwk.Key) ([]byte, error) {
	tokenPrepare := jwt.NewBuilder().
		Issuer(issuer).
		Expiration(expireAt).
		Subject(subject)

	token, err := tokenPrepare.Build()
	if err != nil {
		return nil, fmt.Errorf("token builder error: %w", err)
	}

	signed, err := jwt.Sign(token, jwt.WithKey(jwa.EdDSA, prvKey))
	if err != nil {
		return nil, fmt.Errorf("token sign error: %w", err)
	}

	return signed, nil
}

func ValidateJwt(tokenSigned []byte, prvKey jwk.Key, issuer string) (jwt.Token, error) {
	token, err := jwt.Parse(
		tokenSigned,
		jwt.WithKey(jwa.EdDSA, prvKey),
		jwt.WithIssuer(issuer),
	)

	if err != nil {
		return nil, fmt.Errorf("error validating jwt: %v", err)
	}

	return token, nil
}

func LoadKey(path string) (jwk.Key, error) {
	keySet, err := jwk.ReadFile(path, jwk.WithPEM(true))
	if err != nil {
		return nil, fmt.Errorf("read file: %v", err)
	}

	key, ok := keySet.Key(0)
	if !ok {
		return nil, fmt.Errorf("invalid key: %s", path)
	}

	return key, nil
}
