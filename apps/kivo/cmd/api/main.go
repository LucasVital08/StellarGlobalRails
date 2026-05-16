package main

import (
	"log"
	"net/http"

	"github.com/stellar-global-rails/kivo/internal/api"
)

func main() {
	cfg := api.LoadConfig()
	server := api.NewServer(api.NewMemoryStore(), cfg)

	log.Printf("kivo api listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, server); err != nil {
		log.Fatal(err)
	}
}
