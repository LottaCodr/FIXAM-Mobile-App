-- FixAm core schema
-- Postgres 15 + Supabase Auth. Amounts are NGN major units (naira), matching Flutterwave v3.

create extension if not exists "pgcrypto";
create extension if not exists "citext";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.user_role as enum ('customer', 'artisan', 'admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_status as enum (
    'requested', 'accepted', 'en_route', 'arrived',
    'in_progress', 'completed', 'cancelled'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.job_schedule as enum ('asap', 'today', 'schedule');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum (
    'initialized', 'pending', 'successful', 'failed', 'cancelled', 'refunded'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_kind as enum ('charge', 'refund', 'payout');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payout_status as enum (
    'pending', 'queued', 'successful', 'failed', 'reversed'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.verification_status as enum (
    'unsubmitted', 'pending', 'verified', 'rejected'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.notification_type as enum (
    'job', 'promo', 'message', 'system', 'payment'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.ledger_direction as enum ('credit', 'debit');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Platform
-- ---------------------------------------------------------------------------
create table if not exists public.platform_settings (
  id int primary key default 1 check (id = 1),
  currency text not null default 'NGN',
  platform_fee_bps int not null default 1000, -- 10%
  min_job_amount numeric(12,2) not null default 2000,
  max_job_amount numeric(12,2) not null default 2000000,
  escrow_enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.platform_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.categories (
  id text primary key,
  title text not null,
  subtitle text,
  icon text not null,
  color text not null,
  soft text not null,
  sort_order int not null default 0,
  active boolean not null default true
);

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'customer',
  full_name text,
  first_name text,
  phone text,
  email citext,
  avatar_url text,
  location text,
  address text,
  city text default 'Lagos',
  lat double precision,
  lng double precision,
  referral_code text unique not null,
  referred_by uuid references public.profiles (id),
  flutterwave_customer_id text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists profiles_phone_idx on public.profiles (phone);
create index if not exists profiles_role_idx on public.profiles (role);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  label text not null default 'Home',
  address text not null,
  city text,
  lat double precision,
  lng double precision,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.artisans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.profiles (id) on delete set null,
  category_id text not null references public.categories (id),
  name text not null,
  skill text not null,
  about text,
  years_exp int not null default 0,
  price_min numeric(12,2) not null default 0,
  price_max numeric(12,2) not null default 0,
  rating numeric(3,2) not null default 0,
  review_count int not null default 0,
  jobs_done int not null default 0,
  distance_km numeric(6,2),
  avatar_url text,
  cover_url text,
  location_label text,
  lat double precision,
  lng double precision,
  response_mins int not null default 20,
  online boolean not null default false,
  verified boolean not null default false,
  verification_status public.verification_status not null default 'unsubmitted',
  bank_code text,
  bank_name text,
  account_number text,
  account_name text,
  flutterwave_subaccount_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artisans_category_idx on public.artisans (category_id);
create index if not exists artisans_rating_idx on public.artisans (rating desc);

create table if not exists public.artisan_portfolio (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  image_url text not null,
  caption text,
  sort_order int not null default 0
);

create table if not exists public.saved_artisans (
  user_id uuid not null references public.profiles (id) on delete cascade,
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, artisan_id)
);

-- ---------------------------------------------------------------------------
-- Jobs
-- ---------------------------------------------------------------------------
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  public_ref text unique not null,
  customer_id uuid not null references public.profiles (id),
  artisan_id uuid not null references public.artisans (id),
  category_id text not null references public.categories (id),
  service text not null,
  description text not null,
  status public.job_status not null default 'requested',
  address text not null,
  lat double precision,
  lng double precision,
  schedule public.job_schedule not null default 'asap',
  scheduled_at timestamptz,
  scheduled_label text,
  amount numeric(12,2) not null,
  parts_amount numeric(12,2) not null default 0,
  platform_fee numeric(12,2) not null default 0,
  artisan_payout numeric(12,2) not null default 0,
  payment_status public.payment_status not null default 'initialized',
  eta_mins int,
  photos text[] not null default '{}',
  rating numeric(3,2),
  review text,
  cancel_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  cancelled_at timestamptz
);

create index if not exists jobs_customer_idx on public.jobs (customer_id, created_at desc);
create index if not exists jobs_artisan_idx on public.jobs (artisan_id, created_at desc);
create index if not exists jobs_status_idx on public.jobs (status);

create table if not exists public.job_events (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs (id) on delete cascade,
  status public.job_status not null,
  actor_id uuid references public.profiles (id),
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid unique references public.jobs (id) on delete set null,
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  customer_id uuid references public.profiles (id) on delete set null,
  customer_name text,
  customer_avatar text,
  rating int not null check (rating between 1 and 5),
  comment text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Money
-- ---------------------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id),
  job_id uuid references public.jobs (id) on delete set null,
  provider text not null default 'flutterwave',
  kind public.payment_kind not null default 'charge',
  tx_ref text unique not null,
  flw_tx_id text,
  flw_ref text,
  amount numeric(12,2) not null,
  currency text not null default 'NGN',
  fee numeric(12,2) not null default 0,
  status public.payment_status not null default 'initialized',
  payment_method text,
  checkout_url text,
  raw jsonb,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_user_idx on public.payments (user_id, created_at desc);
create index if not exists payments_job_idx on public.payments (job_id);
create index if not exists payments_flw_tx_idx on public.payments (flw_tx_id);

create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  artisan_id uuid not null references public.artisans (id),
  job_id uuid references public.jobs (id),
  payment_id uuid references public.payments (id),
  amount numeric(12,2) not null,
  currency text not null default 'NGN',
  bank_code text,
  account_number text,
  account_name text,
  reference text unique not null,
  flw_transfer_id text,
  status public.payout_status not null default 'pending',
  raw jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_payment_methods (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  brand text not null,
  last4 text not null,
  expiry text,
  token text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.wallets (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  available numeric(12,2) not null default 0,
  pending numeric(12,2) not null default 0,
  currency text not null default 'NGN',
  updated_at timestamptz not null default now()
);

create table if not exists public.wallet_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  direction public.ledger_direction not null,
  amount numeric(12,2) not null,
  reason text not null,
  job_id uuid references public.jobs (id),
  payment_id uuid references public.payments (id),
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_id uuid not null references public.profiles (id),
  referee_id uuid unique references public.profiles (id),
  code text not null,
  status text not null default 'pending' check (status in ('pending', 'credited', 'expired')),
  credit_amount numeric(12,2) not null default 2000,
  job_id uuid references public.jobs (id),
  created_at timestamptz not null default now(),
  credited_at timestamptz
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  event_type text,
  external_id text,
  signature_ok boolean not null default false,
  payload jsonb not null,
  processed boolean not null default false,
  error text,
  created_at timestamptz not null default now()
);

create unique index if not exists webhook_events_dedupe
  on public.webhook_events (provider, external_id)
  where external_id is not null;

-- ---------------------------------------------------------------------------
-- Chat & notifications
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.profiles (id) on delete cascade,
  artisan_id uuid not null references public.artisans (id) on delete cascade,
  last_message text,
  last_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (customer_id, artisan_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_convo_idx on public.messages (conversation_id, created_at);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  body text not null,
  type public.notification_type not null default 'system',
  href text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_artisans_updated on public.artisans;
create trigger trg_artisans_updated before update on public.artisans
for each row execute function public.set_updated_at();

drop trigger if exists trg_jobs_updated on public.jobs;
create trigger trg_jobs_updated before update on public.jobs
for each row execute function public.set_updated_at();

drop trigger if exists trg_payments_updated on public.payments;
create trigger trg_payments_updated before update on public.payments
for each row execute function public.set_updated_at();

create or replace function public.generate_referral_code()
returns text language sql as $$
  select 'FX' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
$$;

create or replace function public.generate_job_ref()
returns text language sql as $$
  select 'FX-' || (4000 + floor(random() * 5000))::int;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  meta_name text;
  code text;
begin
  meta_name := coalesce(
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'name',
    'FixAm user'
  );
  code := public.generate_referral_code();
  insert into public.profiles (
    id, full_name, first_name, email, phone, avatar_url, referral_code, role
  ) values (
    new.id,
    meta_name,
    split_part(meta_name, ' ', 1),
    new.email,
    new.phone,
    new.raw_user_meta_data ->> 'avatar_url',
    code,
    coalesce((new.raw_user_meta_data ->> 'role')::public.user_role, 'customer')
  );
  insert into public.wallets (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Recalc artisan rating after a review
create or replace function public.refresh_artisan_rating()
returns trigger language plpgsql as $$
begin
  update public.artisans a
  set
    rating = coalesce((select round(avg(r.rating)::numeric, 2) from public.reviews r where r.artisan_id = a.id), 0),
    review_count = (select count(*) from public.reviews r where r.artisan_id = a.id)
  where a.id = coalesce(new.artisan_id, old.artisan_id);
  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_reviews_rating on public.reviews;
create trigger trg_reviews_rating
  after insert or update or delete on public.reviews
  for each row execute function public.refresh_artisan_rating();
