package api

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"errors"
	"fmt"
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

	claims := jwt.MapClaims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected jwt signing method: %v", token.Header["alg"])
		}
		return []byte(jwtSecret), nil
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
