package services

import (
	"encoding/json"
	"fmt"

	"green-test/config"
	"green-test/dto"
	"green-test/utils"
)

// restClientInterface определяет интерфейс для RestClient
type restClientInterfaceSettings interface {
	Post(url string, data interface{}) ([]byte, error)
	Get(url string, params map[string]string) ([]byte, error)
}

// loggerInterface определяет интерфейс для Logger
type loggerInterfaceSettings interface {
	Info(message string)
	Error(message string)
}

// SettingsService представляет сервис для работы с настройками
type SettingsService struct {
	config     *config.Config
	restClient restClientInterfaceSettings
	logger     loggerInterfaceSettings
}

// NewSettingsService создает новый экземпляр сервиса настроек
func NewSettingsService(config *config.Config, logger *utils.Logger) *SettingsService {
	return &SettingsService{
		config:     config,
		restClient: utils.NewRestClient(logger),
		logger:     logger,
	}
}

// SetRestClient устанавливает RestClient (для тестирования)
func (ss *SettingsService) SetRestClient(client restClientInterfaceSettings) {
	ss.restClient = client
}

// SetLogger устанавливает Logger (для тестирования)
func (ss *SettingsService) SetLogger(logger loggerInterfaceSettings) {
	ss.logger = logger
}

// GetStateInstance получает состояние инстанса
func (ss *SettingsService) GetStateInstance(instance, token string) (*dto.StateInstanceDto, error) {
	// Формирование URL
	url := fmt.Sprintf("%s/waInstance%s/getStateInstance/%s", ss.config.Green.URL, instance, token)

	// Выполнение GET запроса
	responseBody, err := ss.restClient.Get(url, nil)
	if err != nil {
		ss.logger.Error(fmt.Sprintf("Failed to get state instance: %v", err))
		return nil, fmt.Errorf("failed to get state instance: %w", err)
	}

	// Парсинг ответа
	var response dto.StateInstanceDto
	if err := json.Unmarshal(responseBody, &response); err != nil {
		ss.logger.Error(fmt.Sprintf("Failed to parse response: %v", err))
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	ss.logger.Info(fmt.Sprintf("State instance retrieved successfully: %s", response.StateInstance))
	return &response, nil
}

// GetSettings получает настройки аккаунта
func (ss *SettingsService) GetSettings(instance, token string) (*dto.SettingsDto, error) {
	// Формирование URL
	url := fmt.Sprintf("%s/waInstance%s/getSettings/%s", ss.config.Green.URL, instance, token)

	// Выполнение GET запроса
	responseBody, err := ss.restClient.Get(url, nil)
	if err != nil {
		ss.logger.Error(fmt.Sprintf("Failed to get settings: %v", err))
		return nil, fmt.Errorf("failed to get settings: %w", err)
	}

	// Парсинг ответа
	var response dto.SettingsDto
	if err := json.Unmarshal(responseBody, &response); err != nil {
		ss.logger.Error(fmt.Sprintf("Failed to parse response: %v", err))
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	ss.logger.Info("Settings retrieved successfully")
	return &response, nil
}