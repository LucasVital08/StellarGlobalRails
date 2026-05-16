package api

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/stellar/go-stellar-sdk/keypair"
)

type StellarKeypair struct {
	PublicKey string
	Secret    string
}

func GenerateStellarKeypair() (StellarKeypair, error) {
	kp, err := keypair.Random()
	if err != nil {
		return StellarKeypair{}, fmt.Errorf("generate stellar keypair: %w", err)
	}
	return StellarKeypair{PublicKey: kp.Address(), Secret: kp.Seed()}, nil
}

func FundTestnetAccount(horizonURL string, publicKey string) error {
	if _, err := keypair.ParseAddress(publicKey); err != nil {
		return fmt.Errorf("invalid stellar public key: %w", err)
	}
	if !strings.Contains(horizonURL, "testnet") {
		return fmt.Errorf("friendbot funding is available only on Stellar testnet")
	}

	endpoint := strings.TrimRight(horizonURL, "/") + "/friendbot?addr=" + url.QueryEscape(publicKey)
	client := &http.Client{Timeout: 12 * time.Second}
	res, err := client.Get(endpoint)
	if err != nil {
		return fmt.Errorf("friendbot request failed: %w", err)
	}
	defer res.Body.Close()
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return fmt.Errorf("friendbot returned %s", res.Status)
	}
	return nil
}

func SubmitStellarTransaction(ctx context.Context, horizonURL string, txXDR string) (StellarSettlement, error) {
	txXDR = strings.TrimSpace(txXDR)
	if txXDR == "" {
		return StellarSettlement{}, fmt.Errorf("txXDR is required")
	}
	if strings.TrimSpace(horizonURL) == "" {
		return StellarSettlement{}, fmt.Errorf("STELLAR_HORIZON_URL is required")
	}

	form := url.Values{}
	form.Set("tx", txXDR)
	endpoint := strings.TrimRight(horizonURL, "/") + "/transactions"
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, strings.NewReader(form.Encode()))
	if err != nil {
		return StellarSettlement{}, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 20 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return StellarSettlement{}, fmt.Errorf("submit stellar transaction: %w", err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return StellarSettlement{}, fmt.Errorf("read horizon response: %w", err)
	}
	if res.StatusCode < 200 || res.StatusCode > 299 {
		return StellarSettlement{}, fmt.Errorf("horizon submit failed with %s: %s", res.Status, strings.TrimSpace(string(body)))
	}

	var payload struct {
		Hash       string `json:"hash"`
		Ledger     int64  `json:"ledger"`
		FeeCharged any    `json:"fee_charged"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return StellarSettlement{}, fmt.Errorf("decode horizon response: %w", err)
	}
	if strings.TrimSpace(payload.Hash) == "" {
		return StellarSettlement{}, fmt.Errorf("horizon response missing transaction hash")
	}
	fee := ""
	switch value := payload.FeeCharged.(type) {
	case string:
		fee = value
	case float64:
		fee = fmt.Sprintf("%.0f", value)
	}
	return StellarSettlement{Hash: payload.Hash, Ledger: payload.Ledger, FeeCharged: fee}, nil
}
