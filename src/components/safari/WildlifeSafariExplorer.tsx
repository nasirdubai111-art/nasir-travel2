import React, { useState } from "react";
import {
  Compass,
  TreePine,
  ShieldAlert,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  FileCheck,
  Award,
  ChevronRight,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  MapPin,
  Car,
  DollarSign,
  AlertCircle,
  Eye,
  Plus,
  ArrowRight,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { SafariPackage, SafariBooking } from "../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../services/travelVerticalsService";

interface WildlifeSafariExplorerProps {
  onSelectBooking?: (booking: SafariBooking) => void;
}

export function WildlifeSafariExplorer({ onSelectBooking }: WildlifeSafariExplorerProps) {
  const [activeTab, setActiveTab] = useState<"packages" | "bookings" | "hierarchy_diagram">("packages");
  const [selectedParkFilter, setSelectedParkFilter] = useState<string>("All");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All");
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<SafariPackage | null>(null);

  // Booking Modal State
  const [isPermitModalOpen, setIsPermitModalOpen] = useState(false);
  const [permitDate, setPermitDate] = useState("2026-09-26");
  const [leadCustomer, setLeadCustomer] = useState({
    name: "Dr. Ananya Sharma",
    email: "ananya.sharma@wildlife.org",
    phone: "+91 98110 33419",
    city: "New Delhi",
  });
  const [adultsCount, setAdultsCount] = useState(2);
  const [passengers, setPassengers] = useState([
    {
      fullName: "Dr. Ananya Sharma",
      age: 34,
      gender: "Female" as const,
      nationality: "Indian" as const,
      govIdProofType: "Aadhaar Card" as const,
      govIdNumber: "XXXX-XXXX-9901",
    },
    {
      fullName: "Karan Sharma",
      age: 36,
      gender: "Male" as const,
      nationality: "Indian" as const,
      govIdProofType: "Aadhaar Card" as const,
      govIdNumber: "XXXX-XXXX-8812",
    },
  ]);
  const [viewingTicketBooking, setViewingTicketBooking] = useState<SafariBooking | null>(null);

  const packages = travelVerticalsService.getSafariPackages({
    nationalPark: selectedParkFilter,
    safariType: selectedTypeFilter,
  });
  const bookings = travelVerticalsService.getSafariBookings();

  const handleCreatePermitBooking = () => {
    if (!selectedPackageForBooking) return;
    const newBooking = travelVerticalsService.createSafariBooking({
      packageId: selectedPackageForBooking.packageId,
      customer: leadCustomer,
      safariDate: permitDate,
      shift: selectedPackageForBooking.dateSeason.recommendedSlot,
      passengerCount: { adults: adultsCount, children: 0, total: adultsCount },
      passengers: passengers.slice(0, adultsCount),
    });

    setIsPermitModalOpen(false);
    setViewingTicketBooking(newBooking);
    setActiveTab("bookings");
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Hierarchy Badges */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/80 via-slate-900 to-amber-950/40 border border-emerald-800/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Compass className="w-5 h-5" />
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Official Wildlife Safari Architecture
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Wildlife Safari Relational Hierarchy
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Strict schema mapping: <code className="text-emerald-300 font-mono">safari_packages</code> (8 Core Attributes) ➔{" "}
              <code className="text-amber-300 font-mono">safari_bookings</code> (8 Booking Entities &amp; Forest Dept QR Permit).
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 self-start lg:self-center">
            <button
              onClick={() => setActiveTab("packages")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "packages"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <TreePine className="w-3.5 h-3.5" />
              <span>1. Safari Packages ({packages.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "bookings"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>2. Safari Bookings &amp; Permits ({bookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("hierarchy_diagram")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "hierarchy_diagram"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Schema Diagram</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: SAFARI PACKAGES */}
      {activeTab === "packages" && (
        <div className="space-y-5 animate-in fade-in">
          {/* Filters Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter National Parks:</span>
              </span>
              {["All", "Corbett", "Ranthambore", "Kaziranga", "Bandhavgarh", "Kabini"].map((park) => (
                <button
                  key={park}
                  onClick={() => setSelectedParkFilter(park)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                    selectedParkFilter === park
                      ? "bg-emerald-500 text-white font-bold"
                      : "bg-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {park}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Type:</span>
              <select
                value={selectedTypeFilter}
                onChange={(e) => setSelectedTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              >
                <option value="All">All Types</option>
                <option value="Jeep Safari">Jeep Safari (4x4)</option>
                <option value="River Boat Safari">River Boat Safari</option>
              </select>
            </div>
          </div>

          {/* Safari Packages Cards Grid with all 8 explicit attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {packages.map((pkg) => (
              <div
                key={pkg.packageId}
                className="rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between overflow-hidden shadow-lg group"
              >
                <div>
                  {/* Photo with badges */}
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.packageName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono font-bold text-emerald-300 border border-emerald-500/30">
                        {pkg.packageId}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          pkg.availability.quotaStatus === "Available"
                            ? "bg-emerald-500/80 text-white"
                            : "bg-amber-500/80 text-white"
                        }`}
                      >
                        {pkg.availability.quotaStatus} ({pkg.availability.remainingPermitsToday} Left)
                      </span>
                    </div>
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <h3 className="text-base font-black text-white leading-tight drop-shadow-md">
                        {pkg.packageName}
                      </h3>
                      <p className="text-xs text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{pkg.nationalPark}</span>
                      </p>
                    </div>
                  </div>

                  {/* 8 Explicit Schema Attributes Container */}
                  <div className="p-4 space-y-3">
                    {/* 1. Zone & 2. Safari Type */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block font-bold uppercase">
                          1. Zone
                        </span>
                        <span className="font-semibold text-slate-200 truncate block">
                          {pkg.zone}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80">
                        <span className="text-[10px] text-slate-500 block font-bold uppercase">
                          2. Safari Type
                        </span>
                        <span className="font-semibold text-emerald-300 truncate block">
                          {pkg.safariType}
                        </span>
                      </div>
                    </div>

                    {/* 3. Vehicle */}
                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                      <span className="text-[10px] text-slate-500 block font-bold uppercase flex items-center gap-1">
                        <Car className="w-3 h-3" />
                        <span>3. Vehicle</span>
                      </span>
                      <span className="font-semibold text-slate-200">{pkg.vehicle}</span>
                    </div>

                    {/* 4. Date / Season */}
                    <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs">
                      <span className="text-[10px] text-slate-500 block font-bold uppercase flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>4. Date / Season</span>
                      </span>
                      <span className="text-slate-300 text-[11px] block">
                        {pkg.dateSeason.seasonName} ({pkg.dateSeason.monthsActive})
                      </span>
                      <span className="text-amber-300 text-[10px] font-bold block mt-0.5">
                        Slot: {pkg.dateSeason.recommendedSlot}
                      </span>
                    </div>

                    {/* 5. Key Fauna */}
                    <div className="flex flex-wrap gap-1">
                      {pkg.keyFauna.slice(0, 3).map((f, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-[10px] font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 6. Pricing & 7. Availability Footer */}
                <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">
                      6. Total Pricing (All Inc.)
                    </span>
                    <p className="text-base font-black text-white">
                      ₹{pkg.pricing.totalEstimatedPrice.toLocaleString("en-IN")}{" "}
                      <span className="text-[10px] text-slate-400 font-normal">/ vehicle</span>
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Incl. Guide, Permit &amp; 5% GST
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedPackageForBooking(pkg);
                      setIsPermitModalOpen(true);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                  >
                    <span>Book Permit</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SAFARI BOOKINGS & PERMITS (8 Attributes) */}
      {activeTab === "bookings" && (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>Official Forest Department Safari Bookings</span>
              </h3>
              <p className="text-xs text-slate-400">
                8 Entities: Customer, Package, Date, Passengers, Vehicle, Payment, Status, QR Permit
              </p>
            </div>
            <button
              onClick={() => setActiveTab("packages")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Issue New Permit</span>
            </button>
          </div>

          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.bookingId}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-4 shadow-xl"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <TreePine className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-white text-sm sm:text-base">
                          {b.safariPackageName}
                        </h4>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                          {b.bookingStatus.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Permit No: <span className="font-mono text-cyan-300">{b.ticketNumber}</span> •{" "}
                        {b.nationalPark} ({b.zone})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingTicketBooking(b)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-emerald-400" />
                      <span>View Permit &amp; QR</span>
                    </button>
                  </div>
                </div>

                {/* The 8 Booking Entities Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {/* 1. Customer */}
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      1. Customer
                    </span>
                    <span className="font-bold text-white block">{b.customer.name}</span>
                    <span className="text-[10px] text-slate-400 block">{b.customer.phone}</span>
                  </div>

                  {/* 2. Safari Package & 3. Safari Date */}
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      2 &amp; 3. Date &amp; Shift
                    </span>
                    <span className="font-bold text-cyan-300 block">{b.safariDate}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{b.shift}</span>
                  </div>

                  {/* 4. Passenger Count */}
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      4. Passenger Count
                    </span>
                    <span className="font-bold text-white block">
                      {b.passengerCount.total} Passengers
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {b.passengerCount.adults} Adults, {b.passengerCount.children} Children
                    </span>
                  </div>

                  {/* 5. Vehicle */}
                  <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">
                      5. Vehicle &amp; Guide
                    </span>
                    <span className="font-bold text-white block">
                      {b.vehicle.assignedVehicleNumber}
                    </span>
                    <span className="text-[10px] text-emerald-400 block truncate">
                      {b.vehicle.authorizedNaturalistName.split(" ")[1] || "Guide"} (
                      {b.vehicle.naturalistBadgeId})
                    </span>
                  </div>
                </div>

                {/* 6. Payment & 7. Booking Status */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">
                        6. Payment (Razorpay)
                      </span>
                      <span className="font-mono text-emerald-300 font-bold">
                        ₹{b.payment.amountPaid.toLocaleString("en-IN")} ({b.payment.paymentId})
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block uppercase">
                        7. Booking Status
                      </span>
                      <span className="text-white font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Permit Issued &amp; Cleared</span>
                      </span>
                    </div>
                  </div>

                  {/* 8. Ticket / QR Code Preview */}
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-white text-slate-900">
                      <QrCode className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">
                        8. Ticket / QR Code
                      </span>
                      <span className="text-[10px] font-mono text-slate-300">
                        {b.ticketNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCHEMA HIERARCHY DIAGRAM */}
      {activeTab === "hierarchy_diagram" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">
              WILDLIFE SAFARI Relational Hierarchy Representation
            </h3>
            <p className="text-xs text-slate-400">
              Visualizing the exact schema requested by the user
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto whitespace-pre">
{`WILDLIFE SAFARI
│
├── safari_packages
│      ├── Package                 ──> e.g. "Dhikala Classic Royal Bengal Tiger Expedition"
│      ├── National Park           ──> e.g. "Jim Corbett National Park"
│      ├── Zone                    ──> e.g. "Dhikala Zone (Core Deep Forest)"
│      ├── Safari Type             ──> e.g. "Jeep Safari (4x4)"
│      ├── Vehicle                 ──> e.g. "4x4 Maruti Gypsy (Open Top 6-Seater)"
│      ├── Date/Season             ──> e.g. "Winter Peak Season (Nov 15 - Jun 15)"
│      ├── Pricing                 ──> e.g. ₹7,875 (Vehicle + Indian Permit + Guide + GST)
│      └── Availability            ──> e.g. 6/30 Permits Remaining
│
└── safari_bookings
       ├── Customer                ──> e.g. Dr. Ananya Sharma (CUST-IN-49102)
       ├── Safari Package          ──> Foreign Key references safari_packages(package_id)
       ├── Safari Date             ──> e.g. 2026-09-26 (Morning Shift 06:00 AM)
       ├── Passenger Count         ──> e.g. 2 Adults, 0 Children
       ├── Vehicle                 ──> Assigned: UK-04-TA-8819 (Guide: Dr. Arvind Pathak)
       ├── Payment                 ──> Captured via Razorpay (TX-SF-PAY-8810)
       ├── Booking Status          ──> "permit_issued" / "confirmed"
       └── Ticket / QR Code        ──> Official Forest Dept QR String + Gate Entry Pass`}
          </div>
        </div>
      )}

      {/* BOOK PERMIT MODAL */}
      {isPermitModalOpen && selectedPackageForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
                  Forest Department Permit Issue
                </span>
                <h3 className="text-base font-black text-white">
                  {selectedPackageForBooking.packageName}
                </h3>
              </div>
              <button
                onClick={() => setIsPermitModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Safari Date</label>
                  <input
                    type="date"
                    value={permitDate}
                    onChange={(e) => setPermitDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">
                    Shift / Timing
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={selectedPackageForBooking.dateSeason.recommendedSlot}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-semibold truncate"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Lead Passenger</label>
                <input
                  type="text"
                  value={leadCustomer.name}
                  onChange={(e) => setLeadCustomer({ ...leadCustomer, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    value={leadCustomer.email}
                    onChange={(e) => setLeadCustomer({ ...leadCustomer, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={leadCustomer.phone}
                    onChange={(e) => setLeadCustomer({ ...leadCustomer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>
              </div>

              {/* Price Summary */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Vehicle &amp; Permit:</span>
                  <span className="font-bold text-white">
                    ₹{selectedPackageForBooking.pricing.totalEstimatedPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-emerald-400">
                  <span>Forest Dept Entry Gate:</span>
                  <span>{selectedPackageForBooking.entryGate}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setIsPermitModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePermitBooking}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm &amp; Issue Forest Permit</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW OFFICIAL QR PERMIT TICKET MODAL */}
      {viewingTicketBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl shadow-2xl p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-black text-white">
                  Government Forest Department Electronic Entry Permit
                </h3>
              </div>
              <button
                onClick={() => setViewingTicketBooking(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Official Green Border Permit Card */}
            <div className="rounded-3xl bg-white text-slate-900 p-6 shadow-2xl border-2 border-emerald-600 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-700 text-white">
                    <TreePine className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800">
                      MINISTRY OF ENVIRONMENT &amp; FORESTS
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      SAFARI ENTRY PERMIT (E-PASS)
                    </h4>
                    <p className="text-xs text-slate-600 font-semibold">
                      {viewingTicketBooking.nationalPark} — {viewingTicketBooking.zone}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-500 block uppercase">
                    PERMIT NUMBER
                  </span>
                  <span className="text-sm font-mono font-black text-emerald-800">
                    {viewingTicketBooking.ticketNumber}
                  </span>
                  <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black mt-1">
                    ACTIVE PERMIT
                  </span>
                </div>
              </div>

              {/* Grid with passenger and vehicle details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    Lead Visitor
                  </span>
                  <span className="font-bold text-slate-900">
                    {viewingTicketBooking.customer.name}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {viewingTicketBooking.customer.phone}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    Safari Date
                  </span>
                  <span className="font-bold text-slate-900">
                    {viewingTicketBooking.safariDate}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {viewingTicketBooking.shift}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    Registered Vehicle
                  </span>
                  <span className="font-bold text-slate-900">
                    {viewingTicketBooking.vehicle.assignedVehicleNumber}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Driver: {viewingTicketBooking.vehicle.driverName.split(" ")[0]}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">
                    Authorized Guide
                  </span>
                  <span className="font-bold text-slate-900">
                    {viewingTicketBooking.vehicle.authorizedNaturalistName.split("(")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Badge: {viewingTicketBooking.vehicle.naturalistBadgeId}
                  </span>
                </div>
              </div>

              {/* Gate Entry & QR Code */}
              <div className="p-4 rounded-2xl bg-slate-950 text-white flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">
                    Reporting Instruction
                  </span>
                  <p className="text-xs font-semibold text-slate-200">
                    Gate Cutoff: {viewingTicketBooking.gateReportingTime}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Original Govt ID (Aadhaar/Passport) mandatory for all passengers.
                  </p>
                </div>

                <div className="p-2 rounded-2xl bg-white text-slate-900 flex flex-col items-center shrink-0">
                  <QrCode className="w-14 h-14 text-slate-900" />
                  <span className="text-[8px] font-mono font-bold mt-0.5">FOREST GATE SCAN</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Official Permit</span>
              </button>

              <button
                onClick={() => setViewingTicketBooking(null)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
