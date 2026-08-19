# FixAm — what is still missing

Research baseline: TaskRabbit, Angi, Uber, Helpline.ng, Jiji Services, Paystack/Flutterwave marketplace patterns, and a Lagos home-services customer journey (discover → trust → book → pay → track → review → rebook).

The mobile UI now demonstrates that loop with **in-memory mock data**. Nothing below is optional if FixAm is going to take real money or list real artisans.

---

## 1. Backend & data (was completely absent)

- No database, no migrations, no RLS, no environments.
- Axios pointed at a fictional `https://api.fixam.ng/v1`.
- Zustand stores were the source of truth and reset on reload (except a demo auth persist).
- No file storage for avatars, job photos, or artisan portfolios.
- No server-side job state machine (anyone could “simulate next status”).
- No audit log / job events table.
- No idempotency keys, rate limits, or webhook inbox.

**This drop adds:** Postgres schema on Supabase, RLS, storage buckets, Edge Functions, typed API client. You still need a live Supabase project + Flutterwave keys to leave mock mode.

---

## 2. Identity & auth

| Gap | Why it matters |
| --- | --- |
| Phone OTP was fake (`123456`) | Nigeria is phone-first. Must be Termii / Twilio / Africa’s Talking via Supabase SMS hook. |
| No Google / Apple / Facebook | Supabase social login. Apple is required if you ship Google on iOS. |
| No session refresh against a real IdP | Access tokens expire; need `supabase.auth` auto-refresh. |
| No roles | Customer vs artisan vs admin must be enforced in RLS, not the UI. |
| No KYC / BVN / NIN | Flutterwave payouts and trust. Store hashes only. |
| No device / session list | “Log out everywhere”. |
| No account deletion | NDPR / Play / App Store. |
| No linking identities | Phone user later adds Google. |

**This drop adds:** Supabase Auth client, phone OTP path, Google / Apple / Facebook OAuth (Expo AuthSession + `fixam://` deep link), profile trigger on signup.

---

## 3. Payments (Flutterwave) — was a static card list

Home services in Nigeria must support **card (Visa/Mastercard/Verve), USSD, bank transfer, and NQR**. Flutterwave Standard checkout covers those. Paystack is not used here.

Missing before, now designed in:

- Server-side **initialize** (`POST /v3/payments`) — secret key never on the device.
- Hosted checkout opened in-app (`expo-web-browser`).
- **Verify** after redirect (`GET /v3/transactions/:id/verify` + amount/currency/`tx_ref` checks).
- **Webhooks** (`verif-hash` on v3, `flutterwave-signature` HMAC-SHA256 on v4) with an idempotent `webhook_events` table.
- **Escrow model:** customer pays → funds sit as `paid` on the job → on complete, **transfer** to artisan bank minus platform fee.
- **Payouts** (`POST /v3/transfers`) + transfer webhooks.
- **Name enquiry** (`POST /v3/accounts/resolve`) before saving artisan bank details.
- **Bank list** (`GET /v3/banks/NG`).
- Refunds, failed/pending states, unique `tx_ref`.
- Split-payments / subaccounts (schema ready; not required for v1 escrow+transfer).

Still not built (next): card tokenization for one-tap rebook, subscriptions/retainers, virtual accounts per job, chargeback desk.

---

## 4. Job operations

- Real create / assign / accept / decline / cancel with rules (who can cancel when).
- Scheduling calendar + artisan working hours + travel buffer.
- Live GPS tracking (maps, geofence “arrived”).
- Job photos via Storage, not Unsplash URLs.
- Parts / extra work change-orders the customer must approve.
- SLA / “no artisan accepted in 15 min → broadcast”.
- Cancellation fees.
- Disputes and evidence.
- Warranty window after complete.
- Invoice / receipt PDF.

**This drop adds:** `jobs` + `job_events` + authorized `jobs-transition` function and payment gate on the job.

---

## 5. Artisan supply side (there is no artisan app)

- Artisan onboarding, trade licenses, ID upload.
- Availability / “go online”.
- Job inbox, accept/decline, navigation.
- Wallet, bank account, payout history, tax statement.
- Background check status.
- Multi-category skills.
- Service radius.

Schema supports `artisan_profiles`, bank details, verification status. The artisan client is still missing.

---

## 6. Trust & safety

- Verified badge workflow (human or Jumio-style).
- Report user / block.
- SOS / share-live-location with a contact.
- Insurance copy.
- Underage / banned-user checks.
- Content moderation on chat and reviews.

---

## 7. Communications

- Chat is local Zustand, not Supabase Realtime.
- No push (FCM / APNs / Expo Notifications).
- No SMS status (“Chinedu is 10 min away”).
- No email receipts.
- No in-app calling (or masked numbers via Termii/Africa’s Talking).
- No support ticketing (only a tel: / mailto:).

---

## 8. Growth & commerce

- Referral credits are UI-only — need ledger + first-job completion hook.
- No promo codes, surge, or off-peak discounts.
- No corporate / estate accounts.
- No retainers (weekly cleaning).
- No parts marketplace.

**This drop adds:** `wallets`, `wallet_ledger`, `referrals` tables and a redeem function.

---

## 9. Search, geo, ranking

- Haversine helper existed but was unused.
- No PostGIS, no “near me”, no map pin picker.
- Ranking is static sort (distance / rating / price), not conversion-weighted.
- Search is client-side over 12 mock rows.

---

## 10. Platform / admin

- No admin console (KYC queue, refunds, dispute, promo, artisans).
- No observability (Sentry, request IDs, payment traces).
- No feature flags.
- No CMS for categories / copy.

---

## 11. Compliance & Nigeria-specific

- NDPR privacy policy and consent log.
- Flutterwave live-mode KYC (business CAC, directors).
- CBN / PSSP constraints if you hold customer balances (escrow wording + settlement).
- SMS DND / sender-ID registration (Termii).
- Tax (WHT on artisan payouts) — not calculated.
- Consumer protection copy (right to cancel).

---

## 12. Mobile product quality

- Dark mode token exists in a store, not applied.
- No i18n (Pidgin, Yoruba, Igbo, Hausa).
- No offline queue.
- No E2E tests, no contract tests against Flutterwave fixtures.
- No App Store / Play listing, crash-free monitoring, or store ratings prompt.
- Maps, image picker, document picker not installed.
- Accessibility is partial.

---

## What this change ships vs what it does not

**Ships now**

- Full Supabase schema + RLS + storage + seed categories/artisans.
- Edge Functions: payments initialize/verify/webhook, payouts, banks list/resolve, job create/transition, referrals.
- Flutterwave v3 Standard + transfers, documented test cards.
- App client: Supabase + social login + payment checkout + payout account, mock fallback if env is empty.

**Still later**

- Artisan app, live map tracking, push, real SMS provider hookup, admin, disputes, tokenization, PostGIS, i18n, dark mode, KYC vendor.
