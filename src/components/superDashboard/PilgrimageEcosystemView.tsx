import React, { useState, useEffect, useMemo } from "react";
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
  Star,
  CheckSquare,
  Printer,
  Heart,
  Info,
} from "lucide-react";
import { PilgrimageAdminPipelineView } from "../pilgrimage/PilgrimageAdminPipelineView";
import { pilgrimageService } from "../../services/pilgrimageService";
import {
  PilgrimagePackage,
  PilgrimageOperator,
  PilgrimageBookingRecord,
  PilgrimagePassenger,
} from "../../types/pilgrimagePipelineTypes";

export type PilgrimageSubView =
  | "pilgrimage_yatra"
  | "pilgrimage_admin_pipeline"
  | "operator_booking_management"
  | "pilgrimage_package_management"
  | "backend_modules";

export interface PilgrimageEcosystemViewProps {
  initialSubView?: PilgrimageSubView;
  initialAdminStage?:
    | "admin"
    | "pilgrimage_management"
    | "operators"
    | "packages"
    | "bookings"
    | "payments"
    | "reports";
  onOpenAdminPlatform?: () => void;
}

export function PilgrimageEcosystemView({
  initialSubView = "pilgrimage_yatra",
  initialAdminStage = "pilgrimage_management",
  onOpenAdminPlatform,
}: PilgrimageEcosystemViewProps = {}) {
  const [activeSubView, setActiveSubView] = useState<PilgrimageSubView>(initialSubView);
  const [adminStage, setAdminStage] = useState<
    "admin" | "pilgrimage_management" | "operators" | "packages" | "bookings" | "payments" | "reports"
  >(initialAdminStage);

  // Synchronize initial prop changes
  useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
  }, [initialSubView]);

  useEffect(() => {
    if (initialAdminStage) {
      setAdminStage(initialAdminStage);
    }
  }, [initialAdminStage]);

  // Packages & Operators data from pilgrimageService
  const [packages, setPackages] = useState<PilgrimagePackage[]>(() => pilgrimageService.getPackages());
  const [operators, setOperators] = useState<PilgrimageOperator[]>(() => pilgrimageService.getOperators());

  // Customer Yatra Booking Simulator State
  const [selectedCircuit, setSelectedCircuit] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPackageId, setSelectedPackageId] = useState<string>(packages[0]?.packageId || "PKG-CHARDHAM-01");
  const [travelDate, setTravelDate] = useState<string>("2026-09-22");
  
  // Devotee Passenger details
  const [leadDevoteeName, setLeadDevoteeName] = useState<string>("Pandit Devendra Narayan Agarwal");
  const [leadPhone, setLeadPhone] = useState<string>("+91 98201 44910");
  const [leadEmail, setLeadEmail] = useState<string>("devendra.agarwal@example.com");
  const [cityOfOrigin, setCityOfOrigin] = useState<string>("Lucknow, UP");
  
  const [paxAdults, setPaxAdults] = useState<number>(2);
  const [paxSeniors, setPaxSeniors] = useState<number>(2);
  const [specialSeva, setSpecialSeva] = useState<string>("Senior Wheelchair / Doli");
  const [dietaryPref, setDietaryPref] = useState<string>("Satvik Pure Veg (No Onion / Garlic)");
  const [helicopterAddon, setHelicopterAddon] = useState<boolean>(true);
  const [vipDarshanAddon, setVipDarshanAddon] = useState<boolean>(true);

  // Confirmed booking state
  const [confirmedBooking, setConfirmedBooking] = useState<PilgrimageBookingRecord | null>(null);
  const [bookingSuccessAlert, setBookingSuccessAlert] = useState<string | null>(null);

  // Operator Package Management form state
  const [packageFormData, setPackageFormData] = useState({
    packageName: "Sacred Char Dham Yatra (Kedarnath & Badrinath Deluxe Yatra)",
    destination: "Uttarakhand Himalaya (Kedarnath - Badrinath - Rishikesh)",
    temples: "Kedarnath Jyotirlinga, Badrinath Temple, Guptkashi, Joshimath, Mana Village",
    duration: "7 Days / 6 Nights",
    departure: "Haridwar Railway Station / Dehradun Airport (06:00 AM)",
    arrival: "Haridwar ISBT / Dehradun Drop (18:00 PM)",
    hotelDetails: "Deluxe Himalayan Pilgrim Guest Houses & Swiss Cottage Camp at Guptkashi",
    transport: "2x2 Deluxe Push-Back Air-Suspension Coach & Dedicated 4x4 Mountain Jeeps",
    meals: "Pure Satvik Vegetarian Meals (Breakfast, Lunch, High-Tea & Dinner - No Onion No Garlic)",
    guide: "Vedic Scholar Guide & Govt. Certified Mountain Yatra Marshal",
    groupCapacity: 35,
    adultPrice: 18500,
    seniorPrice: 16500,
    cancellation: "Full refund before 15 days of departure; 50% refund between 7-14 days.",
  });

  // Operator live booking management mock data
  const [operatorRosters, setOperatorRosters] = useState([
    {
      id: "YATRA-2026-8819",
      leader: "Devendra Narayan Agarwal (4 Devotees)",
      packageName: "Char Dham Yatra Deluxe (Kedarnath & Badrinath)",
      passengers: "2 Adults + 2 Senior Citizens (Wheelchair assistance requested)",
      transportSeat: "Coach A - Pushback Seats 12, 13, 14, 15",
      roomAllocated: "Guptkashi Room 204 & 205 (Ground Floor Deluxe)",
      guideAssigned: "Pandit Mukund Vyas (Yatra Marshal #04)",
      darshanSlot: "Kedarnath VIP 07:30 AM Sugam Slot Cleared",
      helipadPass: "Phata Helipad Shuttle #HL-09 (Boarding 06:15 AM)",
      status: "Confirmed (Advance Paid & Reconciled)",
    },
    {
      id: "YATRA-2026-8820",
      leader: "Shrikant & Suniti Kulkarni (2 Devotees)",
      packageName: "Kashi Vishwanath & Ayodhya Ram Mandir Darshan",
      passengers: "2 Adults (Pure Satvik Banarasi Meals)",
      transportSeat: "Coach B - Executive Seats 05, 06",
      roomAllocated: "Varanasi Heritage Yatra Niwas (Room 108)",
      guideAssigned: "Acharya Vidyadhar Shukla (Vedic Guide #02)",
      darshanSlot: "Ayodhya Ram Mandir Sugam Darshan Pass #AYO-892",
      helipadPass: "N/A (Ground Transit)",
      status: "Confirmed (Paid in Full)",
    },
    {
      id: "YATRA-2026-8821",
      leader: "Venkatesh & Lalitha Ramanathan (3 Devotees)",
      packageName: "Tirupati Balaji Sheegra Darshan & Sri Kalahasti",
      passengers: "3 Adults (Special Angapradakshinam Request)",
      transportSeat: "Coach C - Seats 01, 02, 03",
      roomAllocated: "Tirumala Hill Cottage B-14",
      guideAssigned: "Vedic Priest R. Sundaram (Marshal #08)",
      darshanSlot: "TTD Sheegra Darshan 06:00 AM Slot Confirmed",
      helipadPass: "N/A",
      status: "Confirmed (Advance Paid)",
    },
  ]);

  // Selected package reference
  const currentPackage = useMemo(() => {
    return packages.find((p) => p.packageId === selectedPackageId) || packages[0];
  }, [packages, selectedPackageId]);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const matchesCircuit = selectedCircuit === "all" || pkg.circuit === selectedCircuit;
      const matchesQuery =
        pkg.packageName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.temples.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        pkg.departureCity.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCircuit && matchesQuery;
    });
  }, [packages, selectedCircuit, searchQuery]);

  // Financial calculations for booking simulator
  const totalPax = paxAdults + paxSeniors;
  const baseAdultCost = paxAdults * (currentPackage?.basePriceAdult || 18500);
  const baseSeniorCost = paxSeniors * (currentPackage?.basePriceSenior || 16500);
  const vipDarshanCost = vipDarshanAddon ? totalPax * (currentPackage?.vipDarshanFee || 1500) : 0;
  const helicopterCost = helicopterAddon ? totalPax * (currentPackage?.helipadAddonPrice || 8500) : 0;
  const sevaCost = specialSeva.includes("Wheelchair") ? 2500 : specialSeva.includes("Puja") ? 1500 : 500;
  const subTotalCost = baseAdultCost + baseSeniorCost + vipDarshanCost + helicopterCost + sevaCost;
  const gstCost = Math.round(subTotalCost * 0.05);
  const totalYatraFare = subTotalCost + gstCost;

  // Handle devotee booking submission
  const handleExecuteBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackage) return;

    const passengerList: PilgrimagePassenger[] = [];
    for (let i = 0; i < paxAdults; i++) {
      passengerList.push({
        id: `PAX-${Date.now()}-${i}`,
        fullName: i === 0 ? leadDevoteeName : `${leadDevoteeName} (Accompanying Adult ${i + 1})`,
        age: 38 + i * 2,
        gender: i % 2 === 0 ? "Male" : "Female",
        aadhaarToken: `AADHAAR-HASH-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
        specialSeva: i === 0 ? (specialSeva as any) : "None",
        highAltitudeFitnessOk: true,
      });
    }
    for (let j = 0; j < paxSeniors; j++) {
      passengerList.push({
        id: `PAX-SNR-${Date.now()}-${j}`,
        fullName: `Elder Devotee ${j + 1} (${leadDevoteeName.split(" ")[0]} Family)`,
        age: 63 + j * 3,
        gender: j % 2 === 0 ? "Male" : "Female",
        aadhaarToken: `AADHAAR-HASH-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
        specialSeva: "Senior Wheelchair / Doli",
        highAltitudeFitnessOk: true,
      });
    }

    const booking = pilgrimageService.createCustomerBooking({
      packageId: currentPackage.packageId,
      customer: {
        customerId: `CUST-IN-${Math.floor(10000 + Math.random() * 90000)}`,
        fullName: leadDevoteeName,
        phone: leadPhone,
        email: leadEmail,
        city: cityOfOrigin.split(",")[0].trim(),
        state: cityOfOrigin.split(",")[1]?.trim() || "Uttar Pradesh",
        emergencyContactName: "Acharya Rajesh Shastri (Family Guruji)",
        emergencyContactPhone: "+91 98201 99882",
        isSeniorCitizenPriority: paxSeniors > 0,
        medicalFitnessDeclared: true,
      },
      travelDate,
      passengers: passengerList,
      hasHelicopterAddon: helicopterAddon,
      paymentMethod: "UPI",
    });

    setConfirmedBooking(booking);
    setBookingSuccessAlert(
      `Sacred Yatra Booking Confirmed! Ref: ${booking.bookingId}. E-Pass with biometric permit generated and registered into Central Pilgrimage Ledger.`
    );
  };

  const handlePrintOrDownloadPass = () => {
    alert(
      `Downloading Govt Shrine Board Digital Pass & QR E-Kit for ${confirmedBooking?.bookingId || "YATRA-2026"}...\nIncludes: Kedarnath Sugam Darshan Parchi, Helipad Token, Coach Seat Allotments & Medical Advisory.`
    );
  };

  return (
    <div className="space-y-6">
      {/* ======================================================================= */}
      {/* TOP UNIFIED MERGED HEADER & TELEMETRY BAR */}
      {/* ======================================================================= */}
      <div className="bg-gradient-to-r from-slate-950 via-orange-950/40 to-slate-950 border border-orange-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1.5">
                <Sun className="w-3 h-3 text-orange-400" />
                <span>Bharat Yatra Sacred Pilgrimage Suite</span>
              </span>
              <span className="px-3 py-0.5 rounded-full text-2xs font-extrabold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Pilgrimage Governance &amp; Circuits
              </span>
              <span className="px-3 py-0.5 rounded-full text-2xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hidden sm:inline-flex">
                Zero Frontend Leakage
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Divya Darshan, Char Dham &amp; Shrine Board Central Authority</span>
            </h2>

            <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
              Unified control center bridging <strong>Devotee Yatra Booking &amp; Packages</strong>, certified{" "}
              <strong>Yatra Samiti Operations</strong>, and the complete <strong>7-Stage Administrative Governance Pipeline</strong>{" "}
              (Circuits, Operators Accreditation, Packages, Bookings, Escrow Settlements, Compliance).
            </p>
          </div>

          {/* Quick Metrics & Direct Jump Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
              <span className="text-3xs text-slate-400 block font-semibold">Active Yatra GMV</span>
              <span className="text-sm font-black text-orange-400">₹1.42 Cr / mo</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
              <span className="text-3xs text-slate-400 block font-semibold">Accredited Samitis</span>
              <span className="text-sm font-black text-emerald-400">412 Samitis</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-left">
              <span className="text-3xs text-slate-400 block font-semibold">Devotees Served</span>
              <span className="text-sm font-black text-white">38,400 Devotees</span>
            </div>
          </div>
        </div>

        {/* Action alert toast */}
        {bookingSuccessAlert && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{bookingSuccessAlert}</span>
            </div>
            <button
              onClick={() => setBookingSuccessAlert(null)}
              className="text-2xs text-slate-400 hover:text-white underline shrink-0 cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      {/* ======================================================================= */}
      {/* 5 PRIMARY TABS NAVIGATION BAR */}
      {/* ======================================================================= */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2 shadow-lg">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("pilgrimage_yatra")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubView === "pilgrimage_yatra"
                ? "bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-orange-300" />
            <span>1. Pilgrimage Yatra (Devotee &amp; Packages Hub)</span>
          </button>

          <button
            onClick={() => setActiveSubView("pilgrimage_admin_pipeline")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubView === "pilgrimage_admin_pipeline"
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/20"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
            <span>2. Pilgrimage Admin (7-Stage Pipeline)</span>
          </button>

          <button
            onClick={() => setActiveSubView("operator_booking_management")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubView === "operator_booking_management"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-300" />
            <span>3. Operator Desk</span>
          </button>

          <button
            onClick={() => setActiveSubView("pilgrimage_package_management")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubView === "pilgrimage_package_management"
                ? "bg-amber-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            <span>4. Package Builder</span>
          </button>

          <button
            onClick={() => setActiveSubView("backend_modules")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSubView === "backend_modules"
                ? "bg-rose-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-900"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-rose-300" />
            <span>5. Microservices &amp; Isolation</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {onOpenAdminPlatform && (
            <button
              onClick={onOpenAdminPlatform}
              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Building className="w-3.5 h-3.5" />
              <span>Master Admin Console</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================================= */}
      {/* TAB 1: PILGRIMAGE YATRA (DEVOTEE BOOKING & PACKAGES EXPLORER) */}
      {/* ======================================================================= */}
      {activeSubView === "pilgrimage_yatra" && (
        <div className="space-y-6">
          {/* Circuit Filter & Search Bar */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-2xs font-extrabold uppercase text-slate-400 flex items-center gap-1">
                <Filter className="w-3 h-3 text-orange-400" />
                Sacred Circuits:
              </span>
              {[
                { id: "all", label: "All Circuits" },
                { id: "Char Dham", label: "Char Dham (Himalaya)" },
                { id: "12 Jyotirlinga", label: "12 Jyotirlinga" },
                { id: "Kashi & Ayodhya", label: "Kashi & Ayodhya" },
                { id: "Vaishno Devi", label: "Mata Vaishno Devi" },
                { id: "South Temple Circuit", label: "Tirupati Balaji" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCircuit(c.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCircuit === c.id
                      ? "bg-orange-500 text-slate-950 shadow-md font-black"
                      : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search deity, temple, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-400 font-medium"
              />
            </div>
          </div>

          {/* Packages Catalog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPackages.map((pkg) => {
              const isSelected = pkg.packageId === selectedPackageId;
              return (
                <div
                  key={pkg.packageId}
                  onClick={() => setSelectedPackageId(pkg.packageId)}
                  className={`rounded-3xl p-5 border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "bg-slate-900/90 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/40"
                      : "bg-slate-950/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative h-40 rounded-2xl overflow-hidden border border-slate-800">
                      <img
                        src={pkg.image}
                        alt={pkg.packageName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                      
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full text-3xs font-extrabold uppercase bg-orange-500 text-slate-950 shadow-sm">
                          {pkg.circuit}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-3xs font-bold bg-slate-900/80 text-white border border-slate-700">
                          {pkg.duration}
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-2xs text-white">
                        <span className="flex items-center gap-1 font-bold">
                          <MapPin className="w-3 h-3 text-orange-400" />
                          {pkg.departureCity}
                        </span>
                        <span className="flex items-center gap-1 font-bold text-amber-300">
                          <Star className="w-3 h-3 fill-amber-300" />
                          {pkg.rating} ({pkg.reviewsCount})
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-black text-white text-sm leading-snug line-clamp-2">
                        {pkg.packageName}
                      </h4>
                      <p className="text-2xs text-slate-400 mt-1 line-clamp-2">
                        {pkg.temples.join(" • ")}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-2xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Transport:</span>
                        <span className="font-semibold text-white truncate max-w-[170px]">{pkg.transportVehicle}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Meals:</span>
                        <span className="font-semibold text-emerald-400">100% Satvik Pure Veg</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="text-slate-400">Next Batch:</span>
                        <span className="font-bold text-orange-300">{pkg.availableBatchDates[0]} ({pkg.remainingSeatsCurrentBatch} seats left)</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-3xs text-slate-400 block font-medium">Starting from</span>
                      <span className="text-base font-black text-white">₹{pkg.basePriceAdult.toLocaleString()}</span>
                      <span className="text-3xs text-slate-400 ml-1">/ devotee</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPackageId(pkg.packageId);
                      }}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? "bg-orange-500 text-slate-950 font-black shadow-md"
                          : "bg-slate-800 text-slate-300 hover:text-white"
                      }`}
                    >
                      {isSelected ? "Selected ✓" : "Configure Devotees"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* =================================================================== */}
          {/* INTERACTIVE DEVOTEE BOOKING SIMULATOR */}
          {/* =================================================================== */}
          <div className="bg-slate-950 border border-orange-500/40 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40">
                  Devotee Booking &amp; Sugam Darshan Pass Simulator
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Book Sacred Yatra for {currentPackage?.packageName}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-orange-300">
                Operator: {currentPackage?.operatorName}
              </span>
            </div>

            <form onSubmit={handleExecuteBooking} className="space-y-6">
              {/* Devotee Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Lead Devotee Full Name</label>
                  <input
                    type="text"
                    value={leadDevoteeName}
                    onChange={(e) => setLeadDevoteeName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mobile Number (for E-Pass WhatsApp)</label>
                  <input
                    type="text"
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-orange-400 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Departure Holy City / Base</label>
                  <input
                    type="text"
                    value={cityOfOrigin}
                    onChange={(e) => setCityOfOrigin(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Select Departure Batch Date</label>
                  <select
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-orange-400 focus:outline-none"
                  >
                    {currentPackage?.availableBatchDates.map((d) => (
                      <option key={d} value={d}>
                        {d} (Confirmed Batch)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Devotees Count & Inclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Adult Devotees (₹{currentPackage?.basePriceAdult.toLocaleString()}/each)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={paxAdults}
                    onChange={(e) => setPaxAdults(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">
                    Senior Citizens 60+ (₹{currentPackage?.basePriceSenior.toLocaleString()}/each)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="15"
                    value={paxSeniors}
                    onChange={(e) => setPaxSeniors(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-orange-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Special Seva &amp; Senior Assist</label>
                  <select
                    value={specialSeva}
                    onChange={(e) => setSpecialSeva(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-orange-400 focus:outline-none"
                  >
                    <option value="Senior Wheelchair / Doli">Senior Wheelchair / Doli (+₹2,500)</option>
                    <option value="Rudrabhishek Puja">Special Rudrabhishek Puja (+₹1,500)</option>
                    <option value="Aarti Pass">Evening Aarti Priority (+₹500)</option>
                    <option value="None">Standard Yatra Seva</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Satvik Prasadam Diet Plan</label>
                  <select
                    value={dietaryPref}
                    onChange={(e) => setDietaryPref(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-orange-400 focus:outline-none"
                  >
                    <option value="Satvik Pure Veg (No Onion / Garlic)">Satvik Pure Veg (No Onion / Garlic)</option>
                    <option value="Jain Satvik (Strict Root-Free)">Jain Satvik (Strict Root-Free)</option>
                    <option value="Falahari Fasting Diet">Falahari Fasting Diet</option>
                  </select>
                </div>
              </div>

              {/* Priority Add-ons Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setHelicopterAddon(!helicopterAddon)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    helicopterAddon
                      ? "bg-orange-950/40 border-orange-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="w-5 h-5 text-orange-400" />
                    <div>
                      <span className="font-bold block text-white text-xs">
                        Kedarnath / Katra Helipad Priority Shuttle
                      </span>
                      <span className="text-2xs text-slate-400">
                        Himalayan Heli transfer from Phata/Sersi or Sanjichhat (+₹{currentPackage?.helipadAddonPrice.toLocaleString()}/devotee)
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-3xs font-extrabold font-mono ${
                    helicopterAddon ? "bg-orange-500 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}>
                    {helicopterAddon ? "INCLUDED ✓" : "+ ADD"}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVipDarshanAddon(!vipDarshanAddon)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    vipDarshanAddon
                      ? "bg-purple-950/40 border-purple-500 text-white"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Sun className="w-5 h-5 text-purple-400" />
                    <div>
                      <span className="font-bold block text-white text-xs">
                        Guaranteed VIP Sugam Darshan &amp; Archana Pass
                      </span>
                      <span className="text-2xs text-slate-400">
                        Official Shrine Board privileged early morning sanctum slot (+₹{currentPackage?.vipDarshanFee.toLocaleString()}/devotee)
                      </span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-xl text-3xs font-extrabold font-mono ${
                    vipDarshanAddon ? "bg-purple-500 text-slate-950" : "bg-slate-800 text-slate-400"
                  }`}>
                    {vipDarshanAddon ? "INCLUDED ✓" : "+ ADD"}
                  </span>
                </button>
              </div>

              {/* Price Calculation & Checkout Footer */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-sm font-black text-white block">
                      Fare Summary ({totalPax} Devotees: {paxAdults} Adults + {paxSeniors} Seniors)
                    </span>
                    <p className="text-2xs text-slate-400 mt-0.5">
                      Base Fare: ₹{(baseAdultCost + baseSeniorCost).toLocaleString()} &bull; VIP Darshan: ₹{vipDarshanCost.toLocaleString()} &bull; Heli Shuttle: ₹{helicopterCost.toLocaleString()} &bull; GST (5%): ₹{gstCost.toLocaleString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-3xs text-slate-400 block font-semibold">Total Sacred Yatra Fare</span>
                    <span className="text-xl font-black text-white">₹{totalYatraFare.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Includes Medical Oxygen Support, 4x4 Mountain Jeeps &amp; Verified Purohit Guide.
                  </span>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 font-black text-xs shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{totalYatraFare.toLocaleString()} &amp; Confirm Sacred Yatra</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Render Confirmed Booking E-Pass Permit Card */}
            {confirmedBooking && (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border border-emerald-500/50 space-y-4 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-500/30 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span className="font-black text-white text-base">
                        Shrine Board Digital Yatra Pass Generated
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                        CONFIRMED &amp; VERIFIED
                      </span>
                    </div>
                    <span className="text-2xs text-emerald-200 mt-0.5 block">
                      Booking Ref: <strong className="font-mono text-white">{confirmedBooking.bookingId}</strong> &bull; Ticket: <strong className="font-mono text-white">{confirmedBooking.ticketNumber}</strong> &bull; Tax Invoice: <strong className="font-mono text-white">{confirmedBooking.taxInvoiceNumber}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrintOrDownloadPass}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Permit Kit (PDF)</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveSubView("pilgrimage_admin_pipeline");
                        setAdminStage("bookings");
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-colors cursor-pointer"
                      title="View this newly created booking in Pilgrimage Admin Devotee Manifest"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>View in Pilgrimage Admin ➔</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Devotee Lead &amp; Pax</span>
                    <span className="text-xs font-bold text-white block">{confirmedBooking.customer.fullName}</span>
                    <span className="text-3xs text-slate-400 font-mono block">{confirmedBooking.passengersCount.total} Devotees ({confirmedBooking.passengersCount.adults} Adults, {confirmedBooking.passengersCount.seniors} Seniors)</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Sugam Darshan Time Slot</span>
                    <span className="text-xs font-bold text-amber-300 block">{confirmedBooking.darshanSlotTime}</span>
                    <span className="text-3xs text-slate-400 block">Sanctum Sanctorum Escorted Entry</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Assigned Vedic Guide</span>
                    <span className="text-xs font-bold text-white block">{confirmedBooking.assignedVedicGuide?.name}</span>
                    <span className="text-3xs text-slate-400 font-mono block">Phone: {confirmedBooking.assignedVedicGuide?.phone}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-3xs text-slate-400 block font-semibold">Coach Seats &amp; Room</span>
                    <span className="text-xs font-bold text-emerald-300 block">{confirmedBooking.transportSeats.join(", ")}</span>
                    <span className="text-3xs text-slate-400 block">{confirmedBooking.accommodationType}</span>
                  </div>
                </div>

                {/* Shrine QR payload banner */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-2xs font-mono text-slate-300">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="truncate">Permit Token: {confirmedBooking.shrineBoardQrPayload}</span>
                  </div>
                  <span className="text-emerald-400 font-bold shrink-0">Biometrics Cleared ✓</span>
                </div>
              </div>
            )}
          </div>

          {/* Certified Pilgrimage Operators & Samitis Showcase */}
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Govt Empanelled Yatra Samitis
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  Accredited Spiritual Tour Operators Directory
                </h3>
              </div>
              <span className="text-2xs text-slate-400">
                All 412 Operators adhere to Ministry of Tourism &amp; State Shrine Board safety protocols.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              {operators.map((op) => (
                <div
                  key={op.operatorId}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs line-clamp-1">{op.samitiName}</span>
                    <span className="px-2 py-0.5 rounded-full text-3xs font-bold uppercase bg-emerald-500/20 text-emerald-300">
                      {op.verificationStatus}
                    </span>
                  </div>

                  <div className="space-y-1 text-2xs text-slate-400">
                    <p>Head Priest: <strong className="text-white">{op.headPriestName}</strong></p>
                    <p>Base: <span className="text-slate-300">{op.headquartersCity}</span></p>
                    <p>Circuits: <span className="text-orange-300">{op.circuitsCovered.join(", ")}</span></p>
                    <div className="flex items-center justify-between pt-1 font-mono text-3xs">
                      <span>Fleet: {op.fleetBusesCount} AC Coaches</span>
                      <span className="text-amber-300">★ {op.rating} ({op.totalPilgrimsServed.toLocaleString()} Devotees)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 2: PILGRIMAGE ADMIN (7-STAGE ADMINISTRATIVE PIPELINE EMBEDDED) */}
      {/* ======================================================================= */}
      {activeSubView === "pilgrimage_admin_pipeline" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-purple-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  <ShieldCheck className="w-5 h-5 text-purple-400" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    Integrated Pilgrimage Admin 7-Step Pipeline
                  </h3>
                  <p className="text-2xs text-slate-400">
                    Master administrative workflow governing shrine tokens, operator licenses, batches, devotee manifests, escrow settlements, and compliance reports.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveSubView("pilgrimage_yatra")}
                  className="px-3 py-1.5 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/40 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sun className="w-3.5 h-3.5 text-orange-400" />
                  <span>Switch to Devotee Booking Hub</span>
                </button>
              </div>
            </div>

            {/* The complete 7-stage administrative pipeline component */}
            <PilgrimageAdminPipelineView
              initialStage={adminStage}
              onNavigateStage={setAdminStage}
              onSwitchToYatraBooking={() => setActiveSubView("pilgrimage_yatra")}
            />
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 3: OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
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
                Desk: Haridwar &amp; Rishikesh Base Station
              </span>
            </div>

            <div className="space-y-3">
              {operatorRosters.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.leader}</span>
                      <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-mono text-3xs">
                        {item.id}
                      </span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.packageName} &bull; <span className="text-white font-semibold">{item.passengers}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.transportSeat} &bull; {item.roomAllocated} &bull; {item.darshanSlot}
                    </div>
                    {item.helipadPass !== "N/A" && (
                      <div className="text-orange-400 text-3xs font-mono">
                        Helipad Priority: {item.helipadPass}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`Official Pilgrimage Yatra Kit & Boarding Pass dispatched to ${item.leader} via WhatsApp & SMS!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs transition-colors cursor-pointer"
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
      {/* TAB 4: YATRA PACKAGE MANAGEMENT & BUILDER */}
      {/* ======================================================================= */}
      {activeSubView === "pilgrimage_package_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Pilgrimage Package Builder
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Create &amp; Publish Sacred Yatra Packages
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-amber-300">
                Operator Samiti Portal
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Package Title</label>
                <input
                  type="text"
                  value={packageFormData.packageName}
                  onChange={(e) => setPackageFormData({ ...packageFormData, packageName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Duration</label>
                <input
                  type="text"
                  value={packageFormData.duration}
                  onChange={(e) => setPackageFormData({ ...packageFormData, duration: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Destinations &amp; Temples Covered</label>
                <input
                  type="text"
                  value={packageFormData.temples}
                  onChange={(e) => setPackageFormData({ ...packageFormData, temples: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Batch Seat Capacity</label>
                <input
                  type="number"
                  value={packageFormData.groupCapacity}
                  onChange={(e) => setPackageFormData({ ...packageFormData, groupCapacity: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Adult Base Price (₹)</label>
                <input
                  type="number"
                  value={packageFormData.adultPrice}
                  onChange={(e) => setPackageFormData({ ...packageFormData, adultPrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Senior Citizen Price (₹)</label>
                <input
                  type="number"
                  value={packageFormData.seniorPrice}
                  onChange={(e) => setPackageFormData({ ...packageFormData, seniorPrice: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Mountain Transport Mode</label>
                <input
                  type="text"
                  value={packageFormData.transport}
                  onChange={(e) => setPackageFormData({ ...packageFormData, transport: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  alert("Sacred Yatra Package successfully updated and published to Devotee Catalog!");
                  setActiveSubView("pilgrimage_yatra");
                }}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg transition-all cursor-pointer"
              >
                Publish Yatra Package to Devotees
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TAB 5: BACKEND MODULES — ZERO FRONTEND EXPOSURE GUARANTEE */}
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
    </div>
  );
}
