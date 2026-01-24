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
type MockRestClientSettings struct {
	mock.Mock
}

func (m *MockRestClientSettings) Get(url string, params map[string]string) ([]byte, error) {
	args := m.Called(url, params)
	return args.Get(0).([]byte), args.Error(1)
}

func (m *MockRestClientSettings) Post(url string, data interface{}) ([]byte, error) {
	args := m.Called(url, data)
	return args.Get(0).([]byte), args.Error(1)
}

// MockLogger - мock для Logger
type MockLoggerSettings struct {
	mock.Mock
}

func (m *MockLoggerSettings) Info(message string) {
	m.Called(message)
}

func (m *MockLoggerSettings) Error(message string) {
	m.Called(message)
}

func TestSettingsService_GetStateInstance(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLoggerSettings)
	mockRestClient := new(MockRestClientSettings)
	
	service := &SettingsService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	
	expectedResponse := &dto.StateInstanceDto{
		StateInstance: dto.StateAuthorized,
	}
	
	responseBody, _ := json.Marshal(expectedResponse)

	// Определение ожиданий
	mockRestClient.On("Get", "https://api.green-api.com/waInstance12345/getStateInstance/abcdef", map[string]string(nil)).Return(responseBody, nil)
	mockLogger.On("Info", "State instance retrieved successfully: authorized").Return()

	// Выполнение
	result, err := service.GetStateInstance(instance, token)

	// Проверка
	assert.NoError(t, err)
	assert.Equal(t, expectedResponse, result)
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}

func TestSettingsService_GetStateInstance_Error(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLoggerSettings)
	mockRestClient := new(MockRestClientSettings)
	
	service := &SettingsService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	
	expectedError := errors.New("network error")

	// Определение ожиданий
	mockRestClient.On("Get", "https://api.green-api.com/waInstance12345/getStateInstance/abcdef", map[string]string(nil)).Return([]byte{}, expectedError)
	mockLogger.On("Error", "Failed to get state instance: network error").Return()

	// Выполнение
	result, err := service.GetStateInstance(instance, token)

	// Проверка
	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, "failed to get state instance: network error", err.Error())
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}

func TestSettingsService_GetSettings(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLoggerSettings)
	mockRestClient := new(MockRestClientSettings)
	
	service := &SettingsService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	
	expectedResponse := &dto.SettingsDto{
		Wid:               "79001234567@c.us",
		CountryInstance:   "RU",
		TypeAccount:      "whatsapp",
		WebhookUrl:        "https://mydomain.com/webhook",
		MarkIncomingMessagesReaded: "yes",
	}
	
	responseBody, _ := json.Marshal(expectedResponse)

	// Определение ожиданий
	mockRestClient.On("Get", "https://api.green-api.com/waInstance12345/getSettings/abcdef", map[string]string(nil)).Return(responseBody, nil)
	mockLogger.On("Info", "Settings retrieved successfully").Return()

	// Выполнение
	result, err := service.GetSettings(instance, token)

	// Проверка
	assert.NoError(t, err)
	assert.Equal(t, expectedResponse, result)
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}

func TestSettingsService_GetSettings_Error(t *testing.T) {
	// Подготовка
	cfg := &config.Config{
		Green: config.GreenConfig{
			URL: "https://api.green-api.com",
		},
	}
	
	mockLogger := new(MockLoggerSettings)
	mockRestClient := new(MockRestClientSettings)
	
	service := &SettingsService{
		config:     cfg,
		restClient: mockRestClient,
		logger:     mockLogger,
	}
	
	instance := "12345"
	token := "abcdef"
	
	expectedError := errors.New("network error")

	// Определение ожиданий
	mockRestClient.On("Get", "https://api.green-api.com/waInstance12345/getSettings/abcdef", map[string]string(nil)).Return([]byte{}, expectedError)
	mockLogger.On("Error", "Failed to get settings: network error").Return()

	// Выполнение
	result, err := service.GetSettings(instance, token)

	// Проверка
	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Equal(t, "failed to get settings: network error", err.Error())
	mockRestClient.AssertExpectations(t)
	mockLogger.AssertExpectations(t)
}