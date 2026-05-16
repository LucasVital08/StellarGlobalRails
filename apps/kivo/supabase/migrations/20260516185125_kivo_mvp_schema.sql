create extension if not exists pgcrypto;

create table if not exists public.kivo_devices (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    name text not null check (length(name) between 1 and 255),
    api_key_hash text not null unique,
    api_key_preview text not null,
    stellar_public_key text not null unique,
    encrypted_stellar_secret text,
    status text not null default 'active' check (status in ('active', 'suspended', 'decommissioned')),
    metadata jsonb not null default '{}'::jsonb,
    balances jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_kivo_devices_owner_id on public.kivo_devices(owner_id);
create index if not exists idx_kivo_devices_api_key_hash on public.kivo_devices(api_key_hash);
create index if not exists idx_kivo_devices_status on public.kivo_devices(status);

create table if not exists public.kivo_payments (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    from_device_id uuid not null references public.kivo_devices(id),
    to_device_id uuid not null references public.kivo_devices(id),
    amount numeric(20, 7) not null check (amount > 0),
    asset_code text not null check (asset_code in ('USDC', 'XLM')),
    asset_issuer text,
    condition_type text not null default 'none' check (condition_type in ('none', 'energy_kwh', 'time_elapsed', 'service_complete', 'custom')),
    condition_value text,
    status text not null default 'pending' check (status in ('pending', 'processing', 'confirmed', 'failed', 'expired', 'refunded')),
    stellar_hash text,
    stellar_ledger bigint,
    memo text,
    timeout_at timestamptz,
    confirmed_at timestamptz,
    failed_reason text,
    fee_charged numeric(20, 7),
    events jsonb not null default '[]'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_kivo_payments_owner_id on public.kivo_payments(owner_id);
create index if not exists idx_kivo_payments_from_device on public.kivo_payments(from_device_id);
create index if not exists idx_kivo_payments_to_device on public.kivo_payments(to_device_id);
create index if not exists idx_kivo_payments_status on public.kivo_payments(status);
create index if not exists idx_kivo_payments_stellar_hash on public.kivo_payments(stellar_hash);

create table if not exists public.kivo_payment_conditions (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    payment_id uuid not null references public.kivo_payments(id) on delete cascade,
    condition_key text not null,
    expected_value text not null,
    actual_value text,
    proof_data jsonb not null default '{}'::jsonb,
    met_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists idx_kivo_payment_conditions_payment_id on public.kivo_payment_conditions(payment_id);

create table if not exists public.kivo_webhooks (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    url text not null,
    events text[] not null default '{}',
    secret_hash text not null,
    secret_preview text not null,
    active boolean not null default true,
    delivery_count integer not null default 0,
    last_delivery_status text not null default 'pending' check (last_delivery_status in ('pending', 'delivered', 'failed')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_kivo_webhooks_owner_id on public.kivo_webhooks(owner_id);
create index if not exists idx_kivo_webhooks_active on public.kivo_webhooks(active);

create table if not exists public.kivo_webhook_deliveries (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    webhook_id uuid not null references public.kivo_webhooks(id) on delete cascade,
    payment_id uuid references public.kivo_payments(id) on delete set null,
    event text not null,
    payload jsonb not null default '{}'::jsonb,
    status text not null default 'pending' check (status in ('pending', 'delivered', 'failed')),
    attempts integer not null default 0,
    response_code integer,
    next_retry_at timestamptz,
    delivered_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists idx_kivo_webhook_deliveries_webhook_id on public.kivo_webhook_deliveries(webhook_id);
create index if not exists idx_kivo_webhook_deliveries_status on public.kivo_webhook_deliveries(status);

create table if not exists public.kivo_api_keys (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    name text not null,
    key_hash text not null unique,
    key_preview text not null,
    scopes text[] not null default '{}',
    status text not null default 'active' check (status in ('active', 'expired', 'revoked')),
    last_used_at timestamptz,
    expires_at timestamptz,
    created_at timestamptz not null default now()
);

create index if not exists idx_kivo_api_keys_owner_id on public.kivo_api_keys(owner_id);
create index if not exists idx_kivo_api_keys_key_hash on public.kivo_api_keys(key_hash);

create table if not exists public.kivo_x402_nonces (
    nonce text primary key,
    owner_id uuid,
    resource text not null,
    amount numeric(20, 7) not null,
    asset text not null,
    pay_to text not null,
    status text not null default 'issued' check (status in ('issued', 'paid', 'expired')),
    expires_at timestamptz not null,
    payment_header_hash text,
    created_at timestamptz not null default now(),
    consumed_at timestamptz
);

create index if not exists idx_kivo_x402_nonces_status on public.kivo_x402_nonces(status);
create index if not exists idx_kivo_x402_nonces_expires_at on public.kivo_x402_nonces(expires_at);

create table if not exists public.kivo_etherfuse_orders (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    device_id uuid references public.kivo_devices(id) on delete set null,
    payment_id uuid references public.kivo_payments(id) on delete set null,
    provider_order_id text not null unique,
    provider_quote_id text,
    provider_status text not null,
    kivo_status text not null default 'pending' check (kivo_status in ('pending', 'processing', 'confirmed', 'failed', 'expired', 'refunded')),
    order_type text not null check (order_type in ('onramp', 'offramp', 'swap')),
    source_asset text not null,
    target_asset text not null,
    source_amount numeric(20, 7),
    target_amount numeric(20, 7),
    wallet_public_key text not null,
    customer_id text not null,
    bank_account_id text,
    confirmed_tx_signature text,
    stellar_claim_transaction text,
    raw_response jsonb not null default '{}'::jsonb,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_kivo_etherfuse_orders_owner_id on public.kivo_etherfuse_orders(owner_id);
create index if not exists idx_kivo_etherfuse_orders_device_id on public.kivo_etherfuse_orders(device_id);
create index if not exists idx_kivo_etherfuse_orders_status on public.kivo_etherfuse_orders(kivo_status);

create table if not exists public.kivo_etherfuse_webhook_events (
    id uuid primary key default gen_random_uuid(),
    provider_event_id text,
    provider_order_id text,
    event_type text not null,
    signature_valid boolean not null,
    payload jsonb not null default '{}'::jsonb,
    received_at timestamptz not null default now()
);

create index if not exists idx_kivo_etherfuse_webhook_events_order_id on public.kivo_etherfuse_webhook_events(provider_order_id);
create index if not exists idx_kivo_etherfuse_webhook_events_type on public.kivo_etherfuse_webhook_events(event_type);

alter table public.kivo_devices enable row level security;
alter table public.kivo_payments enable row level security;
alter table public.kivo_payment_conditions enable row level security;
alter table public.kivo_webhooks enable row level security;
alter table public.kivo_webhook_deliveries enable row level security;
alter table public.kivo_api_keys enable row level security;
alter table public.kivo_x402_nonces enable row level security;
alter table public.kivo_etherfuse_orders enable row level security;
alter table public.kivo_etherfuse_webhook_events enable row level security;

create policy kivo_devices_owner_select on public.kivo_devices
    for select using (owner_id = auth.uid());
create policy kivo_devices_owner_insert on public.kivo_devices
    for insert with check (owner_id = auth.uid());
create policy kivo_devices_owner_update on public.kivo_devices
    for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy kivo_payments_owner_select on public.kivo_payments
    for select using (owner_id = auth.uid());
create policy kivo_payments_owner_insert on public.kivo_payments
    for insert with check (owner_id = auth.uid());
create policy kivo_payments_owner_update on public.kivo_payments
    for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy kivo_payment_conditions_owner_select on public.kivo_payment_conditions
    for select using (owner_id = auth.uid());
create policy kivo_payment_conditions_owner_insert on public.kivo_payment_conditions
    for insert with check (owner_id = auth.uid());

create policy kivo_webhooks_owner_all on public.kivo_webhooks
    for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy kivo_webhook_deliveries_owner_select on public.kivo_webhook_deliveries
    for select using (owner_id = auth.uid());

create policy kivo_api_keys_owner_all on public.kivo_api_keys
    for all using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy kivo_x402_nonces_owner_select on public.kivo_x402_nonces
    for select using (owner_id = auth.uid());

create policy kivo_etherfuse_orders_owner_select on public.kivo_etherfuse_orders
    for select using (owner_id = auth.uid());
create policy kivo_etherfuse_orders_owner_insert on public.kivo_etherfuse_orders
    for insert with check (owner_id = auth.uid());
create policy kivo_etherfuse_orders_owner_update on public.kivo_etherfuse_orders
    for update using (owner_id = auth.uid()) with check (owner_id = auth.uid());

create policy kivo_etherfuse_webhook_events_no_direct_user_access on public.kivo_etherfuse_webhook_events
    for select using (false);

grant select, insert, update on public.kivo_devices to authenticated;
grant select, insert, update on public.kivo_payments to authenticated;
grant select, insert on public.kivo_payment_conditions to authenticated;
grant select, insert, update, delete on public.kivo_webhooks to authenticated;
grant select on public.kivo_webhook_deliveries to authenticated;
grant select, insert, update on public.kivo_api_keys to authenticated;
grant select on public.kivo_x402_nonces to authenticated;
grant select, insert, update on public.kivo_etherfuse_orders to authenticated;
