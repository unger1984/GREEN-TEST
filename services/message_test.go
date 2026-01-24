package services

import (
	"encoding/json"
	"errors"
	"testing"

	"green-test/config"
	"green-test/dto"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

// MockRestClient - мock для RestClient
type MockRestClient struct {
	mock.Mock
}

func (m *MockRestClient) Get(url string, params map[string]string) ([]byte, error) {
	args := m.Called(url, params)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockRestClient) Post(url string, data interface{}) ([]byte, error) {
	args := m.Called(url, data)
	return args.Get(0).([]byte), args.Error(1)
}

// MockLogger - мock для Logger
type MockLogger struct {
	mock.Mock
}

func (m *MockLogger) Info(message string) {
	m.Called(message)
}

func (m *MockLogger) Error(message string) {
	m.Called(message)
}

func TestMessageService_SendMessage(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLogger)
	mockRestClient := new(MockRestClient)
	
	service := &MessageService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	message := &dto.MessageDto{
		ChatID:  "79001234567@c.us",
		Message: "Hello, World!",
	}
	
	expectedResponse := &dto.MessageResponseDto{
		IDMessage: "MES.12345",
	}
	
	responseBody, _ := json.Marshal(expectedResponse)

	// Определение ожиданий
	mockRestClient.On("Post", "https://api.green-api.com/waInstance12345/sendMessage/abcdef", message).Return(responseBody, nil)
	mockLogger.On("Info", "Message sent successfully, ID: MES.12345").Return()

	// Выполнение
	result, err := service.SendMessage(instance, token, message)

	// Проверка
	assert.NoError(t, err)
	assert.Equal(t, expectedResponse, result)
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}

func TestMessageService_SendMessage_Error(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLogger)
	mockRestClient := new(MockRestClient)
	
	service := &MessageService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	message := &dto.MessageDto{
		ChatID:  "79001234567@c.us",
		Message: "Hello, World!",
	}
	
	expectedError := errors.New("network error")

	// Определение ожиданий
	mockRestClient.On("Post", "https://api.green-api.com/waInstance12345/sendMessage/abcdef", message).Return([]byte{}, expectedError)
	mockLogger.On("Error", "Failed to send message: network error").Return()

	// Выполнение
	result, err := service.SendMessage(instance, token, message)

	// Проверка
	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, "failed to send message: network error", err.Error())
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}

func TestMessageService_SendFileByUrl(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLogger)
	mockRestClient := new(MockRestClient)
	
	service := &MessageService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	file := &dto.MessageFileDto{
		ChatID:   "79001234567@c.us",
		URLFile:  "https://example.com/file.pdf",
		FileName: "document.pdf",
	}
	
	expectedResponse := &dto.MessageResponseDto{
		IDMessage: "FILE.12345",
	}
	
	responseBody, _ := json.Marshal(expectedResponse)

	// Определение ожиданий
	mockRestClient.On("Post", "https://api.green-api.com/waInstance12345/sendFileByUrl/abcdef", file).Return(responseBody, nil)
	mockLogger.On("Info", "File sent successfully, ID: FILE.12345").Return()

	// Выполнение
	result, err := service.SendFileByUrl(instance, token, file)

	// Проверка
	assert.NoError(t, err)
	assert.Equal(t, expectedResponse, result)
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}

func TestMessageService_SendFileByUrl_Error(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLogger)
	mockRestClient := new(MockRestClient)
	
	service := &MessageService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	file := &dto.MessageFileDto{
		ChatID:   "79001234567@c.us",
		URLFile:  "https://example.com/file.pdf",
		FileName: "document.pdf",
	}
	
	expectedError := errors.New("network error")

	// Определение ожиданий
	mockRestClient.On("Post", "https://api.green-api.com/waInstance12345/sendFileByUrl/abcdef", file).Return([]byte{}, expectedError)
	mockLogger.On("Error", "Failed to send file: network error").Return()

	// Выполнение
	result, err := service.SendFileByUrl(instance, token, file)

	// Проверка
	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, "failed to send file: network error", err.Error())
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}