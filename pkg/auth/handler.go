package auth

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/YanyChoi/gate/internal/proxy/models"
	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/golang-jwt/jwt/v5"
	"gorm.io/gorm"
)

type AuthHandler struct {
	db           *gorm.DB
	config       *Config
	verifier     *oidc.IDTokenVerifier
	jwtSecret    []byte
}

func NewAuthHandler(db *gorm.DB, config *Config) (*AuthHandler, error) {
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
	var claims Claims
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
	claims := Claims{
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

type DeviceCodeResponse struct {
	DeviceCode              string `json:"device_code"`
	UserCode               string `json:"user_code"`
	VerificationURI        string `json:"verification_uri"`
	VerificationURIComplete string `json:"verification_uri_complete"`
	ExpiresIn             int    `json:"expires_in"`
	Interval              int    `json:"interval"`
}

func (a *AuthHandler) DeviceCodeHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Validate client ID
	clientID := r.FormValue("client_id")
	if clientID != "gate-cli" { // Add proper client validation
		http.Error(w, "Invalid client_id", http.StatusBadRequest)
		return
	}

	// Generate device code and user code
	deviceCode := generateRandomString(40)
	userCode := generateRandomString(8)

	// Store the device code in your database or cache
	// You'll need to implement this based on your storage solution
	if err := a.storeDeviceCode(deviceCode, userCode); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := DeviceCodeResponse{
		DeviceCode:              deviceCode,
		UserCode:               userCode,
		VerificationURI:        "http://localhost:8080/auth/device", // Adjust URL
		VerificationURIComplete: fmt.Sprintf("http://localhost:8080/auth/device?code=%s", userCode),
		ExpiresIn:             1800, // 30 minutes
		Interval:              5,    // 5 seconds between polling
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (a *AuthHandler) DeviceTokenHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	deviceCode := r.FormValue("device_code")
	if deviceCode == "" {
		http.Error(w, "device_code is required", http.StatusBadRequest)
		return
	}

	// Check if device code is authorized
	// You'll need to implement this based on your storage solution
	authorized, user, err := a.checkDeviceCodeAuthorization(deviceCode)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if !authorized {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{
			"error": "authorization_pending",
		})
		return
	}

	// Generate token
	token, err := a.generateJWT(*user)
	if err != nil {
		http.Error(w, "Failed to generate token", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"access_token": token,
		"token_type":   "Bearer",
		"expires_in":   "86400", // 24 hours
	})
}

// Helper functions (implement these based on your needs)
func generateRandomString(length int) string {
	// Implement secure random string generation
	return "random-string" // Replace with actual implementation
}

func (a *AuthHandler) storeDeviceCode(deviceCode, userCode string) error {
	// Implement storage of device code
	return nil
}

func (a *AuthHandler) checkDeviceCodeAuthorization(deviceCode string) (bool, *models.User, error) {
	// Implement checking if device code is authorized
	return false, nil, nil
}
