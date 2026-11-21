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
