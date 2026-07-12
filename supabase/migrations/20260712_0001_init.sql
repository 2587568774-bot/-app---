-- See Yunnan initial schema (M0)
-- Province -> city -> county regions, guides, subscriptions, offline packs

create extension if not exists pgcrypto;

-- helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin'
  );
$$;

create or replace function public.is_premium(uid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.subscriptions s
    where s.user_id = uid
      and s.status = 'active'
      and (s.current_period_end is null or s.current_period_end > now())
  );
$$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_locale text not null default 'en',
  role text not null default 'user' check (role in ('user', 'guide', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- regions tree
create table if not exists public.regions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.regions (id) on delete cascade,
  level text not null check (level in ('province', 'city', 'county')),
  code text not null unique,
  slug text not null unique,
  lat double precision,
  lng double precision,
  altitude_m integer,
  status text not null default 'draft' check (status in ('draft', 'published')),
  completeness_score integer not null default 0 check (completeness_score between 0 and 100),
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists regions_parent_id_idx on public.regions (parent_id);
create index if not exists regions_level_status_idx on public.regions (level, status);

create trigger regions_set_updated_at
before update on public.regions
for each row execute function public.set_updated_at();

create table if not exists public.region_i18n (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions (id) on delete cascade,
  locale text not null,
  name text not null,
  summary text,
  food_blurb text,
  scenery_blurb text,
  migration_blurb text,
  machine_translated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (region_id, locale)
);

create trigger region_i18n_set_updated_at
before update on public.region_i18n
for each row execute function public.set_updated_at();

create table if not exists public.region_metrics (
  region_id uuid primary key references public.regions (id) on delete cascade,
  climate_type text,
  cost_of_living_index integer check (cost_of_living_index between 1 and 100),
  migration_friendliness numeric(3,1) check (migration_friendliness between 1 and 10),
  best_months integer[] default '{}',
  data_source text,
  updated_at timestamptz not null default now()
);

create table if not exists public.region_media (
  id uuid primary key default gen_random_uuid(),
  region_id uuid not null references public.regions (id) on delete cascade,
  url text not null,
  type text not null default 'image' check (type in ('image')),
  sort integer not null default 0,
  credit text,
  created_at timestamptz not null default now()
);

create index if not exists region_media_region_id_idx on public.region_media (region_id);

-- guides
create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'suspended')),
  headline text,
  bio text,
  years_experience integer default 0,
  languages text[] not null default '{}',
  service_region_ids uuid[] not null default '{}',
  specialties text[] not null default '{}',
  cover_url text,
  contact_email text,
  contact_phone text,
  priority_score integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists guides_status_idx on public.guides (status);

create trigger guides_set_updated_at
before update on public.guides
for each row execute function public.set_updated_at();

create table if not exists public.guide_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  guide_id uuid references public.guides (id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reject_reason text,
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.guide_inquiries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  guide_id uuid not null references public.guides (id) on delete cascade,
  region_id uuid references public.regions (id) on delete set null,
  message text not null,
  contact_email text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger guide_inquiries_set_updated_at
before update on public.guide_inquiries
for each row execute function public.set_updated_at();

-- subscriptions / offline / settings
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status text not null check (status in ('active', 'canceled', 'past_due', 'expired')),
  plan text not null default 'monthly' check (plan in ('monthly')),
  price_usd numeric(10,2) not null default 19.90,
  current_period_end timestamptz,
  provider text not null default 'manual' check (provider in ('stripe', 'manual')),
  provider_customer_id text,
  provider_subscription_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_user_id_idx on public.subscriptions (user_id);
create index if not exists subscriptions_status_idx on public.subscriptions (status);

create trigger subscriptions_set_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

create table if not exists public.offline_packs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  region_id uuid not null references public.regions (id) on delete cascade,
  version integer not null default 1,
  payload_path text,
  downloaded_at timestamptz not null default now(),
  unique (user_id, region_id)
);

create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.app_settings (key, value) values
  ('premium_price_usd', '19.90'::jsonb),
  ('platform_commission_rate', '0.15'::jsonb),
  ('ads_enabled', 'true'::jsonb)
on conflict (key) do nothing;

-- auth -> profile
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, preferred_locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    coalesce(new.raw_user_meta_data ->> 'preferred_locale', 'en')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.regions enable row level security;
alter table public.region_i18n enable row level security;
alter table public.region_metrics enable row level security;
alter table public.region_media enable row level security;
alter table public.guides enable row level security;
alter table public.guide_applications enable row level security;
alter table public.guide_inquiries enable row level security;
alter table public.subscriptions enable row level security;
alter table public.offline_packs enable row level security;
alter table public.app_settings enable row level security;

-- profiles policies
create policy profiles_select_own_or_admin on public.profiles
for select using (auth.uid() = id or public.is_admin());

create policy profiles_update_own on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

create policy profiles_admin_all on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

-- regions public read published
create policy regions_public_read on public.regions
for select using (status = 'published' or public.is_admin());

create policy regions_admin_write on public.regions
for all using (public.is_admin()) with check (public.is_admin());

create policy region_i18n_public_read on public.region_i18n
for select using (
  exists (
    select 1 from public.regions r
    where r.id = region_id and (r.status = 'published' or public.is_admin())
  )
);

create policy region_i18n_admin_write on public.region_i18n
for all using (public.is_admin()) with check (public.is_admin());

create policy region_metrics_public_read on public.region_metrics
for select using (
  exists (
    select 1 from public.regions r
    where r.id = region_id and (r.status = 'published' or public.is_admin())
  )
);

create policy region_metrics_admin_write on public.region_metrics
for all using (public.is_admin()) with check (public.is_admin());

create policy region_media_public_read on public.region_media
for select using (
  exists (
    select 1 from public.regions r
    where r.id = region_id and (r.status = 'published' or public.is_admin())
  )
);

create policy region_media_admin_write on public.region_media
for all using (public.is_admin()) with check (public.is_admin());

-- guides
create policy guides_public_read_approved on public.guides
for select using (status = 'approved' or auth.uid() = user_id or public.is_admin());

create policy guides_owner_update on public.guides
for update using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

create policy guides_insert_own on public.guides
for insert with check (auth.uid() = user_id or public.is_admin());

create policy guides_admin_all on public.guides
for all using (public.is_admin()) with check (public.is_admin());

-- applications
create policy guide_applications_owner on public.guide_applications
for select using (auth.uid() = user_id or public.is_admin());

create policy guide_applications_insert_own on public.guide_applications
for insert with check (auth.uid() = user_id);

create policy guide_applications_admin_all on public.guide_applications
for all using (public.is_admin()) with check (public.is_admin());

-- inquiries
create policy guide_inquiries_participants on public.guide_inquiries
for select using (
  auth.uid() = user_id
  or public.is_admin()
  or exists (
    select 1 from public.guides g where g.id = guide_id and g.user_id = auth.uid()
  )
);

create policy guide_inquiries_insert_own on public.guide_inquiries
for insert with check (auth.uid() = user_id);

create policy guide_inquiries_update_participants on public.guide_inquiries
for update using (
  public.is_admin()
  or exists (
    select 1 from public.guides g where g.id = guide_id and g.user_id = auth.uid()
  )
);

-- subscriptions / offline
create policy subscriptions_owner_read on public.subscriptions
for select using (auth.uid() = user_id or public.is_admin());

create policy subscriptions_admin_write on public.subscriptions
for all using (public.is_admin()) with check (public.is_admin());

create policy offline_packs_owner on public.offline_packs
for all using (auth.uid() = user_id or public.is_admin())
with check (auth.uid() = user_id or public.is_admin());

-- settings: public read, admin write
create policy app_settings_public_read on public.app_settings
for select using (true);

create policy app_settings_admin_write on public.app_settings
for all using (public.is_admin()) with check (public.is_admin());
