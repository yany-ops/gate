package main

import (
	"fmt"
	"net/http"

	"github.com/yany-ops/gate/internal/manager/auth"
	"github.com/yany-ops/gate/internal/manager/config"
	"github.com/yany-ops/gate/internal/manager/db"
	"github.com/yany-ops/gate/internal/manager/handlers"
	"go.uber.org/zap"
)

type Server struct {
	cfg    *config.Config
	logger *zap.Logger
	server *http.Server
}

func NewServer(cfg *config.Config, auth *auth.Auth, db *db.DB, logger *zap.Logger) *Server {
	router := handlers.SetupRouter(cfg, auth, db, logger)
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Server.Port),
		Handler: router,
	}
	return &Server{cfg: cfg, logger: logger, server: server}
}

func (s *Server) Start() error {
	s.server.Addr = fmt.Sprintf(":%d", s.cfg.Server.Port)
	s.logger.Info("Starting server", zap.String("addr", s.server.Addr))
	return s.server.ListenAndServe()
}
