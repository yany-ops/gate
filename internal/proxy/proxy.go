package proxy

import (
	"net/http"

	"github.com/YanyChoi/gate/internal/proxy/config"
	"github.com/YanyChoi/gate/internal/proxy/handler"
	"github.com/YanyChoi/gate/pkg/db"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type proxy struct {
	router *chi.Mux
	db     *db.DB
	config *config.Config
}

func New(db *db.DB) *proxy {
	config := config.New()
	router := chi.NewRouter()
	router.Use(middleware.Logger)
	proxy := &proxy{router: router, config: config, db: db}
	handler, err := handler.New(config, db)
	if err != nil {
		panic(err)
	}
	handler.SetRoutes(router)
	return proxy
}

func (p *proxy) Start() {
	http.ListenAndServe(":"+p.config.Port, p.router)
}

