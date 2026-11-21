-- ============================================================================
-- SCRIPT 08: ANALYTICAL & TAX REPORTING VIEWS
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- ============================================================================

-- 1. GSTR-1 Outward Supply Invoicing Ledger (Government Tax Audit View)
CREATE OR REPLACE VIEW public.v_gstr1_b2b_invoices AS
SELECT 
    b.booking_id,
    b.booking_date,
    b.customer_name,
    b.customer_gstin,
    CASE WHEN b.customer_gstin IS NOT NULL THEN 'B2B' ELSE 'B2C' END AS invoice_type,
    b.total_amount AS gross_invoice_value,
    b.tax_amount AS total_gst_collected,
    ROUND(b.tax_amount / 2, 2) AS cgst_amount,
    ROUND(b.tax_amount / 2, 2) AS sgst_amount,
    b.net_payable_amount,
    pt.transaction_id,
    pt.payment_method,
    pt.status AS payment_status
FROM public.bookings b
LEFT JOIN public.payment_transactions pt ON b.booking_id = pt.booking_id
WHERE b.status = 'confirmed';

-- 2. Partner Settlement & 194-O TDS Commission Ledger
CREATE OR REPLACE VIEW public.v_operator_settlement_ledger AS
SELECT 
    op.id AS operator_id,
    op.operator_name,
    op.vertical,
    op.pan_or_gst,
    op.commission_rate,
    COUNT(s.settlement_id) AS total_settlement_batches,
    COALESCE(SUM(s.gross_amount), 0.00) AS total_gross_settled,
    COALESCE(SUM(s.tds_194o), 0.00) AS total_tds_withheld,
    COALESCE(SUM(s.net_payout), 0.00) AS total_net_disbursed,
    op.escrow_balance AS current_escrow_held
FROM public.operator_profiles op
LEFT JOIN public.settlements s ON op.id = s.operator_id
GROUP BY op.id, op.operator_name, op.vertical, op.pan_or_gst, op.commission_rate, op.escrow_balance;

-- 3. Customer 360 Profile & Active Travel Pass View
CREATE OR REPLACE VIEW public.v_customer_active_passes AS
SELECT 
    u.id AS user_id,
    u.full_name,
    u.email,
    u.phone,
    b.booking_id,
    b.travel_start_date,
    b.travel_end_date,
    dt.ticket_number,
    dt.pnr,
    dt.qr_token,
    dt.print_status
FROM public.users u
JOIN public.bookings b ON u.id = b.customer_id
JOIN public.digital_tickets dt ON b.booking_id = dt.booking_id
WHERE b.status = 'confirmed' AND b.travel_end_date >= NOW();
