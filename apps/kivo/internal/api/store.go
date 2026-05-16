package api

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"sync"
	"time"
)

const ownerID = "usr_mvp_operator"

type MemoryStore struct {
	mu          sync.Mutex
	devices     []Device
	payments    []Payment
	conditions  []PaymentCondition
	webhooks    []Webhook
	deliveries  []WebhookDelivery
	apiKeys     []APIKey
	x402Rules   []X402PricingRule
	x402Nonces  map[string]X402Challenge
	webhookEvents []map[string]any
}

func NewMemoryStore() *MemoryStore {
	now := nowISO()
	store := &MemoryStore{
		x402Nonces: make(map[string]X402Challenge),
	}

	charger := Device{
		ID:               "dev_charger_sp",
		Name:             "EV Charger SP-01",
		OwnerID:          ownerID,
		APIKeyPreview:    "kivo_test...A12F",
		StellarPublicKey: "GCHARGERTEST00000000000000000000000000000000000000000000",
		Status:           "active",
		Metadata:         map[string]string{"location": "Sao Paulo, BR", "type": "charger"},
		Balances:         []AssetBalance{{AssetCode: "USDC", Amount: "25.0000000"}, {AssetCode: "XLM", Amount: "10.0000000"}},
		CreatedAt:        now,
		UpdatedAt:        now,
	}
	vehicle := Device{
		ID:               "dev_vehicle_01",
		Name:             "Vehicle Agent 01",
		OwnerID:          ownerID,
		APIKeyPreview:    "kivo_test...B33A",
		StellarPublicKey: "GVEHICLETEST00000000000000000000000000000000000000000000",
		Status:           "active",
		Metadata:         map[string]string{"location": "Sao Paulo, BR", "type": "vehicle"},
		Balances:         []AssetBalance{{AssetCode: "USDC", Amount: "8.5000000"}, {AssetCode: "XLM", Amount: "10.0000000"}},
		CreatedAt:        now,
		UpdatedAt:        now,
	}
	store.devices = []Device{charger, vehicle}
	store.payments = []Payment{{
		ID:            "pay_demo_x402",
		FromDeviceID:  vehicle.ID,
		ToDeviceID:    charger.ID,
		Amount:        "0.0500000",
		AssetCode:     "USDC",
		ConditionType: "none",
		Status:        "confirmed",
		StellarHash:   randomHash(),
		StellarLedger: 102030,
		Memo:          "x402 sensor unlock",
		CreatedAt:     now,
		ConfirmedAt:   now,
		FeeCharged:    "0.0000100",
		Events: []PaymentEvent{{
			ID:          newID("evt"),
			Label:       "Payment confirmed",
			Description: "MVP settlement recorded for the x402 demo path.",
			Status:      "done",
			CreatedAt:   now,
		}},
	}}
	store.x402Rules = []X402PricingRule{{
		ID:          "x402_premium_sensor",
		Resource:    "/api/x402/data",
		Amount:      "0.0500000",
		Asset:       "USDC:GATESTUSDCISSUER",
		MaxTimeout:  300,
		Enabled:     true,
		Description: "Premium IoT sensor reading.",
		UpdatedAt:   now,
	}}
	store.webhooks = []Webhook{{
		ID:                 "wh_demo",
		URL:                "https://ops.example.com/kivo/payments",
		Events:             []string{"payment.confirmed", "etherfuse.order_updated"},
		SecretPreview:      "whsec...DEMO",
		Active:             true,
		CreatedAt:          now,
		DeliveryCount:      1,
		LastDeliveryStatus: "delivered",
	}}
	store.apiKeys = []APIKey{{
		ID:         "key_demo",
		Name:       "MVP Operator Key",
		KeyPreview: "kivo_live...DEMO",
		Scopes:     []string{"devices:read", "payments:write", "x402:pay"},
		Status:     "active",
		CreatedAt:  now,
	}}
	return store
}

func (s *MemoryStore) Health(cfg Config) SystemHealth {
	db := HealthDegraded
	if strings.TrimSpace(getenvFallback("DATABASE_URL", "")) != "" {
		db = HealthOK
	}
	redis := HealthDegraded
	if strings.TrimSpace(getenvFallback("REDIS_URL", "")) != "" {
		redis = HealthOK
	}
	return SystemHealth{
		API:     HealthOK,
		DB:      db,
		Redis:   redis,
		Stellar: HealthOK,
		MCP:     HealthOK,
		Version: cfg.Version,
	}
}

func (s *MemoryStore) Dashboard(cfg Config) DashboardSummary {
	s.mu.Lock()
	defer s.mu.Unlock()

	var active, confirmed, pending, failed int
	var volume float64
	for _, device := range s.devices {
		if device.Status == "active" {
			active++
		}
	}
	for _, payment := range s.payments {
		switch payment.Status {
		case "confirmed":
			confirmed++
			if payment.AssetCode == "USDC" {
				amount, _ := strconv.ParseFloat(payment.Amount, 64)
				volume += amount
			}
		case "pending", "processing":
			pending++
		case "failed":
			failed++
		}
	}
	return DashboardSummary{
		TotalDevices:      len(s.devices),
		ActiveDevices:     active,
		TotalVolumeUSDC:   volume,
		ConfirmedPayments: confirmed,
		PendingPayments:   pending,
		FailedPayments:    failed,
		Health:            s.Health(cfg),
	}
}

func (s *MemoryStore) ListDevices() []Device {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]Device(nil), s.devices...)
}

func (s *MemoryStore) CreateDevice(input RegisterDeviceInput) DeviceRegistrationResult {
	s.mu.Lock()
	defer s.mu.Unlock()

	raw := "kivo_test_" + randomToken(28)
	now := nowISO()
	device := Device{
		ID:               newID("dev"),
		Name:             input.Name,
		OwnerID:          ownerID,
		APIKeyPreview:    previewSecret(raw),
		StellarPublicKey: randomStellarPublicKey(),
		Status:           "active",
		Metadata:         input.Metadata,
		Balances:         []AssetBalance{{AssetCode: "USDC", Amount: "0.0000000"}, {AssetCode: "XLM", Amount: "10.0000000"}},
		CreatedAt:        now,
		UpdatedAt:        now,
	}
	if device.Metadata == nil {
		device.Metadata = map[string]string{}
	}
	s.devices = append([]Device{device}, s.devices...)
	return DeviceRegistrationResult{Device: device, APIKey: raw}
}

func (s *MemoryStore) GetDevice(id string) (Device, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, device := range s.devices {
		if device.ID == id {
			return device, true
		}
	}
	return Device{}, false
}

func (s *MemoryStore) UpdateDeviceStatus(id string, status string) (Device, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.devices {
		if s.devices[index].ID == id {
			s.devices[index].Status = status
			s.devices[index].UpdatedAt = nowISO()
			return s.devices[index], true
		}
	}
	return Device{}, false
}

func (s *MemoryStore) ListPayments() []Payment {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]Payment(nil), s.payments...)
}

func (s *MemoryStore) CreatePayment(input CreatePaymentInput) (Payment, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if !s.deviceExistsLocked(input.FromDeviceID) || !s.deviceExistsLocked(input.ToDeviceID) {
		return Payment{}, fmt.Errorf("fromDeviceId and toDeviceId must reference existing devices")
	}
	now := nowISO()
	status := "pending"
	eventStatus := "waiting"
	desc := "Waiting for condition proof."
	if input.ConditionType == "" {
		input.ConditionType = "none"
	}
	if input.ConditionType == "none" {
		status = "processing"
		eventStatus = "current"
		desc = "Queued for MVP settlement worker."
	}
	payment := Payment{
		ID:             newID("pay"),
		FromDeviceID:   input.FromDeviceID,
		ToDeviceID:     input.ToDeviceID,
		Amount:         input.Amount,
		AssetCode:      input.AssetCode,
		ConditionType:  input.ConditionType,
		ConditionValue: input.ConditionValue,
		Status:         status,
		Memo:           input.Memo,
		CreatedAt:      now,
		Events: []PaymentEvent{{
			ID:          newID("evt"),
			Label:       "Payment created",
			Description: desc,
			Status:      eventStatus,
			CreatedAt:   now,
		}},
	}
	if input.TimeoutSeconds > 0 {
		payment.TimeoutAt = time.Now().UTC().Add(time.Duration(input.TimeoutSeconds) * time.Second).Format(time.RFC3339)
	}
	s.payments = append([]Payment{payment}, s.payments...)
	return payment, nil
}

func (s *MemoryStore) GetPayment(id string) (Payment, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, payment := range s.payments {
		if payment.ID == id {
			return payment, true
		}
	}
	return Payment{}, false
}

func (s *MemoryStore) ExecutePayment(id string) (Payment, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.payments {
		if s.payments[index].ID == id {
			now := nowISO()
			s.payments[index].Status = "confirmed"
			s.payments[index].ConfirmedAt = now
			s.payments[index].StellarHash = randomHash()
			s.payments[index].StellarLedger = 100000 + int64(len(s.payments))*7
			s.payments[index].FeeCharged = "0.0000100"
			s.payments[index].Events = append(s.payments[index].Events, PaymentEvent{
				ID:          newID("evt"),
				Label:       "MVP settlement recorded",
				Description: "Stellar testnet settlement hash attached by the API worker.",
				Status:      "done",
				CreatedAt:   now,
			})
			return s.payments[index], true
		}
	}
	return Payment{}, false
}

func (s *MemoryStore) SubmitCondition(id string, input ConditionProofInput) (ConditionProofResult, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.payments {
		if s.payments[index].ID != id {
			continue
		}
		now := nowISO()
		met := input.ActualValue >= s.payments[index].ConditionValue
		condition := PaymentCondition{
			ID:            newID("cond"),
			PaymentID:     id,
			ConditionKey:  input.ConditionKey,
			ExpectedValue: s.payments[index].ConditionValue,
			ActualValue:   input.ActualValue,
			ProofData:     input.ProofData,
			CreatedAt:     now,
		}
		if met {
			condition.MetAt = now
			s.payments[index].Status = "processing"
		}
		s.conditions = append([]PaymentCondition{condition}, s.conditions...)
		return ConditionProofResult{ConditionMet: met, Payment: s.payments[index], Condition: condition}, true
	}
	return ConditionProofResult{}, false
}

func (s *MemoryStore) ListX402PricingRules() []X402PricingRule {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]X402PricingRule(nil), s.x402Rules...)
}

func (s *MemoryStore) UpsertX402PricingRule(rule X402PricingRule) X402PricingRule {
	s.mu.Lock()
	defer s.mu.Unlock()
	if rule.ID == "" {
		rule.ID = newID("x402")
	}
	rule.UpdatedAt = nowISO()
	for index := range s.x402Rules {
		if s.x402Rules[index].Resource == rule.Resource {
			rule.ID = s.x402Rules[index].ID
			s.x402Rules[index] = rule
			return rule
		}
	}
	s.x402Rules = append([]X402PricingRule{rule}, s.x402Rules...)
	return rule
}

func (s *MemoryStore) CreateX402Challenge(resource string, cfg Config) X402Challenge {
	s.mu.Lock()
	defer s.mu.Unlock()
	rule := X402PricingRule{Resource: resource, Amount: "0.0500000", Asset: "USDC:" + cfg.USDCIssuer, MaxTimeout: 300, Enabled: true}
	for _, candidate := range s.x402Rules {
		if candidate.Resource == resource && candidate.Enabled {
			rule = candidate
			break
		}
	}
	nonce := newID("nonce")
	payTo := cfg.X402PlatformKey
	if payTo == "" && len(s.devices) > 0 {
		payTo = s.devices[0].StellarPublicKey
	}
	challenge := X402Challenge{
		Status:     402,
		Resource:   resource,
		Scheme:     "stellar",
		Network:    cfg.StellarNetwork,
		PayTo:      payTo,
		Amount:     rule.Amount,
		Asset:      rule.Asset,
		MaxTimeout: rule.MaxTimeout,
		Nonce:      nonce,
		CreatedAt:  nowISO(),
	}
	challenge.RequiredHeader = fmt.Sprintf("scheme=stellar,network=%s,payTo=%s,amount=%s,asset=%s,maxTimeout=%d,nonce=%s", challenge.Network, challenge.PayTo, challenge.Amount, challenge.Asset, challenge.MaxTimeout, challenge.Nonce)
	s.x402Nonces[nonce] = challenge
	return challenge
}

func (s *MemoryStore) ConsumeX402Nonce(nonce string) (X402Challenge, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	challenge, ok := s.x402Nonces[nonce]
	if ok {
		delete(s.x402Nonces, nonce)
	}
	return challenge, ok
}

func (s *MemoryStore) deviceExistsLocked(id string) bool {
	for _, device := range s.devices {
		if device.ID == id {
			return true
		}
	}
	return false
}

func newID(prefix string) string {
	return prefix + "_" + randomToken(8)
}

func randomToken(bytesLen int) string {
	buf := make([]byte, bytesLen)
	if _, err := rand.Read(buf); err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return hex.EncodeToString(buf)
}

func randomHash() string {
	return randomToken(32)
}

func randomStellarPublicKey() string {
	alphabet := "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
	token := strings.ToUpper(randomToken(40))
	var out strings.Builder
	out.WriteByte('G')
	for out.Len() < 56 {
		for _, ch := range token {
			if out.Len() >= 56 {
				break
			}
			out.WriteByte(alphabet[int(ch)%len(alphabet)])
		}
		token = randomToken(40)
	}
	return out.String()
}

func previewSecret(secret string) string {
	if len(secret) <= 14 {
		return secret
	}
	return secret[:10] + "..." + strings.ToUpper(secret[len(secret)-4:])
}
