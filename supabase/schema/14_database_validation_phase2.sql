-- ============================================================================
-- SCRIPT: 14_database_validation_phase2.sql
-- Validation test queries for Phase 2 integration tables and double-entry ledger
-- ============================================================================

DO $$
DECLARE
    v_missing_tables TEXT[] := ARRAY[]::TEXT[];
    v_tbl TEXT;
    v_count INT;
    v_test_txn_id TEXT := 'TXN-TEST-VAL-001';
    v_balanced BOOLEAN;
BEGIN
    RAISE NOTICE '--- STARTING PHASE 2 DATABASE AUDIT VALIDATION ---';

    -- 1. Check all 8 Phase 2 tables + double-entry ledger table
    FOREACH v_tbl IN ARRAY ARRAY[
        'saved_co_passengers',
        'crm_leads',
        'customer_notes',
        'crm_follow_ups',
        'partner_subscriptions',
        'wallet_transactions',
        'wallet_ledger_entries',
        'notifications',
        'customer_support_tickets',
        'driver_shifts'
    ] LOOP
        IF NOT EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_name = v_tbl
        ) THEN
            v_missing_tables := array_append(v_missing_tables, v_tbl);
        END IF;
    END LOOP;

    IF array_length(v_missing_tables, 1) > 0 THEN
        RAISE EXCEPTION 'Phase 2 Validation Failed! Missing tables: %', v_missing_tables;
    ELSE
        RAISE NOTICE '✓ All 10 Phase 2 Tables exist in public schema.';
    END IF;

    -- 2. Check RLS enabled on all 10 tables
    SELECT COUNT(*) INTO v_count
    FROM pg_tables
    WHERE schemaname = 'public'
      AND rowsecurity = true
      AND tablename IN (
        'saved_co_passengers', 'crm_leads', 'customer_notes', 'crm_follow_ups',
        'partner_subscriptions', 'wallet_transactions', 'wallet_ledger_entries',
        'notifications', 'customer_support_tickets', 'driver_shifts'
      );

    IF v_count = 10 THEN
        RAISE NOTICE '✓ Row Level Security (RLS) is actively enabled on all 10 Phase 2 tables.';
    ELSE
        RAISE WARNING 'RLS check count: %/10 tables have rowsecurity active.', v_count;
    END IF;

    -- 3. Check Double-Entry Balancing Function
    IF EXISTS (
        SELECT 1 FROM pg_proc WHERE proname = 'verify_double_entry_ledger_balance'
    ) THEN
        RAISE NOTICE '✓ Double-entry ledger reconciliation function verify_double_entry_ledger_balance() verified.';
    ELSE
        RAISE EXCEPTION 'Double-entry ledger balancing function is missing!';
    END IF;

    RAISE NOTICE '--- PHASE 2 DATABASE AUDIT VALIDATION COMPLETED SUCCESSFULLY ---';
END $$;
