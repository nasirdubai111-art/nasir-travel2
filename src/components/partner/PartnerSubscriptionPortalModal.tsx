import React, { useState } from "react";
import {
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  Zap,
  TrendingUp,
  CreditCard,
  Building2,
  Layers,
  Sparkles,
  Download,
  Printer,
  Copy,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  RefreshCw,
  FileText,
  SlidersHorizontal,
  HelpCircle,
  Lock,
  Database,
  Server,
  ArrowUpRight,
  Info,
  DollarSign,
  PieChart,
  Percent,
  Receipt,
  RotateCcw,
  Plane,
  Train,
  Bus,
  Car,
  Home,
  Palmtree,
  Ship,
  Map,
  Landmark,
  Briefcase,
  UtensilsCrossed,
} from "lucide-react";
import {
  PARTNER_SUBSCRIPTION_PLANS,
  COMMERCIAL_MODELS_CATALOG,
  MULTI_SERVICE_COMMISSION_CONFIGS,
  INITIAL_PARTNER_SUBSCRIPTION_STATE,
  BACKEND_DATABASE_SCHEMAS,
  SubscriptionPlanTier,
  ActivePartnerSubscriptionState,
} from "../../data/partnerSubscriptionData";
import { ServiceCategory } from "../../types";

interface PartnerSubscriptionPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "dashboard" | "plans" | "commission" | "models" | "backend_architecture" | "integration_flow";
}

export function PartnerSubscriptionPortalModal({
  isOpen,
  onClose,
  initialTab = "dashboard",
}: PartnerSubscriptionPortalModalProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "plans" | "commission" | "models" | "backend_architecture" | "integration_flow">(initialTab);
  const [partnerState, setPartnerState] = useState<ActivePartnerSubscriptionState>(INITIAL_PARTNER_SUBSCRIPTION_STATE);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "quarterly" | "annual">("monthly");
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<SubscriptionPlanTier | null>(null);
  const [isProcessingUpgrade, setIsProcessingUpgrade] = useState(false);
  const [upgradeSuccessMessage, setUpgradeSuccessMessage] = useState<string | null>(null);
  const [selectedVerticalForFilter, setSelectedVerticalForFilter] = useState<string>("all");
  const [selectedCommercialModelId, setSelectedCommercialModelId] = useState<"MODEL_A" | "MODEL_B" | "MODEL_C" | "MODEL_D">("MODEL_A");
  
  // Interactive Simulator State for Commercial Models
  const [simCategory, setSimCategory] = useState<string>("hotels");
  const [simMonthlyGMV, setSimMonthlyGMV] = useState<number>(500000);
  const [simCustomTakeRate, setSimCustomTakeRate] = useState<number>(10.0);
  const [simCustomSubscription, setSimCustomSubscription] = useState<number>(999);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentPlan = PARTNER_SUBSCRIPTION_PLANS.find((p) => p.id === partnerState.currentPlanId) || PARTNER_SUBSCRIPTION_PLANS[1];

  const handleSimulatePlanPayment = (plan: SubscriptionPlanTier) => {
    setIsProcessingUpgrade(true);
    setTimeout(() => {
      let price = plan.monthlyPrice;
      if (billingCycle === "quarterly") price = plan.quarterlyPrice;
      if (billingCycle === "annual") price = plan.annualPrice;
      
      const tax = Math.round(price * 0.18);
      const total = price + tax;
      const todayStr = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      const invoiceId = `INV-SUB-8842-${Date.now().toString().slice(-4)}`;

      setPartnerState((prev) => ({
        ...prev,
        currentPlanId: plan.id,
        currentPlanName: plan.name,
        billingCycle: billingCycle,
        subscriptionStartDate: new Date().toISOString().split("T")[0],
        subscriptionExpiryDate: new Date(Date.now() + (billingCycle === "annual" ? 365 : billingCycle === "quarterly" ? 90 : 30) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        listingLimit: plan.listingLimit,
        bookingLimitPerMonth: plan.bookingLimitPerMonth,
        branchesLimit: plan.branchesPropertiesLimit,
        paymentHistory: [
          {
            id: `SUB-PAY-${Date.now()}`,
            date: todayStr,
            invoiceNumber: invoiceId,
            description: `${plan.name} (${billingCycle.toUpperCase()} Billing)`,
            amountINR: price,
            gstAmountINR: tax,
            totalPaidINR: total,
            paymentMethod: "Razorpay Instant UPI (Verified Auto-Debit)",
            status: "paid",
          },
          ...prev.paymentHistory,
        ],
        planHistory: [
          {
            id: `HIST-${Date.now()}`,
            date: todayStr,
            fromPlan: prev.currentPlanName,
            toPlan: plan.name,
            billingCycle: `${billingCycle.toUpperCase()} (₹${price.toLocaleString("en-IN")})`,
            action: plan.monthlyPrice > (currentPlan.monthlyPrice || 0) ? "upgrade" : "downgrade",
            chargedAmountINR: total,
          },
          ...prev.planHistory,
        ],
      }));

      setIsProcessingUpgrade(false);
      setSelectedPlanForUpgrade(null);
      setUpgradeSuccessMessage(`Successfully switched to ${plan.name}! Your new listing limits & reduced commission rates are active immediately.`);
      setTimeout(() => {
        setUpgradeSuccessMessage(null);
      }, 6000);
    }, 1200);
  };

  const handleDownloadPartnerInvoice = (invoiceNumber: string, planName: string, amount: number) => {
    const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const base = Math.round(amount / 1.18);
    const gst = amount - base;

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Tax Invoice - ${invoiceNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f8fafc; padding: 24px; color: #0f172a; }
    .inv-card { max-width: 760px; margin: 0 auto; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .hdr { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
    .title { font-size: 22px; font-weight: 900; color: #4338ca; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; font-size: 13px; }
    .box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
    th { background: #0f172a; color: #fff; padding: 10px; text-align: left; }
    td { padding: 12px 10px; border-bottom: 1px solid #e2e8f0; }
    .total-box { margin-left: auto; width: 280px; background: #f8fafc; border: 1px solid #cbd5e1; padding: 14px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
    .ftr { border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="inv-card">
    <div class="hdr">
      <div>
        <div style="font-size: 20px; font-weight: 800;">🇮🇳 BharatYatra Technologies Pvt Ltd</div>
        <div style="font-size: 11px; color: #64748b; margin-top: 4px;">
          GSTIN: 07AAACB4410R1ZP • SAC: 998313 (IT / SaaS Platform Subscription)<br />
          DLF Cyber City, Gurugram, Haryana - 122002
        </div>
      </div>
      <div style="text-align: right;">
        <div class="title">B2B TAX INVOICE</div>
        <div style="font-size: 12px; font-weight: bold; font-family: monospace;">Invoice #${invoiceNumber}</div>
        <div style="font-size: 11px; color: #64748b;">Date: ${today}</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="box">
        <strong>Billed To (Registered Partner):</strong><br />
        ${partnerState.partnerName}<br />
        Type: ${partnerState.businessType}<br />
        GSTIN: <strong>${partnerState.gstin}</strong><br />
        State: Rajasthan (State Code: 08)
      </div>
      <div class="box">
        <strong>Subscription Details:</strong><br />
        Plan Tier: <strong>${planName}</strong><br />
        Cycle: ${partnerState.billingCycle.toUpperCase()}<br />
        Status: 100% PAID &amp; VERIFIED<br />
        Place of Supply: Rajasthan (Inter-State IGST / CGST)
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>SAC Code</th>
          <th style="text-align: right;">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${planName} SaaS Platform Subscription</strong><br />
            <span style="font-size: 11px; color: #64748b;">Access to BharatYatra Merchant Extranet, Channel Sync &amp; Rate Engine</span>
          </td>
          <td>998313</td>
          <td style="text-align: right; font-weight: bold;">₹${base.toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td>Central GST (CGST @ 9%)</td>
          <td>998313</td>
          <td style="text-align: right;">₹${Math.round(gst / 2).toLocaleString("en-IN")}</td>
        </tr>
        <tr>
          <td>State GST (SGST @ 9%)</td>
          <td>998313</td>
          <td style="text-align: right;">₹${Math.round(gst / 2).toLocaleString("en-IN")}</td>
        </tr>
      </tbody>
    </table>

    <div class="total-box">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span>Taxable Amount:</span>
        <strong>₹${base.toLocaleString("en-IN")}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
        <span>Total GST (18%):</span>
        <strong>₹${gst.toLocaleString("en-IN")}</strong>
      </div>
      <div style="display: flex; justify-content: space-between; font-size: 15px; font-weight: 800; border-top: 1px solid #cbd5e1; padding-top: 6px;">
        <span>Total Paid:</span>
        <span style="color: #4338ca;">₹${amount.toLocaleString("en-IN")}</span>
      </div>
    </div>

    <div class="ftr">
      This is a digitally generated invoice under Section 31 of CGST Act. Valid for Input Tax Credit (ITC).<br />
      BharatYatra Partner Helpdesk: partners@bharatyatra.in • 1800-200-YATRA
    </div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 300); };</script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Subscription_Invoice_${invoiceNumber}_BharatYatra.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setToastMessage(`Downloaded GST Tax Invoice #${invoiceNumber}`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const getServiceIcon = (category: string) => {
    switch (category) {
      case "flights": return <Plane className="w-4 h-4 text-sky-600" />;
      case "trains": return <Train className="w-4 h-4 text-amber-600" />;
      case "buses": return <Bus className="w-4 h-4 text-red-600" />;
      case "hotels": return <Building2 className="w-4 h-4 text-indigo-600" />;
      case "lodges": return <Home className="w-4 h-4 text-emerald-600" />;
      case "resorts": return <Palmtree className="w-4 h-4 text-purple-600" />;
      case "cabs": return <Car className="w-4 h-4 text-yellow-600" />;
      case "houseboats": return <Ship className="w-4 h-4 text-teal-600" />;
      case "tours": return <Map className="w-4 h-4 text-fuchsia-600" />;
      case "pilgrimage": return <Landmark className="w-4 h-4 text-orange-600" />;
      case "corporate_tours": return <Briefcase className="w-4 h-4 text-slate-700" />;
      case "dhabas": return <UtensilsCrossed className="w-4 h-4 text-rose-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black">
              <Zap className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black tracking-tight">
                  Partner Subscription &amp; Commercial Plans
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Model A / B / C / D
                </span>
              </div>
              <p className="text-xs text-slate-300">
                {partnerState.partnerName} • Plan: <strong className="text-indigo-300">{partnerState.currentPlanName}</strong> • GSTIN: {partnerState.gstin}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {upgradeSuccessMessage && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{upgradeSuccessMessage}</span>
            </div>
            <button onClick={() => setUpgradeSuccessMessage(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {toastMessage && (
          <div className="bg-indigo-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50 overflow-x-auto">
          {[
            { id: "dashboard", label: "1. Subscription Dashboard", icon: Layers },
            { id: "plans", label: "2. Plan Selection & Upgrade", icon: Zap },
            { id: "commission", label: "3. Commission & Earnings", icon: TrendingUp },
            { id: "models", label: "4. Commercial Models (A/B/C/D)", icon: SlidersHorizontal },
            { id: "backend_architecture", label: "5. Hidden Backend Schemas", icon: Database },
            { id: "integration_flow", label: "6. Integration Flow", icon: ArrowRight },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3 text-xs font-extrabold border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600 bg-white shadow-2xs"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${activeTab === tab.id ? "text-indigo-600" : "text-slate-400"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Container */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* =========================================================================
              TAB 1: PARTNER SUBSCRIPTION DASHBOARD
             ========================================================================= */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Active Plan Hero Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-amber-950">
                        {currentPlan.badge}
                      </span>
                      <span className="text-xs text-indigo-200">
                        Model: <strong>{partnerState.activeCommercialModel} (Sub + Commission)</strong>
                      </span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white">
                      {partnerState.currentPlanName}
                    </h3>
                    <p className="text-xs text-indigo-200 max-w-xl">
                      {currentPlan.tagline} Enjoy reduced commission take-rates and automated daily payouts.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setActiveTab("plans")}
                      className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                    >
                      <Zap className="w-4 h-4 text-slate-950" />
                      <span>Upgrade / Change Plan</span>
                    </button>
                    <button
                      onClick={() => handleSimulatePlanPayment(currentPlan)}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Renew Subscription</span>
                    </button>
                  </div>
                </div>

                {/* Plan Meta Subgrid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-indigo-700/50 text-xs">
                  <div>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Start Date</span>
                    <p className="font-bold text-white mt-0.5">{partnerState.subscriptionStartDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Expiry / Next Renewal</span>
                    <p className="font-bold text-emerald-300 mt-0.5">{partnerState.subscriptionExpiryDate}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Billing Cycle</span>
                    <p className="font-bold text-white mt-0.5 capitalize">{partnerState.billingCycle} (Auto-Renew ON)</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-wider">Settlement Speed</span>
                    <p className="font-bold text-amber-300 mt-0.5">{currentPlan.settlementCycle}</p>
                  </div>
                </div>
              </div>

              {/* Usage & Entitlement Limits Meter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Listing Capacity</span>
                    <span className="font-mono font-bold text-indigo-600">
                      {partnerState.listingsUsed} / {partnerState.listingLimit} Units
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full rounded-full transition-all"
                      style={{ width: `${(partnerState.listingsUsed / (typeof partnerState.listingLimit === "number" ? partnerState.listingLimit : 100)) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Active rooms/suites currently live on search results.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Monthly Bookings Processed</span>
                    <span className="font-mono font-bold text-emerald-600">
                      {partnerState.bookingsUsedThisMonth} / {partnerState.bookingLimitPerMonth}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${(partnerState.bookingsUsedThisMonth / (typeof partnerState.bookingLimitPerMonth === "number" ? partnerState.bookingLimitPerMonth : 500)) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Processed at reduced {currentPlan.commissionRate.hotels}% commission take-rate.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">Properties / Branches</span>
                    <span className="font-mono font-bold text-purple-600">
                      {partnerState.branchesUsed} / {partnerState.branchesLimit} Branch
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full w-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Upgrade to Professional or Enterprise for multi-property SSO.
                  </p>
                </div>
              </div>

              {/* Invoices & Upgrade History Table */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Subscription Tax Invoices */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-black text-slate-900 text-sm">Subscription Tax Invoices</h4>
                    </div>
                    <span className="text-[11px] text-slate-500">GST Input Tax Credit Eligible</span>
                  </div>

                  <div className="space-y-2.5">
                    {partnerState.paymentHistory.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-slate-900">{inv.invoiceNumber}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                              PAID
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{inv.description}</p>
                          <p className="text-[10px] text-slate-400">{inv.date} • {inv.paymentMethod}</p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1.5">
                          <span className="font-bold text-slate-900">₹{inv.totalPaidINR.toLocaleString("en-IN")}</span>
                          <button
                            onClick={() => handleDownloadPartnerInvoice(inv.invoiceNumber, partnerState.currentPlanName, inv.totalPaidINR)}
                            className="px-2.5 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Plan Lifecycle & Upgrade History */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-black text-slate-900 text-sm">Plan Lifecycle &amp; Upgrade Log</h4>
                    </div>
                    <span className="text-[11px] text-slate-500">Immutable Audit Trail</span>
                  </div>

                  <div className="space-y-2.5">
                    {partnerState.planHistory.map((hist) => (
                      <div
                        key={hist.id}
                        className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{hist.toPlan}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                              {hist.action}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">{hist.billingCycle}</p>
                          <p className="text-[10px] text-slate-400">{hist.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">₹{hist.chargedAmountINR.toLocaleString("en-IN")}</span>
                          <p className="text-[10px] text-emerald-700 font-semibold">Active Cycle</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 2: PLAN SELECTION & UPGRADE / PRICING
             ========================================================================= */}
          {activeTab === "plans" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Billing Cycle Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Select Partner Subscription Billing Term</h3>
                  <p className="text-xs text-slate-500">Save up to 20% on annual commitments with guaranteed 0-commission quotas.</p>
                </div>

                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === "monthly" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("quarterly")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === "quarterly" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Quarterly (Save 10%)
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === "annual" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Annual (Save 20%)
                  </button>
                </div>
              </div>

              {/* 4 Plan Tier Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {PARTNER_SUBSCRIPTION_PLANS.map((plan) => {
                  const isCurrent = partnerState.currentPlanId === plan.id;
                  let displayPrice = plan.monthlyPrice;
                  let periodLabel = "/month";
                  if (billingCycle === "quarterly") {
                    displayPrice = plan.quarterlyPrice;
                    periodLabel = "/quarter";
                  } else if (billingCycle === "annual") {
                    displayPrice = plan.annualPrice;
                    periodLabel = "/year";
                  }

                  return (
                    <div
                      key={plan.id}
                      className={`rounded-2xl border-2 bg-white flex flex-col justify-between shadow-md transition-all hover:shadow-xl relative overflow-hidden ${
                        isCurrent ? "border-indigo-600 ring-2 ring-indigo-600/20" : plan.popular ? "border-blue-400" : "border-slate-200"
                      }`}
                    >
                      {plan.popular && (
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-black uppercase text-center py-1 tracking-wider">
                          Most Popular Plan
                        </div>
                      )}

                      <div className="p-5 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {plan.category}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                ACTIVE PLAN
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-black text-slate-900 mt-1">{plan.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5 min-h-[32px]">{plan.tagline}</p>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-900">
                              {displayPrice === 0 ? "Free" : `₹${displayPrice.toLocaleString("en-IN")}`}
                            </span>
                            {displayPrice > 0 && <span className="text-xs text-slate-500">{periodLabel}</span>}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5">+ 18% GST Applicable (ITC Valid)</p>
                        </div>

                        {/* Core Commercial Numbers */}
                        <div className="space-y-1.5 text-xs border-y border-slate-100 py-3">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Listing Limits:</span>
                            <strong className="text-slate-900">{plan.listingLimit} Units</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Booking Limit:</span>
                            <strong className="text-slate-900">{plan.bookingLimitPerMonth} / mo</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Hotel Commission:</span>
                            <strong className="text-indigo-600 font-bold">{plan.commissionRate.hotels}%</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Payout Settlement:</span>
                            <strong className="text-slate-800">{plan.settlementCycle}</strong>
                          </div>
                        </div>

                        {/* Feature Checklist */}
                        <div className="space-y-2">
                          <p className="text-[11px] font-bold uppercase text-slate-400">Included Features</p>
                          {plan.features.map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span className="leading-tight">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="p-5 pt-0">
                        {isCurrent ? (
                          <button
                            disabled
                            className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-bold text-center cursor-not-allowed"
                          >
                            Currently Subscribed
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedPlanForUpgrade(plan)}
                            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Select &amp; Upgrade</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checkout / Upgrade Confirmation Modal */}
              {selectedPlanForUpgrade && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
                  <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <Zap className="w-5 h-5 text-indigo-600" />
                        <h3 className="font-extrabold text-base text-slate-900">Confirm Plan Upgrade</h3>
                      </div>
                      <button onClick={() => setSelectedPlanForUpgrade(null)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Selected Plan:</span>
                        <strong className="text-slate-900">{selectedPlanForUpgrade.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Billing Cycle:</span>
                        <strong className="text-slate-900 capitalize">{billingCycle}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Base Plan Charge:</span>
                        <strong className="text-slate-900">
                          ₹{(billingCycle === "annual" ? selectedPlanForUpgrade.annualPrice : billingCycle === "quarterly" ? selectedPlanForUpgrade.quarterlyPrice : selectedPlanForUpgrade.monthlyPrice).toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">18% GST (ITC Claimable):</span>
                        <strong className="text-slate-900">
                          ₹{Math.round((billingCycle === "annual" ? selectedPlanForUpgrade.annualPrice : billingCycle === "quarterly" ? selectedPlanForUpgrade.quarterlyPrice : selectedPlanForUpgrade.monthlyPrice) * 0.18).toLocaleString("en-IN")}
                        </strong>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-indigo-700">
                        <span>Total Payable:</span>
                        <span>
                          ₹{Math.round((billingCycle === "annual" ? selectedPlanForUpgrade.annualPrice : billingCycle === "quarterly" ? selectedPlanForUpgrade.quarterlyPrice : selectedPlanForUpgrade.monthlyPrice) * 1.18).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Instant Auto-Activation Guarantee</span>
                      </div>
                      <p>
                        Your new listing limits ({selectedPlanForUpgrade.listingLimit} units) and reduced commission rate ({selectedPlanForUpgrade.commissionRate.hotels}%) take effect immediately upon checkout.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => setSelectedPlanForUpgrade(null)}
                        className="flex-1 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSimulatePlanPayment(selectedPlanForUpgrade)}
                        disabled={isProcessingUpgrade}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        {isProcessingUpgrade ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay &amp; Activate</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB 3: COMMISSION MODEL & EARNINGS DASHBOARD
             ========================================================================= */}
          {activeTab === "commission" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Financial Metrics Summary Ribbon */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Gross Booking Value</span>
                  <p className="text-xl font-black text-slate-900">
                    ₹{partnerState.grossBookingValueMonth.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-500">{partnerState.totalBookingsMonth} Confirmed Bookings</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Platform Commission (14%)</span>
                  <p className="text-xl font-black text-rose-600">
                    -₹{partnerState.platformCommissionMonth.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Saved ₹23,800 vs Basic Plan</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Net Partner Earnings</span>
                  <p className="text-xl font-black text-emerald-700">
                    ₹{partnerState.partnerEarningsMonth.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-500">After commission deduction</p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Escrow Payout</span>
                  <p className="text-xl font-black text-amber-600">
                    ₹{partnerState.pendingSettlementINR.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11px] text-slate-500">Next Payout: {partnerState.nextSettlementDate}</p>
                </div>
              </div>

              {/* Multi-Service Commission Configuration Matrix */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-black text-slate-900 text-sm">
                      Category-Wise Commission &amp; Settlement Matrix (All 13 Verticals)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Configuration-driven take rates across transportation, hospitality, dining, and spiritual tours.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setToastMessage("Generated Consolidated 13-Vertical Commission Schedule (CSV/PDF)");
                        setTimeout(() => setToastMessage(null), 4000);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Statement</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5">Travel Vertical</th>
                        <th className="p-2.5 text-center">Default Model</th>
                        <th className="p-2.5 text-center">Basic Commission</th>
                        <th className="p-2.5 text-center">Pro/Standard Rate</th>
                        <th className="p-2.5 text-center">SAC Code</th>
                        <th className="p-2.5">Settlement Window</th>
                        <th className="p-2.5 text-right">Avg Basket (AOV)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {MULTI_SERVICE_COMMISSION_CONFIGS.map((cfg) => (
                        <tr key={cfg.category} className="hover:bg-slate-50 transition-colors">
                          <td className="p-2.5 font-bold text-slate-900 flex items-center gap-2">
                            {getServiceIcon(cfg.category)}
                            <span>{cfg.name}</span>
                          </td>
                          <td className="p-2.5 text-center font-mono text-[11px] font-bold text-indigo-700">
                            {cfg.defaultModel}
                          </td>
                          <td className="p-2.5 text-center text-slate-600 font-bold">
                            {cfg.standardTakeRatePercent}%
                          </td>
                          <td className="p-2.5 text-center text-emerald-700 font-extrabold bg-emerald-50/50">
                            {cfg.proTakeRatePercent}%
                          </td>
                          <td className="p-2.5 text-center font-mono text-slate-500">
                            {cfg.sacCode}
                          </td>
                          <td className="p-2.5 text-slate-700 text-[11px]">
                            {cfg.settlementCycle}
                          </td>
                          <td className="p-2.5 text-right font-bold text-slate-900">
                            ₹{cfg.typicalAOV.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Booking-Wise Commission Ledger */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-black text-slate-900 text-sm">Booking-Wise Real-Time Commission Deduction</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Month: Aug 2026</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5">Booking / Guest</th>
                        <th className="p-2.5">Service Item</th>
                        <th className="p-2.5 text-right">Gross Fare</th>
                        <th className="p-2.5 text-center">Take Rate</th>
                        <th className="p-2.5 text-right">Commission</th>
                        <th className="p-2.5 text-right">GST on Comm</th>
                        <th className="p-2.5 text-right font-bold text-emerald-700">Net Partner Share</th>
                        <th className="p-2.5 text-center">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {partnerState.bookingCommissions.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-50">
                          <td className="p-2.5">
                            <strong className="text-slate-900">{b.guestName}</strong>
                            <p className="text-[10px] font-mono text-slate-400">{b.bookingId}</p>
                          </td>
                          <td className="p-2.5 text-slate-700">
                            {b.serviceTitle}
                          </td>
                          <td className="p-2.5 text-right font-bold text-slate-900">
                            ₹{b.grossAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="p-2.5 text-center font-bold text-indigo-600">
                            {b.commissionRatePercent}%
                          </td>
                          <td className="p-2.5 text-right text-rose-600 font-medium">
                            -₹{b.commissionAmount.toLocaleString("en-IN")}
                          </td>
                          <td className="p-2.5 text-right text-slate-500 font-mono text-[11px]">
                            ₹{b.gstOnCommission}
                          </td>
                          <td className="p-2.5 text-right font-extrabold text-emerald-700">
                            ₹{b.netPartnerShare.toLocaleString("en-IN")}
                          </td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              b.settlementStatus === "settled" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {b.settlementStatus === "settled" ? "Settled" : "Pending Escrow"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 4: COMMERCIAL MODELS (MODEL A, B, C, D)
             ========================================================================= */}
          {activeTab === "models" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-base font-black text-slate-900">
                    Configuration-Driven Commercial Architecture (Model A / B / C / D)
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed max-w-4xl">
                  The BharatYatra commercial engine is completely configuration-driven. Rather than hard-coding business logic per operator vertical, the unified engine evaluates subscriptions, take-rates, zero-commission overrides, and SLA settlement cycles systematically.
                </p>
              </div>

              {/* 4 Models Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {COMMERCIAL_MODELS_CATALOG.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedCommercialModelId(m.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedCommercialModelId === m.id
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                          {m.shortCode}
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600">{m.badge}</span>
                      </div>
                      <h4 className="font-black text-sm text-slate-900">{m.name}</h4>
                      <p className="text-xs text-slate-600 line-clamp-3 leading-tight">{m.description}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] space-y-1">
                      <div className="text-slate-500">Subscription: <strong className="text-slate-800">{m.subscriptionStructure}</strong></div>
                      <div className="text-slate-500">Commission: <strong className="text-slate-800">{m.commissionStructure}</strong></div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Detailed View of Selected Commercial Model */}
              {(() => {
                const activeModel = COMMERCIAL_MODELS_CATALOG.find((m) => m.id === selectedCommercialModelId) || COMMERCIAL_MODELS_CATALOG[0];
                return (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-800 uppercase">
                            {activeModel.id}
                          </span>
                          <h3 className="text-lg font-black text-slate-900">{activeModel.name}</h3>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{activeModel.typicalUse}</p>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="text-slate-500">Real-World Case Study:</span>
                        <strong className="block text-slate-900 font-bold">{activeModel.examplePartner}</strong>
                      </div>
                    </div>

                    {/* Financial Economics Breakdown Box */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-amber-400 uppercase tracking-wider">
                          Sample Monthly Economics Simulator ({activeModel.shortCode})
                        </span>
                        <span className="text-slate-300">Monthly GMV: ₹{activeModel.exampleBreakdown.monthlyGMVINR.toLocaleString("en-IN")}</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-indigo-800">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase">Subscription Fee</span>
                          <p className="font-black text-white text-base">₹{activeModel.exampleBreakdown.calculatedSubscription.toLocaleString("en-IN")}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase">Commission ({activeModel.exampleBreakdown.commissionPercent}%)</span>
                          <p className="font-black text-rose-300 text-base">₹{activeModel.exampleBreakdown.calculatedCommission.toLocaleString("en-IN")}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase">Platform Take</span>
                          <p className="font-black text-amber-300 text-base">₹{activeModel.exampleBreakdown.totalPlatformTake.toLocaleString("en-IN")}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase">Partner Retained</span>
                          <p className="font-black text-emerald-400 text-base">₹{activeModel.exampleBreakdown.partnerRetained.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Modules & Supported Verticals Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="font-black text-sm text-slate-900">Supported Functional Modules</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {activeModel.keyModules.map((mod, i) => (
                            <div key={i} className="p-2 rounded bg-slate-50 border border-slate-200 text-slate-700 flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-indigo-600 shrink-0" />
                              <span>{mod}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-black text-sm text-slate-900">Target Verticals</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeModel.supportedVerticals.map((vert, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-bold">
                              {vert}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* =========================================================================
              TAB 5: BACKEND ARCHITECTURE & HIDDEN SCHEMAS (NEVER DISPLAYED SECRETS)
             ========================================================================= */}
          {activeTab === "backend_architecture" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Security Boundary Notice */}
              <div className="p-5 rounded-2xl bg-rose-950 text-rose-100 border border-rose-800 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 font-black">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  <span>Strict Security Zero-Leakage Architecture</span>
                </div>
                <p className="text-xs text-rose-200 leading-relaxed">
                  <strong>Frontend Rule:</strong> Displays authorized plans, pricing, commission summaries, and partner earnings.<br />
                  <strong>Backend Rule:</strong> Performs subscription entitlement, commission deduction, payment verification, RTGS bank settlement, tax calculation, and GDS/PMS API integrations.<br />
                  <strong>Zero-Leakage Constraint:</strong> Database credentials, payment secrets, API keys, supplier credentials, internal endpoints, and private calculation code are strictly server-side and never exposed to the client.
                </p>
              </div>

              {/* Core Backend Engines Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">Subscription Engine</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Plan Management &amp; Entitlement</li>
                    <li>Trial &amp; Grace Period Handlers</li>
                    <li>Automated e-NACH Mandates</li>
                    <li>Suspension &amp; Reactivation Mutex</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">Commission Engine</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Multi-category Rule Resolver</li>
                    <li>Dynamic Slab &amp; Peak Surge Tiers</li>
                    <li>Promotional &amp; Negotiated Overrides</li>
                    <li>Zero-Commission Contract Flags</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">Billing Engine</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Govt GST E-Invoice &amp; IRN Hashes</li>
                    <li>Automated Payment Verification</li>
                    <li>Dunning &amp; Retry Schedules</li>
                    <li>Cancellation Refund Escrow</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                    4
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">Settlement Engine</h4>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li>Gross Booking Calculation</li>
                    <li>TDS 194O &amp; GST Tax Deduction</li>
                    <li>Automated Bank Payout Batches</li>
                    <li>Cryptographic Audit Ledger</li>
                  </ul>
                </div>
              </div>

              {/* Database Schema DDL Catalog */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-black text-slate-900 text-sm">
                      Relational Database Schemas (PostgreSQL &amp; Cloud SQL)
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Row-Level Security (RLS) Active</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BACKEND_DATABASE_SCHEMAS.map((tbl) => (
                    <div key={tbl.tableName} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-indigo-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {tbl.tableName}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-slate-500">{tbl.category}</span>
                      </div>
                      <p className="text-xs text-slate-600">{tbl.description}</p>

                      <div className="space-y-1 border-t border-slate-200 pt-2 text-[11px] font-mono">
                        {tbl.columns.slice(0, 4).map((col, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span>
                              {col.name} {col.isPrimary && <strong className="text-amber-700">[PK]</strong>}
                            </span>
                            <span className="text-slate-400">{col.type}</span>
                          </div>
                        ))}
                        {tbl.columns.length > 4 && (
                          <p className="text-[10px] text-slate-400 font-sans pt-1">
                            + {tbl.columns.length - 4} more encrypted columns &amp; foreign keys
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 6: END-TO-END INTEGRATION FLOW
             ========================================================================= */}
          {activeTab === "integration_flow" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-md space-y-4">
                <div className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-black">Complete End-to-End Integration Architecture</h3>
                </div>
                <p className="text-xs text-slate-300">
                  Visual mapping of how partner subscriptions, real-time booking commissions, and automated settlements flow from the edge interface to banking channels.
                </p>

                {/* ASCII Topology Diagram */}
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-[11px] sm:text-xs overflow-x-auto leading-relaxed">
{`1. PARTNER & BOOKING INTEGRATION FLOW:
Partner App / Web
       │
       ▼
Subscription & Partner Dashboard
       │
       ▼ (Port 3000 Ingress / TLS 1.3 / JWT Auth)
Secure Backend API
       │
       ▼
Subscription Engine + Commission Engine
       │
       ▼
Booking Engine
       │
  ┌────┼────────┬────────┬────────┬────────┬────────┬────────┐
  ▼    ▼        ▼        ▼        ▼        ▼        ▼        ▼
Flight Train   Bus     Hotel    Lodge   Resort    Cab    Houseboat / Tour / Yatra
  │    │        │        │        │        │        │        │
  └────┴────────┴────────┴────────┴────────┴────────┴────────┘
                               │
                               ▼
                       Payment Gateway (Razorpay / UPI)
                               │
                               ▼
                      Commission Calculation
                               │
                               ▼
                       Settlement Engine (T+0 / T+1 / RTGS)
                               │
                               ▼
                        Partner Earnings

2. ADMIN GOVERNANCE & AUDIT FLOW:
Admin Panel (Super Admin Console)
       │
       ▼
Admin Login + RBAC (WebAuthn / MFA / Session Token)
       │
       ▼
Admin Backend APIs (mTLS / Internal Gateway)
       │
       ▼
Subscription + Commission + Booking + Payment + Settlement Management
       │
       ▼
Reports + Analytics + Cryptographic Audit Trail`}
                </pre>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
                  <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Admin Commercial Controls</span>
                  </h4>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside">
                    <li>Dynamic Commission Rule creation &amp; override</li>
                    <li>Plan pricing adjustments &amp; custom enterprise terms</li>
                    <li>Instant manual settlement release / freeze on risk flag</li>
                    <li>Financial reconciliation &amp; GST tax compliance audit</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2 text-xs">
                  <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-indigo-600" />
                    <span>Partner Privacy &amp; Data Isolation</span>
                  </h4>
                  <ul className="text-slate-600 space-y-1 list-disc list-inside">
                    <li>Tenant-scoped database rows with PostgreSQL RLS</li>
                    <li>Automated bank statement reconciliation</li>
                    <li>Zero visibility into competitor pricing formulas</li>
                    <li>Instant download of GST-compliant partner statements</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>ISO 27001 Certified • RBI Payment Aggregator Escrow Compliant</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 cursor-pointer shadow-2xs transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setActiveTab("plans")}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-xs flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Explore Plans</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
