package handler

import (
	"io"
	"net/http"
	"net/url"

	"github.com/YanyChoi/gate/pkg/db"
)

type ProxyHandler struct {
	apiServerURL *url.URL
	db           *db.DB
}

func NewProxyHandler(apiServerURL string, db *db.DB) (*ProxyHandler, error) {
	targetURL, err := url.Parse(apiServerURL)
	if err != nil {
		return nil, err
	}

	return &ProxyHandler{apiServerURL: targetURL, db: db}, nil
}

func (h *ProxyHandler) ProxyK8sRequest(w http.ResponseWriter, r *http.Request) {
	// Create new request to target URL
	targetURL := *h.apiServerURL
	targetURL.Path = r.URL.Path
	targetURL.RawQuery = r.URL.RawQuery

	proxyReq, err := http.NewRequest(r.Method, targetURL.String(), r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// Copy headers
	for key, values := range r.Header {
		for _, value := range values {
			proxyReq.Header.Add(key, value)
		}
	}

	// Send request
	client := &http.Client{}
	resp, err := client.Do(proxyReq)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	defer resp.Body.Close()

	// Copy response headers
	for key, values := range resp.Header {
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}

	// Copy status code
	w.WriteHeader(resp.StatusCode)

	// Copy response body
	io.Copy(w, resp.Body)
}
