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
} from "lucide-react";
import {
  TourOperatorProfile,
  UnifiedTourPackage,
  OperatorBookingRecord,
  OperatorSettlementBatch,
} from "../../types";
import {
  TOUR_OPERATORS_DATABASE,
  INITIAL_OPERATOR_BOOKINGS,
  UNIFIED_TOUR_PACKAGES,
  INITIAL_OPERATOR_SETTLEMENTS,
} from "../../data/tourData";

interface TourOperatorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TourOperatorPortalModal({
  isOpen,
  onClose,
}: TourOperatorPortalModalProps) {
  if (!isOpen) return null;

  // Selected Operator State
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("op-royal-heritage");
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "packages" | "departures" | "bookings" | "settlements" | "kyc_profile"
  >("dashboard");

  // Local state for bookings, settlements & packages
  const [bookingsList, setBookingsList] = useState<OperatorBookingRecord[]>(INITIAL_OPERATOR_BOOKINGS);
  const [settlementsList, setSettlementsList] = useState<OperatorSettlementBatch[]>(INITIAL_OPERATOR_SETTLEMENTS);
  const [packagesList, setPackagesList] = useState<UnifiedTourPackage[]>(UNIFIED_TOUR_PACKAGES);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>("all");
  const [settlementSuccessNotice, setSettlementSuccessNotice] = useState<string | null>(null);

  // New package modal toggle
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [newPackageTitle, setNewPackageTitle] = useState("");
  const [newPackagePrice, setNewPackagePrice] = useState(18500);
  const [newPackageDuration, setNewPackageDuration] = useState("5 Days / 4 Nights");
  const [newPackageDestination, setNewPackageDestination] = useState("Jaipur & Udaipur");

  const currentOperator =
    TOUR_OPERATORS_DATABASE.find((op) => op.id === selectedOperatorId) ||
    TOUR_OPERATORS_DATABASE[0];

  const operatorPackages = packagesList.filter((p) => p.operatorId === currentOperator.id);
  const operatorBookings = bookingsList;

  // Financial Stats Calculation
  const totalGrossGmv = operatorBookings.reduce((sum, b) => sum + b.grossAmount, 0);
  const totalCommission = operatorBookings.reduce((sum, b) => sum + b.platformFee, 0);
  const totalNetPayout = operatorBookings.reduce((sum, b) => sum + b.netOperatorEarnings, 0);
  const totalPassengers = operatorBookings.reduce((sum, b) => sum + b.totalGuests, 0);

  const handleStatusChange = (bookingId: string, newStatus: OperatorBookingRecord["status"]) => {
    setBookingsList((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const handleRequestSettlement = () => {
    const bank = currentOperator.bankDetails;
    setSettlementSuccessNotice(
      `Instant settlement request initiated for ₹${totalNetPayout.toLocaleString(
        "en-IN"
      )} to ${bank?.bankName || "HDFC Bank"} (A/C ending in ${(bank?.accountNumber || "8912").slice(
        -4
      )}). Bank UTR will be generated within 15 mins.`
    );
    setTimeout(() => setSettlementSuccessNotice(null), 7000);
  };

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPackageTitle) return;

    const newPkg: UnifiedTourPackage = {
      id: `tour-custom-${Date.now()}`,
      operatorId: currentOperator.id,
      operatorName: currentOperator.name,
      operatorLogo: currentOperator.logo,
      title: newPackageTitle,
      subtitle: `Exclusive luxury package curated by ${currentOperator.name}`,
      destination: newPackageDestination,
      states: ["Rajasthan"],
      durationDays: 5,
      durationNights: 4,
      durationText: newPackageDuration,
      category: "Heritage",
      featuredImage: "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=1200",
      gallery: [
        "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800",
        "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800",
      ],
      pricePerAdult: Number(newPackagePrice),
      originalPrice: Math.round(Number(newPackagePrice) * 1.25),
      minGroupSize: 2,
      maxGroupSize: 18,
      rating: 4.9,
      reviewsCount: 1,
      highlights: ["Complimentary private transfer", "Govt licensed tour historian", "Curated meals"],
      inclusions: ["All 4-star stays", "Daily breakfast & dinner", "AC transport"],
      exclusions: ["Flight tickets", "Monument entry tickets"],
      itinerary: [
        {
          dayNumber: 1,
          title: "Arrival & City Orientation",
          activities: ["Airport/Station pickup in private AC vehicle", "Hotel check-in & welcome drink"],
          mealsIncluded: ["Dinner"],
          stayHotel: "Heritage Palace Residency",
          transferType: "Private AC Cab",
        },
        {
          dayNumber: 2,
          title: "Palace & Monument Guided Tour",
          activities: ["Full day guided sightseeing pass", "Sunset photography point"],
          mealsIncluded: ["Breakfast", "Dinner"],
          stayHotel: "Heritage Palace Residency",
          transferType: "Private AC Cab",
        },
      ],
      accommodation: {
        tier: "Deluxe 4-Star",
        roomConfigurations: ["Double / Twin", "Family Suite"],
        hotelsList: [
          {
            hotelName: "Heritage Palace Residency",
            city: newPackageDestination,
            roomCategory: "Deluxe Royal Suite",
            rating: 4.8,
            photos: ["https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800"],
          },
        ],
      },
      transport: {
        primaryMode: "Private AC Sedan/SUV",
        vehicleTypes: ["Toyota Innova Crysta", "Sedan"],
        intercityTransfersIncluded: true,
        airportTransfersIncluded: true,
      },
      meals: {
        mealPlan: "MAP - Breakfast & Dinner",
        dietaryOptions: ["Vegetarian", "Jain Food"],
        signatureMeals: ["Traditional Thali"],
      },
      activities: ["Fort Guided Tour", "Cultural Dance Gala"],
      guideInfo: {
        id: "guide-devendra",
        name: "Devendra Rathore",
        languages: ["English", "Hindi"],
        experienceYears: 12,
        rating: 4.9,
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
        licenseNumber: "GOI-MOT-RJ-1940",
        speciality: "History & Architecture",
      },
      departureBatches: [
        {
          id: `batch-${Date.now()}`,
          departureDate: "2026-09-15",
          returnDate: "2026-09-20",
          totalSeats: 16,
          bookedSeats: 0,
          status: "Available",
          priceMultiplier: 1.0,
        },
      ],
      addOns: [
        {
          id: "addon-1",
          name: "Palace Suite Upgrade",
          description: "Upgrade to Grand Maharaja Suite",
          pricePerUnit: 4500,
          priceType: "per_booking",
          category: "upgrade",
          selectedByDefault: false,
        },
      ],
      policies: {
        cancellationRules: [
          { daysBefore: "15+ Days Before", refundPercentage: 90, penalty: "10% processing fee" },
          { daysBefore: "7-14 Days Before", refundPercentage: 50, penalty: "50% retention fee" },
        ],
        childPolicy: "Kids below 5 complimentary; kids 5-11 at 60% tariff",
        paymentTerms: "25% Advance to confirm; 75% 7 days prior to departure",
        identificationRequired: "Govt ID (Aadhaar / Passport / Voter ID) mandatory",
      },
      offers: [
        {
          code: "ROYALFEST26",
          discountPercent: 12,
          maxDiscount: 4000,
          description: "Flat 12% off on early batch departures",
        },
      ],
      reviews: [],
      supportContact: currentOperator.contact,
    };

    setPackagesList([newPkg, ...packagesList]);
    setShowAddPackageModal(false);
    setNewPackageTitle("");
  };

  const filteredBookings = operatorBookings.filter((b) => {
    if (bookingFilterStatus !== "all" && b.status !== bookingFilterStatus) return false;
    if (
      searchQuery &&
      !b.leadTravellerName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.bookingRef.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !b.packageTitle.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-950 text-slate-100 rounded-3xl w-full max-w-6xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-slate-800 animate-in zoom-in-95">
        {/* Top Management Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-fuchsia-600/30">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Operator Console
                </span>
                <span className="text-[11px] text-slate-400">
                  GSTIN: <strong>{currentOperator.gstin || "08AABCR4921E1Z4"}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {currentOperator.name}
              </h2>
            </div>
          </div>

          {/* Operator Switcher & Close */}
          <div className="flex items-center gap-2.5">
            <select
              value={selectedOperatorId}
              onChange={(e) => setSelectedOperatorId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-2 focus:outline-hidden focus:border-fuchsia-500"
            >
              {TOUR_OPERATORS_DATABASE.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.brandName} ({op.destinationsCovered.cities[0] || "Circuit"})
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "dashboard"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "packages"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Packages &amp; Itineraries ({operatorPackages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("departures")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "departures"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Departure Batches &amp; Fleet</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "bookings"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Passenger Manifest ({operatorBookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("settlements")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "settlements"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Financials &amp; Settlements</span>
          </button>

          <button
            onClick={() => setActiveTab("kyc_profile")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === "kyc_profile"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>KYC &amp; Bank Profile</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {settlementSuccessNotice && (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{settlementSuccessNotice}</span>
            </div>
          )}

          {/* TAB 1: OPERATIONAL DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Gross Booking Value</span>
                  <div className="text-xl sm:text-2xl font-black text-white">₹{totalGrossGmv.toLocaleString("en-IN")}</div>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +18.4% month-on-month
                  </span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Net Operator Payout</span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">₹{totalNetPayout.toLocaleString("en-IN")}</div>
                  <span className="text-[10px] text-slate-400">Direct NEFT/RTGS settlement</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Active Travelers</span>
                  <div className="text-xl sm:text-2xl font-black text-fuchsia-400">{totalPassengers} Guests</div>
                  <span className="text-[10px] text-slate-400">Across current departures</span>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-1">
                  <span className="text-[10px] sm:text-xs text-slate-400 uppercase font-bold tracking-wider">Accreditation Score</span>
                  <div className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-1">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <span>{currentOperator.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{currentOperator.reviewsCount} verified reviews</span>
                </div>
              </div>

              {/* Operations Action Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Upcoming Batch Departures &amp; Group Manifest</h3>
                      <p className="text-xs text-slate-400">Monitor driver allocations, stay vouchers &amp; meal plans</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("departures")}
                      className="text-xs text-fuchsia-400 hover:text-fuchsia-300 font-bold flex items-center gap-1"
                    >
                      <span>View All</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {operatorPackages.flatMap((p) =>
                      p.departureBatches.slice(0, 2).map((batch) => (
                        <div key={batch.id} className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-[10px] text-fuchsia-400 font-bold uppercase">{p.title}</span>
                            <div className="font-bold text-white mt-0.5">
                              Departure Date: {batch.departureDate} ({batch.totalSeats - batch.bookedSeats} seats available)
                            </div>
                            <span className="text-[11px] text-slate-400">Chauffeur Assigned: AC Innova • Guide: {p.guideInfo?.name || "Senior Tour Historian"}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] shrink-0">
                            {batch.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Statutory & Quick Actions */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white">Operator Quick Tools</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowAddPackageModal(true)}
                      className="w-full p-3 rounded-2xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Tour Package</span>
                    </button>

                    <button
                      onClick={handleRequestSettlement}
                      className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-400" />
                      <span>Request Bank Payout</span>
                    </button>

                    <button
                      onClick={() => setActiveTab("kyc_profile")}
                      className="w-full p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors border border-slate-700"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>View Ministry Accreditation</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES & ITINERARY MANAGEMENT */}
          {activeTab === "packages" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Published Tour Itineraries &amp; Tariffs</h3>
                  <p className="text-xs text-slate-400">Manage stay hotels, transportation modes, day-wise activities, and add-ons.</p>
                </div>

                <button
                  onClick={() => setShowAddPackageModal(true)}
                  className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Package</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {operatorPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4">
                    <div className="flex gap-3">
                      <img src={pkg.featuredImage} alt={pkg.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-fuchsia-400 font-bold uppercase block">{pkg.category} Circuit</span>
                        <h4 className="text-sm font-bold text-white truncate">{pkg.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{pkg.durationText} • {pkg.destination}</p>
                        <div className="text-sm font-black text-emerald-400 mt-1">₹{pkg.pricePerAdult.toLocaleString("en-IN")} / adult</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                      <div>
                        <span className="block text-slate-500">Batches</span>
                        <strong className="text-slate-200">{pkg.departureBatches.length} scheduled</strong>
                      </div>
                      <div>
                        <span className="block text-slate-500">Transport</span>
                        <strong className="text-slate-200 truncate block">{pkg.transport.primaryMode}</strong>
                      </div>
                      <div>
                        <span className="block text-slate-500">Stay Tier</span>
                        <strong className="text-slate-200 truncate block">{pkg.accommodation.tier}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Package Modal */}
              {showAddPackageModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
                  <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-white">Create New Tour Package</h3>
                      <button onClick={() => setShowAddPackageModal(false)} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleCreatePackage} className="space-y-3 text-xs">
                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Package Title *</label>
                        <input
                          type="text"
                          required
                          value={newPackageTitle}
                          onChange={(e) => setNewPackageTitle(e.target.value)}
                          placeholder="e.g. Royal Golden Triangle & Taj Sunset Tour"
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-300 font-bold block mb-1">Destination Circuit</label>
                          <input
                            type="text"
                            value={newPackageDestination}
                            onChange={(e) => setNewPackageDestination(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-slate-300 font-bold block mb-1">Duration</label>
                          <input
                            type="text"
                            value={newPackageDuration}
                            onChange={(e) => setNewPackageDuration(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-slate-300 font-bold block mb-1">Base Price Per Adult (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newPackagePrice}
                          onChange={(e) => setNewPackagePrice(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium"
                        />
                      </div>

                      <div className="pt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddPackageModal(false)}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold"
                        >
                          Publish Package
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DEPARTURES & FLEET */}
          {activeTab === "departures" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Batch Departure Scheduler &amp; Fleet Roster</h3>
                  <p className="text-xs text-slate-400">Track seat allocations, guide assignments, and vehicle permits.</p>
                </div>
              </div>

              <div className="space-y-3">
                {operatorPackages.flatMap((p) =>
                  p.departureBatches.map((b) => ({ ...b, packageTitle: p.title, packageId: p.id, guide: p.guideInfo }))
                ).map((batch) => (
                  <div key={batch.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-fuchsia-400 font-bold uppercase block">{batch.packageTitle}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">
                        Departure: <strong>{batch.departureDate}</strong> → Return: <strong>{batch.returnDate}</strong>
                      </h4>
                      <p className="text-[11px] text-slate-400">Assigned Chauffeur: AC Innova Crysta • Certified Guide: {batch.guide?.name || "Licensed Historian"}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-300 block">{batch.totalSeats - batch.bookedSeats} / {batch.totalSeats} Seats Left</span>
                        <span className="text-[10px] text-emerald-400 font-semibold">{batch.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PASSENGER MANIFEST & BOOKINGS */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Passenger Manifest &amp; Live Bookings</h3>
                  <p className="text-xs text-slate-400">Verify guest KYC, dietary requests, emergency contacts, and booking status.</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search PNR or Guest..."
                      className="pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                    />
                  </div>

                  <select
                    value={bookingFilterStatus}
                    onChange={(e) => setBookingFilterStatus(e.target.value)}
                    className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-2.5 py-1.5"
                  >
                    <option value="all">All Status</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <span className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider block">Ref: {b.bookingRef}</span>
                        <h4 className="text-sm font-bold text-white">{b.leadTravellerName} ({b.totalGuests} Guests)</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={b.status}
                          onChange={(e) => handleStatusChange(b.id, e.target.value as any)}
                          className="bg-slate-800 border border-slate-700 text-xs text-white font-bold rounded-xl px-2.5 py-1"
                        >
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                          <option value="RESCHEDULED">RESCHEDULED</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Package</span>
                        <strong className="text-white truncate block">{b.packageTitle}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Travel Date</span>
                        <strong className="text-white">{b.departureDate}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Contact</span>
                        <strong className="text-white">{b.travellerPhone}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Net Payout</span>
                        <strong className="text-emerald-400">₹{b.netOperatorEarnings.toLocaleString("en-IN")}</strong>
                      </div>
                    </div>

                    {b.specialRequests && (
                      <div className="p-2.5 bg-slate-800/60 rounded-xl text-[11px] text-amber-300 border border-amber-500/20">
                        <strong>Guest Notes:</strong> {b.specialRequests}
                      </div>
                    )}

                    {/* Manifest List */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">Traveller Manifest &amp; Meal Preferences</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {b.manifestPassengers.map((p, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-slate-800/40 text-[11px] flex items-center justify-between text-slate-300">
                            <span>{p.name} ({p.age}y, {p.gender})</span>
                            <span className="text-amber-300 text-[10px] font-semibold">{p.mealPreference}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FINANCIALS & SETTLEMENTS */}
          {activeTab === "settlements" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-fuchsia-950/60 to-purple-950/60 border border-fuchsia-800/40 rounded-3xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-fuchsia-300 font-bold uppercase tracking-wider block">Total Ready for Bank Transfer</span>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">₹{totalNetPayout.toLocaleString("en-IN")}</div>
                  <span className="text-xs text-slate-400">After platform fee &amp; 1% TDS deduction</span>
                </div>

                <button
                  onClick={handleRequestSettlement}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Request Instant Settlement</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              {/* Settlement History */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Bank Settlement Batches</h4>
                <div className="space-y-2.5">
                  {settlementsList.map((sh) => (
                    <div key={sh.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{sh.id}</span>
                          <span className="text-slate-400">({sh.period})</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          UTR Reference: <strong className="text-slate-200">{sh.utrNumber}</strong> • Account: {sh.bankAccount}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-emerald-400 block">
                          ₹{sh.netPayoutAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold uppercase">
                          {sh.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: KYC & BANK PROFILE */}
          {activeTab === "kyc_profile" && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Accredited Operator KYC &amp; Regulatory Profile</h3>
                    <span className="text-slate-400">Statutory records under Ministry of Tourism (Govt of India)</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    KYC Verified
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">PAN Number</span>
                    <p className="text-sm font-bold text-white">{currentOperator.panNumber || "AABCR4921E"}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">GSTIN Registration</span>
                    <p className="text-sm font-bold text-white">{currentOperator.gstin || "08AABCR4921E1Z4"}</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Bank Name &amp; IFSC</span>
                    <p className="text-sm font-bold text-white">{currentOperator.bankDetails?.bankName} ({currentOperator.bankDetails?.ifscCode})</p>
                  </div>

                  <div className="p-3.5 bg-slate-800/70 rounded-2xl space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Account Number &amp; Beneficiary</span>
                    <p className="text-sm font-bold text-white">{currentOperator.bankDetails?.accountNumber} ({currentOperator.bankDetails?.accountName})</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
