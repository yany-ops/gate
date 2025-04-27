package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/spf13/cobra"
	"github.com/yany-ops/gate/internal/flag"
	"github.com/yany-ops/gate/internal/handler"
	"go.uber.org/zap"
)

func main() {
	zap.ReplaceGlobals(zap.Must(zap.NewProduction()))

	fs := flag.NewFlagSet()

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	rootCmd := &cobra.Command{
		Use: "gate",
		Run: func(cmd *cobra.Command, args []string) {
			setHandlers(r)
			zap.L().Info(fmt.Sprintf("Starting proxy server on %s", flag.Cfg.ListenAddr))
			http.ListenAndServe(flag.Cfg.ListenAddr, r)
		},
	}
	rootCmd.Flags().AddFlagSet(fs)
	rootCmd.Execute()
}

func setHandlers(r *chi.Mux) {
	handler.SetHandlers(r)
}
