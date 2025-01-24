package handler

import (
	"net/http"
	"net/url"

	"github.com/YanyChoi/gate/internal/proxy/config"
	"github.com/YanyChoi/gate/pkg/db"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	apiServerURL *url.URL
	proxy        *ProxyHandler
	auth        *AuthHandler
}

func New(config *config.Config, db *db.DB) (*Handler, error) {
	targetURL, err := url.Parse(config.ApiServerURL)
	if err != nil {
		return nil, err
	}

	proxy, err := NewProxyHandler(config.ApiServerURL, db)
	if err != nil {
		return nil, err
	}

	auth, err := NewAuthHandler(db.GetDB(), config.Auth)
	if err != nil {
		return nil, err
	}

	return &Handler{
		apiServerURL: targetURL,
		proxy:       proxy,
		auth: auth,
	}, nil
}

func (h *Handler) SetRoutes(server *chi.Mux) {
	server.HandleFunc("/api/*", h.proxy.ProxyK8sRequest)
	server.Route("/auth", func(r chi.Router) {
		r.Get("/login", h.auth.LoginHandler)
		r.Get("/callback", h.auth.CallbackHandler)
	})
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})
}
