import React, { useState } from "react";
import {
  X,
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  CreditCard,
  Settings,
  ShieldCheck,
  Building2,
  Bus,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  FileText,
  Phone,
  Mail,
  MapPin,
  Star,
  Compass,
  ArrowUpRight,
  Printer,
  ChevronRight,
  Sparkles,
  Flame,
  UtensilsCrossed,
  Heart,
  Server,
  Key,
  Database,
  Radio,
  RefreshCw,
  Edit3,
  SlidersHorizontal,
  UserCheck,
} from "lucide-react";
import {
  PilgrimageOperatorProfile,
  PilgrimageYatraPackage,
  PilgrimageBookingRecord,
  PilgrimageRoomInventory,
  PilgrimageTransportFleet,
  PilgrimagePriestGuide,
  PilgrimageSettlementRecord,
} from "../../types";
import {
  PILGRIMAGE_OPERATORS_DATABASE,
  PILGRIMAGE_PACKAGES_DATABASE,
  INITIAL_PILGRIMAGE_BOOKINGS,
  PILGRIMAGE_ROOM_INVENTORIES,
  PILGRIMAGE_FLEET_DATABASE,
  PILGRIMAGE_PRIEST_ROSTER,
  PILGRIMAGE_SETTLEMENTS_DATABASE,
} from "../../data/pilgrimageOperatorData";

interface PilgrimageOperatorBackendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PilgrimageOperatorBackendModal({
  isOpen,
  onClose,
}: PilgrimageOperatorBackendModalProps) {
  if (!isOpen) return null;

  // Selected Operator
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("op-divya-yatra");
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "packages"
    | "pilgrims"
    | "accommodation"
    | "transport"
    | "priests"
    | "bookings"
    | "settlements"
    | "operations"
    | "kyc"
    | "technical_backend"
  >("dashboard");

  // Local State
  const [bookingsList, setBookingsList] = useState<PilgrimageBookingRecord[]>(INITIAL_PILGRIMAGE_BOOKINGS);
  const [packagesList, setPackagesList] = useState<PilgrimageYatraPackage[]>(PILGRIMAGE_PACKAGES_DATABASE);
  const [roomList, setRoomList] = useState<PilgrimageRoomInventory[]>(PILGRIMAGE_ROOM_INVENTORIES);
  const [fleetList, setFleetList] = useState<PilgrimageTransportFleet[]>(PILGRIMAGE_FLEET_DATABASE);
  const [priestList, setPriestList] = useState<PilgrimagePriestGuide[]>(PILGRIMAGE_PRIEST_ROSTER);
  const [settlementsList, setSettlementsList] = useState<PilgrimageSettlementRecord[]>(PILGRIMAGE_SETTLEMENTS_DATABASE);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>("all");
  const [settlementSuccessNotice, setSettlementSuccessNotice] = useState<string | null>(null);

  // New Package Modal
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [newPkgTitle, setNewPkgTitle] = useState("");
  const [newPkgCircuit, setNewPkgCircuit] = useState<any>("Char Dham");
  const [newPkgPrice, setNewPkgPrice] = useState(35000);
  const [newPkgDuration, setNewPkgDuration] = useState("6 Days / 5 Nights");

  const currentOperator =
    PILGRIMAGE_OPERATORS_DATABASE.find((op) => op.id === selectedOperatorId) ||
    PILGRIMAGE_OPERATORS_DATABASE[0];

  const operatorBookings = bookingsList.filter((b) => b.operatorId === currentOperator.id);

  // Calculated Metrics
  const totalGrossGmv = operatorBookings.reduce((sum, b) => sum + b.fareBreakdown.totalPayable, 0);
  const totalCommission = operatorBookings.reduce((sum, b) => sum + b.fareBreakdown.platformFee, 0);
  const totalNetEarnings = totalGrossGmv - totalCommission;
  const totalYatrisCount = operatorBookings.reduce((sum, b) => sum + b.totalPilgrims, 0);

  const handleBookingStatusChange = (bookingId: string, newStatus: PilgrimageBookingRecord["status"]) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleRequestPayout = () => {
    const newSettlement: PilgrimageSettlementRecord = {
      id: `stl-pilgrim-${Date.now().toString().slice(-4)}`,
      payoutRef: `PO-DY-2026-REQ-${Math.floor(100 + Math.random() * 900)}`,
      period: "Instant Disbursal Request",
      grossBookingsAmount: 491000,
      platformFee: 14730,
      tdsDeducted: 4910,
      netSettlementAmount: 471360,
      status: "PROCESSING",
      settledDate: "Processing Instant RTGS",
      utrNumber: "RTGS-INITIATED-AUTO",
      bankAccountMasked: currentOperator.bankSettlement.accountNumberMasked,
    };
    setSettlementsList([newSettlement, ...settlementsList]);
    setSettlementSuccessNotice("Instant Payout Request for ₹4,71,360 initiated to your SBI Pilgrim Account via RTGS!");
    setTimeout(() => setSettlementSuccessNotice(null), 5000);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgTitle) return;

    const newPkg: PilgrimageYatraPackage = {
      id: `pkg-custom-${Date.now().toString().slice(-4)}`,
      operatorId: currentOperator.id,
      operatorName: currentOperator.businessName,
      title: newPkgTitle,
      hindiTitle: `${newPkgTitle} (दिव्य यात्रा)`,
      circuitCategory: newPkgCircuit,
      sacredDeity: "Lord Shiva & Divine Deities",
      destinationsCovered: ["Haridwar", "Rishikesh", "Sacred Shrines"],
      durationDays: 6,
      durationNights: 5,
      duration: newPkgDuration,
      featuredImage: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
      galleryImages: ["https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800"],
      basePricePerPerson: newPkgPrice,
      originalPrice: Math.round(newPkgPrice * 1.2),
      groupDiscountPercent: 10,
      rating: 5.0,
      reviewsCount: 1,
      departureDates: [
        { id: `b-${Date.now()}`, date: "2026-10-05", returnDate: "2026-10-10", totalSeats: 20, availableSeats: 20, status: "OPEN", batchPricePerPerson: newPkgPrice }
      ],
      inclusions: ["Deluxe Hotel Stays", "Sattvic Food", "VIP Passes", "Vedic Purohit"],
      exclusions: ["Personal pooja dakshina", "GST 5%"],
      itinerary: [
        { day: 1, title: "Assembly & Welcome Aarti", places: ["Rishikesh"], morningRitual: "Ganga Snan", eveningRitual: "Ganga Aarti", nightHalt: "Resort", mealsIncluded: ["Dinner"] }
      ],
      accommodationDetails: {
        type: "3-Star Deluxe Hotel",
        name: "Deluxe AC Cottages",
        description: "Pure sattvic kitchens with heating & hot water.",
        amenities: ["Room Heaters", "Hot Water"],
        pureSatvikDining: true,
        oxygenAvailable: true,
      },
      transportDetails: {
        mode: "AC Volvo Coach",
        vehicleModel: "Volvo 9600 AC Coach",
        gpsTracking: true,
        certifiedPahadiDriver: true,
        description: "Hill-certified driver with live GPS.",
      },
      darshanServices: {
        vipSugamPassIncluded: true,
        templePassType: "Sugam VIP Pass",
        priorityQueueAccess: true,
        aartiPasses: ["Evening Aarti"],
      },
      priestGuideServices: {
        vedicPurohitAssigned: true,
        pujariSamagriIncluded: true,
        spiritualGuideLanguages: ["Hindi", "English"],
        personalSankalp: true,
      },
      mealPlan: {
        type: "Pure Sattvic (No Onion / No Garlic)",
        breakfast: "Poha, Idli, Tea",
        lunch: "Satvik Thali",
        dinner: "Khichdi & Rotis",
        jainOption: true,
        vratSpecial: true,
      },
      specialAssistance: {
        wheelchairAvailable: true,
        palkiPonySupport: true,
        batteryCarAssistance: true,
        portableOxygenKit: true,
      },
    };

    setPackagesList([newPkg, ...packagesList]);
    setShowAddPackageModal(false);
    setNewPkgTitle("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-amber-400/40 my-auto">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-950 via-yellow-950 to-stone-900 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 border-b border-amber-500/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Pilgrimage Operator Enterprise Console
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black uppercase">
                  Operator Backend (Secured)
                </span>
              </div>
              <p className="text-xs text-amber-200/90 flex items-center gap-2">
                <span>{currentOperator.businessName}</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">
                  ✓ {currentOperator.verification.badgeText}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
              className="hidden md:block px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs border border-white/20 font-bold focus:outline-hidden"
            >
              {PILGRIMAGE_OPERATORS_DATABASE.map((op) => (
                <option key={op.id} value={op.id} className="text-slate-900">
                  {op.brandName}
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Bar */}
        {settlementSuccessNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{settlementSuccessNotice}</span>
          </div>
        )}

        {/* Main Body (Sidebar + Content) */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-60 bg-slate-900 text-slate-300 p-3 flex flex-col justify-between shrink-0 overflow-y-auto hidden md:flex border-r border-slate-800">
            <div className="space-y-1 text-xs">
              {[
                { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
                { id: "packages", label: "Yatra Packages & Dates", icon: Package },
                { id: "pilgrims", label: "Pilgrim Manifests", icon: Users },
                { id: "accommodation", label: "Rooms & Ashrams", icon: Building2 },
                { id: "transport", label: "Fleet & Heli Shuttles", icon: Bus },
                { id: "priests", label: "Vedic Purohits & Guides", icon: Flame },
                { id: "bookings", label: "Bookings & PNR CRM", icon: FileText },
                { id: "settlements", label: "Bank Payouts & Tax", icon: CreditCard },
                { id: "operations", label: "Live Departures & SOS", icon: Radio },
                { id: "kyc", label: "KYC & Temple Badges", icon: ShieldCheck },
                { id: "technical_backend", label: "Technical API Gateway", icon: Server },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all text-left ${
                      activeTab === item.id
                        ? "bg-amber-500 text-slate-950 shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/80"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Operator Quick Status Box */}
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] space-y-1 text-slate-300 mt-4">
              <span className="text-[10px] text-amber-400 font-extrabold uppercase block">
                Govt Empanelled Operator
              </span>
              <p className="text-slate-400">GST: {currentOperator.bankSettlement.gstin}</p>
              <p className="text-emerald-400 font-bold">✓ Daily T+1 Auto Disbursal</p>
            </div>
          </div>

          {/* Right Scrollable Content Pane */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 space-y-6">
            {/* Mobile Tab Navigation Bar */}
            <div className="flex md:hidden overflow-x-auto gap-1 pb-2 text-xs">
              {[
                { id: "dashboard", label: "Dashboard" },
                { id: "packages", label: "Packages" },
                { id: "pilgrims", label: "Pilgrims" },
                { id: "accommodation", label: "Rooms" },
                { id: "transport", label: "Fleet" },
                { id: "priests", label: "Purohits" },
                { id: "bookings", label: "Bookings" },
                { id: "settlements", label: "Payouts" },
                { id: "operations", label: "Operations" },
                { id: "kyc", label: "KYC" },
                { id: "technical_backend", label: "API Gateway" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-amber-500 text-slate-950"
                      : "bg-white text-slate-700 border border-slate-200"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* MODULE 1: Executive Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                {/* 4 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Gross Yatra GMV</span>
                    <span className="text-2xl font-black text-slate-900 block">
                      ₹{totalGrossGmv.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +28% vs Last Month
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Net Operator Earnings</span>
                    <span className="text-2xl font-black text-amber-900 block">
                      ₹{totalNetEarnings.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] text-slate-500">Platform Fee: ₹{totalCommission}</span>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Total Yatris Booked</span>
                    <span className="text-2xl font-black text-slate-900 block">{totalYatrisCount} Pilgrims</span>
                    <span className="text-[11px] text-amber-700 font-semibold">
                      {operatorBookings.reduce((sum, b) => sum + b.seniorCount, 0)} Senior Citizens
                    </span>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Batch Occupancy Rate</span>
                    <span className="text-2xl font-black text-emerald-700 block">89.4%</span>
                    <span className="text-[11px] text-emerald-600 font-bold">24 Open Seats Remaining</span>
                  </div>
                </div>

                {/* Quick Action Banner */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md">
                  <div className="space-y-1">
                    <h3 className="text-base font-black">2026 High Yatra Season Control Room Active</h3>
                    <p className="text-xs font-semibold text-slate-900/90">
                      Helicopter slots at Sahastradhara and VIP Sugam passes at Kedarnath &amp; Kashi Vishwanath are pre-allocated.
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => setShowAddPackageModal(true)}
                      className="px-4 py-2 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 flex items-center gap-1 shadow-md"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Yatra Package</span>
                    </button>
                    <button
                      onClick={handleRequestPayout}
                      className="px-4 py-2 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-slate-100 flex items-center gap-1 shadow-md"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Request Instant RTGS</span>
                    </button>
                  </div>
                </div>

                {/* Recent Pilgrims Manifest Snapshot */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      Upcoming Yatra Departures &amp; Confirmed PNRs
                    </h3>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                    >
                      <span>View All Bookings</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    {operatorBookings.map((b) => (
                      <div key={b.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900">{b.pnrNumber}</span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                              {b.status}
                            </span>
                            <span className="text-slate-400">•</span>
                            <span className="font-bold text-amber-900">{b.packageName}</span>
                          </div>
                          <p className="text-slate-500 mt-0.5">
                            Lead Yatri: {b.leadPilgrim.name} ({b.leadPilgrim.phone}) • {b.totalPilgrims} Yatris • Dep: {b.departureDate}
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="font-black text-slate-900 block">
                            ₹{b.fareBreakdown.totalPayable.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold">
                            Paid via {b.paymentDetails.paymentMethod}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 2: Yatra Packages & Dates Management */}
            {activeTab === "packages" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Yatra Packages &amp; Departure Inventory</h3>
                    <p className="text-xs text-slate-500">Manage circuits, departure schedules, and pricing rules.</p>
                  </div>
                  <button
                    onClick={() => setShowAddPackageModal(true)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Package</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packagesList.map((pkg) => (
                    <div
                      key={pkg.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs hover:border-amber-400 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold uppercase">
                            {pkg.circuitCategory}
                          </span>
                          <h4 className="font-black text-slate-900 text-base mt-1">{pkg.title}</h4>
                          <p className="text-xs text-slate-500">{pkg.duration} • Deity: {pkg.sacredDeity}</p>
                        </div>
                        <span className="text-lg font-black text-amber-900">
                          ₹{pkg.basePricePerPerson.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Departure Batches */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                        <span className="font-extrabold text-slate-700 text-[11px] uppercase">
                          Batches &amp; Seats Allocation:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {pkg.departureDates.map((b) => (
                            <span
                              key={b.id}
                              className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-800"
                            >
                              📅 {b.date} ({b.availableSeats}/{b.totalSeats} seats)
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-semibold">
                          ⭐ {pkg.rating} ({pkg.reviewsCount} reviews)
                        </span>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-slate-700">
                            Edit Package
                          </button>
                          <button className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800">
                            Manage Batches
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 3: Pilgrim Manifests & Database */}
            {activeTab === "pilgrims" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Pilgrim Manifests &amp; Yatri Database</h3>
                    <p className="text-xs text-slate-500">Full manifest of pilgrims with senior medical checklist &amp; Aadhaar records.</p>
                  </div>
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Manifest PDF</span>
                  </button>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-200 uppercase text-[10px] tracking-wider font-extrabold">
                        <tr>
                          <th className="p-3.5">PNR / Ref</th>
                          <th className="p-3.5">Yatri Name &amp; Age</th>
                          <th className="p-3.5">Govt ID Proof</th>
                          <th className="p-3.5">Senior / Medical</th>
                          <th className="p-3.5">Yatra Circuit</th>
                          <th className="p-3.5">Allocated Stay / Vehicle</th>
                          <th className="p-3.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {operatorBookings.flatMap((b) =>
                          b.pilgrims.map((p, idx) => (
                            <tr key={`${b.id}-${idx}`} className="hover:bg-slate-50/80">
                              <td className="p-3.5 font-bold text-slate-900">{b.pnrNumber}</td>
                              <td className="p-3.5">
                                <span className="font-extrabold text-slate-900 block">{p.fullName}</span>
                                <span className="text-slate-500 text-[11px]">{p.age} yrs • {p.gender}</span>
                              </td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 block w-fit">
                                  {p.idType}
                                </span>
                                <span className="text-[11px] text-slate-600">{p.idNumber}</span>
                              </td>
                              <td className="p-3.5">
                                {p.isSeniorCitizen ? (
                                  <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center gap-1 w-fit">
                                    <Heart className="w-3 h-3 fill-rose-500" /> Senior (Oxygen/Palki)
                                  </span>
                                ) : (
                                  <span className="text-slate-400 text-[11px]">Regular Adult</span>
                                )}
                              </td>
                              <td className="p-3.5 font-semibold text-amber-950">{b.packageName}</td>
                              <td className="p-3.5 text-slate-600 text-[11px]">
                                {p.seatOrRoomAllocation || "Auto-Allocated"}
                              </td>
                              <td className="p-3.5">
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 4: Accommodation & Ashrams */}
            {activeTab === "accommodation" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Hotel, Lodge &amp; Ashram Inventory</h3>
                    <p className="text-xs text-slate-500">Manage room allocations and pure sattvic kitchens across pilgrimage locations.</p>
                  </div>
                  <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
                    ✓ 100% Satvik Certified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roomList.map((room) => (
                    <div
                      key={room.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-amber-800 uppercase block">
                            {room.destination}
                          </span>
                          <h4 className="font-black text-slate-900 text-sm">{room.hotelOrAshramName}</h4>
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-bold text-slate-700 inline-block mt-1">
                            {room.roomCategory}
                          </span>
                        </div>
                        <span className="font-extrabold text-slate-900 text-xs">
                          ₹{room.nightlyTariff.toLocaleString("en-IN")}/nt
                        </span>
                      </div>

                      {/* Availability Bar */}
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-[11px] font-bold">
                          <span className="text-slate-500">Occupancy:</span>
                          <span className="text-slate-900">{room.allocatedRooms} / {room.totalRooms} Rooms</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-500"
                            style={{ width: `${(room.allocatedRooms / room.totalRooms) * 100}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-emerald-700 font-extrabold block text-right">
                          {room.availableRooms} Rooms Vacant
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-600 flex items-center gap-1">
                          {room.hasOxygenSupport ? "✓ Oxygen Support" : "Standard Rooms"}
                        </span>
                        <button className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px]">
                          Update Stays
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 5: Transport & Helicopter Shuttles */}
            {activeTab === "transport" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Transport Fleet &amp; Aviation Logistics</h3>
                    <p className="text-xs text-slate-500">Helicopters, luxury Volvo coaches, and mountain chauffeurs with GPS live tracking.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {fleetList.map((fleet) => (
                    <div
                      key={fleet.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                            {fleet.vehicleType}
                          </span>
                          <h4 className="font-black text-slate-900 text-sm mt-1">{fleet.registrationNumber}</h4>
                          <p className="text-xs text-amber-800 font-semibold">{fleet.assignedCircuit}</p>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            fleet.status === "ACTIVE_EN_ROUTE"
                              ? "bg-emerald-100 text-emerald-800 animate-pulse"
                              : fleet.status === "SCHEDULED_DEPARTURE"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {fleet.status}
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-slate-50 text-xs space-y-1 text-slate-700">
                        <p>
                          <strong className="text-slate-900">Captain / Driver:</strong> {fleet.driverName} ({fleet.driverPhone})
                        </p>
                        <p>
                          <strong className="text-slate-900">Hill Experience:</strong> {fleet.pahadiDrivingExperienceYears} Years • GPS Active
                        </p>
                        <p>
                          <strong className="text-slate-900">Capacity:</strong> {fleet.seatingCapacity} Seats
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-emerald-700 font-bold">✓ AIS-140 GPS Connected</span>
                        <button className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold">
                          Assign Batch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 6: Vedic Purohits & Guides */}
            {activeTab === "priests" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Vedic Purohit Mandali &amp; Spiritual Guides</h3>
                    <p className="text-xs text-slate-500">Certified temple priests and multilingual spiritual liaisons.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {priestList.map((pr) => (
                    <div
                      key={pr.id}
                      className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase">
                            {pr.title}
                          </span>
                          <h4 className="font-black text-slate-900 text-base mt-1">{pr.fullName}</h4>
                          <p className="text-xs text-slate-500">{pr.experienceYears} Years Vedic Experience • {pr.phone}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          ✓ Temple Board Certified
                        </span>
                      </div>

                      <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs space-y-1 text-slate-700">
                        <span className="font-bold text-amber-950 block text-[11px] uppercase">Assigned Temples &amp; Rituals:</span>
                        <div className="flex flex-wrap gap-1">
                          {pr.assignedTemples.map((t, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-white text-[10px] font-semibold text-slate-800">
                              🪔 {t}
                            </span>
                          ))}
                        </div>
                        <p className="pt-1 text-slate-500">Languages: {pr.languages.join(", ")}</p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Status: {pr.status}</span>
                        <button className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 font-bold">
                          Assign to Yatra Batch
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MODULE 7: Bookings & PNR CRM */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Pilgrimage Bookings &amp; PNR CRM</h3>
                    <p className="text-xs text-slate-500">Live booking records, status toggles, and voucher generation.</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={bookingFilterStatus}
                      onChange={(e) => setBookingFilterStatus(e.target.value)}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold"
                    >
                      <option value="all">All Bookings</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PENDING">Pending</option>
                      <option value="RESCHEDULED">Rescheduled</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  {operatorBookings
                    .filter((b) => bookingFilterStatus === "all" || b.status === bookingFilterStatus)
                    .map((b) => (
                      <div
                        key={b.id}
                        className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3"
                      >
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">{b.pnrNumber}</span>
                            <span className="text-slate-400">•</span>
                            <span className="font-extrabold text-amber-900">{b.packageName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                              {b.status}
                            </span>
                            <span className="font-black text-slate-900 text-sm">
                              ₹{b.fareBreakdown.totalPayable.toLocaleString("en-IN")}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Lead Pilgrim</span>
                            <span className="font-bold text-slate-900">{b.leadPilgrim.name}</span>
                            <span className="text-slate-500 block text-[11px]">{b.leadPilgrim.phone}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Yatris Count</span>
                            <span className="font-bold text-slate-900">{b.totalPilgrims} Pilgrims ({b.seniorCount} Seniors)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Departure Date</span>
                            <span className="font-bold text-slate-900">{b.departureDate}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Guide</span>
                            <span className="font-bold text-slate-900">{b.assignedGuide}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400">
                            Invoice: {b.gstInvoiceNumber} • Ref: {b.bookingRef}
                          </span>
                          <div className="flex items-center gap-2">
                            <select
                              value={b.status}
                              onChange={(e) => handleBookingStatusChange(b.id, e.target.value as any)}
                              className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white"
                            >
                              <option value="CONFIRMED">CONFIRMED</option>
                              <option value="PENDING">PENDING</option>
                              <option value="RESCHEDULED">RESCHEDULED</option>
                              <option value="CANCELLED">CANCELLED</option>
                              <option value="COMPLETED">COMPLETED</option>
                            </select>
                            <button
                              onClick={() => window.open(b.voucherUrl, "_blank")}
                              className="px-3 py-1 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800"
                            >
                              View Voucher
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* MODULE 8: Financial Management & Settlements */}
            {activeTab === "settlements" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Bank Payouts, Commissions &amp; GSTR-1</h3>
                    <p className="text-xs text-slate-500">Automated T+1 RTGS settlements and Section 194H TDS reporting.</p>
                  </div>
                  <button
                    onClick={handleRequestPayout}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs"
                  >
                    Request Instant RTGS Payout
                  </button>
                </div>

                {/* Bank Details Card */}
                <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">Designated Operator Settlement Account</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ✓ Verified Active RTGS
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Bank Name</span>
                      <span className="font-bold text-slate-900">{currentOperator.bankSettlement.bankName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Masked</span>
                      <span className="font-bold text-slate-900">{currentOperator.bankSettlement.accountNumberMasked}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">IFSC Code</span>
                      <span className="font-bold text-slate-900">{currentOperator.bankSettlement.ifsc}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">GSTIN</span>
                      <span className="font-bold text-slate-900">{currentOperator.bankSettlement.gstin}</span>
                    </div>
                  </div>
                </div>

                {/* Settlements Table */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-extrabold">
                      <tr>
                        <th className="p-3.5">Payout Ref</th>
                        <th className="p-3.5">Cycle Period</th>
                        <th className="p-3.5">Gross Yatra GMV</th>
                        <th className="p-3.5">Platform Fee</th>
                        <th className="p-3.5">TDS (Sec 194H)</th>
                        <th className="p-3.5">Net Disbursed</th>
                        <th className="p-3.5">Status &amp; UTR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {settlementsList.map((stl) => (
                        <tr key={stl.id} className="hover:bg-slate-50">
                          <td className="p-3.5 font-bold text-slate-900">{stl.payoutRef}</td>
                          <td className="p-3.5">{stl.period}</td>
                          <td className="p-3.5">₹{stl.grossBookingsAmount.toLocaleString("en-IN")}</td>
                          <td className="p-3.5 text-slate-500">₹{stl.platformFee.toLocaleString("en-IN")}</td>
                          <td className="p-3.5 text-slate-500">₹{stl.tdsDeducted.toLocaleString("en-IN")}</td>
                          <td className="p-3.5 font-black text-emerald-700">
                            ₹{stl.netSettlementAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] block w-fit">
                              {stl.status}
                            </span>
                            <span className="text-[10px] text-slate-400">{stl.utrNumber}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* MODULE 9: Operations & Live Departures */}
            {activeTab === "operations" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Live Yatra Departures &amp; SOS Incident Room</h3>
                    <p className="text-xs text-slate-500">Real-time status of en-route batches, mountain weather alerts &amp; oxygen telemetry.</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black animate-pulse">
                    ● Live Telemetry Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">Batch #CD-0912 (Char Dham Heli)</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        AT KEDARNATH DHAM
                      </span>
                    </div>
                    <p className="text-slate-600">Helicopter Bell 407 (VT-DYH) landed smoothly at Kedarnath helipad. 6 Yatris escorted for Sugam VIP Shringar Aarti.</p>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1">
                      <p><strong>Liaison Escort:</strong> Acharya Somnath Shastri (+91 98971 88201)</p>
                      <p><strong>Weather Condition:</strong> Clear Skies • 8°C • Zero Flight Delays</p>
                      <p><strong>Oxygen Oximeter Telemetry:</strong> All 6 Yatris SpO2 &gt; 92% (Normal)</p>
                    </div>
                  </div>

                  <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">Batch #KS-0908 (Kashi-Ayodhya)</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px]">
                        EN ROUTE AYODHYA DHAM
                      </span>
                    </div>
                    <p className="text-slate-600">Innova Crysta UP-65-AX-9910 departing Prayagraj Triveni Sangam after successful Holy Dip Sankalp pooja.</p>
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-[11px] text-slate-700 space-y-1">
                      <p><strong>Driver:</strong> Shivpal Yadav (GPS Active on NH-330)</p>
                      <p><strong>ETA Ayodhya Hotel:</strong> 05:30 PM (Evening Sarayu Aarti scheduled)</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 10: KYC & Temple Badges */}
            {activeTab === "kyc" && (
              <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6 text-xs">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Operator KYC &amp; Shrine Trust Empanelments</h3>
                  <p className="text-slate-500">Statutory certifications from Govt of India Ministry of Tourism &amp; Temple Boards.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <span className="font-extrabold text-amber-950 text-sm block">Ministry of Tourism Certification</span>
                    <p className="text-slate-600">License: {currentOperator.verification.govtCertNumber}</p>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ✓ Active &amp; Verified (Valid Till 2029)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <span className="font-extrabold text-amber-950 text-sm block">ISO Quality Compliance</span>
                    <p className="text-slate-600">{currentOperator.verification.isoCertified}</p>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      ✓ High Altitude Safety Audited
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* MODULE 11: Technical API Gateway (Hidden) */}
            {activeTab === "technical_backend" && (
              <div className="bg-slate-950 text-slate-200 p-6 rounded-3xl border border-slate-800 space-y-6 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-amber-400" />
                    <h3 className="text-sm font-bold text-white font-sans">
                      Central Pilgrimage API Gateway &amp; GDS Bridges
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                    ● All 6 Microservices Operational
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "IRCTC Bharat Gaurav GDS Switch", endpoint: "https://api.irctc.co.in/gds/v2/pilgrim-trains", latency: "34ms", status: "200 OK" },
                    { name: "Helicopter Slot Booking Switch (Sahastradhara CRS)", endpoint: "https://heli.ucada.uk.gov.in/api/v1/shuttle-slots", latency: "52ms", status: "200 OK" },
                    { name: "Shri Kashi Vishwanath Sugam Pass API", endpoint: "https://shrikashivishwanath.org/api/sugam-vip-token", latency: "41ms", status: "200 OK" },
                    { name: "Ayodhya Ram Mandir Shringar Pass Gateway", endpoint: "https://srjbtkshetra.org/api/v2/aarti-tokens", latency: "29ms", status: "200 OK" },
                    { name: "BharatYatra Central Redis Cache & Webhooks", endpoint: "redis://cache.internal.bharatyatra.in:6379", latency: "2ms", status: "SYNCED" },
                  ].map((api, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <span className="text-white font-bold block">{api.name}</span>
                        <span className="text-slate-500 text-[11px]">{api.endpoint}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-amber-400">{api.latency}</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                          {api.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add Package Modal */}
        {showAddPackageModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 border border-amber-300">
              <div className="flex justify-between items-center">
                <h3 className="font-extrabold text-slate-900 text-base">Add New Pilgrimage Package</h3>
                <button onClick={() => setShowAddPackageModal(false)} className="p-1 rounded-full hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Package Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Dhams Special Circuit"
                    value={newPkgTitle}
                    onChange={(e) => setNewPkgTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Circuit Category</label>
                    <select
                      value={newPkgCircuit}
                      onChange={(e) => setNewPkgCircuit(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Char Dham">Char Dham</option>
                      <option value="12 Jyotirlinga">12 Jyotirlinga</option>
                      <option value="Sanatan Circuit">Sanatan Circuit</option>
                      <option value="Shaktipeeth">Shaktipeeth</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Duration</label>
                    <input
                      type="text"
                      value={newPkgDuration}
                      onChange={(e) => setNewPkgDuration(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price / Yatri (₹)</label>
                  <input
                    type="number"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddPackageModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black"
                  >
                    Publish Package
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
