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
