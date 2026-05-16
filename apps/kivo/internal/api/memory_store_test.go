package api

import (
	"fmt"
	"strconv"
	"strings"
	"sync"
	"time"
)

type MemoryStore struct {
	mu            sync.Mutex
	devices       []Device
	payments      []Payment
	conditions    []PaymentCondition
	webhooks      []Webhook
	deliveries    []WebhookDelivery
	apiKeys       []APIKey
	x402Rules     []X402PricingRule
	x402Nonces    map[string]X402Challenge
	webhookEvents []map[string]any
}

func (s *MemoryStore) Close() {}

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
		Asset:       "USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
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

	raw, _, preview, err := GenerateAPIKey("test")
	if err != nil {
		raw = "kivo_test_" + randomToken(28)
		preview = previewSecret(raw)
	}
	kp, err := GenerateStellarKeypair()
	if err != nil {
		kp = StellarKeypair{PublicKey: randomStellarPublicKey()}
	}
	now := nowISO()
	device := Device{
		ID:               newID("dev"),
		Name:             input.Name,
		OwnerID:          ownerID,
		APIKeyPreview:    preview,
		StellarPublicKey: kp.PublicKey,
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

func (s *MemoryStore) ExecutePayment(id string, settlement StellarSettlement) (Payment, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.payments {
		if s.payments[index].ID == id {
			now := nowISO()
			s.payments[index].Status = "confirmed"
			s.payments[index].ConfirmedAt = now
			s.payments[index].StellarHash = settlement.Hash
			s.payments[index].StellarLedger = settlement.Ledger
			s.payments[index].FeeCharged = settlement.FeeCharged
			s.payments[index].Events = append(s.payments[index].Events, PaymentEvent{
				ID:          newID("evt"),
				Label:       "Stellar settlement confirmed",
				Description: "Horizon accepted the submitted Stellar transaction.",
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

func (s *MemoryStore) GetX402Challenge(nonce string) (X402Challenge, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	challenge, ok := s.x402Nonces[nonce]
	return challenge, ok
}

func (s *MemoryStore) ListWebhooks() []Webhook {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]Webhook(nil), s.webhooks...)
}

func (s *MemoryStore) CreateWebhook(url string, events []string) (Webhook, string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	secret := "whsec_" + randomToken(24)
	webhook := Webhook{
		ID:                 newID("wh"),
		URL:                url,
		Events:             events,
		SecretPreview:      previewSecret(secret),
		Active:             true,
		CreatedAt:          nowISO(),
		LastDeliveryStatus: "pending",
	}
	s.webhooks = append([]Webhook{webhook}, s.webhooks...)
	return webhook, secret
}

func (s *MemoryStore) ToggleWebhook(id string, active bool) (Webhook, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.webhooks {
		if s.webhooks[index].ID == id {
			s.webhooks[index].Active = active
			return s.webhooks[index], true
		}
	}
	return Webhook{}, false
}

func (s *MemoryStore) DeleteWebhook(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	filtered := s.webhooks[:0]
	removed := false
	for _, webhook := range s.webhooks {
		if webhook.ID == id {
			removed = true
			continue
		}
		filtered = append(filtered, webhook)
	}
	s.webhooks = filtered
	return removed
}

func (s *MemoryStore) TestWebhook(id string) (WebhookTestResult, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.webhooks {
		if s.webhooks[index].ID != id {
			continue
		}
		now := nowISO()
		delivery := WebhookDelivery{ID: newID("wd"), WebhookID: id, Event: "webhook.test", Payload: map[string]any{"type": "webhook.test"}, Status: "delivered", Attempts: 1, ResponseCode: 200, DeliveredAt: now, CreatedAt: now}
		s.webhooks[index].DeliveryCount += 1
		s.webhooks[index].LastDeliveryStatus = "delivered"
		s.deliveries = append([]WebhookDelivery{delivery}, s.deliveries...)
		return WebhookTestResult{WebhookID: id, Status: "delivered", ResponseCode: 200, LatencyMS: 72, SignedPayloadPreview: "sha256=" + randomHash()[:24], Delivery: delivery}, true
	}
	return WebhookTestResult{}, false
}

func (s *MemoryStore) ListWebhookDeliveries(webhookID string) []WebhookDelivery {
	s.mu.Lock()
	defer s.mu.Unlock()
	out := make([]WebhookDelivery, 0)
	for _, delivery := range s.deliveries {
		if webhookID == "" || delivery.WebhookID == webhookID {
			out = append(out, delivery)
		}
	}
	return out
}

func (s *MemoryStore) ListAPIKeys() []APIKey {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]APIKey(nil), s.apiKeys...)
}

func (s *MemoryStore) CreateAPIKey(name string, scopes []string, expiresAt string) (APIKey, string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	raw, _, preview, err := GenerateAPIKey("live")
	if err != nil {
		raw = "kivo_live_" + randomToken(28)
		preview = previewSecret(raw)
	}
	key := APIKey{ID: newID("key"), Name: name, KeyPreview: preview, Scopes: scopes, Status: "active", ExpiresAt: expiresAt, CreatedAt: nowISO()}
	s.apiKeys = append([]APIKey{key}, s.apiKeys...)
	return key, raw
}

func (s *MemoryStore) RevokeAPIKey(id string) (APIKey, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for index := range s.apiKeys {
		if s.apiKeys[index].ID == id {
			s.apiKeys[index].Status = "revoked"
			return s.apiKeys[index], true
		}
	}
	return APIKey{}, false
}

func (s *MemoryStore) AuthenticateAPIKey(raw string) bool {
	return strings.HasPrefix(raw, "kivo_")
}

func (s *MemoryStore) RecordEtherfuseWebhook(payload map[string]any) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.webhookEvents = append([]map[string]any{payload}, s.webhookEvents...)
}

func (s *MemoryStore) deviceExistsLocked(id string) bool {
	for _, device := range s.devices {
		if device.ID == id {
			return true
		}
	}
	return false
}

func randomHash() string {
	return randomToken(32)
}
