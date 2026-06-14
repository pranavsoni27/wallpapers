-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  access_type text not null default 'demo'
    check (access_type in ('demo', 'paid', 'free_access', 'admin')),
  download_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, email, full_name, access_type)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    case when lower(new.email) = 'pranavsoni2702@gmail.com' then 'admin' else 'demo' end
  )
  on conflict (id) do update set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.user_profiles.full_name),
    access_type = case
      when excluded.email = 'pranavsoni2702@gmail.com' then 'admin'
      else public.user_profiles.access_type
    end,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.increment_user_download()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  new_count integer;
begin
  update public.user_profiles
  set
    download_count = download_count + 1,
    updated_at = now()
  where id = auth.uid() and access_type = 'demo'
  returning download_count into new_count;

  return new_count;
end;
$$;

drop policy if exists "Users read own profile" on public.user_profiles;
create policy "Users read own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

drop policy if exists "Admin read all profiles" on public.user_profiles;
create policy "Admin read all profiles"
  on public.user_profiles for select
  using (
    exists (
      select 1 from public.user_profiles admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.email = 'pranavsoni2702@gmail.com'
    )
  );

drop policy if exists "Users insert own profile" on public.user_profiles;
create policy "Users insert own profile"
  on public.user_profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Admin update all profiles" on public.user_profiles;
create policy "Admin update all profiles"
  on public.user_profiles for update
  using (
    exists (
      select 1 from public.user_profiles admin_profile
      where admin_profile.id = auth.uid()
        and admin_profile.email = 'pranavsoni2702@gmail.com'
    )
  );

drop policy if exists "Users update own download count" on public.user_profiles;
create policy "Users update own download count"
  on public.user_profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

grant usage on schema public to anon, authenticated;
grant all on public.user_profiles to authenticated;
grant execute on function public.increment_user_download() to authenticated;
