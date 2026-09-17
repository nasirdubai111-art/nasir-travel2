-- ====================================================================
-- BHARATYATRA RELATIONAL SCHEMA: HOUSEBOATS, WILDLIFE SAFARI, & CAB
--
-- 1. HOUSEBOATS HIERARCHY & FUNNEL
--    houseboats
--         │
--         │ houseboat_id
--         ▼
--    houseboat_bookings
--         │
--         ├── customer_id
--         ├── partner_id
--         └── payment_id
--
--    Customer Funnel:
--    Customer -> Houseboat Search -> Houseboat Details -> Select Dates
--    -> Guest Details -> Booking -> Payment -> Confirmed Booking -> Houseboat Ticket / Invoice
--
-- 2. WILDLIFE SAFARI HIERARCHY
--    WILDLIFE SAFARI
--    │
--    ├── safari_packages
--    │      ├── Package
--    │      ├── National Park
--    │      ├── Zone
--    │      ├── Safari Type
--    │      ├── Vehicle
--    │      ├── Date/Season
--    │      ├── Pricing
--    │      └── Availability
--    │
--    └── safari_bookings
--           ├── Customer
--           ├── Safari Package
--           ├── Safari Date
--           ├── Passenger Count
--           ├── Vehicle
--           ├── Payment
--           ├── Booking Status
--           └── Ticket / QR Code
--
-- 3. CAB HIERARCHY (1 to Many)
--    cab
--     │
--     │ 1
--     │
--     │ many
--     ▼
--    cab_bookings
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. HOUSEBOATS & HOUSEBOAT BOOKINGS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.houseboats (
    houseboat_id TEXT PRIMARY KEY, -- e.g. 'HB-KL-ALPY-01'
    partner_id TEXT NOT NULL, -- Operator / Fleet Partner
    partner_name TEXT NOT NULL,
    name TEXT NOT NULL,
    vessel_registration_number TEXT NOT NULL UNIQUE,
    waterbody TEXT NOT NULL, -- 'Vembanad Lake', 'Dal Lake', etc.
    destination TEXT NOT NULL, -- 'Alleppey', 'Kumarakom', 'Srinagar', 'Goa'
    state TEXT NOT NULL,
    total_bedrooms INT NOT NULL DEFAULT 1 CHECK (total_bedrooms >= 1),
    max_guests INT NOT NULL DEFAULT 2 CHECK (max_guests >= 1),
    crew_count INT NOT NULL DEFAULT 3,
    captain_name TEXT,
    chef_name TEXT,
    contact_phone TEXT,
    starting_price_per_night NUMERIC(10, 2) NOT NULL,
    tax_rate_percent NUMERIC(4, 2) NOT NULL DEFAULT 5.00,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    reviews_count INT NOT NULL DEFAULT 0,
    image TEXT,
    gallery JSONB DEFAULT '[]'::jsonb,
    features JSONB DEFAULT '[]'::jsonb,
    dining_specialties JSONB DEFAULT '[]'::jsonb,
    cabins JSONB DEFAULT '[]'::jsonb,
    safety_certificates JSONB DEFAULT '[]'::jsonb,
    available_dates JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'docked', 'maintenance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.houseboat_bookings (
    booking_id TEXT PRIMARY KEY, -- e.g. 'HB-BK-2026-7819'
    houseboat_id TEXT NOT NULL REFERENCES public.houseboats(houseboat_id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL, -- Foreign key to customer
    partner_id TEXT NOT NULL, -- Foreign key to fleet partner
    payment_id TEXT NOT NULL, -- Foreign key to payment transaction
    
    -- Customer info
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT,
    
    -- Dates & times
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    check_in_time TEXT NOT NULL DEFAULT '12:00 PM',
    check_out_time TEXT NOT NULL DEFAULT '09:30 AM',
    total_nights INT NOT NULL DEFAULT 1 CHECK (total_nights >= 1),
    
    -- Guests & Manifest
    adults_count INT NOT NULL DEFAULT 1 CHECK (adults_count >= 1),
    children_count INT NOT NULL DEFAULT 0 CHECK (children_count >= 0),
    guest_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Booking Details
    selected_cabin_id TEXT,
    selected_cabin_name TEXT,
    charter_type TEXT NOT NULL DEFAULT 'Exclusive Private Charter',
    meal_plan TEXT NOT NULL DEFAULT 'Authentic Kerala Sadhya & Karimeen Fry',
    special_requests TEXT,
    
    -- Financials
    base_fare NUMERIC(10, 2) NOT NULL,
    meals_fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    addons_fare NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount_gst NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    net_payable_amount NUMERIC(10, 2) NOT NULL,
    
    -- Payment detail snapshot
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    payment_status TEXT NOT NULL DEFAULT 'captured' CHECK (payment_status IN ('captured', 'authorized', 'pending', 'refunded')),
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ticket & Invoice
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'boarding_ready', 'cruise_ongoing', 'completed', 'cancelled')),
    ticket_number TEXT NOT NULL UNIQUE,
    tax_invoice_number TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    dock_location TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. WILDLIFE SAFARI: SAFARI PACKAGES & SAFARI BOOKINGS
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.safari_packages (
    package_id TEXT PRIMARY KEY, -- e.g. 'SF-PKG-CBT-DHK-01'
    package_name TEXT NOT NULL,
    national_park TEXT NOT NULL, -- Jim Corbett, Ranthambore, Kaziranga, Bandhavgarh, etc.
    zone TEXT NOT NULL, -- Dhikala, Bijrani, Tala, Zone 3, etc.
    safari_type TEXT NOT NULL CHECK (safari_type IN ('Jeep Safari', 'Canter Safari', 'River Boat Safari', 'Walking Trail with Naturalist')),
    vehicle TEXT NOT NULL, -- '4x4 Maruti Gypsy (Open Top 6-Seater)', 'Forest Dept Eco-Canter', etc.
    season_name TEXT NOT NULL DEFAULT 'Winter Peak Season',
    months_active TEXT NOT NULL,
    slots_per_day INT NOT NULL DEFAULT 30,
    recommended_slot TEXT NOT NULL DEFAULT 'Morning Shift (06:00 AM - 09:30 AM)',
    base_vehicle_hire_price NUMERIC(10, 2) NOT NULL,
    forest_permit_fee_indian NUMERIC(10, 2) NOT NULL,
    forest_permit_fee_foreigner NUMERIC(10, 2) NOT NULL,
    naturalist_guide_fee NUMERIC(10, 2) NOT NULL,
    gst_percent NUMERIC(4, 2) NOT NULL DEFAULT 5.00,
    total_estimated_price NUMERIC(10, 2) NOT NULL,
    total_permits_allocated INT NOT NULL DEFAULT 30,
    remaining_permits_today INT NOT NULL DEFAULT 10,
    quota_status TEXT NOT NULL DEFAULT 'Available' CHECK (quota_status IN ('Available', 'Filling Fast', 'Waiting List', 'Sold Out')),
    highlights JSONB DEFAULT '[]'::jsonb,
    key_fauna JSONB DEFAULT '[]'::jsonb,
    entry_gate TEXT NOT NULL,
    image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.safari_bookings (
    booking_id TEXT PRIMARY KEY, -- e.g. 'SF-BK-2026-9041'
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_city TEXT,
    safari_package_id TEXT NOT NULL REFERENCES public.safari_packages(package_id) ON DELETE RESTRICT,
    safari_package_name TEXT NOT NULL,
    national_park TEXT NOT NULL,
    zone TEXT NOT NULL,
    safari_date DATE NOT NULL,
    shift TEXT NOT NULL, -- Morning / Afternoon
    adults_count INT NOT NULL DEFAULT 1 CHECK (adults_count >= 1),
    children_count INT NOT NULL DEFAULT 0 CHECK (children_count >= 0),
    total_passengers INT NOT NULL DEFAULT 1,
    passengers_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
    vehicle_type TEXT NOT NULL,
    assigned_vehicle_number TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    driver_phone TEXT,
    authorized_naturalist_name TEXT NOT NULL,
    naturalist_badge_id TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    amount_paid NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    payment_status TEXT NOT NULL DEFAULT 'captured',
    paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    booking_status TEXT NOT NULL DEFAULT 'permit_issued' CHECK (booking_status IN ('confirmed', 'permit_issued', 'manifest_verified', 'completed', 'cancelled')),
    ticket_number TEXT NOT NULL UNIQUE,
    qr_code_data TEXT NOT NULL,
    gate_reporting_time TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. CAB & CAB BOOKINGS (1 : MANY RELATIONSHIP)
-- --------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.cab (
    cab_id TEXT PRIMARY KEY, -- e.g. 'CAB-INNOVA-001'
    vehicle_model TEXT NOT NULL, -- e.g. 'Toyota Innova Crysta'
    cab_category TEXT NOT NULL CHECK (cab_category IN ('Prime Sedan', 'Prime SUV', 'Luxury Executive', 'Electric Clean-Tech', 'Tempo Traveller')),
    registration_number TEXT NOT NULL UNIQUE, -- e.g. 'DL-01-TA-4491'
    partner_id TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    driver_id TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    driver_rating NUMERIC(3, 2) NOT NULL DEFAULT 4.90,
    driver_photo TEXT,
    fuel_type TEXT NOT NULL DEFAULT 'Diesel' CHECK (fuel_type IN ('CNG', 'Diesel', 'Electric', 'Petrol')),
    seating_capacity INT NOT NULL DEFAULT 4 CHECK (seating_capacity >= 2),
    luggage_bags_capacity INT NOT NULL DEFAULT 2,
    ac_type TEXT NOT NULL DEFAULT 'Dual Climate Control AC',
    base_fare_per_km NUMERIC(6, 2) NOT NULL,
    minimum_fare NUMERIC(10, 2) NOT NULL,
    driver_allowance_per_night NUMERIC(8, 2) NOT NULL DEFAULT 400.00,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'on_trip', 'scheduled', 'maintenance')),
    current_location_city TEXT NOT NULL,
    total_trips_completed INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Many Cab Bookings referencing 1 Cab
CREATE TABLE IF NOT EXISTS public.cab_bookings (
    cab_booking_id TEXT PRIMARY KEY, -- e.g. 'CB-BK-2026-101'
    cab_id TEXT NOT NULL REFERENCES public.cab(cab_id) ON DELETE CASCADE, -- 1:Many
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    trip_type TEXT NOT NULL CHECK (trip_type IN ('Outstation One-Way', 'Outstation Round-Trip', 'Local Hourly Rental', 'Airport Transfer')),
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    pickup_datetime TIMESTAMPTZ NOT NULL,
    return_datetime TIMESTAMPTZ,
    total_estimated_km NUMERIC(8, 2) NOT NULL,
    base_fare NUMERIC(10, 2) NOT NULL,
    toll_and_taxes NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    driver_allowance NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    gst_amount NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_id TEXT NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'paid' CHECK (payment_status IN ('paid', 'partially_paid', 'pay_on_trip')),
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'driver_assigned', 'trip_started', 'completed', 'cancelled')),
    otp_start TEXT NOT NULL DEFAULT '5912',
    tax_invoice_number TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for optimal relational query performance
CREATE INDEX IF NOT EXISTS idx_houseboat_bookings_houseboat ON public.houseboat_bookings(houseboat_id);
CREATE INDEX IF NOT EXISTS idx_houseboat_bookings_customer ON public.houseboat_bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_houseboat_bookings_partner ON public.houseboat_bookings(partner_id);

CREATE INDEX IF NOT EXISTS idx_safari_bookings_pkg ON public.safari_bookings(safari_package_id);
CREATE INDEX IF NOT EXISTS idx_safari_bookings_date ON public.safari_bookings(safari_date);
CREATE INDEX IF NOT EXISTS idx_safari_packages_park ON public.safari_packages(national_park);

CREATE INDEX IF NOT EXISTS idx_cab_bookings_cab_id ON public.cab_bookings(cab_id);
CREATE INDEX IF NOT EXISTS idx_cab_bookings_customer ON public.cab_bookings(customer_id);
