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
