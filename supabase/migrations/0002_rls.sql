-- Row Level Security. Edge Functions use the service role and bypass RLS.

alter table public.platform_settings enable row level security;
alter table public.categories enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.artisans enable row level security;
alter table public.artisan_portfolio enable row level security;
alter table public.saved_artisans enable row level security;
alter table public.jobs enable row level security;
alter table public.job_events enable row level security;
alter table public.reviews enable row level security;
alter table public.payments enable row level security;
alter table public.payouts enable row level security;
alter table public.saved_payment_methods enable row level security;
alter table public.wallets enable row level security;
alter table public.wallet_ledger enable row level security;
alter table public.referrals enable row level security;
alter table public.webhook_events enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;

-- Catalog is public to signed-in users
create policy "categories_read" on public.categories for select using (true);
create policy "artisans_read" on public.artisans for select using (true);
create policy "portfolio_read" on public.artisan_portfolio for select using (true);
create policy "reviews_read" on public.reviews for select using (true);
create policy "settings_read" on public.platform_settings for select using (true);

-- Profiles
create policy "profiles_self_read" on public.profiles
  for select using (auth.uid() = id or exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Addresses
create policy "addresses_own" on public.addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Saved artisans
create policy "saved_own" on public.saved_artisans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Jobs: customer sees theirs; artisan sees assigned (via artisans.user_id)
create policy "jobs_customer_read" on public.jobs
  for select using (
    customer_id = auth.uid()
    or exists (
      select 1 from public.artisans a
      where a.id = jobs.artisan_id and a.user_id = auth.uid()
    )
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "jobs_customer_insert" on public.jobs
  for insert with check (customer_id = auth.uid());

create policy "jobs_customer_update" on public.jobs
  for update using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

create policy "job_events_read" on public.job_events
  for select using (
    exists (
      select 1 from public.jobs j
      where j.id = job_events.job_id
        and (j.customer_id = auth.uid()
          or exists (select 1 from public.artisans a where a.id = j.artisan_id and a.user_id = auth.uid()))
    )
  );

-- Payments
create policy "payments_own" on public.payments
  for select using (user_id = auth.uid());

create policy "payouts_artisan" on public.payouts
  for select using (
    exists (select 1 from public.artisans a where a.id = payouts.artisan_id and a.user_id = auth.uid())
    or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

create policy "saved_pm_own" on public.saved_payment_methods
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "wallets_own" on public.wallets
  for select using (auth.uid() = user_id);

create policy "ledger_own" on public.wallet_ledger
  for select using (auth.uid() = user_id);

create policy "referrals_own" on public.referrals
  for select using (auth.uid() = referrer_id or auth.uid() = referee_id);

-- Chat
create policy "conversations_participants" on public.conversations
  for all using (
    customer_id = auth.uid()
    or exists (select 1 from public.artisans a where a.id = conversations.artisan_id and a.user_id = auth.uid())
  ) with check (customer_id = auth.uid());

create policy "messages_participants" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and (c.customer_id = auth.uid()
          or exists (select 1 from public.artisans a where a.id = c.artisan_id and a.user_id = auth.uid()))
    )
  );

create policy "messages_send" on public.messages
  for insert with check (
    sender_id = auth.uid()
    and exists (
      select 1 from public.conversations c
      where c.id = conversation_id
        and (c.customer_id = auth.uid()
          or exists (select 1 from public.artisans a where a.id = c.artisan_id and a.user_id = auth.uid()))
    )
  );

create policy "notifications_own" on public.notifications
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Artisan can update their own row (online flag, bank, about)
create policy "artisans_self_update" on public.artisans
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- webhook_events: no client access (service role only)
