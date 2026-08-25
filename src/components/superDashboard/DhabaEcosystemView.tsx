import React, { useState } from "react";
import {
  Utensils,
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
  Truck,
  Car,
  Navigation,
  Star,
  Layers,
} from "lucide-react";

type DhabaSubView =
  | "dhaba_registration"
  | "customer_dhaba_booking"
  | "backend_modules"
  | "admin_console";

export function DhabaEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<DhabaSubView>("dhaba_registration");

  // Registration step state
  const [dhabaStep, setDhabaStep] = useState(1);
  const [dhabaForm, setDhabaForm] = useState({
    name: "Haveli Grand Heritage Dhaba & Family Highway Retreat",
    ownerName: "Sardar Gurpreet Singh & Brothers",
    mobile: "+91 98120 44891",
    email: "contact@havelidhabamurthal.in",
    fullAddress: "NH-44, Milestone 52, G.T. Road, Murthal, Sonipat, Haryana 131027",
    gpsLocation: "29.0289° N, 77.0721° E",
    highwayRoute: "NH-44 (Delhi - Panipat - Chandigarh Express Corridor)",
    nearbyLandmark: "Opposite Rajiv Gandhi Education City Gate",
    timings: "Open 24 Hours / 7 Days Non-Stop",
    cuisineType: "Authentic North Indian, Punjabi, Desi Ghee Tandoor, Pure Vegetarian",
    seatingCapacity: "450 Guests (Indoor AC Hall + Outdoor Heritage Baithak)",
    parking: "Free Valet Parking for 200+ Cars & 15 Tourist Buses",
    washrooms: "Clean Sanitized Restrooms with Baby Changing & Wheelchair Access",
    familySeating: "Dedicated Family Enclosures with Traditional Charpai Seating",
    acType: "Central Air Conditioned Heritage Dining Halls + Open Air Garden",
    fssaiLicense: "10818018000214 (Central 14-Digit FSSAI License)",
    gstin: "06AAGCH8812L1Z9",
    bankName: "HDFC Bank Ltd.",
    accountNumber: "50200088192014",
    ifsc: "HDFC0001248",
    approvalStatus: "Verified & Active (Tier 1 Highway Partner)",
  });

  // Customer Dhaba Booking state
  const [routeSearch, setRouteSearch] = useState("Delhi to Chandigarh (NH-44)");
  const [selectedDhaba, setSelectedDhaba] = useState("Haveli Grand Heritage Dhaba");
  const [diningMode, setDiningMode] = useState<"dine_in" | "takeaway">("dine_in");
  const [guestCount, setGuestCount] = useState(4);
  const [diningDate, setDiningDate] = useState("2026-08-28");
  const [diningTimeSlot, setDiningTimeSlot] = useState("13:30 PM (Lunch Stop)");
  const [preOrderItems, setPreOrderItems] = useState([
    { name: "Special Amritsari Aloo Pyaaz Paratha with White Makkhan", price: 180, qty: 3, veg: true },
    { name: "Paneer Butter Masala (Pure Desi Ghee Preparation)", price: 340, qty: 1, veg: true },
    { name: "Dal Makhani Handi Slow-Cooked Overnight", price: 290, qty: 1, veg: true },
    { name: "Tandoori Butter Naan & Laccha Paratha Basket", price: 120, qty: 2, veg: true },
    { name: "Kulhad Sweet Lassi with Malai & Dry Fruits", price: 110, qty: 4, veg: true },
  ]);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [couponCode, setCouponCode] = useState("HIGHWAY10");
  const [couponApplied, setCouponApplied] = useState(true);

  const subtotal = preOrderItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const gst = Math.round((subtotal - discount) * 0.05);
  const grandTotal = subtotal - discount + gst;

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Ribbon for Dhaba Vertical */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("dhaba_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "dhaba_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Dhaba Registration (Frontend)</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_dhaba_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_dhaba_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>2. Customer Dhaba Booking (Frontend)</span>
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
            <span>3. Backend Modules (Never Displayed)</span>
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
            <span>4. Admin — Separate Secure Login</span>
          </button>
        </div>

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Vertical: Highway Dhaba &amp; Roadside Dining
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. DHABA REGISTRATION — FRONTEND MODULES */}
      {/* ======================================================================= */}
      {activeSubView === "dhaba_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Dhaba &amp; Highway Restaurant Partner App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Highway Dhaba Onboarding, Facilities &amp; Menu Catalog
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  STATUS: VERIFIED &amp; ACTIVE
                </span>
              </div>
            </div>

            {/* Stepper Wizard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Dhaba & Highway Location", desc: "GPS, Route, Landmark" },
                { step: 2, title: "Seating & Facilities", desc: "Capacity, Parking, AC" },
                { step: 3, title: "Menu, Pricing & Pre-Order", desc: "Items, Desi Ghee, Combos" },
                { step: 4, title: "FSSAI, KYC & Settlement", desc: "GSTIN, Bank, Documents" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setDhabaStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    dhabaStep === s.step
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

            {/* Step 1: Dhaba & Route Details */}
            {dhabaStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Dhaba / Brand Name</label>
                    <input
                      type="text"
                      value={dhabaForm.name}
                      onChange={(e) => setDhabaForm({ ...dhabaForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Owner / Business Entity</label>
                    <input
                      type="text"
                      value={dhabaForm.ownerName}
                      onChange={(e) => setDhabaForm({ ...dhabaForm, ownerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Highway / Route Location</label>
                    <input
                      type="text"
                      value={dhabaForm.highwayRoute}
                      onChange={(e) => setDhabaForm({ ...dhabaForm, highwayRoute: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">GPS Coordinates</label>
                    <input
                      type="text"
                      value={dhabaForm.gpsLocation}
                      onChange={(e) => setDhabaForm({ ...dhabaForm, gpsLocation: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Nearby Landmark</label>
                    <input
                      type="text"
                      value={dhabaForm.nearbyLandmark}
                      onChange={(e) => setDhabaForm({ ...dhabaForm, nearbyLandmark: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Operating Timings</label>
                    <input
                      type="text"
                      value={dhabaForm.timings}
                      onChange={(e) => setDhabaForm({ ...dhabaForm, timings: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Roadside Physical Address</label>
                  <textarea
                    rows={2}
                    value={dhabaForm.fullAddress}
                    onChange={(e) => setDhabaForm({ ...dhabaForm, fullAddress: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Seating, Parking & Facilities */}
            {dhabaStep === 2 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Total Seating Capacity</span>
                    <span className="text-sm font-bold text-white">{dhabaForm.seatingCapacity}</span>
                    <span className="text-3xs text-emerald-400 block">45 Tables (4 to 12 Seater)</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Parking Facilities</span>
                    <span className="text-sm font-bold text-amber-300">{dhabaForm.parking}</span>
                    <span className="text-3xs text-slate-400 block">CCTV Monitored with EV Charging</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Restrooms &amp; Hygiene</span>
                    <span className="text-sm font-bold text-emerald-400">{dhabaForm.washrooms}</span>
                    <span className="text-3xs text-slate-400 block">Hourly Sanitization Logs</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="font-bold text-slate-300 block">Facilities &amp; Amenities Check:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "✓ 100% Pure Desi Ghee",
                      "✓ Family AC Dining Hall",
                      "✓ Outdoor Charpai Zone",
                      "✓ Free High-Speed WiFi",
                      "✓ Child Play Area & Rides",
                      "✓ Clean Drinking RO Water",
                      "✓ EV Fast Charger Station",
                      "✓ 24/7 Security Guard Desk",
                    ].map((amenity, i) => (
                      <span key={i} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 font-medium">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Menu & Pricing */}
            {dhabaStep === 3 && (
              <div className="space-y-4 text-xs">
                <span className="font-bold text-slate-300 block">Verified Highway Dhaba Specialties &amp; Combos:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      name: "Amritsari Aloo Pyaaz Paratha",
                      price: 180,
                      veg: true,
                      desc: "Tandoor baked with whole spices, served with homemade white churn butter and fresh curd.",
                    },
                    {
                      name: "Grand Punjabi Maharaja Thali",
                      price: 490,
                      veg: true,
                      desc: "Paneer Butter Masala, Dal Makhani, Pindi Chhole, Jeera Rice, 2 Butter Naan, Sweet Lassi & Gulab Jamun.",
                    },
                    {
                      name: "Handi Dal Makhani (24-Hour Slow Simmered)",
                      price: 290,
                      veg: true,
                      desc: "Authentic clay handi preparation enriched with fresh farm cream and pure butter.",
                    },
                    {
                      name: "Highway Paneer Tikka Sizzler",
                      price: 360,
                      veg: true,
                      desc: "Charcoal grilled fresh cottage cheese cubes with mint coriander chutney and spiced onions.",
                    },
                  ].map((dish, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{dish.name}</span>
                        <span className="font-black text-amber-400 text-sm">₹{dish.price}</span>
                      </div>
                      <p className="text-2xs text-slate-400">{dish.desc}</p>
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-3xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          100% PURE VEG
                        </span>
                        <span className="text-slate-400 font-mono">Available: 24/7 Hot</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Documents & Bank Settlement */}
            {dhabaStep === 4 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Central FSSAI License</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">{dhabaForm.fssaiLicense}</span>
                    <span className="text-3xs text-slate-400 block">Valid Till: 2028-12-31</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">GSTIN Registration</span>
                    <span className="text-sm font-bold text-white font-mono">{dhabaForm.gstin}</span>
                    <span className="text-3xs text-emerald-400 block">Active Verified Taxpayer</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Bank Settlement Account</span>
                    <span className="text-sm font-bold text-amber-300 font-mono">{dhabaForm.accountNumber}</span>
                    <span className="text-3xs text-slate-400 block">{dhabaForm.bankName} (IFSC: {dhabaForm.ifsc})</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. CUSTOMER DHABA BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_dhaba_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Highway Dhaba Search, Table Pre-Booking &amp; Food Pre-Order
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  Route: NH-44 Highway Mile
                </span>
              </div>
            </div>

            {/* Route & Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Travel Highway Route</label>
                <input
                  type="text"
                  value={routeSearch}
                  onChange={(e) => setRouteSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Dining Preference</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDiningMode("dine_in")}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      diningMode === "dine_in"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Dine-In Table
                  </button>
                  <button
                    onClick={() => setDiningMode("takeaway")}
                    className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                      diningMode === "takeaway"
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Express Pickup
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Guests &amp; Date</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-16 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white text-center font-bold"
                  />
                  <input
                    type="date"
                    value={diningDate}
                    onChange={(e) => setDiningDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Estimated Arrival Time</label>
                <input
                  type="text"
                  value={diningTimeSlot}
                  onChange={(e) => setDiningTimeSlot(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                />
              </div>
            </div>

            {/* Dhaba Details Box */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Haveli Grand Heritage Dhaba &amp; Highway Retreat</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-extrabold border border-emerald-500/30">
                      ★ 4.86 (8,920 Reviews)
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    NH-44 Murthal, Sonipat &bull; 450 Seater &bull; Pure Desi Ghee &bull; Free Valet Parking &bull; Clean Washrooms
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Table Reservation</span>
                  <span className="text-xs font-black text-emerald-400">Guaranteed Zero Waiting</span>
                </div>
              </div>

              {/* Pre-Order Cart */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Pre-Ordered Highway Food Items:</span>
                {preOrderItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-3xs text-emerald-400">100% PURE VEG DESI GHEE</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-amber-400">
                        ₹{item.price} x {item.qty} = ₹{item.price * item.qty}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bill Breakdown & Confirm */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Food Subtotal</span>
                  <span className="font-mono text-white">₹{subtotal}</span>
                </div>
                {couponApplied && (
                  <div className="flex items-center justify-between text-xs text-emerald-400">
                    <span>Highway Saver Coupon (HIGHWAY10)</span>
                    <span className="font-mono">-₹{discount}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">GST (5% Restaurant)</span>
                  <span className="font-mono text-white">₹{gst}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-2xs text-slate-400 block">Total Payable Amount</span>
                    <span className="text-xl font-black text-white">₹{grandTotal}</span>
                  </div>

                  <button
                    onClick={() => {
                      setBookingConfirmed(true);
                      alert(
                        `Highway Table & Meal Pre-Order Confirmed!\nBooking Code: DHABA-MURTHAL-8821\nShow QR at VIP Hospitality Desk on arrival at 13:30 PM.`
                      );
                    }}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{grandTotal} &amp; Confirm VIP Table Pass</span>
                  </button>
                </div>

                {bookingConfirmed && (
                  <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-white text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Table &amp; Food Reservation Confirmed &bull; Pass: DHABA-MURTHAL-8821
                      </span>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                        QR PASS ACTIVE
                      </span>
                    </div>
                    <p className="text-2xs text-emerald-300">
                      Table for {guestCount} Guests reserved at Haveli Murthal for {diningDate} at {diningTimeSlot}.
                      Hot meals will be ready upon arrival.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. BACKEND MODULES — NEVER DISPLAYED ON FRONTEND */}
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
                  Dhaba Core Platform Engine
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Backend Microservices &amp; Infrastructure (Strictly Server-Side)
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Complete backend services executing table reservation mutexes, geo-routing engines, POS Kitchen Order Ticket (KOT) sync, payment gateways, and settlement ledgers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Dhaba Registration Service",
                desc: "Manages partner onboarding workflows, owner validation, and highway coordinate geo-tagging.",
                icon: Building,
              },
              {
                title: "KYC & FSSAI Document Verification",
                desc: "OCR verification service connecting to FoSCoS national food safety registry and PAN/GST database.",
                icon: ShieldCheck,
              },
              {
                title: "Table Inventory & Reservation Engine",
                desc: "High-concurrency table slot manager preventing double bookings during peak highway rush hours.",
                icon: Users,
              },
              {
                title: "Food Order & Kitchen POS Service",
                desc: "Direct integration with Petpooja / Posist POS terminals for automated Kitchen Order Ticket (KOT) firing.",
                icon: Utensils,
              },
              {
                title: "Location & Highway Geo-Routing Service",
                desc: "Calculates distance along national highway routes (NH-44, NH-48, NH-19) for roadside traveler recommendations.",
                icon: MapPin,
              },
              {
                title: "Payment Gateway & Settlement Service",
                desc: "Automated escrow management with daily T+2 automated NEFT payouts and 5% commission retention.",
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
      {/* 4. ADMIN — SEPARATE SECURE LOGIN */}
      {/* ======================================================================= */}
      {activeSubView === "admin_console" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Admin Panel &bull; RBAC Protected
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Highway Dhaba Partner Approvals, Table Audits &amp; Financial Ledgers
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: dhaba_operations_lead@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Active Verified Highway Dhabas</span>
                <span className="text-sm font-black text-white">284 Verified Highway Partners</span>
                <span className="text-3xs text-emerald-400 block">Covering 14 Major Expressways</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Today's Pre-Booked Highway Meals</span>
                <span className="text-sm font-black text-emerald-400">1,842 Meals Dispatched</span>
                <span className="text-3xs text-slate-400 block">Avg Kitchen Wait Time: &lt; 4 mins</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Gross Daily Dhaba GMV</span>
                <span className="text-sm font-black text-amber-400">₹14,20,000</span>
                <span className="text-3xs text-slate-400 block">5% Platform Brokerage Reconciled</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
