import React, { useState } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  Building,
  Wallet,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Download,
  Percent,
  TrendingUp,
  FileText,
  DollarSign,
  QrCode,
  ArrowRight,
  Sparkles,
  Lock,
  RefreshCw,
  Clock,
  ChevronRight,
  Info,
} from "lucide-react";
import {
  PAYMENT_GATEWAY_OPTIONS,
  REFUND_POLICY_MATRIX,
  FINANCIAL_REPORT_MOCK,
  PaymentMethodOption,
  RefundPolicyMatrix,
} from "../data/financeData";
import { UserProfile } from "../types";

interface PaymentFinanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
}

type FinanceSubTab = "gateways" | "invoicing" | "refunds" | "payouts" | "reports";

export function PaymentFinanceModal({
  isOpen,
  onClose,
  userProfile,
}: PaymentFinanceModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<FinanceSubTab>("gateways");
  const [selectedGateway, setSelectedGateway] = useState<string>("upi");
  const [demoAmount, setDemoAmount] = useState<number>(3490);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [simulatedTxnId, setSimulatedTxnId] = useState<string>("");

  if (!isOpen) return null;

  // GST Breakdown calculation for Demo
  const basePrice = demoAmount;
  const convenienceFee = 49;
  const gstRate = 0.05; // 5% standard GST
  const cgstAmount = Math.round((basePrice + convenienceFee) * 0.025);
  const sgstAmount = Math.round((basePrice + convenienceFee) * 0.025);
  const totalTax = cgstAmount + sgstAmount;
  const grandTotal = basePrice + convenienceFee + totalTax;

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSimulatedTxnId(`TXN-NPCI-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setPaymentSuccess(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Payment & Financial Architecture</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black uppercase">
                  PCI-DSS Level 1 & RBI Regulated
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Multi-Gateway Routing, Zero-Surcharge UPI, 18% GST Input Tax Credits & Automated Payouts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub Navigation Bar */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("gateways")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "gateways"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Payment Gateways (UPI/Cards/Netbanking)</span>
          </button>

          <button
            onClick={() => setActiveSubTab("invoicing")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "invoicing"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>GST Tax Invoicing & SAC Codes</span>
          </button>

          <button
            onClick={() => setActiveSubTab("refunds")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "refunds"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refund Engine & Slabs</span>
          </button>

          <button
            onClick={() => setActiveSubTab("payouts")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "payouts"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Partner Settlements & TDS</span>
          </button>

          <button
            onClick={() => setActiveSubTab("reports")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === "reports"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Executive Finance Ledger</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {/* 1. PAYMENT GATEWAYS SIMULATOR */}
          {activeSubTab === "gateways" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left 2 Cols: Method Selector */}
                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Select Payment Gateway Rail
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PAYMENT_GATEWAY_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedGateway(opt.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          selectedGateway === opt.id
                            ? "bg-emerald-50/60 border-emerald-500 shadow-sm ring-1 ring-emerald-500"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-extrabold text-slate-900">{opt.name}</span>
                          {opt.badge && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[9px] font-black uppercase">
                              {opt.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500">{opt.subtext}</p>
                      </button>
                    ))}
                  </div>

                  {/* Provider Specific Box */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 mt-4">
                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                      Selected Channel Verification
                    </h5>

                    {selectedGateway === "upi" && (
                      <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="w-16 h-16 bg-white p-1 rounded-lg border border-slate-300 flex items-center justify-center shrink-0">
                          <QrCode className="w-12 h-12 text-slate-800" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-900">Dynamic NPCI UPI QR & Intent</p>
                          <p className="text-[11px] text-slate-500">
                            Scan with Google Pay, PhonePe, Paytm or enter UPI ID: <span className="font-mono font-bold text-indigo-600">user@okhdfcbank</span>
                          </p>
                          <span className="inline-block px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                            Zero Payment Surcharge
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedGateway === "cards" && (
                      <div className="space-y-2 text-xs">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                          <span className="font-mono text-slate-700">•••• •••• •••• 4092 (HDFC Millennia RuPay)</span>
                          <span className="font-bold text-emerald-600">Verified Token</span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          3D Secure OTP authentication enabled with RBI card tokenization.
                        </p>
                      </div>
                    )}

                    {selectedGateway === "wallet" && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-emerald-900">BharatYatra Cash + YatraCoins</p>
                          <p className="text-[11px] text-emerald-700">Available: ₹{userProfile.walletBalance} ({userProfile.yatraCoins} Coins)</p>
                        </div>
                        <span className="px-2 py-1 rounded bg-emerald-600 text-white font-bold text-[10px]">
                          1-Click Instant Debit
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Col: Checkout Summary & Trigger */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Payment Fare Breakdown
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Ticket / Fare:</span>
                      <span className="font-semibold text-slate-900">₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Platform Convenience Fee:</span>
                      <span className="font-semibold text-slate-900">₹{convenienceFee}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST (CGST 2.5% + SGST 2.5%):</span>
                      <span className="font-semibold text-slate-900">₹{totalTax}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                      <span>Grand Total:</span>
                      <span className="text-emerald-600 text-base font-extrabold">₹{grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  {!paymentSuccess ? (
                    <button
                      onClick={handleSimulatePayment}
                      disabled={isProcessing}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Verifying Bank Gateway...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" /> Pay ₹{grandTotal.toLocaleString("en-IN")} Securely
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1 animate-in fade-in">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="text-xs font-bold text-emerald-900">Payment Verified & Settled!</p>
                      <p className="text-[10px] font-mono text-emerald-700">{simulatedTxnId}</p>
                    </div>
                  )}

                  <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" /> 256-Bit SSL Encrypted & Bank Grade
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 2. GST TAX INVOICE & SAC CODES */}
          {activeSubTab === "invoicing" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Official GST Tax Invoice Preview</h4>
                  <p className="text-xs text-slate-500">Compliant with Section 31 of CGST Act & Rule 46 with verifiable IRN</p>
                </div>
                <button
                  onClick={() => alert("GST Tax Invoice PDF generated and downloaded!")}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Tax Invoice PDF
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-4 text-xs">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-base font-black text-indigo-900">BHARATYATRA TECHNOLOGIES INDIA PVT LTD</h3>
                    <p className="text-slate-500">Connaught Place, New Delhi - 110001</p>
                    <p className="text-slate-600 font-bold mt-1">GSTIN: 07AAACB9921M1Z5</p>
                    <p className="text-slate-500">State: Delhi (07) • PAN: AAACB9921M</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 rounded bg-slate-100 font-mono font-bold text-slate-800">
                      TAX INVOICE
                    </span>
                    <p className="text-slate-600 font-mono mt-1">Invoice: INV-2026-8842</p>
                    <p className="text-slate-500">Date: 28 Aug 2026</p>
                    <p className="text-emerald-600 font-bold">IRN: 88f7a912b...c41e</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Billed To (Customer):</p>
                    <p className="font-bold text-slate-900">{userProfile.name}</p>
                    <p className="text-slate-600">{userProfile.email} • {userProfile.phone}</p>
                    {userProfile.gstNumber && (
                      <p className="font-bold text-indigo-700 mt-1">GSTIN: {userProfile.gstNumber}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Service Classification:</p>
                    <p className="font-bold text-slate-900">SAC Code: 996411 (Passenger Air & Rail Transport)</p>
                    <p className="text-slate-600">Place of Supply: Delhi (07) • Nature: Intra-state (CGST + SGST)</p>
                  </div>
                </div>

                <table className="w-full text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2">Description</th>
                      <th className="p-2">SAC</th>
                      <th className="p-2 text-right">Taxable Value</th>
                      <th className="p-2 text-right">CGST (2.5%)</th>
                      <th className="p-2 text-right">SGST (2.5%)</th>
                      <th className="p-2 text-right">Total (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="p-2 font-semibold">Travel Reservation Booking Fare</td>
                      <td className="p-2 font-mono">996411</td>
                      <td className="p-2 text-right font-mono">₹3,490.00</td>
                      <td className="p-2 text-right font-mono">₹87.25</td>
                      <td className="p-2 text-right font-mono">₹87.25</td>
                      <td className="p-2 text-right font-bold text-slate-900 font-mono">₹3,664.50</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-semibold">Online Platform Convenience Fee</td>
                      <td className="p-2 font-mono">998599</td>
                      <td className="p-2 text-right font-mono">₹49.00</td>
                      <td className="p-2 text-right font-mono">₹4.41 (9%)</td>
                      <td className="p-2 text-right font-mono">₹4.41 (9%)</td>
                      <td className="p-2 text-right font-bold text-slate-900 font-mono">₹57.82</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. REFUND ENGINE & SLABS */}
          {activeSubTab === "refunds" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Instant Refund Engine & Deductions Matrix</h4>
                <p className="text-xs text-slate-500">Transparent cancellation rules with instant BharatYatra wallet credits</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {REFUND_POLICY_MATRIX.map((rf, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 uppercase text-xs tracking-wider">
                        {rf.service} Cancellation Rule
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                        Instant Wallet Refund
                      </span>
                    </div>
                    <p className="text-xs text-slate-600"><span className="font-bold">Window:</span> {rf.cancellationWindow}</p>
                    <p className="text-xs text-slate-600"><span className="font-bold">Deduction:</span> {rf.deductionFormula}</p>
                    <div className="p-2.5 rounded-xl bg-slate-50 text-[11px] text-emerald-700 font-semibold space-y-0.5">
                      <p>● Wallet: {rf.instantWalletBonus}</p>
                      <p>● Bank Account: {rf.bankCreditTimeline}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. PARTNER SETTLEMENTS & TDS */}
          {activeSubTab === "payouts" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Automated Partner Payouts & Escrow Ledger</h4>
                <p className="text-xs text-slate-500">T+0 and T+1 automated payouts via HDFC Escrow with statutory 1% TDS deduction</p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-slate-500 text-[10px]">Total Disbursed This Month</p>
                    <p className="text-base font-bold text-emerald-600">₹76.24 Cr</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-slate-500 text-[10px]">TDS u/s 194-O Deposited</p>
                    <p className="text-base font-bold text-indigo-600">₹76.24 Lakhs</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-slate-500 text-[10px]">Next Scheduled Batch</p>
                    <p className="text-base font-bold text-slate-800">Today 06:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. EXECUTIVE FINANCIAL REPORTS */}
          {activeSubTab === "reports" && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Executive Financial Statement (FY 2026-27)</h4>
                <p className="text-xs text-slate-500">Quarterly GMV, Gross Margin, and Net Revenue yield</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 text-xs">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-slate-400">Total Bookings Volume</p>
                    <p className="text-lg font-bold text-slate-900">14.28 Lakhs</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Platform GMV</p>
                    <p className="text-lg font-bold text-emerald-600">₹84.62 Cr</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Net Operating Margin</p>
                    <p className="text-lg font-bold text-indigo-600">₹5.89 Cr</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Net Take Rate</p>
                    <p className="text-lg font-bold text-amber-600">6.96%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
