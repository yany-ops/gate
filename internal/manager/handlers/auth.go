package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/yany-ops/gate/internal/manager/auth"
	"github.com/yany-ops/gate/internal/manager/config"
	"github.com/yany-ops/gate/internal/manager/db"
	"github.com/yany-ops/gate/internal/manager/models"
	"github.com/yany-ops/gate/internal/repository"
	"go.uber.org/zap"
)

/*
| Endpoint                      | Method   | Description                                   |
| ----------------------------- | -------- | --------------------------------------------- |
| `/auth/login`                 | GET      | Starts the OIDC login flow                    |
| `/auth/callback`              | GET      | Handles the redirect from the OIDC provider   |
| `/auth/logout`                | POST/GET | Logs the user out                             |
| `/auth/userinfo` *(optional)* | GET      | Returns info about the current logged-in user |

*/

type AuthHandlers struct {
	config         *config.Config
	logger         *zap.Logger
	auth           *auth.Auth
	userRepository *repository.UserRepository
}

func authHandlers(config *config.Config, auth *auth.Auth, db *db.DB, logger *zap.Logger) *AuthHandlers {
	return &AuthHandlers{config: config, auth: auth, userRepository: repository.NewUserRepository(db.DB), logger: logger}
}

func (h *AuthHandlers) SetupRouter() *chi.Mux {
	router := chi.NewRouter()
	router.Get("/login", h.loginHandler)
	router.Get("/callback", h.callbackHandler)
	router.Get("/logout", h.logoutHandler)
	router.Get("/userinfo", h.userinfoHandler)
	return router
}

func (h *AuthHandlers) loginHandler(w http.ResponseWriter, r *http.Request) {
	state := uuid.New().String()
	http.SetCookie(w, &http.Cookie{
		Name:     "oidc_state",
		Value:    state,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // use true in production
		MaxAge:   300,
	})

	url := h.auth.GetAuthCodeURL(state)
	http.Redirect(w, r, url, http.StatusFound)
}

func (h *AuthHandlers) callbackHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	stateCookie, err := r.Cookie("oidc_state")
	if err != nil || r.URL.Query().Get("state") != stateCookie.Value {
		http.Error(w, "Invalid state", http.StatusBadRequest)
		return
	}

	token, err := h.auth.Exchange(ctx, r.URL.Query().Get("code"))
	if err != nil {
		http.Error(w, "Token exchange failed", http.StatusInternalServerError)
		return
	}

	rawIDToken, ok := token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "No id_token in token response", http.StatusInternalServerError)
		return
	}

	// Set the token in a secure cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "id_token",
		Value:    rawIDToken,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // set to true in production
		MaxAge:   int(time.Hour.Seconds()),
	})

	claims, err := h.auth.GetUserFromToken(ctx, &http.Cookie{
		Name:  "id_token",
		Value: rawIDToken,
	})
	if err != nil {
		http.Error(w, "Failed to get user from token", http.StatusInternalServerError)
		return
	}

	// create user if not exists
	if _, err := h.userRepository.GetUserByEmail(claims.Email); err != nil {
		if err := h.userRepository.CreateUser(&models.User{
			Email:       claims.Email,
			DisplayName: claims.Name,
		}); err != nil {
			h.logger.Error("Failed to create user", zap.Error(err))
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}
	}

	http.Redirect(w, r, "/auth/userinfo", http.StatusFound)
}

func (h *AuthHandlers) userinfoHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	cookie, err := r.Cookie("id_token")
	if err != nil {
		http.Error(w, "Not logged in", http.StatusUnauthorized)
		return
	}

	idToken, err := h.auth.Verify(ctx, cookie.Value)
	if err != nil {
		http.Error(w, "Invalid ID token", http.StatusUnauthorized)
		return
	}

	var claims struct {
		Email string `json:"email"`
		Name  string `json:"name"`
	}
	if err := idToken.Claims(&claims); err != nil {
		http.Error(w, "Failed to decode claims", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(claims)
}

func (h *AuthHandlers) logoutHandler(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "id_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
		Secure:   false,
	})
	h.logger.Info("Logged out")
}
