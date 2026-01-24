package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"green-test/dto"
	"green-test/services"
)

// MessageController представляет контроллер для работы с сообщениями
type MessageController struct {
	messageService *services.MessageService
}

// NewMessageController создает новый экземпляр контроллера сообщений
func NewMessageController(messageService *services.MessageService) *MessageController {
	return &MessageController{
		messageService: messageService,
	}
}

// SendMessage отправляет текстовое сообщение
// @Summary Отправить сообщение
// @Description Метод предназначен для отправки текстового сообщения в личный или групповой чат. Сообщение будет добавлено в очередь на отправку. Сообщение на отправку хранится 24 часа в очереди и будет отправлено сразу же после авторизации телефона. Скорость отправки сообщений из очереди регулирует параметр Интервал отправки сообщений.
// @Tags Сообщения
// @Accept json
// @Produce json
// @Param X-API-AUTH header string true "Base64(JSON({ instance, token }))"
// @Param message body dto.MessageDto true "Сообщение"
// @Success 200 {object} dto.MessageResponseDto
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /message [post]
func (mc *MessageController) SendMessage(c *gin.Context) {
	// Получение данных аутентификации из контекста
	authInterface, exists := c.Get("auth")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	auth := authInterface.(dto.AuthDto)

	// Парсинг тела запроса
	var message dto.MessageDto
	if err := c.ShouldBindJSON(&message); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Отправка сообщения
	response, err := mc.messageService.SendMessage(auth.Instance, auth.Token, &message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

// SendFileByUrl отправляет файл по URL
// @Summary Отправить файл по ссылке
// @Description Метод предназначен для отправки файла, загружаемого по ссылке. Сообщение будет добавлено в очередь на отправку
// @Tags Сообщения
// @Accept json
// @Produce json
// @Param X-API-AUTH header string true "Base64(JSON({ instance, token }))"
// @Param file body dto.MessageFileDto true "Файл"
// @Success 200 {object} dto.MessageResponseDto
// @Failure 400 {object} map[string]string
// @Failure 401 {object} map[string]string
// @Failure 500 {object} map[string]string
// @Router /message/filebyurl [post]
func (mc *MessageController) SendFileByUrl(c *gin.Context) {
	// Получение данных аутентификации из контекста
	authInterface, exists := c.Get("auth")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	auth := authInterface.(dto.AuthDto)

	// Парсинг тела запроса
	var file dto.MessageFileDto
	if err := c.ShouldBindJSON(&file); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Отправка файла
	response, err := mc.messageService.SendFileByUrl(auth.Instance, auth.Token, &file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}