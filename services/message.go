package services

import (
	"encoding/json"
	"fmt"

	"green-test/config"
	"green-test/dto"
	"green-test/utils"
)

// restClientInterface определяет интерфейс для RestClient
type restClientInterface interface {
	Post(url string, data interface{}) ([]byte, error)
	Get(url string, params map[string]string) ([]byte, error)
}

// loggerInterface определяет интерфейс для Logger
type loggerInterface interface {
	Info(message string)
	Error(message string)
}

// MessageService представляет сервис для работы с сообщениями
type MessageService struct {
	config     *config.Config
	restClient restClientInterface
	logger     loggerInterface
}

// NewMessageService создает новый экземпляр сервиса сообщений
func NewMessageService(config *config.Config, logger *utils.Logger) *MessageService {
	return &MessageService{
		config:     config,
		restClient: utils.NewRestClient(logger),
		logger:     logger,
	}
}

// SetRestClient устанавливает RestClient (для тестирования)
func (ms *MessageService) SetRestClient(client restClientInterface) {
	ms.restClient = client
}

// SetLogger устанавливает Logger (для тестирования)
func (ms *MessageService) SetLogger(logger loggerInterface) {
	ms.logger = logger
}

// SendMessage отправляет текстовое сообщение
func (ms *MessageService) SendMessage(instance, token string, message *dto.MessageDto) (*dto.MessageResponseDto, error) {
	// Формирование URL
	url := fmt.Sprintf("%s/waInstance%s/sendMessage/%s", ms.config.Green.URL, instance, token)

	// Выполнение POST запроса
	responseBody, err := ms.restClient.Post(url, message)
	if err != nil {
		ms.logger.Error(fmt.Sprintf("Failed to send message: %v", err))
		return nil, fmt.Errorf("failed to send message: %w", err)
	}

	// Парсинг ответа
	var response dto.MessageResponseDto
	if err := json.Unmarshal(responseBody, &response); err != nil {
		ms.logger.Error(fmt.Sprintf("Failed to parse response: %v", err))
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	ms.logger.Info(fmt.Sprintf("Message sent successfully, ID: %s", response.IDMessage))
	return &response, nil
}

// SendFileByUrl отправляет файл по URL
func (ms *MessageService) SendFileByUrl(instance, token string, file *dto.MessageFileDto) (*dto.MessageResponseDto, error) {
	// Формирование URL
	url := fmt.Sprintf("%s/waInstance%s/sendFileByUrl/%s", ms.config.Green.URL, instance, token)

	// Выполнение POST запроса
	responseBody, err := ms.restClient.Post(url, file)
	if err != nil {
		ms.logger.Error(fmt.Sprintf("Failed to send file: %v", err))
		return nil, fmt.Errorf("failed to send file: %w", err)
	}

	// Парсинг ответа
	var response dto.MessageResponseDto
	if err := json.Unmarshal(responseBody, &response); err != nil {
		ms.logger.Error(fmt.Sprintf("Failed to parse response: %v", err))
		return nil, fmt.Errorf("failed to parse response: %w", err)
	}

	ms.logger.Info(fmt.Sprintf("File sent successfully, ID: %s", response.IDMessage))
	return &response, nil
}