export interface RazorpayPaymentRequestPayload {
  amount: number; // in INR
  currency?: string; // Default: 'INR'
  booking_id: string;
  service_type: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  notes?: Record<string, string>;
  method_preference?: "upi" | "card" | "netbanking" | "wallet";
}

export interface RazorpayCreateOrderResponse {
  success: boolean;
  order_id: string;
  amount: number; // in paise
  amount_inr: number;
  currency: string;
  key_id: string; // safe key_id returned to frontend
  receipt_number: string;
  booking_id: string;
  service_type: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  status: "created" | "failed";
  created_at: string;
  edge_function_metadata: {
    function_name: string;
    execution_id: string;
    secret_source: "vault" | "environment" | "test_simulated";
    supabase_synced: boolean;
    duration_ms: number;
  };
  error?: string;
}

export interface RazorpayVerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  booking_id?: string;
  payment_method?: string;
}

export interface RazorpayTravelReceipt {
  receipt_number: string;
  transaction_id: string;
  booking_id: string;
  service_type: string;
  payment_id: string;
  order_id: string;
  signature_verified: boolean;
  paid_at: string;
  amount: number; // INR
  currency: string;
  base_amount: number;
  gst_amount: number;
  gst_rate_pct: number;
  convenience_fee: number;
  payment_method: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  provider_details: {
    company_name: string;
    gstin: string;
    sac_code: string;
    cin: string;
    nodal_account: string;
  };
  supabase_synced: boolean;
  supabase_table: string;
}

export interface RazorpayVerifyPaymentResponse {
  success: boolean;
  signature_verified: boolean;
  transaction_id: string;
  order_id: string;
  payment_id: string;
  status: "captured" | "failed";
  receipt_number: string;
  verified_at: string;
  supabase_record_id?: string;
  supabase_write_status: "success" | "pending" | "fallback_local";
  travel_receipt?: RazorpayTravelReceipt;
  edge_function_metadata?: {
    function_name: string;
    execution_id: string;
    secret_source: "vault" | "environment" | "test_simulated";
    duration_ms: number;
  };
  error?: string;
}

export interface SupabaseRazorpayTransactionRow {
  id: string;
  order_id: string;
  payment_id: string;
  signature: string;
  signature_verified: boolean;
  amount: number;
  currency: string;
  status: "created" | "authorized" | "captured" | "failed" | "refunded";
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  booking_id: string;
  service_type: string;
  method: string;
  receipt_number: string;
  error_reason?: string | null;
  metadata: Record<string, any>;
  created_at: string;
  verified_at?: string | null;
}

export interface RazorpayWebhookSimulatePayload {
  event: "payment.captured" | "payment.failed" | "order.paid" | "refund.processed";
  order_id?: string;
  payment_id?: string;
  amount?: number;
  customer_email?: string;
}

export interface RazorpayWebhookVerifyResponse {
  success: boolean;
  event: string;
  signature_verified: boolean;
  webhook_id: string;
  processed_at: string;
  supabase_updated: boolean;
  action_taken: string;
  error?: string;
}
