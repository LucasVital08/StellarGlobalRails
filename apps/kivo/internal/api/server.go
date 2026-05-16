package api

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strconv"
	"strings"
	"time"
)

type Server struct {
	store      KivoStore
	cfg        Config
	httpClient *http.Client
}

func NewServer(store KivoStore, cfg Config) http.Handler {
	if cfg.Version == "" {
		cfg.Version = "0.1.0-mvp"
	}
	if cfg.StellarNetwork == "" {
		cfg.StellarNetwork = "testnet"
	}
	if cfg.USDCIssuer == "" {
		cfg.USDCIssuer = "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5"
	}
	if cfg.EtherfuseBaseURL == "" {
		cfg.EtherfuseBaseURL = "https://api.sand.etherfuse.com"
	}
	if cfg.EtherfuseMode == "" {
		cfg.EtherfuseMode = "sandbox"
	}
	if cfg.EtherfuseDefaultFiat == "" {
		cfg.EtherfuseDefaultFiat = "MXN"
	}
	return &Server{
		store: store,
		cfg:   cfg,
		httpClient: &http.Client{
			Timeout: 12 * time.Second,
		},
	}
}

func (s *Server) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	s.setCORS(w)
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	path := strings.TrimRight(r.URL.Path, "/")
	if path == "" {
		path = "/"
	}

	if s.cfg.RequireAuth && !isPublicRoute(path) && !s.authenticateRequest(r) {
		writeError(w, http.StatusUnauthorized, "unauthorized", "valid Supabase JWT or Kivo API key is required")
		return
	}

	switch {
	case path == "/v1/health" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.Health(s.cfg))
	case path == "/v1/dashboard" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.Dashboard(s.cfg))
	case path == "/v1/devices":
		s.handleDevices(w, r)
	case strings.HasPrefix(path, "/v1/devices/"):
		s.handleDevice(w, r, strings.TrimPrefix(path, "/v1/devices/"))
	case path == "/v1/payments":
		s.handlePayments(w, r)
	case strings.HasPrefix(path, "/v1/payments/"):
		s.handlePayment(w, r, strings.TrimPrefix(path, "/v1/payments/"))
	case path == "/v1/x402/challenge" && r.Method == http.MethodGet:
		s.handleX402Challenge(w, r)
	case path == "/v1/x402/pay" && r.Method == http.MethodPost:
		s.handleX402Pay(w, r)
	case path == "/v1/x402/pricing-rules":
		s.handleX402PricingRules(w, r)
	case path == "/api/x402/data" && r.Method == http.MethodGet:
		s.handleProtectedX402Data(w, r)
	case path == "/mcp" && r.Method == http.MethodPost:
		s.handleMCP(w, r)
	case strings.HasPrefix(path, "/v1/etherfuse/"):
		s.handleEtherfuse(w, r, strings.TrimPrefix(path, "/v1/etherfuse/"))
	case path == "/v1/webhooks":
		s.handleWebhooks(w, r)
	case strings.HasPrefix(path, "/v1/webhooks/"):
		s.handleWebhook(w, r, strings.TrimPrefix(path, "/v1/webhooks/"))
	case path == "/v1/webhook-deliveries" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.ListWebhookDeliveries(""))
	case path == "/v1/api-keys":
		s.handleAPIKeys(w, r)
	case strings.HasPrefix(path, "/v1/api-keys/"):
		s.handleAPIKey(w, r, strings.TrimPrefix(path, "/v1/api-keys/"))
	case path == "/v1/mcp/tools" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, mcpTools())
	case path == "/v1/mcp/config" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, mcpConfig(r))
	case path == "/v1/workflows" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, workflows())
	case path == "/v1/deploy/checks" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, s.deployChecks())
	case path == "/v1/deploy/services" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, s.deployServices(r))
	default:
		writeError(w, http.StatusNotFound, "not_found", "route not found")
	}
}

func (s *Server) authenticateRequest(r *http.Request) bool {
	apiKey := strings.TrimSpace(r.Header.Get("X-API-Key"))
	if apiKey != "" && s.store.AuthenticateAPIKey(apiKey) {
		return true
	}

	authHeader := strings.TrimSpace(r.Header.Get("Authorization"))
	if authHeader == "" {
		return false
	}
	token := strings.TrimSpace(strings.TrimPrefix(authHeader, "Bearer "))
	if token == authHeader {
		return false
	}
	if strings.HasPrefix(token, "kivo_") {
		return s.store.AuthenticateAPIKey(token)
	}
	if s.cfg.SupabaseJWTSecret == "" {
		return false
	}
	_, err := ValidateSupabaseJWT(token, s.cfg.SupabaseJWTSecret)
	return err == nil
}

func isPublicRoute(path string) bool {
	switch {
	case path == "/v1/health":
		return true
	case path == "/v1/etherfuse/webhook":
		return true
	case path == "/v1/x402/challenge" || path == "/v1/x402/pay":
		return true
	case path == "/api/x402/data":
		return true
	default:
		return false
	}
}

func (s *Server) setCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Authorization,Content-Type,X-API-Key,X-PAYMENT,X-Signature")
	w.Header().Set("Access-Control-Expose-Headers", "X-PAYMENT-REQUIRED")
}

func (s *Server) handleDevices(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.ListDevices())
	case http.MethodPost:
		var input RegisterDeviceInput
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		if strings.TrimSpace(input.Name) == "" {
			writeError(w, http.StatusBadRequest, "invalid_device", "name is required")
			return
		}
		writeJSON(w, http.StatusCreated, s.store.CreateDevice(input))
	default:
		writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}

func (s *Server) handleDevice(w http.ResponseWriter, r *http.Request, id string) {
	switch r.Method {
	case http.MethodGet:
		device, ok := s.store.GetDevice(id)
		if !ok {
			writeError(w, http.StatusNotFound, "device_not_found", "device not found")
			return
		}
		writeJSON(w, http.StatusOK, DeviceRegistrationResult{Device: device})
	case http.MethodPatch:
		var input struct {
			Status string `json:"status"`
		}
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		device, ok := s.store.UpdateDeviceStatus(id, input.Status)
		if !ok {
			writeError(w, http.StatusNotFound, "device_not_found", "device not found")
			return
		}
		writeJSON(w, http.StatusOK, device)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}

func (s *Server) handlePayments(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.ListPayments())
	case http.MethodPost:
		var input CreatePaymentInput
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		if input.AssetCode == "" {
			input.AssetCode = "USDC"
		}
		payment, err := s.store.CreatePayment(input)
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid_payment", err.Error())
			return
		}
		writeJSON(w, http.StatusCreated, payment)
	default:
		writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}

func (s *Server) handlePayment(w http.ResponseWriter, r *http.Request, rest string) {
	parts := strings.Split(rest, "/")
	id := parts[0]
	if len(parts) == 1 && r.Method == http.MethodGet {
		payment, ok := s.store.GetPayment(id)
		if !ok {
			writeError(w, http.StatusNotFound, "payment_not_found", "payment not found")
			return
		}
		writeJSON(w, http.StatusOK, payment)
		return
	}
	if len(parts) == 2 && parts[1] == "execute" && r.Method == http.MethodPost {
		if _, ok := s.store.GetPayment(id); !ok {
			writeError(w, http.StatusNotFound, "payment_not_found", "payment not found")
			return
		}
		var input struct {
			TXXDR string `json:"txXDR"`
		}
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		if strings.TrimSpace(input.TXXDR) == "" {
			writeError(w, http.StatusBadRequest, "missing_tx_xdr", "txXDR is required for zero-mock Stellar settlement")
			return
		}
		settlement, err := SubmitStellarTransaction(r.Context(), s.cfg.StellarHorizonURL, input.TXXDR)
		if err != nil {
			writeError(w, http.StatusBadGateway, "stellar_submit_failed", err.Error())
			return
		}
		payment, ok := s.store.ExecutePayment(id, settlement)
		if !ok {
			writeError(w, http.StatusNotFound, "payment_not_found", "payment not found")
			return
		}
		writeJSON(w, http.StatusOK, payment)
		return
	}
	if len(parts) == 2 && (parts[1] == "condition" || parts[1] == "condition-proof") && r.Method == http.MethodPost {
		var input ConditionProofInput
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		result, ok := s.store.SubmitCondition(id, input)
		if !ok {
			writeError(w, http.StatusNotFound, "payment_not_found", "payment not found")
			return
		}
		writeJSON(w, http.StatusOK, result)
		return
	}
	if len(parts) == 2 && parts[1] == "status" && r.Method == http.MethodGet {
		payment, ok := s.store.GetPayment(id)
		if !ok {
			writeError(w, http.StatusNotFound, "payment_not_found", "payment not found")
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"id": payment.ID, "status": payment.Status, "stellarHash": payment.StellarHash})
		return
	}
	writeError(w, http.StatusNotFound, "not_found", "payment route not found")
}

func (s *Server) handleX402Challenge(w http.ResponseWriter, r *http.Request) {
	resource := r.URL.Query().Get("resource")
	if resource == "" {
		resource = "/api/x402/data"
	}
	challenge := s.store.CreateX402Challenge(resource, s.cfg)
	w.Header().Set("X-PAYMENT-REQUIRED", challenge.RequiredHeader)
	writeJSON(w, http.StatusOK, challenge)
}

func (s *Server) handleX402Pay(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Nonce string `json:"nonce"`
		TXXDR string `json:"txXDR"`
	}
	if err := readJSON(r, &input); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
		return
	}
	if strings.TrimSpace(input.TXXDR) == "" {
		writeError(w, http.StatusBadRequest, "missing_tx_xdr", "txXDR is required for zero-mock x402 payment")
		return
	}
	challenge, ok := s.store.GetX402Challenge(input.Nonce)
	if !ok {
		writeError(w, http.StatusBadRequest, "invalid_nonce", "unknown or already used x402 nonce")
		return
	}
	settlement, err := SubmitStellarTransaction(r.Context(), s.cfg.StellarHorizonURL, input.TXXDR)
	if err != nil {
		writeError(w, http.StatusBadGateway, "stellar_submit_failed", err.Error())
		return
	}
	envelope := map[string]any{
		"scheme":        "stellar",
		"network":       challenge.Network,
		"nonce":         challenge.Nonce,
		"resource":      challenge.Resource,
		"amount":        challenge.Amount,
		"asset":         challenge.Asset,
		"timestamp":     nowISO(),
		"txXDR":         input.TXXDR,
		"stellarHash":   settlement.Hash,
		"stellarLedger": settlement.Ledger,
	}
	raw, _ := json.Marshal(envelope)
	writeJSON(w, http.StatusOK, X402PaidResponse{
		Status:        200,
		PaymentHeader: base64.StdEncoding.EncodeToString(raw),
		StellarHash:   settlement.Hash,
		StellarLedger: settlement.Ledger,
		Data: map[string]any{
			"reading":                   "premium sensor reading",
			"carbon_intensity_gco2_kwh": 185,
			"provider":                  "stellar-horizon",
			"timestamp":                 nowISO(),
		},
	})
}

func (s *Server) handleProtectedX402Data(w http.ResponseWriter, r *http.Request) {
	paymentHeader := r.Header.Get("X-PAYMENT")
	if paymentHeader == "" {
		challenge := s.store.CreateX402Challenge("/api/x402/data", s.cfg)
		w.Header().Set("X-PAYMENT-REQUIRED", challenge.RequiredHeader)
		writeJSON(w, http.StatusPaymentRequired, challenge)
		return
	}
	if err := s.validateX402PaymentHeader(paymentHeader, "/api/x402/data"); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_x402_payment", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"data":      "premium sensor reading",
		"unlocked":  true,
		"timestamp": nowISO(),
	})
}

type x402PaymentEnvelope struct {
	Scheme    string `json:"scheme"`
	Network   string `json:"network"`
	Resource  string `json:"resource"`
	Nonce     string `json:"nonce"`
	Amount    string `json:"amount"`
	Asset     string `json:"asset"`
	Timestamp string `json:"timestamp"`
	TXXDR     string `json:"txXDR"`
}

func (s *Server) validateX402PaymentHeader(header string, resource string) error {
	raw, err := base64.StdEncoding.DecodeString(header)
	if err != nil {
		return fmt.Errorf("payment header must be base64 JSON")
	}

	var envelope x402PaymentEnvelope
	if err := json.Unmarshal(raw, &envelope); err != nil {
		return fmt.Errorf("payment envelope is invalid JSON")
	}

	challenge, ok := s.store.ConsumeX402Nonce(envelope.Nonce)
	if !ok {
		return fmt.Errorf("unknown, expired, or already used nonce")
	}
	if envelope.Scheme != "stellar" {
		return fmt.Errorf("scheme must be stellar")
	}
	if envelope.Network != challenge.Network {
		return fmt.Errorf("network mismatch")
	}
	if envelope.Resource != resource || envelope.Resource != challenge.Resource {
		return fmt.Errorf("resource mismatch")
	}
	if envelope.Amount != challenge.Amount || envelope.Asset != challenge.Asset {
		return fmt.Errorf("amount or asset mismatch")
	}
	if strings.TrimSpace(envelope.TXXDR) == "" {
		return fmt.Errorf("txXDR is required")
	}
	timestamp, err := time.Parse(time.RFC3339, envelope.Timestamp)
	if err != nil {
		return fmt.Errorf("timestamp must be RFC3339")
	}
	if time.Since(timestamp) > 5*time.Minute || time.Until(timestamp) > 5*time.Minute {
		return fmt.Errorf("timestamp is outside the allowed window")
	}
	return nil
}

func (s *Server) handleX402PricingRules(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.ListX402PricingRules())
	case http.MethodPut:
		var input X402PricingRule
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		if input.Resource == "" || input.Amount == "" || input.Asset == "" {
			writeError(w, http.StatusBadRequest, "invalid_pricing_rule", "resource, amount, and asset are required")
			return
		}
		if input.MaxTimeout == 0 {
			input.MaxTimeout = 300
		}
		writeJSON(w, http.StatusOK, s.store.UpsertX402PricingRule(input))
	default:
		writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}

func (s *Server) handleEtherfuse(w http.ResponseWriter, r *http.Request, rest string) {
	switch {
	case rest == "status" && r.Method == http.MethodGet:
		writeJSON(w, http.StatusOK, s.etherfuseStatus())
	case rest == "assets" && r.Method == http.MethodGet:
		s.handleEtherfuseAssets(w, r)
	case rest == "quotes" && r.Method == http.MethodPost:
		s.proxyEtherfusePOST(w, r, "/ramp/quote")
	case rest == "orders" && r.Method == http.MethodPost:
		s.proxyEtherfusePOST(w, r, "/ramp/order")
	case strings.HasPrefix(rest, "orders/") && r.Method == http.MethodGet:
		orderID := strings.TrimPrefix(rest, "orders/")
		s.proxyEtherfuseGET(w, r, "/ramp/order/"+url.PathEscape(orderID), nil)
	case strings.HasPrefix(rest, "orders/") && strings.HasSuffix(rest, "/fiat-received") && r.Method == http.MethodPost:
		orderID := strings.TrimSuffix(strings.TrimPrefix(rest, "orders/"), "/fiat-received")
		s.handleEtherfuseFiatReceived(w, r, orderID)
	case rest == "webhook" && r.Method == http.MethodPost:
		s.handleEtherfuseWebhook(w, r)
	default:
		writeError(w, http.StatusNotFound, "not_found", "etherfuse route not found")
	}
}

func (s *Server) etherfuseStatus() map[string]any {
	return map[string]any{
		"mode":            s.cfg.EtherfuseMode,
		"configured":      s.cfg.EtherfuseAPIKey != "",
		"base_url":        s.cfg.EtherfuseBaseURL,
		"webhook_url":     s.cfg.EtherfuseWebhookURL,
		"webhook_verify":  s.cfg.EtherfuseWebhookVerify,
		"default_fiat":    s.cfg.EtherfuseDefaultFiat,
		"allowed_assets":  splitCSV(s.cfg.EtherfuseAllowedAssets),
		"auth_header":     "Authorization: <api-key>",
		"network":         s.cfg.StellarNetwork,
		"last_checked_at": nowISO(),
	}
}

func (s *Server) handleEtherfuseAssets(w http.ResponseWriter, r *http.Request) {
	wallet := r.URL.Query().Get("wallet")
	if wallet == "" {
		writeError(w, http.StatusBadRequest, "missing_wallet", "wallet query parameter is required")
		return
	}
	query := url.Values{}
	query.Set("blockchain", "stellar")
	query.Set("currency", valueOrDefault(r.URL.Query().Get("currency"), s.cfg.EtherfuseDefaultFiat))
	query.Set("wallet", wallet)
	if s.cfg.EtherfuseAPIKey == "" {
		writeError(w, http.StatusPreconditionFailed, "etherfuse_not_configured", "ETHERFUSE_API_KEY is required")
		return
	}
	s.proxyEtherfuseGET(w, r, "/ramp/assets", query)
}

func (s *Server) handleEtherfuseFiatReceived(w http.ResponseWriter, r *http.Request, orderID string) {
	if s.cfg.EtherfuseMode != "sandbox" {
		writeError(w, http.StatusForbidden, "sandbox_only", "fiat receipt signal is allowed only in sandbox")
		return
	}
	if s.cfg.EtherfuseAPIKey == "" {
		writeError(w, http.StatusPreconditionFailed, "etherfuse_not_configured", "ETHERFUSE_API_KEY is required")
		return
	}
	body := map[string]any{"order_id": orderID}
	payload, _ := json.Marshal(body)
	req, err := http.NewRequest(http.MethodPost, s.cfg.EtherfuseBaseURL+"/ramp/order/fiat_received", bytes.NewReader(payload))
	if err != nil {
		writeError(w, http.StatusInternalServerError, "etherfuse_request_error", err.Error())
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", s.cfg.EtherfuseAPIKey)
	s.forward(w, req)
}

func (s *Server) handleEtherfuseWebhook(w http.ResponseWriter, r *http.Request) {
	raw, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid_body", err.Error())
		return
	}
	if s.cfg.EtherfuseWebhookVerify {
		if !VerifyEtherfuseWebhook(raw, s.cfg.EtherfuseWebhookSecret, r.Header.Get("X-Signature")) {
			writeError(w, http.StatusUnauthorized, "invalid_signature", "invalid Etherfuse webhook signature")
			return
		}
	}
	var payload map[string]any
	if err := json.Unmarshal(raw, &payload); err != nil {
		writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
		return
	}
	s.store.RecordEtherfuseWebhook(payload)
	writeJSON(w, http.StatusOK, map[string]any{"accepted": true, "receivedAt": nowISO()})
}

func VerifyEtherfuseWebhook(payload []byte, secretBase64 string, signatureHeader string) bool {
	if secretBase64 == "" || signatureHeader == "" {
		return false
	}
	var body any
	if err := json.Unmarshal(payload, &body); err != nil {
		return false
	}
	canonical, err := json.Marshal(body)
	if err != nil {
		return false
	}
	key, err := base64.StdEncoding.DecodeString(secretBase64)
	if err != nil {
		return false
	}
	mac := hmac.New(sha256.New, key)
	mac.Write(canonical)
	expected := "sha256=" + hex.EncodeToString(mac.Sum(nil))
	return hmac.Equal([]byte(expected), []byte(signatureHeader))
}

func (s *Server) proxyEtherfuseGET(w http.ResponseWriter, _ *http.Request, endpoint string, query url.Values) {
	if s.cfg.EtherfuseAPIKey == "" {
		writeError(w, http.StatusPreconditionFailed, "etherfuse_not_configured", "ETHERFUSE_API_KEY is required")
		return
	}
	target := s.cfg.EtherfuseBaseURL + endpoint
	if len(query) > 0 {
		target += "?" + query.Encode()
	}
	req, err := http.NewRequest(http.MethodGet, target, nil)
	if err != nil {
		writeError(w, http.StatusInternalServerError, "etherfuse_request_error", err.Error())
		return
	}
	req.Header.Set("Authorization", s.cfg.EtherfuseAPIKey)
	s.forward(w, req)
}

func (s *Server) proxyEtherfusePOST(w http.ResponseWriter, r *http.Request, endpoint string) {
	if s.cfg.EtherfuseAPIKey == "" {
		writeError(w, http.StatusPreconditionFailed, "etherfuse_not_configured", "ETHERFUSE_API_KEY is required")
		return
	}
	if s.cfg.EtherfuseMode == "mock" {
		writeError(w, http.StatusPreconditionFailed, "etherfuse_mode_disabled", "ETHERFUSE_MODE=mock is disabled")
		return
	}
	raw, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, http.StatusBadRequest, "invalid_body", err.Error())
		return
	}
	req, err := http.NewRequest(http.MethodPost, s.cfg.EtherfuseBaseURL+endpoint, bytes.NewReader(raw))
	if err != nil {
		writeError(w, http.StatusInternalServerError, "etherfuse_request_error", err.Error())
		return
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", s.cfg.EtherfuseAPIKey)
	s.forward(w, req)
}

func (s *Server) forward(w http.ResponseWriter, req *http.Request) {
	res, err := s.httpClient.Do(req)
	if err != nil {
		writeError(w, http.StatusBadGateway, "etherfuse_unreachable", err.Error())
		return
	}
	defer res.Body.Close()
	for key, values := range res.Header {
		if strings.EqualFold(key, "Content-Length") {
			continue
		}
		for _, value := range values {
			w.Header().Add(key, value)
		}
	}
	w.WriteHeader(res.StatusCode)
	_, _ = io.Copy(w, res.Body)
}

func (s *Server) handleWebhooks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.ListWebhooks())
	case http.MethodPost:
		var input struct {
			URL    string   `json:"url"`
			Events []string `json:"events"`
		}
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		webhook, secret := s.store.CreateWebhook(input.URL, input.Events)
		writeJSON(w, http.StatusCreated, map[string]any{"id": webhook.ID, "url": webhook.URL, "events": webhook.Events, "secretPreview": webhook.SecretPreview, "active": webhook.Active, "createdAt": webhook.CreatedAt, "deliveryCount": webhook.DeliveryCount, "lastDeliveryStatus": webhook.LastDeliveryStatus, "secret": secret})
	default:
		writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}

func (s *Server) handleWebhook(w http.ResponseWriter, r *http.Request, rest string) {
	parts := strings.Split(rest, "/")
	id := parts[0]
	if len(parts) == 2 && parts[1] == "deliveries" && r.Method == http.MethodGet {
		writeJSON(w, http.StatusOK, s.store.ListWebhookDeliveries(id))
		return
	}
	if len(parts) == 2 && parts[1] == "test" && r.Method == http.MethodPost {
		result, ok := s.store.TestWebhook(id)
		if !ok {
			writeError(w, http.StatusNotFound, "webhook_not_found", "webhook not found")
			return
		}
		writeJSON(w, http.StatusOK, result)
		return
	}
	if len(parts) == 1 && r.Method == http.MethodPatch {
		var input struct {
			Active bool `json:"active"`
		}
		_ = readJSON(r, &input)
		webhook, ok := s.store.ToggleWebhook(id, input.Active)
		if !ok {
			writeError(w, http.StatusNotFound, "webhook_not_found", "webhook not found")
			return
		}
		writeJSON(w, http.StatusOK, webhook)
		return
	}
	if len(parts) == 1 && r.Method == http.MethodDelete {
		if !s.store.DeleteWebhook(id) {
			writeError(w, http.StatusNotFound, "webhook_not_found", "webhook not found")
			return
		}
		w.WriteHeader(http.StatusNoContent)
		return
	}
	writeError(w, http.StatusNotFound, "not_found", "webhook route not found")
}

func (s *Server) handleAPIKeys(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, s.store.ListAPIKeys())
	case http.MethodPost:
		var input struct {
			Name      string   `json:"name"`
			Scopes    []string `json:"scopes"`
			ExpiresAt string   `json:"expiresAt"`
		}
		if err := readJSON(r, &input); err != nil {
			writeError(w, http.StatusBadRequest, "invalid_json", err.Error())
			return
		}
		key, raw := s.store.CreateAPIKey(input.Name, input.Scopes, input.ExpiresAt)
		writeJSON(w, http.StatusCreated, map[string]any{"apiKey": key, "rawKey": raw})
	default:
		writeError(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}

func (s *Server) handleAPIKey(w http.ResponseWriter, r *http.Request, rest string) {
	parts := strings.Split(rest, "/")
	if len(parts) == 2 && parts[1] == "revoke" && r.Method == http.MethodPost {
		key, ok := s.store.RevokeAPIKey(parts[0])
		if !ok {
			writeError(w, http.StatusNotFound, "api_key_not_found", "api key not found")
			return
		}
		writeJSON(w, http.StatusOK, key)
		return
	}
	writeError(w, http.StatusNotFound, "not_found", "api key route not found")
}

func (s *Server) handleMCP(w http.ResponseWriter, r *http.Request) {
	var req struct {
		JSONRPC string         `json:"jsonrpc"`
		ID      any            `json:"id"`
		Method  string         `json:"method"`
		Params  map[string]any `json:"params"`
	}
	if err := readJSON(r, &req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{"jsonrpc": "2.0", "id": nil, "error": map[string]any{"code": -32700, "message": "invalid JSON"}})
		return
	}
	if req.JSONRPC == "" {
		req.JSONRPC = "2.0"
	}

	switch req.Method {
	case "initialize":
		writeJSON(w, http.StatusOK, map[string]any{
			"jsonrpc": "2.0",
			"id":      req.ID,
			"result": map[string]any{
				"protocolVersion": "2024-11-05",
				"capabilities":    map[string]any{"tools": map[string]any{}},
				"serverInfo":      map[string]string{"name": "kivo-mcp", "title": "Kivo Pay", "version": s.cfg.Version},
			},
		})
	case "tools/list":
		writeJSON(w, http.StatusOK, map[string]any{"jsonrpc": "2.0", "id": req.ID, "result": map[string]any{"tools": mcpTools()}})
	case "tools/call":
		s.handleMCPToolCall(w, req.ID, req.Params)
	default:
		writeJSON(w, http.StatusOK, map[string]any{
			"jsonrpc": "2.0",
			"id":      req.ID,
			"error":   map[string]any{"code": -32601, "message": "method not found"},
		})
	}
}

func (s *Server) handleMCPToolCall(w http.ResponseWriter, id any, params map[string]any) {
	name, _ := params["name"].(string)
	args, _ := params["arguments"].(map[string]any)
	var output any

	switch name {
	case "kivo_check_status":
		paymentID, _ := args["paymentId"].(string)
		if paymentID == "" {
			output = map[string]any{"status": "missing_payment_id"}
			break
		}
		payment, ok := s.store.GetPayment(paymentID)
		if !ok {
			output = map[string]any{"status": "not_found", "paymentId": paymentID}
			break
		}
		output = payment
	case "kivo_create_payment":
		input := CreatePaymentInput{
			FromDeviceID:  fmt.Sprint(args["fromDeviceId"]),
			ToDeviceID:    fmt.Sprint(args["toDeviceId"]),
			Amount:        fmt.Sprint(args["amount"]),
			AssetCode:     valueOrDefault(fmt.Sprint(args["assetCode"]), "USDC"),
			ConditionType: valueOrDefault(fmt.Sprint(args["conditionType"]), "none"),
			Memo:          fmt.Sprint(args["memo"]),
		}
		payment, err := s.store.CreatePayment(input)
		if err != nil {
			writeJSON(w, http.StatusOK, mcpToolResult(id, map[string]any{"error": err.Error()}, true))
			return
		}
		output = payment
	default:
		writeJSON(w, http.StatusOK, mcpToolResult(id, map[string]any{"error": "unknown tool: " + name}, true))
		return
	}

	writeJSON(w, http.StatusOK, mcpToolResult(id, output, false))
}

func mcpToolResult(id any, output any, isError bool) map[string]any {
	raw, _ := json.Marshal(output)
	return map[string]any{
		"jsonrpc": "2.0",
		"id":      id,
		"result": map[string]any{
			"content": []map[string]string{{"type": "text", "text": string(raw)}},
			"isError": isError,
		},
	}
}

func (s *Server) deployChecks() []DeployCheck {
	statusAPI := "ready"
	statusDB := "warning"
	if s.cfg.DatabaseURL != "" {
		statusDB = "ready"
	}
	statusWorkers := "warning"
	if s.cfg.RedisURL != "" {
		statusWorkers = "ready"
	}
	statusAuth := "warning"
	if s.cfg.RequireAuth && s.cfg.SupabaseJWTSecret != "" {
		statusAuth = "ready"
	}
	statusSecrets := "warning"
	if s.cfg.SecretEncryptionKey != "" {
		statusSecrets = "ready"
	}
	statusEtherfuse := "warning"
	if s.cfg.EtherfuseAPIKey != "" {
		statusEtherfuse = "ready"
	}
	return []DeployCheck{
		{ID: "api", Label: "Kivo API", Scope: "api", Status: statusAPI, Owner: "backend", Description: "Go API exposes dashboard, devices, payments, x402, and Etherfuse endpoints.", Value: "/v1/health"},
		{ID: "supabase-db", Label: "Supabase Postgres", Scope: "api", Status: statusDB, Owner: "platform", Description: "DATABASE_URL enables durable devices, payments, webhooks, API keys, x402 nonces, and Etherfuse events.", Value: maskConfigured(s.cfg.DatabaseURL)},
		{ID: "auth", Label: "Supabase Auth", Scope: "security", Status: statusAuth, Owner: "security", Description: "KIVO_REQUIRE_AUTH with SUPABASE_JWT_SECRET protects dashboard API routes while allowing x402 public challenge flow.", Value: mapBoolStatus(s.cfg.RequireAuth)},
		{ID: "workers", Label: "Redis workers", Scope: "workers", Status: statusWorkers, Owner: "backend", Description: "REDIS_URL is used as the MVP queue readiness signal before durable workflow migration.", Value: maskConfigured(s.cfg.RedisURL)},
		{ID: "x402", Label: "x402 replay guard", Scope: "security", Status: "ready", Owner: "protocol", Description: "Protected resources consume each nonce once and reject stale or mismatched X-PAYMENT headers.", Value: "/api/x402/data"},
		{ID: "mcp", Label: "MCP JSON-RPC", Scope: "api", Status: "ready", Owner: "agents", Description: "The /mcp endpoint exposes tool discovery and MVP payment/status tools for generic agents.", Value: "/mcp"},
		{ID: "etherfuse", Label: "Etherfuse sandbox", Scope: "stellar", Status: statusEtherfuse, Owner: "anchor", Description: "ETHERFUSE_API_KEY controls live sandbox/production calls.", Value: s.cfg.EtherfuseMode},
		{ID: "security", Label: "Secret isolation", Scope: "security", Status: statusSecrets, Owner: "platform", Description: "KIVO_SECRET_ENCRYPTION_KEY protects device and webhook secrets; Etherfuse credentials stay server-side only."},
	}
}

func maskConfigured(value string) string {
	if strings.TrimSpace(value) == "" {
		return "not configured"
	}
	return "configured"
}

func (s *Server) deployServices(r *http.Request) []DeployServiceStatus {
	base := "http://" + r.Host
	now := nowISO()
	return []DeployServiceStatus{
		{ID: "api", Name: "Kivo Go API", Environment: "local", Status: "online", Region: "local", URL: base + "/v1/health", Description: "MVP API process.", UpdatedAt: now},
		{ID: "etherfuse", Name: "Etherfuse Anchor", Environment: s.cfg.EtherfuseMode, Status: mapBoolStatus(s.cfg.EtherfuseAPIKey != ""), URL: s.cfg.EtherfuseBaseURL, Description: "Sandbox/production anchor proxy.", UpdatedAt: now},
	}
}

func mapBoolStatus(ok bool) string {
	if ok {
		return "online"
	}
	return "degraded"
}

func mcpTools() []map[string]any {
	return []map[string]any{
		{"id": "tool_create", "name": "kivo_create_payment", "title": "Create payment", "description": "Create an M2M payment between registered devices.", "safeForAutoUse": false, "inputSchema": map[string]any{"type": "object"}, "exampleInput": map[string]any{"amount": "0.0500000"}},
		{"id": "tool_status", "name": "kivo_check_status", "title": "Check status", "description": "Check payment or device status.", "safeForAutoUse": true, "inputSchema": map[string]any{"type": "object"}, "exampleInput": map[string]any{"paymentId": "pay_<id>"}},
	}
}

func mcpConfig(r *http.Request) map[string]any {
	base := "http://" + r.Host
	return map[string]any{
		"server":         map[string]any{"name": "kivo-mcp", "transport": "http", "url": base + "/mcp"},
		"env":            map[string]string{"KIVO_API_URL": base, "KIVO_API_KEY": "env:KIVO_API_KEY", "KIVO_DEVICE_ID": "env:KIVO_DEVICE_ID", "KIVO_NETWORK": "testnet"},
		"tools":          []string{"kivo_create_payment", "kivo_check_status"},
		"approvalPolicy": map[string]any{"autoApproveSafeTools": true, "maxAutoPaymentAmount": "0.5000000 USDC", "requireHumanFor": []string{"kivo_create_payment"}},
		"sampleConfig":   map[string]any{"mcpServers": map[string]any{"kivo": map[string]any{"url": base + "/mcp"}}},
	}
}

func workflows() []Workflow {
	now := nowISO()
	return []Workflow{
		{ID: "wf_payment_worker", Name: "Payment settlement worker", Type: "payment_worker", Status: "healthy", Engine: "redis-worker", Trigger: "payments.created", CreatedAt: now, UpdatedAt: now, Steps: []WorkflowStep{{ID: "queue", Label: "Queue", Status: "done", Description: "Payment accepted"}, {ID: "settle", Label: "Settle", Status: "running", Description: "Submit to Stellar testnet"}}},
		{ID: "wf_etherfuse_webhook", Name: "Etherfuse webhook ingest", Type: "webhook_worker", Status: "healthy", Engine: "redis-worker", Trigger: "etherfuse.order_updated", CreatedAt: now, UpdatedAt: now, Steps: []WorkflowStep{{ID: "verify", Label: "Verify", Status: "done", Description: "Validate X-Signature"}, {ID: "store", Label: "Store", Status: "running", Description: "Persist event"}}},
	}
}

func readJSON(r *http.Request, target any) error {
	defer r.Body.Close()
	return json.NewDecoder(r.Body).Decode(target)
}

func writeJSON(w http.ResponseWriter, status int, payload any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func writeError(w http.ResponseWriter, status int, code string, message string) {
	writeJSON(w, status, map[string]any{"error": code, "message": message, "status": status})
}

func splitCSV(value string) []string {
	parts := strings.Split(value, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		part = strings.TrimSpace(part)
		if part != "" {
			out = append(out, part)
		}
	}
	return out
}

func valueOrDefault(value string, fallback string) string {
	if strings.TrimSpace(value) == "" || value == "<nil>" {
		return fallback
	}
	return value
}

func parseFloat(value string) float64 {
	out, _ := strconv.ParseFloat(value, 64)
	return out
}
