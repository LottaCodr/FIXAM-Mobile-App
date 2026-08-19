# Flutterwave (v3) for FixAm

We use **Flutterwave Standard** (hosted checkout), not a card form inside the app. That is the right model for PCI and for Nigerian methods (Verve, USSD, bank transfer, NQR).

Official references:

- [Standard checkout](https://developer.flutterwave.com/docs/collecting-payments/standard) (v3: `POST https://api.flutterwave.com/v3/payments`)
- [Verify](https://developer.flutterwave.com/docs/integration-guides/authentication) — always `GET /v3/transactions/{id}/verify` **and** check amount + currency + `tx_ref`
- [Webhooks](https://developer.flutterwave.com/docs/webhooks.md) — v3 header `verif-hash`; v4 header `flutterwave-signature` (HMAC-SHA256). Our function accepts both.
- [Transfers](https://developer.flutterwave.com/docs/bank-transfer) — artisan payouts
- [Name enquiry](https://developer.flutterwave.com/reference/bank_account_resolve_post.md) — `POST /v3/accounts/resolve`

Amounts are **naira**, not kobo.

## Test cards (test mode)

From Flutterwave’s testing guide (subject to dashboard updates):

| Brand | Number | CVV | PIN | OTP | Expiry |
| --- | --- | --- | --- | --- | --- |
| Mastercard | 5531886652142950 | 564 | 3310 | 12345 | any future |
| Visa | 4187427415564246 | 828 | 3310 | 12345 | any future |
| Verve | 5060666666666666666 | 123 | 3310 | 12345 | any future |

Failed / insufficient-fund cards are listed in the dashboard under **Settings → Test cards**.

Bank transfer in test mode completes via the checkout UI without a real NUBAN credit.

## Environment

| Key | Where |
| --- | --- |
| `FLW_SECRET_KEY` | Edge Function secret only |
| `FLW_PUBLIC_KEY` | Optional, app extra |
| `FLW_SECRET_HASH` | Dashboard webhook secret + Edge Function |
| `FLW_ENCRYPTION_KEY` | Only if you later do direct card charge |

Never put `FLW_SECRET_KEY` in `EXPO_PUBLIC_*`.

## Going live

1. Complete Flutterwave business KYC (CAC, directors).
2. Toggle **Live** and replace keys.
3. Point webhooks at the production functions URL.
4. Re-test one card + one bank transfer + one payout to a real NUBAN (small amount).
