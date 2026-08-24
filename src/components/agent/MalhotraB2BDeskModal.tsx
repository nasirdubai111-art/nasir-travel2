import React, { useState } from "react";
import {
  X,
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
  Car,
  UtensilsCrossed,
  Palmtree,
  Ship,
  Briefcase,
  Flame,
  Info,
  Check,
  CreditCard,
  Download,
  Printer,
  ChevronDown,
  Navigation,
  Coffee,
  Wifi,
  Tv,
  Eye,
  AlertCircle
} from "lucide-react";
import {
  TravelAgentPublicProfile,
  BookingItem,
  UserProfile,
} from "../../types";
import { TRAVEL_AGENTS_DATABASE } from "../../data/agentProfileData";

interface MalhotraB2BDeskModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onInitiateBooking: (booking: BookingItem) => void;
  onAddBookingToState?: (booking: BookingItem) => void;
  onOpenAIDrawer: () => void;
  initialVertical?: string;
}

export function MalhotraB2BDeskModal({
  isOpen,
  onClose,
  userProfile,
  onInitiateBooking,
  onAddBookingToState,
  onOpenAIDrawer,
  initialVertical = "bus",
}: MalhotraB2BDeskModalProps) {
  const malhotraProfile =
    TRAVEL_AGENTS_DATABASE.find((a) => a.id === "agent-malhotra") ||
    TRAVEL_AGENTS_DATABASE[0];

  // Active Tab: "desk_overview" or 1 of the 11 Operator Profiles
  const [activeTab, setActiveTab] = useState<string>(initialVertical);

  // Quick Lead / B2B Enquiry Form State
  const [enquiryName, setEnquiryName] = useState(userProfile.name || "");
  const [enquiryPhone, setEnquiryPhone] = useState(userProfile.phone || "");
  const [enquiryEmail, setEnquiryEmail] = useState(userProfile.email || "");
  const [enquiryVertical, setEnquiryVertical] = useState("Corporate Flight & Hotel Blocks");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);

  // Interactive Booking Simulation State
  const [selectedSeat, setSelectedSeat] = useState<string>("L-04 (Lower Berth)");
  const [selectedRoomType, setSelectedRoomType] = useState<string>("Deluxe Palace King");
  const [selectedTrainClass, setSelectedTrainClass] = useState<string>("Executive Chair Car (EC)");
  const [selectedMealPlan, setSelectedMealPlan] = useState<string>("MAP (Breakfast & Dinner Included)");
  const [selectedCabType, setSelectedCabType] = useState<string>("Innova Crysta Luxury SUV");
  const [selectedHouseboatType, setSelectedHouseboatType] = useState<string>("2-BHK Deluxe Kettuvallam");
  const [selectedYatraBatch, setSelectedYatraBatch] = useState<string>("15 Sep 2026 (Navratri Special)");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [travelDate, setTravelDate] = useState<string>("2026-09-15");
  const [passengerName, setPassengerName] = useState<string>(userProfile.name || "Aarav Sharma");
  const [passengerPhone, setPassengerPhone] = useState<string>(userProfile.phone || "+91 98765 43210");
  const [activeInvoice, setActiveInvoice] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleSendEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryName || !enquiryPhone) return;
    setEnquirySuccess(
      `Your B2B enquiry for "${enquiryVertical}" has been dispatched to Malhotra World Travels 24/7 Operations Desk. Senior Consultant Rajesh Malhotra's team will contact you at ${enquiryPhone} within 15 minutes.`
    );
    setEnquiryMessage("");
    setTimeout(() => setEnquirySuccess(null), 9000);
  };

  const handleGenerateInvoice = (serviceName: string, serviceTitle: string, basePrice: number, serviceType: any) => {
    const gstAmount = Math.round(basePrice * 0.12);
    const totalAmount = basePrice + gstAmount;
    const invNumber = `INV-MWT-${Math.floor(100000 + Math.random() * 900000)}`;
    const pnrRef = `MWT-${serviceName.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: BookingItem = {
      id: `BK-MWT-${Date.now()}`,
      serviceType: serviceType || "flights",
      title: serviceTitle,
      subtitle: `Organized by Malhotra World Travels & B2B Desk • PNR: ${pnrRef}`,
      provider: "Malhotra World Travels India Pvt. Ltd.",
      date: travelDate,
      time: "Scheduled Service",
      status: "confirmed",
      pnr: pnrRef,
      amount: totalAmount,
      passengers: guestCount,
      seatInfo: selectedSeat || selectedRoomType || "Confirmed Allocation",
      invoiceNumber: invNumber,
    };

    if (onAddBookingToState) {
      onAddBookingToState(newBooking);
    } else {
      onInitiateBooking(newBooking);
    }

    setActiveInvoice({
      invoiceNumber: invNumber,
      pnr: pnrRef,
      serviceName,
      serviceTitle,
      travelDate,
      passengers: guestCount,
      leadPassenger: passengerName,
      passengerPhone,
      basePrice,
      gstAmount,
      totalAmount,
      issuedAt: new Date().toLocaleString("en-IN"),
      gstin: "07AAACM9012F1ZB",
      agencyName: "Malhotra World Travels & B2B Desk",
      agencyAddress: "Malhotra Towers, 14-16 Barakhamba Road, Connaught Place, New Delhi 110001",
    });
  };

  const verticalsList = [
    { id: "desk_overview", label: "Agency & B2B Desk", icon: Briefcase, color: "text-blue-600 bg-blue-50" },
    { id: "arch_separation", label: "🔐 Frontend/Backend Matrix", icon: ShieldCheck, color: "text-emerald-600 bg-emerald-50" },
    { id: "bus", label: "1. Bus Operator", icon: Bus, color: "text-rose-600 bg-rose-50" },
    { id: "train", label: "2. Train Profile", icon: Train, color: "text-amber-600 bg-amber-50" },
    { id: "hotel", label: "3. Hotel Profile", icon: Hotel, color: "text-indigo-600 bg-indigo-50" },
    { id: "lodge", label: "4. Lodge Profile", icon: Building2, color: "text-emerald-600 bg-emerald-50" },
    { id: "resort", label: "5. Resort Profile", icon: Palmtree, color: "text-teal-600 bg-teal-50" },
    { id: "pilgrimage", label: "6. Pilgrimage Yatra", icon: Flame, color: "text-orange-600 bg-orange-50" },
    { id: "tour", label: "7. Tour Operator", icon: Compass, color: "text-fuchsia-600 bg-fuchsia-50" },
    { id: "corporate", label: "8. Corporate Desk", icon: Building2, color: "text-slate-800 bg-slate-100" },
    { id: "cab", label: "9. Cab Operator", icon: Car, color: "text-cyan-600 bg-cyan-50" },
    { id: "restaurant", label: "10. Restaurant & Dhaba", icon: UtensilsCrossed, color: "text-amber-600 bg-amber-50" },
    { id: "houseboat", label: "11. House Boat", icon: Ship, color: "text-blue-600 bg-blue-50" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 p-0.5 shadow-md flex items-center justify-center">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-amber-300 font-black text-sm">
                MWT
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                  Malhotra World Travels &amp; B2B Desk
                </h2>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/30 uppercase">
                  IATA &amp; MOT Govt Approved
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Est. 1994 • Connaught Place, New Delhi
                </span>
              </div>
              <p className="text-xs text-slate-300">
                11 National Operator Profiles &amp; Secure B2B Wholesaler Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAIDrawer}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Maya AI</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security & Architectural Notice Banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-700 gap-2 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold text-slate-900">Universal Architecture:</span>
            <span className="text-slate-600">
              Customer Frontend displays verified partner details, live availability, instant booking &amp; GST invoices.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md border border-indigo-200">
            <Lock className="w-3 h-3 text-indigo-600" />
            <span>Backend Services (Auth, Fleet DB, Dynamic Yield, Commissions, Audit Logs) Protected Server-Side</span>
          </div>
        </div>

        {/* Horizontal Category Nav */}
        <div className="bg-white border-b border-slate-200 px-4 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
          {verticalsList.map((vert) => {
            const Icon = vert.icon;
            const isActive = activeTab === vert.id;
            return (
              <button
                key={vert.id}
                onClick={() => {
                  setActiveTab(vert.id);
                  setActiveInvoice(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-300" : ""}`} />
                <span>{vert.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ============================================================ */}
          {/* TAB 0: DESK OVERVIEW & AGENCY DETAILS */}
          {/* ============================================================ */}
          {activeTab === "desk_overview" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Agency Banner Card */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 relative overflow-hidden">
                <div className="relative z-10 max-w-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-bold uppercase tracking-wider">
                      Flagship B2B Travel Wholesaler
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
                      ISO 9001:2015 Certified
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Malhotra World Travels &amp; B2B Desk
                  </h1>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {malhotraProfile.description}
                  </p>

                  {/* Verification Badges Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                    {malhotraProfile.verificationBadges.map((badge, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-white/10 border border-white/15 text-xs text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div>
                          <p className="font-bold text-white leading-tight">{badge.label}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{badge.badgeCode}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Quick Contact & Emergency Desk */}
                  <div className="flex flex-wrap items-center gap-4 pt-3 text-xs text-slate-300 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-amber-400" />
                      <span>{malhotraProfile.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-sky-400" />
                      <span>{malhotraProfile.contact.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>{malhotraProfile.officeDetails.workingHours}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <ShieldCheck className="w-4 h-4" />
                      <span>24/7 Tatkal &amp; Flight Emergency Desk</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Locations & Network */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Head Office (Delhi NCR)
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">Malhotra Towers, Connaught Place</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    {malhotraProfile.officeDetails.headOffice.address}, New Delhi 110001
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-2">Phone: +91 98110 54321</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                    Western Hub (Mumbai)
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">Nariman Point B2B Terminal</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Suite 302, Nariman Bhavan, Nariman Point, Mumbai 400021
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-2">Phone: +91 98200 66712</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    International Desk (Dubai)
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">Sheikh Zayed Road Hub</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Office 702, Al Moosa Tower 1, Sheikh Zayed Road, Dubai, UAE
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-2">Phone: +971 4 398 2210</p>
                </div>
              </div>

              {/* B2B Instant Lead / Enquiry Form */}
              <div className="p-6 rounded-2xl border border-indigo-200 bg-indigo-50/50">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-4 h-4 text-indigo-600" />
                  <span>Send Direct B2B / Corporate Enquiry to Malhotra Operations Desk</span>
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Submit requests for wholesale group flight blocks, Tatkal train allocations, corporate offsites, luxury bus fleets, and Char Dham charters.
                </p>

                {enquirySuccess && (
                  <div className="mt-3 p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{enquirySuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSendEnquiry} className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Name / Agency</label>
                    <input
                      type="text"
                      value={enquiryName}
                      onChange={(e) => setEnquiryName(e.target.value)}
                      placeholder="e.g. Rajesh Singhal"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Direct Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={enquiryPhone}
                      onChange={(e) => setEnquiryPhone(e.target.value)}
                      placeholder="+91 98100 00000"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Corporate Email</label>
                    <input
                      type="email"
                      value={enquiryEmail}
                      onChange={(e) => setEnquiryEmail(e.target.value)}
                      placeholder="agent@company.com"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Select Service Vertical</label>
                    <select
                      value={enquiryVertical}
                      onChange={(e) => setEnquiryVertical(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                    >
                      <option>Corporate Flight &amp; Hotel Blocks</option>
                      <option>IRCTC Tatkal &amp; Executive Train Quota</option>
                      <option>Intercity Volvo Bus Fleet Charter</option>
                      <option>Char Dham Yatra &amp; Helicopter Darshan</option>
                      <option>Rajasthan Heritage Palace Hotel Blocks</option>
                      <option>Chauffeur Outstation Innova Fleet</option>
                      <option>Kerala Luxury Houseboat Charter</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Requirement Notes &amp; Passenger Count</label>
                    <input
                      type="text"
                      value={enquiryMessage}
                      onChange={(e) => setEnquiryMessage(e.target.value)}
                      placeholder="e.g. 45 passengers for Delhi-Jaipur retreat on 15 Oct, need 5★ stay with GST input invoice"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch to Desk</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* ARCHITECTURE & SECURITY MATRIX TAB (FRONTEND VS BACKEND SEPARATION) */}
          {/* ============================================================ */}
          {activeTab === "arch_separation" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Header Box */}
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <ShieldCheck className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Universal Profile Architecture &amp; Security Boundary Matrix
                      </h3>
                      <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Zero-Leakage Enforcement
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Strict enforcement of <strong>Frontend Customer/Partner View</strong> vs <strong>Internal Protected Backend Services</strong> across all 11 operator verticals.
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs bg-white p-3 rounded-xl border border-emerald-200 shrink-0">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Security Protocol</span>
                  <span className="font-mono font-bold text-emerald-800">RBAC &amp; Token-Gated APIs</span>
                  <span className="block text-[10px] text-slate-500 mt-0.5">PostgreSQL / External API Gateway</span>
                </div>
              </div>

              {/* Visual Architecture Diagram Flow */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-amber-300 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    <span>Recommended Architectural Flow</span>
                  </h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                    Tiered Request Pipeline
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Layer 1</span>
                    <h5 className="font-black text-white text-xs mt-1">Customer / Partner Frontend</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Public Profiles, Schedules, Booking UI, GST Invoices</p>
                  </div>

                  <div className="flex items-center justify-center text-slate-500 font-bold">
                    <ArrowRight className="w-5 h-5 hidden md:block text-amber-400" />
                    <ChevronDown className="w-5 h-5 md:hidden text-amber-400 my-1" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800 border border-indigo-500/50">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase block">Layer 2</span>
                    <h5 className="font-black text-white text-xs mt-1">Authentication &amp; Auth API</h5>
                    <p className="text-[10px] text-slate-400 mt-1">JWT verification, Role-Based Access (RBAC), Rate Limiting</p>
                  </div>

                  <div className="flex items-center justify-center text-slate-500 font-bold">
                    <ArrowRight className="w-5 h-5 hidden md:block text-amber-400" />
                    <ChevronDown className="w-5 h-5 md:hidden text-amber-400 my-1" />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800 border border-emerald-500/50">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase block">Layer 3</span>
                    <h5 className="font-black text-white text-xs mt-1">Protected Backend Engine</h5>
                    <p className="text-[10px] text-slate-400 mt-1">Profile, Booking, Inventory, Payment, Settlement, Audit</p>
                  </div>
                </div>
              </div>

              {/* Module Matrix Table (All 11 Verticals) */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                    Full Profile Module Separation Breakdown (11 Verticals)
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    Strict boundary between Allowed Frontend data and Prohibited Backend internals
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                        <th className="py-2.5 px-4 font-bold w-1/4">Profile Module</th>
                        <th className="py-2.5 px-4 font-bold text-emerald-700 w-3/8 bg-emerald-50/50 border-x border-slate-200">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Frontend — User / Partner View (Allowed)</span>
                          </span>
                        </th>
                        <th className="py-2.5 px-4 font-bold text-rose-700 w-3/8 bg-rose-50/50">
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-rose-600" />
                            <span>Backend — Hidden / Internal (NEVER Exposed)</span>
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Bus className="w-4 h-4 text-rose-600 shrink-0" />
                          <span>🚌 Bus Operator Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Operator name, logo, routes, buses, timings, seats, amenities, ratings, contact, itemized booking
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Operator ID, API integration, fleet DB, inventory, commission, settlement, audit
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Train className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>🚆 Train Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Train name/number, route, stations, classes, schedule, availability, fare, confirmed PNR status
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Railway/API service, inventory, booking engine, PNR, transaction logs
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Hotel className="w-4 h-4 text-indigo-600 shrink-0" />
                          <span>🏨 Hotel Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Hotel details, photos, rooms, amenities, location, policies, pricing, booking, check-in vouchers
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Property ID, room inventory, rate engine, API, settlement, commission
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>🏠 Lodge Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Lodge details, rooms, safari facilities, photos, location, pricing, booking
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Inventory, partner account, rate management, commission, settlement
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Palmtree className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>🏝️ Resort Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Resort details, rooms/villas, amenities, wellness activities, photos, packages, booking
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Inventory, pricing engine, partner management, settlement
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Flame className="w-4 h-4 text-orange-600 shrink-0" />
                          <span>🛕 Pilgrimage Tour Operator</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Operator, yatra packages, itinerary, dates, group capacity, inclusions, booking, darshan passes
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Package management, group inventory, payments, commission, KYC, audit
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Compass className="w-4 h-4 text-fuchsia-600 shrink-0" />
                          <span>🧳 Tour Operator Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Company, packages, destinations, day-by-day itinerary, dates, pricing, inclusions, booking
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Package engine, availability, partner management, commission, settlement
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-slate-800 shrink-0" />
                          <span>🏢 Corporate Tour Operator</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Corporate travel services, packages, service areas, booking/contact, 18% GST ITC claim details
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Corporate contracts, employee/approval workflow, billing, GST, settlement
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Car className="w-4 h-4 text-cyan-600 shrink-0" />
                          <span>🚕 Cab Operator Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Operator, vehicles, service areas, vehicle types, fares, availability, booking
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Fleet DB, driver allocation, dispatch, pricing, commission, tracking
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <UtensilsCrossed className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>🍽️ Restaurant Operator Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Restaurant name, menu, photos, location, timings, facilities, offers, PNR food delivery booking
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Menu DB, order management, settlement, commission, partner controls
                        </td>
                      </tr>

                      <tr className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold flex items-center gap-2">
                          <Ship className="w-4 h-4 text-blue-600 shrink-0" />
                          <span>🚤 House Boat Operator Profile</span>
                        </td>
                        <td className="py-3 px-4 text-slate-700 bg-emerald-50/20 border-x border-slate-200">
                          Houseboat details, photos, capacity, facilities, routes, packages, pricing, cabin allocation
                        </td>
                        <td className="py-3 px-4 text-slate-600 bg-rose-50/20 font-mono text-[11px]">
                          Fleet/inventory, availability, booking engine, commission, settlement
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Comprehensive Security Guardrails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
                  <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Frontend — Allowed to Display</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Public profile, verified business credentials, photos/videos</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Description, location map, available service categories</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Live seat/room availability, transparent public pricing, packages</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Customer reviews, star ratings, verified trip feedback</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Instant booking, payment status, 12% &amp; 18% GST tax invoices</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>Customer-facing phone, email, and 24x7 helpdesk support</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-2">
                  <h4 className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-rose-600" />
                    <span>Backend — NEVER Displayed in Frontend</span>
                  </h4>
                  <ul className="text-xs text-slate-700 space-y-1">
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Database tables, connection strings, credentials</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>API keys, secret tokens, authentication signing hashes</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Internal database IDs, admin URLs, backend console endpoints</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Commission calculations, partner wholesale profit margins</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Partner RTGS settlement controls, payment gateway secrets</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      <span>Confidential KYC document files, audit logs, error stack traces</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 1. BUS OPERATOR PROFILE */}
          {/* ============================================================ */}
          {activeTab === "bus" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Bus className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Royal Volvo &amp; Intercity Express
                      </h3>
                      <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-rose-300">
                        Fleet Operator ID: MWT-BUS-8820
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ★ 4.9 (1,840 Reviews)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Premier Multi-Axle Volvo 9600 Sleeper &amp; BharatBenz Luxury AC bus network connecting Delhi, Manali, Shimla, Jaipur, Agra, Mumbai &amp; Goa.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block">Starting From</span>
                    <span className="font-black text-rose-700 text-lg">₹1,250</span>
                    <span className="text-[10px] text-emerald-600 block font-bold">100% On-Time Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Bus Details & Photos */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600"
                      alt="Volvo 9600 Multi-Axle"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600"
                      alt="Luxury Sleeper Cabins"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=600"
                      alt="Reclining Plush Seats"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  {/* Route & Schedule */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-rose-600" />
                      <span>Route &amp; Trip Schedule</span>
                    </h4>
                    <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">DEPARTURE • 08:30 PM</span>
                        <p className="font-black text-slate-900 text-sm">New Delhi (ISBT Kashmere Gate)</p>
                        <p className="text-[11px] text-slate-500">Boarding Point 4, Metro Gate 1</p>
                      </div>
                      <div className="text-center px-4">
                        <span className="text-[10px] text-slate-400 block">11 hrs 30 mins</span>
                        <div className="w-20 h-0.5 bg-rose-400 my-1 relative">
                          <div className="w-2 h-2 rounded-full bg-rose-600 absolute right-0 -top-0.5"></div>
                        </div>
                        <span className="text-[10px] text-rose-600 font-bold">Direct Express</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold">ARRIVAL • 08:00 AM</span>
                        <p className="font-black text-slate-900 text-sm">Manali (Private Volvo Stand)</p>
                        <p className="text-[11px] text-slate-500">Mall Road Dropping Point</p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                      Onboard Bus Amenities
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-700">
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <Wifi className="w-3.5 h-3.5 text-rose-600" />
                        <span>High-Speed WiFi</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <Tv className="w-3.5 h-3.5 text-rose-600" />
                        <span>Personal Screen</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <Coffee className="w-3.5 h-3.5 text-rose-600" />
                        <span>Water &amp; Blanket</span>
                      </div>
                      <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>GPS &amp; CCTV SOS</span>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Seat Selection Grid */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                        Select Your Seat / Sleeper Berth
                      </h4>
                      <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                        Selected: {selectedSeat}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {["L-01 (Single Sleeper)", "L-02 (Window)", "L-03 (Aisle)", "L-04 (Lower Berth)", "U-01 (Upper Single)", "U-02 (Upper Window)", "U-03 (Upper Berth)", "U-04 (Panoramic Window)"].map((seat) => (
                        <button
                          key={seat}
                          type="button"
                          onClick={() => setSelectedSeat(seat)}
                          className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                            selectedSeat === seat
                              ? "bg-rose-600 text-white border-rose-700 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-[10px] opacity-75">Sleeper 2+1</div>
                          <div>{seat}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Booking & Invoice Trigger Sidebar */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Instant Bus Passenger Booking</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Primary Passenger Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Passenger Mobile</label>
                      <input
                        type="tel"
                        value={passengerPhone}
                        onChange={(e) => setPassengerPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Travel Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-200 text-xs space-y-1.5">
                      <div className="flex justify-between text-slate-600">
                        <span>Base Volvo Fare</span>
                        <span className="font-bold text-slate-900">₹1,250</span>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>GST (5% Roadways)</span>
                        <span className="font-bold text-slate-900">₹63</span>
                      </div>
                      <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                        <span>Total Payable</span>
                        <span className="text-rose-600">₹1,313</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Bus Operator",
                        "Malhotra Royal Volvo 9600 (Delhi to Manali)",
                        1250,
                        "buses"
                      )}
                      className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Booking &amp; Generate Invoice</span>
                    </button>

                    <p className="text-[10px] text-slate-500 text-center">
                      Free cancellation up to 4 hours before departure. Instant refund.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 2. TRAIN PROFILE & BOOKING */}
          {/* ============================================================ */}
          {activeTab === "train" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Train className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Vande Bharat Express (20901) &amp; IRCTC Tatkal Desk
                      </h3>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-300">
                        IRCTC Principal Partner Desk
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        42 Berths Live Available
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      New Delhi (NDLS) ⇄ Varanasi Junction (BSB) / Mumbai Central (MMCT) ⇄ Gandhinagar Capital (GNC) with ₹0 Payment Gateway Surcharge.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">IRCTC Fixed Tariff</span>
                  <span className="font-black text-amber-800 text-lg">₹2,420</span>
                  <span className="text-[10px] text-emerald-600 block font-bold">Confirmed Ticket Guarantee</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  {/* Train Timing & Stoppages */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                    <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">NDLS • 06:00 AM</span>
                        <p className="font-black text-slate-900 text-sm">New Delhi Railway Station</p>
                        <p className="text-[11px] text-slate-500">Platform 16 (Paharganj Side)</p>
                      </div>
                      <div className="text-center px-4">
                        <span className="text-[10px] text-slate-400 block font-bold">8h 00m • 759 km</span>
                        <div className="w-24 h-0.5 bg-amber-400 my-1 relative">
                          <div className="w-2 h-2 rounded-full bg-amber-600 absolute right-0 -top-0.5"></div>
                        </div>
                        <span className="text-[10px] text-amber-700 font-bold">Runs 6 Days (Except Thu)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block font-bold">BSB • 02:00 PM</span>
                        <p className="font-black text-slate-900 text-sm">Varanasi Cantt Station</p>
                        <p className="text-[11px] text-slate-500">Platform 1</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-600 flex items-center justify-between px-2">
                      <span>Intermediate Halts: Kanpur Central (10:08 AM), Prayagraj Jn (12:08 PM)</span>
                      <span className="text-emerald-600 font-bold">Pantry: Pure Veg &amp; Jain Meals Included</span>
                    </div>
                  </div>

                  {/* Travel Classes Selection */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                      Select Travel Class &amp; Quota
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {[
                        { title: "Executive Chair Car (EC)", fare: 2420, status: "AVAILABLE - 28", badge: "180° Rotating Seats" },
                        { title: "AC Chair Car (CC)", fare: 1350, status: "AVAILABLE - 64", badge: "2+3 Pushback" },
                        { title: "Tatkal Executive (EC)", fare: 2850, status: "TATKAL AVAILABLE - 12", badge: "Instant Confirmation" },
                      ].map((cls) => (
                        <button
                          key={cls.title}
                          type="button"
                          onClick={() => setSelectedTrainClass(cls.title)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedTrainClass === cls.title
                              ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <div className="text-[10px] opacity-80">{cls.badge}</div>
                          <div className="font-extrabold text-sm">{cls.title}</div>
                          <div className="text-xs font-mono font-bold mt-1">₹{cls.fare.toLocaleString("en-IN")}</div>
                          <div className="text-[10px] font-bold text-emerald-300 mt-1">{cls.status}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Passenger Details Preview */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs text-slate-700">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Train Travel Amenities Included
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">Hot Gourmet Breakfast</span>
                        <span className="text-[10px] text-slate-500">Cutlet, Upma, Tea/Coffee</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">Power Socket &amp; USB</span>
                        <span className="text-[10px] text-slate-500">At Every Seat</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">Bio-Vacuum Toilets</span>
                        <span className="text-[10px] text-slate-500">Touchfree Sensor Taps</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">Auto Sliding Doors</span>
                        <span className="text-[10px] text-slate-500">GPS Audio Announcements</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Train Booking Checkout */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">IRCTC Confirmed Train Booking</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Lead Passenger Name (As on Aadhaar)</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Berth / Meal Preference</label>
                      <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                        <option>Window Seat • Vegetarian Meal</option>
                        <option>Aisle Seat • Jain Satvik Meal</option>
                        <option>Window Seat • Non-Vegetarian Meal</option>
                        <option>No Food Opted (-₹240)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Journey Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Train Booking",
                        `Vande Bharat Express (20901) - ${selectedTrainClass}`,
                        2420,
                        "trains"
                      )}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Issue IRCTC PNR &amp; E-Ticket Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 3. HOTEL PROFILE */}
          {/* ============================================================ */}
          {activeTab === "hotel" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-indigo-200 bg-indigo-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Hotel className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Grand Heritage Palace &amp; Suites (5-Star Luxury)
                      </h3>
                      <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-300">
                        5★ Luxury Heritage
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        ★ 4.95 (3,200 Reviews)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Located in Prime Civil Lines / Connaught Circuit with royal Rajputana courtyards, temperature-controlled pool &amp; fine dining.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">B2B Contracted Tariff</span>
                  <span className="font-black text-indigo-700 text-lg">₹6,800 / night</span>
                  <span className="text-[10px] text-slate-400 block">+12% GST Input Credit</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
                      alt="Grand Palace Exterior"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600"
                      alt="Deluxe Palace Suite"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600"
                      alt="Royal Courtyard Pool"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  {/* Room Categories */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
                      Select Room Category
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      {[
                        { name: "Deluxe Palace King", rate: 6800, desc: "450 sq.ft • City View • Bathtub" },
                        { name: "Executive Club Suite", rate: 9500, desc: "650 sq.ft • Lounge Access • Butler" },
                        { name: "Presidential Maharaja Suite", rate: 16500, desc: "1,200 sq.ft • Private Jacuzzi & Dining" },
                      ].map((room) => (
                        <button
                          key={room.name}
                          type="button"
                          onClick={() => setSelectedRoomType(room.name)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedRoomType === room.name
                              ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <div className="font-black text-sm">{room.name}</div>
                          <div className="text-[11px] opacity-80 mt-0.5">{room.desc}</div>
                          <div className="font-mono font-bold text-xs mt-2">₹{room.rate.toLocaleString("en-IN")} / night</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hotel Policies */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                      Hotel Check-in &amp; Cancellation Policies
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <div>
                        <span className="text-slate-400 block text-[10px]">CHECK-IN</span>
                        <span className="font-bold text-slate-900">02:00 PM</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CHECK-OUT</span>
                        <span className="font-bold text-slate-900">12:00 PM</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CHILD POLICY</span>
                        <span className="font-bold text-slate-900">Under 6 Free</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">CANCELLATION</span>
                        <span className="font-bold text-emerald-600">Free till 24h</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hotel Booking Sidebar */}
                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Direct Hotel Reservation</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Guest Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Meal Plan</label>
                      <select
                        value={selectedMealPlan}
                        onChange={(e) => setSelectedMealPlan(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      >
                        <option>CP (Complimentary Royal Breakfast)</option>
                        <option>MAP (Breakfast &amp; Dinner Included)</option>
                        <option>AP (All Meals - Breakfast, Lunch, Dinner)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Hotel Reservation",
                        `Malhotra Grand Heritage Palace (${selectedRoomType})`,
                        6800,
                        "hotels"
                      )}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Hotel Voucher &amp; GST Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 4. LODGE PROFILE */}
          {/* ============================================================ */}
          {activeTab === "lodge" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Wilderness Forest Safaris &amp; Eco Lodge
                      </h3>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                        Corbett Tiger Reserve Buffer Zone
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Riverfront Machan treehouses, stone cottages, daily open-top 4x4 Gypsy tiger safaris with certified Pahadi naturalists.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Jungle Tariff (All Meals)</span>
                  <span className="font-black text-emerald-800 text-lg">₹7,400 / night</span>
                  <span className="text-[10px] text-slate-500 block">Includes Morning Safari Permit</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=600"
                      alt="Machan Treehouse"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1510312305653-8ed496efae75?w=600"
                      alt="Jungle Bonfire Evening"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1549366021-9f761d450615?w=600"
                      alt="4x4 Gypsy Safari"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Lodge Categories &amp; Safari Inclusions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">Riverfront Machan</span>
                        <span className="text-slate-500 text-[11px] block mt-0.5">Kosi River View • Teak Wood</span>
                        <span className="font-mono font-bold text-emerald-700 block mt-1.5">₹7,400</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">Luxury Safari Tent</span>
                        <span className="text-slate-500 text-[11px] block mt-0.5">AC • Private Verandah</span>
                        <span className="font-mono font-bold text-emerald-700 block mt-1.5">₹8,900</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                        <span className="font-bold text-slate-900 block">Heritage Stone Chalet</span>
                        <span className="text-slate-500 text-[11px] block mt-0.5">2 Bedrooms • Family Fireplace</span>
                        <span className="font-mono font-bold text-emerald-700 block mt-1.5">₹12,500</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Lodge Stay &amp; Safari Booking</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Lead Guest Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Safari Zone Preference</label>
                      <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                        <option>Dhikala Forest Zone (Core Area)</option>
                        <option>Bijrani Safari Zone</option>
                        <option>Jhirna Zone (Year-Round Open)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Wilderness Lodge",
                        "Malhotra Forest Safari Eco Lodge (Corbett)",
                        7400,
                        "lodges"
                      )}
                      className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Issue Lodge Voucher &amp; Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 5. RESORT PROFILE */}
          {/* ============================================================ */}
          {activeTab === "resort" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-teal-200 bg-teal-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Palmtree className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Royal Palm Beach &amp; Ayurvedic Wellness Resort
                      </h3>
                      <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        South Goa Beachfront &amp; Kerala Backwaters
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Private oceanfront villas, Ayurvedic Panchakarma rejuvenation center, infinity lagoon pool, and sunset yacht charters.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">All-Inclusive Villa Rate</span>
                  <span className="font-black text-teal-700 text-lg">₹11,500 / night</span>
                  <span className="text-[10px] text-slate-400 block">Includes Spa &amp; Breakfast</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600"
                      alt="Beachfront Resort"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600"
                      alt="Infinity Pool"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600"
                      alt="Ayurvedic Spa"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Villa Options &amp; Wellness Inclusions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-black text-slate-900 block">Private Plunge Pool Beach Villa</span>
                        <span className="text-slate-500 text-[11px] block mt-0.5">Direct Beach Access • 800 sq.ft</span>
                        <span className="font-mono font-bold text-teal-700 block mt-1.5">₹11,500 / night</span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="font-black text-slate-900 block">Sunset Lagoon Jacuzzi Suite</span>
                        <span className="text-slate-500 text-[11px] block mt-0.5">Balcony Jacuzzi • Sea View</span>
                        <span className="font-mono font-bold text-teal-700 block mt-1.5">₹14,800 / night</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Resort Villa Booking</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Lead Guest Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Luxury Resort",
                        "Malhotra Royal Palm Beach & Ayurvedic Resort",
                        11500,
                        "resorts"
                      )}
                      className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Resort Voucher &amp; Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 6. PILGRIMAGE TOUR OPERATOR PROFILE */}
          {/* ============================================================ */}
          {activeTab === "pilgrimage" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-orange-200 bg-orange-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-orange-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Flame className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Divya Yatra &amp; Char Dham Sacred Circuits
                      </h3>
                      <span className="bg-orange-100 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-orange-300">
                        Govt of India Approved Pilgrimage Operator
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Char Dham by Helicopter &amp; Road, Kashi-Ayodhya Corridor, Tirupati Balaji VIP Darshan, 12 Jyotirlinga all-inclusive yatras with senior Vedic purohits.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">All-Inclusive Package</span>
                  <span className="font-black text-orange-800 text-lg">₹46,500 / person</span>
                  <span className="text-[10px] text-emerald-700 block font-bold">Includes VIP Sugam Passes</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600"
                      alt="Kedarnath Temple"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600"
                      alt="Ganga Aarti Varanasi"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1627894483216-2138af692e32?w=600"
                      alt="Ayodhya Ram Mandir"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  {/* Day Wise Itinerary Summary */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Char Dham Sacred Itinerary (9D/8N)
                    </h4>
                    <div className="space-y-1.5 text-slate-700">
                      <p><strong>Day 1-2:</strong> Haridwar to Barkot &amp; Yamunotri Holy Darshan</p>
                      <p><strong>Day 3-4:</strong> Uttarkashi &amp; Gangotri Temple Puja</p>
                      <p><strong>Day 5-6:</strong> Guptkashi to Kedarnath Jyotirlinga (VIP Sugam Pass)</p>
                      <p><strong>Day 7-8:</strong> Badrinath Temple Maha Abhishek &amp; Mana Village</p>
                      <p><strong>Day 9:</strong> Rishikesh Ganga Aarti &amp; Departure</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Book Sacred Yatra Package</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Lead Pilgrim Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Departure Batch</label>
                      <select
                        value={selectedYatraBatch}
                        onChange={(e) => setSelectedYatraBatch(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      >
                        <option>15 Sep 2026 (Navratri Special Batch)</option>
                        <option>01 Oct 2026 (Autumn Clear Skies Batch)</option>
                        <option>15 Oct 2026 (Deepawali Sacred Batch)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Pilgrimage Tour",
                        "Sacred Char Dham & Kedarnath VIP Yatra (9D/8N)",
                        46500,
                        "pilgrimage"
                      )}
                      className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Issue Yatra Pass &amp; Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 7. TOUR OPERATOR PROFILE */}
          {/* ============================================================ */}
          {activeTab === "tour" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-fuchsia-200 bg-fuchsia-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Compass className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Discover India Holidays &amp; DMC
                      </h3>
                      <span className="bg-fuchsia-100 text-fuchsia-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-fuchsia-300">
                        MOT Licensed DMC Operator
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Curated Golden Triangle, Royal Rajasthan, Kashmir Paradise &amp; Kerala Backwaters guided tours with private chauffeurs &amp; 5-star hotels.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Package Price</span>
                  <span className="font-black text-fuchsia-800 text-lg">₹28,900 / person</span>
                  <span className="text-[10px] text-slate-500 block">6 Days / 5 Nights</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600"
                      alt="Taj Mahal Agra"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600"
                      alt="Udaipur City Palace"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600"
                      alt="Gulmarg Kashmir"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-2">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                      Tour Package Inclusions
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-slate-700">
                      <div>✓ 5-Star Heritage Palace Hotels</div>
                      <div>✓ Private Chauffeur AC Innova Crysta</div>
                      <div>✓ Daily Breakfast &amp; Royal Dinners</div>
                      <div>✓ Taj Mahal Sunrise VIP Entry</div>
                      <div>✓ Licensed Historian Guides</div>
                      <div>✓ All Tolls, Parking &amp; State Taxes</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Book Holiday Package</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Lead Traveller Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Departure Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Tour Package",
                        "Grand Royal Golden Triangle & Taj Mahal (6D/5N)",
                        28900,
                        "tours"
                      )}
                      className="w-full py-3 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Issue Holiday Voucher &amp; Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 8. CORPORATE TOUR OPERATOR PROFILE */}
          {/* ============================================================ */}
          {activeTab === "corporate" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-slate-300 bg-slate-100 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Corporate Travel Desk &amp; MICE Solutions
                      </h3>
                      <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        GST Input Tax Credit (ITC) Compliant
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Enterprise business travel, leadership offsites, flight charter blocks, conference convention halls &amp; automated corporate approvals.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Corporate Contract Tier</span>
                  <span className="font-black text-slate-900 text-lg">Platinum MICE</span>
                  <span className="text-[10px] text-emerald-700 block font-bold">18% GST Input Credit</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white text-xs space-y-3">
                    <h4 className="font-bold text-slate-900 uppercase tracking-wider">
                      Enterprise Business Travel Capabilities
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong>Bulk Flight PNRs:</strong> Block 20 to 200 seats with zero name-change penalty up to 48 hours.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong>5-Star MICE Venues:</strong> Negotiated corporate room blocks at Taj, Oberoi, Marriott &amp; ITC.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong>Chauffeured Fleets:</strong> Airport transfer coordinators and luxury coaches on standby.
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <strong>Consolidated Invoicing:</strong> Monthly GSTR-1 filings with clear SAC/HSN codes.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Generate Corporate Tax Invoice</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Entity Name</label>
                      <input
                        type="text"
                        defaultValue="Reliance Retail Enterprises Ltd."
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Company GSTIN</label>
                      <input
                        type="text"
                        defaultValue="27AAACR1234F1Z8"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Corporate MICE",
                        "Annual Leadership Offsite & Flight Block (Udaipur)",
                        85000,
                        "corporate"
                      )}
                      className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Issue Corporate GST Tax Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 9. CAB OPERATOR PROFILE */}
          {/* ============================================================ */}
          {activeTab === "cab" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-cyan-200 bg-cyan-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Car className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra City &amp; Outstation Chauffeur Fleet
                      </h3>
                      <span className="bg-cyan-100 text-cyan-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-300">
                        Police-Verified Chauffeurs
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Innova Crysta, Dzire Sedans &amp; Force Urbania vans for Delhi-Agra, Delhi-Jaipur, Mumbai-Pune &amp; Pan-India outstation trips with zero hidden toll charges.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Outstation Sedan / SUV</span>
                  <span className="font-black text-cyan-700 text-lg">₹3,400</span>
                  <span className="text-[10px] text-emerald-600 block font-bold">All Tolls Included</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600"
                      alt="Innova Crysta"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600"
                      alt="Sedan Dzire"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600"
                      alt="Force Urbania Van"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Select Vehicle Category
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { name: "Sedan Dzire AC", rate: 2800, cap: "4 Passengers • 2 Bags" },
                        { name: "Innova Crysta Luxury SUV", rate: 4200, cap: "6-7 Passengers • 4 Bags" },
                        { name: "Force Urbania 17-Seater", rate: 8500, cap: "16 Passengers • Reclining" },
                      ].map((cab) => (
                        <button
                          key={cab.name}
                          type="button"
                          onClick={() => setSelectedCabType(cab.name)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedCabType === cab.name
                              ? "bg-cyan-600 text-white border-cyan-700 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <div className="font-bold text-sm">{cab.name}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{cab.cap}</div>
                          <div className="font-mono font-bold text-xs mt-1.5">₹{cab.rate.toLocaleString("en-IN")}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Instant Cab Dispatch Booking</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Pickup Address / Terminal</label>
                      <input
                        type="text"
                        defaultValue="Delhi Airport Terminal 3 (IGI Airport)"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Drop Destination</label>
                      <input
                        type="text"
                        defaultValue="Agra Taj Mahal VIP East Gate"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Outstation Cab",
                        `Chauffeured Cab Trip - ${selectedCabType}`,
                        3400,
                        "cabs"
                      )}
                      className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm Cab &amp; Issue Trip Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 10. RESTAURANT OPERATOR PROFILE */}
          {/* ============================================================ */}
          {activeTab === "restaurant" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <UtensilsCrossed className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Grand Highway Dhaba &amp; Royal Rasoi (Est. 1994)
                      </h3>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        24x7 Highway Pitstop • NH-44 Murthal Milestone
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      World-famous Tandoori Parathas with white butter, Dal Makhani, Paneer Tikka &amp; train seat meal delivery on PNR.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Royal Thali Combo</span>
                  <span className="font-black text-amber-700 text-lg">₹380</span>
                  <span className="text-[10px] text-emerald-600 block font-bold">100% Pure Satvik Desi Ghee</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600"
                      alt="Tandoori Parathas"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600"
                      alt="Dal Makhani"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600"
                      alt="Paneer Tikka"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Signature Specialties Menu
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <span>Aloo Pyaz Tandoori Paratha (Desi Makkhan)</span>
                        <strong className="font-mono">₹140</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <span>Slow-Cooked Royal Dal Makhani</span>
                        <strong className="font-mono">₹260</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <span>Paneer Butter Masala &amp; Butter Naan</span>
                        <strong className="font-mono">₹290</strong>
                      </div>
                      <div className="p-2 rounded bg-slate-50 border border-slate-200 flex justify-between">
                        <span>Kulhad Malai Lassi (500ml)</span>
                        <strong className="font-mono">₹90</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Table Reservation &amp; Meal Voucher</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Guest Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Dine-in Time / Train Seat Delivery</label>
                      <select className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium">
                        <option>Dine-in Table Reservation (Table for 4)</option>
                        <option>Deliver Food to Train Seat on PNR</option>
                        <option>Highway Takeaway Pre-Order</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Dining & Dhaba",
                        "Malhotra Royal Rasoi Highway Thali Voucher",
                        850,
                        "dining"
                      )}
                      className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Issue Table Voucher &amp; Bill Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 11. HOUSE BOAT OPERATOR PROFILE */}
          {/* ============================================================ */}
          {activeTab === "houseboat" && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 flex flex-col md:flex-row items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shrink-0 shadow-md">
                    <Ship className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-slate-900">
                        Malhotra Royal Backwaters &amp; Dal Lake Houseboats
                      </h3>
                      <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Alleppey (Kerala) &amp; Srinagar (Kashmir)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      Traditional Kerala Kettuvallam houseboats with personal private chefs, sunset deck lounges &amp; Kashmiri heated Dal Lake luxury houseboats.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-500 block">Overnight Cruise Tariff</span>
                  <span className="font-black text-blue-700 text-lg">₹14,500 / night</span>
                  <span className="text-[10px] text-emerald-700 block font-bold">Includes All Traditional Meals</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600"
                      alt="Alleppey Houseboat"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600"
                      alt="Dal Lake Houseboat"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=600"
                      alt="Kerala Backwaters"
                      className="rounded-xl h-28 w-full object-cover border border-slate-200"
                    />
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                      Houseboat Cabin Options
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        { title: "1-BHK Luxury Honeymoon Cruiser", rate: 14500, desc: "Private Jacuzzi & Glass-Walled Bedroom" },
                        { title: "2-BHK Family Kettuvallam", rate: 18900, desc: "2 AC Bedrooms • Living Lounge • Private Chef" },
                      ].map((boat) => (
                        <button
                          key={boat.title}
                          type="button"
                          onClick={() => setSelectedHouseboatType(boat.title)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            selectedHouseboatType === boat.title
                              ? "bg-blue-600 text-white border-blue-700 shadow-xs"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <div className="font-bold text-sm">{boat.title}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">{boat.desc}</div>
                          <div className="font-mono font-bold text-xs mt-1.5">₹{boat.rate.toLocaleString("en-IN")}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                    <h4 className="font-black text-slate-900 text-sm">Book Houseboat Cruise</h4>
                    
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Lead Guest Name</label>
                      <input
                        type="text"
                        value={passengerName}
                        onChange={(e) => setPassengerName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Cruise Date</label>
                      <input
                        type="date"
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium"
                      />
                    </div>

                    <button
                      onClick={() => handleGenerateInvoice(
                        "Houseboat Cruise",
                        `Malhotra Royal Houseboat - ${selectedHouseboatType}`,
                        14500,
                        "houseboats"
                      )}
                      className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Issue Cruise Voucher &amp; Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAX INVOICE & BOOKING VOUCHER MODAL POPUP */}
          {/* ============================================================ */}
          {activeInvoice && (
            <div className="p-6 rounded-2xl border-2 border-emerald-500 bg-emerald-50/50 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Booking Confirmed • Official Tax Invoice &amp; Travel Voucher
                    </h3>
                    <p className="text-xs text-slate-600">
                      Issued by {activeInvoice.agencyName} (GSTIN: {activeInvoice.gstin})
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
                    Paid &amp; Verified
                  </span>
                  <p className="text-xs font-mono font-bold text-slate-700 mt-1">
                    Invoice: {activeInvoice.invoiceNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-xl border border-emerald-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">BOOKING REF / PNR</span>
                  <span className="font-mono font-bold text-slate-900">{activeInvoice.pnr}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">PRIMARY PASSENGER</span>
                  <span className="font-bold text-slate-900">{activeInvoice.leadPassenger}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">TRAVEL DATE</span>
                  <span className="font-bold text-slate-900">{activeInvoice.travelDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ISSUED AT</span>
                  <span className="text-slate-700">{activeInvoice.issuedAt}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-700">
                  <span className="font-bold">{activeInvoice.serviceTitle}</span>
                  <span className="font-mono font-bold">₹{activeInvoice.basePrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST Taxes (12% SGST + CGST)</span>
                  <span className="font-mono font-bold">₹{activeInvoice.gstAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t border-slate-200">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-emerald-700">₹{activeInvoice.totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-slate-500">
                  This booking has been added to your <strong>My Trips</strong> profile. E-Ticket &amp; SMS sent to {activeInvoice.passengerPhone}.
                </p>
                <button
                  onClick={() => setActiveInvoice(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-900 text-slate-400 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300 font-bold">Malhotra B2B Desk Gateway: Active &amp; Operational</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500">IATA: 14-1-77820 • MOT: MOT-NRO-DEL-33829</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
