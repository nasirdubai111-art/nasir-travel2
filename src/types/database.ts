// src/types/database.ts
// Supabase PostgreSQL schema and Row Level Security (RLS) definitions

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          role: "customer" | "operator" | "admin" | "super_admin";
          kyc_status: "pending" | "verified" | "rejected";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "operator" | "admin" | "super_admin";
          kyc_status?: "pending" | "verified" | "rejected";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          avatar_url?: string | null;
          role?: "customer" | "operator" | "admin" | "super_admin";
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
