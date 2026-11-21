const fs = require("fs");
const path = require("path");

const targetDirs = [
  path.join(process.cwd(), "supabase", "schema"),
  path.join(process.cwd(), "public", "sql")
];

targetDirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function writeSql(filename, content) {
  targetDirs.forEach(dir => {
    fs.writeFileSync(path.join(dir, filename), content.trim() + "\n", "utf8");
  });
  console.log(`Generated: ${filename}`);
}

// ============================================================================
// 1. 01_schema_extensions.sql
// ============================================================================
writeSql("01_schema_extensions.sql", `
-- ============================================================================
-- SCRIPT 01: EXTENSIONS, SCHEMAS & CUSTOM DOMAINS
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- Ensure required cryptographic and UUID generation extensions are installed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- Ensure public schema exists and search path is set
SET search_path TO public, auth;

-- Custom types (enums) for robust type safety without recreating existing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_platform_role') THEN
        CREATE TYPE user_platform_role AS ENUM ('customer', 'operator', 'agent', 'driver', 'admin', 'super_admin');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'kyc_verification_status') THEN
        CREATE TYPE kyc_verification_status AS ENUM ('pending', 'verified', 'rejected');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'travel_booking_status') THEN
        CREATE TYPE travel_booking_status AS ENUM ('confirmed', 'pending', 'in_progress', 'completed', 'cancelled', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'financial_payment_status') THEN
        CREATE TYPE financial_payment_status AS ENUM ('captured', 'created', 'authorized', 'failed', 'refunded', 'partially_refunded');
    END IF;
END $$;
`);

// ============================================================================
// 2. 02_root_tables.sql
// ============================================================================
writeSql("02_root_tables.sql", `
-- ============================================================================
-- SCRIPT 02: ROOT MASTER TABLES
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Tables: users, system_settings, regional_holidays, api_providers, api_endpoints, api_logs
-- ============================================================================

-- 1. Master Users Registry
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'operator', 'agent', 'driver', 'admin', 'super_admin')),
    kyc_status TEXT NOT NULL DEFAULT 'pending' CHECK (kyc_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. System Settings & Global Config
CREATE TABLE IF NOT EXISTS public.system_settings (
    key VARCHAR(128) PRIMARY KEY,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Regional Holidays & Dynamic Calendar Surges
CREATE TABLE IF NOT EXISTS public.regional_holidays (
    id VARCHAR(64) PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL,
    state_name VARCHAR(100) NOT NULL,
    applicable_state_codes VARCHAR(10)[] NOT NULL DEFAULT '{}',
    applicable_states TEXT[] NOT NULL DEFAULT '{}',
    holiday_date DATE NOT NULL,
    holiday_name VARCHAR(255) NOT NULL,
    holiday_type VARCHAR(50) NOT NULL DEFAULT 'festival',
    category VARCHAR(50) NOT NULL DEFAULT 'state',
    surge_percent NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    custom_surge_percent NUMERIC(5,2),
    pricing_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'available',
    is_long_weekend BOOLEAN NOT NULL DEFAULT FALSE,
    long_weekend_days INT NOT NULL DEFAULT 1,
    affected_services TEXT[] NOT NULL DEFAULT '{"flights","trains","buses","hotels","tours","pilgrimage","cabs","activities"}',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. API Mesh Providers & Credentials
CREATE TABLE IF NOT EXISTS public.api_providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id VARCHAR(64) UNIQUE NOT NULL,
    name VARCHAR(128) NOT NULL,
    auth_type VARCHAR(32) NOT NULL DEFAULT 'API_KEY',
    environment VARCHAR(32) NOT NULL DEFAULT 'sandbox',
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    api_key TEXT NOT NULL,
    api_secret TEXT,
    base_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. API Mesh Endpoints Registry
CREATE TABLE IF NOT EXISTS public.api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(128) NOT NULL,
    provider VARCHAR(64) NOT NULL,
    module VARCHAR(64) NOT NULL,
    endpoint_type VARCHAR(32) NOT NULL DEFAULT 'REST',
    http_method VARCHAR(16) NOT NULL DEFAULT 'GET',
    endpoint_url TEXT NOT NULL,
    environment VARCHAR(32) NOT NULL DEFAULT 'production',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    rate_limit_per_min INT NOT NULL DEFAULT 120,
    timeout_ms INT NOT NULL DEFAULT 5000,
    last_tested_at TIMESTAMPTZ,
    last_status_code INT,
    last_latency_ms INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. API Telemetry & Audit Logs
CREATE TABLE IF NOT EXISTS public.api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID REFERENCES public.api_providers(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL,
    status_code INT NOT NULL,
    response_time_ms INT NOT NULL,
    error_message TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`);

// ============================================================================
// 3. 03_customer_partner_tables.sql
// ============================================================================
writeSql("03_customer_partner_tables.sql", `
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
`);

// ============================================================================
// 4. 04_booking_inventory_tables.sql
// ============================================================================
writeSql("04_booking_inventory_tables.sql", `
-- ============================================================================
-- SCRIPT 04: CORE BOOKINGS & MULTI-VERTICAL INVENTORY TABLES
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Tables: bookings, bookings_items, digital_tickets, houseboats, houseboat_bookings, safari_packages, safari_bookings, cab, cab_bookings
-- ============================================================================

-- 1. Master Root Bookings Ledger
CREATE TABLE IF NOT EXISTS public.bookings (
    booking_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_pan TEXT,
    customer_gstin TEXT,
    booking_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    travel_start_date TIMESTAMPTZ NOT NULL,
    travel_end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'in_progress', 'completed', 'cancelled', 'refunded')),
    total_amount NUMERIC(12, 2) NOT NULL,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    net_payable_amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    special_requests TEXT,
    internal_notes TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Polymorphic Booking Line Items
CREATE TABLE IF NOT EXISTS public.bookings_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN (
        'Flight', 'Train', 'Bus', 'Hotel', 'Resort', 'Lodge', 'Tour', 'Pilgrimage', 'Cab'
    )),
    title TEXT NOT NULL,
    service_provider TEXT NOT NULL,
    item_code_or_pnr TEXT,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    amount NUMERIC(12, 2) NOT NULL,
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'pending', 'cancelled', 'completed')),
    sac_code TEXT NOT NULL DEFAULT '998555',
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Digital Travel Passes & Encrypted Gate Tokens
CREATE TABLE IF NOT EXISTS public.digital_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    ticket_number TEXT NOT NULL UNIQUE,
    pnr TEXT NOT NULL,
    qr_token TEXT NOT NULL,
    qr_url TEXT,
    pdf_url TEXT,
    barcode TEXT NOT NULL,
    print_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (print_status IN ('PENDING', 'PRINTED', 'DOWNLOADED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Houseboats Fleet Directory
CREATE TABLE IF NOT EXISTS public.houseboats (
    houseboat_id TEXT PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.operator_profiles(id) ON DELETE CASCADE,
    partner_name TEXT NOT NULL,
    name TEXT NOT NULL,
    vessel_registration_number TEXT NOT NULL UNIQUE,
    waterbody TEXT NOT NULL,
    destination TEXT NOT NULL,
    state TEXT NOT NULL,
    total_bedrooms INT NOT NULL DEFAULT 1 CHECK (total_bedrooms >= 1),
    max_guests INT NOT NULL DEFAULT 2 CHECK (max_guests >= 1),
    crew_count INT NOT NULL DEFAULT 3,
    captain_name TEXT,
    chef_name TEXT,
    contact_phone TEXT,
    starting_price_per_night NUMERIC(10, 2) NOT NULL,
    tax_rate_percent NUMERIC(4, 2) NOT NULL DEFAULT 5.00,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    reviews_count INT NOT NULL DEFAULT 0,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    dining_specialties JSONB DEFAULT '[]'::jsonb,
    cabins JSONB DEFAULT '[]'::jsonb,
    safety_certificates JSONB DEFAULT '[]'::jsonb,
    available_dates JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'docked', 'maintenance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Houseboat Bookings
CREATE TABLE IF NOT EXISTS public.houseboat_bookings (
    booking_id TEXT PRIMARY KEY,
    houseboat_id TEXT NOT NULL REFERENCES public.houseboats(houseboat_id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    partner_id UUID NOT NULL REFERENCES public.operator_profiles(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    checkin_date TIMESTAMPTZ NOT NULL,
    checkout_date TIMESTAMPTZ NOT NULL,
    nights INT NOT NULL DEFAULT 1,
    guests_count INT NOT NULL DEFAULT 2,
    bedrooms_booked INT NOT NULL DEFAULT 1,
    meal_plan TEXT DEFAULT 'All Meals (Breakfast, Lunch, Dinner)',
    special_requests TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Wildlife Safari Packages Directory
CREATE TABLE IF NOT EXISTS public.safari_packages (
    package_id TEXT PRIMARY KEY,
    national_park_name TEXT NOT NULL,
    zone_name TEXT NOT NULL,
    safari_type TEXT NOT NULL CHECK (safari_type IN ('Jeep Safari', 'Canter Safari', 'Elephant Safari', 'Walking Safari')),
    vehicle_type TEXT NOT NULL,
    duration_hours NUMERIC(3, 1) NOT NULL DEFAULT 3.5,
    max_passengers_per_vehicle INT NOT NULL DEFAULT 6,
    price_per_person NUMERIC(10, 2) NOT NULL,
    permits_available INT NOT NULL DEFAULT 12,
    season_start DATE,
    season_end DATE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.70,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed_for_monsoon', 'sold_out')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Wildlife Safari Bookings
CREATE TABLE IF NOT EXISTS public.safari_bookings (
    booking_id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL REFERENCES public.safari_packages(package_id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    safari_date DATE NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('Morning', 'Evening', 'Full Day')),
    passenger_count INT NOT NULL DEFAULT 1,
    vehicle_allocated TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Cab Fleet Directory
CREATE TABLE IF NOT EXISTS public.cab (
    cab_id TEXT PRIMARY KEY,
    vehicle_number TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Hatchback', 'Sedan', 'SUV', 'EV Sedan', 'Luxury Coach')),
    current_city TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'maintenance', 'offline')),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    reviews_count INT NOT NULL DEFAULT 0,
    per_km_rate NUMERIC(6, 2) NOT NULL DEFAULT 14.00,
    base_price NUMERIC(6, 2) NOT NULL DEFAULT 250.00,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    driver_license_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Cab Trip Bookings
CREATE TABLE IF NOT EXISTS public.cab_bookings (
    booking_id TEXT PRIMARY KEY,
    cab_id TEXT NOT NULL REFERENCES public.cab(cab_id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    pickup_city TEXT NOT NULL,
    drop_city TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    drop_address TEXT NOT NULL,
    pickup_datetime TIMESTAMPTZ NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'driver_assigned', 'started', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
`);

// ============================================================================
// 5. 05_payment_finance_tables.sql
// ============================================================================
writeSql("05_payment_finance_tables.sql", `
-- ============================================================================
-- SCRIPT 05: PAYMENT TRANSACTIONS, ESCROW & FINANCIAL LEDGERS
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Tables: payment_transactions, split_transactions, settlements, wallet_transactions, customer_support_tickets, notifications
-- ============================================================================

-- 1. Gateway Payment Transactions
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    transaction_id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    razorpay_order_id TEXT NOT NULL,
    razorpay_payment_id TEXT,
    razorpay_signature TEXT,
    signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
    amount NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created' CHECK (status IN ('captured', 'created', 'authorized', 'failed', 'refunded', 'partially_refunded')),
    payment_method TEXT NOT NULL DEFAULT 'upi' CHECK (payment_method IN ('upi', 'card', 'netbanking', 'wallet', 'emi', 'split_route')),
    payment_method_detail TEXT,
    receipt_number TEXT NOT NULL,
    tax_invoice_number TEXT,
    nodal_escrow_status TEXT DEFAULT 'held' CHECK (nodal_escrow_status IN ('held', 'released', 'split_settled', 'refunded')),
    sub_merchant_splits JSONB DEFAULT '[]'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

-- 2. Multi-Merchant Split Route Escrow Allocations
CREATE TABLE IF NOT EXISTS public.split_transactions (
    split_id VARCHAR(64) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    payment_id TEXT NOT NULL,
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    vendor_account_id VARCHAR(64) NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    partner_net_share NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    platform_commission NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tds_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    settlement_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (settlement_status IN ('PENDING', 'SETTLED', 'ON_HOLD', 'REFUNDED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. RBI RTGS Partner Settlement Batches
CREATE TABLE IF NOT EXISTS public.settlements (
    settlement_id VARCHAR(64) PRIMARY KEY,
    operator_id UUID NOT NULL REFERENCES public.operator_profiles(id) ON DELETE CASCADE,
    batch_reference VARCHAR(64) NOT NULL,
    gross_amount NUMERIC(12, 2) NOT NULL,
    net_payout NUMERIC(12, 2) NOT NULL,
    tds_194o NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    gst_itc NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    utr_number VARCHAR(64),
    status TEXT NOT NULL DEFAULT 'PROCESSED' CHECK (status IN ('PENDING', 'PROCESSING', 'PROCESSED', 'FAILED')),
    disbursed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Prepaid Wallet & Rewards Passbook
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    transaction_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
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

-- 5. Real-Time Travel Notifications & Radar Alerts
CREATE TABLE IF NOT EXISTS public.notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (category IN ('PRICE_DROP', 'BOOKING_UPDATE', 'GATE_CHANGE', 'DELAY_ADVISORY', 'OFFER', 'SYSTEM')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    deep_link TEXT,
    severity TEXT NOT NULL DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'CRITICAL', 'SUCCESS')),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Customer Support Tickets & Dispute Resolution
CREATE TABLE IF NOT EXISTS public.customer_support_tickets (
    ticket_id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    booking_id TEXT REFERENCES public.bookings(booking_id) ON DELETE SET NULL,
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
`);

// ============================================================================
// 6. 06_foreign_keys_indexes.sql
// ============================================================================
writeSql("06_foreign_keys_indexes.sql", `
-- ============================================================================
-- SCRIPT 06: FOREIGN KEY CONSTRAINTS & HIGH-PERFORMANCE INDEXES
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- Add remaining cross-table FK on driver_shifts -> cab
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_driver_shifts_cab'
    ) THEN
        ALTER TABLE public.driver_shifts 
        ADD CONSTRAINT fk_driver_shifts_cab 
        FOREIGN KEY (cab_id) REFERENCES public.cab(cab_id) ON DELETE SET NULL;
    END IF;
END $$;

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_dates ON public.bookings(travel_start_date, travel_end_date);

CREATE INDEX IF NOT EXISTS idx_bookings_items_booking_id ON public.bookings_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_items_type ON public.bookings_items(item_type);
CREATE INDEX IF NOT EXISTS idx_bookings_items_pnr ON public.bookings_items(item_code_or_pnr);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking_id ON public.payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_digital_tickets_booking_id ON public.digital_tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_digital_tickets_pnr ON public.digital_tickets(pnr);
CREATE INDEX IF NOT EXISTS idx_digital_tickets_token ON public.digital_tickets(qr_token);

CREATE INDEX IF NOT EXISTS idx_operator_profiles_user_id ON public.operator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_co_passengers_user_id ON public.saved_co_passengers(user_id);

CREATE INDEX IF NOT EXISTS idx_crm_leads_customer_id ON public.crm_leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned ON public.crm_leads(assigned_to);

CREATE INDEX IF NOT EXISTS idx_customer_notes_lead_id ON public.customer_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_lead_id ON public.crm_follow_ups(lead_id);

CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner ON public.partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON public.customer_support_tickets(user_id, status);

CREATE INDEX IF NOT EXISTS idx_driver_shifts_driver ON public.driver_shifts(driver_id);
CREATE INDEX IF NOT EXISTS idx_regional_holidays_date ON public.regional_holidays(holiday_date);
CREATE INDEX IF NOT EXISTS idx_regional_holidays_state ON public.regional_holidays(state_code);

-- GIN Indexes for fast JSONB metadata querying
CREATE INDEX IF NOT EXISTS idx_bookings_metadata_gin ON public.bookings USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_bookings_items_details_gin ON public.bookings_items USING gin(details);
`);

// ============================================================================
// 7. 07_functions_triggers.sql
// ============================================================================
writeSql("07_functions_triggers.sql", `
-- ============================================================================
-- SCRIPT 07: PROCEDURAL FUNCTIONS, TRIGGERS & RPC ROUTINES
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- 1. Automated Timestamp Trigger Function
CREATE OR REPLACE FUNCTION public.trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to core tables
DROP TRIGGER IF EXISTS set_timestamp_users ON public.users;
CREATE TRIGGER set_timestamp_users
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_bookings ON public.bookings;
CREATE TRIGGER set_timestamp_bookings
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_crm_leads ON public.crm_leads;
CREATE TRIGGER set_timestamp_crm_leads
BEFORE UPDATE ON public.crm_leads
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

DROP TRIGGER IF EXISTS set_timestamp_support_tickets ON public.customer_support_tickets;
CREATE TRIGGER set_timestamp_support_tickets
BEFORE UPDATE ON public.customer_support_tickets
FOR EACH ROW EXECUTE FUNCTION public.trigger_set_updated_at();

-- 2. Customer Bookings 360 Summary RPC
CREATE OR REPLACE FUNCTION public.get_user_booking_summary(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_bookings', COUNT(*),
        'confirmed_bookings', COUNT(*) FILTER (WHERE status = 'confirmed'),
        'cancelled_bookings', COUNT(*) FILTER (WHERE status = 'cancelled'),
        'total_spent_inr', COALESCE(SUM(total_amount) FILTER (WHERE status = 'confirmed'), 0.00),
        'upcoming_journeys', COUNT(*) FILTER (WHERE travel_start_date > NOW() AND status = 'confirmed'),
        'latest_booking_date', MAX(booking_date)
    )
    INTO result
    FROM public.bookings
    WHERE customer_id = p_user_id;

    RETURN result;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- 3. Idempotent Wallet Balance Mutation RPC with ACID Assertion
CREATE OR REPLACE FUNCTION public.process_wallet_transaction(
    p_user_id TEXT,
    p_amount NUMERIC,
    p_type TEXT,
    p_booking_ref TEXT DEFAULT NULL,
    p_remarks TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_current_balance NUMERIC(12,2) := 0.00;
    v_new_balance NUMERIC(12,2) := 0.00;
    v_txn_id TEXT;
    v_coin_credits INT := 0;
BEGIN
    -- Compute existing balance from latest transaction record
    SELECT COALESCE(balance_after, 0.00)
    INTO v_current_balance
    FROM public.wallet_transactions
    WHERE user_id = p_user_id
    ORDER BY created_at DESC
    LIMIT 1;

    -- Assert sufficient funds for debits
    IF p_type = 'BOOKING_DEBIT' AND v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient wallet balance. Current: %, Required: %', v_current_balance, p_amount;
    END IF;

    IF p_type IN ('TOP_UP', 'REFUND_CREDIT', 'CASHBACK') THEN
        v_new_balance := v_current_balance + p_amount;
        IF p_type = 'TOP_UP' THEN
            v_coin_credits := FLOOR(p_amount * 0.05);
        END IF;
    ELSE
        v_new_balance := v_current_balance - p_amount;
    END IF;

    v_txn_id := 'TXN-WLT-' || FLOOR(100000 + RANDOM() * 900000)::TEXT;

    INSERT INTO public.wallet_transactions (
        transaction_id, user_id, amount, transaction_type, status,
        balance_before, balance_after, coin_credits, reference_booking_id, remarks
    ) VALUES (
        v_txn_id, p_user_id, p_amount, p_type, 'COMPLETED',
        v_current_balance, v_new_balance, v_coin_credits, p_booking_ref, p_remarks
    );

    RETURN jsonb_build_object(
        'success', TRUE,
        'transaction_id', v_txn_id,
        'previous_balance', v_current_balance,
        'new_balance', v_new_balance,
        'coin_credits', v_coin_credits
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`);

// ============================================================================
// 8. 08_views_reporting.sql
// ============================================================================
writeSql("08_views_reporting.sql", `
-- ============================================================================
-- SCRIPT 08: ANALYTICAL & TAX REPORTING VIEWS
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- 1. GSTR-1 Outward Supply Invoicing Ledger (Government Tax Audit View)
CREATE OR REPLACE VIEW public.v_gstr1_b2b_invoices AS
SELECT 
    b.booking_id,
    b.booking_date,
    b.customer_name,
    b.customer_gstin,
    CASE WHEN b.customer_gstin IS NOT NULL THEN 'B2B' ELSE 'B2C' END AS invoice_type,
    b.total_amount AS gross_invoice_value,
    b.tax_amount AS total_gst_collected,
    ROUND(b.tax_amount / 2, 2) AS cgst_amount,
    ROUND(b.tax_amount / 2, 2) AS sgst_amount,
    b.net_payable_amount,
    pt.transaction_id,
    pt.payment_method,
    pt.status AS payment_status
FROM public.bookings b
LEFT JOIN public.payment_transactions pt ON b.booking_id = pt.booking_id
WHERE b.status = 'confirmed';

-- 2. Partner Settlement & 194-O TDS Commission Ledger
CREATE OR REPLACE VIEW public.v_operator_settlement_ledger AS
SELECT 
    op.id AS operator_id,
    op.operator_name,
    op.vertical,
    op.pan_or_gst,
    op.commission_rate,
    COUNT(s.settlement_id) AS total_settlement_batches,
    COALESCE(SUM(s.gross_amount), 0.00) AS total_gross_settled,
    COALESCE(SUM(s.tds_194o), 0.00) AS total_tds_withheld,
    COALESCE(SUM(s.net_payout), 0.00) AS total_net_disbursed,
    op.escrow_balance AS current_escrow_held
FROM public.operator_profiles op
LEFT JOIN public.settlements s ON op.id = s.operator_id
GROUP BY op.id, op.operator_name, op.vertical, op.pan_or_gst, op.commission_rate, op.escrow_balance;

-- 3. Customer 360 Profile & Active Travel Pass View
CREATE OR REPLACE VIEW public.v_customer_active_passes AS
SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    u.phone,
    b.booking_id,
    b.travel_start_date,
    b.travel_end_date,
    dt.ticket_number,
    dt.pnr,
    dt.qr_token,
    dt.print_status
FROM public.users u
JOIN public.bookings b ON u.id = b.customer_id
JOIN public.digital_tickets dt ON b.booking_id = dt.booking_id
WHERE b.status = 'confirmed' AND b.travel_end_date >= NOW();
`);

// ============================================================================
// 9. 09_rls_policies.sql
// ============================================================================
writeSql("09_rls_policies.sql", `
-- ============================================================================
-- SCRIPT 09: ROW LEVEL SECURITY (RLS) POLICIES & TENANT ISOLATION
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_co_passengers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_shifts ENABLE ROW LEVEL SECURITY;

-- 1. users Table Policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
CREATE POLICY "Users can read own profile"
ON public.users FOR SELECT
USING (auth.uid()::text = id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile"
ON public.users FOR UPDATE
USING (auth.uid()::text = id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = id OR auth.role() = 'service_role');

-- 2. bookings Table Policies
DROP POLICY IF EXISTS "Customers read own bookings" ON public.bookings;
CREATE POLICY "Customers read own bookings"
ON public.bookings FOR SELECT
USING (auth.uid()::text = customer_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Customers insert own bookings" ON public.bookings;
CREATE POLICY "Customers insert own bookings"
ON public.bookings FOR INSERT
WITH CHECK (auth.uid()::text = customer_id OR auth.role() = 'service_role');

-- 3. bookings_items Table Policies
DROP POLICY IF EXISTS "Customers view own items" ON public.bookings_items;
CREATE POLICY "Customers view own items"
ON public.bookings_items FOR SELECT
USING (
    booking_id IN (SELECT booking_id FROM public.bookings WHERE customer_id = auth.uid()::text)
    OR auth.role() = 'service_role'
);

-- 4. digital_tickets Table Policies
DROP POLICY IF EXISTS "Customers view own passes" ON public.digital_tickets;
CREATE POLICY "Customers view own passes"
ON public.digital_tickets FOR SELECT
USING (
    booking_id IN (SELECT booking_id FROM public.bookings WHERE customer_id = auth.uid()::text)
    OR auth.role() = 'service_role'
);

-- 5. saved_co_passengers Table Policies
DROP POLICY IF EXISTS "Customers manage own co_passengers" ON public.saved_co_passengers;
CREATE POLICY "Customers manage own co_passengers"
ON public.saved_co_passengers FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 6. wallet_transactions Table Policies
DROP POLICY IF EXISTS "Customers view own wallet" ON public.wallet_transactions;
CREATE POLICY "Customers view own wallet"
ON public.wallet_transactions FOR SELECT
USING (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 7. notifications Table Policies
DROP POLICY IF EXISTS "Customers manage own notifications" ON public.notifications;
CREATE POLICY "Customers manage own notifications"
ON public.notifications FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 8. customer_support_tickets Table Policies
DROP POLICY IF EXISTS "Customers manage own tickets" ON public.customer_support_tickets;
CREATE POLICY "Customers manage own tickets"
ON public.customer_support_tickets FOR ALL
USING (auth.uid()::text = user_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = user_id OR auth.role() = 'service_role');

-- 9. driver_shifts Table Policies
DROP POLICY IF EXISTS "Drivers manage own shifts" ON public.driver_shifts;
CREATE POLICY "Drivers manage own shifts"
ON public.driver_shifts FOR ALL
USING (auth.uid()::text = driver_id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = driver_id OR auth.role() = 'service_role');
`);

// ============================================================================
// 10. 10_rbac_roles_permissions.sql
// ============================================================================
writeSql("10_rbac_roles_permissions.sql", `
-- ============================================================================
-- SCRIPT 10: ROLE-BASED ACCESS CONTROL (RBAC) GRANTS & PERMISSIONS
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Roles: anon, authenticated, service_role
-- ============================================================================

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Public Anonymous Read permissions (Catalog & Schedules)
GRANT SELECT ON public.regional_holidays TO anon, authenticated;
GRANT SELECT ON public.safari_packages TO anon, authenticated;
GRANT SELECT ON public.houseboats TO anon, authenticated;
GRANT SELECT ON public.cab TO anon, authenticated;

-- Authenticated User permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT, INSERT ON public.bookings_items TO authenticated;
GRANT SELECT, INSERT ON public.payment_transactions TO authenticated;
GRANT SELECT ON public.digital_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_co_passengers TO authenticated;
GRANT SELECT, INSERT ON public.wallet_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.customer_support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.driver_shifts TO authenticated;

-- Service Role Full Super-Admin permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO service_role;
`);

// ============================================================================
// 11. 11_master_seed_data.sql
// ============================================================================
writeSql("11_master_seed_data.sql", `
-- ============================================================================
-- SCRIPT 11: MASTER REFERENCE & PRODUCTION SEED DATA
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- Default System Settings
INSERT INTO public.system_settings (key, value)
VALUES 
    ('platform_convenience_fee_inr', '{"flights": 299, "trains": 25, "buses": 45, "hotels": 150, "cabs": 30}'::jsonb),
    ('gst_rates_percent', '{"economy_flights": 5, "business_flights": 12, "trains": 5, "buses": 5, "hotels_standard": 12, "hotels_luxury": 18}'::jsonb),
    ('section_194o_tds_rate_percent', '{"rate": 1.00, "description": "TDS on e-commerce operator participants"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Seed Default Admin User
INSERT INTO public.users (id, email, full_name, phone, role, kyc_status)
VALUES 
    ('usr_admin_01', 'admin@bharatyatra.com', 'BharatYatra Super Admin', '+91 99999 88888', 'super_admin', 'verified'),
    ('usr_customer_01', 'rahul.verma@example.com', 'Rahul Verma', '+91 98765 12345', 'customer', 'verified')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample API Providers in Mesh
INSERT INTO public.api_providers (provider_id, name, auth_type, environment, status, api_key)
VALUES 
    ('amadeus_crs', 'Amadeus NDC Flight CRS', 'OAUTH2', 'production', 'active', 'enc_prod_amd_99182'),
    ('cris_irctc', 'CRIS IRCTC Passenger Reservation System', 'MUTUAL_TLS', 'production', 'active', 'enc_prod_cris_77192'),
    ('zingbus_gds', 'Zingbus Fleet Telematics GDS', 'API_KEY', 'production', 'active', 'enc_prod_zb_44120'),
    ('cleartrip_crs', 'Cleartrip Hotel Inventory CRS', 'BASIC_AUTH', 'production', 'active', 'enc_prod_clt_33190'),
    ('razorpay_route', 'Razorpay Nodal Route Escrow', 'HMAC_KEY', 'production', 'active', 'enc_prod_rzp_99011')
ON CONFLICT (provider_id) DO NOTHING;

-- Seed Sample Notification
INSERT INTO public.notifications (user_id, category, title, message, severity, is_read)
VALUES 
    ('usr_customer_01', 'PRICE_DROP', '⚡ Price Drop: New Delhi to Goa', 'IndiGo 6E-205 fare dropped by 18% for next Friday departure.', 'SUCCESS', FALSE)
ON CONFLICT DO NOTHING;
`);

// ============================================================================
// 12. 12_database_validation.sql
// ============================================================================
writeSql("12_database_validation.sql", `
-- ============================================================================
-- SCRIPT 12: DATABASE VALIDATION, HEALTH CHECK & ASSERTION SUITE
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

DO $$
DECLARE
    v_missing_tables TEXT[] := ARRAY[]::TEXT[];
    v_missing_rls TEXT[] := ARRAY[]::TEXT[];
    v_tbl TEXT;
    v_required_tables TEXT[] := ARRAY[
        'users', 'system_settings', 'regional_holidays', 'api_providers', 'api_endpoints', 'api_logs',
        'operator_profiles', 'saved_co_passengers', 'partner_subscriptions', 'crm_leads', 'customer_notes', 'crm_follow_ups', 'driver_shifts',
        'bookings', 'bookings_items', 'digital_tickets', 'houseboats', 'houseboat_bookings', 'safari_packages', 'safari_bookings', 'cab', 'cab_bookings',
        'payment_transactions', 'split_transactions', 'settlements', 'wallet_transactions', 'notifications', 'customer_support_tickets'
    ];
BEGIN
    -- 1. Check Table Existence
    FOREACH v_tbl IN ARRAY v_required_tables LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = v_tbl) THEN
            v_missing_tables := array_append(v_missing_tables, v_tbl);
        END IF;
    END LOOP;

    IF array_length(v_missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'DATABASE VALIDATION FAILED: Missing tables -> %', array_to_string(v_missing_tables, ', ');
    END IF;

    -- 2. Check Row Level Security Enabled
    FOREACH v_tbl IN ARRAY v_required_tables LOOP
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE schemaname = 'public' AND tablename = v_tbl AND rowsecurity = TRUE
        ) THEN
            -- System settings and regional holidays may be public reference; verify core user tables
            IF v_tbl IN ('users', 'bookings', 'bookings_items', 'payment_transactions', 'digital_tickets', 'saved_co_passengers', 'wallet_transactions', 'notifications', 'customer_support_tickets') THEN
                v_missing_rls := array_append(v_missing_rls, v_tbl);
            END IF;
        END IF;
    END LOOP;

    IF array_length(v_missing_rls, 1) > 0 THEN
        RAISE EXCEPTION 'DATABASE VALIDATION FAILED: Tables with RLS disabled -> %', array_to_string(v_missing_rls, ', ');
    END IF;

    -- 3. Check Views
    ASSERT (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'v_gstr1_b2b_invoices') = 1, 'View v_gstr1_b2b_invoices missing';
    ASSERT (SELECT COUNT(*) FROM information_schema.views WHERE table_schema = 'public' AND table_name = 'v_operator_settlement_ledger') = 1, 'View v_operator_settlement_ledger missing';

    -- 4. Check Functions
    ASSERT (SELECT COUNT(*) FROM pg_proc WHERE proname = 'get_user_booking_summary') = 1, 'Function get_user_booking_summary missing';
    ASSERT (SELECT COUNT(*) FROM pg_proc WHERE proname = 'process_wallet_transaction') = 1, 'Function process_wallet_transaction missing';

    RAISE NOTICE '====================================================================';
    RAISE NOTICE '>>> BHARATYATRA DATABASE VALIDATION PASSED SUCCESSFULLY! <<<';
    RAISE NOTICE 'All 28 tables verified, RLS enforced, views active, and RPCs online.';
    RAISE NOTICE '====================================================================';
END $$;
`);

// ============================================================================
// Consolidated Runner & Rollback Scripts
// ============================================================================
writeSql("run_all_migrations.sql", `
-- ============================================================================
-- BHARATYATRA COMPLETE DATABASE INITIALIZATION RUNNER
-- Executes all 12 SQL scripts in exact topological dependency order.
-- ============================================================================

\\ir 01_schema_extensions.sql
\\ir 02_root_tables.sql
\\ir 03_customer_partner_tables.sql
\\ir 04_booking_inventory_tables.sql
\\ir 05_payment_finance_tables.sql
\\ir 06_foreign_keys_indexes.sql
\\ir 07_functions_triggers.sql
\\ir 08_views_reporting.sql
\\ir 09_rls_policies.sql
\\ir 10_rbac_roles_permissions.sql
\\ir 11_master_seed_data.sql
\\ir 12_database_validation.sql
`);

writeSql("rollback_plan.sql", `
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
`);

console.log("\n>>> ALL 12 MODULAR SQL SCRIPTS + RUNNER & ROLLBACK GENERATED SUCCESSFULLY IN supabase/schema/ AND public/sql/ <<<");
