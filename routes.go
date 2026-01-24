package main

import (
	"github.com/gin-gonic/gin"

	"green-test/controllers"
	"green-test/middleware"
)

func registerRoutes(router *gin.Engine, messageController *controllers.MessageController, settingsController *controllers.SettingsController) {
	// Группировка маршрутов с префиксом /api
	api := router.Group("/api")
	{
		// Группировка маршрутов для сообщений
		message := api.Group("/message")
		// Добавление middleware для аутентификации для всех сред
		message.Use(middleware.RequireAuth)
		{
			// Регистрация маршрутов для сообщений
			message.POST("/", messageController.SendMessage)
			message.POST("/filebyurl", messageController.SendFileByUrl)
		}

		// Группировка маршрутов для настроек
		settings := api.Group("/settings")
		// Добавление middleware для аутентификации для всех сред
		settings.Use(middleware.RequireAuth)
		{
			// Регистрация маршрутов для настроек
			settings.GET("/", settingsController.GetSettings)
			settings.GET("/instance", settingsController.GetStateInstance)
		}
	}
}