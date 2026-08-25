import React, { useState } from "react";
import {
  Ship,
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
  Anchor,
  Coffee,
  Waves,
  Compass,
  CheckSquare,
} from "lucide-react";

type HouseboatSubView =
  | "houseboat_registration"
  | "houseboat_cruise_management"
  | "customer_houseboat_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function HouseboatEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<HouseboatSubView>(
    "houseboat_cruise_management"
  );

  // Registration state
  const [regStep, setRegStep] = useState(1);
  const [boatOwnerData, setBoatOwnerData] = useState({
    agencyName: "Royal Backwaters Heritage Kettuvallam Houseboats",
    captainName: "Capt. Kishore Mathew & Varghese Kuruvilla",
    contactPhone: "+91 94471-22910",
    email: "cruises@royalbackwaters-kerala.com",
    dockAddress: "Finishing Point Jetty & Punnamada Lake, Alappuzha (Alleppey), Kerala 688013",
    cruiseRoutes: "Alleppey-Kumarakom Circuit, Vembanad Lake, Kuttanad Paddy Waterways, Champakulam",
    fleetCount: "12 Luxury AC Kettuvallams (1-Bedroom, 2-Bedroom & 4-Bedroom Grand Cruisers)",
    portLicense: "KERALA-PORT-DEPT-HB-REG-2023-8819",
    gstin: "32AABCR9912K1Z4",
    bankName: "Federal Bank (Alleppey Boat Jetty Branch)",
    accountNumber: "10293847561029",
    ifsc: "FDRL0001029",
  });

  // Houseboat cruise management state
  const [cruiseData, setCruiseData] = useState({
    cruiseName: "Royal 2-Bedroom Luxury Glass-AC Kettuvallam (Overnight Stay)",
    houseboatType: "Traditional Anjili-Wood & Coir Kettuvallam with Glass Walls",
    bedroomCount: 2,
    guestCapacity: "4 Adults + 2 Children",
    checkInTime: "12:00 PM (Noon)",
    checkOutTime: "09:00 AM (Next Morning)",
    routeSummary: "Alleppey Finishing Point → Vembanad Lake → Kainakary Village → Overnight Docking at R-Block",
    crewOnboard: "3 Crew Members: Certified Captain, Engine Driver & Private Traditional Kerala Chef",
    mealPlan: "All Meals Included: Welcome Drink, Traditional Sadya Lunch with Karimeen Fish, Evening Snacks, Candlelight Dinner & Kerala Breakfast",
    amenities: "Full-Time Upper Sun-Deck AC, Modern Shower, Bluetooth Sound System, Life Jackets & Fishing Rods",
    overnightRate: 18500,
    dayCruiseRate: 11500,
    cancellation: "Full refund 7 days prior to cruise; 50% between 3-6 days.",
  });

  // Customer booking state
  const [cruiseType, setCruiseType] = useState<"overnight" | "dayCruise">("overnight");
  const [checkInDate, setCheckInDate] = useState("2026-09-24");
  const [guestAdults, setGuestAdults] = useState(4);
  const [karimeenSpecialAddon, setKarimeenSpecialAddon] = useState(true);
  const [candlelightDinnerAddon, setCandlelightDinnerAddon] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Booking management mock data
  const [cruiseBookings, setCruiseBookings] = useState([
    {
      id: "HB-KERALA-8819",
      guest: "Ashwin & Divya Raman (Honeymoon 2 Pax)",
      boatName: "Royal 2-Bedroom Luxury Kettuvallam #02",
      date: "24 Sep 2026 (Overnight 12:00 PM - 09:00 AM)",
      chefAssigned: "Chef Biju (Kerala Spice Special)",
      meals: "Karimeen Pollichathu + Candlelight Deck Setup",
      fare: "₹19,500 (All Meals & AC Included)",
      status: "Confirmed & Dock Prepared",
    },
    {
      id: "HB-KERALA-8820",
      guest: "Paul Koshy & Family (6 Pax)",
      boatName: "Maharaja 4-Bedroom Grand Cruiser #01",
      date: "28 Sep 2026 (Overnight)",
      chefAssigned: "Chef Sasi & Captain Mathew",
      meals: "Traditional Sadya + Tiger Prawns Roast",
      fare: "₹34,000 (Advance Cleared)",
      status: "Crew Assigned & Verified",
    },
  ]);

  const basePrice = cruiseType === "overnight" ? cruiseData.overnightRate : cruiseData.dayCruiseRate;
  const karimeenCost = karimeenSpecialAddon ? 1200 : 0;
  const candleCost = candlelightDinnerAddon ? 1500 : 0;
  const totalAmount = basePrice + karimeenCost + candleCost;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("houseboat_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "houseboat_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Houseboat Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("houseboat_cruise_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "houseboat_cruise_management"
                ? "bg-cyan-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>2. Cruise &amp; Kettuvallam Setup</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_houseboat_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_houseboat_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Customer Cruise Booking</span>
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
            <span>4. Cruise Roster &amp; Chef Desk</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          Vertical: Kerala Backwaters &amp; Kettuvallams
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. HOUSEBOAT REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "houseboat_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Houseboat Operator App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Kerala Port Dept. Kettuvallam License &amp; Safety Accreditation
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                PORT CERTIFIED HOUSEBOAT
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Vessel Profile", desc: "Kettuvallam Fleet & Base" },
                { step: 2, title: "Port Department License", desc: "Kerala Inland Vessel Rules" },
                { step: 3, title: "Crew & Safety Equipment", desc: "Licensed Captain & Chef" },
                { step: 4, title: "Settlement Account", desc: "T+1 Daily Bank Wire" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-cyan-500/20 border-cyan-500/80 text-cyan-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-cyan-400 font-bold">Step 0{s.step}</div>
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
                    <label className="block text-slate-400 mb-1 font-semibold">Houseboat Company Name</label>
                    <input
                      type="text"
                      value={boatOwnerData.agencyName}
                      onChange={(e) => setBoatOwnerData({ ...boatOwnerData, agencyName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Managing Master Captain</label>
                    <input
                      type="text"
                      value={boatOwnerData.captainName}
                      onChange={(e) => setBoatOwnerData({ ...boatOwnerData, captainName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Port Dept. Registration No.</label>
                    <input
                      type="text"
                      value={boatOwnerData.portLicense}
                      onChange={(e) => setBoatOwnerData({ ...boatOwnerData, portLicense: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Backwater Cruise Circuits</label>
                    <input
                      type="text"
                      value={boatOwnerData.cruiseRoutes}
                      onChange={(e) => setBoatOwnerData({ ...boatOwnerData, cruiseRoutes: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Finishing Point Jetty Dock Address</label>
                    <input
                      type="text"
                      value={boatOwnerData.dockAddress}
                      onChange={(e) => setBoatOwnerData({ ...boatOwnerData, dockAddress: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Bank Settlement Account (T+1 Automated Wire):</span>
                  <span className="text-emerald-400 font-mono font-bold">{boatOwnerData.bankName} (A/C: {boatOwnerData.accountNumber})</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Automated daily payouts. Platform fee: 7.0% on completed houseboat stays with verified guest reviews.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. HOUSEBOAT CRUISE MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "houseboat_cruise_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Kettuvallam Cruise &amp; Itinerary Management
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Bedroom Specs, Lake Route Itinerary, Chef Menu &amp; Rates
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-400">
                Vessel: Royal Glass-AC Kettuvallam #02
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Houseboat Model &amp; Grade</label>
                <input
                  type="text"
                  value={cruiseData.cruiseName}
                  onChange={(e) => setCruiseData({ ...cruiseData, cruiseName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Bedrooms &amp; Capacity</label>
                <input
                  type="text"
                  value={cruiseData.guestCapacity}
                  onChange={(e) => setCruiseData({ ...cruiseData, guestCapacity: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Overnight Stay Rate (₹)</label>
                <input
                  type="number"
                  value={cruiseData.overnightRate}
                  onChange={(e) => setCruiseData({ ...cruiseData, overnightRate: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Day Cruise Rate (₹)</label>
                <input
                  type="number"
                  value={cruiseData.dayCruiseRate}
                  onChange={(e) => setCruiseData({ ...cruiseData, dayCruiseRate: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Onboard Crew Team</label>
                <input
                  type="text"
                  value={cruiseData.crewOnboard}
                  onChange={(e) => setCruiseData({ ...cruiseData, crewOnboard: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-slate-400 mb-1 font-semibold">Traditional Gourmet Meal Plan</label>
                <input
                  type="text"
                  value={cruiseData.mealPlan}
                  onChange={(e) => setCruiseData({ ...cruiseData, mealPlan: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Lake Route &amp; Overnight Docking Timings:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                Check-in 12:00 PM at Finishing Point Alleppey &bull; Scenic cruise through Vembanad Lake &bull; Docking at 05:30 PM (as per Kerala Govt Inland Fishing Regulations) &bull; Morning Cruise 07:30 AM &bull; Check-out 09:00 AM.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. CUSTOMER HOUSEBOAT BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_houseboat_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Book Private Houseboat, Traditional Sadya &amp; Sunset Lake Cruise
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold flex items-center gap-1">
                ★ 4.96 Rating (2,840 Stays)
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Cruise Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCruiseType("overnight")}
                    className={`w-1/2 py-2 rounded-xl text-2xs font-bold transition-all ${
                      cruiseType === "overnight"
                        ? "bg-cyan-600 text-white shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Overnight Stay
                  </button>
                  <button
                    onClick={() => setCruiseType("dayCruise")}
                    className={`w-1/2 py-2 rounded-xl text-2xs font-bold transition-all ${
                      cruiseType === "dayCruise"
                        ? "bg-cyan-600 text-white shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Day Cruise
                  </button>
                </div>
              </div>
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
                <label className="block text-slate-400 mb-1 font-semibold">Guests Count</label>
                <input
                  type="number"
                  value={guestAdults}
                  onChange={(e) => setGuestAdults(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Candlelight Dinner Addon</label>
                <button
                  onClick={() => setCandlelightDinnerAddon(!candlelightDinnerAddon)}
                  className={`w-full py-2 rounded-xl font-bold transition-all text-xs ${
                    candlelightDinnerAddon
                      ? "bg-cyan-600 text-white shadow-md"
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  {candlelightDinnerAddon ? "✓ Candlelight Setup (+₹1,500)" : "+ Add Candlelight Dinner"}
                </button>
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Royal 2-Bedroom Luxury Kettuvallam (Private Houseboat)</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-3xs font-extrabold uppercase">
                      {cruiseType === "overnight" ? "Overnight (12PM - 9AM)" : "Day Cruise (11AM - 5PM)"}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    {guestAdults} Guests &bull; Private Chef &bull; All Gourmet Meals (Lunch, Dinner &amp; Breakfast) &bull; Upper Glass Sun-Deck AC
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Cruise Package (All Meals Included)</span>
                  <span className="text-lg font-black text-white">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant Houseboat Booking Voucher &bull; Certified Port Master on Deck
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Houseboat Booking Confirmed!\nBooking Ref: HB-KERALA-8819\nRoyal Kettuvallam #02 Reserved.\nPrivate Chef Biju notified."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalAmount.toLocaleString()} &amp; Book Houseboat</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Houseboat Reserved: HB-KERALA-8819 &bull; Boarding at Finishing Point Dock #4
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      RESERVED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Check-in on 24 Sep 2026 at 12:00 PM. Master Captain Mathew will welcome you at the jetty.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. HOUSEBOAT OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Houseboat Cruise Roster &amp; Chef Desk
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Today's Cruisers, Chef Provision Orders &amp; Lake Berthing Clearances
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: Alleppey Punnamada Jetty
              </span>
            </div>

            <div className="space-y-3">
              {cruiseBookings.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.guest}</span>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-3xs">{item.id}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.boatName} &bull; <span className="text-white font-semibold">{item.date}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.chefAssigned} &bull; {item.meals} &bull; {item.fare}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`Boarding pass & Chef Menu sent for ${item.id}!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Issue Cruise Pass
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
                  Houseboat Port &amp; Lake Navigation Microservices
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Inland Waterways Port Sync, Fresh Chef Provision Ledger &amp; Night Berthing Lock
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Specialized marine services coordinating Kerala Port Department safety inspections, lake environmental quotas, and automated crew revenue distribution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Kerala Port Dept & Inland Waterways Sync",
                desc: "Validates annual vessel survey certificates, master driver competency licenses, and pollution clearance levels.",
                icon: Anchor,
              },
              {
                title: "Vembanad Lake Berthing & Docking Mutex",
                desc: "Allocates authorized night mooring stations along R-Block and Kainakary to ensure environmental non-disturbance.",
                icon: Waves,
              },
              {
                title: "Traditional Chef Kitchen Provision Tracker",
                desc: "Automates morning fresh Karimeen, Tiger Prawn, and organic Kerala Matta rice provision dispatch to boat kitchens.",
                icon: Coffee,
              },
              {
                title: "Marine Life Safety & SOS Dispatch",
                desc: "Monitors onboard lifebuoys, certified lifejackets, and automated GPS panic transponders linked to coastal police.",
                icon: ShieldCheck,
              },
              {
                title: "Dynamic Seasonal Monsoon Pricing Engine",
                desc: "Calculates peak Nehru Trophy Boat Race premiums and high-demand winter honeymoon tariffs dynamically.",
                icon: DollarSign,
              },
              {
                title: "T+1 Daily Operator Payout Ledger",
                desc: "Deducts 7.0% platform fee and disburses net earnings directly to houseboat owner and crew gratuity accounts.",
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
                  Admin Panel &bull; Kerala Houseboat Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Vessel Port Inspections, Chef Hygiene Audits &amp; Platform GMV
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: backwaters_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Certified Houseboats</span>
                <span className="text-sm font-black text-white">320 Port-Approved Cruisers</span>
                <span className="text-3xs text-emerald-400 block">Across Alleppey &amp; Kumarakom</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Houseboat GMV</span>
                <span className="text-sm font-black text-cyan-400">₹1,85,00,000</span>
                <span className="text-3xs text-slate-400 block">7.0% Platform Commission</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Backwater Stays Completed</span>
                <span className="text-sm font-black text-emerald-400">14,200 Happy Guests</span>
                <span className="text-3xs text-slate-400 block">100% Water Safety Record</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
