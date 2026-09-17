import React, { useState, useEffect } from "react";
import {
  CreditCard,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Search,
  Copy,
  ExternalLink,
  Percent,
  Layers,
  Banknote,
  Send,
  Code2,
  Database,
  Printer,
  Download,
  Share2,
  Terminal,
  Activity,
  Check,
  RefreshCw,
  X,
  FileSpreadsheet,
  Lock,
  Smartphone,
  Building,
  Sparkles,
  Info,
} from "lucide-react";
import {
  RazorpayPaymentRequestPayload,
  RazorpayCreateOrderResponse,
  RazorpayVerifyPaymentResponse,
  RazorpayTravelReceipt,
  SupabaseRazorpayTransactionRow,
  RazorpayWebhookVerifyResponse,
} from "../../types/razorpaySupabasePayment";
import { RazorpaySupabasePaymentService } from "../../services/razorpaySupabasePaymentService";

const QUICK_PACKAGES = [
  {
    service_type: "Kedarnath Helicopter Darshan & VIP Access",
    booking_id: "BY-KEDAR-8821",
    amount: 14500,
    customer_name: "Amitabh Sen",
    customer_email: "amitabh.sen@gmail.com",
    customer_phone: "+91 9811234567",
    category: "Pilgrimage Flight",
  },
  {
    service_type: "Char Dham Yatra 10-Day Deluxe Family Package",
    booking_id: "BY-CHARDHAM-4019",
    amount: 38500,
    customer_name: "Sunita Deshmukh",
    customer_email: "sunita.deshmukh@yahoo.com",
    customer_phone: "+91 9822345678",
    category: "Pilgrimage Yatra",
  },
  {
    service_type: "Varanasi Ganga Ghat Heritage Palace & Bajra Boat",
    booking_id: "BY-VARANASI-2201",
    amount: 18500,
    customer_name: "Meera Krishnan",
    customer_email: "meera.krishnan@outlook.com",
    customer_phone: "+91 9444123456",
    category: "Heritage Hotel",
  },
  {
    service_type: "Dal Lake Luxury Srinagar Houseboat with Gondola Pass",
    booking_id: "BY-KASHMIR-9912",
    amount: 22000,
    customer_name: "Rajesh Malhotra",
    customer_email: "rajesh.malhotra@corp.in",
    customer_phone: "+91 9899123456",
    category: "Houseboat Suite",
  },
];

export function RazorpaySupabasePaymentFlowView() {
  const [activeTab, setActiveTab] = useState<
    "create_pay" | "receipt" | "supabase_db" | "webhook_tester" | "architecture"
  >("create_pay");

  // Form State for creating payment request
  const [formData, setFormData] = useState<RazorpayPaymentRequestPayload>({
    service_type: QUICK_PACKAGES[0].service_type,
    booking_id: QUICK_PACKAGES[0].booking_id,
    amount: QUICK_PACKAGES[0].amount,
    customer_name: QUICK_PACKAGES[0].customer_name,
    customer_email: QUICK_PACKAGES[0].customer_email,
    customer_phone: QUICK_PACKAGES[0].customer_phone,
    currency: "INR",
    method_preference: "upi",
  });

  // Flow State
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<RazorpayCreateOrderResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<RazorpayVerifyPaymentResponse | null>(null);
  const [activeReceipt, setActiveReceipt] = useState<RazorpayTravelReceipt | null>(null);

  // Database Transactions State
  const [transactions, setTransactions] = useState<SupabaseRazorpayTransactionRow[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Webhook Tester State
  const [webhookEvent, setWebhookEvent] = useState<"payment.captured" | "payment.failed">("payment.captured");
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookResult, setWebhookResult] = useState<RazorpayWebhookVerifyResponse | null>(null);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadTransactions = async () => {
    setIsLoadingDb(true);
    try {
      const txs = await RazorpaySupabasePaymentService.getTransactions();
      setTransactions(txs);
    } catch (err: any) {
      showToast("Error loading Supabase transactions: " + err.message);
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // STEP 1: React Frontend -> Supabase Edge Function: Create Payment Request
  const handleCreatePaymentRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || formData.amount <= 0) {
      showToast("Please specify a valid payment amount");
      return;
    }

    setIsCreatingOrder(true);
    setCreatedOrder(null);
    setVerifyResult(null);

    try {
      const result = await RazorpaySupabasePaymentService.createPaymentRequest(formData);
      setCreatedOrder(result);
      showToast(`Razorpay order created via Supabase Edge Function (${result.order_id})`);
      loadTransactions();
    } catch (err: any) {
      showToast("Failed: " + err.message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  // STEP 2, 3, 4: Supabase Edge Function verifies signature, reads secret & writes to Supabase
  const handleExecutePaymentVerification = async (isSuccessAttempt = true) => {
    if (!createdOrder) return;

    setIsVerifying(true);
    try {
      const paymentId = `pay_${Math.random().toString(36).substring(2, 9).toUpperCase()}${Date.now().toString().slice(-4)}`;

      // Simulate genuine Razorpay Checkout client signature
      const validSignature = await RazorpaySupabasePaymentService.generateSimulatedSignature(
        createdOrder.order_id,
        paymentId
      );

      const signatureToSubmit = isSuccessAttempt
        ? validSignature
        : "invalid_tampered_signature_77192a0e9";

      const verifyResponse = await RazorpaySupabasePaymentService.verifyPayment({
        razorpay_order_id: createdOrder.order_id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signatureToSubmit,
        booking_id: createdOrder.booking_id,
        payment_method: formData.method_preference || "upi",
        amount: createdOrder.amount_inr,
        customer_name: createdOrder.customer.name,
        customer_email: createdOrder.customer.email,
        customer_phone: createdOrder.customer.phone,
        service_type: createdOrder.service_type,
        receipt_number: createdOrder.receipt_number,
      });

      setVerifyResult(verifyResponse);

      if (verifyResponse.success && verifyResponse.travel_receipt) {
        setActiveReceipt(verifyResponse.travel_receipt);
        showToast("Payment verified & written to Supabase! Receipt generated.");
      } else {
        showToast("Signature verification failed as simulated.");
      }

      loadTransactions();
    } catch (err: any) {
      showToast("Verification Error: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  // STEP 3: Test Webhook & Signature Verification
  const handleTestWebhook = async () => {
    setIsTestingWebhook(true);
    setWebhookResult(null);

    try {
      const orderIdToTest = createdOrder?.order_id || "order_DEMO_992182";
      const paymentIdToTest = `pay_whk_${Date.now().toString().slice(-6)}`;

      const res = await RazorpaySupabasePaymentService.verifyWebhook({
        event: webhookEvent,
        order_id: orderIdToTest,
        payment_id: paymentIdToTest,
        amount: formData.amount,
      });

      setWebhookResult(res);
      showToast(`Webhook signature verified! Status: ${res.action_taken}`);
      loadTransactions();
    } catch (err: any) {
      showToast("Webhook test failed: " + err.message);
    } finally {
      setIsTestingWebhook(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied ${label} to clipboard!`);
  };

  const filteredTransactions = transactions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.order_id.toLowerCase().includes(q) ||
      (t.payment_id || "").toLowerCase().includes(q) ||
      t.customer_name.toLowerCase().includes(q) ||
      t.receipt_number.toLowerCase().includes(q) ||
      t.service_type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-indigo-950 border border-indigo-500/50 text-indigo-200 text-xs font-semibold shadow-2xl shadow-indigo-950/80 flex items-center gap-2.5 animate-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-indigo-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-600/20 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 text-[11px] font-mono font-bold border border-cyan-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                React ➔ Supabase Edge Function ➔ Supabase DB
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">Razorpay Gateway Architecture</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Razorpay + Supabase Edge Function Architecture</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Complete zero-trust payment orchestration: Client initiates payment request, Supabase Edge Function reads secret server-side, verifies HMAC-SHA256 signature, records transaction into Supabase PostgreSQL, and returns customer tax receipt.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadTransactions}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingDb ? "animate-spin" : ""}`} />
              <span>Refresh Database</span>
            </button>
          </div>
        </div>

        {/* Dynamic Architectural Pipeline Diagram */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>End-to-End Payment Request Pipeline</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Zero Client Secret Exposure
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* Stage 1 */}
            <div
              onClick={() => setActiveTab("create_pay")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "create_pay"
                  ? "bg-indigo-950/40 border-indigo-500 text-white shadow-lg shadow-indigo-950/40"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-indigo-400 mb-1">
                <span>01. React Frontend</span>
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-xs">Create Payment Request</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Traveler details, package &amp; INR amount dispatched to Edge Function.
              </div>
            </div>

            {/* Stage 2 */}
            <div
              onClick={() => setActiveTab("architecture")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "architecture"
                  ? "bg-purple-950/40 border-purple-500 text-white shadow-lg shadow-purple-950/40"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-purple-400 mb-1">
                <span>02. Supabase Edge Function</span>
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-xs">Secret &amp; Signature Engine</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Reads Razorpay secret, creates order, computes HMAC-SHA256.
              </div>
            </div>

            {/* Stage 3 */}
            <div
              onClick={() => setActiveTab("supabase_db")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "supabase_db"
                  ? "bg-cyan-950/40 border-cyan-500 text-white shadow-lg shadow-cyan-950/40"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400 mb-1">
                <span>03. Supabase Database</span>
                <Database className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-xs">Write razorpay_transactions</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Persists order_id, payment_id, verified status &amp; tax metadata.
              </div>
            </div>

            {/* Stage 4 */}
            <div
              onClick={() => setActiveTab("receipt")}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                activeTab === "receipt"
                  ? "bg-emerald-950/40 border-emerald-500 text-white shadow-lg shadow-emerald-950/40"
                  : "bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400 mb-1">
                <span>04. React Frontend</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-xs">Payment Status &amp; Receipt</div>
              <div className="text-[10px] text-slate-400 mt-1">
                Displays verified tax invoice, GST breakdown &amp; download PDF.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <button
            onClick={() => setActiveTab("create_pay")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "create_pay"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Smartphone className="w-4 h-4 text-indigo-300" />
            <span>1. Create &amp; Pay Flow</span>
            {createdOrder && (
              <span className="px-1.5 py-0.2 rounded bg-indigo-900 text-[10px] font-mono">
                Order Active
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("receipt")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "receipt"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Printer className="w-4 h-4 text-emerald-300" />
            <span>2. Payment Status &amp; Receipt</span>
            {activeReceipt && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-900 text-[10px] font-mono text-emerald-300">
                Verified
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("supabase_db")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "supabase_db"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Database className="w-4 h-4 text-cyan-300" />
            <span>3. Supabase DB Vault</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-900 text-[10px] font-mono">
              {transactions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("webhook_tester")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "webhook_tester"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Send className="w-4 h-4 text-purple-300" />
            <span>4. Webhook Verifier</span>
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "architecture"
                ? "bg-slate-800 text-white shadow-md"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Code2 className="w-4 h-4 text-amber-300" />
            <span>5. Edge Code &amp; Schema</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CREATE & PAY FLOW                                                  */}
      {/* ========================================================================= */}
      {activeTab === "create_pay" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form to Create Payment Request */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                    <span>Create Payment Request (Frontend)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Dispatches request to Supabase Edge Function to initialize Razorpay Order.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                  POST /functions/v1/razorpay-payment
                </span>
              </div>

              {/* Quick Preset Packages */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                  Select Quick Travel Package Preset:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_PACKAGES.map((pkg, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          service_type: pkg.service_type,
                          booking_id: pkg.booking_id,
                          amount: pkg.amount,
                          customer_name: pkg.customer_name,
                          customer_email: pkg.customer_email,
                          customer_phone: pkg.customer_phone,
                        });
                        setCreatedOrder(null);
                        setVerifyResult(null);
                      }}
                      className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        formData.booking_id === pkg.booking_id
                          ? "bg-indigo-950/50 border-indigo-500 text-white shadow-sm"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700"
                      }`}
                    >
                      <div className="font-bold text-white text-xs truncate">{pkg.service_type}</div>
                      <div className="flex items-center justify-between text-[10px] mt-1 text-slate-400">
                        <span className="text-emerald-400 font-bold">₹{pkg.amount.toLocaleString("en-IN")}</span>
                        <span className="font-mono text-[9px]">{pkg.category}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleCreatePaymentRequest} className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1 font-semibold">Service / Booking Description *</label>
                    <input
                      type="text"
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1 font-semibold">Booking ID *</label>
                    <input
                      type="text"
                      value={formData.booking_id}
                      onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1 font-semibold">Amount to Pay (INR) *</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500 font-bold">₹</span>
                      <input
                        type="number"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-bold text-sm focus:outline-none focus:border-indigo-500"
                        required
                        min="1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1 font-semibold">Payment Channel</label>
                    <select
                      value={formData.method_preference}
                      onChange={(e) => setFormData({ ...formData, method_preference: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      <option value="upi">UPI (Instant 0% MDR)</option>
                      <option value="card">Credit / Debit Card</option>
                      <option value="netbanking">NetBanking (50+ Banks)</option>
                      <option value="wallet">AmazonPay / Mobikwik</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1 font-semibold">Traveler Name *</label>
                    <input
                      type="text"
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1 font-semibold">Email *</label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1 font-semibold">Mobile Phone *</label>
                    <input
                      type="text"
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Price Breakdown Calculation */}
                <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Base Fare &amp; Services:</span>
                    <span className="font-mono text-slate-200">
                      ₹{(formData.amount / 1.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Statutory Tourism GST (5%):</span>
                    <span className="font-mono text-cyan-400">
                      ₹{(formData.amount - formData.amount / 1.05).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Convenience Fee:</span>
                    <span className="font-mono text-emerald-400">₹0.00 (Waived)</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-sm">
                    <span>Total Amount Payable:</span>
                    <span className="text-emerald-400 font-mono">
                      ₹{formData.amount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingOrder}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isCreatingOrder ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Invoking Supabase Edge Function...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>1. Create Payment Request via Supabase Edge Function</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Execution Response & Checkout Simulation */}
          <div className="lg:col-span-6 space-y-6">
            {/* If Order is Created: Show Checkout Gateway Simulator */}
            {createdOrder ? (
              <div className="p-5 rounded-3xl bg-slate-950 border border-indigo-500/50 shadow-2xl space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      ₹
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Razorpay Standard Checkout Modal</h4>
                      <p className="text-[10px] text-slate-400">
                        Order Initialized by Edge Function • Ready for Signature Verification
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30">
                    Order Ready
                  </span>
                </div>

                {/* Checkout Specs Card */}
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Razorpay Order ID:</span>
                      <div className="font-mono font-bold text-indigo-300 flex items-center gap-1">
                        <span>{createdOrder.order_id}</span>
                        <button
                          onClick={() => copyToClipboard(createdOrder.order_id, "Order ID")}
                          className="hover:text-white"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Client Key ID:</span>
                      <span className="font-mono text-slate-300">{createdOrder.key_id}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Amount:</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        ₹{createdOrder.amount_inr.toLocaleString("en-IN")}{" "}
                        <span className="text-[10px] text-slate-400">({createdOrder.amount} paise)</span>
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Tax Receipt Pre-assigned:</span>
                      <span className="font-mono text-cyan-300">{createdOrder.receipt_number}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Supabase DB Initial Record:</span>
                    <span className="px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 font-mono text-[10px] border border-cyan-800/40">
                      {createdOrder.edge_function_metadata.supabase_synced ? "Written (status=created)" : "Local Fallback"}
                    </span>
                  </div>
                </div>

                {/* Interactive Simulated Payment Actions */}
                <div className="space-y-2 pt-2">
                  <div className="text-[11px] font-bold text-slate-300">
                    Simulate Payment Verification via Supabase Edge Function:
                  </div>

                  <button
                    onClick={() => handleExecutePaymentVerification(true)}
                    disabled={isVerifying}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying HMAC-SHA256 &amp; Writing to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Simulate Successful Payment (Valid HMAC-SHA256)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleExecutePaymentVerification(false)}
                    disabled={isVerifying}
                    className="w-full py-2.5 rounded-2xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Test Tampered Signature (Verification Failure)</span>
                  </button>
                </div>

                {/* Result of Verification */}
                {verifyResult && (
                  <div
                    className={`p-4 rounded-2xl border text-xs space-y-2 animate-in fade-in ${
                      verifyResult.signature_verified
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-200"
                        : "bg-rose-950/40 border-rose-500 text-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold">
                        {verifyResult.signature_verified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-rose-400" />
                        )}
                        <span>
                          {verifyResult.signature_verified
                            ? "HMAC-SHA256 Verification Passed"
                            : "Signature Verification Failed"}
                        </span>
                      </div>
                      <span className="font-mono text-[10px]">
                        {verifyResult.edge_function_metadata?.duration_ms || 42}ms
                      </span>
                    </div>

                    <div className="text-[11px] leading-relaxed">
                      {verifyResult.signature_verified ? (
                        <>
                          Transaction written to Supabase table{" "}
                          <strong className="font-mono text-cyan-300">public.razorpay_transactions</strong>. Payment ID:{" "}
                          <strong className="font-mono">{verifyResult.payment_id}</strong>.
                        </>
                      ) : (
                        "The HMAC signature submitted did not match the secret key. The transaction has been recorded as 'failed' in Supabase."
                      )}
                    </div>

                    {verifyResult.signature_verified && (
                      <button
                        onClick={() => setActiveTab("receipt")}
                        className="w-full mt-2 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>View Verified Travel Tax Receipt</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              /* Placeholder before order creation */
              <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800/80 shadow-xl flex flex-col items-center justify-center text-center space-y-4 min-h-[380px]">
                <div className="w-16 h-16 rounded-2xl bg-indigo-950/50 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <CreditCard className="w-8 h-8 animate-pulse" />
                </div>
                <div className="max-w-md">
                  <h4 className="text-sm font-bold text-white">Awaiting Payment Request Creation</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in the traveler booking details on the left and click <strong>Create Payment Request</strong>. The Supabase Edge Function will initialize the Razorpay Order and record it into the Supabase database.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono text-left w-full max-w-sm space-y-1">
                  <div className="text-indigo-400 font-bold">Edge Function Pipeline:</div>
                  <div>1. Read RAZORPAY_KEY_SECRET</div>
                  <div>2. Create Order &amp; paise amount</div>
                  <div>3. Return public key_id to client</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PAYMENT STATUS & TRAVEL RECEIPT                                    */}
      {/* ========================================================================= */}
      {activeTab === "receipt" && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {activeReceipt ? (
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden print:p-0 print:border-none">
              {/* Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800/20 text-8xl font-black rotate-[-25deg] select-none pointer-events-none">
                PAID
              </div>

              {/* Receipt Action Bar */}
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800 print:hidden flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold text-xs border border-emerald-500/30 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PAID &amp; SIGNATURE VERIFIED
                  </span>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs border border-cyan-500/30 flex items-center gap-1.5">
                    <Database className="w-3 h-3" />
                    Written to Supabase DB
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      const jsonStr = JSON.stringify(activeReceipt, null, 2);
                      const blob = new Blob([jsonStr], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${activeReceipt.receipt_number}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                      showToast("Receipt downloaded as JSON!");
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold border border-slate-800 flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Download JSON</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("create_pay")}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>New Payment</span>
                  </button>
                </div>
              </div>

              {/* Printable Tax Invoice Content */}
              <div className="space-y-6">
                {/* Header: Company Details & Invoice Meta */}
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm">
                        BY
                      </div>
                      <h3 className="font-black text-white text-base tracking-tight">
                        BharatYatra Technologies
                      </h3>
                    </div>
                    <p className="text-[11px] text-slate-400 max-w-sm">
                      {activeReceipt.provider_details.company_name}
                    </p>
                    <div className="text-[10px] text-slate-500 font-mono mt-1 space-y-0.5">
                      <div>GSTIN: <strong className="text-slate-300">{activeReceipt.provider_details.gstin}</strong></div>
                      <div>SAC Code: <strong className="text-slate-300">{activeReceipt.provider_details.sac_code}</strong></div>
                      <div>CIN: <strong className="text-slate-300">{activeReceipt.provider_details.cin}</strong></div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">TAX INVOICE &amp; PAYMENT RECEIPT</span>
                    <div className="text-lg font-black font-mono text-indigo-400 mt-0.5">
                      {activeReceipt.receipt_number}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Date &amp; Time: <span className="text-white font-mono">{new Date(activeReceipt.paid_at).toLocaleString("en-IN")}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Booking Reference: <strong className="text-cyan-400 font-mono">{activeReceipt.booking_id}</strong>
                    </div>
                  </div>
                </div>

                {/* Traveler & Gateway Reference Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Billed Traveler
                    </span>
                    <div className="font-bold text-white text-sm">{activeReceipt.customer.name}</div>
                    <div className="text-slate-300 text-[11px]">{activeReceipt.customer.email}</div>
                    <div className="text-slate-400 text-[11px]">{activeReceipt.customer.phone}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Razorpay Gateway &amp; Escrow Verification
                    </span>
                    <div className="text-[11px] space-y-0.5 font-mono">
                      <div>Payment ID: <span className="text-emerald-400 font-bold">{activeReceipt.payment_id}</span></div>
                      <div>Order ID: <span className="text-indigo-300">{activeReceipt.order_id}</span></div>
                      <div>Method: <span className="uppercase text-cyan-300">{activeReceipt.payment_method}</span></div>
                      <div>Signature Check: <span className="text-emerald-400 font-bold">HMAC-SHA256 (PASSED)</span></div>
                    </div>
                  </div>
                </div>

                {/* Itemized Service Table */}
                <div className="rounded-2xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[10px] uppercase font-bold">
                        <th className="p-3">Service Description</th>
                        <th className="p-3">SAC Code</th>
                        <th className="p-3 text-right">Taxable Amount</th>
                        <th className="p-3 text-right">GST Rate</th>
                        <th className="p-3 text-right">Total (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      <tr>
                        <td className="p-3 font-medium text-white">
                          <div>{activeReceipt.service_type}</div>
                          <span className="text-[10px] text-slate-500 font-mono">Ref: {activeReceipt.booking_id}</span>
                        </td>
                        <td className="p-3 font-mono text-[11px] text-slate-400">998553</td>
                        <td className="p-3 text-right font-mono">₹{activeReceipt.base_amount.toFixed(2)}</td>
                        <td className="p-3 text-right font-mono">{activeReceipt.gst_rate_pct}%</td>
                        <td className="p-3 text-right font-mono font-bold text-white">
                          ₹{activeReceipt.amount.toLocaleString("en-IN")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals Calculation */}
                <div className="flex justify-end">
                  <div className="w-full max-w-xs space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Taxable Value (Base):</span>
                      <span className="font-mono text-slate-200">₹{activeReceipt.base_amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Central GST (2.5%):</span>
                      <span className="font-mono text-cyan-400">₹{(activeReceipt.gst_amount / 2).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>State GST (2.5%):</span>
                      <span className="font-mono text-cyan-400">₹{(activeReceipt.gst_amount / 2).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-white text-base">
                      <span>Total Amount Paid:</span>
                      <span className="text-emerald-400 font-mono">₹{activeReceipt.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Security Notice */}
                <div className="pt-4 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>Nodal Escrow Protected: {activeReceipt.provider_details.nodal_account}</span>
                  </div>
                  <div>
                    This is a computer-generated statutory tax receipt stored in Supabase PostgreSQL DB.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <Printer className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Active Payment Receipt Selected</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Complete a payment in the <strong>Create &amp; Pay Flow</strong> tab, or pick any transaction from the <strong>Supabase DB Vault</strong> to view its tax receipt.
              </p>
              <button
                onClick={() => setActiveTab("create_pay")}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
              >
                Go to Payment Flow
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SUPABASE DATABASE VAULT (`razorpay_transactions`)                  */}
      {/* ========================================================================= */}
      {activeTab === "supabase_db" && (
        <div className="space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white font-mono">public.razorpay_transactions</h3>
                <span className="px-2 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                  Supabase PostgreSQL
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Real-time records written by the Supabase Edge Function upon order creation and signature verification.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search order, payment ID, traveler..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-64"
                />
              </div>

              <button
                onClick={loadTransactions}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
                title="Refresh Table"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingDb ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
                    <th className="p-3 font-mono">receipt_number</th>
                    <th className="p-3 font-mono">order_id</th>
                    <th className="p-3 font-mono">payment_id</th>
                    <th className="p-3">Service &amp; Traveler</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 font-mono">status</th>
                    <th className="p-3">Signature Verified</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.order_id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-cyan-300">{tx.receipt_number}</td>
                        <td className="p-3 font-mono text-indigo-300">{tx.order_id}</td>
                        <td className="p-3 font-mono text-emerald-400">
                          {tx.payment_id || <span className="text-slate-500 font-normal">Pending</span>}
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-white text-xs">{tx.service_type}</div>
                          <div className="text-[10px] text-slate-400">{tx.customer_name} • {tx.customer_email}</div>
                        </td>
                        <td className="p-3 font-bold text-white">
                          ₹{Number(tx.amount).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 font-mono">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              tx.status === "captured"
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : tx.status === "failed"
                                ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                        <td className="p-3">
                          {tx.signature_verified ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold">
                              <CheckCircle2 className="w-3 h-3" /> Valid HMAC
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                              <Clock className="w-3 h-3" /> Unverified
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-[11px] text-slate-400 font-mono">
                          {new Date(tx.created_at).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              const gstRate = 5;
                              const baseAmount = Math.round((tx.amount / 1.05) * 100) / 100;
                              const gstAmount = Math.round((tx.amount - baseAmount) * 100) / 100;
                              setActiveReceipt({
                                receipt_number: tx.receipt_number,
                                transaction_id: `txn_${tx.order_id}`,
                                booking_id: tx.booking_id,
                                service_type: tx.service_type,
                                payment_id: tx.payment_id || "pay_mock",
                                order_id: tx.order_id,
                                signature_verified: tx.signature_verified,
                                paid_at: tx.verified_at || tx.created_at,
                                amount: tx.amount,
                                currency: tx.currency,
                                base_amount: baseAmount,
                                gst_amount: gstAmount,
                                gst_rate_pct: gstRate,
                                convenience_fee: 0,
                                payment_method: tx.method,
                                customer: {
                                  name: tx.customer_name,
                                  email: tx.customer_email,
                                  phone: tx.customer_phone,
                                },
                                provider_details: {
                                  company_name: "BharatYatra Technologies & Pilgrimage Logistics Pvt. Ltd.",
                                  gstin: "07AAACB2201M1ZP",
                                  sac_code: "998553 (Travel Agency & Tour Operator Services)",
                                  cin: "U63040DL2026PTC392810",
                                  nodal_account: "NODAL-HDFC-9912084920 (Escrow Protected)",
                                },
                                supabase_synced: true,
                                supabase_table: "razorpay_transactions",
                              });
                              setActiveTab("receipt");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Printer className="w-3 h-3 text-indigo-400" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-500">
                        No transactions found in Supabase database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: WEBHOOK & SIGNATURE VERIFIER                                      */}
      {/* ========================================================================= */}
      {activeTab === "webhook_tester" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-400" />
                <span>Simulate Razorpay Webhook Call</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Razorpay dispatches asynchronous webhooks (e.g. <code>payment.captured</code>). The Supabase Edge Function reads <code>x-razorpay-signature</code> and verifies authenticity before writing to Supabase.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 text-xs mb-1 font-semibold">Webhook Event</label>
                <select
                  value={webhookEvent}
                  onChange={(e) => setWebhookEvent(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                >
                  <option value="payment.captured">payment.captured (Success)</option>
                  <option value="payment.failed">payment.failed (Bank Decline / Timeout)</option>
                  <option value="order.paid">order.paid (Order Settlement)</option>
                  <option value="refund.processed">refund.processed (Cancellation)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1 font-semibold">Target Order ID</label>
                <input
                  type="text"
                  value={createdOrder?.order_id || "order_DEMO_992182"}
                  readOnly
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-300 font-mono text-xs"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-purple-300">Webhook Verification Method:</div>
                <div className="text-slate-400 text-[11px]">
                  <code>HMAC_SHA256(request_body, RAZORPAY_WEBHOOK_SECRET) === header['x-razorpay-signature']</code>
                </div>
              </div>

              <button
                onClick={handleTestWebhook}
                disabled={isTestingWebhook}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isTestingWebhook ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Webhook via Edge Function...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Dispatch Webhook to Supabase Edge Function</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Edge Function Webhook Response</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Verified execution output and Supabase database update notification.
              </p>
            </div>

            {webhookResult ? (
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Signature Verified
                  </span>
                  <span className="font-mono text-[10px] text-slate-500">{webhookResult.webhook_id}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 font-mono text-[11px] text-slate-300">
                  {webhookResult.action_taken}
                </div>
                <div className="text-[11px] text-slate-400">
                  Supabase DB Updated: <strong className="text-cyan-300 font-mono">TRUE</strong> (updated_at refreshed).
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800/80 text-center text-slate-500 text-xs">
                Click "Dispatch Webhook" to execute live signature validation.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: EDGE CODE & SCHEMA                                                 */}
      {/* ========================================================================= */}
      {activeTab === "architecture" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Edge Function Code Viewer */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">
                    supabase/functions/razorpay-payment/index.ts
                  </h3>
                  <span className="text-[10px] text-slate-400">Deno Runtime • Server-Side Edge Execution</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px]">
                  Deno / TypeScript
                </span>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-[380px] leading-relaxed">
{`// 1. Read Razorpay secret securely server-side
const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET");

// 2. Verify HMAC-SHA256 signature
const expectedSignature = await hmacSha256(
  razorpayKeySecret,
  \`\${order_id}|\${payment_id}\`
);
const isValid = expectedSignature === razorpay_signature;

// 3. Write transaction to Supabase Database
await supabase.from("razorpay_transactions").upsert({
  order_id,
  payment_id,
  signature_verified: isValid,
  status: isValid ? "captured" : "failed",
  amount,
  receipt_number
});

// 4. Return verified travel receipt to React Frontend
return jsonResponse({ success: isValid, receipt });`}
              </pre>
            </div>

            {/* SQL Schema Viewer */}
            <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">
                    supabase/migrations/20260917_create_razorpay_transactions.sql
                  </h3>
                  <span className="text-[10px] text-slate-400">Supabase PostgreSQL • RLS Enabled</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                  PostgreSQL DDL
                </span>
              </div>

              <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-[380px] leading-relaxed">
{`CREATE TABLE public.razorpay_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL UNIQUE,
    payment_id TEXT UNIQUE,
    signature TEXT,
    signature_verified BOOLEAN DEFAULT FALSE,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    status VARCHAR(30) NOT NULL DEFAULT 'created',
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    booking_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    receipt_number VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    verified_at TIMESTAMPTZ
);

-- Row Level Security
ALTER TABLE public.razorpay_transactions ENABLE ROW LEVEL SECURITY;`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
