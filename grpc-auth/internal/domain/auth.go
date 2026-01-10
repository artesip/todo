package domain

type PasswordHash string

type LoginDTO struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RegisterDTO struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
