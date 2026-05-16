revoke all on table public.kivo_devices from anon, authenticated;
revoke all on table public.kivo_payments from anon, authenticated;
revoke all on table public.kivo_payment_conditions from anon, authenticated;
revoke all on table public.kivo_webhooks from anon, authenticated;
revoke all on table public.kivo_webhook_deliveries from anon, authenticated;
revoke all on table public.kivo_api_keys from anon, authenticated;
revoke all on table public.kivo_x402_nonces from anon, authenticated;
revoke all on table public.kivo_etherfuse_orders from anon, authenticated;
revoke all on table public.kivo_etherfuse_webhook_events from anon, authenticated;

grant select, insert, update on table public.kivo_devices to authenticated;
grant select, insert, update on table public.kivo_payments to authenticated;
grant select, insert on table public.kivo_payment_conditions to authenticated;
grant select, insert, update, delete on table public.kivo_webhooks to authenticated;
grant select on table public.kivo_webhook_deliveries to authenticated;
grant select, insert, update on table public.kivo_api_keys to authenticated;
grant select on table public.kivo_x402_nonces to authenticated;
grant select, insert, update on table public.kivo_etherfuse_orders to authenticated;

revoke all on table public.kivo_etherfuse_webhook_events from authenticated;
