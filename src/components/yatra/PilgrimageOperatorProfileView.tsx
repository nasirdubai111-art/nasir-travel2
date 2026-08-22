import React, { useState } from "react";
import {
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Clock,
  Calendar,
  Users,
  Star,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  Building2,
  Bus,
  Car,
  Heart,
  Flame,
  UtensilsCrossed,
  Tag,
  ChevronRight,
  ExternalLink,
  ArrowRight,
  SlidersHorizontal,
  Briefcase,
  HelpCircle,
  MessageCircle,
  FileCheck,
  Search,
} from "lucide-react";
import {
  PilgrimageOperatorProfile,
  PilgrimageYatraPackage,
  BookingItem,
} from "../../types";
import {
  PILGRIMAGE_OPERATORS_DATABASE,
  PILGRIMAGE_PACKAGES_DATABASE,
} from "../../data/pilgrimageOperatorData";
import { PilgrimageBookingProfileModal } from "./PilgrimageBookingProfileModal";

interface PilgrimageOperatorProfileViewProps {
  onInitiateBooking?: (booking: BookingItem) => void;
  onOpenOperatorBackend?: () => void;
  onOpenAIDrawer?: () => void;
}

export function PilgrimageOperatorProfileView({
  onInitiateBooking,
  onOpenOperatorBackend,
  onOpenAIDrawer,
}: PilgrimageOperatorProfileViewProps) {
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("op-divya-yatra");
  const [activeTab, setActiveTab] = useState<
    "packages" | "destinations" | "stays_transport" | "darshan_purohit" | "reviews_gallery" | "policies_contact"
  >("packages");

  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<PilgrimageYatraPackage | null>(null);
  const [circuitFilter, setCircuitFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const currentOperator =
    PILGRIMAGE_OPERATORS_DATABASE.find((op) => op.id === selectedOperatorId) ||
    PILGRIMAGE_OPERATORS_DATABASE[0];

  const operatorPackages = PILGRIMAGE_PACKAGES_DATABASE.filter(
    (pkg) => pkg.operatorId === currentOperator.id
  );

  const filteredPackages = operatorPackages.filter((pkg) => {
    const matchesCircuit = circuitFilter === "all" || pkg.circuitCategory === circuitFilter;
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destinationsCovered.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      pkg.sacredDeity.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCircuit && matchesSearch;
  });

  const handleBookingSuccess = (bookingItem: BookingItem) => {
    if (onInitiateBooking) {
      onInitiateBooking(bookingItem);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Operator Selection Bar (Switch Between Certified Operators) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-amber-950/20 border border-amber-500/20 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <span className="text-xs font-bold text-amber-950 dark:text-amber-300">
            Selected Govt-Empanelled Pilgrimage Operator:
          </span>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedOperatorId}
            onChange={(e) => setSelectedOperatorId(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-amber-300/80 bg-white text-xs font-bold text-slate-800 shadow-xs focus:outline-hidden"
          >
            {PILGRIMAGE_OPERATORS_DATABASE.map((op) => (
              <option key={op.id} value={op.id}>
                {op.brandName} ({op.experienceYears} Yrs Exp • ★ {op.rating})
              </option>
            ))}
          </select>

          {onOpenOperatorBackend && (
            <button
              onClick={onOpenOperatorBackend}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-xs flex items-center gap-1 transition-all"
              title="Open Operator Enterprise Dashboard (Hidden from Customers)"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Operator Dashboard</span>
            </button>
          )}
        </div>
      </div>

      {/* Operator Hero Profile Header */}
      <div className="bg-gradient-to-br from-amber-950 via-yellow-950 to-stone-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="relative z-10 space-y-5">
          {/* Top Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-extrabold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{currentOperator.verification.badgeText}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              Cert No: {currentOperator.verification.govtCertNumber}
            </span>
            <span className="px-3 py-1 rounded-full bg-white/10 text-slate-200 border border-white/10 text-xs">
              {currentOperator.verification.isoCertified}
            </span>
          </div>

          {/* Title & Brand Intro */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-md shrink-0 bg-white">
                  <img
                    src={currentOperator.logo}
                    alt={currentOperator.brandName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {currentOperator.businessName}
                  </h1>
                  <p className="text-xs text-amber-300 font-semibold">{currentOperator.tagline}</p>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-1">
                {currentOperator.description}
              </p>
            </div>

            {/* Quick Metrics Pillar */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 grid grid-cols-3 gap-4 text-center shrink-0 min-w-[280px]">
              <div>
                <span className="text-lg sm:text-xl font-black text-amber-400 block">
                  {currentOperator.experienceYears}+
                </span>
                <span className="text-[10px] text-slate-300 uppercase font-bold">Years Experience</span>
              </div>
              <div className="border-x border-white/10">
                <span className="text-lg sm:text-xl font-black text-amber-400 block">
                  {(currentOperator.totalYatrisServed / 1000).toFixed(1)}k+
                </span>
                <span className="text-[10px] text-slate-300 uppercase font-bold">Yatris Blessed</span>
              </div>
              <div>
                <span className="text-lg sm:text-xl font-black text-amber-400 flex items-center justify-center gap-0.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  {currentOperator.rating}
                </span>
                <span className="text-[10px] text-slate-300 uppercase font-bold">
                  {currentOperator.reviewsCount} Reviews
                </span>
              </div>
            </div>
          </div>

          {/* Temple Board Empanelments Ticker */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-500/30 flex items-center gap-3 overflow-x-auto text-xs">
            <span className="font-extrabold text-amber-300 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              Empanelled With:
            </span>
            <div className="flex items-center gap-2 shrink-0">
              {currentOperator.verification.templeBoardEmpanelments.map((board, i) => (
                <span
                  key={i}
                  className="px-2.5 py-0.5 rounded-lg bg-amber-500/15 border border-amber-400/20 text-amber-200 text-[11px] font-medium"
                >
                  ✓ {board}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex bg-black/40 p-1.5 rounded-2xl text-xs font-semibold overflow-x-auto gap-1 border border-white/10">
            {[
              { id: "packages", label: `🚩 Yatra Packages (${operatorPackages.length})` },
              { id: "destinations", label: `🪔 Sacred Destinations (${currentOperator.destinations.length})` },
              { id: "stays_transport", label: "🏨 Stays & Transport Fleet" },
              { id: "darshan_purohit", label: "🕉️ VIP Darshan & Purohit Seva" },
              { id: "reviews_gallery", label: "⭐ Reviews & Gallery" },
              { id: "policies_contact", label: "📜 Policies & 24x7 Helpline" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950 font-black shadow-md"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB 1: Yatra Packages Discovery & Instant Booking */}
      {activeTab === "packages" && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search packages, deities, circuits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Circuit:</span>
              {[
                { id: "all", label: "All Circuits" },
                { id: "Char Dham", label: "Char Dham" },
                { id: "12 Jyotirlinga", label: "12 Jyotirlinga" },
                { id: "Sanatan Circuit", label: "Sanatan Circuit" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCircuitFilter(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                    circuitFilter === c.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Packages List */}
          <div className="space-y-6">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-amber-200/80 overflow-hidden hover:border-amber-400 hover:shadow-xl transition-all flex flex-col lg:flex-row group"
              >
                {/* Image Section */}
                <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src={pkg.featuredImage}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-amber-300 text-xs font-bold border border-amber-400/30">
                      {pkg.circuitCategory}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                      {pkg.duration}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 lg:w-2/3 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs font-extrabold text-amber-800 uppercase tracking-wider">
                        Presiding Deity: {pkg.sacredDeity}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{pkg.rating} ({pkg.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-amber-700 font-semibold">{pkg.hindiTitle}</p>

                    {/* Circuit Route */}
                    <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 text-xs text-slate-700">
                      <span className="font-extrabold text-amber-900 block text-[10px] uppercase">
                        Destinations Covered:
                      </span>
                      <p className="mt-0.5 font-medium leading-relaxed">
                        {pkg.destinationsCovered.join(" ➔ ")}
                      </p>
                    </div>

                    {/* Key Inclusions Chips */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">VIP Sugam Darshan</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">Pure Sattvic Bhojan</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <Heart className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span className="text-[11px]">Senior Care &amp; Oxygen</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5 font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-[11px]">Vedic Purohit Pooja</span>
                      </div>
                    </div>

                    {/* Departure Dates Selector Preview */}
                    <div className="pt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">
                        Upcoming Departure Batches (2026 Season):
                      </span>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {pkg.departureDates.map((b) => (
                          <span
                            key={b.id}
                            className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-[11px] font-bold text-slate-800 whitespace-nowrap"
                          >
                            📅 {b.date}{" "}
                            <span className="text-amber-700 font-extrabold">({b.availableSeats} Left)</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pricing and Booking CTA */}
                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900">
                          ₹{pkg.basePricePerPerson.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{pkg.originalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                          {pkg.groupDiscountPercent}% OFF
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block">
                        Per Yatri (All Deluxe Stays, Satvik Meals, VIP Passes &amp; Transfers Included)
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedPackageForBooking(pkg)}
                      className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                    >
                      <span>Book Pilgrimage Yatra</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Sacred Destinations */}
      {activeTab === "destinations" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sacred Dhams &amp; Shrines Network</h2>
              <p className="text-xs text-slate-500">
                Authorized Shrine Trust priority slots and temple liaison offices across India.
              </p>
            </div>
            <span className="text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full font-bold border border-amber-200">
              ✓ Direct Shrine Trust Protocol
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentOperator.destinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-amber-300 text-[10px] font-extrabold uppercase">
                      {dest.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-amber-400 text-slate-950 text-xs font-black">
                    {dest.deity}
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{dest.name}</h3>
                    <p className="text-xs text-amber-700 font-semibold">{dest.location}, {dest.state}</p>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{dest.significance}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Best Season: {dest.bestSeason}</span>
                    <span className="font-bold text-emerald-700">VIP Pass Ready</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Stays & Transport Fleet */}
      {activeTab === "stays_transport" && (
        <div className="space-y-6">
          {/* Stays Overview */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Accommodation &amp; 100% Pure Sattvic Dining Guarantee
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every hotel, ashram, and luxury cottage is handpicked for hygienic traditional standards. We maintain dedicated Sattvic kitchens (No onion, no garlic, rock salt, desi ghee), warm heated rooms, 24/7 hot water geysers, and emergency oxygen concentrators for high altitudes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-black text-amber-950 block text-sm mb-1">Standard Ashrams &amp; Lodges</span>
                <p className="text-slate-600">Peaceful spiritual atmosphere, twin sharing beds, attached baths, and fresh Satvik meals.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-black text-amber-950 block text-sm mb-1">Deluxe 3-Star AC Hotels</span>
                <p className="text-slate-600">Modern air-conditioned rooms, elevator access, doctor on call, and 10 mins from temple corridors.</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                <span className="font-black text-amber-950 block text-sm mb-1">VIP 4-Star Mountain Resorts</span>
                <p className="text-slate-600">Heated pine cottages, panoramic mountain views, in-room oxygen cylinders, and royal Satvik dining.</p>
              </div>
            </div>
          </div>

          {/* Transport Fleet */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-extrabold text-slate-900">
                Pilgrimage Transport Fleet &amp; Mountain Aviation
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block text-sm mb-1">Helicopter Bell 407 &amp; Airbus H125</span>
                <p className="text-slate-600">Twin-engine helicopters with senior DGCA pilots for swift Dehradun-Char Dham helipad transfers.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block text-sm mb-1">Volvo 9600 Luxury Coaches</span>
                <p className="text-slate-600">Multi-axle reclining air-conditioned coaches equipped with live stotram audio and GPS trackers.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="font-black text-slate-900 block text-sm mb-1">Toyota Innova Crysta &amp; Urbania</span>
                <p className="text-slate-600">Private chauffeurs with 15+ years of hill-driving certification and courteous pilgrim etiquette.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: VIP Darshan & Purohit Seva */}
      {activeTab === "darshan_purohit" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              VIP Sugam Darshan Passes &amp; Vedic Purohit Mandali
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <h4 className="font-extrabold text-amber-950 text-sm">VIP Sugam Fast-Track Darshan Passes</h4>
              <p className="text-slate-600 leading-relaxed">
                Direct authorized shrine trust entry. Avoid hours in general queues with pre-cleared biometric passes for Kedarnath, Badrinath, Kashi Vishwanath, Ayodhya Ram Lalla, and Mahakaleshwar Bhasma Aarti.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <h4 className="font-extrabold text-amber-950 text-sm">Licensed Vedic Purohit &amp; Sanskrit Acharyas</h4>
              <p className="text-slate-600 leading-relaxed">
                Certified temple priests assigned to your family for personal Sankalp poojas, Rudrabhishek, Mahamrityunjaya japas, and holy River Sangam snan rituals with authentic pooja samagri.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Reviews & Gallery */}
      {activeTab === "reviews_gallery" && (
        <div className="space-y-6">
          {/* Gallery */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1596405537554-150fae6093d5?w=600&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&auto=format&fit=crop&q=80",
              "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&auto=format&fit=crop&q=80",
            ].map((img, idx) => (
              <div key={idx} className="h-40 rounded-2xl overflow-hidden border border-slate-200">
                <img src={img} alt="Yatra Photo" className="w-full h-full object-cover hover:scale-110 transition-all duration-300" />
              </div>
            ))}
          </div>

          {/* Reviews List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Verified Pilgrim Testimonials</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Justice P. K. Saxena (Retd.)</span>
                  <span className="text-amber-600 font-bold">★ 5.0 (Char Dham Heli)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  "Exemplary VIP arrangements for my 78-year-old parents. Oxygen was readily available at Kedarnath, and Acharya Somnath Shastri conducted our Rudrabhishek with divine devotion."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Smt. Radhika Agarwal, Kolkata</span>
                  <span className="text-amber-600 font-bold">★ 5.0 (Kashi-Ayodhya Circuit)</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  "The private Bajra boat for the Ganga Aarti and the VIP Sugam Darshan at Kashi Vishwanath were completely seamless. Pure Satvik food was delicious."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: Policies & Contact */}
      {activeTab === "policies_contact" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Policies */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4 text-xs">
              <h3 className="text-sm font-extrabold text-slate-900">Yatra Policies &amp; Medical Advisory</h3>
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800">Cancellation &amp; Refund Rules:</h4>
                <ul className="list-disc pl-4 text-slate-600 space-y-1">
                  {currentOperator.policies.cancellationRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1">
                <h4 className="font-bold text-slate-800">Dress Code Notice:</h4>
                <p className="text-slate-600">{currentOperator.policies.dressCodeNotice}</p>
              </div>
            </div>

            {/* 24x7 Helpline & Branch Desks */}
            <div className="bg-amber-950 text-white p-6 rounded-3xl space-y-4 text-xs border border-amber-500/30">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-extrabold text-white">24x7 Pilgrimage Helpline &amp; Control Room</h3>
              </div>

              <div className="space-y-2 text-slate-200">
                <p>
                  <strong className="text-amber-300">Toll-Free Helpline:</strong> {currentOperator.officeContact.helplinePhone}
                </p>
                <p>
                  <strong className="text-amber-300">Emergency SOS Desk:</strong> {currentOperator.officeContact.emergencyYatraPhone}
                </p>
                <p>
                  <strong className="text-amber-300">WhatsApp Support:</strong> {currentOperator.officeContact.whatsapp}
                </p>
                <p>
                  <strong className="text-amber-300">Official Email:</strong> {currentOperator.officeContact.officialEmail}
                </p>
                <p>
                  <strong className="text-amber-300">HQ Office:</strong> {currentOperator.officeContact.hqAddress}, {currentOperator.officeContact.city}
                </p>
              </div>

              <div className="pt-2 border-t border-white/10">
                <span className="font-bold text-amber-300 block mb-1">Liaison Branch Desks:</span>
                <div className="flex flex-wrap gap-1.5">
                  {currentOperator.officeContact.branchOffices.map((branch, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-lg bg-white/10 text-[11px] text-slate-300">
                      📍 {branch}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Booking Profile Modal */}
      <PilgrimageBookingProfileModal
        isOpen={!!selectedPackageForBooking}
        onClose={() => setSelectedPackageForBooking(null)}
        selectedPackage={selectedPackageForBooking}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}
