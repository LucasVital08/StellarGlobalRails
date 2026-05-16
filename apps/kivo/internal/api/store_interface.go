package api

import (
	"context"
	"fmt"
)

type KivoStore interface {
	Close()
	Health(Config) SystemHealth
	Dashboard(Config) DashboardSummary
	ListDevices() []Device
	CreateDevice(RegisterDeviceInput) DeviceRegistrationResult
	GetDevice(string) (Device, bool)
	UpdateDeviceStatus(string, string) (Device, bool)
	ListPayments() []Payment
	CreatePayment(CreatePaymentInput) (Payment, error)
	GetPayment(string) (Payment, bool)
	ExecutePayment(string, StellarSettlement) (Payment, bool)
	SubmitCondition(string, ConditionProofInput) (ConditionProofResult, bool)
	ListX402PricingRules() []X402PricingRule
	UpsertX402PricingRule(X402PricingRule) X402PricingRule
	CreateX402Challenge(string, Config) X402Challenge
	GetX402Challenge(string) (X402Challenge, bool)
	ConsumeX402Nonce(string) (X402Challenge, bool)
	ListWebhooks() []Webhook
	CreateWebhook(string, []string) (Webhook, string)
	ToggleWebhook(string, bool) (Webhook, bool)
	DeleteWebhook(string) bool
	TestWebhook(string) (WebhookTestResult, bool)
	ListWebhookDeliveries(string) []WebhookDelivery
	ListAPIKeys() []APIKey
	CreateAPIKey(string, []string, string) (APIKey, string)
	RevokeAPIKey(string) (APIKey, bool)
	AuthenticateAPIKey(string) bool
	RecordEtherfuseWebhook(map[string]any)
}

func NewStoreFromConfig(ctx context.Context, cfg Config) (KivoStore, error) {
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required in zero-mock mode")
	}
	if cfg.SecretEncryptionKey == "" {
		return nil, fmt.Errorf("KIVO_SECRET_ENCRYPTION_KEY is required in zero-mock mode")
	}
	return NewPostgresStore(ctx, cfg)
}
