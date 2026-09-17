import { createClient } from "../utils/supabase/client";
import {
  RazorpayPaymentRequestPayload,
  RazorpayCreateOrderResponse,
  RazorpayVerifyPaymentPayload,
  RazorpayVerifyPaymentResponse,
  SupabaseRazorpayTransactionRow,
  RazorpayWebhookSimulatePayload,
  RazorpayWebhookVerifyResponse,
} from "../types/razorpaySupabasePayment";

export class RazorpaySupabasePaymentService {
  private static getSupabaseClient() {
    try {
      return createClient();
    } catch {
      return null;
    }
  }

  /**
   * STEP 1: React Frontend -> Supabase Edge Function
   * "Create payment request"
   */
  static async createPaymentRequest(
    payload: RazorpayPaymentRequestPayload
  ): Promise<RazorpayCreateOrderResponse> {
    const supabase = this.getSupabaseClient();

    // 1. Try Supabase Edge Function direct invocation
    if (supabase) {
      try {
        const { data, error } = await (supabase.functions as any).invoke("razorpay-payment", {
          body: {
            action: "create-payment-request",
            ...payload,
          },
        });

        if (!error && data && data.success) {
          return data as RazorpayCreateOrderResponse;
        }
      } catch (_err) {
        // Fallback to local edge proxy
      }
    }

    // 2. Fallback to server edge function proxy endpoint
    const response = await fetch("/functions/v1/razorpay-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "create-payment-request",
        ...payload,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ error: "Failed to create payment request" }));
      throw new Error(errJson.error || "Edge Function failed to create payment request");
    }

    return await response.json();
  }

  /**
   * STEP 2 & 3 & 4: React Frontend -> Supabase Edge Function
   * "Read Razorpay secret", "Verify payment (HMAC-SHA256)", "Write transaction to Supabase"
   */
  static async verifyPayment(
    payload: RazorpayVerifyPaymentPayload & {
      amount?: number;
      customer_name?: string;
      customer_email?: string;
      customer_phone?: string;
      service_type?: string;
      receipt_number?: string;
    }
  ): Promise<RazorpayVerifyPaymentResponse> {
    const supabase = this.getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await (supabase.functions as any).invoke("razorpay-payment", {
          body: {
            action: "verify-payment",
            ...payload,
          },
        });

        if (!error && data) {
          return data as RazorpayVerifyPaymentResponse;
        }
      } catch (_err) {
        // Fallback to proxy
      }
    }

    const response = await fetch("/functions/v1/razorpay-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "verify-payment",
        ...payload,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({ error: "Verification failed" }));
      throw new Error(errJson.error || "Edge Function signature verification failed");
    }

    return await response.json();
  }

  /**
   * STEP 3: Verify Webhook / Signature
   */
  static async verifyWebhook(
    payload: RazorpayWebhookSimulatePayload
  ): Promise<RazorpayWebhookVerifyResponse> {
    const simulatedRawPayload = {
      event: payload.event,
      payload: {
        payment: {
          entity: {
            id: payload.payment_id || `pay_sim_${Date.now().toString().slice(-6)}`,
            order_id: payload.order_id || "order_sim_99120",
            amount: (payload.amount || 15000) * 100,
            currency: "INR",
            status: payload.event === "payment.failed" ? "failed" : "captured",
          },
        },
      },
    };

    const response = await fetch("/functions/v1/razorpay-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "simulated_whsec_verified_sig",
      },
      body: JSON.stringify({
        action: "verify-webhook",
        event: payload.event,
        order_id: payload.order_id,
        raw_payload: simulatedRawPayload,
        signature: "simulated_whsec_verified_sig",
      }),
    });

    return await response.json();
  }

  /**
   * STEP 4 & 5: Read Transactions from Supabase Database
   */
  static async getTransactions(): Promise<SupabaseRazorpayTransactionRow[]> {
    const supabase = this.getSupabaseClient();

    // 1. Direct Supabase Query if configured
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("razorpay_transactions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50);

        if (!error && data && data.length > 0) {
          return data as SupabaseRazorpayTransactionRow[];
        }
      } catch (_e) {
        // Continue to edge function endpoint
      }
    }

    // 2. Fetch via Edge Function endpoint
    try {
      const response = await fetch("/functions/v1/razorpay-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-transactions" }),
      });

      if (response.ok) {
        const result = await response.json();
        return result.transactions || [];
      }
    } catch (_e) {
      // Return empty array
    }

    return [];
  }

  /**
   * Compute standard client checkout signature for demonstration / simulated test payment
   */
  static async generateSimulatedSignature(orderId: string, paymentId: string): Promise<string> {
    // Generate a reproducible SHA256 signature
    const text = `${orderId}|${paymentId}`;
    const msgUint8 = new TextEncoder().encode(text + "_yatra_secret");
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }
}
