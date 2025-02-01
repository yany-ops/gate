package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/YanyChoi/gate/internal/proxy/models"
	"github.com/YanyChoi/gate/pkg/auth"
	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db           *gorm.DB
	config       *auth.Config
	verifier     *oidc.IDTokenVerifier
	jwtSecret    []byte
}

func NewAuthHandler(db *gorm.DB, config *auth.Config) (*AuthHandler, error) {
	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, config.Oauth.Endpoint.AuthURL)
	if err != nil {
		return nil, err
	}

	return &AuthHandler{
		db:        db,
		config:    config,
		verifier:  provider.Verifier(&oidc.Config{ClientID: config.Oauth.ClientID}),
		jwtSecret: []byte(config.SingingKey),
	}, nil
}


func (a *AuthHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	state := a.config.OauthState
	http.Redirect(w, r, a.config.Oauth.AuthCodeURL(state), http.StatusFound)
}

func (a *AuthHandler) CallbackHandler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	
	// Exchange code for token
	oauth2Token, err := a.config.Oauth.Exchange(ctx, r.URL.Query().Get("code"))
	if err != nil {
		http.Error(w, "Failed to exchange token", http.StatusInternalServerError)
		return
	}

	// Extract the ID Token
	rawIDToken, ok := oauth2Token.Extra("id_token").(string)
	if !ok {
		http.Error(w, "No id_token in token response", http.StatusInternalServerError)
		return
	}

	// Verify the ID Token
	idToken, err := a.verifier.Verify(ctx, rawIDToken)
	if err != nil {
		http.Error(w, "Failed to verify ID Token", http.StatusInternalServerError)
		return
	}

	// Get user info
	var claims auth.Claims
	if err := idToken.Claims(&claims); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Create or update user in database
	var user models.User
	result := a.db.Where("email = ?", claims.Email).First(&user)
	if result.Error == gorm.ErrRecordNotFound {
		user = models.User{
			Name:  claims.Name,
			Email: claims.Email,
		}
		if err := a.db.Create(&user).Error; err != nil {
			http.Error(w, "Failed to create user", http.StatusInternalServerError)
			return
		}
	}

	// Generate JWT
	token, err := a.generateJWT(user)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	// Return JWT to client
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": token,
	})
}

func (a *AuthHandler) generateJWT(user models.User) (string, error) {
	claims := auth.Claims{
		Email: user.Email,
		Name:  user.Name,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(a.jwtSecret)
}
