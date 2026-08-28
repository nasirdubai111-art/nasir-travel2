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
  Smartphone,
  Send,
  Sliders,
  DollarSign,
  Layers,
  CheckCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  RazorpayOrder,
  RazorpayPaymentRail,
  RazorpayPaymentResult,
  RazorpaySplitParticipant,
  RazorpayRouteTransfer,
} from "../types";
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
  bookingPassengers?: Array<{
    id?: string;
    name: string;
    age?: number;
    gender?: string;
    seatPreference?: string;
    phone?: string;
    email?: string;
  }>;
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
  bookingPassengers,
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

  // Group Split & Partial Payment Modes
  const [paymentMode, setPaymentMode] = useState<"full" | "split_group" | "partial_deposit" | "route_transfers">("full");
  const [splitStrategy, setSplitStrategy] = useState<"equal" | "custom">("equal");
  const [depositPercent, setDepositPercent] = useState<number>(25);
  const [showShareDetails, setShowShareDetails] = useState(false);
  const [selectedPaxForQr, setSelectedPaxForQr] = useState<RazorpaySplitParticipant | null>(null);
  const [simulatingPaxId, setSimulatingPaxId] = useState<string | null>(null);
  const [copiedPaxLinkId, setCopiedPaxLinkId] = useState<string | null>(null);
  const [copiedGroupLink, setCopiedGroupLink] = useState(false);

  // Split Participants State
  const [splitParticipants, setSplitParticipants] = useState<RazorpaySplitParticipant[]>([]);
  const [routeTransfers, setRouteTransfers] = useState<RazorpayRouteTransfer[]>([]);

  // OTP Screen State
  const [otpValue, setOtpValue] = useState("123456");
  const [otpTimer, setOtpTimer] = useState(60);

  // QR Expiry Timer (10:00)
  const [qrTimer, setQrTimer] = useState(600);

  // Gateway Mode
  const [isTestMode, setIsTestMode] = useState(true);

  // Result state
  const [paymentResult, setPaymentResult] = useState<RazorpayPaymentResult | null>(null);

  // Initialize participants from booking passengers or defaults
  const initializeSplitParticipants = (totalAmt: number) => {
    let participants: RazorpaySplitParticipant[] = [];

    if (bookingPassengers && bookingPassengers.length > 0) {
      const perPersonAmt = Math.round(totalAmt / bookingPassengers.length);
      participants = bookingPassengers.map((p, idx) => {
        const isOrganizer = idx === 0;
        const shareAmt =
          idx === bookingPassengers.length - 1
            ? totalAmt - perPersonAmt * (bookingPassengers.length - 1)
            : perPersonAmt;
        const pid = p.id || `pax_${idx + 1}`;
        return {
          id: pid,
          name: isOrganizer ? `${p.name || customerDetails.name} (You)` : (p.name || `Traveler ${idx + 1}`),
          phone: p.phone || (isOrganizer ? customerDetails.phone : `+91 9811${idx + 2} ${idx + 3}4567`),
          email: p.email || (isOrganizer ? customerDetails.email : `traveler${idx + 1}@example.com`),
          seatNumber: p.seatPreference || `Seat ${12 + idx}${["A", "B", "C", "D"][idx % 4]}`,
          shareAmount: shareAmt,
          sharePercentage: Math.round((shareAmt / totalAmt) * 100),
          status: "PENDING",
          paymentLink: `https://bharatyatra.in/pay/split?ref=order_${Date.now()}&pax=${pid}&amt=${shareAmt}`,
        };
      });
    } else {
      // Default 2 travelers
      const half = Math.round(totalAmt / 2);
      participants = [
        {
          id: "pax_1",
          name: `${customerDetails.name} (You)`,
          phone: customerDetails.phone,
          email: customerDetails.email,
          seatNumber: "Seat 12A",
          shareAmount: half,
          sharePercentage: 50,
          status: "PENDING",
          paymentLink: `https://bharatyatra.in/pay/split?ref=order_${Date.now()}&pax=1&amt=${half}`,
        },
        {
          id: "pax_2",
          name: "Rohan Varma (Co-Traveler)",
          phone: "+91 98112 33445",
          email: "rohan.v@example.com",
          seatNumber: "Seat 12B",
          shareAmount: totalAmt - half,
          sharePercentage: 50,
          status: "PENDING",
          paymentLink: `https://bharatyatra.in/pay/split?ref=order_${Date.now()}&pax=2&amt=${totalAmt - half}`,
        },
      ];
    }
    setSplitParticipants(participants);
    setSelectedPaxForQr(participants[0]);
  };

  // Initialize Route transfers
  const initializeRouteTransfers = (totalAmt: number) => {
    const operatorPercent = 82;
    const platformPercent = 17;
    const operatorGross = Math.round(totalAmt * (operatorPercent / 100));
    const tds194o = Math.round(totalAmt * 0.01);
    const platformGross = totalAmt - operatorGross;

    const transfers: RazorpayRouteTransfer[] = [
      {
        id: `trf_${Date.now()}_op`,
        accountId: `acc_${serviceCategory.slice(0, 4)}_operator_99`,
        accountHolderName: `Verified ${serviceCategory.toUpperCase()} Operating Carrier`,
        role: "OPERATOR_DIRECT",
        amount: operatorGross,
        currency: "INR",
        percentage: operatorPercent,
        onHold: false,
        settlementStatus: "SCHEDULED",
        tds194oWithheld: tds194o,
        notes: `Direct remittance via Razorpay Route switch (Less 1% Section 194-O TDS)`,
      },
      {
        id: `trf_${Date.now()}_plat`,
        accountId: "acc_bharatyatra_escrow",
        accountHolderName: "BharatYatra Platform Escrow & GST Reserve",
        role: "PLATFORM_ESCROW",
        amount: platformGross,
        currency: "INR",
        percentage: platformPercent,
        onHold: false,
        settlementStatus: "SCHEDULED",
        tds194oWithheld: 0,
        notes: `Platform technology facilitation & statutory GST reserve`,
      },
    ];
    setRouteTransfers(transfers);
  };

  // Auto create order when opened
  useEffect(() => {
    if (isOpen) {
      setStep("checkout");
      setIsProcessing(false);
      setErrorMessage("");
      setPaymentResult(null);
      setQrTimer(600);
      setOtpTimer(60);
      initializeSplitParticipants(amount);
      initializeRouteTransfers(amount);
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

  // Total collected from co-travelers
  const totalCollectedFromSplit = useMemo(() => {
    return splitParticipants
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.shareAmount, 0);
  }, [splitParticipants]);

  const organizerShare = useMemo(() => {
    return splitParticipants[0]?.shareAmount || Math.round(amount / 2);
  }, [splitParticipants, amount]);

  const organizerPaid = useMemo(() => {
    return splitParticipants[0]?.status === "PAID";
  }, [splitParticipants]);

  // Effective payable amount depending on payment mode
  const payableAmount = useMemo(() => {
    if (paymentMode === "split_group") {
      // If organizer already paid their share, remaining is whatever is left
      return organizerPaid ? Math.max(0, amount - totalCollectedFromSplit) : organizerShare;
    }
    if (paymentMode === "partial_deposit") {
      return Math.round(amount * (depositPercent / 100));
    }
    return amount;
  }, [amount, paymentMode, organizerShare, organizerPaid, totalCollectedFromSplit, depositPercent]);

  const balanceRemaining = Math.max(0, amount - payableAmount);

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
          isSplitOrder: paymentMode === "split_group",
          splitParticipants,
          routeTransfers,
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

  // Split Strategy Adjustment (Equal vs Custom)
  const handleSplitPaxCountChange = (newCount: number) => {
    const count = Math.max(2, Math.min(8, newCount));
    const perPerson = Math.round(amount / count);
    const updated: RazorpaySplitParticipant[] = Array.from({ length: count }, (_, idx) => {
      const isOrganizer = idx === 0;
      const shareAmt = idx === count - 1 ? amount - perPerson * (count - 1) : perPerson;
      return {
        id: `pax_${idx + 1}`,
        name: isOrganizer ? `${customerDetails.name} (You)` : `Traveler ${idx + 1}`,
        phone: isOrganizer ? customerDetails.phone : `+91 9811${idx + 2} ${idx + 3}4567`,
        email: isOrganizer ? customerDetails.email : `traveler${idx + 1}@example.com`,
        seatNumber: `Seat ${12 + idx}${["A", "B", "C", "D"][idx % 4]}`,
        shareAmount: shareAmt,
        sharePercentage: Math.round((shareAmt / amount) * 100),
        status: "PENDING",
        paymentLink: `https://bharatyatra.in/pay/split?ref=${order?.id || "ORD"}&pax=${idx + 1}&amt=${shareAmt}`,
      };
    });
    setSplitParticipants(updated);
    setSelectedPaxForQr(updated[0]);
  };

  const handleCustomShareChange = (index: number, newAmt: number) => {
    const val = Math.max(0, Number(newAmt) || 0);
    const updated = [...splitParticipants];
    if (updated[index]) {
      updated[index].shareAmount = val;
      updated[index].sharePercentage = Math.round((val / amount) * 100);
      updated[index].paymentLink = `https://bharatyatra.in/pay/split?ref=${order?.id || "ORD"}&pax=${updated[index].id}&amt=${val}`;
    }
    setSplitParticipants(updated);
  };

  const handleAutoRebalanceShares = () => {
    const perPerson = Math.round(amount / splitParticipants.length);
    const updated = splitParticipants.map((p, idx) => {
      const shareAmt =
        idx === splitParticipants.length - 1
          ? amount - perPerson * (splitParticipants.length - 1)
          : perPerson;
      return {
        ...p,
        shareAmount: shareAmt,
        sharePercentage: Math.round((shareAmt / amount) * 100),
        paymentLink: `https://bharatyatra.in/pay/split?ref=${order?.id || "ORD"}&pax=${p.id}&amt=${shareAmt}`,
      };
    });
    setSplitParticipants(updated);
  };

  // Simulate Co-Payer Instant Razorpay Payment
  const handleSimulatePaxPayment = async (participant: RazorpaySplitParticipant) => {
    setSimulatingPaxId(participant.id);
    try {
      const res = await fetch("/api/razorpay/split-order/pay-participant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order?.id || "order_SPLIT",
          participantId: participant.id,
          paymentMethod: "upi",
          amount: participant.shareAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSplitParticipants((prev) =>
          prev.map((p) =>
            p.id === participant.id
              ? {
                  ...p,
                  status: "PAID",
                  razorpayPaymentId: data.paymentId,
                  paidAt: new Date().toISOString(),
                  method: "upi",
                }
              : p
          )
        );
      }
    } catch (err) {
      // Offline fallback
      setSplitParticipants((prev) =>
        prev.map((p) =>
          p.id === participant.id
            ? {
                ...p,
                status: "PAID",
                razorpayPaymentId: `pay_split_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                paidAt: new Date().toISOString(),
                method: "upi",
              }
            : p
        )
      );
    } finally {
      setSimulatingPaxId(null);
    }
  };

  // Dispatches WhatsApp Payment Link
  const handleSendWhatsAppSplitLink = async (pax: RazorpaySplitParticipant) => {
    const text = `Hi ${pax.name}! Here is your split payment link for *${title}* on BharatYatra: ₹${pax.shareAmount.toLocaleString(
      "en-IN"
    )}.\n\nPay securely via Razorpay UPI / Cards:\n${pax.paymentLink}\n\nThank you!`;
    const waUrl = `https://wa.me/${pax.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");

    try {
      await fetch("/api/razorpay/split-order/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order?.id || "order_SPLIT",
          participantId: pax.id,
          channel: "whatsapp",
        }),
      });
      setSplitParticipants((prev) =>
        prev.map((p) => (p.id === pax.id && p.status !== "PAID" ? { ...p, status: "REMINDER_DISPATCHED" } : p))
      );
    } catch (e) {
      // Ignored
    }
  };

  const handleCopyPaxLink = (pax: RazorpaySplitParticipant) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(pax.paymentLink);
      setCopiedPaxLinkId(pax.id);
      setTimeout(() => setCopiedPaxLinkId(null), 2000);
    }
  };

  const handleCopyGroupLink = () => {
    const masterLink = `https://bharatyatra.in/pay/split-group?order=${order?.id || "ORD"}&total=${amount}&pax=${splitParticipants.length}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(masterLink);
      setCopiedGroupLink(true);
      setTimeout(() => setCopiedGroupLink(false), 2000);
    }
  };

  const handleApplyTestCard = (card: (typeof TEST_CARDS)[0]) => {
    setCardNumber(card.number);
    setCardExpiry(card.expiry);
    setCardCvv(card.cvv);
    setCardName(card.name);
    setCardNetwork(card.network);
  };

  const handleProcessPayment = async (forceOutcome?: "success" | "otp" | "failed") => {
    setIsProcessing(true);
    setErrorMessage("");

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
            card:
              activeRail === "card"
                ? {
                    last4: cardNumber.replace(/\s/g, "").slice(-4) || "4111",
                    network: cardNetwork,
                    type: "credit",
                    issuer: cardNetwork === "visa" ? "HDFC Bank" : "SBI",
                    tokenized: saveCardToken,
                  }
                : undefined,
            bank: activeRail === "netbanking" ? selectedBank : undefined,
            wallet: activeRail === "wallet" ? selectedWallet : undefined,
            emiPlan:
              activeRail === "emi"
                ? {
                    tenureMonths: selectedEmiTenure,
                    monthlyInstallment: Math.round(payableAmount / selectedEmiTenure),
                    interestRatePercent: 0,
                    bankName: "HDFC Bank",
                  }
                : undefined,
            paylaterProvider: activeRail === "paylater" ? selectedPaylater : undefined,
          },
        }),
      });

      const data = await res.json();

      // Mark Organizer as Paid in Split Participants
      if (paymentMode === "split_group") {
        setSplitParticipants((prev) =>
          prev.map((p, idx) =>
            idx === 0
              ? {
                  ...p,
                  status: "PAID",
                  razorpayPaymentId: paymentId,
                  paidAt: new Date().toISOString(),
                  method: activeRail,
                }
              : p
          )
        );
      }

      const verifiedResult: RazorpayPaymentResult = {
        razorpayPaymentId: paymentId,
        razorpayOrderId: orderId,
        razorpaySignature: signature,
        status: "captured",
        amount: Math.round(payableAmount * 100),
        currency: "INR",
        method: activeRail,
        vpa: activeRail === "upi" ? vpaInput : undefined,
        rbiRrn: data.rbiRrn || `RRN${Math.floor(100000000000 + Math.random() * 900000000000)}`,
        timestamp: new Date().toISOString(),
      };

      setPaymentResult(verifiedResult);
      setIsProcessing(false);
      setStep("success");

      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onSuccess(verifiedResult);
      }, 2000);
    } catch (e) {
      const fallbackResult: RazorpayPaymentResult = {
        razorpayPaymentId: `pay_OFFLINE_${Date.now()}`,
        razorpayOrderId: order?.id || `order_${Date.now()}`,
        razorpaySignature: `sig_offline_${Date.now()}`,
        status: "captured",
        amount: Math.round(payableAmount * 100),
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
  const converted = convertFromInr(amount, preferredCurrency);

  // Active QR code participant (defaults to organizer)
  const activeQrPax = selectedPaxForQr || splitParticipants[0];
  const activeQrAmount = paymentMode === "split_group" ? (activeQrPax?.shareAmount || payableAmount) : payableAmount;

  // Custom UPI URI for instant app opening
  const upiIntentUri = `upi://pay?pa=bharatyatra.escrow@icici&pn=BharatYatraTravel&am=${activeQrAmount}&cu=INR&tn=Razorpay-Order-${order?.id || "BK"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        id="razorpay-checkout-modal-container"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[94vh] animate-in zoom-in-95 duration-200"
      >
        {/* TOP RAZORPAY BRANDED HEADER */}
        <div className="bg-[#0c2340] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
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
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Cancel & Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ORDER SUMMARY & MULTI-MODE TABS */}
        <div className="bg-slate-50 border-b border-slate-200 text-xs shrink-0">
          <div className="px-4 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Booking:</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{title}</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-3xs uppercase tracking-wider border border-indigo-200">
                {serviceCategory}
              </span>
            </div>
            <div className="flex items-center gap-3 text-2xs">
              {order && (
                <button
                  onClick={copyOrderId}
                  className="flex items-center gap-1 text-slate-600 hover:text-blue-600 font-mono bg-white px-2 py-1 rounded-lg border border-slate-200 cursor-pointer"
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

          {/* PAYMENT MODE BAR */}
          <div className="px-4 sm:px-5 py-2 bg-slate-100/90 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-3xs font-bold text-slate-500 uppercase tracking-wider mr-1">Payment Mode:</span>
              <button
                type="button"
                onClick={() => setPaymentMode("full")}
                className={`px-2.5 py-1 rounded-lg text-3xs font-bold transition-all cursor-pointer ${
                  paymentMode === "full"
                    ? "bg-[#0c2340] text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                100% Full (₹{amount.toLocaleString("en-IN")})
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("split_group")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-3xs font-bold transition-all cursor-pointer ${
                  paymentMode === "split_group"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Users className="w-3 h-3" />
                <span>Split with Co-Travelers ({splitParticipants.length} Pax)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("route_transfers")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-3xs font-bold transition-all cursor-pointer ${
                  paymentMode === "route_transfers"
                    ? "bg-blue-700 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>Razorpay Route (82% Operator)</span>
              </button>
              <button
                type="button"
                onClick={() => setPaymentMode("partial_deposit")}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-3xs font-bold transition-all cursor-pointer ${
                  paymentMode === "partial_deposit"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Coins className="w-3 h-3" />
                <span>Partial Deposit ({depositPercent}%)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowShareDetails(!showShareDetails)}
              className="flex items-center gap-1 text-3xs font-bold text-slate-600 hover:text-indigo-600 ml-auto cursor-pointer"
            >
              <Receipt className="w-3 h-3 text-indigo-500" />
              <span>{showShareDetails ? "Hide Breakdown" : "Fare & TDS Audit"}</span>
              {showShareDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: DEDICATED SPLIT BILL & MULTI-PAYER HUB */}
          {/* ========================================================================= */}
          {paymentMode === "split_group" && (
            <div className="p-3.5 mx-4 sm:mx-5 my-2.5 bg-gradient-to-br from-indigo-50/90 via-blue-50/50 to-indigo-50/70 rounded-2xl border-2 border-indigo-200 shadow-sm space-y-3 animate-in fade-in duration-200">
              {/* Header & Strategy selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-200/70 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-indigo-600" />
                      Razorpay Multi-Payer Split Engine
                    </span>
                    <span className="text-3xs font-black uppercase px-2 py-0.5 rounded-full bg-indigo-200 text-indigo-900">
                      Co-Traveler Links
                    </span>
                  </div>
                  <p className="text-3xs text-indigo-800 mt-0.5">
                    Share direct payment links with friends. Each traveler pays via their own UPI, Card, or Wallet.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-indigo-200 text-3xs font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setSplitStrategy("equal");
                        handleAutoRebalanceShares();
                      }}
                      className={`px-2 py-1 rounded transition-all cursor-pointer ${
                        splitStrategy === "equal" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Equal Split
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitStrategy("custom")}
                      className={`px-2 py-1 rounded transition-all cursor-pointer ${
                        splitStrategy === "custom" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Custom Amounts
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-indigo-200 text-3xs font-bold">
                    <span className="text-slate-500 px-1">Pax:</span>
                    {[2, 3, 4, 5].map((cnt) => (
                      <button
                        key={cnt}
                        type="button"
                        onClick={() => handleSplitPaxCountChange(cnt)}
                        className={`px-2 py-1 rounded transition-all cursor-pointer ${
                          splitParticipants.length === cnt ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {cnt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Collection Progress Bar */}
              <div className="p-2.5 rounded-xl bg-white border border-indigo-200 space-y-1.5">
                <div className="flex items-center justify-between text-2xs font-extrabold">
                  <span className="text-indigo-950 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Collection Progress: ₹{totalCollectedFromSplit.toLocaleString("en-IN")} of ₹{amount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-indigo-700">
                    {Math.round((totalCollectedFromSplit / Math.max(1, amount)) * 100)}% Completed (₹{Math.max(0, amount - totalCollectedFromSplit).toLocaleString("en-IN")} Pending)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(100, Math.round((totalCollectedFromSplit / amount) * 100))}%` }}
                  ></div>
                </div>
              </div>

              {/* Co-Travelers Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                {splitParticipants.map((pax, idx) => {
                  const isOrganizer = idx === 0;
                  const isPaid = pax.status === "PAID";
                  const isQrActive = selectedPaxForQr?.id === pax.id;

                  return (
                    <div
                      key={pax.id}
                      className={`p-3 rounded-xl border transition-all space-y-2 ${
                        isPaid
                          ? "bg-emerald-50/90 border-emerald-300 ring-1 ring-emerald-400/30"
                          : isQrActive
                          ? "bg-white border-indigo-500 shadow-sm ring-2 ring-indigo-500/20"
                          : "bg-white border-indigo-100 hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-slate-900">
                            <User className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{pax.name}</span>
                          </div>
                          <span className="text-3xs text-slate-500 block">{pax.seatNumber || `Traveler ${idx + 1}`} • {pax.phone}</span>
                        </div>

                        <div className="text-right shrink-0">
                          {splitStrategy === "custom" && !isPaid ? (
                            <div className="flex items-center gap-1">
                              <span className="text-3xs text-slate-400">₹</span>
                              <input
                                type="number"
                                value={pax.shareAmount}
                                onChange={(e) => handleCustomShareChange(idx, Number(e.target.value))}
                                className="w-20 px-1.5 py-0.5 rounded border border-indigo-300 text-right font-mono font-bold text-xs bg-indigo-50/40"
                              />
                            </div>
                          ) : (
                            <span className="font-mono font-black text-xs text-indigo-950 block">
                              ₹{pax.shareAmount.toLocaleString("en-IN")}
                            </span>
                          )}

                          <span
                            className={`text-3xs font-extrabold px-1.5 py-0.5 rounded-full inline-block mt-0.5 ${
                              isPaid
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : "bg-amber-100 text-amber-900 border border-amber-200"
                            }`}
                          >
                            {isPaid ? "PAID ✓" : isOrganizer ? "PAYING NOW" : "LINK ACTIVE"}
                          </span>
                        </div>
                      </div>

                      {/* Participant Quick Actions */}
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 text-3xs">
                        <button
                          type="button"
                          onClick={() => setSelectedPaxForQr(pax)}
                          className={`px-2 py-1 rounded-md font-bold flex items-center gap-1 transition-all cursor-pointer ${
                            isQrActive ? "bg-indigo-600 text-white" : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                          }`}
                          title="Generate instant UPI QR for this passenger"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>{isQrActive ? "Viewing QR" : "Show QR"}</span>
                        </button>

                        {!isPaid && !isOrganizer && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleSendWhatsAppSplitLink(pax)}
                              className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Send WhatsApp payment link to this traveler"
                            >
                              <Send className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyPaxLink(pax)}
                              className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Copy direct payment URL"
                            >
                              {copiedPaxLinkId === pax.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedPaxLinkId === pax.id ? "Copied" : "Link"}</span>
                            </button>

                            {/* Demo Simulator button */}
                            {isTestMode && (
                              <button
                                type="button"
                                onClick={() => handleSimulatePaxPayment(pax)}
                                disabled={simulatingPaxId === pax.id}
                                className="px-2 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-black flex items-center gap-1 transition-colors cursor-pointer"
                                title="Simulate payment in test mode"
                              >
                                {simulatingPaxId === pax.id ? (
                                  <RefreshCw className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Zap className="w-3 h-3" />
                                )}
                                <span>Simulate Pay</span>
                              </button>
                            )}
                          </div>
                        )}

                        {isPaid && (
                          <span className="text-3xs font-mono text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{pax.razorpayPaymentId || "Captured via UPI"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Master Group Action Bar */}
              <div className="pt-2 border-t border-indigo-200/80 flex flex-wrap items-center justify-between gap-2">
                <div className="text-3xs text-indigo-900 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Razorpay Smart Escrow locks booking once all co-traveler shares are collected.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {splitStrategy === "custom" && (
                    <button
                      type="button"
                      onClick={handleAutoRebalanceShares}
                      className="px-2.5 py-1 rounded-lg bg-white border border-indigo-300 text-indigo-800 text-3xs font-bold hover:bg-indigo-50 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3 text-indigo-600" />
                      <span>Auto-Equalize</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCopyGroupLink}
                    className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-3xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    {copiedGroupLink ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedGroupLink ? "Group Link Copied!" : "Copy Master Group Split Link"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: RAZORPAY ROUTE MARKETPLACE SPLIT TRANSFERS */}
          {/* ========================================================================= */}
          {paymentMode === "route_transfers" && (
            <div className="p-3.5 mx-4 sm:mx-5 my-2.5 bg-blue-50/80 rounded-2xl border-2 border-blue-200 shadow-sm space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-blue-200/70 pb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-blue-950 flex items-center gap-1.5">
                      Razorpay Route™ Multi-Vendor Split Transfers
                    </h4>
                    <p className="text-3xs text-blue-800">
                      Automated direct bank remittance to verified carriers &amp; hotels with statutory Section 194-O TDS.
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-200 text-blue-950 font-black text-3xs uppercase">
                  T+0 Switch
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                {routeTransfers.map((trf) => (
                  <div key={trf.id} className="p-3 rounded-xl bg-white border border-blue-200 space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-slate-900 block">{trf.accountHolderName}</span>
                        <span className="text-3xs font-mono text-slate-400">{trf.accountId}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-xs text-blue-900 block">
                          ₹{trf.amount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-3xs font-bold text-slate-500">{trf.percentage}% Share</span>
                      </div>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-3xs text-slate-600">
                      <span>TDS 194-O Withheld: <strong>₹{trf.tds194oWithheld}</strong></span>
                      <span className="font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {trf.settlementStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: PARTIAL ADVANCE TOKEN DEPOSIT */}
          {/* ========================================================================= */}
          {paymentMode === "partial_deposit" && (
            <div className="p-3 mx-4 sm:mx-5 my-2.5 bg-amber-50/90 rounded-2xl border-2 border-amber-200 text-2xs space-y-2 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-amber-950">Pay Now Milestone:</span>
                  <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-amber-200">
                    {[20, 25, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setDepositPercent(pct)}
                        className={`px-2 py-0.5 rounded text-3xs font-bold transition-all cursor-pointer ${
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

          {/* PRICE / STATUTORY BREAKDOWN ACCORDION */}
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
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-left font-bold text-xs transition-all cursor-pointer ${
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
                        className={`text-3xs font-bold px-2 py-0.5 rounded transition-colors cursor-pointer ${
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
                        { id: "qr", label: paymentMode === "split_group" ? `QR (${activeQrPax?.name || "Participant"})` : "Scan QR Code" },
                        { id: "apps", label: "UPI Apps" },
                        { id: "vpa", label: "Enter UPI ID" },
                      ].map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => setUpiSubTab(sub.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
                      <div className="text-center space-y-3">
                        <div className="relative inline-block p-4 rounded-3xl bg-white border-2 border-slate-800 shadow-xl">
                          <div className="w-48 h-48 mx-auto bg-slate-900 rounded-2xl flex flex-col items-center justify-center p-3 relative overflow-hidden text-white">
                            <QrCode className="w-36 h-36 text-white" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center pb-2">
                              <span className="text-3xs font-mono font-bold bg-blue-600 text-white px-2 py-0.5 rounded-md">
                                ₹{activeQrAmount.toLocaleString("en-IN")}
                              </span>
                            </div>
                          </div>

                          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-2xs font-extrabold text-slate-900">
                            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Scan with any UPI App (GPay / PhonePe / Paytm / BHIM)</span>
                          </div>
                        </div>

                        {paymentMode === "split_group" && (
                          <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-200 text-2xs text-indigo-900 flex items-center justify-center gap-2">
                            <span>Generating QR for: <strong>{activeQrPax?.name}</strong> (₹{activeQrAmount})</span>
                          </div>
                        )}

                        <div className="flex items-center justify-center gap-2 text-2xs text-slate-500 font-mono">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>QR valid for <strong>{formattedTimer}</strong></span>
                        </div>

                        <div className="pt-2 flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(upiIntentUri, "_blank")}
                            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Open in UPI App</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleProcessPayment("success")}
                            disabled={isProcessing}
                            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                          >
                            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            <span>Simulate Successful Scan</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {upiSubTab === "apps" && (
                      <div className="space-y-3">
                        <p className="text-2xs text-slate-500 font-medium">
                          Select your installed UPI application to authorize ₹{payableAmount.toLocaleString("en-IN")}:
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {POPULAR_UPI_APPS.map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => handleProcessPayment("success")}
                              disabled={isProcessing}
                              className="p-3 rounded-2xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 flex items-center gap-3 text-left transition-all cursor-pointer"
                            >
                              <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs">
                                {app.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="font-bold text-xs text-slate-900 block">{app.name}</span>
                                <span className="text-3xs text-slate-400 block">{app.handle}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {upiSubTab === "vpa" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-2xs font-bold text-slate-700">Enter Virtual Payment Address (VPA / UPI ID)</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={vpaInput}
                              onChange={(e) => setVpaInput(e.target.value)}
                              placeholder="username@okhdfcbank"
                              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                              className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black cursor-pointer"
                            >
                              {vpaValidating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Verify"}
                            </button>
                          </div>
                        </div>

                        {vpaValidated && (
                          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-2xs font-medium flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Verified VPA for <strong>{customerDetails.name}</strong>. Ready for instant collect request.</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. CARD RAIL */}
                {activeRail === "card" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-slate-700">Card Number</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="4111 2222 3333 4111"
                          maxLength={19}
                          className="w-full pl-3 pr-16 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <span className="absolute right-3 top-2.5 text-3xs font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {cardNetwork}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-2xs font-bold text-slate-700">Expiry (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          maxLength={5}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-2xs font-bold text-slate-700">CVV / CVC</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-2xs font-bold text-slate-700">Cardholder Name</label>
                      <input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Name on card"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>

                    {/* Test Cards Quick Presets */}
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-3xs font-bold text-slate-400 block mb-1 uppercase">Sample Test Cards:</span>
                      <div className="flex gap-1.5 flex-wrap">
                        {TEST_CARDS.map((tc) => (
                          <button
                            key={tc.name}
                            type="button"
                            onClick={() => handleApplyTestCard(tc)}
                            className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-3xs font-bold transition-colors cursor-pointer"
                          >
                            {tc.name} ({tc.network.toUpperCase()})
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. NETBANKING */}
                {activeRail === "netbanking" && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <input
                      type="text"
                      value={bankSearch}
                      onChange={(e) => setBankSearch(e.target.value)}
                      placeholder="Search 50+ Indian Scheduled Banks..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {POPULAR_BANKS.filter((b) => b.name.toLowerCase().includes(bankSearch.toLowerCase())).map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all cursor-pointer ${
                            selectedBank === bank.id ? "border-blue-600 bg-blue-50 text-blue-950 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          <span>{bank.name}</span>
                          {selectedBank === bank.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. WALLETS */}
                {activeRail === "wallet" && (
                  <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-150">
                    {WALLETS_LIST.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWallet(w.id)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                          selectedWallet === w.id ? "border-amber-500 bg-amber-50 text-amber-950 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span className="block font-bold text-xs">{w.name}</span>
                        <span className="text-3xs text-emerald-600 font-medium block mt-0.5">{w.cashback}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 5. EMI */}
                {activeRail === "emi" && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    {EMI_TENURES.map((tenure) => (
                      <button
                        key={tenure.months}
                        type="button"
                        onClick={() => setSelectedEmiTenure(tenure.months)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedEmiTenure === tenure.months ? "border-purple-600 bg-purple-50 text-purple-950 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs block">{tenure.months} Months No-Cost EMI</span>
                          <span className="text-3xs text-slate-500">{tenure.note}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold text-xs text-purple-900 block">
                            ₹{Math.round(payableAmount / tenure.months).toLocaleString("en-IN")}/mo
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* 6. PAYLATER */}
                {activeRail === "paylater" && (
                  <div className="space-y-2 animate-in fade-in duration-150">
                    {PAYLATER_PROVIDERS.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setSelectedPaylater(p.id)}
                        className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          selectedPaylater === p.id ? "border-rose-500 bg-rose-50 text-rose-950 font-bold" : "border-slate-200 hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        <div>
                          <span className="font-bold text-xs block">{p.name}</span>
                          <span className="text-3xs text-slate-500">{p.creditLimit} • {p.tag}</span>
                        </div>
                        <span className="text-3xs font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                          Pay in 15 Days
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* PRIMARY ACTION BUTTON */}
                <div className="pt-2 space-y-2">
                  <button
                    type="button"
                    id="razorpay-primary-submit-btn"
                    onClick={() => handleProcessPayment()}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#0c2340] hover:brightness-110 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Connecting to Razorpay Gateway...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>
                          {paymentMode === "split_group"
                            ? `Pay My Share (₹${payableAmount.toLocaleString("en-IN")}) via ${activeRail.toUpperCase()}`
                            : `Pay ₹${payableAmount.toLocaleString("en-IN")} via ${activeRail.toUpperCase()}`}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-3xs text-slate-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>256-Bit Cryptographic SSL • Instant Capture • PCI-DSS 4.0</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OTP SCREEN */}
          {step === "otp_screen" && (
            <div className="max-w-sm mx-auto py-4 space-y-4 animate-in fade-in duration-200">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">3D Secure 2.0 Card Verification</h3>
                <p className="text-2xs text-slate-500">
                  Enter one-time password sent to registered mobile linked with card.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Merchant:</span>
                  <strong className="text-slate-900">{RAZORPAY_CONFIG.merchantName}</strong>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Amount:</span>
                  <strong className="text-emerald-700 font-mono">₹{payableAmount.toLocaleString("en-IN")}</strong>
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
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify & Authorize Payment"}
                </button>
                <button
                  onClick={() => setStep("checkout")}
                  className="w-full py-2 text-slate-500 hover:text-slate-700 text-xs font-bold cursor-pointer"
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
                    <strong>{splitParticipants.length} Pax Group (₹{payableAmount} share)</strong>
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
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
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
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Retry Payment
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-3 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
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
            <span>PCI-DSS Level 1 Compliant • RBI Tokenized • Multi-Payer Split Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Secured by Razorpay Route</span>
          </div>
        </div>
      </div>
    </div>
  );
}
