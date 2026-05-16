package api

import (
	"bytes"
	"context"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type PostgresStore struct {
	pool *pgxpool.Pool
	cfg  Config
}

func NewPostgresStore(ctx context.Context, cfg Config) (*PostgresStore, error) {
	pool, err := pgxpool.New(ctx, cfg.DatabaseURL)
	if err != nil {
		return nil, err
	}
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, err
	}
	return &PostgresStore{pool: pool, cfg: cfg}, nil
}

func (s *PostgresStore) Close() {
	s.pool.Close()
}

func (s *PostgresStore) Health(cfg Config) SystemHealth {
	ctx, cancel := context.WithTimeout(context.Background(), 300*time.Millisecond)
	defer cancel()

	db := HealthOK
	if err := s.pool.Ping(ctx); err != nil {
		db = HealthDown
	}

	redisHealth := HealthDegraded
	if strings.TrimSpace(cfg.RedisURL) != "" {
		redisHealth = HealthOK
		options, err := redis.ParseURL(cfg.RedisURL)
		if err != nil {
			redisHealth = HealthDown
		} else {
			client := redis.NewClient(options)
			if err := client.Ping(ctx).Err(); err != nil {
				redisHealth = HealthDown
			}
			_ = client.Close()
		}
	}

	return SystemHealth{
		API:     HealthOK,
		DB:      db,
		Redis:   redisHealth,
		Stellar: HealthOK,
		MCP:     HealthOK,
		Version: cfg.Version,
	}
}

func (s *PostgresStore) Dashboard(cfg Config) DashboardSummary {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	var totalDevices, activeDevices int
	_ = s.pool.QueryRow(ctx, `
		select count(*)::int, count(*) filter (where status = 'active')::int
		from public.kivo_devices
		where owner_id = $1
	`, ownerID).Scan(&totalDevices, &activeDevices)

	var confirmedPayments, pendingPayments, failedPayments int
	var volumeText string
	_ = s.pool.QueryRow(ctx, `
		select
			count(*) filter (where status = 'confirmed')::int,
			count(*) filter (where status in ('pending', 'processing'))::int,
			count(*) filter (where status = 'failed')::int,
			coalesce(sum(amount) filter (where status = 'confirmed' and asset_code = 'USDC'), 0)::text
		from public.kivo_payments
		where owner_id = $1
	`, ownerID).Scan(&confirmedPayments, &pendingPayments, &failedPayments, &volumeText)

	volume, _ := strconv.ParseFloat(volumeText, 64)
	return DashboardSummary{
		TotalDevices:      totalDevices,
		ActiveDevices:     activeDevices,
		TotalVolumeUSDC:   volume,
		ConfirmedPayments: confirmedPayments,
		PendingPayments:   pendingPayments,
		FailedPayments:    failedPayments,
		Health:            s.Health(cfg),
	}
}

func (s *PostgresStore) ListDevices() []Device {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	rows, err := s.pool.Query(ctx, `
		select id::text, owner_id::text, name, api_key_preview, stellar_public_key, status, metadata, balances, created_at, updated_at
		from public.kivo_devices
		where owner_id = $1
		order by created_at desc
	`, ownerID)
	if err != nil {
		return nil
	}
	defer rows.Close()

	devices := make([]Device, 0)
	for rows.Next() {
		device, err := scanDevice(rows)
		if err == nil {
			devices = append(devices, device)
		}
	}
	return devices
}

func (s *PostgresStore) CreateDevice(input RegisterDeviceInput) DeviceRegistrationResult {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	raw, hash, preview, err := GenerateAPIKey("test")
	if err != nil {
		raw = "kivo_test_" + randomToken(28)
		hash = HashAPIKey(raw)
		preview = previewSecret(raw)
	}
	kp, err := GenerateStellarKeypair()
	if err != nil {
		kp = StellarKeypair{PublicKey: randomStellarPublicKey(), Secret: ""}
	}
	encryptedSecret, _ := EncryptSecret(kp.Secret, s.cfg.SecretEncryptionKey)
	metadata := input.Metadata
	if metadata == nil {
		metadata = map[string]string{}
	}
	balances := []AssetBalance{}

	device, err := s.insertDevice(ctx, input.Name, hash, preview, kp.PublicKey, encryptedSecret, metadata, balances)
	if err != nil {
		return DeviceRegistrationResult{}
	}
	return DeviceRegistrationResult{Device: device, APIKey: raw}
}

func (s *PostgresStore) GetDevice(id string) (Device, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	row := s.pool.QueryRow(ctx, `
		select id::text, owner_id::text, name, api_key_preview, stellar_public_key, status, metadata, balances, created_at, updated_at
		from public.kivo_devices
		where id = $1 and owner_id = $2
	`, id, ownerID)
	device, err := scanDevice(row)
	return device, err == nil
}

func (s *PostgresStore) UpdateDeviceStatus(id string, status string) (Device, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	row := s.pool.QueryRow(ctx, `
		update public.kivo_devices
		set status = $3, updated_at = now()
		where id = $1 and owner_id = $2
		returning id::text, owner_id::text, name, api_key_preview, stellar_public_key, status, metadata, balances, created_at, updated_at
	`, id, ownerID, status)
	device, err := scanDevice(row)
	return device, err == nil
}

func (s *PostgresStore) ListPayments() []Payment {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	rows, err := s.pool.Query(ctx, paymentSelectSQL()+`
		where owner_id = $1
		order by created_at desc
	`, ownerID)
	if err != nil {
		return nil
	}
	defer rows.Close()

	payments := make([]Payment, 0)
	for rows.Next() {
		payment, err := scanPayment(rows)
		if err == nil {
			payments = append(payments, payment)
		}
	}
	return payments
}

func (s *PostgresStore) CreatePayment(input CreatePaymentInput) (Payment, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if _, ok := s.GetDevice(input.FromDeviceID); !ok {
		return Payment{}, fmt.Errorf("fromDeviceId must reference an existing device")
	}
	if _, ok := s.GetDevice(input.ToDeviceID); !ok {
		return Payment{}, fmt.Errorf("toDeviceId must reference an existing device")
	}
	if strings.TrimSpace(input.AssetCode) == "" {
		input.AssetCode = "USDC"
	}
	if strings.TrimSpace(input.ConditionType) == "" {
		input.ConditionType = "none"
	}

	status := "pending"
	eventStatus := "waiting"
	description := "Waiting for condition proof."
	if input.ConditionType == "none" {
		status = "processing"
		eventStatus = "current"
		description = "Queued for MVP settlement worker."
	}
	events := []PaymentEvent{{
		ID:          newID("evt"),
		Label:       "Payment created",
		Description: description,
		Status:      eventStatus,
		CreatedAt:   nowISO(),
	}}
	var timeoutAt any
	if input.TimeoutSeconds > 0 {
		timeoutAt = time.Now().UTC().Add(time.Duration(input.TimeoutSeconds) * time.Second)
	}
	eventsJSON, _ := json.Marshal(events)

	row := s.pool.QueryRow(ctx, paymentInsertSQL(), ownerID, input.FromDeviceID, input.ToDeviceID, input.Amount, input.AssetCode, input.ConditionType, nullEmpty(input.ConditionValue), status, nullEmpty(input.Memo), timeoutAt, eventsJSON)
	return scanPayment(row)
}

func (s *PostgresStore) GetPayment(id string) (Payment, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	row := s.pool.QueryRow(ctx, paymentSelectSQL()+`
		where id = $1 and owner_id = $2
	`, id, ownerID)
	payment, err := scanPayment(row)
	return payment, err == nil
}

func (s *PostgresStore) ExecutePayment(id string, settlement StellarSettlement) (Payment, bool) {
	payment, ok := s.GetPayment(id)
	if !ok {
		return Payment{}, false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	now := nowISO()
	payment.Events = append(payment.Events, PaymentEvent{
		ID:          newID("evt"),
		Label:       "Stellar settlement confirmed",
		Description: "Horizon accepted the submitted Stellar transaction.",
		Status:      "done",
		CreatedAt:   now,
	})
	eventsJSON, _ := json.Marshal(payment.Events)
	row := s.pool.QueryRow(ctx, `
		update public.kivo_payments
		set status = 'confirmed',
			stellar_hash = $3,
			stellar_ledger = $4,
			fee_charged = $5,
			confirmed_at = now(),
			events = $6,
			updated_at = now()
		where id = $1 and owner_id = $2
		returning `+paymentColumnsSQL(), id, ownerID, settlement.Hash, settlement.Ledger, settlement.FeeCharged, eventsJSON)
	updated, err := scanPayment(row)
	return updated, err == nil
}

func (s *PostgresStore) SubmitCondition(id string, input ConditionProofInput) (ConditionProofResult, bool) {
	payment, ok := s.GetPayment(id)
	if !ok {
		return ConditionProofResult{}, false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	met := conditionSatisfied(input.ActualValue, payment.ConditionValue)
	now := nowISO()
	condition := PaymentCondition{
		ID:            newID("cond"),
		PaymentID:     id,
		ConditionKey:  input.ConditionKey,
		ExpectedValue: payment.ConditionValue,
		ActualValue:   input.ActualValue,
		ProofData:     input.ProofData,
		CreatedAt:     now,
	}
	if condition.ProofData == nil {
		condition.ProofData = map[string]any{}
	}
	if met {
		condition.MetAt = now
		payment.Status = "processing"
		_, _ = s.pool.Exec(ctx, `update public.kivo_payments set status = 'processing', updated_at = now() where id = $1 and owner_id = $2`, id, ownerID)
	}
	proofJSON, _ := json.Marshal(condition.ProofData)
	row := s.pool.QueryRow(ctx, `
		insert into public.kivo_payment_conditions (owner_id, payment_id, condition_key, expected_value, actual_value, proof_data, met_at)
		values ($1, $2, $3, $4, $5, $6, $7)
		returning id::text, created_at
	`, ownerID, id, condition.ConditionKey, condition.ExpectedValue, condition.ActualValue, proofJSON, nullableTime(condition.MetAt))
	var created time.Time
	if err := row.Scan(&condition.ID, &created); err != nil {
		return ConditionProofResult{}, false
	}
	condition.CreatedAt = formatTime(created)
	if met {
		payment, _ = s.GetPayment(id)
	}
	return ConditionProofResult{ConditionMet: met, Payment: payment, Condition: condition}, true
}

func (s *PostgresStore) ListX402PricingRules() []X402PricingRule {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	rows, err := s.pool.Query(ctx, `
		select id::text, resource, amount::text, asset, max_timeout, enabled, coalesce(description, ''), updated_at
		from public.kivo_x402_pricing_rules
		where owner_id = $1
		order by resource asc
	`, ownerID)
	if err != nil {
		return nil
	}
	defer rows.Close()

	rules := make([]X402PricingRule, 0)
	for rows.Next() {
		rule, err := scanX402PricingRule(rows)
		if err == nil {
			rules = append(rules, rule)
		}
	}
	return rules
}

func (s *PostgresStore) UpsertX402PricingRule(rule X402PricingRule) X402PricingRule {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	if rule.MaxTimeout <= 0 {
		rule.MaxTimeout = 300
	}
	if strings.TrimSpace(rule.Asset) == "" {
		rule.Asset = "USDC:" + s.cfg.USDCIssuer
	}
	row := s.pool.QueryRow(ctx, `
		insert into public.kivo_x402_pricing_rules (owner_id, resource, amount, asset, max_timeout, enabled, description)
		values ($1, $2, $3, $4, $5, $6, $7)
		on conflict (owner_id, resource) do update set
			amount = excluded.amount,
			asset = excluded.asset,
			max_timeout = excluded.max_timeout,
			enabled = excluded.enabled,
			description = excluded.description,
			updated_at = now()
		returning id::text, resource, amount::text, asset, max_timeout, enabled, coalesce(description, ''), updated_at
	`, ownerID, rule.Resource, rule.Amount, rule.Asset, rule.MaxTimeout, rule.Enabled, nullEmpty(rule.Description))
	saved, err := scanX402PricingRule(row)
	if err != nil {
		return rule
	}
	return saved
}

func (s *PostgresStore) CreateX402Challenge(resource string, cfg Config) X402Challenge {
	rule := X402PricingRule{Resource: resource, Amount: "0.0500000", Asset: "USDC:" + cfg.USDCIssuer, MaxTimeout: 300, Enabled: true}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()
	row := s.pool.QueryRow(ctx, `
		select id::text, resource, amount::text, asset, max_timeout, enabled, coalesce(description, ''), updated_at
		from public.kivo_x402_pricing_rules
		where owner_id = $1 and resource = $2 and enabled = true
	`, ownerID, resource)
	if saved, err := scanX402PricingRule(row); err == nil {
		rule = saved
	}
	payTo := cfg.X402PlatformKey
	if cfg.X402PlatformKey == "" {
		if devices := s.ListDevices(); len(devices) > 0 {
			payTo = devices[0].StellarPublicKey
		}
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
		Nonce:      newID("nonce"),
		CreatedAt:  nowISO(),
	}
	challenge.RequiredHeader = fmt.Sprintf("scheme=stellar,network=%s,payTo=%s,amount=%s,asset=%s,maxTimeout=%d,nonce=%s", challenge.Network, challenge.PayTo, challenge.Amount, challenge.Asset, challenge.MaxTimeout, challenge.Nonce)

	_, _ = s.pool.Exec(ctx, `
		insert into public.kivo_x402_nonces (nonce, owner_id, resource, amount, asset, pay_to, max_timeout, status, expires_at, created_at)
		values ($1, $2, $3, $4, $5, $6, $7, 'issued', $8, now())
		on conflict (nonce) do nothing
	`, challenge.Nonce, ownerID, challenge.Resource, challenge.Amount, challenge.Asset, challenge.PayTo, challenge.MaxTimeout, time.Now().UTC().Add(time.Duration(challenge.MaxTimeout)*time.Second))
	return challenge
}

func (s *PostgresStore) ConsumeX402Nonce(nonce string) (X402Challenge, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	row := s.pool.QueryRow(ctx, `
		update public.kivo_x402_nonces
		set status = 'paid', consumed_at = now()
		where nonce = $1 and status = 'issued' and expires_at > now()
		returning nonce, resource, amount::text, asset, pay_to, max_timeout, created_at
	`, nonce)
	var challenge X402Challenge
	var created time.Time
	if err := row.Scan(&challenge.Nonce, &challenge.Resource, &challenge.Amount, &challenge.Asset, &challenge.PayTo, &challenge.MaxTimeout, &created); err != nil {
		return X402Challenge{}, false
	}
	challenge.Status = 402
	challenge.Scheme = "stellar"
	challenge.Network = s.cfg.StellarNetwork
	challenge.CreatedAt = formatTime(created)
	challenge.RequiredHeader = fmt.Sprintf("scheme=stellar,network=%s,payTo=%s,amount=%s,asset=%s,maxTimeout=%d,nonce=%s", challenge.Network, challenge.PayTo, challenge.Amount, challenge.Asset, challenge.MaxTimeout, challenge.Nonce)
	return challenge, true
}

func (s *PostgresStore) GetX402Challenge(nonce string) (X402Challenge, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	row := s.pool.QueryRow(ctx, `
		select nonce, resource, amount::text, asset, pay_to, max_timeout, created_at
		from public.kivo_x402_nonces
		where nonce = $1 and status = 'issued' and expires_at > now()
	`, nonce)
	var challenge X402Challenge
	var created time.Time
	if err := row.Scan(&challenge.Nonce, &challenge.Resource, &challenge.Amount, &challenge.Asset, &challenge.PayTo, &challenge.MaxTimeout, &created); err != nil {
		return X402Challenge{}, false
	}
	challenge.Status = 402
	challenge.Scheme = "stellar"
	challenge.Network = s.cfg.StellarNetwork
	challenge.CreatedAt = formatTime(created)
	challenge.RequiredHeader = fmt.Sprintf("scheme=stellar,network=%s,payTo=%s,amount=%s,asset=%s,maxTimeout=%d,nonce=%s", challenge.Network, challenge.PayTo, challenge.Amount, challenge.Asset, challenge.MaxTimeout, challenge.Nonce)
	return challenge, true
}

func (s *PostgresStore) ListWebhooks() []Webhook {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	rows, err := s.pool.Query(ctx, `
		select id::text, url, events, secret_preview, active, created_at, delivery_count, last_delivery_status
		from public.kivo_webhooks
		where owner_id = $1
		order by created_at desc
	`, ownerID)
	if err != nil {
		return nil
	}
	defer rows.Close()

	webhooks := make([]Webhook, 0)
	for rows.Next() {
		webhook, err := scanWebhook(rows)
		if err == nil {
			webhooks = append(webhooks, webhook)
		}
	}
	return webhooks
}

func (s *PostgresStore) CreateWebhook(webhookURL string, events []string) (Webhook, string) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	secret := "whsec_" + randomToken(24)
	encryptedSecret, err := EncryptSecret(secret, s.cfg.SecretEncryptionKey)
	if err != nil {
		return Webhook{}, ""
	}
	row := s.pool.QueryRow(ctx, `
		insert into public.kivo_webhooks (owner_id, url, events, secret_hash, secret_preview, encrypted_secret, active)
		values ($1, $2, $3, $4, $5, $6, true)
		returning id::text, url, events, secret_preview, active, created_at, delivery_count, last_delivery_status
	`, ownerID, webhookURL, events, HashAPIKey(secret), previewSecret(secret), encryptedSecret)
	webhook, err := scanWebhook(row)
	if err != nil {
		return Webhook{}, ""
	}
	return webhook, secret
}

func (s *PostgresStore) ToggleWebhook(id string, active bool) (Webhook, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	row := s.pool.QueryRow(ctx, `
		update public.kivo_webhooks
		set active = $3, updated_at = now()
		where id = $1 and owner_id = $2
		returning id::text, url, events, secret_preview, active, created_at, delivery_count, last_delivery_status
	`, id, ownerID, active)
	webhook, err := scanWebhook(row)
	return webhook, err == nil
}

func (s *PostgresStore) DeleteWebhook(id string) bool {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	tag, err := s.pool.Exec(ctx, `delete from public.kivo_webhooks where id = $1 and owner_id = $2`, id, ownerID)
	return err == nil && tag.RowsAffected() > 0
}

func (s *PostgresStore) TestWebhook(id string) (WebhookTestResult, bool) {
	dbCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	var webhookURL, encryptedSecret string
	if err := s.pool.QueryRow(dbCtx, `
		select url, coalesce(encrypted_secret, '')
		from public.kivo_webhooks
		where id = $1 and owner_id = $2 and active = true
	`, id, ownerID).Scan(&webhookURL, &encryptedSecret); err != nil {
		return WebhookTestResult{}, false
	}

	now := time.Now().UTC()
	delivery := WebhookDelivery{
		WebhookID: id,
		Event:     "webhook.test",
		Payload:   map[string]any{"type": "webhook.test", "created_at": now.Format(time.RFC3339)},
		Status:    "failed",
		Attempts:  1,
		CreatedAt: now.Format(time.RFC3339),
	}
	payloadJSON, _ := json.Marshal(delivery.Payload)

	secret, err := DecryptSecret(encryptedSecret, s.cfg.SecretEncryptionKey)
	signature := ""
	latencyMS := 0
	if err == nil && secret != "" {
		signature = signWebhookPayload(secret, payloadJSON)
		requestCtx, requestCancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer requestCancel()
		req, reqErr := http.NewRequestWithContext(requestCtx, http.MethodPost, webhookURL, bytes.NewReader(payloadJSON))
		if reqErr == nil {
			req.Header.Set("Content-Type", "application/json")
			req.Header.Set("X-Kivo-Event", delivery.Event)
			req.Header.Set("X-Kivo-Signature", signature)
			start := time.Now()
			resp, respErr := http.DefaultClient.Do(req)
			latencyMS = int(time.Since(start).Milliseconds())
			if respErr == nil {
				delivery.ResponseCode = resp.StatusCode
				_ = resp.Body.Close()
				if resp.StatusCode >= 200 && resp.StatusCode < 300 {
					delivery.Status = "delivered"
					delivery.DeliveredAt = time.Now().UTC().Format(time.RFC3339)
				}
			}
		}
	}

	deliveredAt := any(nil)
	if delivery.DeliveredAt != "" {
		deliveredAt = time.Now().UTC()
	}
	status := delivery.Status
	responseCode := delivery.ResponseCode
	dbWriteCtx, writeCancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer writeCancel()
	tx, err := s.pool.Begin(dbWriteCtx)
	if err != nil {
		return WebhookTestResult{}, false
	}
	defer func() { _ = tx.Rollback(dbWriteCtx) }()
	row := tx.QueryRow(dbWriteCtx, `
		insert into public.kivo_webhook_deliveries (owner_id, webhook_id, event, payload, status, attempts, response_code, delivered_at)
		values ($1, $2, $3, $4, $5, 1, $6, $7)
		returning id::text, created_at, delivered_at
	`, ownerID, id, delivery.Event, payloadJSON, status, responseCode, deliveredAt)
	var created, delivered pgtype.Timestamptz
	if err := row.Scan(&delivery.ID, &created, &delivered); err != nil {
		return WebhookTestResult{}, false
	}
	delivery.CreatedAt = formatNullableTime(created)
	delivery.DeliveredAt = formatNullableTime(delivered)
	if _, err := tx.Exec(dbWriteCtx, `
		update public.kivo_webhooks
		set delivery_count = delivery_count + 1, last_delivery_status = $3, updated_at = now()
		where id = $1 and owner_id = $2
	`, id, ownerID, status); err != nil {
		return WebhookTestResult{}, false
	}
	if err := tx.Commit(dbWriteCtx); err != nil {
		return WebhookTestResult{}, false
	}
	return WebhookTestResult{WebhookID: id, Status: status, ResponseCode: responseCode, LatencyMS: latencyMS, SignedPayloadPreview: previewSignature(signature), Delivery: delivery}, true
}

func (s *PostgresStore) ListWebhookDeliveries(webhookID string) []WebhookDelivery {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	query := `
		select id::text, webhook_id::text, coalesce(payment_id::text, ''), event, payload, status, attempts, coalesce(response_code, 0), next_retry_at, delivered_at, created_at
		from public.kivo_webhook_deliveries
		where owner_id = $1
	`
	args := []any{ownerID}
	if webhookID != "" {
		query += " and webhook_id = $2"
		args = append(args, webhookID)
	}
	query += " order by created_at desc"
	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil
	}
	defer rows.Close()

	deliveries := make([]WebhookDelivery, 0)
	for rows.Next() {
		delivery, err := scanWebhookDelivery(rows)
		if err == nil {
			deliveries = append(deliveries, delivery)
		}
	}
	return deliveries
}

func (s *PostgresStore) ListAPIKeys() []APIKey {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	rows, err := s.pool.Query(ctx, `
		select id::text, name, key_preview, scopes, status, last_used_at, expires_at, created_at
		from public.kivo_api_keys
		where owner_id = $1
		order by created_at desc
	`, ownerID)
	if err != nil {
		return nil
	}
	defer rows.Close()

	keys := make([]APIKey, 0)
	for rows.Next() {
		key, err := scanAPIKey(rows)
		if err == nil {
			keys = append(keys, key)
		}
	}
	return keys
}

func (s *PostgresStore) CreateAPIKey(name string, scopes []string, expiresAt string) (APIKey, string) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	raw, hash, preview, err := GenerateAPIKey("live")
	if err != nil {
		raw = "kivo_live_" + randomToken(28)
		hash = HashAPIKey(raw)
		preview = previewSecret(raw)
	}
	row := s.pool.QueryRow(ctx, `
		insert into public.kivo_api_keys (owner_id, name, key_hash, key_preview, scopes, expires_at)
		values ($1, $2, $3, $4, $5, $6)
		returning id::text, name, key_preview, scopes, status, last_used_at, expires_at, created_at
	`, ownerID, name, hash, preview, scopes, nullableTime(expiresAt))
	key, err := scanAPIKey(row)
	if err != nil {
		return APIKey{}, ""
	}
	return key, raw
}

func (s *PostgresStore) RevokeAPIKey(id string) (APIKey, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	row := s.pool.QueryRow(ctx, `
		update public.kivo_api_keys
		set status = 'revoked'
		where id = $1 and owner_id = $2
		returning id::text, name, key_preview, scopes, status, last_used_at, expires_at, created_at
	`, id, ownerID)
	key, err := scanAPIKey(row)
	return key, err == nil
}

func (s *PostgresStore) AuthenticateAPIKey(raw string) bool {
	if strings.TrimSpace(raw) == "" {
		return false
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	tag, err := s.pool.Exec(ctx, `
		update public.kivo_api_keys
		set last_used_at = now()
		where key_hash = $1
			and owner_id = $2
			and status = 'active'
			and (expires_at is null or expires_at > now())
	`, HashAPIKey(raw), ownerID)
	return err == nil && tag.RowsAffected() > 0
}

func (s *PostgresStore) RecordEtherfuseWebhook(payload map[string]any) {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	payloadJSON, _ := json.Marshal(payload)
	_, _ = s.pool.Exec(ctx, `
		insert into public.kivo_etherfuse_webhook_events (provider_event_id, provider_order_id, event_type, signature_valid, payload)
		values ($1, $2, $3, true, $4)
	`, firstPayloadString(payload, "id", "eventId", "event_id"), firstPayloadString(payload, "orderId", "order_id", "provider_order_id"), valueOrDefault(firstPayloadString(payload, "type", "event", "event_type"), "etherfuse.webhook"), payloadJSON)
}

func (s *PostgresStore) insertDevice(ctx context.Context, name string, keyHash string, keyPreview string, stellarPublicKey string, encryptedSecret string, metadata map[string]string, balances []AssetBalance) (Device, error) {
	metadataJSON, _ := json.Marshal(metadata)
	balancesJSON, _ := json.Marshal(balances)
	row := s.pool.QueryRow(ctx, `
		insert into public.kivo_devices (owner_id, name, api_key_hash, api_key_preview, stellar_public_key, encrypted_stellar_secret, metadata, balances)
		values ($1, $2, $3, $4, $5, $6, $7, $8)
		returning id::text, owner_id::text, name, api_key_preview, stellar_public_key, status, metadata, balances, created_at, updated_at
	`, ownerID, name, keyHash, keyPreview, stellarPublicKey, encryptedSecret, metadataJSON, balancesJSON)
	return scanDevice(row)
}

func (s *PostgresStore) webhookExists(ctx context.Context, id string) (Webhook, bool) {
	row := s.pool.QueryRow(ctx, `
		select id::text, url, events, secret_preview, active, created_at, delivery_count, last_delivery_status
		from public.kivo_webhooks
		where id = $1 and owner_id = $2
	`, id, ownerID)
	webhook, err := scanWebhook(row)
	return webhook, err == nil
}

func scanDevice(row pgx.Row) (Device, error) {
	var device Device
	var metadataJSON, balancesJSON []byte
	var createdAt, updatedAt time.Time
	err := row.Scan(&device.ID, &device.OwnerID, &device.Name, &device.APIKeyPreview, &device.StellarPublicKey, &device.Status, &metadataJSON, &balancesJSON, &createdAt, &updatedAt)
	if err != nil {
		return Device{}, err
	}
	device.Metadata = map[string]string{}
	_ = json.Unmarshal(metadataJSON, &device.Metadata)
	_ = json.Unmarshal(balancesJSON, &device.Balances)
	device.CreatedAt = formatTime(createdAt)
	device.UpdatedAt = formatTime(updatedAt)
	return device, nil
}

func paymentSelectSQL() string {
	return "select " + paymentColumnsSQL() + " from public.kivo_payments "
}

func paymentColumnsSQL() string {
	return `id::text, from_device_id::text, to_device_id::text, amount::text, asset_code, coalesce(asset_issuer, ''),
		condition_type, coalesce(condition_value, ''), status, coalesce(stellar_hash, ''), coalesce(stellar_ledger, 0),
		coalesce(memo, ''), timeout_at, confirmed_at, coalesce(failed_reason, ''), coalesce(fee_charged::text, ''), events, created_at`
}

func paymentInsertSQL() string {
	return `
		insert into public.kivo_payments (owner_id, from_device_id, to_device_id, amount, asset_code, condition_type, condition_value, status, memo, timeout_at, events)
		values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		returning ` + paymentColumnsSQL()
}

func scanPayment(row pgx.Row) (Payment, error) {
	var payment Payment
	var timeoutAt, confirmedAt pgtype.Timestamptz
	var eventsJSON []byte
	var createdAt time.Time
	err := row.Scan(&payment.ID, &payment.FromDeviceID, &payment.ToDeviceID, &payment.Amount, &payment.AssetCode, &payment.AssetIssuer, &payment.ConditionType, &payment.ConditionValue, &payment.Status, &payment.StellarHash, &payment.StellarLedger, &payment.Memo, &timeoutAt, &confirmedAt, &payment.FailedReason, &payment.FeeCharged, &eventsJSON, &createdAt)
	if err != nil {
		return Payment{}, err
	}
	_ = json.Unmarshal(eventsJSON, &payment.Events)
	payment.CreatedAt = formatTime(createdAt)
	payment.TimeoutAt = formatNullableTime(timeoutAt)
	payment.ConfirmedAt = formatNullableTime(confirmedAt)
	return payment, nil
}

func scanWebhook(row pgx.Row) (Webhook, error) {
	var webhook Webhook
	var createdAt time.Time
	err := row.Scan(&webhook.ID, &webhook.URL, &webhook.Events, &webhook.SecretPreview, &webhook.Active, &createdAt, &webhook.DeliveryCount, &webhook.LastDeliveryStatus)
	if err != nil {
		return Webhook{}, err
	}
	webhook.CreatedAt = formatTime(createdAt)
	return webhook, nil
}

func scanX402PricingRule(row pgx.Row) (X402PricingRule, error) {
	var rule X402PricingRule
	var updatedAt time.Time
	err := row.Scan(&rule.ID, &rule.Resource, &rule.Amount, &rule.Asset, &rule.MaxTimeout, &rule.Enabled, &rule.Description, &updatedAt)
	if err != nil {
		return X402PricingRule{}, err
	}
	rule.UpdatedAt = formatTime(updatedAt)
	return rule, nil
}

func scanWebhookDelivery(row pgx.Row) (WebhookDelivery, error) {
	var delivery WebhookDelivery
	var payloadJSON []byte
	var nextRetryAt, deliveredAt pgtype.Timestamptz
	var createdAt time.Time
	err := row.Scan(&delivery.ID, &delivery.WebhookID, &delivery.PaymentID, &delivery.Event, &payloadJSON, &delivery.Status, &delivery.Attempts, &delivery.ResponseCode, &nextRetryAt, &deliveredAt, &createdAt)
	if err != nil {
		return WebhookDelivery{}, err
	}
	_ = json.Unmarshal(payloadJSON, &delivery.Payload)
	delivery.NextRetryAt = formatNullableTime(nextRetryAt)
	delivery.DeliveredAt = formatNullableTime(deliveredAt)
	delivery.CreatedAt = formatTime(createdAt)
	return delivery, nil
}

func scanAPIKey(row pgx.Row) (APIKey, error) {
	var key APIKey
	var lastUsedAt, expiresAt pgtype.Timestamptz
	var createdAt time.Time
	err := row.Scan(&key.ID, &key.Name, &key.KeyPreview, &key.Scopes, &key.Status, &lastUsedAt, &expiresAt, &createdAt)
	if err != nil {
		return APIKey{}, err
	}
	key.LastUsedAt = formatNullableTime(lastUsedAt)
	key.ExpiresAt = formatNullableTime(expiresAt)
	key.CreatedAt = formatTime(createdAt)
	return key, nil
}

func formatTime(value time.Time) string {
	return value.UTC().Format(time.RFC3339)
}

func formatNullableTime(value pgtype.Timestamptz) string {
	if !value.Valid {
		return ""
	}
	return formatTime(value.Time)
}

func nullableTime(value string) any {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	parsed, err := time.Parse(time.RFC3339, value)
	if err != nil {
		return nil
	}
	return parsed
}

func nullEmpty(value string) any {
	if strings.TrimSpace(value) == "" {
		return nil
	}
	return value
}

func conditionSatisfied(actual string, expected string) bool {
	if strings.TrimSpace(expected) == "" {
		return true
	}
	actualFloat, actualErr := strconv.ParseFloat(actual, 64)
	expectedFloat, expectedErr := strconv.ParseFloat(expected, 64)
	if actualErr == nil && expectedErr == nil {
		return actualFloat >= expectedFloat
	}
	return actual >= expected
}

func validStellarPublicKey(candidate string) string {
	if strings.HasPrefix(candidate, "G") && len(candidate) == 56 {
		return candidate
	}
	kp, err := GenerateStellarKeypair()
	if err != nil {
		return randomStellarPublicKey()
	}
	return kp.PublicKey
}

func firstPayloadString(payload map[string]any, keys ...string) string {
	for _, key := range keys {
		value := fmt.Sprint(payload[key])
		if value != "" && value != "<nil>" {
			return value
		}
	}
	return ""
}

func signWebhookPayload(secret string, payload []byte) string {
	mac := hmac.New(sha256.New, []byte(secret))
	_, _ = mac.Write(payload)
	return "sha256=" + hex.EncodeToString(mac.Sum(nil))
}

func previewSignature(signature string) string {
	if len(signature) <= 31 {
		return signature
	}
	return signature[:31]
}
