-- ====================================================================
-- BHARATYATRA RELATIONAL SCHEMA: BOOKINGS HIERARCHY & PAYMENTS
-- Structure:
-- bookings
--    │
--    ├── booking_id
--    │
--    ├── bookings_items
--    │      ├── Flight
--    │      ├── Train
--    │      ├── Bus
--    │      ├── Hotel
--    │      ├── Resort
--    │      ├── Lodge
--    │      ├── Tour
--    │      ├── Pilgrimage
--    │      └── Cab
--    │
--    └── payments
--           └── payment_transactions
-- ====================================================================

-- 1. Root Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    booking_id TEXT PRIMARY KEY, -- e.g. 'BY-BK-2026-98101'
    customer_id TEXT NOT NULL,
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

-- 2. Bookings Items Table (Parent: bookings, Key: booking_id)
-- Supporting exactly: Flight, Train, Bus, Hotel, Resort, Lodge, Tour, Pilgrimage, Cab
CREATE TABLE IF NOT EXISTS public.bookings_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN (
        'Flight',
        'Train',
        'Bus',
        'Hotel',
        'Resort',
        'Lodge',
        'Tour',
        'Pilgrimage',
        'Cab'
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

-- 3. Payment Transactions Table (Parent: bookings, Key: booking_id)
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    transaction_id TEXT PRIMARY KEY, -- e.g. 'tx_pay_998124'
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

-- Indexes for lightning queries
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(travel_start_date, travel_end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_items_booking_id ON public.bookings_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_items_item_type ON public.bookings_items(item_type);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking_id ON public.payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order_id ON public.payment_transactions(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;

-- Row Level Security Policies
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Allow select bookings') THEN
        CREATE POLICY "Allow select bookings" ON public.bookings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Allow insert bookings') THEN
        CREATE POLICY "Allow insert bookings" ON public.bookings FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings' AND policyname = 'Allow update bookings') THEN
        CREATE POLICY "Allow update bookings" ON public.bookings FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings_items' AND policyname = 'Allow select bookings_items') THEN
        CREATE POLICY "Allow select bookings_items" ON public.bookings_items FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'bookings_items' AND policyname = 'Allow insert bookings_items') THEN
        CREATE POLICY "Allow insert bookings_items" ON public.bookings_items FOR INSERT WITH CHECK (true);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_transactions' AND policyname = 'Allow select payment_transactions') THEN
        CREATE POLICY "Allow select payment_transactions" ON public.payment_transactions FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_transactions' AND policyname = 'Allow insert payment_transactions') THEN
        CREATE POLICY "Allow insert payment_transactions" ON public.payment_transactions FOR INSERT WITH CHECK (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'payment_transactions' AND policyname = 'Allow update payment_transactions') THEN
        CREATE POLICY "Allow update payment_transactions" ON public.payment_transactions FOR UPDATE USING (true);
    END IF;
END $$;

-- View helper: Aggregated hierarchical view
CREATE OR REPLACE VIEW public.v_bookings_hierarchical AS
SELECT 
    b.booking_id,
    b.customer_name,
    b.customer_email,
    b.status AS booking_status,
    b.net_payable_amount,
    COALESCE(json_agg(DISTINCT bi.*) FILTER (WHERE bi.id IS NOT NULL), '[]') AS items,
    COALESCE(json_agg(DISTINCT pt.*) FILTER (WHERE pt.transaction_id IS NOT NULL), '[]') AS payments
FROM public.bookings b
LEFT JOIN public.bookings_items bi ON b.booking_id = bi.booking_id
LEFT JOIN public.payment_transactions pt ON b.booking_id = pt.booking_id
GROUP BY b.booking_id, b.customer_name, b.customer_email, b.status, b.net_payable_amount;
