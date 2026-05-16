drop policy if exists kivo_devices_owner_select on public.kivo_devices;
drop policy if exists kivo_devices_owner_insert on public.kivo_devices;
drop policy if exists kivo_devices_owner_update on public.kivo_devices;
drop policy if exists kivo_payments_owner_select on public.kivo_payments;
drop policy if exists kivo_payments_owner_insert on public.kivo_payments;
drop policy if exists kivo_payments_owner_update on public.kivo_payments;
drop policy if exists kivo_payment_conditions_owner_select on public.kivo_payment_conditions;
drop policy if exists kivo_payment_conditions_owner_insert on public.kivo_payment_conditions;
drop policy if exists kivo_webhooks_owner_all on public.kivo_webhooks;
drop policy if exists kivo_webhook_deliveries_owner_select on public.kivo_webhook_deliveries;
drop policy if exists kivo_api_keys_owner_all on public.kivo_api_keys;
drop policy if exists kivo_x402_nonces_owner_select on public.kivo_x402_nonces;
drop policy if exists kivo_etherfuse_orders_owner_select on public.kivo_etherfuse_orders;
drop policy if exists kivo_etherfuse_orders_owner_insert on public.kivo_etherfuse_orders;
drop policy if exists kivo_etherfuse_orders_owner_update on public.kivo_etherfuse_orders;

create policy kivo_devices_owner_select on public.kivo_devices
    for select using (owner_id = (select auth.uid()));
create policy kivo_devices_owner_insert on public.kivo_devices
    for insert with check (owner_id = (select auth.uid()));
create policy kivo_devices_owner_update on public.kivo_devices
    for update using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy kivo_payments_owner_select on public.kivo_payments
    for select using (owner_id = (select auth.uid()));
create policy kivo_payments_owner_insert on public.kivo_payments
    for insert with check (owner_id = (select auth.uid()));
create policy kivo_payments_owner_update on public.kivo_payments
    for update using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy kivo_payment_conditions_owner_select on public.kivo_payment_conditions
    for select using (owner_id = (select auth.uid()));
create policy kivo_payment_conditions_owner_insert on public.kivo_payment_conditions
    for insert with check (owner_id = (select auth.uid()));

create policy kivo_webhooks_owner_all on public.kivo_webhooks
    for all using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy kivo_webhook_deliveries_owner_select on public.kivo_webhook_deliveries
    for select using (owner_id = (select auth.uid()));

create policy kivo_api_keys_owner_all on public.kivo_api_keys
    for all using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy kivo_x402_nonces_owner_select on public.kivo_x402_nonces
    for select using (owner_id = (select auth.uid()));

create policy kivo_etherfuse_orders_owner_select on public.kivo_etherfuse_orders
    for select using (owner_id = (select auth.uid()));
create policy kivo_etherfuse_orders_owner_insert on public.kivo_etherfuse_orders
    for insert with check (owner_id = (select auth.uid()));
create policy kivo_etherfuse_orders_owner_update on public.kivo_etherfuse_orders
    for update using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));
