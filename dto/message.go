package dto

// CustomPreviewDto представляет структуру пользовательского превью
type CustomPreviewDto struct {
	Title        string `json:"title,omitempty"`
	Description  string `json:"description,omitempty"`
	Link         string `json:"link,omitempty"`
	URLFile      string `json:"urlFile,omitempty"`
	JpegThumbnail string `json:"jpegThumbnail,omitempty"`
}

// MessageDto представляет структуру сообщения
type MessageDto struct {
	ChatID           string            `json:"chatId" binding:"required"`
	Message          string            `json:"message" binding:"required"`
	QuotedMessageID  string            `json:"quotedMessageId,omitempty"`
	LinkPreview      *bool             `json:"linkPreview,omitempty"`
	TypePreview      string            `json:"typePreview,omitempty"`
	CustomPreview    *CustomPreviewDto `json:"customPreview,omitempty"`
	TypingTime       *int              `json:"typingTime,omitempty"`
}

// MessageFileDto представляет структуру файла сообщения
type MessageFileDto struct {
	ChatID           string `json:"chatId" binding:"required"`
	URLFile          string `json:"urlFile" binding:"required"`
	FileName         string `json:"fileName" binding:"required"`
	Caption         string `json:"caption,omitempty"`
	QuotedMessageID  string `json:"quotedMessageId,omitempty"`
	TypingTime       *int   `json:"typingTime,omitempty"`
	TypingType       string `json:"typingType,omitempty"`
}

// MessageResponseDto представляет структуру ответа на сообщение
type MessageResponseDto struct {
	IDMessage string `json:"idMessage"`
}