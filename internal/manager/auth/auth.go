package auth

import (
	"context"
	"errors"
	"net/http"

	"github.com/coreos/go-oidc/v3/oidc"
	"github.com/yany-ops/gate/internal/manager/config"
	"go.uber.org/zap"
	"golang.org/x/oauth2"
)

type Auth struct {
	provider     *oidc.Provider
	verifier     *oidc.IDTokenVerifier
	oauth2Config *oauth2.Config
}

func NewAuth(config *config.Config, logger *zap.Logger) (*Auth, error) {
	provider, err := oidc.NewProvider(context.Background(), config.OIDC.IssuerURL)
	if err != nil {
		return nil, err
	}
	verifier := provider.Verifier(&oidc.Config{ClientID: config.OIDC.ClientID})
	oauth2Config := &oauth2.Config{
		ClientID:     config.OIDC.ClientID,
		ClientSecret: config.OIDC.ClientSecret,
		RedirectURL:  config.OIDC.RedirectURL,
		Scopes:       []string{"openid", "profile", "email"},
		Endpoint:     provider.Endpoint(),
	}

	return &Auth{provider: provider, verifier: verifier, oauth2Config: oauth2Config}, nil
}

func (a *Auth) GetAuthCodeURL(state string) string {
	return a.oauth2Config.AuthCodeURL(state)
}

func (a *Auth) Exchange(ctx context.Context, code string) (*oauth2.Token, error) {
	return a.oauth2Config.Exchange(ctx, code)
}

func (a *Auth) Verify(ctx context.Context, token string) (*oidc.IDToken, error) {
	return a.verifier.Verify(ctx, token)
}

type UserClaims struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

func (a *Auth) GetUserFromToken(ctx context.Context, cookie *http.Cookie) (*UserClaims, error) {
	if cookie == nil {
		return nil, errors.New("id_token not found")
	}

	idToken, err := a.verifier.Verify(ctx, cookie.Value)
	if err != nil {
		return nil, err
	}

	var claims UserClaims
	if err := idToken.Claims(&claims); err != nil {
		return nil, err
	}
	return &claims, nil
}
