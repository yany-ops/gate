package middleware

import (
	"net/http"
	"time"

	"go.uber.org/zap"
)

func RequestLogger(logger *zap.Logger) func(next http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			logger.Info("accesslog", zap.String("timestamp", time.Now().Format(time.RFC3339)), zap.String("method", r.Method), zap.String("host", r.Host), zap.String("remote_addr", r.RemoteAddr), zap.String("path", r.URL.Path), zap.String("user_agent", r.UserAgent()))
			next.ServeHTTP(w, r)
		}
		return http.HandlerFunc(fn)
	}
}
