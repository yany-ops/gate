package db

import (
	"fmt"
	"os"

	"github.com/yany-ops/gate/internal/manager/config"
	"github.com/yany-ops/gate/internal/manager/models"
	"go.uber.org/zap"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type DB struct {
	DB     *gorm.DB
	logger *zap.Logger
}

func NewDB(cfg *config.Config, logger *zap.Logger) *DB {
	dbURL := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable", cfg.Database.Host, cfg.Database.Port, cfg.Database.User, cfg.Database.Password, cfg.Database.Database)
	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		zap.L().Error("Failed to connect to database", zap.Error(err))
		os.Exit(1)
	}
	return &DB{DB: db, logger: logger}
}

func (d *DB) AutoMigrate() error {
	err := d.DB.AutoMigrate(
		&models.User{},
		&models.Group{},
		&models.Role{},
		&models.Permission{},
		&models.Cluster{},
		&models.AuditLog{},
	)
	if err != nil {
		d.logger.Error("Failed to migrate database", zap.Error(err))
		return err
	}
	return nil
}
