package main

import (
	"github.com/YanyChoi/gate/internal/proxy/config"
	"github.com/YanyChoi/gate/internal/proxy"
	"github.com/YanyChoi/gate/pkg/db"
)

func main() {
	config := config.New()
	db := db.New(config.DB.GetDSN())
	db.Migrate()
	proxy := proxy.New(db)
	proxy.Start()
}

