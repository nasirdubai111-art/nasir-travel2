import React, { useState } from "react";
import {
  Plane,
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
  Navigation,
  Compass,
  Luggage,
  CheckSquare,
} from "lucide-react";

type FlightSubView =
  | "flight_registration"
  | "flight_schedule_management"
  | "customer_flight_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function FlightEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<FlightSubView>(
    "flight_schedule_management"
  );

  // Registration state
  const [regStep, setRegStep] = useState(1);
  const [airlineData, setAirlineData] = useState({
    airlineName: "SkyWings Premier Air Lines & Regional Charters",
    iataCode: "SW (SkyWings - DGCA Scheduled Operator #441)",
    contactPerson: "Capt. Alok Bansal (Chief Operating Officer)",
    contactPhone: "+91 11 2567-9000",
    email: "operations@skywings-air.in",
    headquarters: "Aviation Plaza, Terminal 3 Cargo & Commercial Wing, IGI Airport, New Delhi 110037",
    fleetSize: "28 Airbus A321neo & ATR 72-600 Aircraft",
    operatingHubs: "DEL, BOM, BLR, HYD, CCU, SXR, GOI, COK",
    dgcaLicense: "DGCA-AOP-SCH-2022-8819",
    gstin: "07AAACS9918K1Z2",
    bankName: "ICICI Bank (Aviation Corporate Branch)",
    accountNumber: "000405019283",
    ifsc: "ICIC0000004",
  });

  // Flight schedule creation state
  const [flightData, setFlightData] = useState({
    flightNumber: "SW-342 (Airbus A321neo)",
    origin: "New Delhi (DEL - Terminal 3)",
    destination: "Mumbai (BOM - Terminal 2)",
    departureTime: "07:30 AM",
    arrivalTime: "09:45 AM",
    duration: "2h 15m (Non-Stop)",
    operatingDays: "Daily (Mon, Tue, Wed, Thu, Fri, Sat, Sun)",
    economySeats: 180,
    economyBaseFare: 4850,
    businessSeats: 16,
    businessBaseFare: 14500,
    baggageAllowance: "15kg Check-in + 7kg Cabin (Economy) • 30kg + 10kg (Business)",
    mealsIncluded: "Complimentary Hot Breakfast & Beverages",
    cancellation: "Refundable with flat ₹2,500 airline fee up to 4 hours before departure.",
  });

  // Customer booking state
  const [tripType, setTripType] = useState<"oneWay" | "roundTrip">("oneWay");
  const [fromCity, setFromCity] = useState("New Delhi (DEL)");
  const [toCity, setToCity] = useState("Mumbai (BOM)");
  const [flyDate, setFlyDate] = useState("2026-09-18");
  const [cabinClass, setCabinClass] = useState<"economy" | "business">("economy");
  const [paxCount, setPaxCount] = useState(2);
  const [mealPreference, setMealPreference] = useState("Vegetarian Hindu Meal (AVML)");
  const [extraBaggage, setExtraBaggage] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Booking management mock data
  const [flightBookings, setFlightBookings] = useState([
    {
      pnr: "PNR-SW-8819A",
      passenger: "Rohit & Pooja Malhotra (2 Seats)",
      flight: "SW-342 (DEL → BOM)",
      class: "Economy Flex (Seats 14A, 14B)",
      meal: "2x AVML (Hot Breakfast)",
      baggage: "30kg Total Checked-in",
      fare: "₹10,670 (Taxes & Fees Included)",
      status: "Ticketed & Confirmed",
    },
    {
      pnr: "PNR-SW-8820B",
      passenger: "Sunil Verma (1 Seat - Corporate Flex)",
      flight: "SW-342 (DEL → BOM)",
      class: "Business Class (Seat 2F)",
      meal: "Continental Gourmet Breakfast",
      baggage: "30kg + Priority Tag",
      fare: "₹16,450 (Corporate Billed)",
      status: "Web Check-in Completed",
    },
  ]);

  const unitFare = cabinClass === "economy" ? flightData.economyBaseFare : flightData.businessBaseFare;
  const subTotal = unitFare * paxCount;
  const taxesAviation = Math.round(subTotal * 0.12);
  const baggageCharge = extraBaggage ? 1200 * paxCount : 0;
  const grandTotal = subTotal + taxesAviation + baggageCharge;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("flight_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "flight_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Airline Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("flight_schedule_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "flight_schedule_management"
                ? "bg-sky-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Plane className="w-3.5 h-3.5" />
            <span>2. Flight Schedule &amp; Fares</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_flight_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_flight_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Customer Flight Booking</span>
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
            <span>4. Flight Manifest &amp; PNR Desk</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30">
          Vertical: Airline GDS &amp; Flight Inventory
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. AIRLINE REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "flight_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Airline Partner Portal
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  DGCA Air Operator Certificate (AOC) &amp; IATA GDS Integration
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                DGCA CERTIFIED AIRLINE
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Airline & AOC Details", desc: "IATA Code, DGCA License" },
                { step: 2, title: "Fleet & Routes", desc: "Airbus A321neo & ATR" },
                { step: 3, title: "Airport Hubs & Slots", desc: "DEL, BOM, BLR Slots" },
                { step: 4, title: "Settlement Vault", desc: "IATA BSP Automated Clearing" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-sky-500/20 border-sky-500/80 text-sky-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-sky-400 font-bold">Step 0{s.step}</div>
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
                    <label className="block text-slate-400 mb-1 font-semibold">Airline Commercial Name</label>
                    <input
                      type="text"
                      value={airlineData.airlineName}
                      onChange={(e) => setAirlineData({ ...airlineData, airlineName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">IATA / ICAO Code</label>
                    <input
                      type="text"
                      value={airlineData.iataCode}
                      onChange={(e) => setAirlineData({ ...airlineData, iataCode: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sky-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">DGCA AOC License Number</label>
                    <input
                      type="text"
                      value={airlineData.dgcaLicense}
                      onChange={(e) => setAirlineData({ ...airlineData, dgcaLicense: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Active Fleet Summary</label>
                    <input
                      type="text"
                      value={airlineData.fleetSize}
                      onChange={(e) => setAirlineData({ ...airlineData, fleetSize: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Operational Headquarters</label>
                    <input
                      type="text"
                      value={airlineData.headquarters}
                      onChange={(e) => setAirlineData({ ...airlineData, headquarters: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">IATA Billing &amp; Settlement Plan (BSP) Gateway:</span>
                  <span className="text-emerald-400 font-mono font-bold">{airlineData.bankName} (A/C: {airlineData.accountNumber})</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Automated daily ticket clearing &amp; tax remittance. Platform fee: 2.2% on standard NDC bookings.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. FLIGHT SCHEDULE & FARES — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "flight_schedule_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Flight Schedule &amp; Inventory Management
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Flight Timings, Seat Maps, Dynamic Class Pricing &amp; Baggage Rules
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-sky-400">
                Route: DEL → BOM (Non-Stop)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Flight Number &amp; Aircraft</label>
                <input
                  type="text"
                  value={flightData.flightNumber}
                  onChange={(e) => setFlightData({ ...flightData, flightNumber: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Origin Airport</label>
                <input
                  type="text"
                  value={flightData.origin}
                  onChange={(e) => setFlightData({ ...flightData, origin: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Destination Airport</label>
                <input
                  type="text"
                  value={flightData.destination}
                  onChange={(e) => setFlightData({ ...flightData, destination: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Departure &amp; Arrival Timings</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={flightData.departureTime}
                    onChange={(e) => setFlightData({ ...flightData, departureTime: e.target.value })}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                  <input
                    type="text"
                    value={flightData.arrivalTime}
                    onChange={(e) => setFlightData({ ...flightData, arrivalTime: e.target.value })}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Economy Base Fare (₹)</label>
                <input
                  type="number"
                  value={flightData.economyBaseFare}
                  onChange={(e) => setFlightData({ ...flightData, economyBaseFare: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Business Base Fare (₹)</label>
                <input
                  type="number"
                  value={flightData.businessBaseFare}
                  onChange={(e) => setFlightData({ ...flightData, businessBaseFare: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-slate-400 mb-1 font-semibold">Baggage Allowance &amp; In-Flight Dining</label>
                <input
                  type="text"
                  value={flightData.baggageAllowance}
                  onChange={(e) => setFlightData({ ...flightData, baggageAllowance: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sky-300 font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Active Slot Allocation &amp; Turnaround Protocol:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                Delhi IGI (DEL T3) Gate 28 Slot &bull; Departure 07:30 AM &bull; On-Time Performance (OTP) 98.6% &bull; Clean Aircraft Turnaround within 35 minutes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. CUSTOMER FLIGHT BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_flight_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Search Flights, Select Cabin Class &amp; Instant E-Ticket Issuance
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-mono font-bold flex items-center gap-1">
                ★ 4.90 Rating (18,400 Reviews)
              </span>
            </div>

            {/* Flight Search */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">From (Origin)</label>
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">To (Destination)</label>
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Travel Date</label>
                <input
                  type="date"
                  value={flyDate}
                  onChange={(e) => setFlyDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Cabin Class</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCabinClass("economy")}
                    className={`w-1/2 py-2 rounded-xl text-2xs font-bold transition-all ${
                      cabinClass === "economy"
                        ? "bg-sky-600 text-white shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Economy
                  </button>
                  <button
                    onClick={() => setCabinClass("business")}
                    className={`w-1/2 py-2 rounded-xl text-2xs font-bold transition-all ${
                      cabinClass === "business"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Business
                  </button>
                </div>
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">SW-342: New Delhi (DEL) → Mumbai (BOM)</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-3xs font-extrabold uppercase">
                      {cabinClass} Class &bull; 07:30 AM Departure
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    {paxCount} Passengers &bull; Airbus A321neo &bull; Hot Gourmet Breakfast &bull; {flightData.baggageAllowance}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Airfare (Taxes Included)</span>
                  <span className="text-lg font-black text-white">₹{grandTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant IATA E-Ticket &bull; Web Check-in Opens 48 Hrs Prior
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Flight Booking Confirmed!\nPNR: PNR-SW-8819A\nE-Ticket & Boarding Barcode Generated.\nSent to WhatsApp & Email."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{grandTotal.toLocaleString()} &amp; Issue E-Ticket</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      E-Ticket Issued: PNR-SW-8819A &bull; Seats 14A, 14B Confirmed
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      TICKETED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Departure on 18 Sep 2026 at 07:30 AM from IGI Airport Delhi Terminal 3 Gate 28.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. FLIGHT OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Airline Passenger Manifest &amp; PNR Desk
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Flight Seat Inventory, Baggage Tags &amp; Gate Boarding Manifest
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: Flight SW-342 (DEL → BOM)
              </span>
            </div>

            <div className="space-y-3">
              {flightBookings.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.passenger}</span>
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-3xs">{item.pnr}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.flight} &bull; <span className="text-white font-semibold">{item.class}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.meal} &bull; {item.baggage} &bull; {item.fare}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`Boarding pass barcode sent for ${item.pnr}!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Print Bag Tag
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
                  Airline GDS &amp; NDC Microservices Architecture
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Amadeus/Sabre NDC Direct Connect, PNR Lock Engine &amp; IATA BSP Clearing
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              High-throughput aviation services maintaining live seat inventory locks, dynamic class bucket pricing algorithms, and IATA BSP automated reconciliation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "IATA NDC Direct Connect 21.3 XML Engine",
                desc: "Real-time bidirectional XML/JSON flight shopping and seat availability gateway connecting directly into airline inventory.",
                icon: Plane,
              },
              {
                title: "Dynamic Revenue & Yield Class Bucket Engine",
                desc: "Calculates instantaneous fare escalations across 26 booking classes (R, N, V, M, Y, J, C) based on flight load factors.",
                icon: DollarSign,
              },
              {
                title: "PNR Creation & SSR Ancillary Allocation",
                desc: "Automates Special Service Requests (SSR) for extra baggage, wheelchair assistance, and pre-ordered hot meals.",
                icon: Luggage,
              },
              {
                title: "Airport DCS & Barcode Check-in Microservice",
                desc: "Generates IATA BCBP compliant 2D PDF417 boarding pass barcodes for airport security e-gates.",
                icon: QrCode,
              },
              {
                title: "DGCA Flight Watch & Telemetry Sync",
                desc: "Integrates with ADS-B radar live aircraft tracking feeds for real-time delay notifications and gate changes.",
                icon: Navigation,
              },
              {
                title: "IATA BSP Settlement & Remittance Worker",
                desc: "Automated daily reconciliation of gross passenger revenue, aviation taxes (UDF, PSF, GST), and 2.2% platform fees.",
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
                  Admin Panel &bull; Airline &amp; Flight Operations
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Flight Schedule Approvals, DGCA Compliance &amp; Airline Gross GMV
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: aviation_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Scheduled Flight Routes</span>
                <span className="text-sm font-black text-white">480 Active Daily Flights</span>
                <span className="text-3xs text-emerald-400 block">Across 62 Indian Airports</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Flight Gross GMV</span>
                <span className="text-sm font-black text-sky-400">₹18,40,00,000</span>
                <span className="text-3xs text-slate-400 block">2.2% Platform Brokerage</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Passengers Flown This Month</span>
                <span className="text-sm font-black text-emerald-400">1,24,000 Passengers</span>
                <span className="text-3xs text-slate-400 block">99.8% PNR Reliability</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
