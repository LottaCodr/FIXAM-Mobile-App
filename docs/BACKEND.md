# FixAm backend (Supabase + Flutterwave)

## Architecture

```
Expo app
  └─ supabase-js (Auth, PostgREST, Realtime, Storage)
       └─ Edge Functions (Deno)
            └─ Flutterwave v3  https://api.flutterwave.com/v3
                 • POST /payments          initialize checkout
                 • GET  /transactions/:id/verify
                 • GET  /transactions/verify_by_reference
                 • GET  /banks/NG
                 • POST /accounts/resolve
                 • POST /transfers
                 • POST /transactions/:id/refund
```

The **secret key never leaves the Edge Function**. The phone only receives a hosted checkout URL.

Money flow (escrow):

1. Customer creates a job (`jobs-create`).
2. Customer pays (`payments-initialize` → Flutterwave Standard).
3. Redirect + webhook → `payments-verify` / `payments-webhook` mark `payments.status = successful`.
4. Job is completed.
5. `payouts-create` sends `artisan_payout` (amount − platform fee) to the artisan NUBAN.

Platform fee default: **10%** (`platform_settings.platform_fee_bps = 1000`).

## One-time setup

1. Create a project at [database.new](https://database.new).
2. Install the CLI: `npm i -g supabase`
3. `supabase login` then `supabase link --project-ref <ref>`
4. `supabase db push`
5. Set secrets:

```bash
supabase secrets set \
  FLW_SECRET_KEY=FLWSECK_TEST-... \
  FLW_SECRET_HASH=your-long-random-hash \
  FLW_ENV=test
```

6. Deploy functions:

```bash
supabase functions deploy
```

7. Flutterwave Dashboard → Settings → Webhooks  
   URL: `https://<ref>.supabase.co/functions/v1/payments-webhook`  
   Also add `.../payouts-webhook` if you use a second URL, or point both events at `payments-webhook` and handle `transfer.*` there.  
   Secret hash = `FLW_SECRET_HASH`. Enable retries + JSON.

8. Auth → Providers: enable **Phone**, **Google**, **Apple**, **Facebook**.  
   Redirect allow-list:
   - `https://<ref>.supabase.co/auth/v1/callback`
   - `fixam://auth/callback`
   - `http://localhost:8081/auth/callback`

9. Copy `.env.example` → `.env` with `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

10. Phone OTP in Nigeria: hook **Send SMS** to Termii (cheaper than Twilio). Supabase still generates/verifies the code.

Without `.env` the app stays in **mock mode** so Expo web still works.

## Social login

| Provider | App work | Dashboard |
| --- | --- | --- |
| Google | `signInWithOAuth` + AuthSession | Web client ID + secret |
| Apple | same; native ID token preferred on iOS | Services ID + key.p8 |
| Facebook | same | App ID + secret |

Deep link scheme is `fixam` (`app.json`).

## RLS

Clients can read the catalog, their own jobs/payments/chat. Webhooks and payouts use the **service role** inside Edge Functions.
