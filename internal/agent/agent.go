package agent

import (
	"net/http"

	"github.com/YanyChoi/gate/internal/agent/config"
	"github.com/YanyChoi/gate/internal/agent/handler"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type agent struct {
	router *chi.Mux
	config *config.Config
}

func New() *agent {
	config := config.New()
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	agent := &agent{router: router, config: config}
	handler, err := handler.New(config)
	if err != nil {
		panic(err)
	}
	handler.SetRoutes(router)
	return agent
}

func (a *agent) Start() {
	http.ListenAndServe(":"+a.config.Port, a.router)
}

