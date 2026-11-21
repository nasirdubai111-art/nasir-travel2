-- ============================================================================
-- SCRIPT 06: FOREIGN KEY CONSTRAINTS & HIGH-PERFORMANCE INDEXES
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- Add remaining cross-table FK on driver_shifts -> cab
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_driver_shifts_cab'
    ) THEN
        ALTER TABLE public.driver_shifts 
        ADD CONSTRAINT fk_driver_shifts_cab 
        FOREIGN KEY (cab_id) REFERENCES public.cab(cab_id) ON DELETE SET NULL;
    END IF;
END $$;

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_travel_dates ON public.bookings(travel_start_date, travel_end_date);

CREATE INDEX IF NOT EXISTS idx_bookings_items_booking_id ON public.bookings_items(booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_items_type ON public.bookings_items(item_type);
CREATE INDEX IF NOT EXISTS idx_bookings_items_pnr ON public.bookings_items(item_code_or_pnr);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_booking_id ON public.payment_transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON public.payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(razorpay_order_id);

CREATE INDEX IF NOT EXISTS idx_digital_tickets_booking_id ON public.digital_tickets(booking_id);
CREATE INDEX IF NOT EXISTS idx_digital_tickets_pnr ON public.digital_tickets(pnr);
CREATE INDEX IF NOT EXISTS idx_digital_tickets_token ON public.digital_tickets(qr_token);

CREATE INDEX IF NOT EXISTS idx_operator_profiles_user_id ON public.operator_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_co_passengers_user_id ON public.saved_co_passengers(user_id);

CREATE INDEX IF NOT EXISTS idx_crm_leads_customer_id ON public.crm_leads(customer_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_status ON public.crm_leads(status);
CREATE INDEX IF NOT EXISTS idx_crm_leads_assigned ON public.crm_leads(assigned_to);

CREATE INDEX IF NOT EXISTS idx_customer_notes_lead_id ON public.customer_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_crm_follow_ups_lead_id ON public.crm_follow_ups(lead_id);

CREATE INDEX IF NOT EXISTS idx_partner_subscriptions_partner ON public.partner_subscriptions(partner_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_user ON public.wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_status ON public.customer_support_tickets(user_id, status);

CREATE INDEX IF NOT EXISTS idx_driver_shifts_driver ON public.driver_shifts(driver_id);
CREATE INDEX IF NOT EXISTS idx_regional_holidays_date ON public.regional_holidays(holiday_date);
CREATE INDEX IF NOT EXISTS idx_regional_holidays_state ON public.regional_holidays(state_code);

-- GIN Indexes for fast JSONB metadata querying
CREATE INDEX IF NOT EXISTS idx_bookings_metadata_gin ON public.bookings USING gin(metadata);
CREATE INDEX IF NOT EXISTS idx_bookings_items_details_gin ON public.bookings_items USING gin(details);
