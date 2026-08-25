import React, { useState } from "react";
import {
  Sparkles,
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
  Phone,
  Mail,
  Building,
  Sun,
  Coffee,
  Compass,
  CheckSquare,
} from "lucide-react";

type ResortSubView =
  | "resort_registration"
  | "resort_property_management"
  | "customer_resort_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function ResortEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<ResortSubView>(
    "resort_property_management"
  );

  // Registration state
  const [regStep, setRegStep] = useState(1);
  const [resortData, setResortData] = useState({
    resortName: "The Whispering Pines Luxury Hill Resort & Spa",
    generalManager: "Ananya Roy & Vikramaditya Rathore",
    contactPhone: "+91 177-2890-440",
    email: "reservations@whisperingpines-resort.com",
    address: "Mashobra Estate, Kufri Road, Shimla, Himachal Pradesh 171007",
    propertySpread: "25 Acres of Cedar Forest, Heated Infinity Pool & Mountain View Villas",
    villaCount: "42 Private Chalets & Presidential Forest Villas",
    starCategory: "5-Star Luxury Eco-Resort (Green Key Certified)",
    gstin: "02AABCR9912K1Z6",
    bankName: "Axis Bank (The Mall Shimla)",
    accountNumber: "91802009182736",
    ifsc: "UTIB0000182",
  });

  // Property & Villa management state
  const [villaData, setVillaData] = useState({
    villaType: "Presidential Cedar Wooden Villa with Private Heated Jacuzzi",
    roomSize: "1,200 sq.ft • Private Sundeck overlooking Snow-Capped Himalayan Peaks",
    capacity: "4 Adults or 2 Adults + 2 Children",
    checkInTime: "02:00 PM",
    checkOutTime: "11:00 AM",
    mealPlan: "All Gourmet Meals Included (CP / MAP / AP Plans available)",
    amenities: "Heated Infinity Pool, Jiva Ayurvedic Spa, Fireplace, High-Speed Starlink WiFi, Forest High-Tea",
    nightlyRate: 16500,
    dayPassRate: 4500,
    spaAddonRate: 3500,
    cancellation: "Free cancellation up to 72 hours prior to arrival date.",
  });

  // Customer booking state
  const [checkInDate, setCheckInDate] = useState("2026-09-22");
  const [nights, setNights] = useState(2);
  const [guestsCount, setGuestsCount] = useState(2);
  const [spaSessionAddon, setSpaSessionAddon] = useState(true);
  const [candlelightDinnerAddon, setCandlelightDinnerAddon] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Booking management mock data
  const [resortBookings, setResortBookings] = useState([
    {
      id: "RESORT-SHM-8819",
      guest: "Aditya & Sonia Kapoor (2 Nights)",
      villa: "Presidential Cedar Villa #04",
      dates: "22 Sep - 24 Sep 2026",
      specialRequests: "Anniversary Cake + Jiva Ayurvedic Couple Massage",
      fare: "₹38,500 (Breakfast & Spa Included)",
      status: "Confirmed (Advance Paid)",
    },
    {
      id: "RESORT-SHM-8820",
      guest: "Mehta Family (4 Pax - 3 Nights)",
      villa: "Himalayan Forest Duplex Chalet #08",
      dates: "26 Sep - 29 Sep 2026",
      specialRequests: "Airport Pickup from Chandigarh + Baby Cot",
      fare: "₹54,000 (MAP Plan Cleared)",
      status: "VIP Check-in Ready",
    },
  ]);

  const baseStay = villaData.nightlyRate * nights;
  const spaCost = spaSessionAddon ? villaData.spaAddonRate : 0;
  const dinnerCost = candlelightDinnerAddon ? 2500 : 0;
  const totalAmount = baseStay + spaCost + dinnerCost;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("resort_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "resort_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Resort Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("resort_property_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "resort_property_management"
                ? "bg-emerald-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>2. Villa &amp; Experience Setup</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_resort_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_resort_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Customer Resort Booking</span>
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
            <span>4. Front Desk &amp; Butler Roster</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
          Vertical: Luxury Resorts &amp; Wellness Retreats
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. RESORT REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "resort_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Resort Operator Portal
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Luxury Property Onboarding, Eco-Certifications &amp; Channel Manager Integration
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                5-STAR CERTIFIED RESORT
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Property Profile", desc: "Villas & Forest Acreage" },
                { step: 2, title: "Hospitality Standards", desc: "Spa & Dining Facilities" },
                { step: 3, title: "PMS & Channel Sync", desc: "Opera / SiteMinder" },
                { step: 4, title: "Settlement Account", desc: "Weekly Automated Payouts" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-emerald-500/20 border-emerald-500/80 text-emerald-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-emerald-400 font-bold">Step 0{s.step}</div>
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
                    <label className="block text-slate-400 mb-1 font-semibold">Resort Commercial Name</label>
                    <input
                      type="text"
                      value={resortData.resortName}
                      onChange={(e) => setResortData({ ...resortData, resortName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">General Manager</label>
                    <input
                      type="text"
                      value={resortData.generalManager}
                      onChange={(e) => setResortData({ ...resortData, generalManager: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Star Classification</label>
                    <input
                      type="text"
                      value={resortData.starCategory}
                      onChange={(e) => setResortData({ ...resortData, starCategory: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Property Acreage &amp; Highlights</label>
                    <input
                      type="text"
                      value={resortData.propertySpread}
                      onChange={(e) => setResortData({ ...resortData, propertySpread: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Resort Estate Address</label>
                    <input
                      type="text"
                      value={resortData.address}
                      onChange={(e) => setResortData({ ...resortData, address: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Bank Settlement Account (Weekly Tuesday Wire):</span>
                  <span className="text-emerald-400 font-mono font-bold">{resortData.bankName} (A/C: {resortData.accountNumber})</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Automated weekly clearing. Platform commission: 8.0% on completed checkouts with full guest satisfaction guarantees.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. RESORT PROPERTY MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "resort_property_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Villa &amp; Experience Setup
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Luxury Chalets, Heated Pools, Ayurvedic Spa &amp; Dining Tariffs
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Chalet: Presidential Cedar Villa #04
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Chalet / Villa Title</label>
                <input
                  type="text"
                  value={villaData.villaType}
                  onChange={(e) => setVillaData({ ...villaData, villaType: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Nightly Base Tariff (₹)</label>
                <input
                  type="number"
                  value={villaData.nightlyRate}
                  onChange={(e) => setVillaData({ ...villaData, nightlyRate: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Villa Specs &amp; Size</label>
                <input
                  type="text"
                  value={villaData.roomSize}
                  onChange={(e) => setVillaData({ ...villaData, roomSize: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Guest Capacity</label>
                <input
                  type="text"
                  value={villaData.capacity}
                  onChange={(e) => setVillaData({ ...villaData, capacity: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ayurvedic Spa Addon (₹)</label>
                <input
                  type="number"
                  value={villaData.spaAddonRate}
                  onChange={(e) => setVillaData({ ...villaData, spaAddonRate: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-slate-400 mb-1 font-semibold">Resort Inclusions &amp; Amenities</label>
                <input
                  type="text"
                  value={villaData.amenities}
                  onChange={(e) => setVillaData({ ...villaData, amenities: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Active 2-Way PMS Channel Manager Link:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                Oracle Opera PMS Connected &bull; Real-time rate parity locked across global GDS &bull; Instant QR-code mobile check-in enabled.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. CUSTOMER RESORT BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_resort_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Book Luxury Forest Villas, Heated Jacuzzi &amp; Jiva Spa Retreats
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                ★ 4.97 Rating (1,920 Stays)
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Check-in Date</label>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Duration (Nights)</label>
                <input
                  type="number"
                  value={nights}
                  onChange={(e) => setNights(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Adult Guests</label>
                <input
                  type="number"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Ayurvedic Spa Session</label>
                <button
                  onClick={() => setSpaSessionAddon(!spaSessionAddon)}
                  className={`w-full py-2 rounded-xl font-bold transition-all text-xs ${
                    spaSessionAddon
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  {spaSessionAddon ? "✓ Couple Spa Included (+₹3,500)" : "+ Add Spa Therapy"}
                </button>
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">The Whispering Pines Luxury Hill Resort (Shimla)</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-extrabold uppercase">
                      Presidential Cedar Villa &bull; {nights} Nights Stay
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    {guestsCount} Guests &bull; Private Heated Jacuzzi &bull; Mountain View &bull; Gourmet Breakfast Buffet &bull; Fireplace
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Stay (Taxes Included)</span>
                  <span className="text-lg font-black text-white">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant Booking Voucher &bull; Free Valet Parking &bull; Welcome Drink
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Resort Stay Confirmed!\nBooking Ref: RESORT-SHM-8819\nPresidential Cedar Villa #04 Reserved.\nButler assigned."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalAmount.toLocaleString()} &amp; Confirm Stay</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Villa Confirmed: RESORT-SHM-8819 &bull; Check-in 22 Sep 2026 (02:00 PM)
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      CONFIRMED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Welcome High-Tea will be served at the Forest Deck upon arrival.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. RESORT OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Resort Front Desk &amp; Butler Roster
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Today's Arrivals, Housekeeping Status &amp; Spa Therapy Schedules
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: Mashobra Front Office
              </span>
            </div>

            <div className="space-y-3">
              {resortBookings.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.guest}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-3xs">{item.id}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.villa} &bull; <span className="text-white font-semibold">{item.dates}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.specialRequests} &bull; {item.fare}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`Digital keycard & Butler info sent for ${item.id}!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Issue Keycard
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
                  Resort Property Management &amp; PMS Microservices
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Oracle Opera PMS Sync, Spa Appointment Mutex &amp; Dynamic Rate Parity
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Enterprise hospitality microservices handling 2-way room inventory rate pushes, spa therapist slot reservations, and automated luxury tax compliance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Oracle Opera PMS 2-Way Channel Bridge",
                desc: "Real-time room status, housekeeping clean flags, and folio billing synchronization directly with hotel backend servers.",
                icon: Building,
              },
              {
                title: "Ayurvedic Spa & Wellness Slot Mutex",
                desc: "Manages therapist rosters, treatment room sterilization intervals, and synchronized appointments without double booking.",
                icon: Sparkles,
              },
              {
                title: "Dynamic Weekend & Seasonal Yield Engine",
                desc: "Automatically calculates winter snowfall premiums and festival occupancy multipliers to optimize RevPAR.",
                icon: DollarSign,
              },
              {
                title: "Digital Keyless BLE Mobile Room Key Server",
                desc: "Generates encrypted Bluetooth Low Energy (BLE) mobile key tokens for direct door unlock without physical front desk queues.",
                icon: Key,
              },
              {
                title: "Eco-Tourism Green Key Compliance Audit",
                desc: "Monitors organic waste recycling, solar water heating kilowatt metrics, and carbon offset reporting for sustainable resort status.",
                icon: ShieldCheck,
              },
              {
                title: "Weekly Tuesday Automated Bank Wire Clearing",
                desc: "Retains 8.0% contracted OTA fee and transfers net guest revenue direct to partner bank accounts via RTGS.",
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
                  Admin Panel &bull; Resort &amp; Villa Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Resort Property Audits, Hygiene Ratings &amp; Platform GMV
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: resort_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Luxury Resorts Listed</span>
                <span className="text-sm font-black text-white">280 5-Star Eco-Resorts</span>
                <span className="text-3xs text-emerald-400 block">Across 48 Hill &amp; Beach Stations</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Resort GMV</span>
                <span className="text-sm font-black text-emerald-400">₹4,80,00,000</span>
                <span className="text-3xs text-slate-400 block">8.0% Platform Commission</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Luxury Nights Booked</span>
                <span className="text-sm font-black text-emerald-400">22,400 Guest Nights</span>
                <span className="text-3xs text-slate-400 block">99.6% Guest Rating</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
