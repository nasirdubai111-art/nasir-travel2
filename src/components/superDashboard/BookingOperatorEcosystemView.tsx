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
  Layers,
  Wallet,
  Compass,
  CheckSquare,
} from "lucide-react";

type BookingOperatorSubView =
  | "agency_registration"
  | "b2b_inventory_management"
  | "customer_agency_booking"
  | "operator_booking_management"
  | "backend_modules"
  | "admin_console";

export function BookingOperatorEcosystemView() {
  const [activeSubView, setActiveSubView] = useState<BookingOperatorSubView>(
    "b2b_inventory_management"
  );

  // Registration state
  const [regStep, setRegStep] = useState(1);
  const [agentData, setAgentData] = useState({
    agencyName: "Bharat Global Travel Wholesalers & B2B Consolidator",
    principalAgent: "Sunil Aggarwal & Manish Singhania",
    contactPhone: "+91 11 4987-2200",
    email: "b2b@bharatglobaltravels.com",
    officeAddress: "Barakhamba Road, Connaught Place, New Delhi 110001",
    iataIatoReg: "IATA-B2B-AGENT-881290 / IATO National Active Member",
    subAgentNetwork: "1,450 Verified Retail Travel Agents across Tier 2/3 Cities",
    creditDepositPool: "₹50,00,000 Rolling Escrow Credit Line",
    gstin: "07AABCB8819K1Z5",
    bankName: "State Bank of India (CP Main Branch)",
    accountNumber: "389201928374",
    ifsc: "SBIN0000691",
  });

  // B2B Inventory / White-label state
  const [b2bPackage, setB2bPackage] = useState({
    packageName: "All-India B2B Bulk Inventory: Flights + 5-Star Hotels + Train Tatkal Quotas",
    netWholesaleDiscount: "8.5% B2B Net Margin off Published Retail Fares",
    creditLimit: "₹15,00,000 Available Rolling Credit",
    markupControl: "Configurable Sub-Agent Client Markup (2% to 15%)",
    apiAccess: "JSON REST API & White-Label Web Portal",
    supportedCurrencies: "INR, USD, EUR, AED, GBP, SGD",
    settlementCycle: "Daily Net Credit Ledger Rebalancing with Instant PNR Lock",
  });

  // Customer booking state
  const [bookingClient, setBookingClient] = useState("Royal Holidays Ludhiana (Sub-Agent #104)");
  const [travelerName, setTravelerName] = useState("Vikas Oberoi & Family (4 Pax)");
  const [selectedProduct, setSelectedProduct] = useState("Goa 4N Luxury Villa + Return Indigo Flights");
  const [travelDate, setTravelDate] = useState("2026-09-28");
  const [agentMarkup, setAgentMarkup] = useState(6);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Booking management mock data
  const [agentBookings, setAgentBookings] = useState([
    {
      ref: "B2B-TXN-8819",
      subAgent: "Royal Holidays Ludhiana (Agent #104)",
      customer: "Vikas Oberoi (4 Pax)",
      product: "Goa 4N Luxury Villa + Return Indigo Flights",
      netCost: "₹42,000",
      markup: "+6% (₹2,520 Agent Earned)",
      grossBilled: "₹44,520",
      status: "Ticketed & Commission Credited",
    },
    {
      ref: "B2B-TXN-8820",
      subAgent: "Shiv Travel Services Jaipur (Agent #219)",
      customer: "Dr. R. K. Sharma (2 Pax)",
      product: "Kashmir 5N Houseboat + Gulmarg Resort",
      netCost: "₹38,000",
      markup: "+8% (₹3,040 Agent Earned)",
      grossBilled: "₹41,040",
      status: "Instant Voucher Issued",
    },
  ]);

  const netWholesalePrice = 42000;
  const markupAmount = Math.round(netWholesalePrice * (agentMarkup / 100));
  const finalClientFare = netWholesalePrice + markupAmount;

  return (
    <div className="space-y-6">
      {/* Sub Navigation Ribbon */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setActiveSubView("agency_registration")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "agency_registration"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>1. Agency Registration</span>
          </button>

          <button
            onClick={() => setActiveSubView("b2b_inventory_management")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "b2b_inventory_management"
                ? "bg-teal-600 text-white shadow-md font-black"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2. B2B Wholesaler Inventory &amp; API</span>
          </button>

          <button
            onClick={() => setActiveSubView("customer_agency_booking")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubView === "customer_agency_booking"
                ? "bg-indigo-600 text-white shadow-md"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>3. Sub-Agent Client Booking</span>
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
            <span>4. Sub-Agent PNRs &amp; Commission</span>
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

        <span className="text-3xs font-mono px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30">
          Vertical: B2B Wholesaler &amp; Travel Consolidator
        </span>
      </div>

      {/* ======================================================================= */}
      {/* 1. AGENCY REGISTRATION — PARTNER FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "agency_registration" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  B2B Consolidator Partner Portal
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Travel Agency Network Accreditation, IATA / IATO Credentials &amp; Escrow Pool
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERIFIED B2B CONSOLIDATOR
              </span>
            </div>

            {/* Stepper */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { step: 1, title: "Wholesaler Profile", desc: "IATA / IATO Accreditations" },
                { step: 2, title: "Sub-Agent Network", desc: "1,450 Retail Counter Link" },
                { step: 3, title: "Credit Escrow Pool", desc: "₹50 Lakh Rolling Line" },
                { step: 4, title: "Settlement Account", desc: "Automated Net Balancing" },
              ].map((s) => (
                <button
                  key={s.step}
                  onClick={() => setRegStep(s.step)}
                  className={`p-3 rounded-2xl text-left border transition-all ${
                    regStep === s.step
                      ? "bg-teal-500/20 border-teal-500/80 text-teal-300 shadow-md"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-3xs font-mono mb-0.5 text-teal-400 font-bold">Step 0{s.step}</div>
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
                    <label className="block text-slate-400 mb-1 font-semibold">Agency Commercial Name</label>
                    <input
                      type="text"
                      value={agentData.agencyName}
                      onChange={(e) => setAgentData({ ...agentData, agencyName: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Principal Managing Partner</label>
                    <input
                      type="text"
                      value={agentData.principalAgent}
                      onChange={(e) => setAgentData({ ...agentData, principalAgent: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">IATA / IATO Accreditation</label>
                    <input
                      type="text"
                      value={agentData.iataIatoReg}
                      onChange={(e) => setAgentData({ ...agentData, iataIatoReg: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-teal-300 font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Sub-Agent Network Reach</label>
                    <input
                      type="text"
                      value={agentData.subAgentNetwork}
                      onChange={(e) => setAgentData({ ...agentData, subAgentNetwork: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Corporate Office Address</label>
                    <input
                      type="text"
                      value={agentData.officeAddress}
                      onChange={(e) => setAgentData({ ...agentData, officeAddress: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {regStep >= 2 && (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Consolidator Rolling Escrow Account:</span>
                  <span className="text-emerald-400 font-mono font-bold">{agentData.bankName} (A/C: {agentData.accountNumber})</span>
                </div>
                <p className="text-slate-400 text-2xs">
                  Instant sub-agent credit top-ups &amp; automated daily net settlement. Platform wholesale take-rate: 1.8%.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 2. B2B WHOLESALER INVENTORY & API — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "b2b_inventory_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                  B2B Wholesale Inventory &amp; Sub-Agent API Controls
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Net Wholesale Rates, Credit Limits, Markup Controls &amp; XML API Keys
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-teal-400">
                Consolidator ID: B2B-CONSOL-9912
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="lg:col-span-2">
                <label className="block text-slate-400 mb-1 font-semibold">B2B Inventory Bundle</label>
                <input
                  type="text"
                  value={b2bPackage.packageName}
                  onChange={(e) => setB2bPackage({ ...b2bPackage, packageName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Net B2B Wholesale Margin</label>
                <input
                  type="text"
                  value={b2bPackage.netWholesaleDiscount}
                  onChange={(e) => setB2bPackage({ ...b2bPackage, netWholesaleDiscount: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-teal-300 font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Active Sub-Agent Credit Pool</label>
                <input
                  type="text"
                  value={b2bPackage.creditLimit}
                  onChange={(e) => setB2bPackage({ ...b2bPackage, creditLimit: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Sub-Agent Markup Policy</label>
                <input
                  type="text"
                  value={b2bPackage.markupControl}
                  onChange={(e) => setB2bPackage({ ...b2bPackage, markupControl: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">API Protocol &amp; White-Label</label>
                <input
                  type="text"
                  value={b2bPackage.apiAccess}
                  onChange={(e) => setB2bPackage({ ...b2bPackage, apiAccess: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Sub-Agent Retail Network API Connectivity:</span>
              </div>
              <p className="text-slate-400 text-2xs leading-relaxed">
                1,450 retail counters connected &bull; Average response latency &lt;140ms &bull; Zero double-booking concurrency lock active.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 3. SUB-AGENT CLIENT BOOKING — FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "customer_agency_booking" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  Sub-Agent White-Label Terminal
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Search Wholesale Inventory, Apply Retail Markup &amp; Issue Client Invoices
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold flex items-center gap-1">
                Sub-Agent: Royal Holidays (#104)
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Client Passenger Name</label>
                <input
                  type="text"
                  value={travelerName}
                  onChange={(e) => setTravelerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Wholesale Package</label>
                <input
                  type="text"
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Departure Date</label>
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Retail Markup (%)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={agentMarkup}
                    onChange={(e) => setAgentMarkup(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-teal-300 font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Bill & Summary */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-base">{selectedProduct}</span>
                    <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-3xs font-extrabold uppercase">
                      B2B Net: ₹{netWholesalePrice.toLocaleString()} &bull; +{agentMarkup}% Markup
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-0.5">
                    Client: {travelerName} &bull; Agent Net Commission: <span className="text-emerald-400 font-bold">₹{markupAmount.toLocaleString()}</span> directly credited to your wallet.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xs text-slate-400 block">Gross Price Billed to Customer</span>
                  <span className="text-lg font-black text-white">₹{finalClientFare.toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-2xs text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  White-label PDF Voucher &bull; Your Agency Logo &amp; Address Printed
                </span>

                <button
                  onClick={() => {
                    setBookingConfirmed(true);
                    alert(
                      `B2B Booking Issued!\nBooking Ref: B2B-TXN-8819\nClient Billed: ₹${finalClientFare.toLocaleString()}\nAgent Commission ₹${markupAmount.toLocaleString()} Credited.`
                    );
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Deduct Net ₹{netWholesalePrice.toLocaleString()} from Credit &amp; Issue</span>
                </button>
              </div>

              {bookingConfirmed && (
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-xs text-emerald-200 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-white text-sm flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Client Voucher Issued: B2B-TXN-8819 &bull; Commission ₹{markupAmount.toLocaleString()} Credited
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-3xs font-mono">
                      COMPLETED
                    </span>
                  </div>
                  <p className="text-2xs text-emerald-300">
                    White-label PDF ticket with Royal Holidays logo sent to client email &amp; WhatsApp.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* 4. SUB-AGENT PNRS & COMMISSION — OPERATOR FRONTEND */}
      {/* ======================================================================= */}
      {activeSubView === "operator_booking_management" && (
        <div className="space-y-6">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-2xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Sub-Agent PNRs &amp; Commission Ledger
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  Retail Counter Transactions, Credit Balance &amp; Real-time Margin Ledger
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400">
                Desk: B2B Consolidator Clearing Desk
              </span>
            </div>

            <div className="space-y-3">
              {agentBookings.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.subAgent}</span>
                      <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono text-3xs">{item.ref}</span>
                    </div>
                    <div className="text-slate-400 text-2xs">
                      Client: {item.customer} &bull; <span className="text-white font-semibold">{item.product}</span>
                    </div>
                    <div className="text-emerald-400 text-3xs font-mono">
                      Net: {item.netCost} &bull; {item.markup} &bull; Gross: {item.grossBilled}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-mono font-bold text-2xs">
                      {item.status}
                    </span>
                    <button
                      onClick={() => alert(`White-label invoice downloaded for ${item.ref}!`)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-2xs"
                    >
                      Download Invoice
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
                  B2B Consolidator &amp; White-Label Microservices
                </span>
                <h3 className="text-lg font-black text-white mt-0.5">
                  Sub-Agent Escrow Mutex, Multi-Currency Rebalancing &amp; Dynamic Markup Injector
                </h3>
              </div>
            </div>
            <p className="text-xs text-slate-300">
              Enterprise financial middleware managing multi-tenant credit overdraft safeguards, real-time sub-agent margin calculations, and PDF invoice branding engines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {[
              {
                title: "Sub-Agent Rolling Escrow & Overdraft Mutex",
                desc: "Validates available credit balance in real time and enforces atomic balance deductions before generating wholesale PNRs.",
                icon: Wallet,
              },
              {
                title: "Dynamic Sub-Agent Retail Markup Injector",
                desc: "Applies agent-specific profit percentage or flat markup dynamically onto wholesale fares without revealing net base costs.",
                icon: DollarSign,
              },
              {
                title: "White-Label PDF Branding & QR Generator",
                desc: "Renders branded travel vouchers with retail agent logo, GSTIN details, and contact numbers dynamically on ticket generation.",
                icon: QrCode,
              },
              {
                title: "B2B XML/REST High-Throughput API Gateway",
                desc: "Supports up to 12,000 requests per minute with API key authentication, rate throttling, and JSON response caching.",
                icon: Server,
              },
              {
                title: "Multi-Currency Forex Rebalancing Worker",
                desc: "Live currency conversion across INR, USD, AED, EUR and automatic cross-border banking reconciliation.",
                icon: TrendingUp,
              },
              {
                title: "Instant Net Credit Ledger Settlement",
                desc: "Transfers sub-agent commission directly to wallet and remits net wholesale amount to master consolidator account.",
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
                  Admin Panel &bull; B2B Travel Agency Governance
                </span>
                <h3 className="text-lg font-black text-white mt-1">
                  B2B Consolidator Approvals, Escrow Limits &amp; Platform GMV
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-purple-300">
                Admin: b2b_director@bharatyatra.in
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Registered B2B Agencies</span>
                <span className="text-sm font-black text-white">4,850 Travel Agencies</span>
                <span className="text-3xs text-emerald-400 block">Across 220 Indian Cities</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">Monthly B2B Gross GMV</span>
                <span className="text-sm font-black text-teal-400">₹24,50,00,000</span>
                <span className="text-3xs text-slate-400 block">1.8% Platform Brokerage</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-3xs text-slate-400 font-semibold block">B2B PNRs Issued</span>
                <span className="text-sm font-black text-emerald-400">1,42,000 PNRs</span>
                <span className="text-3xs text-slate-400 block">99.9% Ticket Settlement Success</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
