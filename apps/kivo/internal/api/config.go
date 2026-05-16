package api

import (
	"os"
	"strings"
)

func LoadConfig() Config {
	return Config{
		Version:                getenvFallback("KIVO_VERSION", "0.1.0-mvp"),
		Port:                   getenvFallback("PORT", "8080"),
		CORSOrigins:            getenvFallback("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://127.0.0.1:5174"),
		DatabaseURL:            getenvFallback("DATABASE_URL", ""),
		RedisURL:               getenvFallback("REDIS_URL", ""),
		SupabaseJWTSecret:      getenvFallback("SUPABASE_JWT_SECRET", ""),
		SecretEncryptionKey:    getenvFallback("KIVO_SECRET_ENCRYPTION_KEY", ""),
		RequireAuth:            getenvFallback("KIVO_REQUIRE_AUTH", "false") == "true",
		StellarNetwork:         getenvFallback("STELLAR_NETWORK", "testnet"),
		StellarHorizonURL:      getenvFallback("STELLAR_HORIZON_URL", "https://horizon-testnet.stellar.org"),
		X402PlatformKey:        getenvFallback("X402_PLATFORM_KEY", ""),
		USDCIssuer:             getenvFallback("USDC_ISSUER", "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"),
		EtherfuseMode:          getenvFallback("ETHERFUSE_MODE", "sandbox"),
		EtherfuseBaseURL:       strings.TrimRight(getenvFallback("ETHERFUSE_BASE_URL", "https://api.sand.etherfuse.com"), "/"),
		EtherfuseAPIKey:        getenvFallback("ETHERFUSE_API_KEY", ""),
		EtherfuseWebhookURL:    getenvFallback("ETHERFUSE_WEBHOOK_URL", ""),
		EtherfuseWebhookSecret: getenvFallback("ETHERFUSE_WEBHOOK_SECRET", ""),
		EtherfuseWebhookVerify: getenvFallback("ETHERFUSE_WEBHOOK_VERIFY", "true") == "true",
		EtherfuseDefaultFiat:   getenvFallback("ETHERFUSE_DEFAULT_FIAT", "MXN"),
		EtherfuseAllowedAssets: getenvFallback("ETHERFUSE_ALLOWED_ASSETS", "USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"),
	}
}

func getenvFallback(key string, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}
