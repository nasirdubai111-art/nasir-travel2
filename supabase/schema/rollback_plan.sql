-- ============================================================================
-- BHARATYATRA PHASE 2 ROLLBACK & DOWN-MIGRATION SCRIPT
-- Safely tears down Phase 2 objects in reverse dependency order without touching legacy data.
-- ============================================================================

-- 1. Drop Views
DROP VIEW IF EXISTS public.v_customer_active_passes CASCADE;
DROP VIEW IF EXISTS public.v_operator_settlement_ledger CASCADE;
DROP VIEW IF EXISTS public.v_gstr1_b2b_invoices CASCADE;

-- 2. Drop RPC Functions
DROP FUNCTION IF EXISTS public.process_wallet_transaction(TEXT, NUMERIC, TEXT, TEXT, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_booking_summary(TEXT) CASCADE;

-- 3. Drop Phase 2 Extension Tables (Reverse Topological Order)
DROP TABLE IF EXISTS public.driver_shifts CASCADE;
DROP TABLE IF EXISTS public.customer_support_tickets CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.wallet_transactions CASCADE;
DROP TABLE IF EXISTS public.partner_subscriptions CASCADE;
DROP TABLE IF EXISTS public.crm_follow_ups CASCADE;
DROP TABLE IF EXISTS public.customer_notes CASCADE;
DROP TABLE IF EXISTS public.crm_leads CASCADE;
DROP TABLE IF EXISTS public.saved_co_passengers CASCADE;

-- Notice: Core production tables (users, bookings, payment_transactions, digital_tickets) are preserved.
RAISE NOTICE 'Phase 2 rollback completed cleanly without affecting production bookings or user data.';
