package config

// Config представляет конфигурацию приложения
type Config struct {
	Env    string
	Server ServerConfig
	Green  GreenConfig
}

// ServerConfig представляет конфигурацию сервера
type ServerConfig struct {
	Host       string
	Port       string
	URL        string
	StaticPath string
}

// GreenConfig представляет конфигурацию Green API
type GreenConfig struct {
	URL   string
	Media string
}

// NewConfig создает новую конфигурацию приложения
func NewConfig() *Config {
	return &Config{
		Env: "local",
		Server: ServerConfig{
			Host:       "localhost",
			Port:       "8084",
			URL:        "http://localhost:8084",
			StaticPath: "./static",
		},
		Green: GreenConfig{
			URL:   "https://api.green-api.com",
			Media: "https://media.green-api.com",
		},
	}
}