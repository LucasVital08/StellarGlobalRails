package api

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

type AuthIdentity struct {
	UserID string
	Email  string
	Role   string
}

func GenerateAPIKey(environment string) (raw string, hash string, preview string, err error) {
	prefix := "kivo_live_"
	if environment == "test" || environment == "testnet" {
		prefix = "kivo_test_"
	}

	buf := make([]byte, 32)
	if _, err := rand.Read(buf); err != nil {
		return "", "", "", fmt.Errorf("generate api key entropy: %w", err)
	}

	raw = prefix + hex.EncodeToString(buf)
	return raw, HashAPIKey(raw), previewSecret(raw), nil
}

func HashAPIKey(raw string) string {
	sum := sha256.Sum256([]byte(raw))
	return hex.EncodeToString(sum[:])
}

func VerifyAPIKeyHash(raw string, expectedHash string) bool {
	actual := HashAPIKey(raw)
	if len(actual) != len(expectedHash) {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(actual), []byte(expectedHash)) == 1
}

func ValidateSupabaseJWT(tokenString string, jwtSecret string) (AuthIdentity, error) {
	if strings.TrimSpace(jwtSecret) == "" {
		return AuthIdentity{}, errors.New("supabase jwt secret is not configured")
	}

	key, err := base64.StdEncoding.DecodeString(jwtSecret)
	if err != nil {
		return AuthIdentity{}, fmt.Errorf("invalid jwt secret encoding: %w", err)
	}

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected jwt signing method: %v", token.Header["alg"])
		}
		return key, nil
	})
	if err != nil {
		return AuthIdentity{}, err
	}
	if token == nil || !token.Valid {
		return AuthIdentity{}, errors.New("invalid jwt")
	}

	role, _ := claims["role"].(string)
	if role != "authenticated" {
		return AuthIdentity{}, errors.New("jwt role must be authenticated")
	}

	sub, _ := claims["sub"].(string)
	if strings.TrimSpace(sub) == "" {
		return AuthIdentity{}, errors.New("jwt sub is required")
	}

	email, _ := claims["email"].(string)
	return AuthIdentity{UserID: sub, Email: email, Role: role}, nil
}

func ValidateSupabaseAccessToken(ctx context.Context, client *http.Client, supabaseURL string, apiKey string, token string) (AuthIdentity, error) {
	supabaseURL = strings.TrimRight(strings.TrimSpace(supabaseURL), "/")
	apiKey = strings.TrimSpace(apiKey)
	token = strings.TrimSpace(token)
	if supabaseURL == "" {
		return AuthIdentity{}, errors.New("supabase url is not configured")
	}
	if apiKey == "" {
		return AuthIdentity{}, errors.New("supabase api key is not configured")
	}
	if token == "" {
		return AuthIdentity{}, errors.New("supabase access token is required")
	}
	if client == nil {
		client = http.DefaultClient
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodGet, supabaseURL+"/auth/v1/user", nil)
	if err != nil {
		return AuthIdentity{}, fmt.Errorf("create supabase auth request: %w", err)
	}
	req.Header.Set("Accept", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("apikey", apiKey)

	resp, err := client.Do(req)
	if err != nil {
		return AuthIdentity{}, fmt.Errorf("call supabase auth: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	if err != nil {
		return AuthIdentity{}, fmt.Errorf("read supabase auth response: %w", err)
	}
	if resp.StatusCode < http.StatusOK || resp.StatusCode >= http.StatusMultipleChoices {
		return AuthIdentity{}, fmt.Errorf("supabase auth rejected token with status %d", resp.StatusCode)
	}

	var payload struct {
		ID    string `json:"id"`
		Email string `json:"email"`
		Role  string `json:"role"`
		Aud   string `json:"aud"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return AuthIdentity{}, fmt.Errorf("decode supabase auth response: %w", err)
	}

	role := strings.TrimSpace(payload.Role)
	if role == "" {
		role = strings.TrimSpace(payload.Aud)
	}
	if role != "authenticated" {
		return AuthIdentity{}, errors.New("supabase user role must be authenticated")
	}

	userID := strings.TrimSpace(payload.ID)
	if userID == "" {
		return AuthIdentity{}, errors.New("supabase user id is required")
	}

	return AuthIdentity{UserID: userID, Email: payload.Email, Role: role}, nil
}
