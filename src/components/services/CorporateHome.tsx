import React, { useState } from "react";
import {
  Briefcase,
  ShieldCheck,
  Building,
  CheckCircle2,
  Download,
  Users,
  CreditCard,
  ArrowRight,
  Sparkles,
  Plane,
  Train,
  Building2,
  Car,
  Clock,
  Filter,
  Search,
  Check,
  X,
  FileText,
  TrendingUp,
  AlertCircle,
  Settings,
  DollarSign,
  UserCheck,
  Calendar,
  Layers,
} from "lucide-react";
import { CityLocation, CorporatePlan } from "../../types";
import { MOCK_CORPORATE_PLANS } from "../../data/mockTravelData";

interface CorporateHomeProps {
  currentLocation: CityLocation;
  onBookCorporate: (plan: CorporatePlan) => void;
  onOpenAIDrawer: () => void;
}

type CorporateTab =
  | "dashboard"
  | "employee_travel"
  | "search_booking"
  | "approval"
  | "trips"
  | "invoices"
  | "reports"
  | "profile";

interface TravelRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  department: string;
  service: "flight" | "hotel" | "train" | "cab";
  route: string;
  dates: string;
  estimatedCost: number;
  policyStatus: "within_policy" | "exception_requested";
  managerStatus: "pending" | "approved" | "rejected";
  urgency: "Normal" | "High Priority";
}

const MOCK_APPROVAL_REQUESTS: TravelRequest[] = [
  {
    id: "CORP-REQ-901",
    employeeName: "Rohan Varma",
    employeeId: "EMP-4102",
    department: "Enterprise Sales",
    service: "flight",
    route: "DEL ➔ BLR (Air India AI-506)",
    dates: "28 Aug - 30 Aug 2026",
    estimatedCost: 11450,
    policyStatus: "within_policy",
    managerStatus: "pending",
    urgency: "High Priority",
  },
  {
    id: "CORP-REQ-902",
    employeeName: "Priyanka Sen",
    employeeId: "EMP-3882",
    department: "Engineering Architecture",
    service: "hotel",
    route: "The Oberoi, Mumbai (2 Nights)",
    dates: "02 Sep - 04 Sep 2026",
    estimatedCost: 22000,
    policyStatus: "exception_requested",
    managerStatus: "pending",
    urgency: "Normal",
  },
  {
    id: "CORP-REQ-903",
    employeeName: "Adarsh Nair",
    employeeId: "EMP-5190",
    department: "Client Solutions",
    service: "cab",
    route: "Bengaluru Airport ➔ Electronic City Outstation",
    dates: "29 Aug 2026",
    estimatedCost: 2400,
    policyStatus: "within_policy",
    managerStatus: "approved",
    urgency: "Normal",
  },
];

export function CorporateHome({
  currentLocation,
  onBookCorporate,
  onOpenAIDrawer,
}: CorporateHomeProps) {
  const [activeTab, setActiveTab] = useState<CorporateTab>("dashboard");
  const [approvalRequests, setApprovalRequests] = useState<TravelRequest[]>(MOCK_APPROVAL_REQUESTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Corporate Profile State
  const [corporateProfile, setCorporateProfile] = useState({
    companyName: "Acme India Technologies Private Limited",
    cin: "U72200KA2018PTC112345",
    gstin: "29AAACA1234A1Z5",
    address: "Prestige Tech Park, Outer Ring Road, Bengaluru 560103",
    billingCycle: "Monthly Consolidated (30 Days Credit)",
    creditLimit: 1500000,
    creditUsed: 382400,
    adminContact: "corporate.travel@acmeindia.com",
    activeEmployees: 340,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApproval = (id: string, newStatus: "approved" | "rejected") => {
    setApprovalRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, managerStatus: newStatus } : req))
    );
    showToast(`Request ${id} marked as ${newStatus.toUpperCase()}! Notification sent.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Corporate Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700">
        <div className="max-w-4xl space-y-4 relative z-10">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 shadow-md">
              <Briefcase className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  BharatYatra Corporate Travel Management
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  18% GST Input Credit Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Automated B2B GST Invoicing • Multi-Tier Approval Workflows • Centralized Corporate Credit Ledger
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Corporate Portal Module Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-2xl p-1.5 shadow-xs overflow-x-auto text-xs font-semibold">
        {[
          { id: "dashboard", label: "Corporate Dashboard", icon: <Layers className="w-4 h-4" /> },
          { id: "employee_travel", label: "Employee Travel", icon: <Users className="w-4 h-4" /> },
          { id: "search_booking", label: "Search & Booking", icon: <Search className="w-4 h-4" /> },
          { id: "approval", label: `Approval (${approvalRequests.filter(r => r.managerStatus === "pending").length})`, icon: <CheckCircle2 className="w-4 h-4" /> },
          { id: "trips", label: "Trips", icon: <Plane className="w-4 h-4" /> },
          { id: "invoices", label: "Invoices & GST", icon: <FileText className="w-4 h-4" /> },
          { id: "reports", label: "Reports & Policy", icon: <TrendingUp className="w-4 h-4" /> },
          { id: "profile", label: "Company Profile", icon: <Building className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CorporateTab)}
            className={`py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-slate-900 text-white shadow-xs font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: CORPORATE DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-slate-400 text-xs font-semibold uppercase">Total Monthly Travel Spend</span>
              <div className="text-2xl font-extrabold text-slate-900">₹3,82,400</div>
              <span className="text-emerald-600 font-bold text-xs">Saved ₹68,832 via GST Credit</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-slate-400 text-xs font-semibold uppercase">Corporate Revolving Credit</span>
              <div className="text-2xl font-extrabold text-indigo-600">₹11,17,600 Left</div>
              <span className="text-slate-500 text-xs">Limit: ₹15,00,000 (30-day billing)</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-slate-400 text-xs font-semibold uppercase">Pending Approvals</span>
              <div className="text-2xl font-extrabold text-amber-600">
                {approvalRequests.filter((r) => r.managerStatus === "pending").length} Requests
              </div>
              <span className="text-amber-700 font-bold text-xs">Requires Manager Sign-off</span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <span className="text-slate-400 text-xs font-semibold uppercase">Policy Compliance</span>
              <div className="text-2xl font-extrabold text-emerald-600">96.8%</div>
              <span className="text-emerald-700 font-bold text-xs">Within Auto-Approval Bands</span>
            </div>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                <span>Recent Travel Activity &amp; Live Bookings</span>
                <span className="text-xs text-indigo-600 font-semibold cursor-pointer hover:underline">
                  View All Trips
                </span>
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                {[
                  { traveler: "Meera Sen", role: "VP Marketing", trip: "DEL ➔ BLR (Vistara UK-812)", date: "Tomorrow, 06:15 AM", status: "Confirmed", cost: "₹7,200" },
                  { traveler: "Adarsh Nair", role: "Tech Lead", trip: "The Westin Mumbai Garden City (3 Nights)", date: "01 Sep 2026", status: "Confirmed", cost: "₹24,500" },
                  { traveler: "Karan Patel", role: "DevOps Engineer", trip: "Vande Bharat Express (Mumbai ➔ Goa)", date: "05 Sep 2026", status: "Auto-Approved", cost: "₹2,450" },
                ].map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">{item.traveler} • <span className="text-slate-500 font-normal">{item.role}</span></h5>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.trip}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900">{item.cost}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold block mt-0.5">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md space-y-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Corporate Travel AI Policy</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Smart policy automatically flags off-contract hotels and recommends flights with guaranteed 100% refundable corporate baggage allowances.
              </p>
              <button
                onClick={onOpenAIDrawer}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all"
              >
                Consult Policy Bot ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EMPLOYEE TRAVEL */}
      {activeTab === "employee_travel" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Employee Travel Roster &amp; Cost Centers</h3>
              <p className="text-xs text-slate-500">Manage 340 active employees, assigned travel bands, and custom daily allowance caps.</p>
            </div>
            <button
              onClick={() => showToast("Bulk employee CSV directory imported successfully!")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black"
            >
              + Add / Sync Employees
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Travel Band</th>
                  <th className="p-3">Flight Limit</th>
                  <th className="p-3">Hotel Limit</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: "Siddharth Rao", email: "siddharth@acme.com", dept: "Leadership", band: "Band A (VP+)", flight: "Business / Premium", hotel: "₹12,000 / night", status: "Active" },
                  { name: "Ananya Iyer", email: "ananya.i@acme.com", dept: "Sales", band: "Band B (Manager)", flight: "Economy (All Lines)", hotel: "₹6,000 / night", status: "Active" },
                  { name: "Rohan Varma", email: "rohan.v@acme.com", dept: "Sales", band: "Band B (Manager)", flight: "Economy (All Lines)", hotel: "₹6,000 / night", status: "Active" },
                  { name: "Priyanka Sen", email: "priyanka.s@acme.com", dept: "Engineering", band: "Band C (IC)", flight: "Lowest Logical Fare", hotel: "₹4,500 / night", status: "Active" },
                ].map((emp, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{emp.name}</div>
                      <div className="text-[11px] text-slate-400">{emp.email}</div>
                    </td>
                    <td className="p-3 font-medium text-slate-700">{emp.dept}</td>
                    <td className="p-3 font-bold text-indigo-700">{emp.band}</td>
                    <td className="p-3 text-slate-600">{emp.flight}</td>
                    <td className="p-3 text-slate-600">{emp.hotel}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SEARCH & BOOKING */}
      {activeTab === "search_booking" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Corporate Booking Engine</h3>
              <p className="text-xs text-slate-500">Book flights, premium business hotels, and cabs with corporate negotiated rates &amp; zero convenience fees.</p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
              Contract Rates Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { title: "Corporate Flights", sub: "Free cancellation & meals", icon: <Plane className="w-5 h-5 text-sky-600" /> },
              { title: "Business Hotels", sub: "Late check-out guaranteed", icon: <Building2 className="w-5 h-5 text-indigo-600" /> },
              { title: "IRCTC Executive Trains", sub: "Vande Bharat priority quota", icon: <Train className="w-5 h-5 text-amber-600" /> },
              { title: "Airport & Outstation Cabs", sub: "Fixed toll & GST billing", icon: <Car className="w-5 h-5 text-emerald-600" /> },
            ].map((srv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:border-indigo-400 hover:shadow-xs cursor-pointer transition-all space-y-2"
                onClick={() => showToast(`Initiated corporate search workflow for ${srv.title}!`)}
              >
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-2xs border border-slate-200">
                  {srv.icon}
                </div>
                <h4 className="font-bold text-xs text-slate-900">{srv.title}</h4>
                <p className="text-[11px] text-slate-500">{srv.sub}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: APPROVAL WORKFLOWS */}
      {activeTab === "approval" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Manager Travel Approvals Queue</h3>
              <p className="text-xs text-slate-500">1-Click approval for out-of-policy requests or high-value executive travel.</p>
            </div>
            <span className="text-xs text-slate-400">Sync with Slack &amp; Microsoft Teams Active</span>
          </div>

          <div className="space-y-3">
            {approvalRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-300 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                      {req.id}
                    </span>
                    <span className="font-bold text-slate-900">{req.employeeName}</span>
                    <span className="text-slate-400">({req.department})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        req.policyStatus === "within_policy"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {req.policyStatus === "within_policy" ? "✓ Within Policy" : "⚠️ Exception Requested"}
                    </span>
                    <span className="text-xs font-black text-slate-900">₹{req.estimatedCost.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800 block">{req.route}</span>
                    <span className="text-slate-500 text-[11px]">{req.dates}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.managerStatus === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApproval(req.id, "rejected")}
                          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 text-xs"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproval(req.id, "approved")}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-xs shadow-xs"
                        >
                          Approve Trip
                        </button>
                      </>
                    ) : (
                      <span
                        className={`text-xs font-bold px-3 py-1 rounded-lg ${
                          req.managerStatus === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {req.managerStatus === "approved" ? "✓ Approved" : "✕ Rejected"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: TRIPS */}
      {activeTab === "trips" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Enterprise Active &amp; Historical Trips</h3>
          <div className="divide-y divide-slate-100 text-xs">
            {[
              { id: "CORP-TRIP-101", traveler: "Rohan Varma", type: "Flight", details: "DEL ➔ BLR (AI-506)", date: "28 Aug 2026", status: "Upcoming", pnr: "DELBLR918" },
              { id: "CORP-TRIP-102", traveler: "Ananya Iyer", type: "Hotel", details: "Taj West End, Bengaluru", date: "15 Aug 2026", status: "Completed", pnr: "TAJ-BLR-442" },
              { id: "CORP-TRIP-103", traveler: "Siddharth Rao", type: "Train", details: "Vande Bharat Express (Chennai ➔ Bengaluru)", date: "10 Aug 2026", status: "Completed", pnr: "20608-MAS" },
            ].map((t) => (
              <div key={t.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500">{t.id}</span>
                    <span className="font-bold text-slate-900">{t.traveler}</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{t.details} • PNR: {t.pnr}</p>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-500 block">{t.date}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INVOICES & GST */}
      {activeTab === "invoices" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Monthly Consolidated B2B Tax Invoices</h3>
              <p className="text-xs text-slate-500">Compliant GSTR-2B automated matching format for enterprise accounting.</p>
            </div>
            <button
              onClick={() => showToast("Downloaded all GST XML & PDF invoices for August 2026!")}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Bulk Invoices (ZIP)</span>
            </button>
          </div>

          <div className="space-y-3">
            {[
              { id: "INV-2026-AUG-01", period: "01 Aug - 15 Aug 2026", total: "₹1,94,200", gstInput: "₹34,956", status: "Settled" },
              { id: "INV-2026-JUL-02", period: "16 Jul - 31 Jul 2026", total: "₹2,88,400", gstInput: "₹51,912", status: "Settled" },
              { id: "INV-2026-JUL-01", period: "01 Jul - 15 Jul 2026", total: "₹2,10,000", gstInput: "₹37,800", status: "Settled" },
            ].map((inv) => (
              <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <h5 className="font-mono font-bold text-slate-900">{inv.id}</h5>
                  <p className="text-slate-500 text-[11px]">Billing Period: {inv.period}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{inv.total}</span>
                    <span className="text-[11px] text-emerald-600 font-semibold">18% GST: {inv.gstInput}</span>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded tax invoice PDF for ${inv.id}`)}
                    className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: REPORTS & POLICY */}
      {activeTab === "reports" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-5">
          <h3 className="font-bold text-slate-900 text-sm">Travel Analytics &amp; Spending Policy Compliance</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Spend by Category</span>
              <div className="font-bold text-slate-900">Flights (58%) • Hotels (32%) • Cabs (10%)</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Advance Booking Window</span>
              <div className="font-bold text-slate-900">Average 8.4 Days Prior</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Top Business Routes</span>
              <div className="font-bold text-slate-900">DEL-BLR, BOM-DEL, BLR-HYD</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: COMPANY PROFILE */}
      {activeTab === "profile" && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Company Legal &amp; Billing Profile</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Registered Entity</span>
              <div className="font-bold text-slate-900">{corporateProfile.companyName}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">GSTIN Number</span>
              <div className="font-mono font-bold text-slate-900">{corporateProfile.gstin}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">CIN / Registration</span>
              <div className="font-mono font-bold text-slate-900">{corporateProfile.cin}</div>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
              <span className="text-slate-400 uppercase font-bold text-[10px]">Billing Cycle</span>
              <div className="font-bold text-slate-900">{corporateProfile.billingCycle}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
