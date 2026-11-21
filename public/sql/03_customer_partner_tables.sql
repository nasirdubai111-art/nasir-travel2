-- ============================================================================
-- SCRIPT 03: CUSTOMER & PARTNER PROFILES
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Tables: operator_profiles, saved_co_passengers, partner_subscriptions, driver_shifts, crm_leads, customer_notes, crm_follow_ups
-- ============================================================================

-- 1. Operator Commercial Profiles
CREATE TABLE IF NOT EXISTS public.operator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    operator_name TEXT NOT NULL,
    vertical TEXT NOT NULL,
    pan_or_gst TEXT NOT NULL,
    commission_rate NUMERIC(5,2) NOT NULL DEFAULT 5.00,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending_audit', 'suspended')),
    escrow_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Customer Saved Co-Passengers & Family KYC Vault
CREATE TABLE IF NOT EXISTS public.saved_co_passengers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- 3. Partner Subscription Plans (Commercial Models A/B/C/D)
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

-- 4. CRM Leads (Customer Relationship Management)
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

-- 5. Customer Interaction Notes
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

-- 6. CRM Scheduled Follow-Ups
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

-- 7. Driver Roster & Shift Telemetry
CREATE TABLE IF NOT EXISTS public.driver_shifts (
    shift_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    cab_id TEXT, -- Foreign key added in script 06 after cab table is created
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
