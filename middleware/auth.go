package middleware

import (
	"encoding/base64"
	"encoding/json"
	"net/http"

	"github.com/gin-gonic/gin"

	"green-test/dto"
)

// AuthHeaderName представляет имя заголовка аутентификации
const AuthHeaderName = "X-API-AUTH"

// RequireAuth проверяет наличие и корректность заголовка аутентификации
func RequireAuth(c *gin.Context) {
	// Получение заголовка аутентификации
	authHeader := c.GetHeader(AuthHeaderName)
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "X-API-AUTH header is required"})
		c.Abort()
		return
	}

	// Декодирование base64
	decoded, err := base64.StdEncoding.DecodeString(authHeader)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid X-API-AUTH header format"})
		c.Abort()
		return
	}

	// Парсинг JSON
	var auth dto.AuthDto
	if err := json.Unmarshal(decoded, &auth); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid X-API-AUTH header format"})
		c.Abort()
		return
	}

	// Проверка наличия обязательных полей
	if auth.Instance == "" || auth.Token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid X-API-AUTH header format"})
		c.Abort()
		return
	}

	// Сохранение данных аутентификации в контексте
	c.Set("auth", auth)
	c.Next()
}