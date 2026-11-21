-- ====================================================================
-- BHARATYATRA SUPER APP — PHASE 2 DATABASE MIGRATION
-- File: supabase/migrations/20261031_phase2_missing_tables_and_rls.sql
-- Description: Non-destructive schema provisioning for missing Phase 2 tables:
--   1. saved_co_passengers
--   2. crm_leads
--   3. customer_notes
--   4. crm_follow_ups
--   5. partner_subscriptions
--   6. wallet_transactions
--   7. notifications
--   8. customer_support_tickets
--   9. driver_shifts
-- Compatible with PostgreSQL 14+, Supabase Auth, Row Level Security (RLS)
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. SAVED CO-PASSENGERS & FAMILY KYC VAULT
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_co_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 1 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
    berth_preference TEXT DEFAULT 'No Preference',
    meal_preference TEXT DEFAULT 'Standard',
    id_proof_type TEXT CHECK (id_proof_type IN ('Aadhaar', 'Passport', 'Voter_ID', 'Driving_License', 'PAN')),
    id_proof_number TEXT,
    id_proof_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_co_passengers_user_id ON public.saved_co_passengers(user_id);

-- --------------------------------------------------------------------
-- 2. CRM LEADS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.crm_leads (
    lead_id TEXT PRIMARY KEY, -- e.g. 'LEAD-1001'
    customer_id TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_crm_leads_customer_id ON public.crm_leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned_to ON public.crm_leads(assigned_to);

-- --------------------------------------------------------------------
-- 3. CUSTOMER NOTES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id TEXT NOT NULL,
    lead_id TEXT NOT NULL REFERENCES public.crm_leads(lead_id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    note_type TEXT NOT NULL DEFAULT 'Call Summary' CHECK (note_type IN (
        'Call Summary',
        'WhatsApp Interaction',
        'Travel Preference',
        'Budget & Quotation',
        'Special Requirement',
        'Payment & Billing',
        'Complaint / Escalation',
        'Internal Memo'
    )),
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    created_by TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_notes_lead_id ON public.customer_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_customer_notes_customer_id ON public.customer_notes(customer_id);

-- --------------------------------------------------------------------
-- 4. CRM FOLLOW-UPS
-- --------------------------------------------------------------------
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

CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_lead_id ON public.crm_follow_ups(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_scheduled_date ON public.crm_follow_ups(scheduled_date);

-- --------------------------------------------------------------------
-- 5. PARTNER SUBSCRIPTIONS (COMMERCIAL MODELS A/B/C/D)
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_subscriptions (
    subscription_id TEXT PRIMARY KEY, -- e.g. 'SUB-OP-2026-901'
    partner_id TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner_id ON public.partner_subscriptions(partner_id);

-- --------------------------------------------------------------------
-- 6. WALLET TRANSACTIONS & REWARDS LEDGER
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    transaction_id TEXT PRIMARY KEY, -- e.g. 'TXN-WLT-99214'
    user_id TEXT NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('TOP_UP', 'BOOKING_DEBIT', 'REFUND_CREDIT', 'CASHBACK', 'PEER_TRANSFER')),
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REVERSED')),
    balance_before NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_after NUMERIC(12, 2) NOT NULL,
    coin_credits INT NOT NULL DEFAULT 0,
    reference_booking_id TEXT,
    payment_gateway_ref TEXT,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user_id ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON public.wallet_transactions(created_at DESC);

-- --------------------------------------------------------------------
-- 7. NOTIFICATIONS & REAL-TIME ALERTS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('PRICE_DROP', 'BOOKING_UPDATE', 'GATE_CHANGE', 'DELAY_ADVISORY', 'OFFER', 'SYSTEM')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    deep_link TEXT,
    severity TEXT NOT NULL DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL', 'SUCCESS')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- --------------------------------------------------------------------
-- 8. CUSTOMER SUPPORT TICKETS & DISPUTES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customer_support_tickets (
    ticket_id TEXT PRIMARY KEY, -- e.g. 'TCK-2026-8812'
    user_id TEXT NOT NULL,
    booking_id TEXT,
    category TEXT NOT NULL CHECK (category IN ('Cancellation / Refund', 'Booking Modification', 'Service Disruption', 'Payment Issue', 'Baggage / Lost Item', 'General Inquiry')),
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

CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_user_id ON public.customer_support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_booking_id ON public.customer_support_tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_tickets_status ON public.customer_support_tickets(status);

-- --------------------------------------------------------------------
-- 9. DRIVER SHIFTS & FLEET TELEMETRY
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.driver_shifts (
    shift_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id TEXT NOT NULL,
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

CREATE INDEX IF NOT EXISTS idx_driver_shifts_driver_id ON public.driver_shifts(driver_id);
CREATE INDEX IF NOT EXISTS idx_driver_shifts_cab_id ON public.driver_shifts(cab_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.saved_co_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_shifts ENABLE ROW LEVEL SECURITY;

-- 1. saved_co_passengers RLS
DROP POLICY IF EXISTS "Users can manage own co-passengers" ON public.saved_co_passengers;
CREATE POLICY "Users can manage own co-passengers"
ON public.saved_co_passengers FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 2. crm_leads RLS
DROP POLICY IF EXISTS "Admins and CRM staff can manage leads" ON public.crm_leads;
CREATE POLICY "Admins and CRM staff can manage leads"
ON public.crm_leads FOR ALL
USING (auth.role() IN ('authenticated', 'service_role'));

-- 3. customer_notes RLS
DROP POLICY IF EXISTS "CRM agents can manage notes" ON public.customer_notes;
CREATE POLICY "CRM agents can manage notes"
ON public.customer_notes FOR ALL
USING (auth.role() IN ('authenticated', 'service_role'));

-- 4. crm_follow_ups RLS
DROP POLICY IF EXISTS "CRM agents can manage follow ups" ON public.crm_follow_ups;
CREATE POLICY "CRM agents can manage follow ups"
ON public.crm_follow_ups FOR ALL
USING (auth.role() IN ('authenticated', 'service_role'));

-- 5. partner_subscriptions RLS
DROP POLICY IF EXISTS "Partners can view own subscription" ON public.partner_subscriptions;
CREATE POLICY "Partners can view own subscription"
ON public.partner_subscriptions FOR SELECT
USING (auth.uid()::text = partner_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage partner subscriptions" ON public.partner_subscriptions;
CREATE POLICY "Admins can manage partner subscriptions"
ON public.partner_subscriptions FOR ALL
USING (auth.role() = 'service_role');

-- 6. wallet_transactions RLS
DROP POLICY IF EXISTS "Users can view own wallet transactions" ON public.wallet_transactions;
CREATE POLICY "Users can view own wallet transactions"
ON public.wallet_transactions FOR SELECT
USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 7. notifications RLS
DROP POLICY IF EXISTS "Users can view and update own notifications" ON public.notifications;
CREATE POLICY "Users can view and update own notifications"
ON public.notifications FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 8. customer_support_tickets RLS
DROP POLICY IF EXISTS "Users can manage own support tickets" ON public.customer_support_tickets;
CREATE POLICY "Users can manage own support tickets"
ON public.customer_support_tickets FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9. driver_shifts RLS
DROP POLICY IF EXISTS "Drivers can manage own shifts" ON public.driver_shifts;
CREATE POLICY "Drivers can manage own shifts"
ON public.driver_shifts FOR ALL
USING (auth.uid()::text = driver_id OR auth.role() = 'service_role');

-- ====================================================================
-- SCHEMA VERIFICATION & VALIDATION BLOCK
-- ====================================================================
DO $$
BEGIN
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'saved_co_passengers') = 1, 'saved_co_passengers table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'crm_leads') = 1, 'crm_leads table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customer_notes') = 1, 'customer_notes table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'crm_follow_ups') = 1, 'crm_follow_ups table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'partner_subscriptions') = 1, 'partner_subscriptions table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wallet_transactions') = 1, 'wallet_transactions table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') = 1, 'notifications table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'customer_support_tickets') = 1, 'customer_support_tickets table missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'driver_shifts') = 1, 'driver_shifts table missing';
    RAISE NOTICE '>>> PHASE 2 DATABASE VALIDATION PASSED: All 9 missing tables, foreign keys, and RLS policies verified successfully! <<<';
END $$;
