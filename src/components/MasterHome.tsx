import React, { useState } from "react";
import {
  Sparkles,
  Plane,
  Train,
  Bus,
  Building2,
  Hotel,
  Palmtree,
  Map,
  Landmark,
  Car,
  UtensilsCrossed,
  Briefcase,
  Compass,
  Handshake,
  Search,
  ArrowRight,
  ShieldCheck,
  Star,
  Zap,
  Tag,
  Clock,
  CheckCircle2,
  Copy,
  ChevronRight,
  TrendingUp,
  Flame,
  Tent,
} from "lucide-react";
import { ServiceCategory, CityLocation, TravelOffer, UserProfile, PartnerCategory } from "../types";
import {
  SERVICE_CATEGORIES,
  PROMO_OFFERS,
  CITIES_DATABASE,
  MOCK_FLIGHTS,
  MOCK_TRAINS,
  MOCK_HOTELS,
  MOCK_YATRAS,
  MOCK_RESORTS,
} from "../data/mockTravelData";
import { PARTNER_CATEGORIES_META } from "../data/partnerData";

interface MasterHomeProps {
  currentLocation: CityLocation;
  onSelectCategory: (category: ServiceCategory) => void;
  onOpenLocationModal?: () => void;
  onOpenSearchModal: () => void;
  onOpenAIDrawer: () => void;
  onOpenCompare: () => void;
  onOpenTripPlanner: () => void;
  onOpenRewards: () => void;
  onOpenMyTrips?: () => void;
  onOpenOffers: () => void;
  onSelectOffer?: (offer: TravelOffer) => void;
  onQuickBookItem?: (item: any, category: ServiceCategory) => void;
  onInitiateBooking?: (item: any, category: ServiceCategory) => void;
  onOpenPartnerPortal?: (category?: PartnerCategory) => void;
  onOpenAdminPlatform?: (tab?: any) => void;
  onOpenPaymentFinance?: () => void;
  onOpenDestinationGuides?: () => void;
  onOpenCustomerReviews?: () => void;
  onOpenHelpSupport?: () => void;
  userProfile?: UserProfile;
}

export function MasterHome({
  currentLocation,
  onSelectCategory,
  onOpenLocationModal,
  onOpenSearchModal,
  onOpenAIDrawer,
  onOpenCompare,
  onOpenTripPlanner,
  onOpenRewards,
  onOpenMyTrips,
  onOpenOffers,
  onSelectOffer,
  onQuickBookItem,
  onInitiateBooking,
  onOpenPartnerPortal,
  onOpenAdminPlatform,
  onOpenPaymentFinance,
  onOpenDestinationGuides,
  onOpenCustomerReviews,
  onOpenHelpSupport,
  userProfile,
}: MasterHomeProps) {
  const [selectedPersona, setSelectedPersona] = useState<"family" | "spiritual" | "solo" | "corporate" | "luxury">("family");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const getServiceIcon = (name: string) => {
    switch (name) {
      case "Plane": return <Plane className="w-6 h-6" />;
      case "Train": return <Train className="w-6 h-6" />;
      case "Bus": return <Bus className="w-6 h-6" />;
      case "Building2": return <Building2 className="w-6 h-6" />;
      case "Palmtree": return <Palmtree className="w-6 h-6" />;
      case "Map": return <Map className="w-6 h-6" />;
      case "Landmark": return <Landmark className="w-6 h-6" />;
      case "Car": return <Car className="w-6 h-6" />;
      case "UtensilsCrossed": return <UtensilsCrossed className="w-6 h-6" />;
      case "Briefcase": return <Briefcase className="w-6 h-6" />;
      case "Tent": return <Tent className="w-6 h-6" />;
      default: return <Sparkles className="w-6 h-6" />;
    }
  };

  const getPartnerMetaIcon = (name: string) => {
    switch (name) {
      case "Briefcase": return <Briefcase className="w-5 h-5" />;
      case "Bus": return <Bus className="w-5 h-5" />;
      case "Hotel": return <Hotel className="w-5 h-5" />;
      case "Palmtree": return <Palmtree className="w-5 h-5" />;
      case "Compass": return <Compass className="w-5 h-5" />;
      case "Sparkles": return <Sparkles className="w-5 h-5" />;
      case "Car": return <Car className="w-5 h-5" />;
      case "UtensilsCrossed": return <UtensilsCrossed className="w-5 h-5" />;
      default: return <Building2 className="w-5 h-5" />;
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 1. MASTER HERO & LOCATION GREETING */}
      <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15 flex items-center gap-1.5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              India&apos;s Comprehensive Travel &amp; Mobility Super App
            </span>
            <button
              onClick={onOpenLocationModal}
              className="text-xs text-indigo-300 hover:text-white underline font-semibold flex items-center gap-1"
            >
              <span>Departing from {currentLocation.name}</span>
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Where to in <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">Bharat</span> today?
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Book Flights, IRCTC Vande Bharat Trains, AC Sleeper Buses, Heritage Stays, Luxury Resorts, Sacred Yatras, and Outstation Cabs in one unified ecosystem.
            </p>
          </div>

          {/* Quick AI & Natural Search Trigger Bar */}
          <div className="pt-2">
            <button
              onClick={onOpenSearchModal}
              className="w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-white text-slate-800 shadow-xl hover:shadow-2xl hover:ring-4 hover:ring-indigo-500/30 transition-all text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-900 block">
                    Search any destination, Vande Bharat train, hotel, or Yatra package...
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:block">
                    Try &quot;Vande Bharat from Delhi to Varanasi&quot; or &quot;4-day Goa luxury beach villa&quot;
                  </span>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs flex items-center gap-1 group-hover:bg-indigo-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Search</span>
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* UNIFIED CUSTOMER JOURNEY LIFECYCLE BAR */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-extrabold uppercase">
                Customer Experience
              </span>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                Seamless End-to-End Journey Architecture
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              One account for all travel services — discover, compare, bundle, and manage digital tickets
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCompare}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-all flex items-center gap-1"
            >
              <span>Compare Modes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onOpenTripPlanner}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <span>Plan Journey</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 7-Step Interactive Journey Flow */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4">
          {[
            {
              step: "1. Search",
              desc: "10 Core Services",
              action: onOpenSearchModal,
              color: "hover:border-sky-400 bg-sky-50/50 text-sky-900",
              btnText: "Quick Search",
            },
            {
              step: "2. Compare",
              desc: "Train vs Air vs Bus",
              action: onOpenCompare,
              color: "hover:border-indigo-400 bg-indigo-50/50 text-indigo-900",
              btnText: "Compare",
            },
            {
              step: "3. Plan",
              desc: "Multi-service Packages",
              action: onOpenTripPlanner,
              color: "hover:border-amber-400 bg-amber-50/50 text-amber-900",
              btnText: "Plan Trip",
            },
            {
              step: "4. Book",
              desc: "Single-view Checkout",
              action: () => onSelectCategory("flights"),
              color: "hover:border-emerald-400 bg-emerald-50/50 text-emerald-900",
              btnText: "Book Now",
            },
            {
              step: "5. Pay",
              desc: "Wallet & YatraCoins",
              action: onOpenRewards,
              color: "hover:border-purple-400 bg-purple-50/50 text-purple-900",
              btnText: "Wallet & Cash",
            },
            {
              step: "6. Travel",
              desc: "Digital QR Passes",
              action: onOpenMyTrips,
              color: "hover:border-rose-400 bg-rose-50/50 text-rose-900",
              btnText: "Boarding Pass",
            },
            {
              step: "7. Manage",
              desc: "Refunds & Support",
              action: onOpenMyTrips,
              color: "hover:border-slate-400 bg-slate-100 text-slate-900",
              btnText: "My Trips",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={item.action}
              className={`p-3 rounded-2xl border border-slate-200 ${item.color} cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between`}
            >
              <div>
                <span className="font-extrabold text-xs block">{item.step}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">{item.desc}</span>
              </div>
              <div className="mt-2 text-[10px] font-bold text-indigo-700 flex items-center gap-0.5">
                <span>{item.btnText}</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. MAIN SERVICE CATEGORIES (Swiggy Multi-Service Model) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              All Travel Services &amp; Dedicated Portals
            </h2>
            <p className="text-xs text-slate-500">Select any dedicated service entry point for tailored booking workflows</p>
          </div>
          <span className="hidden sm:inline-block text-xs text-slate-400 font-semibold">10 Dedicated Portals</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
          {SERVICE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              id={`card-service-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all text-left flex flex-col justify-between space-y-4 group relative overflow-hidden hover:-translate-y-0.5"
            >
              {cat.badge && (
                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[9px] font-extrabold uppercase border border-amber-300">
                  {cat.badge}
                </span>
              )}

              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                {getServiceIcon(cat.icon)}
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">({cat.hindiName})</span>
                </div>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-snug">
                  {cat.tagline}
                </p>
                <div className="mt-2.5 flex items-center gap-1 text-[11px] font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Enter Portal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. OFFERS & BANK DEALS CAROUSEL */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Featured Bank Offers &amp; Promo Coupons</h2>
          </div>
          <span className="text-xs text-slate-400">Click coupon to copy &amp; apply</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROMO_OFFERS.slice(0, 3).map((offer) => (
            <div
              key={offer.id}
              className={`bg-gradient-to-br ${offer.bgGradient} rounded-2xl p-5 text-white shadow-md flex flex-col justify-between space-y-4 relative overflow-hidden`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-md font-bold uppercase">
                    {offer.bank || "Exclusive Deal"}
                  </span>
                  <span className="text-white/80 font-mono text-[11px]">Valid till {offer.validTill}</span>
                </div>

                <h3 className="text-lg font-black mt-3 leading-snug">{offer.title}</h3>
                <p className="text-xs text-white/80 mt-1 line-clamp-2">{offer.subtitle}</p>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between">
                <div className="font-mono text-sm font-bold bg-white/20 px-3 py-1 rounded-lg border border-white/30 tracking-wider">
                  {offer.code}
                </div>

                <button
                  onClick={() => handleCopyCode(offer.code)}
                  className="flex items-center gap-1 text-xs font-bold bg-white text-slate-950 px-3 py-1.5 rounded-lg hover:bg-white/90 transition-colors shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode === offer.code ? "Copied!" : "Copy Code"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. PERSONALIZED CONTENT & PERSONA SWITCHER */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Personalized For You</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">Explore by Travel Persona &amp; Style</h2>
          </div>

          <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            {[
              { id: "family", label: "👨‍👩‍👧 Family Trip" },
              { id: "spiritual", label: "🛕 Sacred Yatra" },
              { id: "solo", label: "🎒 Solo Backpacker" },
              { id: "luxury", label: "🌴 Luxury Retreat" },
              { id: "corporate", label: "🏢 Business Traveler" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPersona(p.id as any)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  selectedPersona === p.id
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Persona Based Adaptive Content */}
        {selectedPersona === "family" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-fuchsia-600 bg-fuchsia-50 px-2 py-0.5 rounded">All-Inclusive Tour</span>
              <h4 className="font-bold text-slate-900 text-sm">Golden Triangle Family Package (5D/4N)</h4>
              <p className="text-xs text-slate-500">Delhi, Agra Taj Mahal, and Jaipur Forts with private AC vehicle.</p>
              <button
                onClick={() => onSelectCategory("tours")}
                className="text-xs font-bold text-indigo-600 hover:underline pt-2 block"
              >
                Explore Tours ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">High Speed Rail</span>
              <h4 className="font-bold text-slate-900 text-sm">Vande Bharat Express Family Seats</h4>
              <p className="text-xs text-slate-500">Adjacent window seats with gourmet onboard meals included.</p>
              <button
                onClick={() => onSelectCategory("trains")}
                className="text-xs font-bold text-indigo-600 hover:underline pt-2 block"
              >
                Book Vande Bharat ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">Outstation Fleet</span>
              <h4 className="font-bold text-slate-900 text-sm">Toyota Innova Crysta with Captain Seats</h4>
              <p className="text-xs text-slate-500">Spacious 7-seater with ample boot space and expert mountain drivers.</p>
              <button
                onClick={() => onSelectCategory("cabs")}
                className="text-xs font-bold text-indigo-600 hover:underline pt-2 block"
              >
                Reserve Innova ➔
              </button>
            </div>
          </div>
        )}

        {selectedPersona === "spiritual" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Chardham 2026</span>
              <h4 className="font-bold text-slate-900 text-sm">Yamunotri, Gangotri, Kedarnath, Badrinath</h4>
              <p className="text-xs text-slate-500">VIP Darshan pass, pure Satvik bhojan, and senior care assistance.</p>
              <button
                onClick={() => onSelectCategory("pilgrimage")}
                className="text-xs font-bold text-amber-700 hover:underline pt-2 block"
              >
                View Chardham Packages ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Sacred Ghats</span>
              <h4 className="font-bold text-slate-900 text-sm">Kashi Vishwanath Corridor &amp; Ganga Aarti</h4>
              <p className="text-xs text-slate-500">Private Bajra boat ride during sunset with Vedic Purohit chanting.</p>
              <button
                onClick={() => onSelectCategory("pilgrimage")}
                className="text-xs font-bold text-amber-700 hover:underline pt-2 block"
              >
                Book Kashi Yatra ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">South Divya Kshetram</span>
              <h4 className="font-bold text-slate-900 text-sm">Tirupati Balaji Special Seeghra Darshan</h4>
              <p className="text-xs text-slate-500">Guaranteed ₹300 Special Darshan ticket and complimentary Laddu Prasadam.</p>
              <button
                onClick={() => onSelectCategory("pilgrimage")}
                className="text-xs font-bold text-amber-700 hover:underline pt-2 block"
              >
                Book Tirupati Pass ➔
              </button>
            </div>
          </div>
        )}

        {selectedPersona === "luxury" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Ayurveda</span>
              <h4 className="font-bold text-slate-900 text-sm">Kerala Backwaters Luxury Ayurveda Resort</h4>
              <p className="text-xs text-slate-500">Private lakefront pool villas with personalized wellness programs.</p>
              <button
                onClick={() => onSelectCategory("resorts")}
                className="text-xs font-bold text-emerald-600 hover:underline pt-2 block"
              >
                View Luxury Resorts ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Royal Heritage</span>
              <h4 className="font-bold text-slate-900 text-sm">The Royal Heritage Haveli, Jaipur</h4>
              <p className="text-xs text-slate-500">Historic 18th-century suites with candlelit courtyard dining.</p>
              <button
                onClick={() => onSelectCategory("hotels")}
                className="text-xs font-bold text-indigo-600 hover:underline pt-2 block"
              >
                Book Heritage Haveli ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-sky-600 bg-sky-50 px-2 py-0.5 rounded">Aviation</span>
              <h4 className="font-bold text-slate-900 text-sm">Business &amp; Premium Economy Flights</h4>
              <p className="text-xs text-slate-500">Priority check-in, lounge access, and gourmet multi-course meals.</p>
              <button
                onClick={() => onSelectCategory("flights")}
                className="text-xs font-bold text-sky-600 hover:underline pt-2 block"
              >
                Search Premium Flights ➔
              </button>
            </div>
          </div>
        )}

        {(selectedPersona === "solo" || selectedPersona === "corporate") && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-slate-700 bg-slate-100 px-2 py-0.5 rounded">GST Tax Invoicing</span>
              <h4 className="font-bold text-slate-900 text-sm">Save 18% with Corporate GSTIN Billing</h4>
              <p className="text-xs text-slate-500">Automated expense reports and input tax credits on flights &amp; hotels.</p>
              <button
                onClick={() => onSelectCategory("corporate")}
                className="text-xs font-bold text-slate-900 hover:underline pt-2 block"
              >
                Corporate Desk ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded">Mobility</span>
              <h4 className="font-bold text-slate-900 text-sm">Overnight Volvo 9600 Multi-Axle Sleeper</h4>
              <p className="text-xs text-slate-500">Clean washroom stops, fast charging, and Primo punctuality guarantee.</p>
              <button
                onClick={() => onSelectCategory("buses")}
                className="text-xs font-bold text-rose-600 hover:underline pt-2 block"
              >
                Search Buses ➔
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
              <span className="text-[10px] font-bold uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Food Delivery</span>
              <h4 className="font-bold text-slate-900 text-sm">Food on Train Seat Delivery</h4>
              <p className="text-xs text-slate-500">Order from Haldiram&apos;s and Domino&apos;s directly to your train coach.</p>
              <button
                onClick={() => onSelectCategory("dining")}
                className="text-xs font-bold text-orange-600 hover:underline pt-2 block"
              >
                Order Train Meal ➔
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 5. RECENTLY USED SERVICES & QUICK RE-BOOK */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Recently Used Services &amp; Quick Re-book</h2>
          </div>
          <span className="text-xs text-slate-400">1-click re-book with saved profile</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              service: "flights" as ServiceCategory,
              title: "DEL ➔ BOM",
              desc: "IndiGo 6E-2041 (Non-stop)",
              price: 3899,
              icon: <Plane className="w-4 h-4 text-sky-600" />,
            },
            {
              service: "trains" as ServiceCategory,
              title: "NDLS ➔ BSB",
              desc: "Vande Bharat Express (22436)",
              price: 1750,
              icon: <Train className="w-4 h-4 text-amber-600" />,
            },
            {
              service: "hotels" as ServiceCategory,
              title: "The Royal Haveli",
              desc: "Jaipur • Deluxe Suite",
              price: 4850,
              icon: <Building2 className="w-4 h-4 text-indigo-600" />,
            },
            {
              service: "cabs" as ServiceCategory,
              title: "Airport AC Sedan",
              desc: "Doorstep Pickup • No Toll Fees",
              price: 1450,
              icon: <Car className="w-4 h-4 text-cyan-600" />,
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate max-w-[120px]">{item.desc}</p>
                  <span className="text-xs font-black text-slate-800">₹{item.price.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectCategory(item.service)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-[11px] font-bold hover:bg-indigo-600 transition-colors"
              >
                Re-book
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DEDICATED PARTNER ECOSYSTEM (8 PLATFORMS & 9 CAPABILITY PILLARS) */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/40 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
                B2B & Merchant Infrastructure
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                Instant Payouts & T+1 Settlement
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black mt-1 tracking-tight text-white">
              BharatYatra Partner Ecosystem
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
              Dedicated management platforms for <span className="font-semibold text-white">Travel Agents → Bus Operators → Hotels → Resorts → Tour Operators → Pilgrimage Operators → Cab Operators → Restaurants</span>.
            </p>
          </div>

          <button
            onClick={() => onOpenPartnerPortal?.("travel_agents")}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-extrabold shadow-lg transition-all flex items-center gap-2 self-start lg:self-auto shrink-0"
          >
            <span>Launch Partner Portal</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8 Core Platforms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {PARTNER_CATEGORIES_META.map((partner) => (
            <button
              key={partner.id}
              onClick={() => onOpenPartnerPortal?.(partner.id)}
              className="group bg-slate-800/80 hover:bg-slate-850 border border-slate-700/70 hover:border-indigo-500/60 p-3 rounded-2xl flex flex-col items-center text-center transition-all hover:scale-105 shadow-xs"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center text-white font-bold shadow-md group-hover:rotate-6 transition-transform mb-2`}>
                {getPartnerMetaIcon(partner.icon)}
              </div>
              <span className="text-xs font-extrabold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                {partner.name}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {partner.badge}
              </span>
            </button>
          ))}
        </div>

        {/* 9 Capability Pillars Pill List */}
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">
              9 Full-Stack Capabilities:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {[
                "📦 Inventory",
                "📅 Availability",
                "🏷️ Pricing Rules",
                "🎟️ Live Bookings",
                "👥 Customers & CRM",
                "💳 Real-time Ledger",
                "🤝 Tier Commissions",
                "🏦 T+1 Settlements",
                "📈 BI Reports",
              ].map((cap, cIdx) => (
                <span
                  key={cIdx}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-medium border border-slate-700"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 7. TRUST & SECURITY BADGES */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <ShieldCheck className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-base font-bold">Why 4.2 Million Travelers Trust BharatYatra</h3>
            <p className="text-xs text-slate-400 mt-0.5">IRCTC Authorized Rail Partner • DGCA Airline Certified • 100% Refund Insurance</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>₹0 IRCTC Gateway Fee</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>24x7 Airport Concierge</span>
          </div>
          <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Instant Tatkal Pass</span>
          </div>
        </div>
      </div>
    </div>
  );
}
