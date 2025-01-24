package auth

import (
	"time"

	"context"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/oauth2"
	"gorm.io/gorm"

	"github.com/YanyChoi/gate/internal/proxy/models"
)

type AuthServer struct {
	db           *gorm.DB
	config       *oauth2.Config
	verifier     *oidc.IDTokenVerifier
	jwtSecret    []byte
}

type Claims struct {
	Email string `json:"email"`
	Name  string `json:"name"`
	jwt.RegisteredClaims
}

func NewAuthServer(db *gorm.DB, clientID, clientSecret, issuerURL string, jwtSecret []byte) (*AuthServer, error) {
	ctx := context.Background()
	provider, err := oidc.NewProvider(ctx, issuerURL)
	if err != nil {
		return nil, err
	}

	config := &oauth2.Config{
		ClientID:     clientID,
		ClientSecret: clientSecret,
		RedirectURL:  "http://localhost:8080/auth/callback", // Adjust as needed
		Endpoint:     provider.Endpoint(),
		Scopes:       []string{oidc.ScopeOpenID, "profile", "email"},
	}

	return &AuthServer{
		db:        db,
		config:    config,
		verifier:  provider.Verifier(&oidc.Config{ClientID: clientID}),
		jwtSecret: jwtSecret,
	}, nil
}

func (a *AuthServer) generateJWT(user models.User) (string, error) {
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
