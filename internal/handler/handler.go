package handler

import (
	"crypto/tls"
	"crypto/x509"
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/go-chi/chi/v5"
	"github.com/yany-ops/gate/internal/flag"
)

func SetHandlers(r *chi.Mux) {
	r.Get("/api", http.HandlerFunc(proxyApiServerHandler))
	r.Get("/api/*", http.HandlerFunc(proxyApiServerHandler))
	r.Post("/api/*", http.HandlerFunc(proxyApiServerHandler))
	r.Patch("/api/*", http.HandlerFunc(proxyApiServerHandler))
	r.Delete("/api/*", http.HandlerFunc(proxyApiServerHandler))
	r.Get("/apis", http.HandlerFunc(proxyApiServerHandler))
	r.Get("/apis/*", http.HandlerFunc(proxyApiServerHandler))
	r.Post("/apis/*", http.HandlerFunc(proxyApiServerHandler))
	r.Patch("/apis/*", http.HandlerFunc(proxyApiServerHandler))
	r.Delete("/apis/*", http.HandlerFunc(proxyApiServerHandler))
	r.Get("/openapi/v2", http.HandlerFunc(proxyApiServerHandler))
	r.Get("/version", http.HandlerFunc(proxyApiServerHandler))
}

func proxyApiServerHandler(w http.ResponseWriter, r *http.Request) {
	if flag.Cfg.Token == "serviceaccount" {
		host := os.Getenv("KUBERNETES_SERVICE_HOST")
		port := os.Getenv("KUBERNETES_SERVICE_PORT")
		credentialPath := "/var/run/secrets/kubernetes.io/serviceaccount"
		tokenPath := filepath.Join(credentialPath, "token")
		caPath := filepath.Join(credentialPath, "ca.crt")

		// Read the service account token
		token, err := os.ReadFile(tokenPath)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Failed to read token: " + err.Error()))
			return
		}

		// Read the CA certificate
		caCert, err := os.ReadFile(caPath)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Failed to read CA cert: " + err.Error()))
			return
		}

		// Create a CA certificate pool and add the CA cert
		caCertPool := x509.NewCertPool()
		if !caCertPool.AppendCertsFromPEM(caCert) {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Failed to append CA cert"))
			return
		}

		// Create a custom HTTP client with TLS config
		client := &http.Client{
			Transport: &http.Transport{
				TLSClientConfig: &tls.Config{
					RootCAs: caCertPool,
				},
			},
		}

		// Create the request with the Bearer token
		url := "https://" + host + ":" + port + r.URL.Path
		req, err := http.NewRequest(r.Method, url, r.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Failed to create request: " + err.Error()))
			return
		}
		req.Header.Set("Authorization", "Bearer "+string(token))

		// Set the Content-Type header
		req.Header.Set("Content-Type", "application/json")
		if contentType := r.Header.Get("Content-Type"); contentType != "" {
			req.Header.Set("Content-Type", contentType)
		}

		resp, err := client.Do(req)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Request failed: " + err.Error()))
			return
		}
		defer resp.Body.Close()
		body, err := io.ReadAll(resp.Body)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			w.Write([]byte("Failed to read response: " + err.Error()))
			return
		}
		w.Header().Set("Content-Type", resp.Header.Get("Content-Type"))
		w.WriteHeader(resp.StatusCode)
		w.Write(body)
	} else {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
	}
}
