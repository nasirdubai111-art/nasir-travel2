-- ============================================================================
-- SCRIPT 13: CUSTOMER REGISTRATION & SUPABASE AUTHENTICATION INTEGRATION
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Connects Supabase auth.users with public.users customer profile table.
-- ============================================================================

-- 1. Extend public.users with all required customer profile fields without duplicating tables
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS customer_id TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS mobile_number TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS country_code TEXT DEFAULT '+91';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'ACTIVE';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email_verification_token TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_reset_token TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_reset_expires_at TIMESTAMPTZ;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 2. Customer ID auto-generation sequence & trigger
CREATE SEQUENCE IF NOT EXISTS customer_id_seq START WITH 1001;

CREATE OR REPLACE FUNCTION public.generate_customer_id()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_id IS NULL OR NEW.customer_id = '' THEN
        NEW.customer_id := 'BY-CUST-' || LPAD(nextval('customer_id_seq')::TEXT, 6, '0');
    END IF;
    IF NEW.mobile_number IS NULL AND NEW.phone IS NOT NULL THEN
        NEW.mobile_number := NEW.phone;
    END IF;
    IF NEW.phone IS NULL AND NEW.mobile_number IS NOT NULL THEN
        NEW.phone := NEW.mobile_number;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_generate_customer_id ON public.users;
CREATE TRIGGER trg_generate_customer_id
BEFORE INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.generate_customer_id();

-- 3. Supabase Auth Automatic Sync Trigger (auth.users -> public.users)
-- When a user registers via Supabase Auth (email/password), this function synchronizes them to public.users
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
DECLARE
    v_full_name TEXT;
    v_phone TEXT;
    v_country_code TEXT;
    v_customer_id TEXT;
BEGIN
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'BharatYatra Traveler');
    v_phone := COALESCE(NEW.raw_user_meta_data->>'phone', NEW.raw_user_meta_data->>'mobile_number', NEW.phone, '');
    v_country_code := COALESCE(NEW.raw_user_meta_data->>'country_code', '+91');
    v_customer_id := 'BY-CUST-' || LPAD(nextval('customer_id_seq')::TEXT, 6, '0');

    INSERT INTO public.users (
        id,
        customer_id,
        email,
        full_name,
        phone,
        mobile_number,
        country_code,
        role,
        account_status,
        email_verified,
        kyc_status,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id::TEXT,
        v_customer_id,
        NEW.email,
        v_full_name,
        v_phone,
        v_phone,
        v_country_code,
        COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
        'ACTIVE',
        COALESCE(NEW.email_confirmed_at IS NOT NULL, FALSE),
        'pending',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.users.full_name),
        phone = COALESCE(EXCLUDED.phone, public.users.phone),
        mobile_number = COALESCE(EXCLUDED.mobile_number, public.users.mobile_number),
        email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, public.users.email_verified),
        updated_at = NOW();

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach trigger to auth.users if auth schema is present
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT OR UPDATE OF email_confirmed_at ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.handle_new_auth_user();
    END IF;
END $$;

-- 4. RLS Policies for Customer Security & Self-Service
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Customers can read own profile" ON public.users;
CREATE POLICY "Customers can read own profile"
ON public.users FOR SELECT
USING (auth.uid()::text = id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Customers can update own profile" ON public.users;
CREATE POLICY "Customers can update own profile"
ON public.users FOR UPDATE
USING (auth.uid()::text = id OR auth.role() = 'service_role')
WITH CHECK (auth.uid()::text = id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public registration insert" ON public.users;
CREATE POLICY "Public registration insert"
ON public.users FOR INSERT
WITH CHECK (auth.uid()::text = id OR auth.role() = 'service_role' OR auth.role() = 'anon');
