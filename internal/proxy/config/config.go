package config

import (
	"fmt"
	"os"

	auth "github.com/YanyChoi/gate/pkg/auth"
	"golang.org/x/oauth2"
)

type DBConfig struct {
	Host string
	Port string
	User string
	Password string
	Name string
}

func (c *DBConfig) GetDSN() string {
	return fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=disable", c.Host, c.Port, c.User, c.Password, c.Name)
}

type Config struct {
	Port string `env:"PORT" default:"8081"`
	ApiServerURL string `env:"API_SERVER_URL" default:"http://localhost:8080"`
	DB *DBConfig
	Auth *auth.Config
}

func New() *Config {
	config := &Config{}
	config.Load()
	return config
}

func (c *Config) Load() {
	c.Port = c.loadConfig("PORT", "8081")
	c.ApiServerURL = c.loadConfig("API_SERVER_URL", "http://localhost:8080")
	c.DB = &DBConfig{
		Host: c.loadConfig("DB_HOST", "localhost"),
		Port: c.loadConfig("DB_PORT", "5432"),
		User: c.loadConfig("DB_USER", "postgres"),
		Password: c.loadConfig("DB_PASSWORD", "postgres"),
		Name: c.loadConfig("DB_NAME", "postgres"),
	}
	c.Auth = &auth.Config{
		Oauth: &oauth2.Config{
			ClientID:     c.loadConfig("OAUTH_CLIENT_ID", ""),
			ClientSecret: c.loadConfig("OAUTH_CLIENT_SECRET", ""),
			RedirectURL:  c.loadConfig("OAUTH_REDIRECT_URL", ""),
			Scopes:       []string{"openid", "profile", "email", "groups"},
			Endpoint: oauth2.Endpoint{
				AuthURL:  c.loadConfig("OAUTH_AUTH_URL", ""),
				TokenURL: c.loadConfig("OAUTH_TOKEN_URL", ""),
			},
		},
		OauthState: c.loadConfig("OAUTH_STATE", "oauthstate"),
		SingingKey: c.loadConfig("SIGNING_KEY", "signingkey"),
		Domain: c.loadConfig("DOMAIN", "localhost"),
	}
}

func (c *Config) loadConfig(envName string, defaultValue string) string {
	value := os.Getenv(envName)
	if value == "" {
		return defaultValue
	}
	return value
}
