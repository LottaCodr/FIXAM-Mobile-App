insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('job-photos', 'job-photos', false),
  ('portfolio', 'portfolio', true),
  ('kyc', 'kyc', false)
on conflict (id) do nothing;

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_own_write"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "avatars_own_update"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "portfolio_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio');

create policy "portfolio_artisan_write"
  on storage.objects for insert
  with check (
    bucket_id = 'portfolio'
    and exists (select 1 from public.artisans a where a.user_id = auth.uid())
  );

create policy "job_photos_participants_read"
  on storage.objects for select
  using (
    bucket_id = 'job-photos'
    and (
      auth.uid()::text = (storage.foldername(name))[1]
      or exists (
        select 1 from public.jobs j
        join public.artisans a on a.id = j.artisan_id
        where j.id::text = (storage.foldername(name))[2]
          and (j.customer_id = auth.uid() or a.user_id = auth.uid())
      )
    )
  );

create policy "job_photos_owner_write"
  on storage.objects for insert
  with check (bucket_id = 'job-photos' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "kyc_own"
  on storage.objects for all
  using (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1])
  with check (bucket_id = 'kyc' and auth.uid()::text = (storage.foldername(name))[1]);
