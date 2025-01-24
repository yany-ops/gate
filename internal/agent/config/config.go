package config

import "os"

type Config struct {
	Port string `env:"PORT" default:"8081"`
	ApiServerURL string `env:"API_SERVER_URL" default:"http://localhost:8080"`
}

func New() *Config {
	config := &Config{}
	config.Load()
	return config
}

func (c *Config) Load() {
	c.Port = os.Getenv("PORT")
	if c.Port == "" {
		c.Port = "8081"
	}

	c.ApiServerURL = os.Getenv("API_SERVER_URL")
	if c.ApiServerURL == "" {
		c.ApiServerURL = "http://localhost:8080"
	}
}