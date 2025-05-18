package main

import (
	"os"

	"github.com/spf13/cobra"
	"github.com/yany-ops/gate/internal/manager/auth"
	"github.com/yany-ops/gate/internal/manager/config"
	"github.com/yany-ops/gate/internal/manager/db"
	"go.uber.org/zap"
)

func main() {

	var rootCmd = &cobra.Command{
		Use:   "manager",
		Short: "Gate manager",
		Run: func(cmd *cobra.Command, args []string) {
			logger, _ := zap.NewProduction()
			defer logger.Sync()
			run(logger)
		},
	}

	if err := rootCmd.Execute(); err != nil {
		os.Exit(1)
	}
}

func run(logger *zap.Logger) {
	cfg, err := config.LoadConfig()
	if err != nil {
		logger.Error("Failed to load config", zap.Error(err))
		os.Exit(1)
	}

	auth, err := auth.NewAuth(cfg, logger)
	if err != nil {
		logger.Error("Failed to create auth", zap.Error(err))
		os.Exit(1)
	}

	db := db.NewDB(cfg, logger)
	if cfg.Database.AutoMigrate {
		logger.Info("Migrating database", zap.Bool("auto_migrate", cfg.Database.AutoMigrate))
		if err := db.AutoMigrate(); err != nil {
			logger.Error("Failed to migrate database", zap.Error(err))
			os.Exit(1)
		}
	}

	server := NewServer(cfg, auth, db, logger)
	if err := server.Start(); err != nil {
		logger.Error("Failed to start server", zap.Error(err))
		os.Exit(1)
	}
}
