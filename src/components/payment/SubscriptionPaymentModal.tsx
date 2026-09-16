import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Building,
  User,
  Zap,
  Lock,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  AlertCircle,
  FileText,
  Clock,
  Smartphone,
  CheckCheck,
  Share2,
  Mail,
  MessageSquare,
} from "lucide-react";
import QRCode from "qrcode";
import {
  SUBSCRIPTION_PLAN_OPTIONS,
  SubscriptionPlanOption,
  SubscriptionPaymentReceipt,
  INITIAL_SUBSCRIPTION_RECEIPT,
  generateReceiptQrPayload,
} from "../../data/subscriptionPaymentData";
import { ReceiptVerificationModal } from "./ReceiptVerificationModal";

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAudience?: "partner" | "customer";
  initialPlanId?: string;
  partnerName?: string;
  partnerId?: string;
  onSubscriptionActivated?: (receipt: SubscriptionPaymentReceipt) => void;
}

type PaymentMethodType = "upi" | "credit_card" | "debit_card" | "qr_code" | "netbanking";
type ModalStep = "select_plan" | "pay_fee" | "gateway_processing" | "receipt";

export function SubscriptionPaymentModal({
  isOpen,
  onClose,
  initialAudience = "partner",
  initialPlanId = "plan_premium_partner",
  partnerName = "Nasir Travel Services",
  partnerId = "PTR-2026-00125",
  onSubscriptionActivated,
}: SubscriptionPaymentModalProps) {
  const [audience, setAudience] = useState<"partner" | "customer">(initialAudience);
  const [currentStep, setCurrentStep] = useState<ModalStep>("select_plan");
  
  // Selected Plan
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlanOption>(() => {
    return (
      SUBSCRIPTION_PLAN_OPTIONS.find((p) => p.id === initialPlanId) ||
      SUBSCRIPTION_PLAN_OPTIONS[0]
    );
  });

  // Billing period selection (Default 1 Year as specified)
  const [billingPeriod, setBillingPeriod] = useState<"1 Year" | "6 Months" | "1 Month">("1 Year");

  // Payment Method Selection
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("upi");
  const [upiVpa, setUpiVpa] = useState<string>("partner@okaxis");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("gpay");
  
  // Card Inputs
  const [cardNumber, setCardNumber] = useState<string>("4532 •••• •••• 4242");
  const [cardHolder, setCardHolder] = useState<string>(partnerName);
  const [cardExpiry, setCardExpiry] = useState<string>("09/29");
  const [cardCvv, setCardCvv] = useState<string>("821");

  // NetBanking
  const [selectedBank, setSelectedBank] = useState<string>("HDFC Bank");

  // Gateway Simulation States
  const [gatewayStage, setGatewayStage] = useState<"connecting" | "authenticating" | "generating_id" | "activating">("connecting");
  const [gatewayOtp, setGatewayOtp] = useState<string>("849201");

  // Generated Active Receipt
  const [generatedReceipt, setGeneratedReceipt] = useState<SubscriptionPaymentReceipt>(INITIAL_SUBSCRIPTION_RECEIPT);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedShareText, setCopiedShareText] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter plans based on audience
  const availablePlans = SUBSCRIPTION_PLAN_OPTIONS.filter((p) => p.targetAudience === audience);

  // Sync plan if audience changes
  useEffect(() => {
    const defaultForAudience = SUBSCRIPTION_PLAN_OPTIONS.find((p) => p.targetAudience === audience);
    if (defaultForAudience) {
      setSelectedPlan(defaultForAudience);
    }
  }, [audience]);

  // Generate QR Code data URL when receipt changes
  useEffect(() => {
    if (generatedReceipt) {
      const payload = generateReceiptQrPayload(generatedReceipt);
      QRCode.toDataURL(
        payload,
        {
          width: 220,
          margin: 1,
          color: {
            dark: "#0f172a",
            light: "#ffffff",
          },
        },
        (err, url) => {
          if (!err && url) {
            setQrCodeDataUrl(url);
          }
        }
      );
    }
  }, [generatedReceipt]);

  if (!isOpen) return null;

  // Pricing calculations
  const calculateFees = (plan: SubscriptionPlanOption) => {
    let baseFee = plan.annualFeeINR;
    if (billingPeriod === "6 Months") baseFee = Math.round(plan.annualFeeINR * 0.55);
    if (billingPeriod === "1 Month") baseFee = plan.monthlyFeeINR || Math.round(plan.annualFeeINR / 10);

    const taxAmount = Math.round(baseFee * plan.gstRate);
    const totalPaid = baseFee + taxAmount;

    return { baseFee, taxAmount, totalPaid };
  };

  const { baseFee, taxAmount, totalPaid } = calculateFees(selectedPlan);

  // Proceed to Payment Gateway
  const handleProceedToPayment = () => {
    setCurrentStep("pay_fee");
  };

  // Submit Payment -> Launch Simulated Payment Gateway
  const handleExecutePayment = () => {
    setCurrentStep("gateway_processing");
    setGatewayStage("connecting");

    // Realistic multi-stage verification flow
    setTimeout(() => {
      setGatewayStage("authenticating");
    }, 900);

    setTimeout(() => {
      setGatewayStage("generating_id");
    }, 1800);

    setTimeout(() => {
      setGatewayStage("activating");
    }, 2600);

    setTimeout(() => {
      // Build dynamic receipt
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, "0");
      const dateFormatted = `${now.getDate()} Sep ${now.getFullYear()}`;
      const timeFormatted = `${now.getHours() % 12 || 12}:${pad(now.getMinutes())} ${now.getHours() >= 12 ? "PM" : "AM"}`;
      const dateTimeStr = `${dateFormatted}, ${timeFormatted}`;
      
      const seq = Math.floor(100 + Math.random() * 900);
      const txnId = `TXN20260916000${seq}`;
      const receiptNum = `REC-2026-00${seq}`;
      const invoiceNum = `INV-2026-00${seq}`;

      const nextYear = new Date(now);
      nextYear.setFullYear(now.getFullYear() + (billingPeriod === "1 Year" ? 1 : 0));
      if (billingPeriod === "6 Months") nextYear.setMonth(now.getMonth() + 6);
      if (billingPeriod === "1 Month") nextYear.setMonth(now.getMonth() + 1);
      const renewalDateFormatted = `${nextYear.getDate()} Sep ${nextYear.getFullYear()}`;

      let methodLabel = "UPI (Google Pay / NPCI AutoPay)";
      let methodCat: "UPI" | "Credit Card" | "Debit Card" | "QR Code" | "NetBanking" = "UPI";

      if (paymentMethod === "credit_card") {
        methodLabel = `Credit Card (Visa •••• ${cardNumber.slice(-4)})`;
        methodCat = "Credit Card";
      } else if (paymentMethod === "debit_card") {
        methodLabel = `Debit Card (RuPay Platinum •••• ${cardNumber.slice(-4)})`;
        methodCat = "Debit Card";
      } else if (paymentMethod === "qr_code") {
        methodLabel = "Dynamic UPI QR Code (Scanned & Authorized)";
        methodCat = "QR Code";
      } else if (paymentMethod === "netbanking") {
        methodLabel = `NetBanking (${selectedBank})`;
        methodCat = "NetBanking";
      } else {
        methodLabel = `UPI (${upiVpa})`;
        methodCat = "UPI";
      }

      const newReceipt: SubscriptionPaymentReceipt = {
        platform: "BharatYatra Travel Platform",
        partnerOrCustomerName: partnerName,
        userOrPartnerId: partnerId,
        subscriptionPlan: selectedPlan.name,
        subscriptionPeriod: billingPeriod,
        subscriptionFee: baseFee,
        taxGstRate: selectedPlan.gstRate,
        taxGstAmount: taxAmount,
        totalPaid: totalPaid,
        paymentMethod: methodLabel,
        paymentMethodCategory: methodCat,
        transactionId: txnId,
        paymentDateTime: dateTimeStr,
        paymentStatus: "PAID",
        receiptNumber: receiptNum,
        invoiceNumber: invoiceNum,
        nextRenewalDate: renewalDateFormatted,
        verificationCode: `BY-QC-${seq}-${txnId}`,
        qrVerificationUrl: `https://bharatyatra.in/verify-receipt/${receiptNum}`,
        notes: `Online subscription fee received via ${methodCat}. Entitlements activated immediately.`,
      };

      setGeneratedReceipt(newReceipt);
      setCurrentStep("receipt");

      if (onSubscriptionActivated) {
        onSubscriptionActivated(newReceipt);
      }
    }, 3400);
  };

  // Copy Transaction ID with user feedback toast
  const handleCopyTransactionId = (txnId: string) => {
    navigator.clipboard.writeText(txnId);
    setCopiedTxn(true);
    setToastMessage(`Transaction ID "${txnId}" copied to clipboard! Ready to paste into support tickets or emails.`);
    setTimeout(() => setCopiedTxn(false), 2500);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Print Receipt
  const handlePrintReceipt = () => {
    window.print();
  };

  // Download Official PDF / HTML Receipt
  const handleDownloadReceiptHtml = () => {
    const htmlReceipt = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Payment Receipt - ${generatedReceipt.receiptNumber}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif; background: #f8fafc; padding: 30px; color: #0f172a; }
    .receipt-card { max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #cbd5e1; border-radius: 16px; padding: 32px; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
    .header { display: flex; justify-content: space-between; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 24px; }
    .logo-area h1 { margin: 0; font-size: 24px; color: #1e1b4b; font-weight: 900; }
    .logo-area p { margin: 4px 0 0; font-size: 11px; color: #64748b; line-height: 1.4; }
    .badge { background: #dcfce7; color: #166534; border: 1px solid #86efac; padding: 4px 10px; border-radius: 6px; font-weight: bold; font-size: 11px; display: inline-block; }
    .table-details { width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 13px; }
    .table-details th { background: #f1f5f9; padding: 10px 12px; text-align: left; color: #475569; font-weight: 700; border-bottom: 1px solid #cbd5e1; }
    .table-details td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
    .table-details tr:last-child td { border-bottom: none; }
    .total-row { background: #f8fafc; font-weight: bold; font-size: 14px; color: #0f172a; }
    .qr-section { display: flex; gap: 20px; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
    .footer { border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div class="logo-area">
        <h1>🇮🇳 BharatYatra</h1>
        <p>
          BharatYatra Technologies Private Limited<br />
          GSTIN: 07AAACB4410R1ZP • SAC: 998313 (Online Travel Platform)<br />
          Cyber City, DLF Phase II, Gurugram, Haryana - 122002
        </p>
      </div>
      <div style="text-align: right;">
        <span class="badge">PAYMENT STATUS: PAID ✓</span>
        <div style="margin-top: 8px; font-weight: bold; font-family: monospace; font-size: 14px;">${generatedReceipt.receiptNumber}</div>
        <div style="font-size: 11px; color: #64748b;">${generatedReceipt.paymentDateTime}</div>
      </div>
    </div>

    <table class="table-details">
      <thead>
        <tr>
          <th>Payment Detail</th>
          <th>Particulars / Value</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><strong>Platform</strong></td><td>${generatedReceipt.platform}</td></tr>
        <tr><td><strong>Partner / Customer Name</strong></td><td>${generatedReceipt.partnerOrCustomerName}</td></tr>
        <tr><td><strong>User / Partner ID</strong></td><td><code>${generatedReceipt.userOrPartnerId}</code></td></tr>
        <tr><td><strong>Subscription Plan</strong></td><td><strong>${generatedReceipt.subscriptionPlan}</strong></td></tr>
        <tr><td><strong>Subscription Period</strong></td><td>${generatedReceipt.subscriptionPeriod}</td></tr>
        <tr><td><strong>Subscription Fee</strong></td><td>₹${generatedReceipt.subscriptionFee.toLocaleString("en-IN")}</td></tr>
        <tr><td><strong>Tax / GST (18%)</strong></td><td>₹${generatedReceipt.taxGstAmount.toLocaleString("en-IN")} (CGST: 9% + SGST: 9%)</td></tr>
        <tr class="total-row"><td><strong>Total Paid</strong></td><td><strong style="color: #166534; font-size: 16px;">₹${generatedReceipt.totalPaid.toLocaleString("en-IN")}</strong></td></tr>
        <tr><td><strong>Payment Method</strong></td><td>${generatedReceipt.paymentMethod}</td></tr>
        <tr><td><strong>Transaction ID</strong></td><td><code style="background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${generatedReceipt.transactionId}</code></td></tr>
        <tr><td><strong>Payment Date &amp; Time</strong></td><td>${generatedReceipt.paymentDateTime}</td></tr>
        <tr><td><strong>Invoice Number</strong></td><td>${generatedReceipt.invoiceNumber}</td></tr>
        <tr><td><strong>Next Renewal Date</strong></td><td><strong>${generatedReceipt.nextRenewalDate}</strong></td></tr>
      </tbody>
    </table>

    <div class="qr-section">
      ${qrCodeDataUrl ? `<img src="${qrCodeDataUrl}" width="120" height="120" style="border-radius: 8px; border: 1px solid #cbd5e1;" />` : ""}
      <div>
        <div style="font-size: 12px; font-weight: bold; color: #0f172a; margin-bottom: 4px;">QR Code for QC / Verification</div>
        <p style="margin: 0 0 6px; font-size: 11px; color: #475569;">
          Scan with any QR scanner to verify authentic receipt validity. Contains encrypted transaction reference (no card/UPI credentials).
        </p>
        <div style="font-family: monospace; font-size: 10px; color: #64748b;">
          Ref: ${generatedReceipt.verificationCode}
        </div>
      </div>
    </div>

    <div class="footer">
      This is a digitally generated tax receipt valid under Section 31 of CGST Act, 2017.<br />
      Need help with your subscription? Contact BharatYatra Partner Support: partners@bharatyatra.in • 1800-200-YATRA
    </div>
  </div>
  <script>window.onload = function() { setTimeout(function() { window.print(); }, 400); };</script>
</body>
</html>`;

    const blob = new Blob([htmlReceipt], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Subscription_Receipt_${generatedReceipt.receiptNumber}_BharatYatra.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage(`Downloaded official receipt #${generatedReceipt.receiptNumber}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Generate Formatted Plain Text Summary for Sharing
  const getReceiptShareText = () => {
    return `*BharatYatra Online Subscription Payment Receipt*
--------------------------------------------
• Platform: ${generatedReceipt.platform}
• Partner / Customer: ${generatedReceipt.partnerOrCustomerName}
• User / Partner ID: ${generatedReceipt.userOrPartnerId}
• Subscription Plan: ${generatedReceipt.subscriptionPlan}
• Subscription Period: ${generatedReceipt.subscriptionPeriod}
• Subscription Fee: ₹${generatedReceipt.subscriptionFee.toLocaleString("en-IN")}
• Tax / GST (18%): ₹${generatedReceipt.taxGstAmount.toLocaleString("en-IN")}
• Total Paid: ₹${generatedReceipt.totalPaid.toLocaleString("en-IN")}
• Payment Method: ${generatedReceipt.paymentMethod}
• Transaction ID: ${generatedReceipt.transactionId}
• Payment Status: ${generatedReceipt.paymentStatus} ✓
• Receipt Number: ${generatedReceipt.receiptNumber}
• Invoice Number: ${generatedReceipt.invoiceNumber}
• Payment Date & Time: ${generatedReceipt.paymentDateTime}
• Next Renewal Date: ${generatedReceipt.nextRenewalDate}
--------------------------------------------
Digital Receipt Verification:
${generatedReceipt.qrVerificationUrl}
Verification Ref: ${generatedReceipt.verificationCode}`;
  };

  // Trigger Native Browser Share Dialog or open options modal
  const handleShareReceipt = async () => {
    const shareText = getReceiptShareText();
    const shareTitle = `BharatYatra Subscription Receipt - ${generatedReceipt.receiptNumber}`;

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: generatedReceipt.qrVerificationUrl,
        });
        setToastMessage("Receipt shared successfully via browser share!");
        setTimeout(() => setToastMessage(null), 3000);
        return;
      } catch (err: any) {
        if (err?.name === "AbortError") {
          return;
        }
        console.warn("Native share could not complete, opening share modal:", err);
      }
    }

    // Fallback: open WhatsApp / Email share dialog
    setIsShareModalOpen(true);
  };

  // Direct WhatsApp Share
  const handleShareWhatsApp = () => {
    const shareText = getReceiptShareText();
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setToastMessage("Opening WhatsApp with receipt summary...");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Direct Email Share
  const handleShareEmail = () => {
    const emailSubject = `Payment Receipt: ${generatedReceipt.subscriptionPlan} - ${generatedReceipt.receiptNumber}`;
    const emailBody = `Dear Team / Finance Desk,

Please find the online subscription payment receipt details for BharatYatra Travel Platform:

Platform: ${generatedReceipt.platform}
Partner / Customer Name: ${generatedReceipt.partnerOrCustomerName}
User / Partner ID: ${generatedReceipt.userOrPartnerId}
Subscription Plan: ${generatedReceipt.subscriptionPlan}
Subscription Period: ${generatedReceipt.subscriptionPeriod}
Subscription Fee: ₹${generatedReceipt.subscriptionFee.toLocaleString("en-IN")}
Tax / GST (18%): ₹${generatedReceipt.taxGstAmount.toLocaleString("en-IN")}
Total Paid: ₹${generatedReceipt.totalPaid.toLocaleString("en-IN")}
Payment Method: ${generatedReceipt.paymentMethod}
Transaction ID: ${generatedReceipt.transactionId}
Payment Date & Time: ${generatedReceipt.paymentDateTime}
Payment Status: ${generatedReceipt.paymentStatus}
Receipt Number: ${generatedReceipt.receiptNumber}
Invoice Number: ${generatedReceipt.invoiceNumber}
Next Renewal Date: ${generatedReceipt.nextRenewalDate}

Digital Receipt Verification:
${generatedReceipt.qrVerificationUrl}
Ref: ${generatedReceipt.verificationCode}

Thank you,
${generatedReceipt.partnerOrCustomerName}`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;
    setToastMessage("Opening email client with receipt details...");
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Copy Full Share Text
  const handleCopyShareText = () => {
    navigator.clipboard.writeText(getReceiptShareText());
    setCopiedShareText(true);
    setToastMessage("Receipt summary copied to clipboard! Ready to paste into WhatsApp or Email.");
    setTimeout(() => setCopiedShareText(false), 2500);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-indigo-900/50 no-print">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 font-black shadow-inner">
                <Zap className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight text-white">
                    Online Subscription Payment &amp; Receipt
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Instant Activation
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {partnerName} • ID: <span className="font-mono text-indigo-200">{partnerId}</span>
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="bg-indigo-600 text-white px-6 py-2 text-xs font-bold flex items-center justify-between animate-in slide-in-from-top duration-200 no-print">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-white/80 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Step Progress Stepper */}
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between overflow-x-auto text-xs no-print">
            <div className="flex items-center gap-6 min-w-[500px]">
              <div
                className={`flex items-center gap-2 font-bold cursor-pointer transition-colors ${
                  currentStep === "select_plan" ? "text-indigo-600" : "text-slate-600"
                }`}
                onClick={() => currentStep !== "gateway_processing" && setCurrentStep("select_plan")}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep === "select_plan" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  1
                </div>
                <span>Select Plan</span>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

              <div
                className={`flex items-center gap-2 font-bold cursor-pointer transition-colors ${
                  currentStep === "pay_fee" ? "text-indigo-600" : "text-slate-600"
                }`}
                onClick={() => currentStep !== "gateway_processing" && setCurrentStep("pay_fee")}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep === "pay_fee" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  2
                </div>
                <span>Review Plan</span>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

              <div
                className={`flex items-center gap-2 font-bold ${
                  currentStep === "gateway_processing" ? "text-indigo-600" : "text-slate-400"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep === "gateway_processing" ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  3
                </div>
                <span>Payment Gateway</span>
              </div>

              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

              <div
                className={`flex items-center gap-2 font-bold ${
                  currentStep === "receipt" ? "text-emerald-700" : "text-slate-400"
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                  currentStep === "receipt" ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"
                }`}>
                  4
                </div>
                <span>Online Receipt &amp; QR</span>
              </div>
            </div>

            {/* Audience Toggle (Travel Partner vs. Customer) */}
            <div className="flex items-center bg-slate-200 p-0.5 rounded-xl text-[11px] font-bold">
              <button
                onClick={() => setAudience("partner")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  audience === "partner" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Travel Partner
              </button>
              <button
                onClick={() => setAudience("customer")}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  audience === "customer" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Customer / Yatri
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">

            {/* =========================================================================
                STEP 1: SELECT SUBSCRIPTION PLAN
               ========================================================================= */}
            {currentStep === "select_plan" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                {/* Billing Period Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Choose Subscription Term
                    </h3>
                    <p className="text-xs text-slate-500">
                      Annual plans include flat 18% ITC-claimable GST invoices with instant renewal locking.
                    </p>
                  </div>

                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      onClick={() => setBillingPeriod("1 Month")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        billingPeriod === "1 Month" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      1 Month
                    </button>
                    <button
                      onClick={() => setBillingPeriod("6 Months")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        billingPeriod === "6 Months" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      6 Months
                    </button>
                    <button
                      onClick={() => setBillingPeriod("1 Year")}
                      className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                        billingPeriod === "1 Year" ? "bg-indigo-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      1 Year (Recommended)
                    </button>
                  </div>
                </div>

                {/* Plans Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {availablePlans.map((plan) => {
                    const isSelected = selectedPlan.id === plan.id;
                    const { baseFee: pBase, taxAmount: pTax, totalPaid: pTotal } = calculateFees(plan);

                    return (
                      <div
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`rounded-2xl border-2 p-5 bg-white flex flex-col justify-between transition-all cursor-pointer shadow-xs hover:shadow-md relative ${
                          isSelected
                            ? "border-indigo-600 ring-2 ring-indigo-600/20 shadow-md bg-indigo-50/20"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        {plan.recommended && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-xs tracking-wider">
                            ★ Most Popular Plan
                          </div>
                        )}

                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                {plan.billingPeriod}
                              </span>
                              {isSelected && (
                                <span className="flex items-center gap-1 text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                                  <Check className="w-3.5 h-3.5" /> Selected
                                </span>
                              )}
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mt-1">{plan.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 leading-snug">{plan.tagline}</p>
                          </div>

                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-slate-900">
                                ₹{pBase.toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">/ {billingPeriod}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                              <span>+ 18% GST (₹{pTax.toLocaleString("en-IN")})</span>
                              <strong className="text-slate-800 font-mono">Total: ₹{pTotal.toLocaleString("en-IN")}</strong>
                            </div>
                          </div>

                          <div className="space-y-2 border-t border-slate-100 pt-3">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Included Entitlements
                            </p>
                            {plan.features.slice(0, 4).map((feat, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <span className="leading-tight">{feat}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedPlan(plan);
                              handleProceedToPayment();
                            }}
                            className={`w-full py-2.5 rounded-xl text-xs font-black shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                              isSelected
                                ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30"
                                : "bg-slate-900 hover:bg-slate-800 text-white"
                            }`}
                          >
                            <span>Select &amp; Proceed</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Direct Action Bottom Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        Selected: <strong className="text-indigo-600">{selectedPlan.name} ({billingPeriod})</strong>
                      </div>
                      <div className="text-xs text-slate-500">
                        Base: ₹{baseFee.toLocaleString("en-IN")} + 18% GST: ₹{taxAmount.toLocaleString("en-IN")} = <strong className="text-emerald-700 font-mono font-bold">₹{totalPaid.toLocaleString("en-IN")} Total Payable</strong>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Proceed to Secure Gateway (₹{totalPaid.toLocaleString("en-IN")})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 2: SELECT PAYMENT METHOD & CONFIRM
               ========================================================================= */}
            {currentStep === "pay_fee" && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left 2 Cols: Payment Method Selector */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-extrabold text-slate-900">
                        Select Payment Method
                      </h3>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-emerald-600" /> 256-Bit SSL Encrypted
                      </span>
                    </div>

                    {/* Method Selector Tabs */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                      {[
                        { id: "upi", label: "UPI", icon: Smartphone },
                        { id: "credit_card", label: "Credit Card", icon: CreditCard },
                        { id: "debit_card", label: "Debit Card", icon: CreditCard },
                        { id: "qr_code", label: "QR Code", icon: QrCode },
                        { id: "netbanking", label: "NetBanking", icon: Building },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isChosen = paymentMethod === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setPaymentMethod(item.id as PaymentMethodType)}
                            className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                              isChosen
                                ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-xs ring-1 ring-indigo-500/30 font-bold"
                                : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            <span className="text-xs">{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Method Details Box */}
                    <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                      {/* 1. UPI */}
                      {paymentMethod === "upi" && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Popular UPI Apps:</span>
                            <span className="text-[11px] text-emerald-600 font-bold">Instant Auto-Verification</span>
                          </div>

                          <div className="grid grid-cols-4 gap-2">
                            {[
                              { id: "gpay", name: "Google Pay" },
                              { id: "phonepe", name: "PhonePe" },
                              { id: "paytm", name: "Paytm" },
                              { id: "bhim", name: "BHIM UPI" },
                            ].map((app) => (
                              <button
                                key={app.id}
                                onClick={() => {
                                  setSelectedUpiApp(app.id);
                                  setUpiVpa(`partner@${app.id === "gpay" ? "okaxis" : app.id === "phonepe" ? "ybl" : "paytm"}`);
                                }}
                                className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                                  selectedUpiApp === app.id
                                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {app.name}
                              </button>
                            ))}
                          </div>

                          <div className="space-y-1.5 pt-2">
                            <label className="text-xs font-bold text-slate-700">Enter UPI ID / VPA</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={upiVpa}
                                onChange={(e) => setUpiVpa(e.target.value)}
                                placeholder="username@bank"
                                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold focus:outline-none focus:border-indigo-500 bg-slate-50"
                              />
                              <button
                                type="button"
                                className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200"
                              >
                                Verify VPA
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-400">
                              A payment notification will be triggered on your registered UPI mobile app.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 2. Credit Card */}
                      {paymentMethod === "credit_card" && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Card Number</label>
                            <div className="relative">
                              <input
                                type="text"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-slate-50 focus:outline-none focus:border-indigo-500"
                              />
                              <span className="absolute right-3 top-2.5 text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                                VISA / RUPAY
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700">Cardholder Name</label>
                              <input
                                type="text"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:outline-none focus:border-indigo-500"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Expiry</label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  placeholder="MM/YY"
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-center bg-slate-50 focus:outline-none"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">CVV</label>
                                <input
                                  type="password"
                                  maxLength={3}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-center bg-slate-50 focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. Debit Card */}
                      {paymentMethod === "debit_card" && (
                        <div className="space-y-3">
                          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-amber-700 shrink-0" />
                            <span>Supported Debit Cards: RuPay, Visa Debit, MasterCard &amp; Maestro with OTP authentication.</span>
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700">Debit Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold bg-slate-50 focus:outline-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-700">Cardholder Name</label>
                              <input
                                type="text"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 focus:outline-none"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">Valid Thru</label>
                                <input
                                  type="text"
                                  value={cardExpiry}
                                  onChange={(e) => setCardExpiry(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-center bg-slate-50"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700">CVV</label>
                                <input
                                  type="password"
                                  maxLength={3}
                                  value={cardCvv}
                                  onChange={(e) => setCardCvv(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold text-center bg-slate-50"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. QR Code */}
                      {paymentMethod === "qr_code" && (
                        <div className="space-y-3 text-center">
                          <p className="text-xs font-bold text-slate-700">
                            Scan with any UPI App (Google Pay, PhonePe, Paytm, BHIM)
                          </p>
                          <div className="inline-block p-4 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm">
                            {qrCodeDataUrl ? (
                              <img src={qrCodeDataUrl} alt="Dynamic Payment QR" className="w-40 h-40 mx-auto" />
                            ) : (
                              <div className="w-40 h-40 bg-slate-100 flex items-center justify-center text-slate-400">
                                <QrCode className="w-12 h-12" />
                              </div>
                            )}
                            <div className="mt-2 text-xs font-mono font-black text-slate-900">
                              ₹{totalPaid.toLocaleString("en-IN")}
                            </div>
                            <p className="text-[10px] text-slate-400">BharatYatra Merchant QR</p>
                          </div>
                          <p className="text-[11px] text-slate-500">
                            Dynamic single-use QR. Auto-expires in 09:45 mins.
                          </p>
                        </div>
                      )}

                      {/* 5. NetBanking */}
                      {paymentMethod === "netbanking" && (
                        <div className="space-y-3">
                          <label className="text-xs font-bold text-slate-700">Select Banking Gateway</label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National"].map((b) => (
                              <button
                                key={b}
                                onClick={() => setSelectedBank(b)}
                                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                                  selectedBank === b
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {b}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Col: Invoice & Order Summary */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Fee Breakdown
                    </h3>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs">
                      <div className="flex justify-between pb-2 border-b border-slate-100">
                        <span className="text-slate-500">Plan:</span>
                        <strong className="text-slate-900">{selectedPlan.name}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Term:</span>
                        <span className="font-bold text-slate-800">{billingPeriod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Subscription Fee:</span>
                        <span className="font-mono font-bold text-slate-900">₹{baseFee.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tax / GST (18%):</span>
                        <span className="font-mono font-bold text-slate-900">₹{taxAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400 pb-1">
                        <span>(CGST 9% + SGST 9%)</span>
                        <span>Section 31 ITC Valid</span>
                      </div>
                      <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-emerald-700">
                        <span>Total Paid:</span>
                        <span className="font-mono text-base">₹{totalPaid.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold">
                        <CheckCheck className="w-4 h-4 text-emerald-600" />
                        <span>Instant Online Receipt</span>
                      </div>
                      <p className="text-[11px] text-emerald-800 leading-snug">
                        Upon successful payment, an official online receipt with QR code verification reference will be generated for download and print.
                      </p>
                    </div>

                    <div className="pt-2 space-y-2">
                      <button
                        onClick={handleExecutePayment}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-indigo-600 hover:opacity-95 text-white text-xs font-black shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Authorise &amp; Pay ₹{totalPaid.toLocaleString("en-IN")}</span>
                      </button>

                      <button
                        onClick={() => setCurrentStep("select_plan")}
                        className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold cursor-pointer"
                      >
                        ← Back to Plan Selection
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 3: PAYMENT GATEWAY PROCESSING & VERIFICATION
               ========================================================================= */}
            {currentStep === "gateway_processing" && (
              <div className="py-12 px-4 max-w-md mx-auto text-center space-y-6 animate-in fade-in duration-200">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200 animate-ping opacity-25" />
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-600 flex items-center justify-center text-white shadow-xl">
                    <RefreshCw className="w-8 h-8 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900">
                    Payment Gateway &amp; Verification
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    Connecting to NPCI / Banking Switch • Ref: BY-GATEWAY-2026
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 text-left space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Transaction Value:</span>
                    <strong className="font-mono text-emerald-700">₹{totalPaid.toLocaleString("en-IN")}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Method:</span>
                    <span className="font-bold text-slate-800 uppercase">{paymentMethod}</span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${gatewayStage !== "connecting" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                      <span className="text-slate-700">
                        {gatewayStage === "connecting" ? "1. Establishing 256-Bit SSL Handshake..." : "1. SSL Handshake Established ✓"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${gatewayStage === "generating_id" || gatewayStage === "activating" ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="text-slate-700">
                        {gatewayStage === "authenticating" ? "2. Verifying bank ledger authentication..." : gatewayStage === "generating_id" || gatewayStage === "activating" ? "2. Bank Authorization Approved ✓" : "2. Awaiting Bank Verification..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${gatewayStage === "activating" ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className="text-slate-700">
                        {gatewayStage === "generating_id" ? "3. Generating statutory Transaction ID & Receipt..." : gatewayStage === "activating" ? "3. Transaction ID Generated ✓" : "3. Transaction ID Pending..."}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${gatewayStage === "activating" ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`} />
                      <span className="text-slate-700">
                        {gatewayStage === "activating" ? "4. Activating subscription & generating QR Code..." : "4. Subscription Activation..."}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  Please do not refresh or press back button. Your subscription is being verified in real time.
                </p>
              </div>
            )}

            {/* =========================================================================
                STEP 4: ONLINE PAYMENT RECEIPT WITH VERIFICATION QR CODE
               ========================================================================= */}
            {currentStep === "receipt" && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Success Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md no-print">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black">Subscription Activated &amp; Paid Successfully!</h4>
                      <p className="text-xs text-emerald-100 flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span>Receipt: <strong className="font-mono">{generatedReceipt.receiptNumber}</strong></span>
                        <span>•</span>
                        <span>Invoice: <strong className="font-mono">{generatedReceipt.invoiceNumber}</strong></span>
                        <span>•</span>
                        <span>Txn: <strong className="font-mono">{generatedReceipt.transactionId}</strong></span>
                        <button
                          id="copy-txn-header-btn"
                          onClick={() => handleCopyTransactionId(generatedReceipt.transactionId)}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-800/80 hover:bg-emerald-900 text-[10px] text-emerald-100 font-bold border border-emerald-400/40 cursor-pointer no-print ml-1 transition-all active:scale-95"
                          title="Copy Transaction ID for tickets or emails"
                        >
                          {copiedTxn ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3 text-emerald-200" />}
                          <span>{copiedTxn ? "Copied" : "Copy ID"}</span>
                        </button>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      id="share-receipt-top-btn"
                      onClick={handleShareReceipt}
                      className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/30 shadow-xs flex items-center gap-1.5 cursor-pointer no-print transition-all active:scale-95"
                      title="Open native browser share dialog to send receipt via WhatsApp or Email"
                    >
                      <Share2 className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Share</span>
                    </button>
                    <button
                      id="dedicated-print-receipt-btn"
                      onClick={handlePrintReceipt}
                      className="px-4 py-2 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 no-print"
                      title="Print Official Online Payment Receipt"
                    >
                      <Printer className="w-4 h-4 text-indigo-600" />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      onClick={handleDownloadReceiptHtml}
                      className="px-3.5 py-2 rounded-xl bg-emerald-800/70 hover:bg-emerald-800 text-white text-xs font-bold border border-emerald-400/40 shadow-xs flex items-center gap-1.5 cursor-pointer no-print"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>

                {/* THE OFFICIAL ONLINE PAYMENT RECEIPT - TARGETED BY .printable-invoice-sheet */}
                <div
                  id="printable-subscription-receipt"
                  data-printable="true"
                  className="printable-invoice-sheet bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6"
                >
                  {/* Receipt Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-black text-indigo-950">🇮🇳 BharatYatra</span>
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                          {generatedReceipt.paymentStatus}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        BharatYatra Technologies Pvt Ltd • GSTIN: 07AAACB4410R1ZP • SAC: 998313
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Online Payment Receipt
                      </div>
                      <div className="text-sm font-mono font-black text-slate-900">
                        {generatedReceipt.receiptNumber}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {generatedReceipt.paymentDateTime}
                      </div>
                    </div>
                  </div>

                  {/* Receipt Key-Value Table matching the user's prompt specification */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                          <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-[11px]">Payment Detail</th>
                          <th className="py-2.5 px-4 font-bold uppercase tracking-wider text-[11px]">Value / Record</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Platform</td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">{generatedReceipt.platform}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Partner/Customer Name</td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">{generatedReceipt.partnerOrCustomerName}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">User/Partner ID</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">{generatedReceipt.userOrPartnerId}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Subscription Plan</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold border border-indigo-200">
                              {generatedReceipt.subscriptionPlan}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Subscription Period</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{generatedReceipt.subscriptionPeriod}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Subscription Fee</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-900">₹{generatedReceipt.subscriptionFee.toLocaleString("en-IN")}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Tax/GST</td>
                          <td className="py-2.5 px-4 font-mono text-slate-700">
                            ₹{generatedReceipt.taxGstAmount.toLocaleString("en-IN")} (18% GST - Section 31 ITC)
                          </td>
                        </tr>
                        <tr className="bg-emerald-50/50">
                          <td className="py-3 px-4 font-bold text-slate-900">Total Paid</td>
                          <td className="py-3 px-4 font-mono font-black text-emerald-800 text-sm">
                            ₹{generatedReceipt.totalPaid.toLocaleString("en-IN")}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Payment Method</td>
                          <td className="py-2.5 px-4 font-bold text-slate-800">{generatedReceipt.paymentMethod}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Transaction ID</td>
                          <td className="py-2.5 px-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 select-all text-xs tracking-tight">
                                {generatedReceipt.transactionId}
                              </span>
                              <button
                                id="copy-transaction-id-btn"
                                onClick={() => handleCopyTransactionId(generatedReceipt.transactionId)}
                                className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer no-print active:scale-95 shadow-2xs ${
                                  copiedTxn
                                    ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                    : "bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 border border-slate-300"
                                }`}
                                title="Copy Transaction ID to clipboard to paste into support tickets or emails"
                              >
                                {copiedTxn ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>Copied!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span>Copy Transaction ID</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 no-print">
                              Quote this reference when contacting partner support or drafting billing emails.
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Payment Date &amp; Time</td>
                          <td className="py-2.5 px-4 text-slate-800">{generatedReceipt.paymentDateTime}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Payment Status</td>
                          <td className="py-2.5 px-4">
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-300">
                              {generatedReceipt.paymentStatus} ✓
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Receipt Number</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{generatedReceipt.receiptNumber}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Invoice Number</td>
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{generatedReceipt.invoiceNumber}</td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 text-slate-500 font-medium">Next Renewal Date</td>
                          <td className="py-2.5 px-4 font-bold text-emerald-700">{generatedReceipt.nextRenewalDate}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* QR Code for QC / Verification Section */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      {qrCodeDataUrl ? (
                        <div className="p-2 bg-white rounded-xl border border-slate-200 shadow-xs shrink-0">
                          <img
                            src={qrCodeDataUrl}
                            alt="Receipt Verification QR Code"
                            className="w-28 h-28 object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-28 h-28 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                          <QrCode className="w-10 h-10" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-indigo-600" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                            QR Code for QC / Verification
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 max-w-md">
                          The receipt QR contains a secure receipt-verification reference, strictly omitting card/UPI credentials in compliance with security guidelines.
                        </p>
                        <div className="text-[11px] font-mono text-slate-400 pt-1">
                          Ref: {generatedReceipt.verificationCode}
                        </div>
                      </div>
                    </div>

                    {/* Scan QR Verification Trigger */}
                    <div className="shrink-0">
                      <button
                        onClick={() => setIsVerificationModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
                      >
                        <QrCode className="w-4 h-4 text-emerald-400" />
                        <span>Scan QR → Payment Verification</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 no-print">
                  <button
                    onClick={() => {
                      setCurrentStep("select_plan");
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                  >
                    ← Browse Other Plans
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      id="share-receipt-bottom-btn"
                      onClick={handleShareReceipt}
                      className="px-4 py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-95 no-print"
                      title="Open native browser share dialog to send receipt via WhatsApp or Email"
                    >
                      <Share2 className="w-4 h-4 text-indigo-600" />
                      <span>Share</span>
                    </button>
                    <button
                      id="dedicated-print-receipt-bottom-btn"
                      onClick={handlePrintReceipt}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 no-print"
                      title="Trigger browser print for .printable-invoice-sheet"
                    >
                      <Printer className="w-4 h-4 text-amber-400" />
                      <span>Print Receipt</span>
                    </button>
                    <button
                      onClick={handleDownloadReceiptHtml}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-sm flex items-center gap-1.5 cursor-pointer no-print"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Receipt PDF</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-sm cursor-pointer no-print"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Receipt Options Dialog (Native Browser Share / WhatsApp / Email) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Share Payment Receipt</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Receipt #{generatedReceipt.receiptNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Send this verified subscription payment confirmation to your finance desk, accounting, or business partners:
            </p>

            {/* Share Option Cards */}
            <div className="grid grid-cols-1 gap-2.5">
              {/* WhatsApp Share */}
              <button
                id="share-whatsapp-btn"
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 transition-all cursor-pointer font-bold text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-emerald-950 font-black flex items-center gap-1.5">
                      <span>Send via WhatsApp</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-200 text-emerald-800 font-bold">Direct Link</span>
                    </div>
                    <div className="text-[11px] text-emerald-700 font-normal">Pre-filled message with receipt &amp; verification QR link</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Email Share */}
              <button
                id="share-email-btn"
                onClick={handleShareEmail}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-900 transition-all cursor-pointer font-bold text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-blue-950 font-black flex items-center gap-1.5">
                      <span>Send via Email</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-200 text-blue-800 font-bold">Formatted</span>
                    </div>
                    <div className="text-[11px] text-blue-700 font-normal">Pre-filled subject with tax details &amp; renewal info</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Native Browser Share (if supported) */}
              {typeof navigator !== "undefined" && typeof navigator.share === "function" && (
                <button
                  id="share-native-dialog-btn"
                  onClick={async () => {
                    try {
                      await navigator.share({
                        title: `BharatYatra Subscription Receipt - ${generatedReceipt.receiptNumber}`,
                        text: getReceiptShareText(),
                        url: generatedReceipt.qrVerificationUrl,
                      });
                      setIsShareModalOpen(false);
                      setToastMessage("Receipt shared successfully via browser dialog!");
                      setTimeout(() => setToastMessage(null), 3000);
                    } catch (e: any) {
                      if (e?.name !== "AbortError") {
                        console.warn("Native share error:", e);
                      }
                    }
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200 text-indigo-900 transition-all cursor-pointer font-bold text-xs group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div className="text-left">
                      <div className="text-indigo-950 font-black">Native Browser Share Dialog</div>
                      <div className="text-[11px] text-indigo-700 font-normal">Share to device apps, AirDrop, Messages &amp; more</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}

              {/* Copy Formatted Receipt Text */}
              <button
                id="copy-share-text-btn"
                onClick={handleCopyShareText}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all cursor-pointer font-bold text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    {copiedShareText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <div className="text-slate-900 font-black">
                      {copiedShareText ? "Copied to Clipboard!" : "Copy Formatted Receipt Text"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">Ready to paste directly into support tickets or chats</div>
                  </div>
                </div>
                <span className="text-[11px] text-indigo-600 font-bold">{copiedShareText ? "Copied!" : "Copy"}</span>
              </button>
            </div>

            {/* Collapsible preview */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                <span className="font-bold uppercase tracking-wider text-[10px]">Message Preview</span>
                <span className="font-mono text-[10px]">Ready for WhatsApp / Email</span>
              </div>
              <pre className="text-[10px] text-slate-700 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto bg-white p-2.5 rounded-xl border border-slate-200">
                {getReceiptShareText()}
              </pre>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QC / Verification Modal Triggered by Scan QR */}
      <ReceiptVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        receipt={generatedReceipt}
      />
    </>
  );
}
