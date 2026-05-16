alter table public.kivo_profiles
    alter column organization set default '';

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
        coalesce(new.raw_user_meta_data->>'organization', '')
    )
    on conflict (id) do update set
        email = excluded.email,
        updated_at = now();

    return new;
end;
$$;
