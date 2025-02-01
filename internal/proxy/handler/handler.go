package handler

import (
	"net/http"
	"net/url"

	"github.com/YanyChoi/gate/internal/proxy/config"
	"github.com/YanyChoi/gate/pkg/db"
	"github.com/go-chi/chi/v5"

	"github.com/YanyChoi/gate/internal/proxy/middleware"
)

type Handler struct {
	apiServerURL *url.URL
	config *config.Config
}

func New(config *config.Config, db *db.DB) (*Handler, error) {
	targetURL, err := url.Parse(config.ApiServerURL)
	if err != nil {
		return nil, err
	}

	return &Handler{
		apiServerURL: targetURL,
		config: config,
	}, nil
}

func (h *Handler) SetRoutes(server *chi.Mux, db *db.DB) error {
	router := chi.NewRouter()
	

	proxy, err := NewProxyHandler(h.apiServerURL.String(), db)
	if err != nil {
		return err
	}

	auth, err := NewAuthHandler(db.GetDB(), h.config.Auth)
	if err != nil {
		return err
	}
	// Auth middleware first
	authMiddleware := middleware.NewAuthMiddleware(db.GetDB(), h.config.Auth)
	router.Use(authMiddleware.Middleware)
	
	// RBAC middleware second
	rbacMiddleware := middleware.NewRBACMiddleware(db.GetDB())
	router.Use(rbacMiddleware.Middleware)
	
	router.HandleFunc("/api/*", proxy.ProxyK8sRequest)
	router.Route("/auth", func(r chi.Router) {
		r.Get("/login", auth.LoginHandler)
		r.Get("/callback", auth.CallbackHandler)
	})
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello, World!"))
	})

	server.Mount("/", router)
	return nil
}
