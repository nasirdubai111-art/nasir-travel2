-- ============================================================================
-- SCRIPT 10: ROLE-BASED ACCESS CONTROL (RBAC) GRANTS & PERMISSIONS
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Roles: anon, authenticated, service_role
-- ============================================================================

-- Grant schema usage
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Public Anonymous Read permissions (Catalog & Schedules)
GRANT SELECT ON public.regional_holidays TO anon, authenticated;
GRANT SELECT ON public.safari_packages TO anon, authenticated;
GRANT SELECT ON public.houseboats TO anon, authenticated;
GRANT SELECT ON public.cab TO anon, authenticated;

-- Authenticated User permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bookings TO authenticated;
GRANT SELECT, INSERT ON public.bookings_items TO authenticated;
GRANT SELECT, INSERT ON public.payment_transactions TO authenticated;
GRANT SELECT ON public.digital_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.saved_co_passengers TO authenticated;
GRANT SELECT, INSERT ON public.wallet_transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.customer_support_tickets TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.driver_shifts TO authenticated;

-- Service Role Full Super-Admin permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO service_role;
