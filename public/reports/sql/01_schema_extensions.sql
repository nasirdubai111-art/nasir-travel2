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
