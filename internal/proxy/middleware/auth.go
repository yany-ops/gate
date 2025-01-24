package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"

	"github.com/YanyChoi/gate/internal/proxy/models"
	authServer "github.com/YanyChoi/gate/pkg/auth/server"
)

type AuthMiddleware struct {
	db        *gorm.DB
	jwtSecret []byte
}

func NewAuthMiddleware(db *gorm.DB, jwtSecret []byte) *AuthMiddleware {
	return &AuthMiddleware{
		db:        db,
		jwtSecret: jwtSecret,
	}
}

func (m *AuthMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header required", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		// Parse and validate token
		token, err := jwt.ParseWithClaims(tokenString, &authServer.Claims{}, func(token *jwt.Token) (interface{}, error) {
			return m.jwtSecret, nil
		})

		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(*authServer.Claims)
		if !ok || !token.Valid {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Get user from database
		var user models.User
		if err := m.db.Where("email = ?", claims.Email).First(&user).Error; err != nil {
			http.Error(w, "User not found", http.StatusUnauthorized)
			return
		}

		// Add user to request context
		ctx := context.WithValue(r.Context(), "user", &user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
