# Kivo Delivery Readiness

Last checked: 2026-05-17

## Current Status

- Frontend deploy: Vercel is already configured by the operator.
- Frontend build: passes locally with `npm run build`.
- API code: passes locally with `go test ./cmd/... ./internal/...`.
- Product UI: Checkout, Deploy, and x402 no longer expose test-harness wording in normal mode.
- Dev-only controls: hidden unless `VITE_KIVO_ENABLE_DEV_CONTROLS=true`.

## Current Blockers

1. Fly.io API is not serving the Kivo backend.
   - `https://stellarglobalrails.fly.dev/v1/health` returns `502`.
   - `flyctl status -a stellarglobalrails` returns a Fly trial/billing blocker.
   - Resolution: add/confirm billing in Fly, then redeploy the `apps/kivo` service.

2. Local Supabase/Postgres is not reachable.
   - `127.0.0.1:54322` is closed.
   - Docker Desktop Linux engine is not currently available to the CLI.
   - Resolution: start Docker Desktop, then run `supabase start --workdir .`.

3. Local Etherfuse credentials are incomplete.
   - `ETHERFUSE_API_KEY` is missing in `apps/kivo/.env`.
   - `ETHERFUSE_WEBHOOK_SECRET` is missing in `apps/kivo/.env`.
   - Resolution: add the Etherfuse Devnet API key and generated webhook secret.

4. Local `X402_PLATFORM_KEY` is still a placeholder.
   - The configured value is not a valid funded Stellar testnet account.
   - Resolution: set it to the funded public key used as the Kivo receiving account.

## Go/No-Go Checklist

- [ ] Fly trial/billing resolved.
- [ ] Fly app redeployed from `apps/kivo/fly.toml`.
- [ ] `GET /v1/health` returns `200`.
- [ ] `GET /v1/etherfuse/status` returns configured Devnet status.
- [ ] `GET /v1/x402/challenge?resource=/api/x402/data` returns a challenge with `payTo`, `amount`, `asset`, and `nonce`.
- [ ] Frontend Vercel env `VITE_KIVO_API_URL` points to the healthy Fly API.
- [ ] Supabase Auth login works on Vercel.
- [ ] Create Flow publishes either a device flow or an x402 pricing rule.
- [ ] Checkout accepts a signed Stellar `txXDR` and returns `X-PAYMENT`.
- [ ] Protected resource unlock returns `200`.

## Demo Flow

1. Login in Kivo.
2. Open Home and click `Create Flow`.
3. Pick `Paid API` or `EV Charging`.
4. Publish the flow.
5. Open `Test Payment`.
6. Request price/challenge.
7. Sign the payment transaction with a Stellar testnet wallet or SDK.
8. Paste the signed `txXDR`.
9. Submit payment.
10. Show the unlocked response and the payment in the dashboard.

## Commands

Frontend:

```bash
cd apps/kivo/web
npm run lint
npm test -- --run
npm run build
```

Backend:

```bash
cd apps/kivo
go test ./cmd/... ./internal/...
go build ./cmd/api
```

Fly:

```bash
flyctl status -a stellarglobalrails
flyctl logs -a stellarglobalrails
flyctl deploy -a stellarglobalrails --config apps/kivo/fly.toml --remote-only
```

Preflight:

```powershell
powershell -ExecutionPolicy Bypass -File apps/kivo/scripts/preflight.ps1 -ApiUrl https://stellarglobalrails.fly.dev
```
