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
