package utils

import (
	"log"
	"os"
)

// Logger представляет простой логгер
type Logger struct {
	infoLogger  *log.Logger
	errorLogger *log.Logger
}

// NewLogger создает новый экземпляр логгера
func NewLogger() *Logger {
	return &Logger{
		infoLogger:  log.New(os.Stdout, "INFO: ", log.Ldate|log.Ltime|log.Lshortfile),
		errorLogger: log.New(os.Stderr, "ERROR: ", log.Ldate|log.Ltime|log.Lshortfile),
	}
}

// Info записывает информационное сообщение
func (l *Logger) Info(message string) {
	l.infoLogger.Println(message)
}

// Error записывает сообщение об ошибке
func (l *Logger) Error(message string) {
	l.errorLogger.Println(message)
}