package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"golang.org/x/oauth2"
)

const (
	deviceCodeEndpoint = "http://localhost:8080/auth/device/code"    // Adjust URL as needed
	tokenEndpoint      = "http://localhost:8080/auth/device/token"   // Adjust URL as needed
	clientID          = "gate-cli"                                   // Your CLI client ID
)

type DeviceCodeResponse struct {
	DeviceCode              string `json:"device_code"`
	UserCode               string `json:"user_code"`
	VerificationURI        string `json:"verification_uri"`
	VerificationURIComplete string `json:"verification_uri_complete"`
	ExpiresIn             int    `json:"expires_in"`
	Interval              int    `json:"interval"`
}

func main() {
	// Request device code
	deviceCode, err := requestDeviceCode()
	if err != nil {
		fmt.Printf("Error requesting device code: %v\n", err)
		os.Exit(1)
	}

	// Display instructions to user
	fmt.Printf("\nPlease visit: %s\n", deviceCode.VerificationURI)
	fmt.Printf("And enter code: %s\n\n", deviceCode.UserCode)
	fmt.Println("Waiting for device authorization...")

	// Poll for token
	token, err := pollForToken(deviceCode)
	if err != nil {
		fmt.Printf("Error getting token: %v\n", err)
		os.Exit(1)
	}

	// Save token to config file
	err = saveToken(token)
	if err != nil {
		fmt.Printf("Error saving token: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Successfully authenticated!")
}

func requestDeviceCode() (*DeviceCodeResponse, error) {
	resp, err := http.PostForm(deviceCodeEndpoint, map[string][]string{
		"client_id": {clientID},
		"scope":     {"openid profile email"},
	})
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("device code request failed with status: %d", resp.StatusCode)
	}

	var deviceCode DeviceCodeResponse
	if err := json.NewDecoder(resp.Body).Decode(&deviceCode); err != nil {
		return nil, err
	}

	return &deviceCode, nil
}

func pollForToken(deviceCode *DeviceCodeResponse) (*oauth2.Token, error) {
	interval := time.Duration(deviceCode.Interval) * time.Second
	expiresAt := time.Now().Add(time.Duration(deviceCode.ExpiresIn) * time.Second)

	for time.Now().Before(expiresAt) {
		token, err := requestToken(deviceCode.DeviceCode)
		if err == nil {
			return token, nil
		}

		// If error is not "authorization_pending", return the error
		if err.Error() != "authorization_pending" {
			return nil, err
		}

		time.Sleep(interval)
	}

	return nil, fmt.Errorf("device code expired")
}

func requestToken(deviceCode string) (*oauth2.Token, error) {
	resp, err := http.PostForm(tokenEndpoint, map[string][]string{
		"grant_type":  {"urn:ietf:params:oauth:grant-type:device_code"},
		"device_code": {deviceCode},
		"client_id":   {clientID},
	})
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusBadRequest {
		var errorResponse struct {
			Error string `json:"error"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&errorResponse); err != nil {
			return nil, err
		}
		return nil, fmt.Errorf("token request failed with error: %s", errorResponse.Error)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("token request failed with status: %d", resp.StatusCode)
	}

	var token oauth2.Token
	if err := json.NewDecoder(resp.Body).Decode(&token); err != nil {
		return nil, err
	}

	return &token, nil
}

func saveToken(token *oauth2.Token) error {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return err
	}

	configDir := fmt.Sprintf("%s/.gate", homeDir)
	if err := os.MkdirAll(configDir, 0700); err != nil {
		return err
	}

	tokenFile := fmt.Sprintf("%s/token.json", configDir)
	file, err := os.OpenFile(tokenFile, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		return err
	}
	defer file.Close()

	return json.NewEncoder(file).Encode(token)
}
