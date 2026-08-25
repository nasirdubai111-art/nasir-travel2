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
} from "lucide-react";

type RestaurantSubView =
  | "restaurant_registration"
  | "customer_ordering"
  | "backend_modules"
  | "admin_console";

export function RestaurantEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<RestaurantSubView>("restaurant_registration");

  // Registration states
  const [partnerRegStep, setPartnerRegStep] = useState(1);
  const [restaurantData, setRestaurantData] = useState({
    name: "Haldiram's Express & Satvik Bhoj",
    brand: "Haldiram's",
    ownerName: "Manish Agarwal",
    mobile: "+91 98201 99281",
    email: "station.ops@haldirams.com",
    address: "Food Plaza, Platform 1, Kota Junction (KOTA), Rajasthan 324002",
    primaryStationCode: "KOTA (Kota Junction)",
    fssaiLicense: "10014011002941 (14-Digit Central FSSAI)",
    pan: "AAACH9812L",
    gstin: "08AAACH9812L1ZP",
    bankName: "State Bank of India",
    accountNumber: "38920194821",
    ifsc: "SBIN0001824",
    hygieneRating: "5-Star FSSAI Certified",
    serviceTimings: "06:00 to 23:30 Daily",
    deliveryPoints: ["Platform 1 to 4 Coach Side", "Seat / Berth Delivery"],
    cancellationPolicy: "Full refund if cancelled 2 hours before scheduled train arrival at station.",
  });

  // Customer Ordering State
  const [custPnr, setCustPnr] = useState("2849104821");
  const [deliveryStation, setDeliveryStation] = useState("KOTA - Kota Junction (21:30 Arrive)");
  const [cartItems, setCartItems] = useState<Array<{ name: string; price: number; qty: number; type: "veg" | "jain" }>>([
    { name: "Royal Maharaja Deluxe Thali (Paneer, Dal Makhani, 4 Butter Roti, Rice, Gulab Jamun)", price: 290, qty: 1, type: "veg" },
    { name: "Special Pure Jain Satvik Khichdi Bowl", price: 180, qty: 1, type: "jain" },
  ]);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [dietaryNote, setDietaryNote] = useState("Pure Jain (No Onion, No Garlic). Extra Napkins please.");

  const totalAmount = cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Ribbon for Restaurant Vertical */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("restaurant_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "restaurant_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Restaurant &amp; Menu Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_ordering")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_ordering"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>2. Customer e-Catering &amp; PNR Food Delivery</span>
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
            <span>3. Backend Dining Modules (Never Displayed)</span>
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
            <span>4. FSSAI &amp; Partner Admin Gate</span>
          </button>
        </div>

        <span className="text-3xs font-mono px-2 py-1 rounded bg-slate-900 text-amber-300 border border-amber-500/30">
          Vertical: Station e-Catering
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. RESTAURANT REGISTRATION — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "restaurant_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Restaurant &amp; Kitchen Partner Onboarding
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Station Food Vendor Registration &amp; Menu Builder
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
                  FSSAI LICENSE: VERIFIED
                </span>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { num: 1, label: "Restaurant & FSSAI Details" },
                { num: 2, label: "Station Delivery Mapping" },
                { num: 3, label: "Menu & Pricing Engine" },
                { num: 4, label: "Bank & Settlement" },
              ].map((st) => (
                <button
                  key={st.num}
                  onClick={() => setPartnerRegStep(st.num)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    partnerRegStep === st.num
                      ? "bg-amber-500/20 border-amber-500/80 text-amber-300 shadow-md"
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5">Section 0{st.num}</div>
                  <div className="text-xs font-bold line-clamp-1">{st.label}</div>
                </button>
              ))}
            </div>

            {/* Step 1: Restaurant and FSSAI Details */}
            {partnerRegStep === 1 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Restaurant Legal Name</label>
                    <input
                      type="text"
                      value={restaurantData.name}
                      onChange={(e) => setRestaurantData({ ...restaurantData, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">FSSAI License (14-Digit)</label>
                    <input
                      type="text"
                      value={restaurantData.fssaiLicense}
                      onChange={(e) => setRestaurantData({ ...restaurantData, fssaiLicense: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">GSTIN</label>
                    <input
                      type="text"
                      value={restaurantData.gstin}
                      onChange={(e) => setRestaurantData({ ...restaurantData, gstin: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Primary Station Hub</label>
                    <input
                      type="text"
                      value={restaurantData.primaryStationCode}
                      onChange={(e) => setRestaurantData({ ...restaurantData, primaryStationCode: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Contact Mobile</label>
                    <input
                      type="text"
                      value={restaurantData.mobile}
                      onChange={(e) => setRestaurantData({ ...restaurantData, mobile: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Hygiene Accreditation</label>
                    <div className="p-2 bg-slate-900 rounded-xl border border-slate-700 text-emerald-400 font-bold">
                      {restaurantData.hygieneRating}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Menu Builder & Pricing */}
            {partnerRegStep === 3 && (
              <div className="space-y-4 text-xs">
                <span className="font-bold text-slate-300 block">Active Verified e-Catering Menu Items:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Royal Maharaja Thali", price: 290, prep: "15 min", badge: "VEG / JAIN OPTION", desc: "Shahi Paneer, Dal Makhani, Jeera Rice, 4 Butter Phulkas, Raita, Sweet." },
                    { name: "Satvik Jain Khichdi Bowl", price: 180, prep: "10 min", badge: "100% PURE JAIN", desc: "Moong Dal & Desi Ghee preparation without root vegetables or garlic." },
                    { name: "Hyderabadi Dum Veg Biryani", price: 220, prep: "12 min", badge: "VEG CHEF SPECIAL", desc: "Dum cooked Basmati rice with whole spices, served with Mirchi Ka Salan." },
                    { name: "South Indian Express Combo", price: 160, prep: "8 min", badge: "FRESH HOT", desc: "2 Steamed Idlis + 1 Medu Vada with hot Drumstick Sambar and Coconut Chutney." },
                  ].map((menu, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{menu.name}</span>
                        <span className="font-black text-amber-400 text-sm">₹{menu.price}</span>
                      </div>
                      <p className="text-2xs text-slate-400">{menu.desc}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-3xs">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {menu.badge}
                        </span>
                        <span className="text-slate-400 font-mono">Prep Time: {menu.prep}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. CUSTOMER RESTAURANT BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_ordering" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  IRCTC e-Catering &bull; Direct Seat Delivery
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Hot Meals Delivered to Coach B3, Berth 21 at Kota Junction
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400">
                Train: 12952 Mumbai Rajdhani
              </span>
            </div>

            {/* PNR Validation Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">10-Digit PNR</label>
                <input
                  type="text"
                  value={custPnr}
                  onChange={(e) => setCustPnr(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Delivery Station &amp; Time</label>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-700 text-amber-300 font-bold">
                  {deliveryStation}
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Coach &amp; Seat Coordinates</label>
                <div className="p-2 bg-slate-900 rounded-xl border border-slate-700 text-emerald-400 font-bold">
                  Coach: B3 &bull; Seat: 21 (Lower Berth)
                </div>
              </div>
            </div>

            {/* Cart & Special Dietary Requests */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">Cart Items for Delivery:</span>
                {cartItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">{item.name}</span>
                      <span className="text-3xs text-emerald-400">{item.type.toUpperCase()} PREPARATION</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-amber-400">₹{item.price} x {item.qty} = ₹{item.price * item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 mb-1 text-xs font-semibold">Special Dietary Instructions</label>
                <input
                  type="text"
                  value={dietaryNote}
                  onChange={(e) => setDietaryNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-2xs text-slate-400 block">Total Order Payable (Incl. 5% GST)</span>
                  <span className="text-xl font-black text-white">₹{totalAmount}</span>
                </div>

                <button
                  onClick={() => {
                    setOrderConfirmed(true);
                    alert("e-Catering Order Dispatched to Kitchen! Rider will meet you at Coach B3 at 21:30 when Train arrives at Kota Junction.");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Confirm Meal Order (Pay at Seat or UPI)</span>
                </button>
              </div>

              {orderConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Order Confirmed &bull; Order ID: FD-KOTA-991204
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs">
                      PREPARING IN KITCHEN
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Live Tracking: Kitchen Accepted (20:45) &rarr; Packing Sealed (21:10) &rarr; Platform Delivery Boy Assigned (21:20) &rarr; Train Door Delivery (21:30).
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. BACKEND MODULES (NEVER DISPLAYED) */}
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
                  Station e-Catering Backend Core
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Backend Dining Modules &amp; Live Train Sync
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Station delivery rider dispatcher, train delay compensation scheduler (if train is late, kitchen delays cooking automatically), and FSSAI hygiene audit databases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Live Train Running Sync Engine",
                desc: "Polls CRIS GPS real-time status. If train arrival at delivery station changes, automatically alerts restaurant kitchen.",
                icon: Clock,
              },
              {
                title: "FSSAI License OCR & Audit Service",
                desc: "Automated real-time validation with FoSCoS national database ensuring zero unverified food vendors on platform.",
                icon: ShieldCheck,
              },
              {
                title: "Platform Delivery Rider Dispatcher",
                desc: "Assigns verified station delivery personnel with railway platform gate security clearance passes.",
                icon: Truck,
              },
              {
                title: "e-Catering Settlement & Commission Engine",
                desc: "Automated 12% marketplace commission retention, 18% GST E-Invoice generation, and daily T+1 vendor bank remittances.",
                icon: TrendingUp,
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
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. ADMIN CONSOLE */}
      {/* ======================================================================= */}
      {activeSubView === "admin_console" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-purple-500/30 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  FSSAI &amp; Food Operations
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Food Vendor Audit &amp; Platform Hygiene Compliance
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: food_audit_head@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Active Station Kitchens</span>
                <span className="text-sm font-black text-white">412 Verified Kitchens</span>
                <span className="text-3xs text-emerald-400 block">Across 180 Major Junctions</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">FSSAI Hygiene Pass Rate</span>
                <span className="text-sm font-black text-emerald-400">99.4% (Grade A+)</span>
                <span className="text-3xs text-slate-400 block">Zero Critical Infractions</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">On-Time Seat Delivery SLA</span>
                <span className="text-sm font-black text-amber-400">98.8% Delivered before Train Departs</span>
                <span className="text-3xs text-slate-400 block">Automatic refund on missed halts</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
