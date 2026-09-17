-- ==============================================================================
-- BHARAT YATRA: RAZORPAY PAYMENT TRANSACTIONS & RECEIPT VAULT SCHEMA
-- Designed for Supabase PostgreSQL Database with Row Level Security (RLS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.razorpay_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL UNIQUE,
    payment_id TEXT UNIQUE,
    signature TEXT,
    signature_verified BOOLEAN DEFAULT FALSE,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'created', -- 'created', 'authorized', 'captured', 'failed', 'refunded'
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    booking_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    method VARCHAR(50) DEFAULT 'upi',
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    error_reason TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    verified_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_razorpay_order_id ON public.razorpay_transactions (order_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_payment_id ON public.razorpay_transactions (payment_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_booking_id ON public.razorpay_transactions (booking_id);
CREATE INDEX IF NOT EXISTS idx_razorpay_customer_email ON public.razorpay_transactions (customer_email);
CREATE INDEX IF NOT EXISTS idx_razorpay_status ON public.razorpay_transactions (status);
CREATE INDEX IF NOT EXISTS idx_razorpay_created_at ON public.razorpay_transactions (created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.razorpay_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- 1. Anyone authenticated can view their own transaction history
CREATE POLICY "Allow users to read their own payment records"
    ON public.razorpay_transactions
    FOR SELECT
    USING (
        auth.role() = 'authenticated' AND 
        (customer_email = auth.jwt() ->> 'email')
    );

-- 2. Service role / Edge Functions can read and write all transactions
CREATE POLICY "Allow service role full access to razorpay_transactions"
    ON public.razorpay_transactions
    FOR ALL
    USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Real-time Publication for Live Frontend Status Updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.razorpay_transactions;

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_razorpay_tx_modtime()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_razorpay_tx_timestamp ON public.razorpay_transactions;
CREATE TRIGGER trigger_update_razorpay_tx_timestamp
    BEFORE UPDATE ON public.razorpay_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_razorpay_tx_modtime();

COMMENT ON TABLE public.razorpay_transactions IS 'Vault storing Razorpay payment orders, verified HMAC signatures, and customer tax receipts written by Supabase Edge Functions';
