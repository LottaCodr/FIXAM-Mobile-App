/**
 * Flutterwave v3 REST client.
 * Docs: https://developer.flutterwave.com  (v3: api.flutterwave.com/v3)
 *
 * Amounts are in major units (NGN naira), NOT kobo.
 * Secret key stays on the server. The app only ever sees checkout URLs.
 */

const FLW_BASE = "https://api.flutterwave.com/v3";

export type FlwInitPayload = {
  tx_ref: string;
  amount: number;
  currency?: string;
  redirect_url: string;
  customer: { email: string; phonenumber?: string; name?: string };
  customizations?: { title?: string; description?: string; logo?: string };
  payment_options?: string;
  meta?: Record<string, string | number | boolean | null>;
};

export type FlwInitResponse = {
  status: string;
  message: string;
  data?: { link: string; status?: string };
};

export type FlwVerifyData = {
  id: number;
  tx_ref: string;
  flw_ref: string;
  amount: number;
  charged_amount: number;
  app_fee: number;
  currency: string;
  status: string;
  payment_type: string;
  customer?: { email?: string; name?: string; phone_number?: string };
};

async function flwFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const key = Deno.env.get("FLW_SECRET_KEY");
  if (!key) throw new Error("FLW_SECRET_KEY is not set");

  const res = await fetch(`${FLW_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });

  const json = await res.json();
  if (!res.ok || json.status === "error") {
    const message = json.message || json.data?.message || `Flutterwave ${res.status}`;
    throw Object.assign(new Error(message), { status: res.status, payload: json });
  }
  return json as T;
}

export function initializePayment(payload: FlwInitPayload) {
  return flwFetch<FlwInitResponse>("/payments", {
    method: "POST",
    body: JSON.stringify({
      currency: "NGN",
      payment_options: "card,banktransfer,ussd,account,nqr",
      ...payload,
    }),
  });
}

export function verifyById(id: string | number) {
  return flwFetch<{ status: string; data: FlwVerifyData }>(`/transactions/${id}/verify`);
}

export function verifyByRef(txRef: string) {
  return flwFetch<{ status: string; data: FlwVerifyData }>(
    `/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
  );
}

export function listBanks(country = "NG") {
  return flwFetch<{ status: string; data: { id: number; code: string; name: string }[] }>(
    `/banks/${country}`,
  );
}

export function resolveAccount(accountNumber: string, accountBank: string) {
  return flwFetch<{ status: string; data: { account_number: string; account_name: string } }>(
    "/accounts/resolve",
    {
      method: "POST",
      body: JSON.stringify({ account_number: accountNumber, account_bank: accountBank }),
    },
  );
}

export function createTransfer(input: {
  account_bank: string;
  account_number: string;
  amount: number;
  narration: string;
  reference: string;
  currency?: string;
  callback_url?: string;
}) {
  return flwFetch<{ status: string; message: string; data: { id: number; status: string; reference: string } }>(
    "/transfers",
    {
      method: "POST",
      body: JSON.stringify({
        currency: "NGN",
        debit_currency: "NGN",
        ...input,
      }),
    },
  );
}

export function refundTransaction(id: string | number, amount?: number) {
  return flwFetch(`/transactions/${id}/refund`, {
    method: "POST",
    body: JSON.stringify(amount ? { amount } : {}),
  });
}

/**
 * Accept both Flutterwave v3 (`verif-hash` equals the dashboard secret)
 * and v4 (`flutterwave-signature` = HMAC-SHA256(rawBody) base64).
 */
export async function verifyWebhookSignature(req: Request, rawBody: string): Promise<boolean> {
  const secret = Deno.env.get("FLW_SECRET_HASH") ?? "";
  if (!secret) return false;

  const v3 = req.headers.get("verif-hash");
  if (v3 && v3 === secret) return true;

  const v4 = req.headers.get("flutterwave-signature");
  if (v4) {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
    const digest = btoa(String.fromCharCode(...new Uint8Array(sig)));
    if (digest === v4) return true;
  }
  return false;
}

export function paymentSuccessful(data: { status?: string } | undefined) {
  const s = (data?.status ?? "").toLowerCase();
  return s === "successful" || s === "succeeded" || s === "success";
}
