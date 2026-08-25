import React, { useState } from "react";
import {
  Briefcase,
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
  Plane,
  Train,
  Car,
  Hotel,
  Coffee,
  CheckSquare,
} from "lucide-react";

type CorporateSubView =
  | "corporate_registration"
  | "corporate_tour_details"
  | "corporate_customer_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function CorporateEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<CorporateSubView>(
    "corporate_tour_details"
  );

  // Registration states
  const [regStep, setRegStep] = useState(1);
  const [corpData, setCorpData] = useState({
    agencyName: "BizVoyage Global Corporate MICE & Executive Offsites",
    authorizedPerson: "Vikramaditya Singhania (VP - Enterprise Travel)",
    contact: "+91 22 6890-4400",
    email: "enterprise@bizvoyage-mice.com",
    officeAddress: "Tower B, Level 14, Cyber City, Gurugram, Haryana 122002",
    locations: "Gurugram, Mumbai, Bengaluru, Hyderabad, Dubai, Singapore, London",
    specialization: "Executive Offsites, Global Leadership Summits, Annual Tech Hackathons, Sales Kickoffs",
    gstin: "07AACCE9918K1Z3",
    cin: "U63040HR2018PTC077821",
    bankName: "HDFC Bank (Cyber Hub Branch)",
    accountNumber: "50200091827361",
    ifsc: "HDFC0000240",
  });

  // Tour Creation states
  const [tourData, setTourData] = useState({
    tourName: "Annual Tech Leadership Summit & Hackathon 2026",
    clientName: "Tata Consultancy Services / Infosys Digital Group",
    destination: "Goa Beachfront Resort & Convention Centre",
    tourType: "Leadership Offsite & Innovation Hackathon",
    startDate: "2026-10-12",
    endDate: "2026-10-15",
    employeeCount: 45,
    departureCity: "Bengaluru (BLR) & Mumbai (BOM)",
    flightIncluded: "Chartered Direct Flights (IndiGo Enterprise Class)",
    hotelName: "Taj Exotica Resort & Spa Goa (45 Sea-View King Rooms)",
    conferenceFacilities: "500-Seater Grand Ballroom + 4 Breakout Strategy Rooms + Gigabit Dedicated Fiber",
    mealPlan: "All Gourmet Meals Included + Sunset Gala Cocktail Dinner + Live BBQ",
    activities: "Team Sailing Regatta, Beach Volleyball & Tech Pitch Keynotes",
    corporateRatePerEmployee: 38500,
    cancellationPolicy: "100% refund before 30 days of offsite; 50% between 15-29 days.",
  });

  // Corporate Customer Booking state
  const [selectedOffsite, setSelectedOffsite] = useState("Annual Tech Leadership Summit");
  const [attendeeCount, setAttendeeCount] = useState(45);
  const [approvalStatus, setApprovalStatus] = useState<"pending" | "approved">("approved");
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Corporate Operator Management Mock List
  const [corporateBookings, setCorporateBookings] = useState([
    {
      id: "CORP-MICE-8912",
      company: "Infosys Cloud & AI Delivery Group",
      delegates: "45 Principal Architects & VP Leaders",
      dates: "12 Oct - 15 Oct 2026 (4D/3N)",
      hotel: "Taj Exotica Resort Goa (45 Luxury Rooms)",
      flights: "BLR-GOI Flight 6E-289 (45 Seats Locked)",
      invoiceStatus: "PO Approved (Net 30 Invoicing)",
      logisticsStatus: "Airport Luxury Coaster Coaches Assigned",
    },
    {
      id: "CORP-MICE-8913",
      company: "Wipro Global Financial Engineering",
      delegates: "28 Managing Directors (CXO Retreat)",
      dates: "20 Oct - 23 Oct 2026 (4D/3N)",
      hotel: "The Leela Palace Udaipur",
      flights: "BOM-UDR Chartered Embraer E190",
      invoiceStatus: "Advance 50% Cleared",
      logisticsStatus: "Private Boat Transfers Configured",
    },
  ]);

  const grandCorporateTotal = tourData.corporateRatePerEmployee * attendeeCount;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("corporate_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "corporate_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Corporate Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("corporate_tour_details")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "corporate_tour_details"
                ? "bg-sky-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>2. Corporate Tour Details</span>
          </button>

          <button
            onClick={() => setActiveSubView("corporate_customer_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "corporate_customer_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>3. Corporate Client Booking</span>
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
            <span>4. Corporate Booking Management</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-300 border border-sky-500/30">
          Vertical: Corporate MICE &amp; Offsites
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. CORPORATE REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "corporate_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Corporate Operator App / Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Enterprise Travel Agency Onboarding &amp; Corporate Credit Agreement
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED MICE OPERATOR
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Company Profile", desc: "CIN, GSTIN, Cyber City" },
                { step: 2, title: "MICE Capabilities", desc: "Summits, Hackathons" },
                { step: 3, title: "Airline & Hotel GDS", desc: "Taj, Marriott, IndiGo" },
                { step: 4, title: "Corporate Escrow Vault", desc: "Net-30 Enterprise Credit" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-sky-500/20 border-sky-500/80 text-sky-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-sky-400 font-bold">Step 0{s.step}</div>
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
                    <label className="block text-slate-400 mb-1 font-semibold">Agency / Agency Legal Name</label>
                    <input
                      type="text"
                      value={corpData.agencyName}
                      onChange={(e) => setCorpData({ ...corpData, agencyName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Authorized Signatory</label>
                    <input
                      type="text"
                      value={corpData.authorizedPerson}
                      onChange={(e) => setCorpData({ ...corpData, authorizedPerson: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Corporate Specialization</label>
                    <input
                      type="text"
                      value={corpData.specialization}
                      onChange={(e) => setCorpData({ ...corpData, specialization: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sky-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Corporate Operating Hubs</label>
                    <input
                      type="text"
                      value={corpData.locations}
                      onChange={(e) => setCorpData({ ...corpData, locations: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Registered Office Address</label>
                    <input
                      type="text"
                      value={corpData.officeAddress}
                      onChange={(e) => setCorpData({ ...corpData, officeAddress: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">GSTIN &amp; Corporate Invoicing Mandate:</span>
                  <span className="text-emerald-400 font-mono font-bold">{corpData.gstin} (B2B E-Invoicing Active)</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Automated Net-30 credit limit of ₹50,00,000 for approved Fortune 500 &amp; BSE-listed clients. Escrow settlement via {corpData.bankName}.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. CORPORATE TOUR DETAILS — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "corporate_tour_details" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Corporate Tour Creation &amp; MICE Proposal
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Offsite Itinerary, Conference Ballrooms, Flight Charters &amp; Resort Allocation
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-sky-400">
                Client: Tata Consultancy Services
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Offsite / Event Title</label>
                <input
                  type="text"
                  value={tourData.tourName}
                  onChange={(e) => setTourData({ ...tourData, tourName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Corporate Client</label>
                <input
                  type="text"
                  value={tourData.clientName}
                  onChange={(e) => setTourData({ ...tourData, clientName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sky-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Destination Resort</label>
                <input
                  type="text"
                  value={tourData.destination}
                  onChange={(e) => setTourData({ ...tourData, destination: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Start &amp; End Dates</label>
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={tourData.startDate}
                    onChange={(e) => setTourData({ ...tourData, startDate: e.target.value })}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  />
                  <input
                    type="date"
                    value={tourData.endDate}
                    onChange={(e) => setTourData({ ...tourData, endDate: e.target.value })}
                    className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Number of Delegates</label>
                <input
                  type="number"
                  value={tourData.employeeCount}
                  onChange={(e) => setTourData({ ...tourData, employeeCount: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">Conference Hall &amp; Tech Setup</label>
                <input
                  type="text"
                  value={tourData.conferenceFacilities}
                  onChange={(e) => setTourData({ ...tourData, conferenceFacilities: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Rate per Delegate (₹)</label>
                <input
                  type="number"
                  value={tourData.corporateRatePerEmployee}
                  onChange={(e) => setTourData({ ...tourData, corporateRatePerEmployee: Number(e.target.value) })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Executive Schedule &amp; Team Building Modules:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                Day 1: Direct Chartered Flights to Goa • VIP Airport Coaster Pickups • Welcome High-Tea &amp; Keynote by CXO. Day 2: 24-Hour AI Innovation Hackathon &amp; Breakout Strategy Sessions • Poolside Sunset BBQ Gala. Day 3: Team Sailing Regatta &amp; Beach Volleyball Tournament • Awards Banquet Dinner. Day 4: Executive Breakfast • Airport Transfers &amp; Return Flight.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. CORPORATE CUSTOMER BOOKING — CLIENT FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "corporate_customer_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Corporate Client Portal / B2B Web
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Review Custom MICE Proposal, Approve PO &amp; Lock Employee Flight Rosters
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-sky-400">
                Corporate Account: TCS Enterprise
              </span>
            </div>

            {/* Proposal Box */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">Annual Tech Leadership Summit &amp; Hackathon 2026</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-3xs font-extrabold">
                      4D/3N Goa Luxury Retreat
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    {attendeeCount} Principal Leaders &bull; Taj Exotica Goa &bull; Chartered Flights &bull; Grand Ballroom &bull; All Meals AP
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Total Corporate Proposal Value</span>
                  <span className="text-lg font-black text-white">₹{grandCorporateTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Corporate GST ITC Invoicing (18%) &bull; GSTIN: 07AACCE9918K1Z3
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      "Corporate Offsite Proposal Approved!\nPO Reference: TCS-GOA-MICE-2026\n45 Flight PNRs & 45 Taj Deluxe Rooms Locked."
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Authorize PO &amp; Lock Executive Offsite</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Offsite Confirmed: TCS-GOA-MICE-2026 &bull; Taj Exotica Booking #TAJ-88192
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      PO PROCESSED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    45 Delegate Travel Vouchers &amp; Boarding Passes have been dispatched to the enterprise travel coordinator email.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. CORPORATE OPERATOR BOOKING MANAGEMENT — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Corporate MICE Operations Desk
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Corporate Client Delegations, Flight Charters &amp; Ballroom Staging
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: Gurugram Enterprise Operations
              </span>
            </div>

            <div className="space-y-3">
              {corporateBookings.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.company}</span>
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-3xs">{item.id}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      {item.delegates} &bull; <span className="text-white font-semibold">{item.dates}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      {item.hotel} &bull; {item.flights} &bull; {item.logisticsStatus}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.invoiceStatus}
                    </span>
                    <button
                      onClick={() => alert(`Corporate Dossier sent for ${item.company}!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      View Logistics
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
                  Corporate MICE Core Microservices
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  B2B Credit Risk Engine, Group PNR GDS Blocker &amp; Automated E-Invoicing
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              High-security enterprise services managing Net-30 credit limits, group airline charter blockades, and automated GST E-Way &amp; E-Invoicing integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "B2B Credit & Enterprise PO Engine",
                desc: "Validates corporate credit limits against CRISIL ratings and automates purchase order milestone reconciliations.",
                icon: Briefcase,
              },
              {
                title: "Airline Group PNR & Flight Charter Blocker",
                desc: "Direct NDC/Amadeus integration for bulk seat blocking without immediate individual name disclosures.",
                icon: Plane,
              },
              {
                title: "Hotel MICE Ballroom & Room Block Mutex",
                desc: "Synchronizes room inventory and banquet hall allocations with hotel property management systems (PMS).",
                icon: Hotel,
              },
              {
                title: "GST E-Invoice & Tax ITC Clearance Engine",
                desc: "Direct integration with GSTN for real-time IRN (Invoice Reference Number) generation and QR stamping.",
                icon: FileSpreadsheet,
              },
              {
                title: "Employee Traveler Duty-of-Care & SOS",
                desc: "Real-time safety tracker and geofenced emergency response coordination for international corporate travelers.",
                icon: ShieldCheck,
              },
              {
                title: "Corporate Commission & Net Payout Ledger",
                desc: "Automated 4.0% corporate platform brokerage deductions and consolidated monthly bank wire settlements.",
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
                  Admin Panel &bull; Corporate Travel Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  MICE Operator Verification, Credit Limit Approvals &amp; Corporate GMV Audits
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: corporate_head@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Enterprise Accounts Managed</span>
                <span className="text-sm font-black text-white">128 Fortune &amp; Tech Giants</span>
                <span className="text-3xs text-emerald-400 block">Active Net-30 Invoicing</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly Corporate MICE GMV</span>
                <span className="text-sm font-black text-sky-400">₹8,40,00,000</span>
                <span className="text-3xs text-slate-400 block">4.0% Platform Commission</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Net Corporate Payouts Disbursed</span>
                <span className="text-sm font-black text-emerald-400">₹8,06,40,000</span>
                <span className="text-3xs text-slate-400 block">Zero Default Escrow Record</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
