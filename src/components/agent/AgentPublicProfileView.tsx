import React, { useState } from "react";
import {
  ShieldCheck,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Plane,
  Train,
  Bus,
  Hotel,
  Compass,
  Sparkles,
  ArrowRight,
  Clock,
  Building2,
  Tag,
  Send,
  MessageSquare,
  Lock,
  Search,
  ExternalLink,
  ChevronRight,
  Share2,
  FileText,
  BadgeCheck,
} from "lucide-react";
import {
  TravelAgentPublicProfile,
  AgentTourPackageSummary,
  BookingItem,
  UserProfile,
} from "../../types";
import { TRAVEL_AGENTS_DATABASE } from "../../data/agentProfileData";
import { AgentCustomerBookingModal } from "./AgentCustomerBookingModal";

interface AgentPublicProfileViewProps {
  userProfile: UserProfile;
  onInitiateBooking: (booking: BookingItem) => void;
  onOpenAgentBackend: () => void;
  onOpenAIDrawer: () => void;
}

export function AgentPublicProfileView({
  userProfile,
  onInitiateBooking,
  onOpenAgentBackend,
  onOpenAIDrawer,
}: AgentPublicProfileViewProps) {
  // Agent Selection State
  const [selectedAgentId, setSelectedAgentId] = useState<string>("agent-swastik");
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "services" | "packages" | "offers" | "reviews" | "gallery" | "contact"
  >("overview");

  // Selected Service in multi-service card
  const [selectedServiceBooking, setSelectedServiceBooking] = useState<string>("flights");

  // Customer Enquiry Form State
  const [enquiryName, setEnquiryName] = useState(userProfile.name || "");
  const [enquiryPhone, setEnquiryPhone] = useState(userProfile.phone || "");
  const [enquiryEmail, setEnquiryEmail] = useState(userProfile.email || "");
  const [enquiryDestination, setEnquiryDestination] = useState("Varanasi & Ayodhya");
  const [enquiryService, setEnquiryService] = useState("Pilgrimage & Hotel");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [modalService, setModalService] = useState<string>("flights");
  const [modalPackage, setModalPackage] = useState<AgentTourPackageSummary | null>(null);

  const currentAgent =
    TRAVEL_AGENTS_DATABASE.find((a) => a.id === selectedAgentId) || TRAVEL_AGENTS_DATABASE[0];

  const handleOpenBookingForService = (service: string) => {
    setModalService(service);
    setModalPackage(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenBookingForPackage = (pkg: AgentTourPackageSummary) => {
    setModalPackage(pkg);
    setModalService("tours");
    setIsBookingModalOpen(true);
  };

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;

    setEnquirySuccess(
      `Thank you ${enquiryName}! Your travel enquiry for ${enquiryDestination} has been directly sent to ${currentAgent.agentName}. An authorized travel consultant will call you at ${enquiryPhone} within 15 minutes.`
    );
    setEnquiryMessage("");
    setTimeout(() => setEnquirySuccess(null), 8000);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Banner & Agent Switcher Bar */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block">
              Govt-Accredited Multi-Service Travel Agents
            </span>
            <h1 className="text-base sm:text-lg font-black text-white">
              Authorized Travel Agent Directory &amp; Booking Desks
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Agent Switcher Dropdown */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-2xl">
            <span className="text-xs text-slate-400 font-semibold hidden md:inline">Select Partner:</span>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-hidden cursor-pointer"
            >
              {TRAVEL_AGENTS_DATABASE.map((agent) => (
                <option key={agent.id} value={agent.id} className="bg-slate-900 text-white">
                  {agent.businessName} ({agent.officeDetails.headOffice.city})
                </option>
              ))}
            </select>
          </div>

          {/* Dedicated Agent Backend Login */}
          <button
            onClick={onOpenAgentBackend}
            className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all shrink-0"
            title="Access private Agent CRM, GDS ticketing, markup rules & financial settlements"
          >
            <Lock className="w-3.5 h-3.5 text-indigo-200" />
            <span>Agent Dashboard / Console</span>
          </button>
        </div>
      </div>

      {/* Main Agent Hero Card */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 w-full bg-slate-800">
          <img
            src={currentAgent.coverImage}
            alt={currentAgent.businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

          {/* Floating Badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2 flex-wrap justify-end">
            <span className="px-3 py-1 rounded-full bg-emerald-500/90 backdrop-blur-xs text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
              <BadgeCheck className="w-4 h-4" />
              Verified Multi-Service Partner
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-amber-300 text-xs font-bold flex items-center gap-1 border border-amber-400/30">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              {currentAgent.rating} ({currentAgent.reviewsCount} verified reviews)
            </span>
          </div>

          {/* Agency Name & Logo on Banner */}
          <div className="absolute bottom-4 left-4 sm:left-6 right-4 flex items-end gap-4 text-white">
            <img
              src={currentAgent.logo}
              alt={currentAgent.agentName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white shadow-xl shrink-0"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs text-indigo-300 font-bold uppercase tracking-wider block">
                {currentAgent.tradeName} • {currentAgent.yearsExperience}+ Years Experience
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white truncate leading-tight">
                {currentAgent.businessName}
              </h2>
              <p className="text-xs text-slate-200 truncate mt-0.5 opacity-90 hidden sm:block">
                {currentAgent.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Agency Navigation Sub-Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs font-bold text-slate-600">
          {[
            { id: "overview", label: "Agency Overview" },
            { id: "services", label: `Book Services (${currentAgent.services.length})` },
            { id: "packages", label: `Tour Packages (${currentAgent.packages.length})` },
            { id: "offers", label: `Special Offers (${currentAgent.offers.length})` },
            { id: "reviews", label: `Customer Reviews (${currentAgent.reviews.length})` },
            { id: "gallery", label: `Office & Gallery` },
            { id: "contact", label: `Office & Direct Support` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "hover:bg-slate-200/70 text-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dynamic Sub-Tab Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeSubTab === "overview" && (
            <div className="space-y-6">
              {/* Statutory Verification Badges Banner */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-700" />
                    Government &amp; Industry Accreditations
                  </h3>
                  <span className="text-[11px] text-indigo-700 font-bold">100% Trust Guarantee</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  {currentAgent.verificationBadges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-indigo-100 rounded-2xl p-3 space-y-1 shadow-2xs text-left"
                    >
                      <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-black uppercase">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{badge.label}</h4>
                      <p className="text-[10px] text-slate-500 font-mono truncate">{badge.badgeCode}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio & Specialties Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      About {currentAgent.businessName}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {currentAgent.description}
                    </p>
                  </div>

                  {/* Specialties List */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold text-slate-800">Core Specialties &amp; Capabilities</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentAgent.specialties.map((spec, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></div>
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Multi-Service Booking Quick Bar */}
                  <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase block">
                          Instant Multi-Service Desk
                        </span>
                        <h4 className="text-sm font-bold text-white">
                          Book Directly with {currentAgent.agentName}
                        </h4>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                        Zero Convenience Fee
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { id: "flights", label: "Flights", icon: Plane },
                        { id: "trains", label: "Trains", icon: Train },
                        { id: "buses", label: "Buses", icon: Bus },
                        { id: "hotels", label: "Hotels", icon: Hotel },
                        { id: "tours", label: "Tours", icon: Compass },
                        { id: "pilgrimage", label: "Yatras", icon: Sparkles },
                      ].map((srv) => {
                        const Icon = srv.icon;
                        return (
                          <button
                            key={srv.id}
                            onClick={() => handleOpenBookingForService(srv.id)}
                            className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 text-center flex flex-col items-center gap-1 text-xs font-bold text-white transition-colors"
                          >
                            <Icon className="w-4 h-4 text-cyan-300" />
                            <span>{srv.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Direct Agent Contact & Quick Enquiry Card */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Principal Agent Contact
                    </h4>
                    <p className="text-xs text-slate-500">Direct booking desk with instant confirmation</p>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{currentAgent.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{currentAgent.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>{currentAgent.officeDetails.workingHours}</span>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-700">
                      <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>
                        {currentAgent.officeDetails.headOffice.address},{" "}
                        {currentAgent.officeDetails.headOffice.city}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <a
                      href={`https://wa.me/${currentAgent.contact.whatsapp.replace(/[^0-9]/g, "")}?text=Hi%20${encodeURIComponent(
                        currentAgent.agentName
                      )},%20I%20want%20to%20enquire%20about%20a%20travel%20booking.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat on WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleOpenBookingForService("flights")}
                      className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs"
                    >
                      <span>Start Direct Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-SERVICE BOOKINGS */}
          {activeSubTab === "services" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Comprehensive Booking Services via {currentAgent.businessName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Book flights, trains, buses, luxury hotels, and pilgrimages with verified agent guarantees
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    id: "flights",
                    title: "Domestic & International Flights",
                    desc: "IndiGo, Air India, Vistara, Akasa Air, Emirates GDS & NDC agent fares with seat selection.",
                    icon: Plane,
                    startingFrom: "₹3,450",
                    badge: "IATA Member",
                  },
                  {
                    id: "trains",
                    title: "IRCTC Train Ticketing",
                    desc: "Vande Bharat, Rajdhani, Tejas & Shatabdi reservations. Tatkal and Agent Quota fulfillment.",
                    icon: Train,
                    startingFrom: "₹450",
                    badge: "Authorized IRCTC",
                  },
                  {
                    id: "buses",
                    title: "Luxury Volvo & Sleeper Buses",
                    desc: "Intercity AC sleeper, multi-axle Volvo & Scania buses with live GPS tracking.",
                    icon: Bus,
                    startingFrom: "₹750",
                    badge: "All-India Permits",
                  },
                  {
                    id: "hotels",
                    title: "4-Star & 5-Star Hotel Stays",
                    desc: "Direct B2B contracted room rates at Taj, Oberoi, ITC, Marriott, and boutique heritage stays.",
                    icon: Hotel,
                    startingFrom: "₹3,200/night",
                    badge: "Best Rate Guarantee",
                  },
                  {
                    id: "tours",
                    title: "Curated Holiday Packages",
                    desc: "Custom holiday circuits with private chauffeur cabs, sightseeing passes, and expert guides.",
                    icon: Compass,
                    startingFrom: "₹18,500",
                    badge: "Ministry of Tourism",
                  },
                  {
                    id: "pilgrimage",
                    title: "Spiritual Yatras & Darshan",
                    desc: "Char Dham, Kashi Vishwanath, Ayodhya, Tirupati Balaji with VIP temple entry protocols.",
                    icon: Sparkles,
                    startingFrom: "₹14,500",
                    badge: "VIP Darshan",
                  },
                ].map((srv) => {
                  const Icon = srv.icon;
                  return (
                    <div
                      key={srv.id}
                      className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            {srv.badge}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{srv.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed">{srv.desc}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Starting From</span>
                          <strong className="text-sm font-extrabold text-indigo-900">{srv.startingFrom}</strong>
                        </div>

                        <button
                          onClick={() => handleOpenBookingForService(srv.id)}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>Book Service</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PUBLISHED PACKAGES */}
          {activeSubTab === "packages" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">
                    Published Tour Packages &amp; Holiday Itineraries
                  </h3>
                  <p className="text-xs text-slate-500">
                    Curated directly by {currentAgent.businessName} with stay, transfers &amp; sightseeing
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentAgent.packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full">
                        <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                          {pkg.duration}
                        </div>
                        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold flex items-center gap-1 shadow-sm">
                          <Star className="w-3 h-3 fill-slate-950" />
                          {pkg.rating}
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">
                          {pkg.destination}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {pkg.title}
                        </h4>

                        <div className="space-y-1 text-[11px] text-slate-600">
                          {pkg.inclusions.slice(0, 3).map((inc, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 line-through block">
                          ₹{pkg.originalPrice.toLocaleString("en-IN")}
                        </span>
                        <span className="text-base font-black text-slate-900">
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-500"> / adult</span>
                      </div>

                      <button
                        onClick={() => handleOpenBookingForPackage(pkg)}
                        className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Book Package
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFERS */}
          {activeSubTab === "offers" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Exclusive Travel Agent Discount Deals</h3>
                <p className="text-xs text-slate-500">Apply these promo codes during booking checkout</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentAgent.offers.map((offer) => (
                  <div
                    key={offer.code}
                    className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50 to-cyan-50 border border-indigo-200 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-xl bg-indigo-600 text-white font-mono text-xs font-black tracking-wider">
                        {offer.code}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-900">{offer.discountText}</span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{offer.title}</h4>
                      <p className="text-[11px] text-slate-600 mt-1">{offer.description}</p>
                    </div>

                    <div className="pt-2 border-t border-indigo-200/60 text-[10px] text-slate-500 flex items-center justify-between">
                      <span>Valid till {offer.validTill}</span>
                      <span>Min Booking: ₹{offer.minAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REVIEWS */}
          {activeSubTab === "reviews" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Verified Customer Testimonials</h3>
                  <p className="text-xs text-slate-500">
                    Average {currentAgent.rating}/5.0 based on {currentAgent.reviewsCount} customer bookings
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentAgent.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{rev.author}</h4>
                        <span className="text-[10px] text-slate-400">{rev.city} • {rev.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="font-semibold text-indigo-700">{rev.serviceBooked}</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified Traveller
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {activeSubTab === "gallery" && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Office &amp; Tour Operations Gallery</h3>
                <p className="text-xs text-slate-500">Real offices, fleet vehicles, and guided tour memories</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {currentAgent.gallery.map((item, idx) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200 group bg-slate-900">
                    <img
                      src={item.url}
                      alt={item.caption}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="p-2.5 bg-white text-xs font-semibold text-slate-800">
                      {item.caption}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: CONTACT & ENQUIRY */}
          {activeSubTab === "contact" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Office Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  Office Locations &amp; Licenses
                </h3>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">Principal Head Office:</strong>
                    <p>{currentAgent.officeDetails.headOffice.address}</p>
                    <p>{currentAgent.officeDetails.headOffice.city}, {currentAgent.officeDetails.headOffice.state} - {currentAgent.officeDetails.headOffice.pincode}</p>
                  </div>

                  {currentAgent.officeDetails.branchOffices?.map((br, i) => (
                    <div key={i} className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                      <strong className="text-slate-900 block font-bold">Branch: {br.city}</strong>
                      <p>{br.address}</p>
                      <p className="text-indigo-700 font-semibold">{br.phone}</p>
                    </div>
                  ))}

                  <div className="p-3 bg-white rounded-2xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 block font-bold">Tax &amp; Statutory Registrations:</strong>
                    <p>GSTIN: <strong>{currentAgent.accreditations.gstin}</strong></p>
                    <p>PAN: <strong>{currentAgent.accreditations.pan}</strong></p>
                  </div>
                </div>
              </div>

              {/* Instant Enquiry Form */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Send Travel Enquiry / Custom Quotation
                  </h3>
                  <p className="text-xs text-slate-500">Get a personalized itinerary and best quote within 15 minutes</p>
                </div>

                {enquirySuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{enquirySuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSendEnquiry} className="space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        value={enquiryName}
                        onChange={(e) => setEnquiryName(e.target.value)}
                        placeholder="e.g. Vikramaditya Joshi"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={enquiryPhone}
                        onChange={(e) => setEnquiryPhone(e.target.value)}
                        placeholder="+91 98230 45678"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Destination / Sector</label>
                      <input
                        type="text"
                        value={enquiryDestination}
                        onChange={(e) => setEnquiryDestination(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Service Type</label>
                      <input
                        type="text"
                        value={enquiryService}
                        onChange={(e) => setEnquiryService(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Your Message / Requirements</label>
                    <textarea
                      rows={3}
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="e.g. Need 4 flight tickets, 3-night 4-star hotel in Varanasi with VIP Ganga Aarti boat pass."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Travel Enquiry</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Customer Booking Modal */}
      <AgentCustomerBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        agent={currentAgent}
        initialService={modalService}
        initialPackage={modalPackage}
        userProfile={userProfile}
        onBookingSuccess={(booking) => {
          onInitiateBooking(booking);
        }}
      />
    </div>
  );
}
