-- ============================================================================
-- SCRIPT 04: CORE BOOKINGS & MULTI-VERTICAL INVENTORY TABLES
-- Engine: PostgreSQL 14+ / Supabase PostgreSQL
-- Tables: bookings, bookings_items, digital_tickets, houseboats, houseboat_bookings, safari_packages, safari_bookings, cab, cab_bookings
-- ============================================================================

-- 1. Master Root Bookings Ledger
CREATE TABLE IF NOT EXISTS public.bookings (
    booking_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
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

-- 2. Polymorphic Booking Line Items
CREATE TABLE IF NOT EXISTS public.bookings_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN (
        'Flight', 'Train', 'Bus', 'Hotel', 'Resort', 'Lodge', 'Tour', 'Pilgrimage', 'Cab'
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

-- 3. Digital Travel Passes & Encrypted Gate Tokens
CREATE TABLE IF NOT EXISTS public.digital_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id TEXT NOT NULL REFERENCES public.bookings(booking_id) ON DELETE CASCADE,
    ticket_number TEXT NOT NULL UNIQUE,
    pnr TEXT NOT NULL,
    qr_token TEXT NOT NULL,
    qr_url TEXT,
    pdf_url TEXT,
    barcode TEXT NOT NULL,
    print_status TEXT NOT NULL DEFAULT 'PENDING' CHECK (print_status IN ('PENDING', 'PRINTED', 'DOWNLOADED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Houseboats Fleet Directory
CREATE TABLE IF NOT EXISTS public.houseboats (
    houseboat_id TEXT PRIMARY KEY,
    partner_id UUID NOT NULL REFERENCES public.operator_profiles(id) ON DELETE CASCADE,
    partner_name TEXT NOT NULL,
    name TEXT NOT NULL,
    vessel_registration_number TEXT NOT NULL UNIQUE,
    waterbody TEXT NOT NULL,
    destination TEXT NOT NULL,
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

-- 5. Houseboat Bookings
CREATE TABLE IF NOT EXISTS public.houseboat_bookings (
    booking_id TEXT PRIMARY KEY,
    houseboat_id TEXT NOT NULL REFERENCES public.houseboats(houseboat_id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    partner_id UUID NOT NULL REFERENCES public.operator_profiles(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    checkin_date TIMESTAMPTZ NOT NULL,
    checkout_date TIMESTAMPTZ NOT NULL,
    nights INT NOT NULL DEFAULT 1,
    guests_count INT NOT NULL DEFAULT 2,
    bedrooms_booked INT NOT NULL DEFAULT 1,
    meal_plan TEXT DEFAULT 'All Meals (Breakfast, Lunch, Dinner)',
    special_requests TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Wildlife Safari Packages Directory
CREATE TABLE IF NOT EXISTS public.safari_packages (
    package_id TEXT PRIMARY KEY,
    national_park_name TEXT NOT NULL,
    zone_name TEXT NOT NULL,
    safari_type TEXT NOT NULL CHECK (safari_type IN ('Jeep Safari', 'Canter Safari', 'Elephant Safari', 'Walking Safari')),
    vehicle_type TEXT NOT NULL,
    duration_hours NUMERIC(3, 1) NOT NULL DEFAULT 3.5,
    max_passengers_per_vehicle INT NOT NULL DEFAULT 6,
    price_per_person NUMERIC(10, 2) NOT NULL,
    permits_available INT NOT NULL DEFAULT 12,
    season_start DATE,
    season_end DATE,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.70,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed_for_monsoon', 'sold_out')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Wildlife Safari Bookings
CREATE TABLE IF NOT EXISTS public.safari_bookings (
    booking_id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL REFERENCES public.safari_packages(package_id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    safari_date DATE NOT NULL,
    shift TEXT NOT NULL CHECK (shift IN ('Morning', 'Evening', 'Full Day')),
    passenger_count INT NOT NULL DEFAULT 1,
    vehicle_allocated TEXT,
    total_amount NUMERIC(10, 2) NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'pending', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Cab Fleet Directory
CREATE TABLE IF NOT EXISTS public.cab (
    cab_id TEXT PRIMARY KEY,
    vehicle_number TEXT NOT NULL UNIQUE,
    model TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Hatchback', 'Sedan', 'SUV', 'EV Sedan', 'Luxury Coach')),
    current_city TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'busy', 'maintenance', 'offline')),
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.80,
    reviews_count INT NOT NULL DEFAULT 0,
    per_km_rate NUMERIC(6, 2) NOT NULL DEFAULT 14.00,
    base_price NUMERIC(6, 2) NOT NULL DEFAULT 250.00,
    driver_name TEXT NOT NULL,
    driver_phone TEXT NOT NULL,
    driver_license_number TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Cab Trip Bookings
CREATE TABLE IF NOT EXISTS public.cab_bookings (
    booking_id TEXT PRIMARY KEY,
    cab_id TEXT NOT NULL REFERENCES public.cab(cab_id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    pickup_city TEXT NOT NULL,
    drop_city TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    drop_address TEXT NOT NULL,
    pickup_datetime TIMESTAMPTZ NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'driver_assigned', 'started', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
