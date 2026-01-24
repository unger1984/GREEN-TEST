package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"green-test/dto"
	"green-test/services"
)

// SettingsController представляет контроллер для работы с настройками
type SettingsController struct {
	settingsService *services.SettingsService
}

// NewSettingsController создает новый экземпляр контроллера настроек
func NewSettingsController(settingsService *services.SettingsService) *SettingsController {
	return &SettingsController{
		settingsService: settingsService,
	}
}

// GetSettings получает настройки аккаунта
// @Summary Настройки аккаунта
// @Description Метод предназначен для получения текущих настроек аккаунта.
// @Tags Настройки
// @Accept json
// @Produce json
// @Param X-API-AUTH header string true "Base64(JSON({ instance, token }))"
// @Success 200 {object} dto.SettingsDto
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /settings [get]
func (sc *SettingsController) GetSettings(c *gin.Context) {
	// Получение данных аутентификации из контекста
	authInterface, exists := c.Get("auth")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	auth := authInterface.(dto.AuthDto)

	// Получение настроек
	settings, err := sc.settingsService.GetSettings(auth.Instance, auth.Token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, settings)
}

// GetStateInstance получает состояние инстанса
// @Summary Состояние аккаунта
// @Description Метод предназначен для получения состояния аккаунта.
// @Tags Настройки
// @Accept json
// @Produce json
// @Param X-API-AUTH header string true "Base64(JSON({ instance, token }))"
// @Success 200 {object} dto.StateInstanceDto
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /settings/instance [get]
func (sc *SettingsController) GetStateInstance(c *gin.Context) {
	// Получение данных аутентификации из контекста
	authInterface, exists := c.Get("auth")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	auth := authInterface.(dto.AuthDto)

	// Получение состояния инстанса
	state, err := sc.settingsService.GetStateInstance(auth.Instance, auth.Token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, state)
}