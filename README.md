# FixAm

Lagos-first home services: book verified artisans, pay with Flutterwave, track the job.

## Run the app (mock mode)

```bash
npm install
npx expo start
```

No keys needed. Demo OTP is `123456`. Social login and live charges stay disabled until you add Supabase.

## Run with a real backend

1. Read [docs/GAP_ANALYSIS.md](docs/GAP_ANALYSIS.md) — everything still missing.
2. Follow [docs/BACKEND.md](docs/BACKEND.md) — Supabase schema, RLS, Edge Functions.
3. Follow [docs/FLUTTERWAVE.md](docs/FLUTTERWAVE.md) — checkout, webhooks, payouts, test cards.
4. Copy `.env.example` → `.env`.

```bash
supabase db push
supabase secrets set FLW_SECRET_KEY=... FLW_SECRET_HASH=...
supabase functions deploy
npx expo start
```

## Ship to the stores

See [docs/STORE.md](docs/STORE.md). Identifiers: `ng.fixam.app`. Profiles: `development`, `preview`, `production`.

```bash
eas login
eas init
npx eas-cli build --profile production --platform all
npx eas-cli submit --profile production --latest
```

## Stack

Expo SDK 57 · React Native 0.86 · Expo Router · Zustand · Supabase · Flutterwave v3 · EAS Build / Submit / Update

Social login: Google, Apple, Facebook via Supabase Auth. Phone OTP via Supabase + Termii (NG).
