package dto

// AuthDto представляет структуру аутентификации
type AuthDto struct {
	Instance string `json:"instance" binding:"required"`
	Token    string `json:"token" binding:"required"`
}