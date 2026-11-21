-- ============================================================================
-- SCRIPT 11: MASTER REFERENCE & PRODUCTION SEED DATA
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- Default System Settings
INSERT INTO public.system_settings (key, value)
VALUES 
    ('platform_convenience_fee_inr', '{"flights": 299, "trains": 25, "buses": 45, "hotels": 150, "cabs": 30}'::jsonb),
    ('gst_rates_percent', '{"economy_flights": 5, "business_flights": 12, "trains": 5, "buses": 5, "hotels_standard": 12, "hotels_luxury": 18}'::jsonb),
    ('section_194o_tds_rate_percent', '{"rate": 1.00, "description": "TDS on e-commerce operator participants"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW();

-- Seed Default Admin User
INSERT INTO public.users (id, email, full_name, phone, role, kyc_status)
VALUES 
    ('usr_admin_01', 'admin@bharatyatra.com', 'BharatYatra Super Admin', '+91 99999 88888', 'super_admin', 'verified'),
    ('usr_customer_01', 'rahul.verma@example.com', 'Rahul Verma', '+91 98765 12345', 'customer', 'verified')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample API Providers in Mesh
INSERT INTO public.api_providers (provider_id, name, auth_type, environment, status, api_key)
VALUES 
    ('amadeus_crs', 'Amadeus NDC Flight CRS', 'OAUTH2', 'production', 'active', 'enc_prod_amd_99182'),
    ('cris_irctc', 'CRIS IRCTC Passenger Reservation System', 'MUTUAL_TLS', 'production', 'active', 'enc_prod_cris_77192'),
    ('zingbus_gds', 'Zingbus Fleet Telematics GDS', 'API_KEY', 'production', 'active', 'enc_prod_zb_44120'),
    ('cleartrip_crs', 'Cleartrip Hotel Inventory CRS', 'BASIC_AUTH', 'production', 'active', 'enc_prod_clt_33190'),
    ('razorpay_route', 'Razorpay Nodal Route Escrow', 'HMAC_KEY', 'production', 'active', 'enc_prod_rzp_99011')
ON CONFLICT (provider_id) DO NOTHING;

-- Seed Sample Notification
INSERT INTO public.notifications (user_id, category, title, message, severity, is_read)
VALUES 
    ('usr_customer_01', 'PRICE_DROP', '⚡ Price Drop: New Delhi to Goa', 'IndiGo 6E-205 fare dropped by 18% for next Friday departure.', 'SUCCESS', FALSE)
ON CONFLICT DO NOTHING;
