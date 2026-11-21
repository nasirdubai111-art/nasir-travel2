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
