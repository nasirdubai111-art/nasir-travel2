// src/types/database.ts
// Supabase PostgreSQL schema and Row Level Security (RLS) definitions

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          customer_id?: string | null;
          email: string;
          full_name: string | null;
          phone: string | null;
          mobile_number?: string | null;
          country_code?: string | null;
          avatar_url: string | null;
          role: "customer" | "operator" | "agent" | "driver" | "admin" | "super_admin";
          account_status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DEACTIVATED";
          email_verified?: boolean;
          kyc_status: "pending" | "verified" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          customer_id?: string | null;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          mobile_number?: string | null;
          country_code?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "operator" | "agent" | "driver" | "admin" | "super_admin";
          account_status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DEACTIVATED";
          email_verified?: boolean;
          kyc_status?: "pending" | "verified" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string | null;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          mobile_number?: string | null;
          country_code?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "operator" | "agent" | "driver" | "admin" | "super_admin";
          account_status?: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED" | "DEACTIVATED";
          email_verified?: boolean;
          kyc_status?: "pending" | "verified" | "rejected";
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          user_id: string;
          pnr: string;
          vertical: "train" | "flight" | "bus" | "hotel" | "resort" | "lodge" | "tour" | "pilgrimage" | "cab" | "houseboat" | "safari" | "restaurant";
          operator_id: string;
          status: "confirmed" | "pending" | "cancelled" | "refunded";
          journey_date: string;
          total_amount: number;
          tax_amount: number;
          convenience_fee: number;
          passenger_manifest: Json;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          pnr: string;
          vertical: "train" | "flight" | "bus" | "hotel" | "resort" | "lodge" | "tour" | "pilgrimage" | "cab" | "houseboat" | "safari" | "restaurant";
          operator_id: string;
          status?: "confirmed" | "pending" | "cancelled" | "refunded";
          journey_date: string;
          total_amount: number;
          tax_amount?: number;
          convenience_fee?: number;
          passenger_manifest?: Json;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          pnr?: string;
          vertical?: "train" | "flight" | "bus" | "hotel" | "resort" | "lodge" | "tour" | "pilgrimage" | "cab" | "houseboat" | "safari" | "restaurant";
          operator_id?: string;
          status?: "confirmed" | "pending" | "cancelled" | "refunded";
          journey_date?: string;
          total_amount?: number;
          tax_amount?: number;
          convenience_fee?: number;
          passenger_manifest?: Json;
          metadata?: Json;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          booking_id: string;
          user_id: string;
          gateway_order_id: string | null;
          gateway_payment_id: string | null;
          method: "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "CASH";
          amount: number;
          currency: string;
          status: "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED";
          escrow_settled: boolean;
          operator_payout_amount: number;
          platform_margin: number;
          gst_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          user_id: string;
          gateway_order_id?: string | null;
          gateway_payment_id?: string | null;
          method?: "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "CASH";
          amount: number;
          currency?: string;
          status?: "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED";
          escrow_settled?: boolean;
          operator_payout_amount?: number;
          platform_margin?: number;
          gst_amount?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          user_id?: string;
          gateway_order_id?: string | null;
          gateway_payment_id?: string | null;
          method?: "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "CASH";
          amount?: number;
          currency?: string;
          status?: "SUCCESS" | "FAILED" | "PENDING" | "REFUNDED";
          escrow_settled?: boolean;
          operator_payout_amount?: number;
          platform_margin?: number;
          gst_amount?: number;
        };
      };
      digital_tickets: {
        Row: {
          id: string;
          booking_id: string;
          ticket_number: string;
          pnr: string;
          qr_token: string;
          qr_url: string | null;
          pdf_url: string | null;
          barcode: string;
          print_status: "PENDING" | "PRINTED" | "DOWNLOADED";
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          ticket_number: string;
          pnr: string;
          qr_token: string;
          qr_url?: string | null;
          pdf_url?: string | null;
          barcode?: string;
          print_status?: "PENDING" | "PRINTED" | "DOWNLOADED";
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          ticket_number?: string;
          pnr?: string;
          qr_token?: string;
          qr_url?: string | null;
          pdf_url?: string | null;
          barcode?: string;
          print_status?: "PENDING" | "PRINTED" | "DOWNLOADED";
        };
      };
      operator_profiles: {
        Row: {
          id: string;
          user_id: string;
          operator_name: string;
          vertical: string;
          pan_or_gst: string;
          commission_rate: number;
          status: "active" | "pending_audit" | "suspended";
          escrow_balance: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          operator_name: string;
          vertical: string;
          pan_or_gst: string;
          commission_rate?: number;
          status?: "active" | "pending_audit" | "suspended";
          escrow_balance?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          operator_name?: string;
          vertical?: string;
          pan_or_gst?: string;
          commission_rate?: number;
          status?: "active" | "pending_audit" | "suspended";
          escrow_balance?: number;
        };
      };
      api_endpoints: {
        Row: {
          id: string;
          name: string;
          provider?: string;
          module?: string;
          type?: string;
          endpoint_type?: string;
          method?: string;
          http_method?: string;
          endpoint_url: string;
          environment?: string;
          active?: boolean;
          is_active?: boolean;
          description?: string;
          auth_type?: string;
          rate_limit_per_min?: number;
          timeout_ms?: number;
          last_tested_at?: string;
          last_status_code?: number;
          last_latency_ms?: number;
          created_at: string;
          updated_at?: string;
        };
        Insert: {
          id?: string;
          name: string;
          provider?: string;
          module?: string;
          type?: string;
          endpoint_type?: string;
          method?: string;
          http_method?: string;
          endpoint_url: string;
          environment?: string;
          active?: boolean;
          is_active?: boolean;
          description?: string;
          auth_type?: string;
          rate_limit_per_min?: number;
          timeout_ms?: number;
          last_tested_at?: string;
          last_status_code?: number;
          last_latency_ms?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          provider?: string;
          module?: string;
          type?: string;
          endpoint_type?: string;
          method?: string;
          http_method?: string;
          endpoint_url?: string;
          environment?: string;
          active?: boolean;
          is_active?: boolean;
          description?: string;
          auth_type?: string;
          rate_limit_per_min?: number;
          timeout_ms?: number;
          last_tested_at?: string;
          last_status_code?: number;
          last_latency_ms?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      system_settings: {
        Row: {
          id: string;
          settings: Json;
          created_at?: string;
          updated_at: string;
          updated_by?: string;
        };
        Insert: {
          id: string;
          settings: Json;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
        Update: {
          id?: string;
          settings?: Json;
          created_at?: string;
          updated_at?: string;
          updated_by?: string;
        };
      };
      saved_co_passengers: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          age: number;
          gender: "Male" | "Female" | "Other";
          berth_preference: string;
          meal_preference: string;
          id_proof_type: string | null;
          id_proof_number: string | null;
          id_proof_verified: boolean;
          is_primary_contact: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          full_name: string;
          age: number;
          gender: "Male" | "Female" | "Other";
          berth_preference?: string;
          meal_preference?: string;
          id_proof_type?: string | null;
          id_proof_number?: string | null;
          id_proof_verified?: boolean;
          is_primary_contact?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          full_name?: string;
          age?: number;
          gender?: "Male" | "Female" | "Other";
          berth_preference?: string;
          meal_preference?: string;
          id_proof_type?: string | null;
          id_proof_number?: string | null;
          id_proof_verified?: boolean;
          is_primary_contact?: boolean;
          updated_at?: string;
        };
      };
      crm_leads: {
        Row: {
          lead_id: string;
          customer_id: string;
          source: string;
          status: string;
          assigned_to: string;
          priority: "Urgent" | "High" | "Medium" | "Low";
          customer_name: string;
          customer_phone: string;
          customer_email: string;
          city: string | null;
          destination: string;
          category: string;
          deal_value: number;
          score: number;
          metadata?: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          lead_id: string;
          customer_id: string;
          source: string;
          status?: string;
          assigned_to: string;
          priority?: "Urgent" | "High" | "Medium" | "Low";
          customer_name: string;
          customer_phone: string;
          customer_email?: string;
          city?: string | null;
          destination: string;
          category: string;
          deal_value?: number;
          score?: number;
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          lead_id?: string;
          customer_id?: string;
          source?: string;
          status?: string;
          assigned_to?: string;
          priority?: "Urgent" | "High" | "Medium" | "Low";
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string;
          city?: string | null;
          destination?: string;
          category?: string;
          deal_value?: number;
          score?: number;
          metadata?: Json | null;
          updated_at?: string;
        };
      };
      customer_notes: {
        Row: {
          id: string;
          customer_id: string;
          lead_id: string;
          note: string;
          note_type: string;
          is_important: boolean;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          lead_id: string;
          note: string;
          note_type?: string;
          is_important?: boolean;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          lead_id?: string;
          note?: string;
          note_type?: string;
          is_important?: boolean;
          created_by?: string;
        };
      };
      crm_follow_ups: {
        Row: {
          id: string;
          lead_id: string;
          scheduled_date: string;
          scheduled_time: string;
          channel: string;
          priority: string;
          status: string;
          notes: string | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          scheduled_date: string;
          scheduled_time: string;
          channel?: string;
          priority?: string;
          status?: string;
          notes?: string | null;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          scheduled_date?: string;
          scheduled_time?: string;
          channel?: string;
          priority?: string;
          status?: string;
          notes?: string | null;
          completed_at?: string | null;
        };
      };
      partner_subscriptions: {
        Row: {
          subscription_id: string;
          partner_id: string;
          tier: "FREE" | "STANDARD" | "PRO" | "ENTERPRISE";
          commercial_model: "MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D";
          annual_fee_inr: number;
          commission_rate_percent: number;
          billing_cycle: "MONTHLY" | "QUARTERLY" | "ANNUAL";
          payment_status: "ACTIVE" | "PENDING" | "OVERDUE" | "CANCELLED";
          auto_renew: boolean;
          valid_from: string;
          valid_until: string;
          razorpay_subscription_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          subscription_id: string;
          partner_id: string;
          tier?: "FREE" | "STANDARD" | "PRO" | "ENTERPRISE";
          commercial_model?: "MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D";
          annual_fee_inr?: number;
          commission_rate_percent?: number;
          billing_cycle?: "MONTHLY" | "QUARTERLY" | "ANNUAL";
          payment_status?: "ACTIVE" | "PENDING" | "OVERDUE" | "CANCELLED";
          auto_renew?: boolean;
          valid_from?: string;
          valid_until: string;
          razorpay_subscription_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          subscription_id?: string;
          partner_id?: string;
          tier?: "FREE" | "STANDARD" | "PRO" | "ENTERPRISE";
          commercial_model?: "MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D";
          annual_fee_inr?: number;
          commission_rate_percent?: number;
          billing_cycle?: "MONTHLY" | "QUARTERLY" | "ANNUAL";
          payment_status?: "ACTIVE" | "PENDING" | "OVERDUE" | "CANCELLED";
          auto_renew?: boolean;
          valid_from?: string;
          valid_until?: string;
          razorpay_subscription_id?: string | null;
          updated_at?: string;
        };
      };
      wallet_transactions: {
        Row: {
          transaction_id: string;
          user_id: string;
          amount: number;
          transaction_type: "TOP_UP" | "BOOKING_DEBIT" | "REFUND_CREDIT" | "CASHBACK" | "PEER_TRANSFER" | "COMMISSION_PAYOUT" | "ADJUSTMENT";
          entry_type: "DEBIT" | "CREDIT";
          status: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
          balance_before: number;
          balance_after: number;
          coin_credits: number;
          reference_booking_id: string | null;
          payment_gateway_ref: string | null;
          ledger_account_type: string;
          reconciliation_status: "BALANCED" | "DISCREPANCY_FLAGGED" | "AUDITED";
          checksum: string | null;
          remarks: string | null;
          created_at: string;
        };
        Insert: {
          transaction_id: string;
          user_id: string;
          amount: number;
          transaction_type: "TOP_UP" | "BOOKING_DEBIT" | "REFUND_CREDIT" | "CASHBACK" | "PEER_TRANSFER" | "COMMISSION_PAYOUT" | "ADJUSTMENT";
          entry_type?: "DEBIT" | "CREDIT";
          status?: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
          balance_before?: number;
          balance_after: number;
          coin_credits?: number;
          reference_booking_id?: string | null;
          payment_gateway_ref?: string | null;
          ledger_account_type?: string;
          reconciliation_status?: "BALANCED" | "DISCREPANCY_FLAGGED" | "AUDITED";
          checksum?: string | null;
          remarks?: string | null;
          created_at?: string;
        };
        Update: {
          transaction_id?: string;
          user_id?: string;
          amount?: number;
          transaction_type?: "TOP_UP" | "BOOKING_DEBIT" | "REFUND_CREDIT" | "CASHBACK" | "PEER_TRANSFER" | "COMMISSION_PAYOUT" | "ADJUSTMENT";
          entry_type?: "DEBIT" | "CREDIT";
          status?: "PENDING" | "COMPLETED" | "FAILED" | "REVERSED";
          balance_before?: number;
          balance_after?: number;
          coin_credits?: number;
          reference_booking_id?: string | null;
          payment_gateway_ref?: string | null;
          ledger_account_type?: string;
          reconciliation_status?: "BALANCED" | "DISCREPANCY_FLAGGED" | "AUDITED";
          checksum?: string | null;
          remarks?: string | null;
        };
      };
      wallet_ledger_entries: {
        Row: {
          entry_id: string;
          transaction_id: string;
          account_head: string;
          debit_amount: number;
          credit_amount: number;
          currency: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          entry_id?: string;
          transaction_id: string;
          account_head: string;
          debit_amount?: number;
          credit_amount?: number;
          currency?: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          entry_id?: string;
          transaction_id?: string;
          account_head?: string;
          debit_amount?: number;
          credit_amount?: number;
          currency?: string;
          description?: string | null;
        };
      };
      notifications: {
        Row: {
          notification_id: string;
          user_id: string;
          category: string;
          title: string;
          message: string;
          deep_link: string | null;
          severity: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
          is_read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          notification_id?: string;
          user_id: string;
          category: string;
          title: string;
          message: string;
          deep_link?: string | null;
          severity?: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
          is_read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          notification_id?: string;
          user_id?: string;
          category?: string;
          title?: string;
          message?: string;
          deep_link?: string | null;
          severity?: "INFO" | "WARNING" | "CRITICAL" | "SUCCESS";
          is_read?: boolean;
          read_at?: string | null;
        };
      };
      customer_support_tickets: {
        Row: {
          ticket_id: string;
          user_id: string;
          booking_id: string | null;
          category: string;
          subject: string;
          description: string;
          priority: "Urgent" | "High" | "Medium" | "Low";
          status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
          assigned_agent: string | null;
          resolution_notes: string | null;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          ticket_id: string;
          user_id: string;
          booking_id?: string | null;
          category: string;
          subject: string;
          description: string;
          priority?: "Urgent" | "High" | "Medium" | "Low";
          status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
          assigned_agent?: string | null;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          ticket_id?: string;
          user_id?: string;
          booking_id?: string | null;
          category?: string;
          subject?: string;
          description?: string;
          priority?: "Urgent" | "High" | "Medium" | "Low";
          status?: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
          assigned_agent?: string | null;
          resolution_notes?: string | null;
          resolved_at?: string | null;
          updated_at?: string;
        };
      };
      driver_shifts: {
        Row: {
          shift_id: string;
          driver_id: string;
          cab_id: string | null;
          shift_status: "ONLINE" | "BUSY_ON_TRIP" | "OFFLINE" | "ON_BREAK";
          current_city: string;
          assigned_terminal_gate: string | null;
          current_latitude: number | null;
          current_longitude: number | null;
          last_telemetry_ping: string | null;
          shift_start_time: string;
          shift_end_time: string | null;
          trips_completed_count: number;
          created_at: string;
        };
        Insert: {
          shift_id?: string;
          driver_id: string;
          cab_id?: string | null;
          shift_status?: "ONLINE" | "BUSY_ON_TRIP" | "OFFLINE" | "ON_BREAK";
          current_city: string;
          assigned_terminal_gate?: string | null;
          current_latitude?: number | null;
          current_longitude?: number | null;
          last_telemetry_ping?: string | null;
          shift_start_time?: string;
          shift_end_time?: string | null;
          trips_completed_count?: number;
          created_at?: string;
        };
        Update: {
          shift_id?: string;
          driver_id?: string;
          cab_id?: string | null;
          shift_status?: "ONLINE" | "BUSY_ON_TRIP" | "OFFLINE" | "ON_BREAK";
          current_city?: string;
          assigned_terminal_gate?: string | null;
          current_latitude?: number | null;
          current_longitude?: number | null;
          last_telemetry_ping?: string | null;
          shift_start_time?: string;
          shift_end_time?: string | null;
          trips_completed_count?: number;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_booking_summary: {
        Args: { p_user_id: string };
        Returns: Json;
      };
    };
  };
}
