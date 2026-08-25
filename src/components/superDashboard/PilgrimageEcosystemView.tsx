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
  Sun,
  Flame,
  Bookmark,
  Bell,
  Star,
  CheckSquare,
} from "lucide-react";

type PilgrimageSubView =
  | "pilgrimage_registration"
  | "pilgrimage_package_management"
  | "customer_pilgrimage_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function PilgrimageEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<PilgrimageSubView>(
    "pilgrimage_package_management"
  );

  // Registration form state
  const [regStep, setRegStep] = useState(1);
  const [orgData, setOrgData] = useState({
    orgName: "Divya Darshan Yatra Samiti & Pilgrimage Services",
    ownerName: "Pandit Radhe Shyam Shastri & Acharya Mukund Vyas",
    mobile: "+91 98201-44910",
    email: "yatra@divyadarshan.org.in",
    officeAddress: "402, Gita Bhawan Marg, Near Triveni Ghat, Rishikesh, Uttarakhand 249201",
    serviceLocations: "Haridwar, Rishikesh, Badrinath, Kedarnath, Varanasi, Ayodhya, Tirupati, Puri",
    specialization: "Char Dham Yatra, 12 Jyotirlinga Darshan, Vaishno Devi, South India Temple Circuits",
    panNumber: "AABCD8821K",
    gstin: "05AABCD8821K1Z5",
    bankName: "Punjab National Bank (Rishikesh Branch)",
    accountNumber: "401928301928",
    ifsc: "PUNB0029100",
  });

  // Yatra package creation state
  const [packageData, setPackageData] = useState({
    packageName: "Sacred Char Dham Yatra (Kedarnath & Badrinath Deluxe Yatra)",
    destination: "Uttarakhand Himalaya (Kedarnath - Badrinath - Rishikesh)",
    temples: "Kedarnath Jyotirlinga, Badrinath Temple, Guptkashi, Joshimath, Mana Village",
    duration: "7 Days / 6 Nights",
    startDate: "2026-09-15",
    endDate: "2026-09-21",
    departure: "Haridwar Railway Station / Dehradun Airport (06:00 AM)",
    arrival: "Haridwar ISBT / Dehradun Drop (18:00 PM)",
    hotelDetails: "Deluxe Himalayan Pilgrim Guest Houses & Swiss Cottage Camp at Guptkashi",
    transport: "2x2 Deluxe Push-Back Air-Suspension Coach & Dedicated 4x4 Mountain Jeeps",
    meals: "Pure Satvik Vegetarian Meals (Breakfast, Lunch, High-Tea & Dinner - No Onion No Garlic)",
    guide: "Vedic Scholar Guide & Govt. Certified Mountain Yatra Marshal",
    darshanPass: "VIP Darshan & Helipad Priority Boarding Pass Included",
    groupCapacity: 35,
    adultPrice: 18500,
    childPrice: 12500,
    cancellation: "Full refund before 15 days of departure; 50% refund between 7-14 days.",
  });

  // Customer booking state
  const [searchQuery, setSearchQuery] = useState("Kedarnath Badrinath Yatra");
  const [travelDate, setTravelDate] = useState("2026-09-15");
  const [paxAdults, setPaxAdults] = useState(2);
  const [paxSeniors, setPaxSeniors] = useState(2);
  const [specialDarshanAddon, setSpecialDarshanAddon] = useState(true);
  const [helicopterAddon, setHelicopterAddon] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Booking management mock data
  const [yatraBookings, setYatraBookings] = useState([
    {
      id: "YATRA-2026-8819",
      leader: "Devendra Narayan Agarwal (4 Pax)",
      packageName: "Char Dham Yatra Deluxe (Kedarnath & Badrinath)",
      passengers: "2 Adults + 2 Senior Citizens (Wheelchair required at Badrinath)",
      transportSeat: "Coach A - Seats 12, 13, 14, 15",
      roomAllocated: "Guptkashi Room 204 & 205 (Ground Floor)",
      guideAssigned: "Pandit Mukund Vyas (Marshal #04)",
      darshanSlot: "Kedarnath VIP 07:30 AM Slot Cleared",
      status: "Confirmed (Full Advance Paid)",
    },
    {
      id: "YATRA-2026-8820",
      leader: "Shrikant & Suniti Kulkarni (2 Pax)",
      packageName: "Kashi Vishwanath & Ayodhya Ram Mandir Darshan",
      passengers: "2 Adults (Pure Satvik Jain Meals)",
      transportSeat: "Coach B - Seats 05, 06",
      roomAllocated: "Varanasi Heritage Yatra Niwas (Room 108)",
      guideAssigned: "Acharya Shastri (Marshal #02)",
      darshanSlot: "Ayodhya Ram Mandir Sugam Darshan Pass #892",
      status: "Confirmed (Advance Paid)",
    },
  ]);

  const totalSeats = paxAdults + paxSeniors;
  const baseRate = packageData.adultPrice * totalSeats;
  const heliFee = helicopterAddon ? 8500 * totalSeats : 0;
  const vipFee = specialDarshanAddon ? 1500 * totalSeats : 0;
  const totalAmount = baseRate + heliFee + vipFee;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("pilgrimage_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "pilgrimage_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Operator Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("pilgrimage_package_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "pilgrimage_package_management"
                ? "bg-orange-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>2. Yatra Package Management</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_pilgrimage_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_pilgrimage_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>3. Customer Yatra Booking</span>
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
            <span>4. Operator Booking Management</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30">
          Vertical: Sacred Pilgrimage &amp; Yatra
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. OPERATOR REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "pilgrimage_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  Pilgrimage Operator App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Pilgrimage Agency Onboarding &amp; Temple Board Accreditation
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CERTIFIED YATRA OPERATOR
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Agency & Specialization", desc: "Char Dham, Jyotirlinga" },
                { step: 2, title: "Office & Contact Info", desc: "Rishikesh, Haridwar, Kashi" },
                { step: 3, title: "KYC, GST & Temple Permits", desc: "BKTC / Shrine Board" },
                { step: 4, title: "Settlement Bank Account", desc: "Automated Payouts" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-orange-500/20 border-orange-500/80 text-orange-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-orange-400 font-bold">Step 0{s.step}</div>
                  <div className="text-xs font-bold text-white line-clamp-1">{s.title}</div>
                  <div className="text-3xs text-slate-400">{s.desc}</div>
                </button>
              ))}
            </div>

            {/* Form Step */}
            {regStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Agency / Trust Name</label>
                    <input
                      type="text"
                      value={orgData.orgName}
                      onChange={(e) => setOrgData({ ...orgData, orgName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Authorized Representative</label>
                    <input
                      type="text"
                      value={orgData.ownerName}
                      onChange={(e) => setOrgData({ ...orgData, ownerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Pilgrimage Specialization</label>
                    <input
                      type="text"
                      value={orgData.specialization}
                      onChange={(e) => setOrgData({ ...orgData, specialization: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Operating Yatra Circuits</label>
                    <input
                      type="text"
                      value={orgData.serviceLocations}
                      onChange={(e) => setOrgData({ ...orgData, serviceLocations: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Office Address</label>
                    <input
                      type="text"
                      value={orgData.officeAddress}
                      onChange={(e) => setOrgData({ ...orgData, officeAddress: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Shri Badrinath Kedarnath Temple Committee (BKTC) ID:</span>
                  <span className="text-emerald-400 font-mono font-bold">BKTC-REG-UTT-881920</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Bank Settlement: {orgData.bankName} (A/C: {orgData.accountNumber} • IFSC: {orgData.ifsc}). Automated weekly reconciliation. Flat 5.0% platform fee.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. PILGRIMAGE / YATRA PACKAGE MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "pilgrimage_package_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  Yatra Package Creation &amp; Management
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Sacred Route, Temple Darshan Slots, Luxury Coach &amp; Dharamshala Setup
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400">
                Active Package: Char Dham Yatra
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Package Title</label>
                <input
                  type="text"
                  value={packageData.packageName}
                  onChange={(e) => setPackageData({ ...packageData, packageName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Yatra Duration</label>
                <input
                  type="text"
                  value={packageData.duration}
                  onChange={(e) => setPackageData({ ...packageData, duration: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-slate-400 mb-1 font-semibold">Temples &amp; Sacred Sites Included</label>
                <input
                  type="text"
                  value={packageData.temples}
                  onChange={(e) => setPackageData({ ...packageData, temples: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Start Date</label>
                <input
                  type="date"
                  value={packageData.startDate}
                  onChange={(e) => setPackageData({ ...packageData, startDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">End Date</label>
                <input
                  type="date"
                  value={packageData.endDate}
                  onChange={(e) => setPackageData({ ...packageData, endDate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Group Seat Capacity</label>
                <input
                  type="number"
                  value={packageData.groupCapacity}
                  onChange={(e) => setPackageData({ ...packageData, groupCapacity: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Price per Adult (₹)</label>
                <input
                  type="number"
                  value={packageData.adultPrice}
                  onChange={(e) => setPackageData({ ...packageData, adultPrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Price per Senior / Child (₹)</label>
                <input
                  type="number"
                  value={packageData.childPrice}
                  onChange={(e) => setPackageData({ ...packageData, childPrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Vedic Guide &amp; Marshal</label>
                <input
                  type="text"
                  value={packageData.guide}
                  onChange={(e) => setPackageData({ ...packageData, guide: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Day-by-Day Sacred Itinerary &amp; Meal Protocol:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                Day 1: Haridwar to Guptkashi (Scenic Mandakini River drive). Day 2: Guptkashi to Kedarnath (Helicopter / Trek &amp; Evening Aarti). Day 3: Morning Kedarnath Darshan &amp; Return to Guptkashi. Day 4: Guptkashi to Badrinath via Joshimath. Day 5: Badrinath Temple Darshan, Mana Village &amp; Saraswati River. Day 6: Badrinath to Rishikesh. Day 7: Ganga Aarti &amp; Departure.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. CUSTOMER PILGRIMAGE BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_pilgrimage_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Book Sacred Yatra, VIP Darshan Slots &amp; Satvik Dining
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-orange-500/20 text-orange-300 border border-orange-500/30 text-xs font-mono font-bold flex items-center gap-1">
                ★ 4.96 Rating (4,280 Pilgrims)
              </span>
            </div>

            {/* Search inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pilgrimage Destination</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Yatra Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pilgrims (Adults / Seniors)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={paxAdults}
                    onChange={(e) => setPaxAdults(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                  <input
                    type="number"
                    value={paxSeniors}
                    onChange={(e) => setPaxSeniors(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Helicopter Yatra Addon</label>
                <button
                  onClick={() => setHelicopterAddon(!helicopterAddon)}
                  className={`w-full py-2 rounded-xl font-bold transition-all text-xs ${
                    helicopterAddon
                      ? "bg-orange-600 text-white shadow-md"
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  {helicopterAddon ? "✓ Kedarnath Heli (+₹8,500/pax)" : "+ Add Helipad Priority"}
                </button>
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Sacred Char Dham Yatra (Kedarnath &amp; Badrinath)</span>
                    <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-3xs font-extrabold">
                      7D/6N Deluxe
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    {totalSeats} Pilgrims &bull; Deluxe Coach &bull; All Pure Satvik Meals &bull; Vedic Guide &bull; VIP Sugam Darshan
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Yatra Fare (All Inclusive)</span>
                  <span className="text-lg font-black text-white">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Includes Medical Oxygen Support &amp; Emergency Mountain Escort.
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Sacred Yatra Booking Confirmed!\nBooking Ref: YATRA-2026-8819\nVIP Darshan E-Pass Generated\nBiometric Registration Verified."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalAmount.toLocaleString()} &amp; Confirm Yatra</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Yatra Pass Issued: YATRA-2026-8819 &bull; Kedarnath VIP Pass #KD-9912
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      DARSHAN CONFIRMED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Departure from Haridwar on 15 Sep 2026 at 06:00 AM. Guide Pandit Mukund Vyas will receive you at Haridwar Railway Station.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Pilgrimage Operator Operations Desk
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Yatra Batches, Coach Seat Allocations &amp; Temple Darshan Rosters
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: Haridwar &amp; Rishikesh Base
              </span>
            </div>

            <div className="space-y-3">
              {yatraBookings.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.leader}</span>
                      <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-3xs">{item.id}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.packageName} &bull; <span className="text-white font-semibold">{item.passengers}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.transportSeat} &bull; {item.roomAllocated} &bull; {item.darshanSlot}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`Boarding pass sent to ${item.leader} via WhatsApp & SMS!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Issue Yatra Kit
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
                  Pilgrimage Core Microservices Architecture
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Shrine Board GDS Sync, Biometric Tokenization &amp; Group Ledger Vault
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              High-concurrency backend services orchestrating temple darshan pass allocations, high-altitude medical clearance registries, and partner escrow settlements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Shrine Board & BKTC VIP GDS Connector",
                desc: "Direct integration with Kedarnath, Badrinath, Tirupati, and Vaishno Devi boards for real-time Sugam darshan pass issuance.",
                icon: Sun,
              },
              {
                title: "Helipad Priority Slot Allocation Engine",
                desc: "Manages aviation quota sync with Himalayan Heli operators across Guptkashi, Phata, and Sersi helipads.",
                icon: Compass,
              },
              {
                title: "Group Seat & Dharamshala Inventory Mutex",
                desc: "Atomic locks on pushback coach seats, mountain jeeps, and sacred ashram guest suites during high-demand festival batches.",
                icon: Database,
              },
              {
                title: "Biometric KYC & Medical Oxygen Clearance",
                desc: "Encrypted storage for Aadhaar e-KYC and mandatory high-altitude medical fitness certificates.",
                icon: ShieldCheck,
              },
              {
                title: "Vedic Guide & Yatra Marshal Dispatcher",
                desc: "Live GPS dispatch tracking of mountain guides, emergency medical kits, and satellite communication transceivers.",
                icon: UserCheck,
              },
              {
                title: "Settlement & Escrow Disbursement Service",
                desc: "5.0% platform fee deduction and automated bank clearing upon successful completion of yatra milestones.",
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
                  Admin Panel &bull; Sacred Yatra Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Operator Approvals, Temple Quota Audit &amp; High-Altitude Safety Monitoring
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: yatra_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Accredited Pilgrimage Operators</span>
                <span className="text-sm font-black text-white">412 Certified Yatra Samitis</span>
                <span className="text-3xs text-emerald-400 block">Across 64 Sacred Circuits</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Yatra Gross GMV</span>
                <span className="text-sm font-black text-orange-400">₹1,42,00,000</span>
                <span className="text-3xs text-slate-400 block">5.0% Platform Brokerage</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Pilgrims Facilitated This Season</span>
                <span className="text-sm font-black text-emerald-400">38,400 Devotees</span>
                <span className="text-3xs text-slate-400 block">100% Medical Safety Record</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
