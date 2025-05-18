package handlers

import (
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/yany-ops/gate/internal/manager/auth"
	"github.com/yany-ops/gate/internal/manager/config"
	"github.com/yany-ops/gate/internal/manager/db"
	"go.uber.org/zap"
)

func SetupRouter(config *config.Config, auth *auth.Auth, db *db.DB, logger *zap.Logger) *chi.Mux {
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	router.Use(middleware.Recoverer)
	router.Use(middleware.Compress(5))
	router.Use(middleware.StripSlashes)
	router.Use(middleware.RealIP)
	router.Use(middleware.RequestID)
	router.Use(middleware.Timeout(60 * time.Second))

	router.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("OK"))
		if err != nil {
			logger.Error("Failed to write health response", zap.Error(err))
		}
	})

	authHandlers := authHandlers(config, auth, db, logger)
	router.Mount("/auth", authHandlers.SetupRouter())

	userHandlers := userHandlers(config, db, logger)
	router.Mount("/api/v1/user", userHandlers.SetupRouter())

	rbacHandlers := rbacHandlers(config, db, logger, auth)
	router.Mount("/api/v1/rbac", rbacHandlers.SetupRouter())

	router.Mount("/", http.FileServer(http.Dir("./web/dist")))
	return router
}
