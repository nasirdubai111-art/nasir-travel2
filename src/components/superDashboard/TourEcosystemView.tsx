import React, { useState } from "react";
import {
  Compass,
  Shield,
  ShieldCheck,
  Lock,
  Eye,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  DollarSign,
  TrendingUp,
  Server,
  Database,
  Key,
  Cpu,
  Download,
  Search,
  Filter,
  Check,
  Zap,
  ArrowRight,
  Sliders,
  ChevronRight,
  UserCheck,
  FileSpreadsheet,
  RefreshCw,
  Award,
  Sparkles,
  Phone,
  Mail,
  Building,
  Plane,
  Camera,
  Sun,
  Umbrella,
  Globe,
  CheckSquare,
} from "lucide-react";

type TourSubView =
  | "tour_registration"
  | "tour_package_creation"
  | "customer_tour_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function TourEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<TourSubView>(
    "tour_package_creation"
  );

  // Registration state
  const [regStep, setRegStep] = useState(1);
  const [tourAgency, setTourAgency] = useState({
    agencyName: "Himalayan Horizons & Golden Triangle Luxury Tours",
    director: "Rajeshwar Pratap Singh & Neha Kapoor",
    mobile: "+91 11 4982-1100",
    email: "tours@himalayanhorizons.in",
    officeAddress: "SCO 104, Sector 17-C, Chandigarh & Connaught Place, New Delhi",
    destinations: "Kashmir, Ladakh, Himachal, Kerala, Rajasthan, North East, Andaman & Nicobar",
    specialization: "Experiential Holiday Circuits, Honeymoon Getaways, High-Altitude Treks, Heritage Expeditions",
    iatoId: "IATO-ACTIVE-MEMBER-99182",
    gstin: "07AAACH9102J1Z8",
    bankName: "State Bank of India (CP New Delhi)",
    accountNumber: "309182736192",
    ifsc: "SBIN0000691",
  });

  // Package creation state
  const [holidayPackage, setHolidayPackage] = useState({
    packageName: "Splendors of Kashmir: Srinagar, Gulmarg & Pahalgam Paradise",
    destination: "Kashmir Valley (Srinagar • Gulmarg • Pahalgam • Sonmarg)",
    duration: "6 Days / 5 Nights",
    tourType: "Luxury Leisure Holiday & Houseboat Experience",
    hotelCategory: "4-Star Deluxe Resorts & Dal Lake Luxury Houseboat",
    transport: "Dedicated Private AC Innova Crysta / Luxury Tempo Traveller",
    mealPlan: "Daily Buffet Breakfast & Gourmet Kashmiri Wazwan Dinners (MAP Plan)",
    sightseeingInclusions: "Shikara Ride at Dal Lake, Gulmarg Gondola Phase 1 & 2, Betaab Valley, Aru Valley",
    pricePerPerson: 24500,
    childPrice: 14500,
    departureDates: "Every Saturday & Wednesday Departures",
    maxGroupSize: 20,
    cancellation: "100% refund up to 14 days before departure; 50% between 7-13 days.",
  });

  // Customer tour booking state
  const [selectedTour, setSelectedTour] = useState("Splendors of Kashmir 6D/5N");
  const [travelDate, setTravelDate] = useState("2026-09-20");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(1);
  const [gondolaAddon, setGondolaAddon] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Booking management mock data
  const [tourBookings, setTourBookings] = useState([
    {
      id: "TOUR-KASH-8812",
      traveler: "Dr. Sandeep & Tanvi Kulkarni (Family 3 Pax)",
      package: "Splendors of Kashmir (6D/5N)",
      dates: "20 Sep - 25 Sep 2026",
      vehicleAssigned: "Innova Crysta (JK-01-AZ-9912 - Driver: Farooq)",
      hotelVouchers: "The Grand Dragon Srinagar & Luxury Houseboat #04",
      gondolaPass: "Phase 1 & 2 Passes Issued (#GND-8910)",
      status: "Confirmed (Full Payment Received)",
    },
    {
      id: "TOUR-RAJ-8813",
      traveler: "David & Emma Harrison (2 Pax - UK Guests)",
      package: "Royal Rajasthan Heritage & Desert Safari (7D/6N)",
      dates: "28 Sep - 04 Oct 2026",
      vehicleAssigned: "Toyota Fortuner 4x4 (RJ-14-CC-2210)",
      hotelVouchers: "Umaid Bhawan & Sam Sand Dunes Luxury Tent",
      gondolaPass: "Heritage Fort VIP Guides Pre-Booked",
      status: "Confirmed (Advance Received)",
    },
  ]);

  const totalPax = adults + children;
  const baseCost = adults * holidayPackage.pricePerPerson + children * holidayPackage.childPrice;
  const gondolaTotal = gondolaAddon ? 2000 * adults : 0;
  const grandTotal = baseCost + gondolaTotal;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("tour_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "tour_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Tour Agency Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("tour_package_creation")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "tour_package_creation"
                ? "bg-teal-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>2. Tour Package Creation</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_tour_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_tour_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Customer Tour Booking</span>
          </button>

          <button
            onClick={() => setActiveSubView("operator_booking_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "operator_booking_management"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>4. Tour Booking Management</span>
          </button>

          <button
            onClick={() => setActiveSubView("backend_modules")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "backend_modules"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>5. Backend Modules (Hidden)</span>
          </button>

          <button
            onClick={() => setActiveSubView("admin_console")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "admin_console"
                ? "bg-purple-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>6. Admin Console</span>
          </button>
        </div>

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30">
          Vertical: Holiday Packages &amp; Leisure Circuits
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. TOUR REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "tour_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Tour Operator Portal
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Holiday Agency Accreditation &amp; IATO / Ministry of Tourism Certification
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                IATO APPROVED TOUR OPERATOR
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Agency Details", desc: "IATO, Tourism Dept" },
                { step: 2, title: "Destination Networks", desc: "Kashmir, Kerala, Ladakh" },
                { step: 3, title: "Fleet & Hotels", desc: "Resort & Cab Contracts" },
                { step: 4, title: "Settlement Account", desc: "T+2 Weekly Wire" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-teal-500/20 border-teal-500/80 text-teal-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-teal-400 font-bold">Step 0{s.step}</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{s.title}</div>
                  <div className="text-3xs text-slate-400">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Form */}
            {regStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Tour Agency Name</label>
                    <input
                      type="text"
                      value={tourAgency.agencyName}
                      onChange={(e) => setTourAgency({ ...tourAgency, agencyName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Managing Director</label>
                    <input
                      type="text"
                      value={tourAgency.director}
                      onChange={(e) => setTourAgency({ ...tourAgency, director: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">IATO / Govt. Tourism Reg. No.</label>
                    <input
                      type="text"
                      value={tourAgency.iatoId}
                      onChange={(e) => setTourAgency({ ...tourAgency, iatoId: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-teal-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Operating Holiday Circuits</label>
                    <input
                      type="text"
                      value={tourAgency.destinations}
                      onChange={(e) => setTourAgency({ ...tourAgency, destinations: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Office Address</label>
                    <input
                      type="text"
                      value={tourAgency.officeAddress}
                      onChange={(e) => setTourAgency({ ...tourAgency, officeAddress: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Bank Settlement Credentials:</span>
                  <span className="text-emerald-400 font-mono font-bold">{tourAgency.bankName} (A/C: {tourAgency.accountNumber})</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Automated T+2 payment clearing. Platform brokerage: 6.0% with full customer review transparency.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. TOUR PACKAGE CREATION — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "tour_package_creation" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  Tour Package Creation &amp; Management
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Holiday Itinerary, Resort Allocations, Private Cab &amp; Excursions
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-teal-400">
                Package: Kashmir Paradise 6D/5N
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Package Title</label>
                <input
                  type="text"
                  value={holidayPackage.packageName}
                  onChange={(e) => setHolidayPackage({ ...holidayPackage, packageName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Duration</label>
                <input
                  type="text"
                  value={holidayPackage.duration}
                  onChange={(e) => setHolidayPackage({ ...holidayPackage, duration: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Hotel Accommodation Level</label>
                <input
                  type="text"
                  value={holidayPackage.hotelCategory}
                  onChange={(e) => setHolidayPackage({ ...holidayPackage, hotelCategory: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Dedicated Private Vehicle</label>
                <input
                  type="text"
                  value={holidayPackage.transport}
                  onChange={(e) => setHolidayPackage({ ...holidayPackage, transport: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Rate per Adult (₹)</label>
                <input
                  type="number"
                  value={holidayPackage.pricePerPerson}
                  onChange={(e) => setHolidayPackage({ ...holidayPackage, pricePerPerson: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-slate-400 mb-1 font-semibold">Key Sightseeing &amp; Inclusions</label>
                <input
                  type="text"
                  value={holidayPackage.sightseeingInclusions}
                  onChange={(e) => setHolidayPackage({ ...holidayPackage, sightseeingInclusions: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-teal-300 font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Detailed Day-Wise Itinerary Overview:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                Day 1: Srinagar Airport Arrival &bull; Shikara Ride at Dal Lake &bull; Overnight in Heritage Houseboat. Day 2: Srinagar to Gulmarg &bull; Gondola Cable Car Ride to Apharwat Peak. Day 3: Gulmarg to Pahalgam Valley &bull; Saffron Fields &bull; Betaab Valley. Day 4: Aru Valley &bull; Chandanwari &bull; Riverside Trout Fishing. Day 5: Return to Srinagar &bull; Mughal Gardens &bull; Shankaracharya Temple. Day 6: Airport Drop.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. CUSTOMER TOUR BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_tour_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Book Complete Holiday Packages with Flights, Hotels &amp; Sightseeing
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold flex items-center gap-1">
                ★ 4.94 Rating (3,120 Travelers)
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Holiday Package</label>
                <input
                  type="text"
                  value={selectedTour}
                  onChange={(e) => setSelectedTour(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Travel Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Travelers (Adults / Children)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                  <input
                    type="number"
                    value={children}
                    onChange={(e) => setChildren(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Gulmarg Gondola Pass</label>
                <button
                  onClick={() => setGondolaAddon(!gondolaAddon)}
                  className={`w-full py-2 rounded-xl font-bold transition-all text-xs ${
                    gondolaAddon
                      ? "bg-teal-600 text-white shadow-md"
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  {gondolaAddon ? "✓ Phase 1 & 2 Passes (+₹2,000/pax)" : "+ Add Gondola Pass"}
                </button>
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Splendors of Kashmir: Srinagar, Gulmarg &amp; Pahalgam</span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-3xs font-extrabold">
                      6D/5N Premium Holiday
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    {totalPax} Travelers &bull; 4-Star Deluxe Resorts + Houseboat &bull; Private Innova Crysta &bull; Breakfast &amp; Dinners &bull; Shikara Ride
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Holiday Price</span>
                  <span className="text-lg font-black text-white">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant Voucher Issued &bull; 100% Guaranteed Departures
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Holiday Tour Confirmed!\nBooking Ref: TOUR-KASH-8812\nHotel Vouchers, Driver Allocation & Gondola Passes Generated."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{grandTotal.toLocaleString()} &amp; Confirm Holiday</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Holiday Dossier Issued: TOUR-KASH-8812 &bull; Driver Farooq Assigned
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      CONFIRMED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Pickup from Srinagar Airport (SXR) on 20 Sep 2026. Innova Crysta JK-01-AZ-9912 waiting at arrival gate.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. TOUR OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Tour Operations &amp; Dispatch Desk
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Traveler Arrivals, Dedicated Drivers, Resort Vouchers &amp; Excursions
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: Srinagar &amp; Delhi Central Hub
              </span>
            </div>

            <div className="space-y-3">
              {tourBookings.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.traveler}</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-3xs">{item.id}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.package} &bull; <span className="text-white font-semibold">{item.dates}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.vehicleAssigned} &bull; {item.hotelVouchers} &bull; {item.gondolaPass}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`Full Holiday Voucher & Itinerary dispatched to ${item.traveler}!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Issue Holiday Kit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. BACKEND MODULES — NEVER DISPLAYED ON FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "backend_modules" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-rose-950/80 via-slate-950 to-slate-900 border border-rose-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  Tour Operator Microservices &amp; Multi-Supplier Engine
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Dynamic Package Bundler, Hotel Channel Sync &amp; Driver Fleet Dispatcher
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              High-reliability backend services orchestrating composite package pricing, resort room locks, tourist cab telemetry, and automated supplier settlement splits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Composite Holiday Dynamic Pricing Engine",
                desc: "Real-time cost summation combining flight GDS, resort channel managers, and local cab fleet tariffs with dynamic margin optimization.",
                icon: DollarSign,
              },
              {
                title: "Resort & Houseboat Room Allotment Vault",
                desc: "Two-way PMS synchronization for instant room voucher generation across partnered mountain lodges and lake cruisers.",
                icon: Building,
              },
              {
                title: "Tourist Cab & Chauffeur Telemetry Dispatch",
                desc: "Live GPS dispatch tracking and automated driver contact masking for tourist safety across hill-station routes.",
                icon: Compass,
              },
              {
                title: "Gondola, Wildlife Safari & Monument Ticket Gateway",
                desc: "Direct integration with state tourism ticketing APIs for automated Gondola and national park safari permit issuance.",
                icon: Camera,
              },
              {
                title: "Travel Insurance & Medical SOS Dispatcher",
                desc: "Automated traveler accidental coverage policy generation and emergency medical evacuation coordination.",
                icon: ShieldCheck,
              },
              {
                title: "Multi-Party Split Settlement Ledger",
                desc: "Automates 6.0% platform fee retention and distributes vendor payouts directly to hotel, cab operator, and local guides.",
                icon: CreditCard,
              },
            ].map((mod, i) => {
              const Icon = mod.icon;
              return (
                <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400">
                    <Icon className="w-4 h-4" />
                    <span className="font-bold text-white text-xs">{mod.title}</span>
                  </div>
                  <p className="text-2xs text-slate-400 leading-relaxed">{mod.desc}</p>
                  <div className="pt-2 border-t border-slate-900 text-3xs font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Zero Frontend Exposure Guaranteed</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 6. ADMIN CONSOLE */}
      {/* ======================================================================= */}
      {activeSubView === "admin_console" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Admin Panel &bull; Tour Operator Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Holiday Agency Audits, Tour Quality Ratings &amp; Platform GMV
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: holiday_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Verified Tour Agencies</span>
                <span className="text-sm font-black text-white">520 IATO/State Certified</span>
                <span className="text-3xs text-emerald-400 block">Across 180 Holiday Circuits</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Tour Bookings GMV</span>
                <span className="text-sm font-black text-teal-400">₹3,40,00,000</span>
                <span className="text-3xs text-slate-400 block">6.0% Platform Commission</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Happy Holiday Travelers</span>
                <span className="text-sm font-black text-emerald-400">42,800 Vacationers</span>
                <span className="text-3xs text-slate-400 block">99.4% Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
