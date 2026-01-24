package main

import (
	"crypto/tls"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/spf13/viper"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	_ "green-test/docs"

	"green-test/config"
	"green-test/controllers"
	"green-test/services"
	"green-test/utils"
)

var (
	appConfig *config.Config
	logger    *utils.Logger
)

func init() {
	logger = utils.NewLogger()

	viper.SetConfigFile(".env")
	if err := viper.ReadInConfig(); err != nil {
		logger.Info("Warning: can't read config file: " + err.Error())
	}

	appConfig = config.NewConfig()

	viper.SetDefault("SERVER_HOST", appConfig.Server.Host)
	viper.SetDefault("SERVER_PORT", appConfig.Server.Port)
	viper.SetDefault("GREEN_URL", appConfig.Green.URL)
	viper.AutomaticEnv()

	appConfig.Env = viper.GetString("ENV")
	appConfig.Server.Host = viper.GetString("SERVER_HOST")
	appConfig.Server.Port = viper.GetString("SERVER_PORT")
	appConfig.Green.URL = viper.GetString("GREEN_URL")
}

func main() {
	router := gin.Default()

	messageService := services.NewMessageService(appConfig, logger)
	settingsService := services.NewSettingsService(appConfig, logger)

	messageController := controllers.NewMessageController(messageService)
	settingsController := controllers.NewSettingsController(settingsService)

	registerRoutes(router, messageController, settingsController)

	// Swagger для локальной среды
	if appConfig.Env == "local" {
		router.GET("/docs/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	}

	// Статика и SPA fallback
	if appConfig.Env == "local" {
		router.StaticFS("/static", gin.Dir(appConfig.Server.StaticPath, true))
		router.NoRoute(func(c *gin.Context) {
			filePath := filepath.Join(appConfig.Server.StaticPath, c.Request.URL.Path)

			if _, err := os.Stat(filePath); err == nil {
				c.File(filePath)
			} else {
				c.File(filepath.Join(appConfig.Server.StaticPath, "index.html"))
			}
		})
	}

	addr := appConfig.Server.Host + ":" + appConfig.Server.Port
	logger.Info("Server starting on " + addr)

	if appConfig.Env == "local" {
		// Проверка наличия сертификатов
		chainExists := false
		keyExists := false
		if _, err := os.Stat("certs/chain.pem"); err == nil {
			chainExists = true
		}
		if _, err := os.Stat("certs/key.pem"); err == nil {
			keyExists = true
		}

		if chainExists && keyExists {
			logger.Info("Starting HTTPS server (self-signed, local dev)")

			tlsConfig := &tls.Config{
				MinVersion: tls.VersionTLS12,
			}

			server := &http.Server{
				Addr:      addr,
				Handler:   router,
				TLSConfig: tlsConfig,
				// Скрываем TLS handshake errors от самоподписанных сертификатов
				ErrorLog: log.New(io.Discard, "", 0),
			}

			if err := server.ListenAndServeTLS("certs/chain.pem", "certs/key.pem"); err != nil {
				logger.Error("Failed to start HTTPS server: " + err.Error())
				os.Exit(1)
			}
		} else {
			logger.Info("Starting HTTP server (certs missing)")
			if err := router.Run(addr); err != nil {
				logger.Error("Failed to start HTTP server: " + err.Error())
				os.Exit(1)
			}
		}
	} else {
		logger.Info("Starting HTTP server")
		if err := router.Run(addr); err != nil {
			logger.Error("Failed to start HTTP server: " + err.Error())
			os.Exit(1)
		}
	}
}
