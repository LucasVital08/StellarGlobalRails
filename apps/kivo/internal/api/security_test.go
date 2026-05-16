package api

import (
	"testing"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func TestAPIKeyLifecycleHashesRawKeyAndVerifiesConstantTime(t *testing.T) {
	raw, hash, preview, err := GenerateAPIKey("test")
	if err != nil {
		t.Fatalf("GenerateAPIKey returned error: %v", err)
	}
	if raw == "" || hash == "" || preview == "" {
		t.Fatalf("expected raw key, hash, and preview, got raw=%q hash=%q preview=%q", raw, hash, preview)
	}
	if raw == hash {
		t.Fatalf("raw key must never be stored as its own hash")
	}
	if !VerifyAPIKeyHash(raw, hash) {
		t.Fatalf("generated key should verify against its hash")
	}
	if VerifyAPIKeyHash(raw+"tampered", hash) {
		t.Fatalf("tampered key must not verify")
	}
}

func TestValidateSupabaseJWTRequiresAuthenticatedRole(t *testing.T) {
	secret := "local-test-jwt-secret"
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":   "11111111-1111-4111-8111-111111111111",
		"email": "operator@kivo.pay",
		"role":  "authenticated",
		"exp":   time.Now().Add(time.Hour).Unix(),
	})
	signed, err := token.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("sign jwt: %v", err)
	}

	identity, err := ValidateSupabaseJWT(signed, secret)
	if err != nil {
		t.Fatalf("valid JWT should pass: %v", err)
	}
	if identity.UserID != "11111111-1111-4111-8111-111111111111" || identity.Email != "operator@kivo.pay" {
		t.Fatalf("unexpected identity: %#v", identity)
	}

	anonymous := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub":  "22222222-2222-4222-8222-222222222222",
		"role": "anon",
		"exp":  time.Now().Add(time.Hour).Unix(),
	})
	anonSigned, err := anonymous.SignedString([]byte(secret))
	if err != nil {
		t.Fatalf("sign anon jwt: %v", err)
	}
	if _, err := ValidateSupabaseJWT(anonSigned, secret); err == nil {
		t.Fatalf("anon role must not be accepted for dashboard API")
	}
}
