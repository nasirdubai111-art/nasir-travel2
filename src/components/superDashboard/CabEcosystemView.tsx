import React, { useState } from "react";
import {
  Car,
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
  CheckSquare,
} from "lucide-react";

type CabSubView =
  | "cab_registration"
  | "cab_fleet_management"
  | "customer_cab_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function CabEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<CabSubView>(
    "cab_fleet_management"
  );

  // Registration state
  const [regStep, setRegStep] = useState(1);
  const [fleetData, setFleetData] = useState({
    agencyName: "Royal Cabs & Outstation Intercity Fleet",
    ownerName: "Capt. Harish Chandra & Sukhwinder Dhillon",
    contactPhone: "+91 98102-33440",
    email: "fleet@royalcabs.in",
    officeAddress: "Plot 88, Sector 18, Udyog Vihar, Gurugram & Ring Road, Delhi",
    serviceCorridors: "Delhi-NCR, Agra, Jaipur, Chandigarh, Shimla, Manali, Dehradun, Rishikesh",
    fleetCount: "65 Premium Sedans, Innova Crysta & EV SUVs",
    commercialPermit: "ALL-INDIA-TOURIST-PERMIT-2024-889",
    gstin: "06AABCR9912K1Z9",
    bankName: "HDFC Bank (Gurugram Branch)",
    accountNumber: "50100291827361",
    ifsc: "HDFC0000108",
  });

  // Fleet management state
  const [vehicleData, setVehicleData] = useState({
    category: "Luxury Outstation MUV (Toyota Innova Crysta 2.4 ZX)",
    capacity: "6 Passengers + 1 Driver (Captain Seats)",
    acType: "Triple-Zone Automatic Climate Control",
    ratePerKm: 16,
    baseFareOutstation: 3800,
    dailyDriverAllowance: 400,
    nightAllowance: 300,
    amenities: "Chilled Mineral Water, Fast Car Charger, Luggage Carrier, Clean Tissues",
    driverName: "Harpreet Singh (Badge #DL-8821 • 14 Yrs Hill Driving Exp)",
    registrationPlate: "DL-1Z-BA-9912",
    insuranceExpiry: "2027-08-30",
    fitnessExpiry: "2027-11-15",
  });

  // Customer cab booking state
  const [tripType, setTripType] = useState<"outstation" | "airport" | "hourly">("outstation");
  const [pickupCity, setPickupCity] = useState("New Delhi (Aerocity T3)");
  const [dropCity, setDropCity] = useState("Agra (Taj East Gate)");
  const [travelDate, setTravelDate] = useState("2026-09-12");
  const [cabCategory, setCabCategory] = useState<"sedan" | "innova" | "tempo">("innova");
  const [tollIncluded, setTollIncluded] = useState(true);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Booking management mock data
  const [cabTrips, setCabTrips] = useState([
    {
      id: "CAB-TRIP-8812",
      customer: "Kiran & Rajiv Mazumdar (4 Pax)",
      route: "Delhi T3 → Agra Golden Triangle Day Trip",
      cab: "Innova Crysta (DL-1Z-BA-9912)",
      driver: "Harpreet Singh (+91 98102-XXXXX - Masked)",
      fare: "₹4,800 (Toll & Driver DA Included)",
      status: "Dispatched & En-Route to Pickup",
    },
    {
      id: "CAB-TRIP-8813",
      customer: "Pawan Agarwal (2 Pax)",
      route: "Gurugram → Jaipur Airport Express Drop",
      cab: "Prime Sedan Dzire (HR-26-EE-4410)",
      driver: "Satish Kumar (Masked Call Active)",
      fare: "₹3,650 (All Inclusive)",
      status: "Trip Completed & Paid",
    },
  ]);

  const baseCabPrice = cabCategory === "sedan" ? 2800 : cabCategory === "innova" ? 4800 : 7500;
  const tollCost = tollIncluded ? 550 : 0;
  const totalCabFare = baseCabPrice + tollCost;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("cab_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "cab_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Cab Operator Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("cab_fleet_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "cab_fleet_management"
                ? "bg-yellow-600 text-slate-950 shadow-md font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>2. Fleet &amp; Tariff Management</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_cab_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_cab_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Customer Cab Booking</span>
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
            <span>4. Cab Dispatch &amp; Trip Roster</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-300 border border-yellow-500/30">
          Vertical: Cab Fleet &amp; Chauffeur Outstation
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. CAB OPERATOR REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "cab_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                  Cab Fleet Operator App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Taxi Fleet Registration, Commercial Permits &amp; Driver KYC
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED FLEET OPERATOR
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Company Details", desc: "Fleet Size & Base" },
                { step: 2, title: "Commercial Permits", desc: "All India Tourist Permit" },
                { step: 3, title: "Driver Verification", desc: "Police Verification & DL" },
                { step: 4, title: "Settlement Account", desc: "T+1 Daily Payout" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-yellow-500/20 border-yellow-500/80 text-yellow-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-yellow-400 font-bold">Step 0{s.step}</div>
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
                    <label className="block text-slate-400 mb-1 font-semibold">Fleet Agency Name</label>
                    <input
                      type="text"
                      value={fleetData.agencyName}
                      onChange={(e) => setFleetData({ ...fleetData, agencyName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Managing Owner</label>
                    <input
                      type="text"
                      value={fleetData.ownerName}
                      onChange={(e) => setFleetData({ ...fleetData, ownerName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Active Fleet Size</label>
                    <input
                      type="text"
                      value={fleetData.fleetCount}
                      onChange={(e) => setFleetData({ ...fleetData, fleetCount: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-yellow-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Major Operating Corridors</label>
                    <input
                      type="text"
                      value={fleetData.serviceCorridors}
                      onChange={(e) => setFleetData({ ...fleetData, serviceCorridors: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Fleet Garage &amp; Dispatch Office</label>
                    <input
                      type="text"
                      value={fleetData.officeAddress}
                      onChange={(e) => setFleetData({ ...fleetData, officeAddress: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Bank Settlement Account (Daily T+1):</span>
                  <span className="text-emerald-400 font-mono font-bold">{fleetData.bankName} (A/C: {fleetData.accountNumber})</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Automated driver payout splits. Platform commission: 5.5% on outstation bookings.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. FLEET & TARIFF MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "cab_fleet_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                  Vehicle Registration &amp; Per-KM Tariff Setup
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Innova Crysta, Sedan, EV SUV &amp; Tempo Traveller Fleet Rates
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-yellow-400">
                Vehicle: DL-1Z-BA-9912 (Innova Crysta)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Vehicle Model &amp; Grade</label>
                <input
                  type="text"
                  value={vehicleData.category}
                  onChange={(e) => setVehicleData({ ...vehicleData, category: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Commercial Plate No.</label>
                <input
                  type="text"
                  value={vehicleData.registrationPlate}
                  onChange={(e) => setVehicleData({ ...vehicleData, registrationPlate: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-yellow-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Outstation Base Fare (₹)</label>
                <input
                  type="number"
                  value={vehicleData.baseFareOutstation}
                  onChange={(e) => setVehicleData({ ...vehicleData, baseFareOutstation: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Per-KM Rate (₹/km)</label>
                <input
                  type="number"
                  value={vehicleData.ratePerKm}
                  onChange={(e) => setVehicleData({ ...vehicleData, ratePerKm: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Assigned Chauffeur</label>
                <input
                  type="text"
                  value={vehicleData.driverName}
                  onChange={(e) => setVehicleData({ ...vehicleData, driverName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="lg:col-span-3">
                <label className="block text-slate-400 mb-1 font-semibold">Onboard Amenities</label>
                <input
                  type="text"
                  value={vehicleData.amenities}
                  onChange={(e) => setVehicleData({ ...vehicleData, amenities: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Vehicle Health &amp; GPS Telemetry Status:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                OBD-II GPS Live Ping: Active (Speed Limit 80 km/h Governed) &bull; Commercial Fitness Valid Till Nov 2027 &bull; Zero Alcohol Pre-Trip Test Cleared.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. CUSTOMER CAB BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_cab_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Customer App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Book Outstation Cabs, Intercity Transfers &amp; Chauffeur Rentals
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 text-xs font-mono font-bold flex items-center gap-1">
                ★ 4.91 Rating (9,450 Trips)
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Pickup Location</label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Drop Location</label>
                <input
                  type="text"
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
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
                <label className="block text-slate-400 mb-1 font-semibold">Vehicle Choice</label>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setCabCategory("sedan")}
                    className={`w-1/3 py-2 rounded-xl text-3xs font-bold transition-all ${
                      cabCategory === "sedan"
                        ? "bg-yellow-500 text-slate-950 shadow-md font-black"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Sedan
                  </button>
                  <button
                    onClick={() => setCabCategory("innova")}
                    className={`w-1/3 py-2 rounded-xl text-3xs font-bold transition-all ${
                      cabCategory === "innova"
                        ? "bg-yellow-500 text-slate-950 shadow-md font-black"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Innova
                  </button>
                  <button
                    onClick={() => setCabCategory("tempo")}
                    className={`w-1/3 py-2 rounded-xl text-3xs font-bold transition-all ${
                      cabCategory === "tempo"
                        ? "bg-yellow-500 text-slate-950 shadow-md font-black"
                        : "bg-slate-900 text-slate-400 border border-slate-700"
                    }`}
                  >
                    Tempo
                  </button>
                </div>
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">New Delhi (Aerocity) → Agra (Taj East Gate)</span>
                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 text-3xs font-extrabold uppercase">
                      Toyota Innova Crysta &bull; 6 Pax AC
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Expressway Tolls Included &bull; Professional Chauffeur &bull; Mineral Water &bull; Zero Cancellation Fee
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Fare (Tolls Included)</span>
                  <span className="text-lg font-black text-white">₹{totalCabFare.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Live GPS Tracking &bull; Masked Driver Calling for Passenger Privacy
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Cab Booking Confirmed!\nBooking Ref: CAB-TRIP-8812\nInnova Crysta DL-1Z-BA-9912 Assigned.\nDriver Harpreet Singh is en-route."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Pay ₹{totalCabFare.toLocaleString()} &amp; Book Cab</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Cab Dispatched: CAB-TRIP-8812 &bull; DL-1Z-BA-9912
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      EN-ROUTE
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    Driver Harpreet Singh will arrive at Aerocity Delhi T3 on 12 Sep 2026.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. CAB OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Cab Fleet Dispatch &amp; Trip Roster
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Active Trips, Live Telemetry Tracking &amp; Driver Settlements
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: Gurugram Fleet Center
              </span>
            </div>

            <div className="space-y-3">
              {cabTrips.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.customer}</span>
                      <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 font-mono text-3xs">{item.id}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.route} &bull; <span className="text-white font-semibold">{item.cab}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.driver} &bull; {item.fare}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`Live telemetry tracking link sent for ${item.id}!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Track Cab
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
                  Cab Fleet Telemetry &amp; Dispatch Microservices
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Real-Time Geofence Matcher, Toll Plaza Fastag Sync &amp; Driver Privacy Masking
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              High-frequency GPS telemetry pipelines processing driver speed alerts, automated FASTag toll deductions, and encrypted virtual call forwarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Live GPS Telemetry & Geofence Matcher",
                desc: "Processes 5-second GPS pings from vehicle IoT transponders to detect route deviations and calculate precise ETA.",
                icon: Navigation,
              },
              {
                title: "FASTag Toll & State Tax Auto-Deductor",
                desc: "Direct integration with NPCI NETC FASTag gateway for real-time highway toll reconciliation and state permit clearance.",
                icon: DollarSign,
              },
              {
                title: "Virtual Number Call Masking Service",
                desc: "Twilio / Exotel proxy telephony preventing direct mobile number disclosures between passengers and drivers.",
                icon: Phone,
              },
              {
                title: "Driver Alcohol Breathalyzer & Safety Audit",
                desc: "Verifies mandatory pre-trip biometric selfie and alcohol sensor log clearance before vehicle unlock.",
                icon: ShieldCheck,
              },
              {
                title: "Dynamic Per-KM Surge Pricing Algorithm",
                desc: "Calculates outstation tariffs taking into account mountain terrain gradients, weather alerts, and return empty-haul factors.",
                icon: TrendingUp,
              },
              {
                title: "T+1 Daily Driver Payout Reconciliation",
                desc: "Deducts 5.5% platform commission and transfers daily earnings directly to driver UPI/bank accounts.",
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
                  Admin Panel &bull; Cab Fleet Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Fleet Inspections, Driver Background Verification &amp; Platform GMV
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: fleet_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Commercial Fleets Registered</span>
                <span className="text-sm font-black text-white">1,840 Verified Taxi Fleets</span>
                <span className="text-3xs text-emerald-400 block">Across 94 Indian Cities</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Cab Gross GMV</span>
                <span className="text-sm font-black text-yellow-400">₹4,20,00,000</span>
                <span className="text-3xs text-slate-400 block">5.5% Platform Brokerage</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Outstation Trips Completed</span>
                <span className="text-sm font-black text-emerald-400">76,200 Safe Trips</span>
                <span className="text-3xs text-slate-400 block">99.7% On-Time Pickup Rate</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
