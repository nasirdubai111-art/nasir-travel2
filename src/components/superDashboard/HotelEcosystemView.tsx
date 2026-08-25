import React, { useState } from "react";
import {
  Hotel,
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
  Utensils,
  Star,
  Tv,
  Wifi,
  Wind,
  Bath,
  Maximize2,
} from "lucide-react";

type HotelSubView =
  | "hotel_registration"
  | "hotel_booking"
  | "hotel_restaurant_partner"
  | "hotel_restaurant_customer"
  | "backend_modules"
  | "admin_console";

export function HotelEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<HotelSubView>("hotel_registration");

  // Registration step state
  const [regStep, setRegStep] = useState(1);
  const [hotelForm, setHotelForm] = useState({
    name: "The Grand Royal Palace & Heritage Suites",
    propertyType: "5-Star Deluxe Luxury Heritage Hotel",
    ownerCompany: "Royal Rajputana Hospitality & Palaces Pvt. Ltd.",
    contactPerson: "Vikramaditya Singh Rathore (General Manager)",
    mobile: "+91 141-2890-4400",
    email: "reservations@grandroyalpalace.com",
    address: "Civil Lines & Heritage Boulevard, Jaipur, Rajasthan 302006",
    gpsLocation: "26.9124° N, 75.7873° E",
    starCategory: "5-Star Deluxe Heritage",
    checkInTime: "02:00 PM (14:00 hrs)",
    checkOutTime: "12:00 PM (Noon)",
    facilities: [
      "Olympic-Sized Marble Swimming Pool",
      "Sheesh Mahal Fine-Dining Restaurant",
      "Jiva Ayurvedic Luxury Spa & Wellness",
      "24-Hour Dedicated Butler Service",
      "Valet Parking & Airport Limousine Transfers",
      "High-Speed Fiber Optic Wi-Fi",
    ],
    fssaiLicense: "10014011002941 (FSSAI 5-Star Hygiene)",
    gstin: "08AAGCR9912L1Z4",
    bankName: "HDFC Bank Ltd. (Jaipur Corporate Branch)",
    accountNumber: "50200099182910",
    ifsc: "HDFC0000054",
  });

  // Customer Booking State
  const [destination, setDestination] = useState("Jaipur, Rajasthan");
  const [checkInDate, setCheckInDate] = useState("2026-09-10");
  const [checkOutDate, setCheckOutDate] = useState("2026-09-13");
  const [guestCount, setGuestCount] = useState(2);
  const [roomCount, setRoomCount] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState("Royal Heritage Courtyard Room");
  const [selectedMealPlan, setSelectedMealPlan] = useState("CP (Complimentary Royal Breakfast Buffet)");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Hotel Restaurant Partner & Customer State
  const [restMealType, setRestMealType] = useState<"in_house" | "room_service">("room_service");
  const [restCart, setRestCart] = useState([
    { name: "Lal Maas (Slow Cooked Rajasthani Smoked Mutton Curry)", price: 650, qty: 1 },
    { name: "Royal Shahi Paneer with Saffron Basmati Rice", price: 420, qty: 1 },
    { name: "Garlic Butter Naan Basket (4 Pcs)", price: 160, qty: 2 },
  ]);

  const restTotal = restCart.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <div className="space-y-6">
      {/* Sub-Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("hotel_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "hotel_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Hotel Registration (Partner)</span>
          </button>

          <button
            onClick={() => setActiveSubView("hotel_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "hotel_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Bed className="w-3.5 h-3.5" />
            <span>2. Hotel Booking (Customer)</span>
          </button>

          <button
            onClick={() => setActiveSubView("hotel_restaurant_partner")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "hotel_restaurant_partner"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>3. Hotel Restaurant (Partner)</span>
          </button>

          <button
            onClick={() => setActiveSubView("hotel_restaurant_customer")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "hotel_restaurant_customer"
                ? "bg-blue-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>4. Hotel Dining Booking (Customer)</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
          Vertical: 5-Star Hotel &amp; Hospitality
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. HOTEL REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "hotel_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Hotel Partner App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Property Onboarding, Room Categories, Inventory &amp; Rate Calendar
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  PROPERTY VERIFIED &bull; 5-STAR DELUXE
                </span>
              </div>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Property & Company Details", desc: "Name, Star Category, GPS" },
                { step: 2, title: "Room Types & Amenities", desc: "Suites, Villas, Capacity" },
                { step: 3, title: "Rates, Inventory & Calendar", desc: "Pricing, Meal Plans, Taxes" },
                { step: 4, title: "KYC, Bank & Compliance", desc: "GSTIN, FSSAI, Payout Vault" },
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
                    <label className="block text-slate-400 mb-1 font-semibold">Hotel / Property Name</label>
                    <input
                      type="text"
                      value={hotelForm.name}
                      onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Property Category</label>
                    <input
                      type="text"
                      value={hotelForm.starCategory}
                      onChange={(e) => setHotelForm({ ...hotelForm, starCategory: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Check-in / Check-out Standard Times</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={hotelForm.checkInTime}
                        onChange={(e) => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                        className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                      />
                      <input
                        type="text"
                        value={hotelForm.checkOutTime}
                        onChange={(e) => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                        className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Full Property Physical Address</label>
                  <textarea
                    rows={2}
                    value={hotelForm.address}
                    onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {/* Step 2 */}
            {regStep === 2 && (
              <div className="space-y-4 text-xs">
                <span className="font-bold text-slate-300 block">Configured Hotel Room Types &amp; Inventory:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      name: "Royal Heritage Courtyard Room",
                      size: "450 sq.ft",
                      bed: "1 King Bed",
                      capacity: "2 Adults + 1 Child",
                      price: 7499,
                      units: 24,
                    },
                    {
                      name: "Maharaja Presidential Heritage Suite",
                      size: "1,100 sq.ft",
                      bed: "Super King Bed + Plunge Pool",
                      capacity: "3 Adults or Family",
                      price: 18999,
                      units: 4,
                    },
                    {
                      name: "Rajputana Interconnected Family Suite",
                      size: "850 sq.ft",
                      bed: "2 King Bedrooms",
                      capacity: "4 Adults + 2 Children",
                      price: 13500,
                      units: 8,
                    },
                  ].map((room, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{room.name}</span>
                        <span className="font-black text-amber-400">₹{room.price}/n</span>
                      </div>
                      <div className="text-3xs text-slate-400 space-y-1">
                        <div>Size: {room.size} &bull; Bed: {room.bed}</div>
                        <div>Max Capacity: {room.capacity}</div>
                        <div className="text-emerald-400 font-bold">Total Inventory: {room.units} Rooms</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 & 4 summaries */}
            {regStep >= 3 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Channel Manager &amp; Bank Settlement Status:</span>
                  <span className="text-emerald-400 font-mono font-bold">Oracle Opera PMS Synced (2-Way)</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Automated Weekly Tuesday settlements to {hotelForm.bankName} Account: {hotelForm.accountNumber}. 8.0% contracted OTA commission model.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. HOTEL BOOKING — CUSTOMER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "hotel_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  5-Star Hotel Reservation &amp; Instant Digital Check-In Voucher
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-400">
                City: {destination}
              </span>
            </div>

            {/* Search Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">City / Landmark</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Check-in &bull; Check-out</label>
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
                <label className="block text-slate-400 mb-1 font-semibold">Guests &amp; Rooms</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                  <input
                    type="number"
                    value={roomCount}
                    onChange={(e) => setRoomCount(Number(e.target.value))}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Selected Meal Plan</label>
                <select
                  value={selectedMealPlan}
                  onChange={(e) => setSelectedMealPlan(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-bold"
                >
                  <option>CP (Complimentary Royal Breakfast Buffet)</option>
                  <option>MAP (Breakfast + 4-Course Royal Dinner)</option>
                  <option>EP (Room Only - Flexible Dining)</option>
                </select>
              </div>
            </div>

            {/* Room Confirmation Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">The Grand Royal Palace &amp; Heritage Suites</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-3xs font-extrabold">
                      ★ 4.95 (2,150 Reviews)
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Civil Lines, Jaipur &bull; 3 Nights (10 Sep - 13 Sep 2026) &bull; {guestCount} Guests &bull; {selectedMealPlan}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total for 3 Nights</span>
                  <span className="text-lg font-black text-white">₹22,497 <span className="text-3xs font-normal text-slate-400">+ 12% GST</span></span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Free Cancellation up to 48 hours before check-in. Instant WhatsApp Voucher.
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Hotel Booking Confirmed!\nHotel: The Grand Royal Palace, Jaipur\nConfirmation Voucher: HOTE-JPR-99214\nInstant Check-in QR Generated."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Confirm Stay &amp; Issue Voucher</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      5-Star Hotel Stay Confirmed &bull; Voucher: HOTE-JPR-99214
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      CHECK-IN READY
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Your luxury stay in Jaipur is booked. Show the QR voucher at the Royal Courtyard Concierge desk upon arrival.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. HOTEL RESTAURANT — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "hotel_restaurant_partner" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Hotel Restaurant &amp; Room-Service Partner App
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Sheesh Mahal In-House Restaurant &amp; 24/7 In-Room Dining Menu
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                KITCHEN: ACTIVE 24/7
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Fine-Dining Table Capacity</span>
                <span className="text-sm font-bold text-white">120 Indoor Covers + Courtyard</span>
                <span className="text-3xs text-emerald-400 block">Table Reservation Engine Synced</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Active In-Room Dining Orders</span>
                <span className="text-sm font-bold text-amber-300">14 Rooms Being Served</span>
                <span className="text-3xs text-slate-400 block">Avg Delivery Time: 18 mins</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Today's Restaurant Sales</span>
                <span className="text-sm font-bold text-emerald-400">₹1,84,500</span>
                <span className="text-3xs text-slate-400 block">Direct Folio &amp; Digital UPI Split</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. HOTEL DINING BOOKING — CUSTOMER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "hotel_restaurant_customer" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                  Guest In-Room &amp; Courtyard Dining App
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Order Gourmet Food to Room or Reserve Table at Sheesh Mahal
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setRestMealType("room_service")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    restMealType === "room_service"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  Room Service
                </button>
                <button
                  onClick={() => setRestMealType("in_house")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    restMealType === "in_house"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-900 text-slate-400 border border-slate-700"
                  }`}
                >
                  Table Reservation
                </button>
              </div>
            </div>

            {/* Cart & Items */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-xs">
              <span className="font-bold text-slate-300 block">Your Gourmet Selection:</span>
              {restCart.map((item, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">{item.name}</span>
                    <span className="text-3xs text-amber-400">Royal Kitchen Signature</span>
                  </div>
                  <span className="font-mono font-bold text-white">₹{item.price} x {item.qty} = ₹{item.price * item.qty}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-2xs text-slate-400 block">Total In-Room Dining Amount</span>
                  <span className="text-base font-black text-white">₹{restTotal}</span>
                </div>
                <button
                  onClick={() => alert(`Order placed for Room Suite 204!\nDelivery ETA: 20 minutes.`)}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
                >
                  Charge to Room Folio (Suite 204)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 5. BACKEND MODULES — NEVER DISPLAYED */}
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
                  Hotel Core Infrastructure
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  PMS Integration, Rate Parity, Inventory Locking &amp; Settlement Engines
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Strictly server-side microservices powering room inventory locking, SiteMinder channel manager sync, rate parity computation, and PCI-DSS card tokenization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Property & Room Inventory Service",
                desc: "Manages real-time room block allocations, overbooking controls, and seasonal rate plans.",
                icon: Building,
              },
              {
                title: "Channel Manager (SiteMinder / Oracle PMS)",
                desc: "Two-way XML/JSON sync engine updating availability across OTA networks in under 800ms.",
                icon: RefreshCw,
              },
              {
                title: "Hotel Restaurant & POS Sync Engine",
                desc: "Routes in-room and courtyard dining orders directly to kitchen thermal printers and PMS folios.",
                icon: Utensils,
              },
              {
                title: "Dynamic Surge Rate & Yield Engine",
                desc: "AI-driven occupancy and local city event tracking to adjust nightly rates dynamically.",
                icon: TrendingUp,
              },
              {
                title: "Commission & Payout Ledger",
                desc: "Calculates contracted 8% OTA commission and schedules automated Tuesday bank wires.",
                icon: CreditCard,
              },
              {
                title: "Security, KYC & Compliance Vault",
                desc: "Automated guest identity tokenization and state tourism department foreign guest form verification.",
                icon: ShieldCheck,
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
                  Admin Panel &bull; Super Security
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  5-Star Hotel Onboarding Approvals, Channel Sync Audits &amp; Financial Payouts
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: hospitality_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Total Active Properties</span>
                <span className="text-sm font-black text-white">412 Verified Hotels</span>
                <span className="text-3xs text-emerald-400 block">99.8% PMS Sync Health</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Hotel GMV</span>
                <span className="text-sm font-black text-amber-400">₹3,48,00,000</span>
                <span className="text-3xs text-slate-400 block">8.0% Platform Commission</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Net Partner Payouts Cleared</span>
                <span className="text-sm font-black text-emerald-400">₹3,20,16,000</span>
                <span className="text-3xs text-slate-400 block">Weekly Tuesday Settlement</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
