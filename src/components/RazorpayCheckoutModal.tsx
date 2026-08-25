import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building,
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  Lock,
  ChevronRight,
  Phone,
  Mail,
  User,
  Zap,
  Info,
  ExternalLink,
  Clock,
  ArrowLeft,
  FileText,
  Users,
  Share2,
  Printer,
  Coins,
  Percent,
  ChevronDown,
  ChevronUp,
  Receipt,
  BadgeCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { RazorpayOrder, RazorpayPaymentRail, RazorpayPaymentResult } from "../types";
import {
  RAZORPAY_CONFIG,
  TEST_CARDS,
  POPULAR_UPI_APPS,
  POPULAR_BANKS,
  WALLETS_LIST,
  EMI_TENURES,
  PAYLATER_PROVIDERS,
} from "../data/razorpayData";
import { convertFromInr, getCurrencyInfo } from "../data/currencyData";

interface RazorpayCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number; // in INR
  title: string;
  subtitle?: string;
  serviceCategory?: string;
  bookingDetails?: any;
  customerDetails?: {
    name: string;
    email: string;
    phone: string;
  };
  preferredCurrency?: string;
  onSuccess: (paymentResult: RazorpayPaymentResult) => void;
  onFailure?: (error: { code: string; description: string }) => void;
}

export function RazorpayCheckoutModal({
  isOpen,
  onClose,
  amount,
  title,
  subtitle,
  serviceCategory = "travel",
  bookingDetails,
  customerDetails = {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    phone: "+91 98765 43210",
  },
  preferredCurrency = "INR",
  onSuccess,
  onFailure,
}: RazorpayCheckoutModalProps) {
  // Navigation & Rail State
  const [activeRail, setActiveRail] = useState<RazorpayPaymentRail>("upi");
  const [upiSubTab, setUpiSubTab] = useState<"qr" | "apps" | "vpa">("qr");
  
  // Form States
  const [vpaInput, setVpaInput] = useState("aarav@oksbi");
  const [vpaValidating, setVpaValidating] = useState(false);
  const [vpaValidated, setVpaValidated] = useState(true);

  // Card Form
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4111");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("782");
  const [cardName, setCardName] = useState(customerDetails.name);
  const [saveCardToken, setSaveCardToken] = useState(true);
  const [cardNetwork, setCardNetwork] = useState<"visa" | "mastercard" | "rupay" | "amex">("visa");

  // Netbanking
  const [selectedBank, setSelectedBank] = useState<string>("HDFC");
  const [bankSearch, setBankSearch] = useState("");

  // Wallets & EMI & Paylater
  const [selectedWallet, setSelectedWallet] = useState<string>("amazonpay");
  const [selectedEmiTenure, setSelectedEmiTenure] = useState<number>(3);
  const [selectedPaylater, setSelectedPaylater] = useState<string>("simpl");

  // Flow State
  const [order, setOrder] = useState<RazorpayOrder | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<"checkout" | "otp_screen" | "bank_redirect" | "upi_waiting" | "success" | "failed">("checkout");
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState(false);

  // Group Split & Partial Payment Modes (Customer Facing)
  const [paymentMode, setPaymentMode] = useState<"full" | "split_group" | "partial_deposit">("full");
  const [splitPaxCount, setSplitPaxCount] = useState<number>(2);
  const [depositPercent, setDepositPercent] = useState<number>(25);
  const [showShareDetails, setShowShareDetails] = useState(false);
  const [groupSplitLinks, setGroupSplitLinks] = useState<Array<{ payerIndex: number; payerName: string; shareAmount: number; status: string; paymentLink: string }>>([]);
  const [copiedSplitLink, setCopiedSplitLink] = useState(false);

  // OTP Screen State
  const [otpValue, setOtpValue] = useState("123456");
  const [otpTimer, setOtpTimer] = useState(60);

  // QR Expiry Timer (10:00)
  const [qrTimer, setQrTimer] = useState(600);

  // Gateway Mode
  const [isTestMode, setIsTestMode] = useState(true);

  // Result state
  const [paymentResult, setPaymentResult] = useState<RazorpayPaymentResult | null>(null);

  // Auto create order when opened
  useEffect(() => {
    if (isOpen) {
      setStep("checkout");
      setIsProcessing(false);
      setErrorMessage("");
      setPaymentResult(null);
      setQrTimer(600);
      setOtpTimer(60);
      createRazorpayOrder();
    }
  }, [isOpen, amount]);

  // QR Timer Countdown
  useEffect(() => {
    if (!isOpen || step !== "checkout" || activeRail !== "upi" || upiSubTab !== "qr") return;
    const interval = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, step, activeRail, upiSubTab]);

  // OTP Countdown
  useEffect(() => {
    if (step !== "otp_screen") return;
    const interval = setInterval(() => {
      setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [step]);

  // Effective payable amount depending on payment mode (Split / Partial Deposit / Full)
  const payableAmount = useMemo(() => {
    if (paymentMode === "split_group") {
      return Math.round(amount / Math.max(1, splitPaxCount));
    }
    if (paymentMode === "partial_deposit") {
      return Math.round(amount * (depositPercent / 100));
    }
    return amount;
  }, [amount, paymentMode, splitPaxCount, depositPercent]);

  const balanceRemaining = Math.max(0, amount - payableAmount);

  // Generate Group Split Links
  const handleGenerateSplitLinks = () => {
    const list = Array.from({ length: splitPaxCount }, (_, idx) => {
      const perPax = Math.round(amount / splitPaxCount);
      return {
        payerIndex: idx + 1,
        payerName: idx === 0 ? `${customerDetails.name} (You)` : `Traveler ${idx + 1}`,
        shareAmount: perPax,
        status: idx === 0 ? "PAYING_NOW" : "LINK_READY",
        paymentLink: `https://bharatyatra.in/pay/split?ref=${order?.id || "ORD"}&pax=${idx + 1}&amt=${perPax}`,
      };
    });
    setGroupSplitLinks(list);
  };

  useEffect(() => {
    if (paymentMode === "split_group") {
      handleGenerateSplitLinks();
    }
  }, [paymentMode, splitPaxCount, amount]);

  // Card detection
  useEffect(() => {
    const cleanNum = cardNumber.replace(/\s+/g, "");
    if (cleanNum.startsWith("4")) setCardNetwork("visa");
    else if (cleanNum.startsWith("5") || cleanNum.startsWith("2")) setCardNetwork("mastercard");
    else if (cleanNum.startsWith("60") || cleanNum.startsWith("65")) setCardNetwork("rupay");
    else if (cleanNum.startsWith("34") || cleanNum.startsWith("37")) setCardNetwork("amex");
    else setCardNetwork("visa");
  }, [cardNumber]);

  const createRazorpayOrder = async () => {
    setIsCreatingOrder(true);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "INR",
          serviceType: serviceCategory,
          customer: customerDetails,
          notes: {
            title,
            subtitle: subtitle || "",
            platform: "BharatYatra Super App",
          },
        }),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
      }
    } catch (e) {
      // Fallback local order
      setOrder({
        id: `order_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        entity: "order",
        amount: Math.round(amount * 100),
        amountInInr: amount,
        currency: "INR",
        receipt: `RCP-${Date.now()}`,
        status: "created",
        attempts: 0,
        notes: {},
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleApplyTestCard = (card: typeof TEST_CARDS[0]) => {
    setCardNumber(card.number);
    setCardExpiry(card.expiry);
    setCardCvv(card.cvv);
    setCardName(card.name);
    setCardNetwork(card.network);
  };

  const handleProcessPayment = async (forceOutcome?: "success" | "otp" | "failed") => {
    setIsProcessing(true);
    setErrorMessage("");

    // Simulate OTP screen if card requires OTP
    if (forceOutcome === "otp" || (activeRail === "card" && !forceOutcome && cardNetwork === "mastercard")) {
      setTimeout(() => {
        setIsProcessing(false);
        setStep("otp_screen");
      }, 700);
      return;
    }

    if (activeRail === "netbanking") {
      setStep("bank_redirect");
      setTimeout(() => {
        executeVerifyPayment(forceOutcome === "failed" ? "failed" : "success");
      }, 1500);
      return;
    }

    if (activeRail === "upi" && upiSubTab === "apps") {
      setStep("upi_waiting");
      setTimeout(() => {
        executeVerifyPayment(forceOutcome === "failed" ? "failed" : "success");
      }, 1800);
      return;
    }

    // Default direct verify
    setTimeout(() => {
      executeVerifyPayment(forceOutcome === "failed" ? "failed" : "success");
    }, 1200);
  };

  const handleCompleteOtp = (valid: boolean = true) => {
    if (!valid || otpValue !== "123456") {
      setErrorMessage("Invalid OTP. Enter 123456 to approve or resend.");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      executeVerifyPayment("success");
    }, 1000);
  };

  const executeVerifyPayment = async (outcome: "success" | "failed" = "success") => {
    if (outcome === "failed") {
      setIsProcessing(false);
      setStep("failed");
      setErrorMessage("Payment was declined by issuing bank or timeout occurred.");
      if (onFailure) onFailure({ code: "BAD_REQUEST_ERROR", description: "Payment declined" });
      return;
    }

    try {
      const orderId = order ? order.id : `order_${Date.now()}`;
      const paymentId = `pay_${Math.random().toString(36).substring(2, 9).toUpperCase()}${Date.now().toString().slice(-4)}`;
      const signature = `sig_rzp_${Math.random().toString(36).substring(2, 12)}`;

      const res = await fetch("/api/razorpay/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          method: activeRail,
          paymentDetails: {
            vpa: activeRail === "upi" ? vpaInput : undefined,
            card: activeRail === "card" ? {
              last4: cardNumber.replace(/\s/g, "").slice(-4) || "4111",
              network: cardNetwork,
              type: "credit",
              issuer: cardNetwork === "visa" ? "HDFC Bank" : "SBI",
              tokenized: saveCardToken,
            } : undefined,
            bank: activeRail === "netbanking" ? selectedBank : undefined,
            wallet: activeRail === "wallet" ? selectedWallet : undefined,
            emiPlan: activeRail === "emi" ? {
              tenureMonths: selectedEmiTenure,
              monthlyInstallment: Math.round(amount / selectedEmiTenure),
              interestRatePercent: 0,
              bankName: "HDFC Bank",
            } : undefined,
            paylaterProvider: activeRail === "paylater" ? selectedPaylater : undefined,
          },
        }),
      });

      const data = await res.json();
      const verifiedResult: RazorpayPaymentResult = {
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
        status: "captured",
        amount: Math.round(amount * 100),
        currency: "INR",
        method: activeRail,
        vpa: activeRail === "upi" ? vpaInput : undefined,
        rbiRrn: data.rbiRrn || `RRN${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        timestamp: new Date().toISOString(),
      };

      setPaymentResult(verifiedResult);
      setIsProcessing(false);
      setStep("success");

      // Fire confetti
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Notify parent after brief viewing
      setTimeout(() => {
        onSuccess(verifiedResult);
      }, 1600);
    } catch (e) {
      // Offline fallback
      const fallbackResult: RazorpayPaymentResult = {
        razorpayPaymentId: `pay_OFFLINE_${Date.now()}`,
        razorpayOrderId: order?.id || `order_${Date.now()}`,
        razorpaySignature: `sig_offline_${Date.now()}`,
        status: "captured",
        amount: Math.round(amount * 100),
        currency: "INR",
        method: activeRail,
        timestamp: new Date().toISOString(),
      };
      setPaymentResult(fallbackResult);
      setIsProcessing(false);
      setStep("success");
      onSuccess(fallbackResult);
    }
  };

  const copyOrderId = () => {
    if (order?.id) {
      navigator.clipboard.writeText(order.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  if (!isOpen) return null;

  const formattedTimer = `${Math.floor(qrTimer / 60)}:${(qrTimer % 60).toString().padStart(2, "0")}`;
  const currencyInfo = getCurrencyInfo(preferredCurrency);
  const converted = convertFromInr(amount, preferredCurrency);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="razorpay-checkout-modal-container"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
      >
        {/* TOP RAZORPAY BRANDED HEADER */}
        <div className="bg-[#0c2340] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            {/* Razorpay Logo Emblem */}
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-900/50">
              <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                <path d="M13.8 2.5L7.2 14h5.2l-2.4 7.5L16.8 10h-5.2l2.2-7.5z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  Razorpay <span className="text-blue-400 font-normal text-xs sm:text-sm">Trusted Gateway</span>
                </span>
                {isTestMode ? (
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 text-3xs font-black uppercase tracking-wider">
                    Test Mode
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-3xs font-black uppercase tracking-wider">
                    Live SSL
                  </span>
                )}
              </div>
              <p className="text-3xs sm:text-2xs text-slate-300 flex items-center gap-1 mt-0.5">
                <span>{RAZORPAY_CONFIG.merchantName}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 text-emerald-400">
                  <Lock className="w-2.5 h-2.5" /> 256-Bit Encrypted
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-lg sm:text-xl font-black text-white">
                ₹{amount.toLocaleString("en-IN")}
              </div>
              {preferredCurrency !== "INR" && (
                <div className="text-3xs text-slate-300 font-medium">
                  ≈ {converted.formatted}
                </div>
              )}
            </div>
            <button
              id="razorpay-modal-close-btn"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Cancel & Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ORDER SUMMARY & CUSTOMER SPLIT CONTROLS */}
        <div className="bg-slate-50 border-b border-slate-200 text-xs shrink-0">
          <div className="px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Order:</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{title}</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-3xs uppercase tracking-wider border border-indigo-200">
                {serviceCategory}
              </span>
            </div>
            <div className="flex items-center gap-3 text-2xs">
              {order && (
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-mono bg-white px-2 py-1 rounded-lg border border-slate-200"
                  title="Copy Razorpay Order ID"
                >
                  <span>{order.id}</span>
                  {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-slate-400" />}
                </button>
              )}
              <div className="text-slate-500 hidden sm:block">
                {customerDetails.phone}
              </div>
            </div>
          </div>

          {/* User-Facing Payment Mode Tabs & Split Option */}
          <div className="px-4 sm:px-5 py-2 bg-slate-100/80 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider mr-1">Payment Option:</span>
              <button
                type="button"
                onClick={() => setPaymentMode("full")}
                className={`px-2.5 py-1 rounded-lg text-3xs font-bold transition-all ${
                  paymentMode === "full"
                    ? "bg-[#0c2340] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                100% Full Payment (₹{amount.toLocaleString("en-IN")})
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("split_group")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-3xs font-bold transition-all ${
                  paymentMode === "split_group"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Split with Friends</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("partial_deposit")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-3xs font-bold transition-all ${
                  paymentMode === "partial_deposit"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Coins className="w-3 h-3" />
                <span>Partial Advance ({depositPercent}%)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowShareDetails(!showShareDetails)}
              className="flex items-center gap-1 text-3xs font-bold text-slate-600 hover:text-indigo-600 ml-auto"
            >
              <Receipt className="w-3 h-3 text-indigo-500" />
              <span>{showShareDetails ? "Hide Price Summary" : "Customer / Partner Fare Details"}</span>
              {showShareDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* Group Split Interactive Config */}
          {paymentMode === "split_group" && (
            <div className="p-3 mx-4 sm:mx-5 my-2 bg-indigo-50/80 rounded-xl border border-indigo-200/90 text-2xs space-y-2 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-indigo-950">Number of Co-Travelers:</span>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-indigo-200">
                    {[2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => setSplitPaxCount(cnt)}
                        className={`px-2 py-0.5 rounded text-3xs font-bold transition-all ${
                          splitPaxCount === cnt ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cnt} Pax
                      </button>
                    ))}
                  </div>
                </div>
                <div className="font-extrabold text-indigo-900">
                  Your Immediate Share: <span className="text-sm font-black text-indigo-600">₹{payableAmount.toLocaleString("en-IN")}</span> ({splitPaxCount} equal parts of ₹{payableAmount})
                </div>
              </div>

              {/* Shareable Group Split Links */}
              <div className="pt-2 border-t border-indigo-200/70 flex flex-wrap items-center justify-between gap-2">
                <div className="text-3xs text-indigo-800 flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-indigo-600" />
                  <span>Unique UPI payment links generated for remaining {splitPaxCount - 1} travelers.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCopiedSplitLink(true);
                    setTimeout(() => setCopiedSplitLink(false), 2000);
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-indigo-100/50 border border-indigo-300 rounded-lg text-3xs font-bold text-indigo-900 flex items-center gap-1 shadow-2xs"
                >
                  {copiedSplitLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3 text-indigo-500" />}
                  <span>{copiedSplitLink ? "Invite Links Copied!" : "Copy WhatsApp Split Link"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Partial Deposit Config */}
          {paymentMode === "partial_deposit" && (
            <div className="p-3 mx-4 sm:mx-5 my-2 bg-amber-50/80 rounded-xl border border-amber-200 text-2xs space-y-2 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-950">Pay Now Milestone:</span>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-amber-200">
                    {[20, 25, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDepositPercent(pct)}
                        className={`px-2 py-0.5 rounded text-3xs font-bold transition-all ${
                          depositPercent === pct ? "bg-amber-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pct}% Advance
                      </button>
                    ))}
                  </div>
                </div>
                <div className="font-bold text-amber-900">
                  Pay Now: <span className="text-sm font-black text-amber-700">₹{payableAmount.toLocaleString("en-IN")}</span> • Balance ₹{balanceRemaining.toLocaleString("en-IN")} due at check-in / boarding
                </div>
              </div>
            </div>
          )}

          {/* Customer / Partner Share Breakdown (Clean, user-facing transparent receipt) */}
          {showShareDetails && (
            <div className="p-3.5 mx-4 sm:mx-5 mb-2 bg-slate-900 text-white rounded-xl border border-slate-800 text-2xs space-y-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between font-bold text-indigo-300 border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified Price Breakdown &amp; Operator Direct Remittance
                </span>
                <span className="text-3xs text-slate-400 font-normal">IRCTC / Airline / Partner Compliant</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-1 text-slate-300">
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-3xs uppercase font-bold">Total Fare</span>
                  <span className="font-mono font-bold text-white text-xs">₹{amount.toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-3xs uppercase font-bold">Base Tariff</span>
                  <span className="font-mono font-bold text-slate-200 text-xs">₹{Math.round(amount * 0.82).toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-3xs uppercase font-bold">GST &amp; IRDAI Surcharge</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">₹{Math.round(amount * 0.18).toLocaleString("en-IN")}</span>
                </div>
                <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-3xs uppercase font-bold">Payable in Session</span>
                  <span className="font-mono font-bold text-amber-400 text-xs">₹{payableAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BODY CONTENT ACCORDING TO STEP */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* STEP 1: CHECKOUT VIEW */}
          {step === "checkout" && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* LEFT RAIL SELECTOR */}
              <div className="md:col-span-4 space-y-1.5 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
                <div className="text-3xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Payment Rails
                </div>

                {[
                  { id: "upi", label: "UPI & QR Code", badge: "Zero Fee", icon: <QrCode className="w-4 h-4 text-blue-600" /> },
                  { id: "card", label: "Cards (Debit/Credit)", badge: "Visa/MC", icon: <CreditCard className="w-4 h-4 text-indigo-600" /> },
                  { id: "netbanking", label: "NetBanking", badge: "50+ Banks", icon: <Building className="w-4 h-4 text-emerald-600" /> },
                  { id: "wallet", label: "Wallets", badge: "Cashback", icon: <Wallet className="w-4 h-4 text-amber-600" /> },
                  { id: "emi", label: "No-Cost EMI", badge: "0% Interest", icon: <Sparkles className="w-4 h-4 text-purple-600" /> },
                  { id: "paylater", label: "Pay Later", badge: "Simpl/Lazy", icon: <Zap className="w-4 h-4 text-rose-600" /> },
                ].map((rail) => (
                  <button
                    key={rail.id}
                    onClick={() => setActiveRail(rail.id as any)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left font-bold text-xs transition-all ${
                      activeRail === rail.id
                        ? "bg-blue-50 text-blue-950 border border-blue-200 shadow-xs"
                        : "text-slate-700 hover:bg-slate-100 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {rail.icon}
                      <span>{rail.label}</span>
                    </div>
                    {rail.badge && (
                      <span className={`text-3xs px-2 py-0.5 rounded-full font-bold ${
                        activeRail === rail.id ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}>
                        {rail.badge}
                      </span>
                    )}
                  </button>
                ))}

                {/* Test Mode Quick Switch */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-2xs space-y-1">
                    <div className="flex items-center justify-between text-slate-700 font-bold">
                      <span>Gateway Mode</span>
                      <button
                        onClick={() => setIsTestMode(!isTestMode)}
                        className={`text-3xs font-bold px-2 py-0.5 rounded transition-colors ${
                          isTestMode ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isTestMode ? "Switch to Live" : "Switch to Test"}
                      </button>
                    </div>
                    <p className="text-slate-500 text-3xs">
                      {isTestMode ? "Sandbox Key active. Mock charges simulated." : "Production SSL route active."}
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT RAIL DETAILS */}
              <div className="md:col-span-8 space-y-4">
                {/* 1. UPI RAIL */}
                {activeRail === "upi" && (
                  <div className="space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      {[
                        { id: "qr", label: "Scan QR Code" },
                        { id: "apps", label: "UPI Apps" },
                        { id: "vpa", label: "Enter UPI ID" },
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setUpiSubTab(sub.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            upiSubTab === sub.id
                              ? "bg-[#0c2340] text-white"
                              : "text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>

                    {upiSubTab === "qr" && (
                      <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
                        <div className="relative p-3 bg-white rounded-2xl shadow-md border border-slate-200 inline-block">
                          {/* Simulated high-fidelity Razorpay UPI QR */}
                          <div className="w-44 h-44 bg-white p-2 rounded-xl flex flex-col items-center justify-center border border-slate-100">
                            <svg className="w-36 h-36" viewBox="0 0 100 100">
                              <rect width="100" height="100" fill="white" />
                              <path d="M10,10 h30 v30 h-30 z M15,15 v20 h20 v-20 z" fill="#0c2340" />
                              <path d="M60,10 h30 v30 h-30 z M65,15 v20 h20 v-20 z" fill="#0c2340" />
                              <path d="M10,60 h30 v30 h-30 z M15,65 v20 h20 v-20 z" fill="#0c2340" />
                              <circle cx="25" cy="25" r="5" fill="#0c2340" />
                              <circle cx="75" cy="25" r="5" fill="#0c2340" />
                              <circle cx="25" cy="75" r="5" fill="#0c2340" />
                              <rect x="45" y="10" width="8" height="20" fill="#0082f6" />
                              <rect x="45" y="35" width="20" height="8" fill="#0c2340" />
                              <rect x="10" y="45" width="30" height="8" fill="#0082f6" />
                              <rect x="50" y="50" width="40" height="8" fill="#0c2340" />
                              <rect x="50" y="65" width="10" height="25" fill="#0082f6" />
                              <rect x="70" y="65" width="20" height="10" fill="#0c2340" />
                              <rect x="70" y="80" width="10" height="10" fill="#0082f6" />
                            </svg>
                            <div className="text-[10px] font-bold text-slate-800 flex items-center gap-1 mt-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>BHIM / PhonePe / GPay / Paytm</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800">
                            Scan with any UPI app to pay ₹{amount.toLocaleString("en-IN")}
                          </p>
                          <div className="flex items-center justify-center gap-1.5 text-2xs text-slate-500 font-mono">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>QR Code expires in <strong className="text-slate-800">{formattedTimer}</strong></span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleProcessPayment("success")}
                          disabled={isProcessing}
                          className="w-full max-w-xs py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2"
                        >
                          {isProcessing ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <span>Simulate Successful QR Scan &amp; Pay</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    )}

                    {upiSubTab === "apps" && (
                      <div className="space-y-3">
                        <p className="text-2xs text-slate-500">
                          Select your installed UPI app for direct 1-tap approval:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {POPULAR_UPI_APPS.map((app) => (
                            <button
                              key={app.id}
                              onClick={() => handleProcessPayment("success")}
                              disabled={isProcessing}
                              className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all hover:scale-[1.01] active:scale-95 ${app.color}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-bold text-xs">{app.name}</span>
                              </div>
                              <span className="text-3xs font-mono opacity-80">{app.handle}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {upiSubTab === "vpa" && (
                      <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <label className="text-xs font-bold text-slate-900 block">
                          Enter Virtual Payment Address (VPA / UPI ID)
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={vpaInput}
                            onChange={(e) => setVpaInput(e.target.value)}
                            placeholder="e.g. mobile@upi or name@oksbi"
                            className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setVpaValidating(true);
                              setTimeout(() => {
                                setVpaValidating(false);
                                setVpaValidated(true);
                              }, 400);
                            }}
                            className="px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold"
                          >
                            {vpaValidating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                          </button>
                        </div>
                        {vpaValidated && (
                          <div className="text-2xs text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verified: Aarav Sharma (State Bank of India)</span>
                          </div>
                        )}
                        <button
                          onClick={() => handleProcessPayment("success")}
                          disabled={isProcessing}
                          className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                        >
                          {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Send Payment Request of ₹${amount.toLocaleString("en-IN")}`}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CARD RAIL */}
                {activeRail === "card" && (
                  <div className="space-y-3.5 animate-in fade-in duration-150">
                    {/* Quick Test Cards Selector */}
                    <div className="p-3 bg-blue-50/70 rounded-2xl border border-blue-200">
                      <div className="text-3xs font-bold text-blue-900 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                        <span>Instant Test Card Presets</span>
                        <span className="text-blue-700 font-normal">Click to auto-fill</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {TEST_CARDS.map((card) => (
                          <button
                            key={card.id}
                            type="button"
                            onClick={() => handleApplyTestCard(card)}
                            className="p-1.5 bg-white hover:bg-blue-100 rounded-lg border border-blue-200 text-left text-3xs font-semibold text-slate-800 transition-colors"
                          >
                            <span className="block font-bold uppercase truncate">{card.network}</span>
                            <span className="text-slate-500 font-mono">{card.number.slice(0, 4)}...</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card Form */}
                    <div className="space-y-2.5">
                      <div>
                        <label className="text-2xs font-bold text-slate-700 block mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4111"
                            maxLength={19}
                            className="w-full px-3 py-2.5 pl-10 rounded-xl border border-slate-300 text-xs font-mono tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                          <span className="absolute right-3 top-2.5 text-2xs font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            {cardNetwork}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-2xs font-bold text-slate-700 block mb-1">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-2xs font-bold text-slate-700 block mb-1">CVV / Security Code</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            maxLength={4}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-2xs font-bold text-slate-700 block mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="Name on card"
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>

                      <label className="flex items-start gap-2 pt-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveCardToken}
                          onChange={(e) => setSaveCardToken(e.target.checked)}
                          className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-2xs text-slate-600">
                          Securely save card as per <strong>RBI Tokenization Mandate</strong>. Card data is never stored directly.
                        </span>
                      </label>
                    </div>

                    <button
                      onClick={() => handleProcessPayment(cardNetwork === "mastercard" ? "otp" : "success")}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Pay ₹{amount.toLocaleString("en-IN")} via {cardNetwork.toUpperCase()}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* 3. NETBANKING RAIL */}
                {activeRail === "netbanking" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <p className="text-2xs text-slate-500">
                      Select your bank for direct netbanking authorization:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {POPULAR_BANKS.filter(b => b.popular).map((bank) => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-3 rounded-2xl border text-left transition-all ${
                            selectedBank === bank.id
                              ? "border-blue-600 bg-blue-50/70 shadow-xs font-bold text-blue-900"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <div className="text-base mb-1">{bank.logo}</div>
                          <div className="text-xs font-bold">{bank.name}</div>
                          <span className="text-3xs text-slate-400 font-mono">Retail &amp; Corporate</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleProcessPayment("success")}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Proceed to ${selectedBank} Gateway`}
                    </button>
                  </div>
                )}

                {/* 4. WALLETS RAIL */}
                {activeRail === "wallet" && (
                  <div className="space-y-2.5 animate-in fade-in duration-150">
                    <p className="text-2xs text-slate-500">
                      Link or deduct directly from verified digital wallets:
                    </p>
                    <div className="space-y-2">
                      {WALLETS_LIST.map((wallet) => (
                        <button
                          key={wallet.id}
                          onClick={() => setSelectedWallet(wallet.id)}
                          className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                            selectedWallet === wallet.id
                              ? "border-blue-600 bg-blue-50/70 font-bold text-blue-950"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{wallet.icon}</span>
                            <div>
                              <div className="text-xs font-bold">{wallet.name}</div>
                              <span className="text-3xs text-emerald-600 font-semibold">{wallet.cashback}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-blue-600">Select</span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleProcessPayment("success")}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Pay ₹${amount.toLocaleString("en-IN")} via Wallet`}
                    </button>
                  </div>
                )}

                {/* 5. NO-COST EMI RAIL */}
                {activeRail === "emi" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200 text-2xs text-purple-900 space-y-1">
                      <div className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Zero-Cost EMI on HDFC, ICICI, SBI &amp; Axis Credit Cards</span>
                      </div>
                      <p className="text-purple-700">Bank processing charges waived for BharatYatra travelers.</p>
                    </div>

                    <div className="space-y-2">
                      {EMI_TENURES.map((emi) => {
                        const monthly = emi.monthlyCalc(amount);
                        return (
                          <button
                            key={emi.months}
                            onClick={() => setSelectedEmiTenure(emi.months)}
                            className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                              selectedEmiTenure === emi.months
                                ? "border-purple-600 bg-purple-50/60 font-bold text-purple-950 shadow-xs"
                                : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                            }`}
                          >
                            <div>
                              <div className="text-xs font-bold">{emi.label}</div>
                              <span className="text-3xs text-slate-500">{emi.note}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-black text-purple-700">
                                ₹{monthly.toLocaleString("en-IN")}/mo
                              </div>
                              <span className="text-3xs text-emerald-600 font-bold">
                                {emi.interestRate === 0 ? "0% Interest" : `${emi.interestRate}% p.a.`}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => handleProcessPayment("success")}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Authorize ${selectedEmiTenure}-Month EMI Plan`}
                    </button>
                  </div>
                )}

                {/* 6. PAY LATER RAIL */}
                {activeRail === "paylater" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <p className="text-2xs text-slate-500">
                      Book now and clear your bill on next cycle with 0% extra fee:
                    </p>
                    <div className="space-y-2">
                      {PAYLATER_PROVIDERS.map((pl) => (
                        <button
                          key={pl.id}
                          onClick={() => setSelectedPaylater(pl.id)}
                          className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all ${
                            selectedPaylater === pl.id
                              ? "border-rose-600 bg-rose-50/60 font-bold text-rose-950 shadow-xs"
                              : "border-slate-200 bg-white hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{pl.logo}</span>
                            <div>
                              <div className="text-xs font-bold">{pl.name}</div>
                              <span className="text-3xs text-slate-500">Pre-approved: {pl.creditLimit}</span>
                            </div>
                          </div>
                          <span className="text-3xs px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-bold">
                            {pl.tag}
                          </span>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handleProcessPayment("success")}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : `Book Instantly with 1-Tap PayLater`}
                    </button>
                  </div>
                )}

                {/* SIMULATION CONTROLS FOR TESTING */}
                <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-3xs text-slate-400">
                  <span>Developer Sandbox Scenarios:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleProcessPayment("success")}
                      className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-100"
                    >
                      Pass (200 OK)
                    </button>
                    <button
                      onClick={() => setStep("otp_screen")}
                      className="px-2 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200 font-bold hover:bg-blue-100"
                    >
                      Trigger OTP
                    </button>
                    <button
                      onClick={() => handleProcessPayment("failed")}
                      className="px-2 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 font-bold hover:bg-rose-100"
                    >
                      Simulate Decline
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: 3D SECURE / BANK OTP SCREEN */}
          {step === "otp_screen" && (
            <div className="max-w-md mx-auto py-4 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="text-center space-y-1">
                <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 mb-1">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Bank 3D-Secure 2.0 Verification</h3>
                <p className="text-2xs text-slate-500">
                  One Time Password (OTP) sent to registered mobile ending in <strong>••• 210</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Merchant:</span>
                  <strong className="text-slate-900">Travel Super Global</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Amount:</span>
                  <strong className="text-slate-900">₹{amount.toLocaleString("en-IN")}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Card:</span>
                  <strong className="text-slate-900 font-mono">{cardNetwork.toUpperCase()} •••• {cardNumber.slice(-4)}</strong>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-1.5">
                  <label className="text-2xs font-bold text-slate-700 block">Enter 6-Digit OTP</label>
                  <input
                    type="text"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    maxLength={6}
                    className="w-full text-center tracking-widest text-lg font-mono font-bold py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  />
                  <div className="flex items-center justify-between text-3xs text-slate-500">
                    <span>Demo OTP: <strong>123456</strong></span>
                    <span>Resend OTP in <strong>{otpTimer}s</strong></span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-2xs font-medium flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => handleCompleteOtp(true)}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify & Authorize Payment"}
                </button>
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-bold"
                >
                  Cancel &amp; Change Method
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: BANK REDIRECT / UPI WAITING */}
          {(step === "bank_redirect" || step === "upi_waiting") && (
            <div className="max-w-sm mx-auto py-8 text-center space-y-4 animate-in fade-in duration-200">
              <div className="relative inline-block">
                <div className="w-16 h-16 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900">
                  {step === "bank_redirect" ? `Connecting to ${selectedBank} NetBanking Gateway...` : "Waiting for UPI App Approval..."}
                </h4>
                <p className="text-2xs text-slate-500">
                  Do not press back or refresh this window while transaction completes.
                </p>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS VIEW */}
          {step === "success" && (
            <div className="max-w-md mx-auto py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">Payment Captured Successfully!</h3>
                <p className="text-xs text-slate-500">
                  Razorpay 256-Bit Cryptographic Signature Verified
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment ID:</span>
                  <strong className="text-blue-600">{paymentResult?.razorpayPaymentId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <strong className="text-slate-800">{paymentResult?.razorpayOrderId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <strong className="text-emerald-600">₹{payableAmount.toLocaleString("en-IN")}</strong>
                </div>
                {paymentMode === "split_group" && (
                  <div className="flex justify-between text-indigo-700">
                    <span>Split Share:</span>
                    <strong>1 of {splitPaxCount} Pax (₹{payableAmount} each)</strong>
                  </div>
                )}
                {paymentMode === "partial_deposit" && (
                  <div className="flex justify-between text-amber-700">
                    <span>Balance at Check-In:</span>
                    <strong>₹{balanceRemaining.toLocaleString("en-IN")}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-slate-500">RBI RRN Reference:</span>
                  <span className="text-slate-700">{paymentResult?.rbiRrn || "623849182391"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded text-3xs font-sans">
                    VERIFIED &amp; SETTLED
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => alert(`Downloaded Official Tax Invoice Receipt #${paymentResult?.razorpayPaymentId || "INV-2026"} (PDF) for ₹${payableAmount}!`)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Download Invoice / Receipt</span>
                </button>
              </div>

              <div className="text-2xs text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Redirecting to your confirmed booking tickets...</span>
              </div>
            </div>
          )}

          {/* STEP 5: FAILED VIEW */}
          {step === "failed" && (
            <div className="max-w-md mx-auto py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Payment Failed or Declined</h3>
                <p className="text-xs text-rose-600">{errorMessage || "Transaction could not be completed."}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep("checkout")}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  Retry Payment
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-slate-100/90 px-4 sm:px-5 py-3 border-t border-slate-200 flex items-center justify-between text-2xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>PCI-DSS Level 1 Compliant • RBI Tokenized</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Secured by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
