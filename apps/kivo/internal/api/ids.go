package api

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strings"
	"time"
)

const ownerID = "11111111-1111-4111-8111-111111111111"

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
