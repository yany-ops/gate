package handler

import (
	"net/http"
	"net/url"

	"github.com/YanyChoi/gate/internal/agent/config"
	"github.com/go-chi/chi/v5"
)

type Handler struct {
	apiServerURL *url.URL
	proxy *ProxyHandler
}

func New(config *config.Config) (*Handler, error) {
	targetURL, err := url.Parse(config.ApiServerURL)
	if err != nil {
		return nil, err
	}

	proxy, err := NewProxyHandler(config.ApiServerURL)
	if err != nil {
		return nil, err
	}

	return &Handler{
		apiServerURL: targetURL,
		proxy:       proxy,
	}, nil
}

func (h *Handler) SetRoutes(server *chi.Mux) {
	server.HandleFunc("/api/*", h.proxy.ServeHTTP)
	server.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})
}
