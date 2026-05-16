create table if not exists public.kivo_x402_pricing_rules (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null,
    resource text not null check (length(resource) between 1 and 512),
    amount numeric(20, 7) not null check (amount > 0),
    asset text not null check (length(asset) between 1 and 255),
    max_timeout integer not null default 300 check (max_timeout between 1 and 3600),
    enabled boolean not null default true,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    unique (owner_id, resource)
);

create index if not exists idx_kivo_x402_pricing_rules_owner_id
    on public.kivo_x402_pricing_rules(owner_id);
create index if not exists idx_kivo_x402_pricing_rules_enabled
    on public.kivo_x402_pricing_rules(enabled);

alter table public.kivo_x402_pricing_rules enable row level security;

drop policy if exists kivo_x402_pricing_rules_owner_select on public.kivo_x402_pricing_rules;
drop policy if exists kivo_x402_pricing_rules_owner_insert on public.kivo_x402_pricing_rules;
drop policy if exists kivo_x402_pricing_rules_owner_update on public.kivo_x402_pricing_rules;

create policy kivo_x402_pricing_rules_owner_select on public.kivo_x402_pricing_rules
    for select to authenticated
    using (owner_id = (select auth.uid()));

create policy kivo_x402_pricing_rules_owner_insert on public.kivo_x402_pricing_rules
    for insert to authenticated
    with check (owner_id = (select auth.uid()));

create policy kivo_x402_pricing_rules_owner_update on public.kivo_x402_pricing_rules
    for update to authenticated
    using (owner_id = (select auth.uid()))
    with check (owner_id = (select auth.uid()));

revoke all on table public.kivo_x402_pricing_rules from anon, authenticated;
grant select, insert, update on table public.kivo_x402_pricing_rules to authenticated;

alter table public.kivo_x402_nonces
    add column if not exists max_timeout integer not null default 300 check (max_timeout between 1 and 3600);

alter table public.kivo_webhooks
    add column if not exists encrypted_secret text;

insert into public.kivo_x402_pricing_rules (
    owner_id,
    resource,
    amount,
    asset,
    max_timeout,
    enabled,
    description
)
values (
    '11111111-1111-4111-8111-111111111111',
    '/api/x402/data',
    0.0500000,
    'USDC:GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5',
    300,
    true,
    'Endpoint operacional protegido por x402 no ambiente testnet.'
)
on conflict (owner_id, resource) do update set
    amount = excluded.amount,
    asset = excluded.asset,
    max_timeout = excluded.max_timeout,
    enabled = excluded.enabled,
    description = excluded.description,
    updated_at = now();
