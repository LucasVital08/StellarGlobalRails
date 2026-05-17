package api

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/stellar/go-stellar-sdk/keypair"
)

func TestHealthAndDashboardContract(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{Version: "test"})

	health := doJSON(t, server, http.MethodGet, "/v1/health", nil)
	if health["api"] != "ok" || health["stellar"] != "ok" {
		t.Fatalf("unexpected health payload: %#v", health)
	}
	if _, ok := health["db"].(string); !ok {
		t.Fatalf("health payload should expose db status, got %#v", health)
	}

	summary := doJSON(t, server, http.MethodGet, "/v1/dashboard", nil)
	if _, ok := summary["totalDevices"].(float64); !ok {
		t.Fatalf("dashboard summary should expose totalDevices, got %#v", summary)
	}
	if _, ok := summary["health"].(map[string]any); !ok {
		t.Fatalf("dashboard summary should include health, got %#v", summary)
	}
}

func TestProtectedRoutesRequireJWTOrAPIKeyWhenEnabled(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{Version: "test", RequireAuth: true})

	blocked := doRequest(server, http.MethodGet, "/v1/dashboard", nil, nil)
	if blocked.Code != http.StatusUnauthorized {
		t.Fatalf("expected 401 for dashboard without auth, got %d", blocked.Code)
	}

	allowed := doRequest(server, http.MethodGet, "/v1/dashboard", nil, map[string]string{"X-API-Key": "kivo_test_local"})
	if allowed.Code != http.StatusOK {
		t.Fatalf("expected dashboard with api key to pass, got %d: %s", allowed.Code, allowed.Body.String())
	}
}

func TestProtectedRoutesAcceptSupabaseAccessToken(t *testing.T) {
	authServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/auth/v1/user" {
			t.Fatalf("unexpected Supabase Auth path: %s", r.URL.Path)
		}
		if r.Header.Get("Authorization") != "Bearer user-access-token" {
			t.Fatalf("unexpected authorization header: %q", r.Header.Get("Authorization"))
		}
		if r.Header.Get("apikey") != "server-key" {
			t.Fatalf("unexpected apikey header: %q", r.Header.Get("apikey"))
		}
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"id":"11111111-1111-4111-8111-111111111111","email":"operator@kivo.pay","role":"authenticated"}`))
	}))
	defer authServer.Close()

	server := NewServer(NewMemoryStore(), Config{
		Version:                "test",
		RequireAuth:            true,
		SupabaseURL:            authServer.URL,
		SupabaseServiceRoleKey: "server-key",
	})
	allowed := doRequest(server, http.MethodGet, "/v1/dashboard", nil, map[string]string{"Authorization": "Bearer user-access-token"})
	if allowed.Code != http.StatusOK {
		t.Fatalf("expected dashboard with Supabase token to pass, got %d: %s", allowed.Code, allowed.Body.String())
	}
}

func TestDevicePaymentAndX402Flow(t *testing.T) {
	horizon := newHorizonStub(t)
	server := NewServer(NewMemoryStore(), Config{Version: "test", X402PlatformKey: "GDESTINATION", StellarHorizonURL: horizon.URL})

	from := doJSON(t, server, http.MethodPost, "/v1/devices", map[string]any{
		"name":     "EV Test Device",
		"metadata": map[string]string{"type": "vehicle"},
	})
	to := doJSON(t, server, http.MethodPost, "/v1/devices", map[string]any{
		"name":     "Charger Test Device",
		"metadata": map[string]string{"type": "charger"},
	})

	fromDevice := from["device"].(map[string]any)
	toDevice := to["device"].(map[string]any)
	if from["apiKey"] == "" {
		t.Fatalf("device registration must return one-time apiKey")
	}
	if !strings.HasPrefix(fromDevice["stellarPublicKey"].(string), "G") {
		t.Fatalf("expected stellar-looking public key, got %#v", fromDevice["stellarPublicKey"])
	}
	if _, err := keypair.ParseAddress(fromDevice["stellarPublicKey"].(string)); err != nil {
		t.Fatalf("registered device must have a valid Stellar public key: %v", err)
	}

	payment := doJSON(t, server, http.MethodPost, "/v1/payments", map[string]any{
		"fromDeviceId":  fromDevice["id"],
		"toDeviceId":    toDevice["id"],
		"amount":        "0.0500000",
		"assetCode":     "USDC",
		"conditionType": "none",
		"memo":          "test payment",
	})
	if payment["status"] != "processing" {
		t.Fatalf("none-condition payment should move to processing, got %#v", payment["status"])
	}
	executed := doJSON(t, server, http.MethodPost, "/v1/payments/"+payment["id"].(string)+"/execute", map[string]any{"txXDR": "AAAA_REAL_PAYMENT_XDR"})
	if executed["stellarHash"] != "stellar_hash_real" {
		t.Fatalf("execute must attach the submitted Stellar hash, got %#v", executed)
	}

	challenge := doJSON(t, server, http.MethodGet, "/v1/x402/challenge?resource=/api/x402/data", nil)
	if challenge["status"].(float64) != 402 {
		t.Fatalf("expected 402 challenge, got %#v", challenge)
	}
	if challenge["nonce"] == "" || challenge["requiredHeader"] == "" {
		t.Fatalf("challenge must include nonce and requiredHeader: %#v", challenge)
	}

	paid := doJSON(t, server, http.MethodPost, "/v1/x402/pay", map[string]any{"nonce": challenge["nonce"], "txXDR": "AAAA_REAL_X402_XDR"})
	if paid["status"].(float64) != 200 || paid["paymentHeader"] == "" || paid["stellarHash"] != "stellar_hash_real" {
		t.Fatalf("expected paid x402 response, got %#v", paid)
	}
	envelope := decodePaymentHeader(t, paid["paymentHeader"].(string))
	if envelope["txXDR"] != "AAAA_REAL_X402_XDR" || strings.Contains(envelope["txXDR"].(string), "MVP") {
		t.Fatalf("payment header must contain the submitted XDR, got %#v", envelope)
	}
}

func TestProtectedX402DataRequiresValidFreshPaymentHeader(t *testing.T) {
	horizon := newHorizonStub(t)
	server := NewServer(NewMemoryStore(), Config{Version: "test", X402PlatformKey: "GDESTINATION", StellarHorizonURL: horizon.URL})

	challenge := doJSON(t, server, http.MethodGet, "/v1/x402/challenge?resource=/api/x402/data", nil)
	paid := doJSON(t, server, http.MethodPost, "/v1/x402/pay", map[string]any{"nonce": challenge["nonce"], "txXDR": "AAAA_REAL_X402_XDR"})
	header := paid["paymentHeader"].(string)

	rec := doRequest(server, http.MethodGet, "/api/x402/data", nil, map[string]string{"X-PAYMENT": header})
	if rec.Code != http.StatusOK {
		t.Fatalf("valid payment header should unlock resource, got %d: %s", rec.Code, rec.Body.String())
	}

	replay := doRequest(server, http.MethodGet, "/api/x402/data", nil, map[string]string{"X-PAYMENT": header})
	if replay.Code != http.StatusBadRequest {
		t.Fatalf("replayed payment header should be rejected, got %d: %s", replay.Code, replay.Body.String())
	}
}

func TestX402PayRequiresRealSubmittedTransactionXDR(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{Version: "test", X402PlatformKey: "GDESTINATION"})

	challenge := doJSON(t, server, http.MethodGet, "/v1/x402/challenge?resource=/api/x402/data", nil)
	rec := doRequest(server, http.MethodPost, "/v1/x402/pay", jsonReader(t, map[string]any{"nonce": challenge["nonce"]}), nil)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("x402 pay without txXDR must fail instead of fabricating a payment header, got %d: %s", rec.Code, rec.Body.String())
	}
}

func TestStoreFromConfigRequiresDatabaseURL(t *testing.T) {
	store, err := NewStoreFromConfig(context.Background(), Config{})
	if err == nil {
		store.Close()
		t.Fatalf("NewStoreFromConfig must reject missing DATABASE_URL instead of falling back to MemoryStore")
	}
}

func TestStoreFromConfigRequiresSecretEncryptionKey(t *testing.T) {
	store, err := NewStoreFromConfig(context.Background(), Config{DatabaseURL: "postgres://example.invalid/kivo"})
	if err == nil {
		store.Close()
		t.Fatalf("NewStoreFromConfig must reject missing KIVO_SECRET_ENCRYPTION_KEY instead of using a local fallback")
	}
}

func TestMCPServerExposesOnlyRealTools(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{Version: "test"})

	tools := doJSON(t, server, http.MethodPost, "/mcp", map[string]any{
		"jsonrpc": "2.0",
		"id":      1,
		"method":  "tools/list",
		"params":  map[string]any{},
	})
	result := tools["result"].(map[string]any)
	list := result["tools"].([]any)
	if len(list) == 0 {
		t.Fatalf("MCP tools/list should expose Kivo tools, got %#v", tools)
	}
	for _, item := range list {
		tool := item.(map[string]any)
		if strings.Contains(tool["name"].(string), "simulate") {
			t.Fatalf("MCP tools/list must not expose simulation tools in zero-mock mode: %#v", tool)
		}
	}

	call := doJSON(t, server, http.MethodPost, "/mcp", map[string]any{
		"jsonrpc": "2.0",
		"id":      2,
		"method":  "tools/call",
		"params": map[string]any{
			"name":      "kivo_check_status",
			"arguments": map[string]any{"paymentId": "pay_demo_x402"},
		},
	})
	callResult := call["result"].(map[string]any)
	if callResult["isError"] == true {
		t.Fatalf("MCP status call should succeed, got %#v", call)
	}
}

func TestEtherfuseAssetsRequireRealConfiguration(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{Version: "test", EtherfuseMode: "devnet"})

	rec := doRequest(server, http.MethodGet, "/v1/etherfuse/assets?wallet=GDESTINATION", nil, nil)
	if rec.Code != http.StatusPreconditionFailed {
		t.Fatalf("Etherfuse assets without API key must fail instead of returning mock assets, got %d: %s", rec.Code, rec.Body.String())
	}
}

func TestEtherfuseStatusAndWebhookContract(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{
		Version:                "test",
		EtherfuseMode:          "devnet",
		EtherfuseBaseURL:       "https://api.sand.etherfuse.com",
		EtherfuseAPIKey:        "secret",
		EtherfuseWebhookURL:    "https://api.example.test/v1/etherfuse/webhook",
		EtherfuseWebhookVerify: false,
		EtherfuseDefaultFiat:   "MXN",
		EtherfuseAllowedAssets: "USDC:GTEST",
	})

	status := doJSON(t, server, http.MethodGet, "/v1/etherfuse/status", nil)
	if status["configured"] != true || status["mode"] != "devnet" {
		t.Fatalf("unexpected etherfuse status: %#v", status)
	}

	evt := doJSON(t, server, http.MethodPost, "/v1/etherfuse/webhook", map[string]any{
		"type":    "order_updated",
		"orderId": "ord_test",
		"status":  "completed",
	})
	if evt["accepted"] != true {
		t.Fatalf("webhook should be accepted in unverified devnet mode, got %#v", evt)
	}
}

func TestEtherfuseOnboardingURLProxy(t *testing.T) {
	var forwardedPath string
	var forwardedBody map[string]any
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		forwardedPath = r.URL.Path
		if err := json.NewDecoder(r.Body).Decode(&forwardedBody); err != nil {
			t.Fatalf("decode forwarded body: %v", err)
		}
		writeJSON(w, http.StatusOK, map[string]any{"presigned_url": "https://onboard.etherfuse.example/session"})
	}))
	t.Cleanup(upstream.Close)

	server := NewServer(NewMemoryStore(), Config{
		Version:          "test",
		EtherfuseMode:    "devnet",
		EtherfuseBaseURL: upstream.URL,
		EtherfuseAPIKey:  "secret",
	})

	result := doJSON(t, server, http.MethodPost, "/v1/etherfuse/onboarding-url", map[string]any{
		"customerId":    "2a1d9134-e6d0-4b7e-bf88-00b79c25155b",
		"bankAccountId": "80dd9b70-581f-4b43-b634-b4cfdd481d6d",
		"publicKey":     "GDESTINATION",
		"blockchain":    "stellar",
	})

	if forwardedPath != "/ramp/onboarding-url" {
		t.Fatalf("unexpected Etherfuse path: %s", forwardedPath)
	}
	if forwardedBody["customerId"] != "2a1d9134-e6d0-4b7e-bf88-00b79c25155b" {
		t.Fatalf("expected onboarding payload to be forwarded, got %#v", forwardedBody)
	}
	if result["presigned_url"] == "" {
		t.Fatalf("expected onboarding url response, got %#v", result)
	}
}

func TestEtherfuseDevnetFiatReceivedUsesDocumentedOrderID(t *testing.T) {
	var forwardedPath string
	var forwardedBody map[string]any
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		forwardedPath = r.URL.Path
		if err := json.NewDecoder(r.Body).Decode(&forwardedBody); err != nil {
			t.Fatalf("decode forwarded body: %v", err)
		}
		writeJSON(w, http.StatusOK, map[string]any{"orderId": forwardedBody["orderId"], "status": "funded"})
	}))
	t.Cleanup(upstream.Close)

	server := NewServer(NewMemoryStore(), Config{
		Version:          "test",
		EtherfuseMode:    "devnet",
		EtherfuseBaseURL: upstream.URL,
		EtherfuseAPIKey:  "secret",
	})

	result := doJSON(t, server, http.MethodPost, "/v1/etherfuse/orders/ed14a9d7-f9be-4584-8f11-527d32ddab31/simulate-fiat-received", nil)

	if forwardedPath != "/ramp/order/fiat_received" {
		t.Fatalf("unexpected Etherfuse path: %s", forwardedPath)
	}
	if forwardedBody["orderId"] != "ed14a9d7-f9be-4584-8f11-527d32ddab31" {
		t.Fatalf("expected Etherfuse devnet orderId field, got %#v", forwardedBody)
	}
	if result["status"] != "funded" {
		t.Fatalf("expected upstream response to be forwarded, got %#v", result)
	}
}

func doJSON(t *testing.T, handler http.Handler, method string, path string, body any) map[string]any {
	t.Helper()

	reader := jsonReader(t, body)

	rec := doRequest(handler, method, path, reader, nil)
	if rec.Code < 200 || rec.Code > 299 {
		t.Fatalf("%s %s returned %d: %s", method, path, rec.Code, rec.Body.String())
	}

	var out map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
		t.Fatalf("decode response %q: %v", rec.Body.String(), err)
	}
	return out
}

func jsonReader(t *testing.T, body any) *bytes.Reader {
	t.Helper()
	if body == nil {
		return bytes.NewReader(nil)
	}
	payload, err := json.Marshal(body)
	if err != nil {
		t.Fatalf("marshal request: %v", err)
	}
	return bytes.NewReader(payload)
}

func doRequest(handler http.Handler, method string, path string, body *bytes.Reader, headers map[string]string) *httptest.ResponseRecorder {
	if body == nil {
		body = bytes.NewReader(nil)
	}
	req := httptest.NewRequest(method, path, body)
	if body.Len() > 0 {
		req.Header.Set("Content-Type", "application/json")
	}
	for key, value := range headers {
		req.Header.Set(key, value)
	}
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	return rec
}

func newHorizonStub(t *testing.T) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/transactions" || r.Method != http.MethodPost {
			http.NotFound(w, r)
			return
		}
		if err := r.ParseForm(); err != nil {
			t.Fatalf("parse form: %v", err)
		}
		if r.Form.Get("tx") == "" {
			t.Fatalf("expected submitted tx XDR")
		}
		writeJSON(w, http.StatusOK, map[string]any{"hash": "stellar_hash_real", "ledger": 12345})
	}))
}

func decodePaymentHeader(t *testing.T, header string) map[string]any {
	t.Helper()
	raw, err := base64.StdEncoding.DecodeString(header)
	if err != nil {
		t.Fatalf("decode payment header: %v", err)
	}
	var out map[string]any
	if err := json.Unmarshal(raw, &out); err != nil {
		t.Fatalf("unmarshal payment header: %v", err)
	}
	return out
}
