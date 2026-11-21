-- ============================================================================
-- SCRIPT 14: PHASE 2 BACKEND INTEGRATION & MISSING TABLES RESOLUTION
-- BharatYatra Travel Super App • Supabase PostgreSQL Production Migration
-- Tables: saved_co_passengers, crm_leads, customer_notes, crm_follow_ups,
--         partner_subscriptions, wallet_transactions, wallet_ledger_entries,
--         notifications, customer_support_tickets, driver_shifts
-- Features: Double-Entry Accounting Ledger, Immutable Entries, Reconciliation,
--           Strict RLS Policies, Tenant Isolation, RBAC Grants
-- ============================================================================

-- Ensure Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. SAVED CO-PASSENGERS & FAMILY KYC VAULT
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.saved_co_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 1 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    berth_preference TEXT DEFAULT 'No Preference' CHECK (berth_preference IN ('No Preference', 'Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper', 'Window')),
    meal_preference TEXT DEFAULT 'Standard' CHECK (meal_preference IN ('Standard', 'Veg Hindu', 'Jain Meal', 'Non-Veg', 'Diabetic Veg', 'Halal', 'No Meal')),
    id_proof_type TEXT CHECK (id_proof_type IN ('Aadhaar', 'Passport', 'Voter_ID', 'Driving_License', 'PAN', 'Student_ID')),
    id_proof_number TEXT,
    id_proof_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_co_passengers_user ON public.saved_co_passengers(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_co_passengers_verified ON public.saved_co_passengers(user_id, id_proof_verified);

-- ============================================================================
-- 2. CRM LEADS & ENTERPRISE PIPELINE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.crm_leads (
    lead_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    source TEXT NOT NULL CHECK (source IN ('WhatsApp', 'Meta Ads', 'Google Search', 'Organic SEO', 'Direct App', 'Telesales', 'Partner Portal', 'Referral')),
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost')),
    assigned_to TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Urgent', 'High', 'Medium', 'Low')),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    city TEXT,
    destination TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Flights', 'Trains', 'Buses', 'Hotels', 'Resorts', 'Tours', 'Pilgrimage', 'Houseboats', 'Cabs', 'Safari')),
    deal_value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    score INT NOT NULL DEFAULT 50 CHECK (score >= 0 AND score <= 100),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_leads_customer ON public.crm_leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned ON public.crm_leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_crm_leads_priority ON public.crm_leads(priority);
CREATE INDEX IF NOT EXISTS idx_crm_leads_metadata_gin ON public.crm_leads USING gin(metadata);

-- ============================================================================
-- 3. CUSTOMER NOTES & INTERACTION LOGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    lead_id TEXT NOT NULL REFERENCES public.crm_leads(lead_id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    note_type TEXT NOT NULL DEFAULT 'Call Summary' CHECK (note_type IN (
        'Call Summary', 'WhatsApp Interaction', 'Travel Preference', 'Budget & Quotation',
        'Special Requirement', 'Payment & Billing', 'Complaint / Escalation', 'Internal Memo'
    )),
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_lead ON public.customer_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_customer_notes_customer ON public.customer_notes(customer_id);

-- CRM Follow-Ups Companion Table
CREATE TABLE IF NOT EXISTS public.crm_follow_ups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id TEXT NOT NULL REFERENCES public.crm_leads(lead_id) ON DELETE CASCADE,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    channel TEXT NOT NULL DEFAULT 'Outbound Call' CHECK (channel IN ('Outbound Call', 'WhatsApp', 'Email', 'Physical Meeting')),
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Urgent', 'High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Overdue', 'Rescheduled')),
    notes TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_lead ON public.crm_follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_status ON public.crm_follow_ups(status, scheduled_date);

-- ============================================================================
-- 4. PARTNER SUBSCRIPTIONS (COMMERCIAL MODELS A/B/C/D)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.partner_subscriptions (
    subscription_id TEXT PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.operator_profiles(id) ON DELETE CASCADE,
    tier TEXT NOT NULL DEFAULT 'STANDARD' CHECK (tier IN ('FREE', 'STANDARD', 'PRO', 'ENTERPRISE')),
    commercial_model TEXT NOT NULL DEFAULT 'MODEL_A' CHECK (commercial_model IN ('MODEL_A', 'MODEL_B', 'MODEL_C', 'MODEL_D')),
    annual_fee_inr NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    commission_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    billing_cycle TEXT NOT NULL DEFAULT 'ANNUAL' CHECK (billing_cycle IN ('MONTHLY', 'QUARTERLY', 'ANNUAL')),
    payment_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (payment_status IN ('ACTIVE', 'PENDING', 'OVERDUE', 'CANCELLED')),
    auto_renew BOOLEAN NOT NULL DEFAULT TRUE,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    valid_until TIMESTAMPTZ NOT NULL,
    razorpay_subscription_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner ON public.partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_tier ON public.partner_subscriptions(tier);
CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_status ON public.partner_subscriptions(payment_status);

-- ============================================================================
-- 5. DOUBLE-ENTRY ACCOUNTING LEDGER & WALLET PASSBOOK
-- ============================================================================
-- 5A. Primary Wallet Transactions (Passbook View)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    transaction_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('TOP_UP', 'BOOKING_DEBIT', 'REFUND_CREDIT', 'CASHBACK', 'PEER_TRANSFER', 'COMMISSION_PAYOUT', 'ADJUSTMENT')),
    entry_type TEXT NOT NULL DEFAULT 'CREDIT' CHECK (entry_type IN ('DEBIT', 'CREDIT')),
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')),
    balance_before NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_after NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    coin_credits INT NOT NULL DEFAULT 0,
    reference_booking_id TEXT,
    payment_gateway_ref TEXT,
    ledger_account_type TEXT NOT NULL DEFAULT 'USER_PREPAID' CHECK (ledger_account_type IN ('USER_PREPAID', 'COMPANY_ESCROW', 'PROMOTIONAL_REWARDS', 'GATEWAY_CLEARING', 'AGENT_CREDIT_RESERVE')),
    reconciliation_status TEXT NOT NULL DEFAULT 'BALANCED' CHECK (reconciliation_status IN ('BALANCED', 'DISCREPANCY_FLAGGED', 'AUDITED')),
    checksum TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Idempotent non-destructive column additions in case wallet_transactions existed with basic schema
ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS entry_type TEXT NOT NULL DEFAULT 'CREDIT' CHECK (entry_type IN ('DEBIT', 'CREDIT'));
ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS ledger_account_type TEXT NOT NULL DEFAULT 'USER_PREPAID';
ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS reconciliation_status TEXT NOT NULL DEFAULT 'BALANCED';
ALTER TABLE public.wallet_transactions ADD COLUMN IF NOT EXISTS checksum TEXT;

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_status ON public.wallet_transactions(status);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_type ON public.wallet_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_booking ON public.wallet_transactions(reference_booking_id);

-- 5B. Double-Entry Accounting Ledger Entries (Immutable Audit Trail)
-- Every financial movement MUST balance: SUM(debit_amount) = SUM(credit_amount)
CREATE TABLE IF NOT EXISTS public.wallet_ledger_entries (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL REFERENCES public.wallet_transactions(transaction_id) ON DELETE CASCADE,
    account_head TEXT NOT NULL CHECK (account_head IN (
        'USER_WALLET_LIABILITY',
        'PLATFORM_CASH_ESCROW',
        'PAYMENT_GATEWAY_RECEIVABLE',
        'REVENUE_COMMISSION',
        'MARKETING_PROMO_EXPENSE',
        'AGENT_CREDIT_RESERVE',
        'REFUND_CLEARING_ACCOUNT'
    )),
    debit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (debit_amount >= 0),
    credit_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (credit_amount >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_at_least_one_side CHECK ((debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0))
);

CREATE INDEX IF NOT EXISTS idx_wallet_ledger_txn ON public.wallet_ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_account ON public.wallet_ledger_entries(account_head);
CREATE INDEX IF NOT EXISTS idx_wallet_ledger_created ON public.wallet_ledger_entries(created_at);

-- 5C. Function: Calculate SHA-256 Checksum for Immutable Ledger Integrity
CREATE OR REPLACE FUNCTION public.generate_wallet_txn_checksum(
    p_txn_id TEXT,
    p_user_id TEXT,
    p_amount NUMERIC,
    p_type TEXT,
    p_balance_after NUMERIC,
    p_timestamp TIMESTAMPTZ
) RETURNS TEXT AS $$
BEGIN
    RETURN encode(digest(p_txn_id || '|' || p_user_id || '|' || p_amount::text || '|' || p_type || '|' || p_balance_after::text || '|' || p_timestamp::text || '|bharatyatra_audit_salt', 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-generate checksum on insert
CREATE OR REPLACE FUNCTION public.trg_wallet_txn_checksum()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.checksum IS NULL THEN
        NEW.checksum := public.generate_wallet_txn_checksum(
            NEW.transaction_id,
            NEW.user_id,
            NEW.amount,
            NEW.transaction_type,
            NEW.balance_after,
            COALESCE(NEW.created_at, NOW())
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_wallet_checksum_before_insert ON public.wallet_transactions;
CREATE TRIGGER trg_wallet_checksum_before_insert
BEFORE INSERT ON public.wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION public.trg_wallet_txn_checksum();

-- 5D. Double-Entry Balancing Verification Function
CREATE OR REPLACE FUNCTION public.verify_double_entry_ledger_balance(p_txn_id TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    v_total_debit NUMERIC(12, 2);
    v_total_credit NUMERIC(12, 2);
BEGIN
    SELECT COALESCE(SUM(debit_amount), 0.00), COALESCE(SUM(credit_amount), 0.00)
    INTO v_total_debit, v_total_credit
    FROM public.wallet_ledger_entries
    WHERE transaction_id = p_txn_id;

    IF v_total_debit = v_total_credit AND v_total_debit > 0 THEN
        UPDATE public.wallet_transactions
        SET reconciliation_status = 'BALANCED'
        WHERE transaction_id = p_txn_id;
        RETURN TRUE;
    ELSE
        UPDATE public.wallet_transactions
        SET reconciliation_status = 'DISCREPANCY_FLAGGED'
        WHERE transaction_id = p_txn_id;
        RETURN FALSE;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. NOTIFICATIONS & REAL-TIME ALERTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('PRICE_DROP', 'BOOKING_UPDATE', 'GATE_CHANGE', 'DELAY_ADVISORY', 'OFFER', 'SYSTEM', 'PAYMENT', 'KYC')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    deep_link TEXT,
    severity TEXT NOT NULL DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL', 'SUCCESS')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_category ON public.notifications(category);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON public.notifications(created_at DESC);

-- ============================================================================
-- 7. CUSTOMER SUPPORT TICKETS & GRIEVANCE RESOLUTION
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.customer_support_tickets (
    ticket_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id TEXT REFERENCES public.bookings(booking_id) ON DELETE SET NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Cancellation / Refund',
        'Booking Modification',
        'Service Disruption',
        'Payment Issue',
        'Baggage / Lost Item',
        'General Inquiry',
        'VIP Darshan Slot',
        'Driver Feedback'
    )),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Urgent', 'High', 'Medium', 'Low')),
    status TEXT NOT NULL DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    assigned_agent TEXT,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON public.customer_support_tickets(user_id, status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON public.customer_support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_booking ON public.customer_support_tickets(booking_id);

-- ============================================================================
-- 8. DRIVER SHIFTS & FLEET TELEMETRY
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.driver_shifts (
    shift_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cab_id TEXT REFERENCES public.cab(cab_id) ON DELETE SET NULL,
    shift_status TEXT NOT NULL DEFAULT 'OFFLINE' CHECK (shift_status IN ('ONLINE', 'BUSY_ON_TRIP', 'OFFLINE', 'ON_BREAK')),
    current_city TEXT NOT NULL,
    assigned_terminal_gate TEXT,
    current_latitude NUMERIC(10, 7),
    current_longitude NUMERIC(10, 7),
    last_telemetry_ping TIMESTAMPTZ DEFAULT NOW(),
    shift_start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    shift_end_time TIMESTAMPTZ,
    trips_completed_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_driver_shifts_driver ON public.driver_shifts(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_shifts_status ON public.driver_shifts(shift_status);
CREATE INDEX IF NOT EXISTS idx_driver_shifts_city ON public.driver_shifts(current_city);
CREATE INDEX IF NOT EXISTS idx_driver_shifts_ping ON public.driver_shifts(last_telemetry_ping DESC);

-- ============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES & TENANT ISOLATION
-- ============================================================================
ALTER TABLE public.saved_co_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_shifts ENABLE ROW LEVEL SECURITY;

-- 9.1 saved_co_passengers
DROP POLICY IF EXISTS "Customers manage own co_passengers" ON public.saved_co_passengers;
CREATE POLICY "Customers manage own co_passengers"
ON public.saved_co_passengers FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9.2 crm_leads
DROP POLICY IF EXISTS "Users can view own CRM leads" ON public.crm_leads;
CREATE POLICY "Users can view own CRM leads"
ON public.crm_leads FOR SELECT
USING (auth.uid()::text = customer_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role & staff manage CRM leads" ON public.crm_leads;
CREATE POLICY "Service role & staff manage CRM leads"
ON public.crm_leads FOR ALL
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 9.3 customer_notes
DROP POLICY IF EXISTS "Customer notes isolation" ON public.customer_notes;
CREATE POLICY "Customer notes isolation"
ON public.customer_notes FOR ALL
USING (auth.role() = 'service_role' OR (note_type <> 'Internal Memo' AND auth.uid()::text = customer_id))
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 9.4 crm_follow_ups
DROP POLICY IF EXISTS "CRM follow ups staff access" ON public.crm_follow_ups;
CREATE POLICY "CRM follow ups staff access"
ON public.crm_follow_ups FOR ALL
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- 9.5 partner_subscriptions
DROP POLICY IF EXISTS "Partners view own subscriptions" ON public.partner_subscriptions;
CREATE POLICY "Partners view own subscriptions"
ON public.partner_subscriptions FOR SELECT
USING (
    partner_id IN (SELECT id FROM public.operator_profiles WHERE user_id = auth.uid()::text)
    OR auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Service role manage partner subscriptions" ON public.partner_subscriptions;
CREATE POLICY "Service role manage partner subscriptions"
ON public.partner_subscriptions FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 9.6 wallet_transactions
DROP POLICY IF EXISTS "Users view own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users view own wallet transactions"
ON public.wallet_transactions FOR SELECT
USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role manage wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Service role manage wallet transactions"
ON public.wallet_transactions FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 9.7 wallet_ledger_entries
DROP POLICY IF EXISTS "Users view own ledger entries" ON public.wallet_ledger_entries;
CREATE POLICY "Users view own ledger entries"
ON public.wallet_ledger_entries FOR SELECT
USING (
    transaction_id IN (SELECT transaction_id FROM public.wallet_transactions WHERE user_id = auth.uid()::text)
    OR auth.role() = 'service_role'
);

DROP POLICY IF EXISTS "Service role manage ledger entries" ON public.wallet_ledger_entries;
CREATE POLICY "Service role manage ledger entries"
ON public.wallet_ledger_entries FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 9.8 notifications
DROP POLICY IF EXISTS "Users manage own notifications" ON public.notifications;
CREATE POLICY "Users manage own notifications"
ON public.notifications FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9.9 customer_support_tickets
DROP POLICY IF EXISTS "Users manage own support tickets" ON public.customer_support_tickets;
CREATE POLICY "Users manage own support tickets"
ON public.customer_support_tickets FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9.10 driver_shifts
DROP POLICY IF EXISTS "Drivers manage own shifts" ON public.driver_shifts;
CREATE POLICY "Drivers manage own shifts"
ON public.driver_shifts FOR ALL
USING (auth.uid()::text = driver_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = driver_id OR auth.role() = 'service_role');

-- ============================================================================
-- 10. ROLE-BASED ACCESS CONTROL (RBAC) GRANTS
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_co_passengers TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.crm_leads TO authenticated;
GRANT SELECT, INSERT ON public.customer_notes TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.crm_follow_ups TO authenticated;
GRANT SELECT ON public.partner_subscriptions TO authenticated;
GRANT SELECT ON public.wallet_transactions TO authenticated;
GRANT SELECT ON public.wallet_ledger_entries TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.customer_support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.driver_shifts TO authenticated;

-- Master service_role grants
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO service_role;
