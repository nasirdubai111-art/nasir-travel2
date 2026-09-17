# Supabase Edge Functions: Secure External API Proxy Architecture

## 1. Overview & Security Blueprint

In a travel superapp (Flights, Trains, Buses, Hotels, Resorts, Payments, Maps, SMS, Email, and CRM), client-side applications must communicate with dozens of external partner APIs (IndiGo NDC, IRCTC, Razorpay, Gupshup, Google Maps, SendGrid, LeadSquared, etc.).

> **CRITICAL SECURITY REQUIREMENT**: 
> API keys, client secrets, basic auth passwords, and webhook signing tokens must **NEVER** be shipped to the client browser or bundled in frontend JavaScript.

```
+-------------------+                      +--------------------------+                      +-----------------------+
|   Client Browser  |                      |   Supabase Edge Function |                      |   External 3P Partner |
| (React / Vite UI) |                      |        (Deno Runtime)    |                      | (IndiGo, IRCTC, etc.) |
+---------+---------+                      +------------+-------------+                      +-----------+-----------+
          |                                             |                                                |
          |  1. Invoke Proxy with user JWT              |                                                |
          |  POST /functions/v1/api-proxy               |                                                |
          |  { provider_id: "cred-flight-indigo",       |                                                |
          |    endpoint_path: "/v2/search", ... }       |                                                |
          +-------------------------------------------->|                                                |
          |                                             |  2. Validate User JWT & RBAC                   |
          |                                             |  3. Fetch Secret from Server Vault / Env       |
          |                                             |  4. INJECT Server-Side API Key / Basic Auth    |
          |                                             |                                                |
          |                                             |  5. Outbound HTTPS Call with Secret            |
          |                                             |  POST https://api.indigo.in/v2/search          |
          |                                             |  Headers: { Authorization: Bearer <SECRET> }   |
          |                                             +----------------------------------------------->|
          |                                             |                                                |
          |                                             |  6. Partner Response                           |
          |                                             |<-----------------------------------------------+
          |                                             |                                                |
          |                                             |  7. Strip Sensitive Upstream Headers           |
          |                                             |  8. Audit Log to `api_logs` (Sanitized)        |
          |  9. Return Clean JSON Data                  |                                                |
          |<--------------------------------------------+                                                |
          |                                                                                              
```

---

## 2. Directory Structure

```
supabase/
└── functions/
    ├── README.md                      # This Architecture Guideline
    ├── _shared/
    │   ├── cors.ts                    # CORS preflight & headers
    │   ├── types.ts                   # Types for credentials, payloads, envelopes
    │   └── vault.ts                   # Server-side key retriever & auth injector
    ├── api-proxy/
    │   └── index.ts                   # Edge Function: Secure External API Proxy
    └── manage-api-credentials/
        └── index.ts                   # Edge Function: Admin Credential Vault & Probes
```

---

## 3. Supported Authentication Injection Strategies

The Edge Function automatically determines and applies the correct authentication scheme based on the provider category and metadata:

| Strategy | Applied For | Outbound Transformation (Server-Side) |
|---|---|---|
| `basic_auth` | Razorpay, Cashfree, PayPal | `Authorization: Basic base64(key_id:key_secret)` |
| `bearer_token` | IndiGo NDC, Amadeus, SendGrid | `Authorization: Bearer <secret_token>` |
| `header_api_key` | Gupshup, IRCTC, LeadSquared | `X-API-Key: <key>` and optional `X-API-Secret: <secret>` |
| `custom_header` | MSG91, SMS Gateways | `apikey: <key>` |
| `query_param` | Google Maps Platform | Appends `?key=<GOOGLE_MAPS_API_KEY>` to URL |

---

## 4. How to Deploy to Supabase

### Prerequisites
- Install the Supabase CLI:
  ```bash
  npm install -g supabase
  # or
  brew install supabase/tap/supabase
  ```
- Login to Supabase:
  ```bash
  supabase login
  ```
- Link your project:
  ```bash
  supabase link --project-ref <your-project-id>
  ```

### Deploying the Functions
Deploy each Edge Function to your Supabase project:

```bash
# 1. Deploy the API Proxy Edge Function
supabase functions deploy api-proxy --no-verify-jwt false

# 2. Deploy the Credential Management Edge Function
supabase functions deploy manage-api-credentials
```

---

## 5. Setting Secrets in Supabase Edge Runtime

Secrets for upstream providers or root service keys can be injected directly into the secure Deno environment using the Supabase CLI. They will **never** be visible to the public or in client-side bundles:

```bash
# Set production secrets for travel providers
supabase secrets set \
  RAZORPAY_KEY_ID="rzp_live_xxxxxxxxxx" \
  RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxxxxxxxxxxx" \
  INDIGO_NDC_SECRET="sec_indigo_prod_xxxx" \
  GUPSHUP_API_KEY="gup_ent_xxxxxxxx" \
  GOOGLE_MAPS_SERVER_KEY="AIzaSyXXXXXXXXXXXXXXXX"
```

To list active secrets (without showing values):
```bash
supabase secrets list
```

---

## 6. Client-Side Usage (Frontend Example)

Client components and services call the proxy using the Supabase JavaScript Client. Notice there are **zero API keys** or secrets passed in this code:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Example: Search Flights without exposing IndiGo API keys
 */
export async function searchFlights(origin: string, destination: string, date: string) {
  const { data, error } = await supabase.functions.invoke("api-proxy", {
    body: {
      provider_id: "cred-flight-indigo",
      endpoint_path: "/flights/search",
      method: "POST",
      body: {
        origin,
        destination,
        departureDate: date,
        adults: 1,
      },
    },
  });

  if (error) throw error;
  return data;
}

/**
 * Example: Create Razorpay Order securely
 */
export async function createPaymentOrder(amountInPaisa: number, bookingId: string) {
  const { data, error } = await supabase.functions.invoke("api-proxy", {
    body: {
      provider_id: "cred-payment-razorpay",
      endpoint_path: "/orders",
      method: "POST",
      body: {
        amount: amountInPaisa,
        currency: "INR",
        receipt: `booking_${bookingId}`,
      },
    },
  });

  if (error) throw error;
  return data;
}
```

---

## 7. Security Safeguards & Audit Logging

1. **Authentication Enforcement**:
   Every call to `api-proxy` verifies the caller's JWT token. Unauthenticated users are rejected with `401 Unauthorized`.
2. **Provider Status Check**:
   If a provider is flagged as `inactive`, `expired`, or `revoked` in `api_providers`, outbound calls are immediately blocked (`403 Forbidden`).
3. **Automatic Header Scrubbing**:
   The function strips browser-sent `Authorization` or `X-API-Key` headers before injecting genuine upstream credentials, preventing spoofing.
4. **Sanitized Telemetry**:
   Every proxied call writes an audit entry to the `api_logs` table (including latency, status code, and sanitized endpoints). Sensitive tokens, credit cards, and passwords are never recorded in logs.
