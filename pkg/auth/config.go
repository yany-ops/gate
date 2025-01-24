package auth

import "golang.org/x/oauth2"

type Config struct {
	Oauth *oauth2.Config
	OauthState string
	SingingKey string
	Domain string
}

