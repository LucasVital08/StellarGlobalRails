create schema if not exists kivo_private;

create table if not exists public.kivo_profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text not null default '',
    role text not null default 'developer' check (role in ('operator', 'developer', 'admin')),
    organization text not null default 'Kivo Labs',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.kivo_profiles enable row level security;

drop policy if exists kivo_profiles_owner_select on public.kivo_profiles;
drop policy if exists kivo_profiles_owner_update on public.kivo_profiles;

create policy kivo_profiles_owner_select on public.kivo_profiles
    for select to authenticated
    using (id = (select auth.uid()));

create policy kivo_profiles_owner_update on public.kivo_profiles
    for update to authenticated
    using (id = (select auth.uid()))
    with check (id = (select auth.uid()));

grant select, update on table public.kivo_profiles to authenticated;

create or replace function kivo_private.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_kivo_profiles_updated_at on public.kivo_profiles;
create trigger set_kivo_profiles_updated_at
    before update on public.kivo_profiles
    for each row execute function kivo_private.set_updated_at();

create or replace function kivo_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
    insert into public.kivo_profiles (id, email, full_name, organization)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Operador Kivo'),
        coalesce(new.raw_user_meta_data->>'organization', 'Kivo Labs')
    )
    on conflict (id) do update set
        email = excluded.email,
        updated_at = now();

    return new;
end;
$$;

drop trigger if exists on_auth_user_created_create_kivo_profile on auth.users;
create trigger on_auth_user_created_create_kivo_profile
    after insert on auth.users
    for each row execute function kivo_private.handle_new_user();

alter table public.kivo_payments replica identity full;
alter table public.kivo_webhook_deliveries replica identity full;
alter table public.kivo_etherfuse_orders replica identity full;

do $$
begin
    alter publication supabase_realtime add table public.kivo_payments;
exception
    when duplicate_object or undefined_object then null;
end;
$$;

do $$
begin
    alter publication supabase_realtime add table public.kivo_webhook_deliveries;
exception
    when duplicate_object or undefined_object then null;
end;
$$;

do $$
begin
    alter publication supabase_realtime add table public.kivo_etherfuse_orders;
exception
    when duplicate_object or undefined_object then null;
end;
$$;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
    (
        'kivo-proofs',
        'kivo-proofs',
        false,
        10485760,
        array['application/json', 'text/plain', 'image/png', 'image/jpeg', 'application/pdf']::text[]
    ),
    (
        'kivo-device-assets',
        'kivo-device-assets',
        false,
        52428800,
        array['application/json', 'image/png', 'image/jpeg', 'image/webp']::text[]
    )
on conflict (id) do update set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types,
    updated_at = now();

drop policy if exists kivo_storage_owner_select on storage.objects;
drop policy if exists kivo_storage_owner_insert on storage.objects;
drop policy if exists kivo_storage_owner_update on storage.objects;
drop policy if exists kivo_storage_owner_delete on storage.objects;

create policy kivo_storage_owner_select on storage.objects
    for select to authenticated
    using (
        bucket_id in ('kivo-proofs', 'kivo-device-assets')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

create policy kivo_storage_owner_insert on storage.objects
    for insert to authenticated
    with check (
        bucket_id in ('kivo-proofs', 'kivo-device-assets')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

create policy kivo_storage_owner_update on storage.objects
    for update to authenticated
    using (
        bucket_id in ('kivo-proofs', 'kivo-device-assets')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    )
    with check (
        bucket_id in ('kivo-proofs', 'kivo-device-assets')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );

create policy kivo_storage_owner_delete on storage.objects
    for delete to authenticated
    using (
        bucket_id in ('kivo-proofs', 'kivo-device-assets')
        and (storage.foldername(name))[1] = (select auth.uid())::text
    );
