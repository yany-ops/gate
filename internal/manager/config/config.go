package config

import "github.com/spf13/viper"

type Config struct {
	Server struct {
		Port int `mapstructure:"port"`
	} `mapstructure:"server"`
	OIDC struct {
		ClientID     string `mapstructure:"client_id"`
		ClientSecret string `mapstructure:"client_secret"`
		IssuerURL    string `mapstructure:"issuer_url"`
		RedirectURL  string `mapstructure:"redirect_url"`
	} `mapstructure:"oidc"`
	Database struct {
		Host        string `mapstructure:"host"`
		Port        int    `mapstructure:"port"`
		User        string `mapstructure:"user"`
		Password    string `mapstructure:"password"`
		Database    string `mapstructure:"database"`
		AutoMigrate bool   `mapstructure:"auto_migrate"`
	} `mapstructure:"database"`
	Admins []string `mapstructure:"admins"`
}

func LoadConfig() (*Config, error) {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")

	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	var cfg Config
	if err := viper.Unmarshal(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}
