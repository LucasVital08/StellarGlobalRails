package main

import (
	"context"
	"log"
	"net/http"

	"github.com/stellar-global-rails/kivo/internal/api"
)

func main() {
	cfg := api.LoadConfig()
	store, err := api.NewStoreFromConfig(context.Background(), cfg)
	if err != nil {
		log.Fatal(err)
	}
	defer store.Close()

	server := api.NewServer(store, cfg)

	log.Printf("kivo api listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, server); err != nil {
		log.Fatal(err)
	}
}
