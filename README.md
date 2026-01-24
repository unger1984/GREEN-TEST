# Тестовое задание на должность "Lead/Senior Backend Developer (Node.js / Go)" в GREEN-API

# Реализация на Golang
# [Реализация на NestJs](https://github.com/unger1984/GREEN-TEST/tree/nestjs)

Учитывая что должность называется Backend Developer, при выполнении тестового задания, основные усилия были сосредоточены на Backend части. Кроме того, SDK предоставляемое GREEN-API, тоже не было использовано, чтобы показать максимальное владение используемыми инструментами.

## Структура проекта

```
.
├── config/              # Конфигурация приложения
├── controllers/          # Контроллеры для обработки запросов
├── dto/                  # Data Transfer Objects
├── middleware/          # Middleware для обработки запросов
├── services/            # Бизнес-логика приложения
├── utils/               # Вспомогательные утилиты
├── .env.sample          # Пример файла конфигурации
├── go.mod               # Зависимости Go модуля
├── main.go              # Точка входа в приложение
└── routes.go           # Определение маршрутов API
```

## Установка и запуск

1. Установите Go (версия 1.21 или выше)
2. Скопируйте файл `.env.sample` в `.env` и настройте переменные окружения:
   ```
   cp .env.sample .env
   ```
3. Установите зависимости:
   ```
   go mod tidy
   ```
4. Запустите тесты:

   ```
   go test ./services/... -v
   ```

5. Запустите приложение:
   ```
   go run main.go
   ```

### Генерация Swagger документации

Документация API генерируется автоматически с использованием Swagger. Для обновления документации выполните команду:

```bash
swag init -g main.go
```

После генерации документация будет доступна по адресу: `http://localhost:8084/docs/index.html`

## API Endpoints

### Сообщения

- `POST /api/message` - Отправить сообщение
- `POST /api/message/filebyurl` - Отправить файл по ссылке

### Настройки

- `GET /api/settings` - Получить настройки аккаунта
- `GET /api/settings/instance` - Получить состояние инстанса

## Переменные окружения

- `SERVER_HOST` - Хост сервера (по умолчанию: localhost)
- `SERVER_PORT` - Порт сервера (по умолчанию: 8084)
- `GREEN_URL` - URL Green API (по умолчанию: https://api.green-api.com)

# Ссылки на результат

- [Форма](https://green.unger1984.pro/)
- [API doc](https://green.unger1984.pro/docs/)
- [Видео](https://github.com/unger1984/GREEN-TEST/raw/main/Green-api.mov)
