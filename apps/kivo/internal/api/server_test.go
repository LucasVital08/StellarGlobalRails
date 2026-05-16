package api

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestHealthAndDashboardContract(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{Version: "test"})

	health := doJSON(t, server, http.MethodGet, "/v1/health", nil)
	if health["api"] != "ok" || health["db"] != "ok" || health["stellar"] != "ok" {
		t.Fatalf("unexpected health payload: %#v", health)
	}

	summary := doJSON(t, server, http.MethodGet, "/v1/dashboard", nil)
	if _, ok := summary["totalDevices"].(float64); !ok {
		t.Fatalf("dashboard summary should expose totalDevices, got %#v", summary)
	}
	if _, ok := summary["health"].(map[string]any); !ok {
		t.Fatalf("dashboard summary should include health, got %#v", summary)
	}
}

func TestDevicePaymentAndX402Flow(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{Version: "test", X402PlatformKey: "GDESTINATION"})

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

	challenge := doJSON(t, server, http.MethodGet, "/v1/x402/challenge?resource=/api/x402/data", nil)
	if challenge["status"].(float64) != 402 {
		t.Fatalf("expected 402 challenge, got %#v", challenge)
	}
	if challenge["nonce"] == "" || challenge["requiredHeader"] == "" {
		t.Fatalf("challenge must include nonce and requiredHeader: %#v", challenge)
	}

	paid := doJSON(t, server, http.MethodPost, "/v1/x402/pay", map[string]any{"nonce": challenge["nonce"]})
	if paid["status"].(float64) != 200 || paid["paymentHeader"] == "" {
		t.Fatalf("expected paid x402 response, got %#v", paid)
	}
}

func TestEtherfuseStatusAndWebhookContract(t *testing.T) {
	server := NewServer(NewMemoryStore(), Config{
		Version:                  "test",
		EtherfuseMode:           "sandbox",
		EtherfuseBaseURL:        "https://api.sand.etherfuse.com",
		EtherfuseAPIKey:         "secret",
		EtherfuseWebhookURL:     "https://api.example.test/v1/etherfuse/webhook",
		EtherfuseWebhookVerify:  false,
		EtherfuseDefaultFiat:    "MXN",
		EtherfuseAllowedAssets:  "USDC:GTEST",
	})

	status := doJSON(t, server, http.MethodGet, "/v1/etherfuse/status", nil)
	if status["configured"] != true || status["mode"] != "sandbox" {
		t.Fatalf("unexpected etherfuse status: %#v", status)
	}

	evt := doJSON(t, server, http.MethodPost, "/v1/etherfuse/webhook", map[string]any{
		"type":    "order_updated",
		"orderId": "ord_test",
		"status":  "completed",
	})
	if evt["accepted"] != true {
		t.Fatalf("webhook should be accepted in unverified sandbox mode, got %#v", evt)
	}
}

func doJSON(t *testing.T, handler http.Handler, method string, path string, body any) map[string]any {
	t.Helper()

	var reader *bytes.Reader
	if body != nil {
		payload, err := json.Marshal(body)
		if err != nil {
			t.Fatalf("marshal request: %v", err)
		}
		reader = bytes.NewReader(payload)
	} else {
		reader = bytes.NewReader(nil)
	}

	req := httptest.NewRequest(method, path, reader)
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	if rec.Code < 200 || rec.Code > 299 {
		t.Fatalf("%s %s returned %d: %s", method, path, rec.Code, rec.Body.String())
	}

	var out map[string]any
	if err := json.Unmarshal(rec.Body.Bytes(), &out); err != nil {
		t.Fatalf("decode response %q: %v", rec.Body.String(), err)
	}
	return out
}
