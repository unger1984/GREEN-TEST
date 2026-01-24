package utils

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// RestClient представляет REST клиент для выполнения HTTP запросов
type RestClient struct {
	client *http.Client
	logger *Logger
}

// NewRestClient создает новый экземпляр REST клиента
func NewRestClient(logger *Logger) *RestClient {
	// Создание HTTP клиента с отключенной проверкой сертификатов
	tr := &http.Transport{
		TLSClientConfig: &tls.Config{InsecureSkipVerify: true},
	}
	client := &http.Client{Transport: tr}

	return &RestClient{
		client: client,
		logger: logger,
	}
}

// Get выполняет GET запрос
func (rc *RestClient) Get(url string, params map[string]string) ([]byte, error) {
	// Создание запроса
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Добавление параметров запроса
	q := req.URL.Query()
	for key, value := range params {
		q.Add(key, value)
	}
	req.URL.RawQuery = q.Encode()

	// Логирование запроса
	rc.logger.Info(fmt.Sprintf("GET %s", url))

	// Выполнение запроса
	resp, err := rc.client.Do(req)
	if err != nil {
		rc.logger.Error(fmt.Sprintf("Failed to execute GET request to %s: %v", url, err))
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	// Проверка статуса ответа
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		rc.logger.Error(fmt.Sprintf("GET request to %s failed with status: %d", url, resp.StatusCode))
		return nil, fmt.Errorf("request failed with status: %d", resp.StatusCode)
	}

	// Чтение тела ответа
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		rc.logger.Error(fmt.Sprintf("Failed to read response body for GET request to %s: %v", url, err))
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Логирование ответа
	rc.logger.Info(fmt.Sprintf("GET %s response: %s", url, string(body)))

	return body, nil
}

// Post выполняет POST запрос
func (rc *RestClient) Post(url string, data interface{}) ([]byte, error) {
	// Преобразование данных в JSON
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal data: %w", err)
	}

	// Создание запроса
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Установка заголовков
	req.Header.Set("Content-Type", "application/json")

	// Логирование запроса
	rc.logger.Info(fmt.Sprintf("POST %s request: %s", url, string(jsonData)))

	// Выполнение запроса
	resp, err := rc.client.Do(req)
	if err != nil {
		rc.logger.Error(fmt.Sprintf("Failed to execute POST request to %s: %v", url, err))
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	// Проверка статуса ответа
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		rc.logger.Error(fmt.Sprintf("POST request to %s failed with status: %d", url, resp.StatusCode))
		return nil, fmt.Errorf("request failed with status: %d", resp.StatusCode)
	}

	// Чтение тела ответа
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		rc.logger.Error(fmt.Sprintf("Failed to read response body for POST request to %s: %v", url, err))
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Логирование ответа
	rc.logger.Info(fmt.Sprintf("POST %s response: %s", url, string(body)))

	return body, nil
}