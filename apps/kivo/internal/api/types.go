package api

import "time"

type Config struct {
	Version                  string
	Port                     string
	CORSOrigins              string
	StellarNetwork           string
	StellarHorizonURL        string
	X402PlatformKey          string
	USDCIssuer               string
	EtherfuseMode            string
	EtherfuseBaseURL         string
	EtherfuseAPIKey          string
	EtherfuseWebhookURL      string
	EtherfuseWebhookSecret   string
	EtherfuseWebhookVerify   bool
	EtherfuseDefaultFiat     string
	EtherfuseAllowedAssets   string
}

type APIHealth string

const (
	HealthOK       APIHealth = "ok"
	HealthDegraded APIHealth = "degraded"
	HealthDown     APIHealth = "down"
)

type SystemHealth struct {
	API     APIHealth `json:"api"`
	DB      APIHealth `json:"db"`
	Redis   APIHealth `json:"redis"`
	Stellar APIHealth `json:"stellar"`
	MCP     APIHealth `json:"mcp"`
	Version string    `json:"version"`
}

type AssetBalance struct {
	AssetCode string `json:"assetCode"`
	Amount    string `json:"amount"`
}

type Device struct {
	ID               string            `json:"id"`
	Name             string            `json:"name"`
	OwnerID          string            `json:"ownerId"`
	APIKeyPreview    string            `json:"apiKeyPreview"`
	StellarPublicKey string            `json:"stellarPublicKey"`
	Status           string            `json:"status"`
	Metadata         map[string]string `json:"metadata"`
	Balances         []AssetBalance    `json:"balances"`
	CreatedAt        string            `json:"createdAt"`
	UpdatedAt        string            `json:"updatedAt"`
}

type RegisterDeviceInput struct {
	Name     string            `json:"name"`
	Metadata map[string]string `json:"metadata"`
}

type DeviceRegistrationResult struct {
	Device Device `json:"device"`
	APIKey string `json:"apiKey,omitempty"`
}

type PaymentEvent struct {
	ID          string `json:"id"`
	Label       string `json:"label"`
	Description string `json:"description"`
	Status      string `json:"status"`
	CreatedAt   string `json:"createdAt"`
}

type Payment struct {
	ID             string         `json:"id"`
	FromDeviceID   string         `json:"fromDeviceId"`
	ToDeviceID     string         `json:"toDeviceId"`
	Amount         string         `json:"amount"`
	AssetCode      string         `json:"assetCode"`
	AssetIssuer    string         `json:"assetIssuer,omitempty"`
	ConditionType  string         `json:"conditionType"`
	ConditionValue string         `json:"conditionValue,omitempty"`
	Status         string         `json:"status"`
	StellarHash    string         `json:"stellarHash,omitempty"`
	StellarLedger  int64          `json:"stellarLedger,omitempty"`
	Memo           string         `json:"memo,omitempty"`
	TimeoutAt      string         `json:"timeoutAt,omitempty"`
	CreatedAt      string         `json:"createdAt"`
	ConfirmedAt    string         `json:"confirmedAt,omitempty"`
	FailedReason   string         `json:"failedReason,omitempty"`
	FeeCharged     string         `json:"feeCharged,omitempty"`
	Events         []PaymentEvent `json:"events"`
}

type CreatePaymentInput struct {
	FromDeviceID    string `json:"fromDeviceId"`
	ToDeviceID      string `json:"toDeviceId"`
	Amount          string `json:"amount"`
	AssetCode       string `json:"assetCode"`
	ConditionType   string `json:"conditionType"`
	ConditionValue  string `json:"conditionValue"`
	TimeoutSeconds  int    `json:"timeoutSeconds"`
	Memo            string `json:"memo"`
}

type PaymentCondition struct {
	ID            string         `json:"id"`
	PaymentID     string         `json:"paymentId"`
	ConditionKey  string         `json:"conditionKey"`
	ExpectedValue string         `json:"expectedValue"`
	ActualValue   string         `json:"actualValue,omitempty"`
	ProofData     map[string]any `json:"proofData"`
	MetAt         string         `json:"metAt,omitempty"`
	CreatedAt     string         `json:"createdAt"`
}

type ConditionProofInput struct {
	ConditionKey string         `json:"conditionKey"`
	ActualValue  string         `json:"actualValue"`
	ProofData    map[string]any `json:"proofData"`
}

type ConditionProofResult struct {
	ConditionMet bool             `json:"conditionMet"`
	Payment      Payment          `json:"payment"`
	Condition    PaymentCondition `json:"condition"`
}

type DashboardSummary struct {
	TotalDevices      int          `json:"totalDevices"`
	ActiveDevices     int          `json:"activeDevices"`
	TotalVolumeUSDC   float64      `json:"totalVolumeUsdc"`
	ConfirmedPayments int          `json:"confirmedPayments"`
	PendingPayments   int          `json:"pendingPayments"`
	FailedPayments    int          `json:"failedPayments"`
	Health            SystemHealth `json:"health"`
}

type X402Challenge struct {
	Status         int    `json:"status"`
	Resource       string `json:"resource"`
	Scheme         string `json:"scheme"`
	Network        string `json:"network"`
	PayTo          string `json:"payTo"`
	Amount         string `json:"amount"`
	Asset          string `json:"asset"`
	MaxTimeout     int    `json:"maxTimeout"`
	Nonce          string `json:"nonce"`
	RequiredHeader string `json:"requiredHeader"`
	CreatedAt      string `json:"createdAt,omitempty"`
}

type X402PaidResponse struct {
	Status        int            `json:"status"`
	PaymentHeader string         `json:"paymentHeader"`
	Data          map[string]any `json:"data"`
}

type X402PricingRule struct {
	ID          string `json:"id"`
	Resource    string `json:"resource"`
	Amount      string `json:"amount"`
	Asset       string `json:"asset"`
	MaxTimeout  int    `json:"maxTimeout"`
	Enabled     bool   `json:"enabled"`
	Description string `json:"description,omitempty"`
	UpdatedAt   string `json:"updatedAt"`
}

type Webhook struct {
	ID                 string   `json:"id"`
	URL                string   `json:"url"`
	Events             []string `json:"events"`
	SecretPreview      string   `json:"secretPreview"`
	Active             bool     `json:"active"`
	CreatedAt          string   `json:"createdAt"`
	DeliveryCount      int      `json:"deliveryCount"`
	LastDeliveryStatus string   `json:"lastDeliveryStatus"`
}

type WebhookDelivery struct {
	ID           string         `json:"id"`
	WebhookID    string         `json:"webhookId"`
	PaymentID    string         `json:"paymentId,omitempty"`
	Event        string         `json:"event"`
	Payload      map[string]any `json:"payload"`
	Status       string         `json:"status"`
	Attempts     int            `json:"attempts"`
	ResponseCode int            `json:"responseCode,omitempty"`
	NextRetryAt  string         `json:"nextRetryAt,omitempty"`
	DeliveredAt  string         `json:"deliveredAt,omitempty"`
	CreatedAt    string         `json:"createdAt"`
}

type APIKey struct {
	ID         string   `json:"id"`
	Name       string   `json:"name"`
	KeyPreview string   `json:"keyPreview"`
	Scopes     []string `json:"scopes"`
	Status     string   `json:"status"`
	LastUsedAt string   `json:"lastUsedAt,omitempty"`
	ExpiresAt  string   `json:"expiresAt,omitempty"`
	CreatedAt  string   `json:"createdAt"`
}

type Workflow struct {
	ID        string         `json:"id"`
	Name      string         `json:"name"`
	Type      string         `json:"type"`
	Status    string         `json:"status"`
	Engine    string         `json:"engine"`
	Trigger   string         `json:"trigger"`
	Steps     []WorkflowStep `json:"steps"`
	CreatedAt string         `json:"createdAt"`
	UpdatedAt string         `json:"updatedAt"`
}

type WorkflowStep struct {
	ID          string `json:"id"`
	Label       string `json:"label"`
	Status      string `json:"status"`
	Description string `json:"description"`
}

type DeployCheck struct {
	ID          string `json:"id"`
	Label       string `json:"label"`
	Scope       string `json:"scope"`
	Status      string `json:"status"`
	Description string `json:"description"`
	Owner       string `json:"owner"`
	Value       string `json:"value,omitempty"`
}

type DeployServiceStatus struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Environment string `json:"environment"`
	Status      string `json:"status"`
	Region      string `json:"region,omitempty"`
	URL         string `json:"url,omitempty"`
	Description string `json:"description"`
	UpdatedAt   string `json:"updatedAt"`
}

func nowISO() string {
	return time.Now().UTC().Format(time.RFC3339)
}
