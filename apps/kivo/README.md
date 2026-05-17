# Kivo MVP

Kivo is the M2M payment product for solo operators who want to monetize a device, paid API, or IoT data feed with Stellar/x402 and Etherfuse rails.

```txt
operator creates flow -> Etherfuse Devnet funding -> x402 challenge -> signed Stellar tx -> protected resource unlock -> dashboard status
```

The current implementation runs in real-mode: the API requires Postgres/Supabase configuration, submits signed Stellar XDR payloads to Horizon, and proxies Etherfuse only from the server side so anchor credentials never reach the browser.

Required server secrets:

- `DATABASE_URL`
- `KIVO_SECRET_ENCRYPTION_KEY`
- `STELLAR_HORIZON_URL`
- `X402_PLATFORM_KEY`
- `ETHERFUSE_API_KEY` for live Etherfuse Devnet/production calls
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` when `KIVO_REQUIRE_AUTH=true`
- `SUPABASE_JWT_SECRET` is optional legacy fallback for local JWT validation

## Run API

```bash
cd apps/kivo
cp .env.example .env
go run ./cmd/api
```

The API listens on `http://localhost:8080` by default.

Point the web app at it with:

```bash
cd apps/kivo/web
VITE_KIVO_API_URL=http://localhost:8080
npm run dev
```

Set `VITE_KIVO_ENABLE_DEV_CONTROLS=true` only when you need operator-only Devnet controls. It is off by default so the product UI does not expose test harness actions.

## Verify

Because `apps/kivo/web/node_modules` can contain third-party Go fixtures during local frontend development, use the targeted Go package command:

```bash
go test ./cmd/... ./internal/...
go build ./cmd/api
```

Frontend checks:

```bash
cd apps/kivo/web
npm run lint
npm test -- --run
npm run build
```

## Fly.io Deploy

The Fly app should point at this monorepo folder:

- Current Working Directory: `apps/kivo`
- Config path: `fly.toml`
- Deploy branch: `main`

The tracked `fly.toml` contains only non-secret runtime defaults. Set secrets in the Fly dashboard or with `fly secrets set`:

```bash
fly secrets set DATABASE_URL="..."
fly secrets set REDIS_URL="..."
fly secrets set KIVO_SECRET_ENCRYPTION_KEY="..."
fly secrets set SUPABASE_URL="https://<project-ref>.supabase.co"
fly secrets set SUPABASE_SERVICE_ROLE_KEY="..."
fly secrets set SUPABASE_JWT_SECRET="..." # optional fallback only
fly secrets set X402_PLATFORM_KEY="G..."
fly secrets set ETHERFUSE_API_KEY="ef_sand_..."
fly secrets set ETHERFUSE_WEBHOOK_URL="https://<project-ref>.supabase.co/functions/v1/kivo-etherfuse-webhook"
fly secrets set ETHERFUSE_WEBHOOK_SECRET="..."
```

## MVP Endpoints

- `GET /v1/health`
- `GET /v1/dashboard`
- `GET|POST /v1/devices`
- `GET|PATCH /v1/devices/:id`
- `GET|POST /v1/payments`
- `GET /v1/payments/:id`
- `POST /v1/payments/:id/execute` with a signed `txXDR`
- `POST /v1/payments/:id/condition-proof`
- `GET /v1/x402/challenge?resource=/api/x402/data`
- `POST /v1/x402/pay` with a signed `txXDR`
- `GET|PUT /v1/x402/pricing-rules`
- `GET /api/x402/data`
- `GET /v1/etherfuse/status`
- `POST /v1/etherfuse/onboarding-url`
- `GET /v1/etherfuse/assets`
- `POST /v1/etherfuse/quotes`
- `POST /v1/etherfuse/orders`
- `POST /v1/etherfuse/orders/:id/fiat-received` (Devnet operator control; hidden from product UI unless dev controls are enabled)
- `POST /v1/etherfuse/webhook`

## Supabase

Local stack:

```bash
supabase start --workdir .
```

Useful local URLs:

- Studio: `http://127.0.0.1:54323`
- MCP: `http://127.0.0.1:54321/mcp`
- REST: `http://127.0.0.1:54321/rest/v1`
- GraphQL: `http://127.0.0.1:54321/graphql/v1`
- Edge Functions: `http://127.0.0.1:54321/functions/v1`
- Mailpit: `http://127.0.0.1:54324`

Create migrations with the Supabase CLI:

```bash
supabase migration new <name> --workdir .
```

Apply locally after `supabase start`:

```bash
supabase migration up --workdir .
```

The Supabase MVP layer now covers:

- Auth: `kivo_profiles` is created automatically from `auth.users`.
- Database: all `public.kivo_*` tables have RLS enabled.
- Realtime: `kivo_payments`, `kivo_webhook_deliveries`, and `kivo_etherfuse_orders` are in the `supabase_realtime` publication.
- Storage: private `kivo-proofs` and `kivo-device-assets` buckets require paths prefixed by the authenticated user id.
- Edge Functions: `kivo-etherfuse-webhook` receives Etherfuse events and persists them server-side.

Run checks before handing off:

```bash
supabase db advisors --local --workdir .
supabase db lint --local --workdir .
```

The schema grants only the `authenticated` role for dashboard-facing access. API workers should use server-side credentials and must not expose `SUPABASE_SERVICE_ROLE_KEY`, `ETHERFUSE_API_KEY`, or `ETHERFUSE_WEBHOOK_SECRET` to the browser.
