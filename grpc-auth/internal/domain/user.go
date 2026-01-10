package domain

type UserDTO struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}
