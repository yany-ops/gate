package middleware

import (
	"fmt"
	"net/http"

	"github.com/YanyChoi/gate/internal/proxy/models"
	"gorm.io/gorm"
)

type RBACMiddleware struct {
	db *gorm.DB
}

func NewRBACMiddleware(db *gorm.DB) *RBACMiddleware {
	return &RBACMiddleware{db: db}
}

func (m *RBACMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get user from context (set by auth middleware)
		user, ok := r.Context().Value("user").(*models.User)
		if !ok {
			http.Error(w, "Unauthorized: user not found in context", http.StatusUnauthorized)
			return
		}

		// Check if user has permission for this K8s API request
		allowed, err := user.CheckK8sPermission(m.db, r.Method, r.URL.Path)
		if err != nil {
			http.Error(w, "Error checking permissions", http.StatusInternalServerError)
			return
		}

		if !allowed {
			http.Error(w, fmt.Sprintf("Forbidden: no permission to %s %s", 
				r.Method, r.URL.Path), http.StatusForbidden)
			return
		}

		next.ServeHTTP(w, r)
	})
}

