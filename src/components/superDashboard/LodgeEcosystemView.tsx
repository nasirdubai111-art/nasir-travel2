import React, { useState } from "react";
import {
  Home,
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
  Radio,
  Coffee,
  ShoppingBag,
  Plus,
  Minus,
  Bed,
  Trees,
  Compass,
  Star,
  CheckSquare,
} from "lucide-react";

type LodgeSubView =
  | "lodge_registration"
  | "lodge_booking"
  | "lodge_partner_management"
  | "backend_modules"
  | "admin_console";

export function LodgeEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<LodgeSubView>("lodge_registration");

  // Registration states
  const [regStep, setRegStep] = useState(1);
  const [lodgeData, setLodgeData] = useState({
    name: "Corbett Wilderness Eco-Lodge & Safari Haven",
    owner: "Uttarakhand Eco-Tourism & Wildlife Homestays LLP",
    contactPerson: "Mahesh Rawat & Anupama Rawat",
    mobile: "+91 5947-284-910",
    email: "wildlife@corbett-ecolodge.in",
    address: "Dhikala Gate Eco-Zone, Village Kyari, Ramnagar, Uttarakhand 244715",
    gpsLocation: "29.3962° N, 79.1302° E",
    nearbyLandmark: "Near Kosi River Suspension Bridge & Corbett Forest Entry Gate",
    category: "Eco-Certified Wildlife & Forest Lodge",
    checkInTime: "01:00 PM (13:00 hrs)",
    checkOutTime: "11:00 AM (11:00 hrs)",
    facilities: [
      "Solar Water Heating & 24/7 Power Backup",
      "Organic Village-Style Farm Buffet Included",
      "Nightly Campfire with Folk Music & Stargazing",
      "Onsite Wildlife Naturalist & Bird Watching Trails",
      "High-Speed Satellite Wi-Fi in Lounge Area",
      "Free 4x4 Gypsy Parking on Premises",
    ],
    fssaiLicense: "12619004000182 (State Organic Kitchen FSSAI)",
    gstin: "05AAGCR8819L1Z2",
    bankName: "State Bank of India (Ramnagar Branch)",
    accountNumber: "389201948210",
    ifsc: "SBIN0000708",
  });

  // Customer Booking state
  const [destination, setDestination] = useState("Jim Corbett National Park, Uttarakhand");
  const [checkInDate, setCheckInDate] = useState("2026-10-04");
  const [checkOutDate, setCheckOutDate] = useState("2026-10-07");
  const [guestCount, setGuestCount] = useState(2);
  const [cottageCount, setCottageCount] = useState(1);
  const [selectedCottage, setSelectedCottage] = useState("Kosi Riverfront Wooden Eco-Cottage");
  const [safariAddon, setSafariAddon] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Partner Management Mock Bookings
  const [checkInList, setCheckInList] = useState([
    {
      id: "LDG-RES-8821",
      guest: "Dr. Arvind Sharma (2 Adults)",
      cottage: "Cottage #04 (Riverfront Wooden)",
      dates: "04 Oct - 07 Oct (3 Nights)",
      safariZone: "Bijrani Zone (Morning 06:00 AM)",
      status: "Confirmed (Advance Paid)",
      roomAllocated: "Room 104 Assigned",
    },
    {
      id: "LDG-RES-8822",
      guest: "Rohan & Sneha Kapoor (2 Adults)",
      cottage: "Swiss Safari Tent #02",
      dates: "05 Oct - 07 Oct (2 Nights)",
      safariZone: "Jhirna Zone (Evening 14:30 PM)",
      status: "Confirmed (All Meals AP)",
      roomAllocated: "Tent 202 Ready",
    },
  ]);

  const cottageRate = 4200;
  const safariRate = safariAddon ? 4500 : 0;
  const nights = 3;
  const subtotal = cottageRate * nights + safariRate;
  const taxes = Math.round(subtotal * 0.12);
  const grandTotal = subtotal + taxes;

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("lodge_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "lodge_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Lodge Registration (Partner)</span>
          </button>

          <button
            onClick={() => setActiveSubView("lodge_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "lodge_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>2. Lodge Booking (Customer)</span>
          </button>

          <button
            onClick={() => setActiveSubView("lodge_partner_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "lodge_partner_management"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>3. Partner Booking Management</span>
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
            <span>4. Backend Modules (Hidden)</span>
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
            <span>5. Admin Console</span>
          </button>
        </div>

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Vertical: Eco-Lodge &amp; Safari Homestays
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. LODGE REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "lodge_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Lodge Partner App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Eco-Lodge Onboarding, Safari Cabins &amp; Inventory Management
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED WILDLIFE ECO-LODGE
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Lodge & Eco-Zone", desc: "Coordinates, River, Forest" },
                { step: 2, title: "Cottages & Safari Tents", desc: "Capacity, Wooden, Stone" },
                { step: 3, title: "Meal Plans & Safari Coordination", desc: "Organic, Gypsy Permits" },
                { step: 4, title: "KYC & Payout Account", desc: "GSTIN, Forest Compliance" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-amber-400 font-bold">Step 0{s.step}</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{s.title}</div>
                  <div className="text-3xs text-slate-400">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Step 1 */}
            {regStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Lodge Name</label>
                    <input
                      type="text"
                      value={lodgeData.name}
                      onChange={(e) => setLodgeData({ ...lodgeData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Owner / LLP Details</label>
                    <input
                      type="text"
                      value={lodgeData.owner}
                      onChange={(e) => setLodgeData({ ...lodgeData, owner: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Category</label>
                    <input
                      type="text"
                      value={lodgeData.category}
                      onChange={(e) => setLodgeData({ ...lodgeData, category: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Forest &amp; River Address</label>
                  <textarea
                    rows={2}
                    value={lodgeData.address}
                    onChange={(e) => setLodgeData({ ...lodgeData, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {regStep === 2 && (
              <div className="space-y-4 text-xs">
                <span className="font-bold text-slate-300 block">Available Cottage &amp; Glamping Types:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      name: "Kosi Riverfront Wooden Eco-Cottage",
                      bed: "King Bed",
                      capacity: "2 Adults + 1 Child",
                      price: 4200,
                      units: 6,
                    },
                    {
                      name: "Luxury Forest Safari Swiss Tent",
                      bed: "Double Bed + Climate Control",
                      capacity: "2 Adults",
                      price: 3499,
                      units: 5,
                    },
                    {
                      name: "Wild Canopy Family Treehouse",
                      bed: "2 Queen Beds",
                      capacity: "4 Adults or Family",
                      price: 7800,
                      units: 2,
                    },
                  ].map((room, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{room.name}</span>
                        <span className="font-black text-amber-400">₹{room.price}/n</span>
                      </div>
                      <div className="text-3xs text-slate-400 space-y-1">
                        <div>Bed: {room.bed}</div>
                        <div>Capacity: {room.capacity}</div>
                        <div className="text-emerald-400 font-bold">Total Inventory: {room.units} Cottages</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 & 4 summary */}
            {regStep >= 3 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Forest Department &amp; Bank Settlement Compliance:</span>
                  <span className="text-emerald-400 font-mono font-bold">Uttarakhand Forest Dept. Registered</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Bi-weekly automated payouts on the 1st and 15th of each month directly to {lodgeData.bankName} (A/C: {lodgeData.accountNumber}). Flat 6.5% platform commission.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. LODGE BOOKING — CUSTOMER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "lodge_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Eco-Lodge Reservation, Organic Meals &amp; Wildlife Gypsy Safari Add-on
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400">
                Destination: Jim Corbett
              </span>
            </div>

            {/* Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Location / Forest Zone</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Stay Dates (3 Nights)</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  />
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Guests &amp; Cottages</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                  <input
                    type="number"
                    value={cottageCount}
                    onChange={(e) => setCottageCount(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Safari Permit Coordination</label>
                <button
                  onClick={() => setSafariAddon(!safariAddon)}
                  className={`w-full py-2 rounded-xl font-bold transition-all ${
                    safariAddon
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  {safariAddon ? "✓ Gypsy Safari Included (+₹4,500)" : "+ Add Open 4x4 Gypsy Safari"}
                </button>
              </div>
            </div>

            {/* Lodge Booking Bill Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Corbett Wilderness Eco-Lodge &amp; Safari Haven</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-extrabold">
                      ★ 4.82 (890 Reviews)
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Dhikala Gate Zone &bull; Kosi Riverfront Wooden Cottage &bull; All Organic Farm Meals (AP Plan)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Stay &amp; Safari</span>
                  <span className="text-lg font-black text-white">₹{grandTotal}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Free Naturalist Tour &amp; Nightly Campfire Included.
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Eco-Lodge Reservation Confirmed!\nLodge: Corbett Wilderness Eco-Lodge\nPermit Pass: LDG-CORBETT-8821\nInstant Forest Check-In QR Generated."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{grandTotal} &amp; Confirm Forest Stay</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Wildlife Lodge Booking Confirmed &bull; Pass: LDG-CORBETT-8821
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      PERMIT LOCKED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Your cottage and Bijrani Zone 4x4 Gypsy Safari are confirmed for 04 Oct - 07 Oct 2026.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. LODGE PARTNER BOOKING MANAGEMENT */}
      {/* ======================================================================= */}
      {activeSubView === "lodge_partner_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Lodge Partner Dashboard
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Today's Guest Check-ins, Room Allocations &amp; Safari Gypsy Roster
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Lodge Desk: Corbett Eco-Lodge
              </span>
            </div>

            <div className="space-y-3">
              {checkInList.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.guest}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-3xs">{item.id}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.cottage} &bull; {item.dates} &bull; <span className="text-emerald-400 font-bold">{item.safariZone}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.roomAllocated}
                    </span>
                    <button
                      onClick={() => alert(`Guest ${item.guest} checked in successfully!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Process Check-in
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. BACKEND MODULES — NEVER DISPLAYED */}
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
                  Eco-Lodge Backend Infrastructure
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Forest Permit Quotas, Eco-Tax Clearing &amp; Settlement Architecture
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Internal microservices managing forest department quota locks, biometric entry authorizations, and partner commission disbursements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Lodge & Cottage Inventory Service",
                desc: "Controls cottage availability calendars and seasonal forest sanctuary closures.",
                icon: Home,
              },
              {
                title: "Forest Department Safari Coordination",
                desc: "Automates online permit booking with state wildlife board APIs for gypsy slots.",
                icon: Compass,
              },
              {
                title: "Eco-Tax & Municipal Fee Engine",
                desc: "Computes local green cess and forest protection statutory pass-through fees.",
                icon: Trees,
              },
              {
                title: "Settlement & Partner Disbursement Ledger",
                desc: "Processes 6.5% platform fee deduction and bi-weekly NEFT transfers to lodge accounts.",
                icon: CreditCard,
              },
              {
                title: "Guest KYC & Forest Permit Vault",
                desc: "Encrypted storage for Aadhaar/Passport documents required for national park checkposts.",
                icon: ShieldCheck,
              },
              {
                title: "Review, Rating & Forest Safety Monitor",
                desc: "Monitors naturalist compliance and emergency wildlife response readiness logs.",
                icon: Star,
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
      {/* 5. ADMIN CONSOLE */}
      {/* ======================================================================= */}
      {activeSubView === "admin_console" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Admin Panel &bull; Eco-Tourism Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Lodge Approvals, Wildlife Permit Audits &amp; Bi-Weekly Financial Ledgers
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: ecotourism_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Active Verified Eco-Lodges</span>
                <span className="text-sm font-black text-white">186 Wildlife &amp; Forest Lodges</span>
                <span className="text-3xs text-emerald-400 block">Across 22 Tiger Reserves &amp; Hills</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Lodge Gross GMV</span>
                <span className="text-sm font-black text-amber-400">₹68,00,000</span>
                <span className="text-3xs text-slate-400 block">6.5% Platform Brokerage</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Net Partner Payouts Cleared</span>
                <span className="text-sm font-black text-emerald-400">₹63,58,000</span>
                <span className="text-3xs text-slate-400 block">Bi-Weekly 1st &amp; 15th Clearing</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
