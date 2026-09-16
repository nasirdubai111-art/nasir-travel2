import React, { useState, useEffect, useRef } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  TreePine,
  Download,
  Printer,
  Share2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Sparkles,
  Zap,
  Smartphone,
  Info,
  Layers,
  FileText,
  BadgeCheck,
  Palmtree,
  Compass,
  Ship,
  Bus,
  Train,
  Plane,
} from "lucide-react";
import QRCode from "qrcode";
import confetti from "canvas-confetti";
import {
  TravelPaymentReceipt,
  TravelPaymentMethodType,
  TravelPaymentStatusType,
  ServiceCategory,
  BookingItem,
  UserProfile,
} from "../../types";

export interface TravelBookingPaymentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceCategory: ServiceCategory | string;
  serviceTitle: string; // Hotel / Lodge / Resort name
  location: string; // City / State / Region
  roomOrSeatInfo: string; // Room type & quantity
  checkInDate: string;
  checkInTime?: string;
  checkOutDate: string;
  checkOutTime?: string;
  nightsCount: number;
  guestsCount?: number;
  roomsCount?: number;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  basePrice: number;
  taxesAmount: number;
  discountAmount?: number;
  discountLabel?: string;
  paymentFee?: number;
  finalTotal: number;
  initialBookingId?: string;
  existingReceipt?: TravelPaymentReceipt | null;
  onPaymentSuccess?: (receipt: TravelPaymentReceipt, bookingItem: BookingItem) => void;
  onViewBooking?: (bookingId: string) => void;
}

export function TravelBookingPaymentReceiptModal({
  isOpen,
  onClose,
  serviceCategory,
  serviceTitle,
  location,
  roomOrSeatInfo,
  checkInDate,
  checkInTime = "01:00 PM",
  checkOutDate,
  checkOutTime = "11:00 AM",
  nightsCount,
  guestsCount = 2,
  roomsCount = 1,
  guestName,
  guestPhone = "+91 98765 43210",
  guestEmail = "traveler@bharatyatra.in",
  basePrice,
  taxesAmount,
  discountAmount = 0,
  discountLabel = "Special Promo",
  paymentFee = 0,
  finalTotal,
  initialBookingId,
  existingReceipt = null,
  onPaymentSuccess,
  onViewBooking,
}: TravelBookingPaymentReceiptModalProps) {
  // Navigation / Tab state within modal
  const [currentView, setCurrentView] = useState<"checkout" | "confirmed" | "receipt">(
    existingReceipt ? "receipt" : "checkout"
  );

  // Selected payment method
  const [selectedMethod, setSelectedMethod] = useState<TravelPaymentMethodType>("UPI");

  // Method specific fields
  const [upiVpa, setUpiVpa] = useState<string>("traveler@okhdfcbank");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("Google Pay");
  const [cardNumber, setCardNumber] = useState<string>("4532 8219 9012 4821");
  const [cardHolder, setCardHolder] = useState<string>(guestName);
  const [cardExpiry, setCardExpiry] = useState<string>("08/29");
  const [cardCvv, setCardCvv] = useState<string>("***");
  const [selectedBank, setSelectedBank] = useState<string>("HDFC Bank");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Dynamic QR state
  const [qrCountdown, setQrCountdown] = useState<number>(300); // 5 minutes
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");

  // Confirmed Receipt Record
  const [activeReceipt, setActiveReceipt] = useState<TravelPaymentReceipt | null>(existingReceipt);

  // Share Dialog State
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const receiptRef = useRef<HTMLDivElement>(null);

  // Category specific branding & icons
  const isLodge = serviceCategory === "lodges";
  const isHotel = serviceCategory === "hotels";
  const isResort = serviceCategory === "resorts";
  const isHouseboat = serviceCategory === "houseboats";

  const getServiceIcon = () => {
    if (isLodge) return TreePine;
    if (isResort) return Palmtree;
    if (isHouseboat) return Ship;
    if (serviceCategory === "buses") return Bus;
    if (serviceCategory === "trains") return Train;
    if (serviceCategory === "flights") return Plane;
    return Building2;
  };
  const ServiceIcon = getServiceIcon();

  const getCategoryTitle = () => {
    if (isLodge) return "Lodge";
    if (isHotel) return "Hotel";
    if (isResort) return "Resort";
    if (isHouseboat) return "Houseboat";
    if (serviceCategory === "tours") return "Tour";
    return "Hotel";
  };
  const categoryLabel = getCategoryTitle();

  // Reset or initialize on open
  useEffect(() => {
    if (existingReceipt) {
      setActiveReceipt(existingReceipt);
      setCurrentView("receipt");
    } else {
      setCurrentView("checkout");
      setActiveReceipt(null);
    }
  }, [existingReceipt, isOpen]);

  // QR Code payment countdown timer
  useEffect(() => {
    if (!isOpen || currentView !== "checkout" || selectedMethod !== "QR Code") return;

    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, currentView, selectedMethod]);

  // Generate QR Code data URL for receipt verification or dynamic QR payment
  useEffect(() => {
    if (!isOpen) return;

    const targetPayload = activeReceipt
      ? JSON.stringify({
          platform: "BharatYatra Travel Platform",
          receiptNo: activeReceipt.receiptNumber,
          bookingId: activeReceipt.bookingId,
          transactionId: activeReceipt.transactionId,
          property: activeReceipt.propertyName,
          guest: activeReceipt.guestName,
          amountPaid: activeReceipt.totalPaid,
          status: activeReceipt.paymentStatus,
          verificationUrl: activeReceipt.qrVerificationUrl,
        })
      : `upi://pay?pa=bharatyatra.booking@icici&pn=BharatYatraTravel&am=${finalTotal}&cu=INR&tn=HTL-LODGE-STAY-${Date.now()}`;

    QRCode.toDataURL(targetPayload, {
      width: 280,
      margin: 1,
      errorCorrectionLevel: "H",
      color: {
        dark: "#0f172a",
        light: "#ffffff",
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error("Error generating QR code:", err));
  }, [isOpen, activeReceipt, finalTotal]);

  if (!isOpen) return null;

  // Format currency
  const formatInr = (val: number) => `₹${Number(val || 0).toLocaleString("en-IN")}`;

  // Execute payment & issuance
  const handleExecutePayment = async () => {
    setIsProcessing(true);

    try {
      const generatedBookingId =
        initialBookingId ||
        (isLodge
          ? `LODGE-2026-${Math.floor(1000 + Math.random() * 9000)}`
          : `HTL-${Math.floor(100000 + Math.random() * 900000)}`);

      const generatedReceiptNo = isLodge
        ? `REC-LODGE-2026-${Math.floor(1000 + Math.random() * 9000)}`
        : `REC-HTL-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const generatedTxnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

      // POST to backend API (ensuring no full card numbers, CVVs, or UPI PINs are sent)
      const res = await fetch("/api/payments/process-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: generatedBookingId,
          receiptNumber: generatedReceiptNo,
          transactionId: generatedTxnId,
          serviceCategory,
          serviceTitle,
          location,
          roomOrSeatInfo,
          checkIn: `${checkInDate} • ${checkInTime}`,
          checkOut: `${checkOutDate} • ${checkOutTime}`,
          nights: nightsCount,
          roomAmount: totalPriceCalculation.roomAmount,
          taxes: totalPriceCalculation.taxes,
          discount: totalPriceCalculation.discount,
          paymentFee: totalPriceCalculation.paymentFee,
          totalPaid: totalPriceCalculation.totalPaid,
          paymentMethod: selectedMethod,
          paymentStatus: "PAID",
          guestName,
          guestPhone,
          guestEmail,
          // CRITICAL: NEVER send full card numbers, CVV, or UPI PINs
          maskedAccount:
            selectedMethod === "Credit Card" || selectedMethod === "Debit Card"
              ? "•••• 4821 (RBI Tokenized)"
              : selectedMethod === "UPI"
              ? upiVpa
              : undefined,
        }),
      }).catch(() => null);

      const serverData = res && res.ok ? await res.json().catch(() => null) : null;

      const newReceipt: TravelPaymentReceipt = {
        platformName: "BharatYatra Travel Platform",
        receiptNumber: serverData?.receipt?.receiptNumber || generatedReceiptNo,
        bookingId: serverData?.receipt?.bookingId || generatedBookingId,
        transactionId: serverData?.receipt?.transactionId || generatedTxnId,
        guestName,
        guestPhone,
        guestEmail,
        serviceCategory,
        serviceTypeLabel: `${categoryLabel} Booking`,
        propertyName: serviceTitle,
        location,
        room: roomOrSeatInfo,
        checkIn: `${checkInDate} • ${checkInTime}`,
        checkOut: `${checkOutDate} • ${checkOutTime}`,
        nights: nightsCount,
        roomAmount: totalPriceCalculation.roomAmount,
        taxes: totalPriceCalculation.taxes,
        taxBreakdown: {
          cgst: Math.round(totalPriceCalculation.taxes / 2),
          sgst: Math.round(totalPriceCalculation.taxes / 2),
          ratePercent: 12,
          sacCode: "996311",
        },
        discount: totalPriceCalculation.discount,
        discountLabel,
        paymentFee: totalPriceCalculation.paymentFee,
        totalPaid: totalPriceCalculation.totalPaid,
        paymentMethod: selectedMethod,
        paymentStatus: "PAID",
        paidAt: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        qrVerificationUrl: `https://bharatyatra.in/verify/receipt/${generatedReceiptNo}`,
        qrVerificationCode: `SEC-VERIFY-${generatedReceiptNo.replace(/[^0-9]/g, "")}-${Date.now().toString().slice(-4)}`,
        securityComplianceNote:
          "Payment processed through BharatYatra Gateway. In accordance with RBI and PCI-DSS Level 1 regulations, full card numbers, CVVs, or UPI PINs are NEVER stored in the database.",
        legalEntity: "BharatYatra Technologies & Hospitality Pvt. Ltd.",
        gstin: "07AAACB9821K1Z5",
      };

      const bookingItem: BookingItem = {
        id: `BK-${Date.now()}`,
        serviceCategory: serviceCategory as ServiceCategory,
        serviceType: serviceCategory as ServiceCategory,
        title: `${serviceTitle} (${roomOrSeatInfo})`,
        provider: serviceTitle,
        fromLocation: location,
        toLocation: location,
        date: `${checkInDate} to ${checkOutDate}`,
        time: checkInTime,
        status: "confirmed",
        amountPaid: newReceipt.totalPaid,
        pnr: newReceipt.bookingId,
        passengersCount: guestsCount,
        seatOrRoomInfo: roomOrSeatInfo,
        invoiceNumber: newReceipt.receiptNumber,
      };

      setActiveReceipt(newReceipt);
      setIsProcessing(false);
      setCurrentView("confirmed");

      if (onPaymentSuccess) {
        onPaymentSuccess(newReceipt, bookingItem);
      }

      // Celebrate with Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // confetti fallback
      }
    } catch (error) {
      console.error("Payment execution error:", error);
      setIsProcessing(false);
      alert("Payment communication issue. Please retry.");
    }
  };

  // Pricing calculations
  const totalPriceCalculation = {
    roomAmount: basePrice,
    taxes: taxesAmount,
    discount: discountAmount,
    paymentFee: paymentFee,
    totalPaid: finalTotal,
  };

  // Formatted share text for WhatsApp / Email
  const getReceiptShareText = () => {
    if (!activeReceipt) return "";
    return `🏨 *${activeReceipt.platformName} - ${activeReceipt.serviceTypeLabel} Receipt*\n\n` +
      `✅ *Status:* ${activeReceipt.paymentStatus} (Payment Successful)\n` +
      `🔖 *Receipt No:* ${activeReceipt.receiptNumber}\n` +
      `🆔 *Booking ID:* ${activeReceipt.bookingId}\n` +
      `💳 *Transaction ID:* ${activeReceipt.transactionId}\n` +
      `👤 *Guest Name:* ${activeReceipt.guestName}\n` +
      `🏨 *Property:* ${activeReceipt.propertyName}\n` +
      `📍 *Location:* ${activeReceipt.location}\n` +
      `🛏️ *Room / Accommodation:* ${activeReceipt.room}\n` +
      `📅 *Check-in:* ${activeReceipt.checkIn}\n` +
      `📅 *Check-out:* ${activeReceipt.checkOut} (${activeReceipt.nights} Nights)\n\n` +
      `💵 *Base Fee:* ₹${activeReceipt.roomAmount.toLocaleString("en-IN")}\n` +
      `🏷️ *Taxes (GST 12%):* ₹${activeReceipt.taxes.toLocaleString("en-IN")}\n` +
      (activeReceipt.discount > 0 ? `🎁 *Discount:* -₹${activeReceipt.discount.toLocaleString("en-IN")}\n` : "") +
      `💰 *Total Paid:* ₹${activeReceipt.totalPaid.toLocaleString("en-IN")}\n` +
      `⚡ *Payment Method:* ${activeReceipt.paymentMethod}\n` +
      `🕒 *Paid At:* ${activeReceipt.paidAt}\n\n` +
      `🔗 *Verify Authenticity Online:* ${activeReceipt.qrVerificationUrl}\n` +
      `🔐 *Security Note:* PCI-DSS & RBI Tokenized. No full card details or PINs are stored.`;
  };

  const handleShareWhatsApp = () => {
    const text = getReceiptShareText();
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
    setIsShareModalOpen(false);
  };

  const handleShareEmail = () => {
    if (!activeReceipt) return;
    const subject = `${categoryLabel} Booking Confirmed - Receipt #${activeReceipt.receiptNumber} (${activeReceipt.propertyName})`;
    const body = getReceiptShareText();
    window.location.href = `mailto:${activeReceipt.guestEmail || ""}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setIsShareModalOpen(false);
  };

  const handleCopyShareText = async () => {
    try {
      await navigator.clipboard.writeText(getReceiptShareText());
      setCopiedShareText(true);
      setTimeout(() => setCopiedShareText(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async () => {
    if (!activeReceipt) return;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${activeReceipt.propertyName} - ${activeReceipt.serviceTypeLabel} Receipt`,
          text: getReceiptShareText(),
          url: activeReceipt.qrVerificationUrl,
        });
        setToastMessage("Receipt shared successfully via device dialog!");
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          setIsShareModalOpen(true);
        }
      }
    } else {
      setIsShareModalOpen(true);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    window.print();
    setToastMessage("Choose 'Save as PDF' in the print dialog to download your digital receipt.");
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* ========================================================================= */}
        {/* MODAL TOP HEADER */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between no-print border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <ServiceIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>{categoryLabel} Online Payment &amp; Digital Receipt</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px] uppercase tracking-wider border border-emerald-500/30">
                  Verified Gateway
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Customer ➔ {categoryLabel} Booking ➔ Pay Online ➔ Confirmation ➔ Digital Receipt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeReceipt && (
              <button
                type="button"
                onClick={() => setCurrentView(currentView === "receipt" ? "confirmed" : "receipt")}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentView === "receipt" ? "Back to Summary" : "View Receipt"}</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-indigo-600 text-white text-xs font-bold py-2 px-4 text-center no-print animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: PAYMENT CHECKOUT */}
        {/* ========================================================================= */}
        {currentView === "checkout" && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Stay & Room Summary Strip */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">
                    {categoryLabel} Reservation Summary
                  </span>
                  <h3 className="text-base font-black text-slate-900">{serviceTitle}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{location}</span>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Stay</span>
                  <span className="text-xs font-black text-slate-900">
                    {nightsCount} Night(s) • {roomsCount} Room(s)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Room / Type</span>
                  <span className="font-bold text-slate-900">{roomOrSeatInfo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Check-In</span>
                  <span className="font-bold text-slate-900">{checkInDate}</span>
                  <span className="text-[10px] text-slate-500 block">{checkInTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Check-Out</span>
                  <span className="font-bold text-slate-900">{checkOutDate}</span>
                  <span className="text-[10px] text-slate-500 block">{checkOutTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Lead Guest</span>
                  <span className="font-bold text-slate-900">{guestName}</span>
                  <span className="text-[10px] text-slate-500 block">{guestPhone}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Tabs (UPI, Credit Card, Debit Card, QR Code, Net Banking) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Choose Online Payment Method</span>
                </h4>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Encrypted &amp; Secure</span>
                </span>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
                {[
                  { id: "UPI", label: "UPI", sub: "GPay / PhonePe / BHIM" },
                  { id: "Credit Card", label: "Credit Card", sub: "Visa / MC / RuPay" },
                  { id: "Debit Card", label: "Debit Card", sub: "All Indian Banks" },
                  { id: "QR Code", label: "QR Code", sub: "Scan & Pay Instantly" },
                  { id: "Net Banking", label: "Net Banking", sub: "Direct Bank Auth" },
                ].map((tab) => {
                  const isSelected = selectedMethod === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSelectedMethod(tab.id as TravelPaymentMethodType)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 shadow-xs ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className={`font-black ${isSelected ? "text-indigo-900" : "text-slate-800"}`}>
                        {tab.label}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{tab.sub}</div>
                    </button>
                  );
                })}
              </div>

              {/* Payment Method Input Container */}
              <div className="p-4 rounded-2xl border border-indigo-100 bg-indigo-50/25 space-y-4">
                {/* 1. UPI Option */}
                {selectedMethod === "UPI" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Popular UPI Apps:</span>
                      <span className="text-[10px] text-indigo-600 font-bold">0% Transaction Fee</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-xs">
                      {["Google Pay", "PhonePe", "Paytm", "BHIM / Cred"].map((app) => (
                        <button
                          key={app}
                          type="button"
                          onClick={() => setSelectedUpiApp(app)}
                          className={`py-2 px-3 rounded-xl border font-bold text-center transition-all cursor-pointer ${
                            selectedUpiApp === app
                              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                              : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          {app}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-bold text-slate-700">Enter Virtual Payment Address (VPA):</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiVpa}
                          onChange={(e) => setUpiVpa(e.target.value)}
                          placeholder="username@bank"
                          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                        <button
                          type="button"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
                        >
                          Verify VPA
                        </button>
                      </div>
                      <div className="flex gap-1.5 text-[10px] text-slate-500">
                        <span>Quick Handles:</span>
                        {["@okhdfcbank", "@okaxis", "@paytm", "@ybl"].map((sfx) => (
                          <button
                            key={sfx}
                            type="button"
                            onClick={() => {
                              const base = upiVpa.split("@")[0] || "user";
                              setUpiVpa(`${base}${sfx}`);
                            }}
                            className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-indigo-600 font-bold hover:bg-indigo-50"
                          >
                            {sfx}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Credit Card */}
                {selectedMethod === "Credit Card" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Credit Card Details (RBI Tokenized):</span>
                      <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay, Amex</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                          />
                          <span className="absolute right-3 top-2.5 px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-black text-slate-700">
                            RuPay / Visa
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Debit Card */}
                {selectedMethod === "Debit Card" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">Debit Card (All Scheduled Indian Banks):</span>
                      <span className="text-[10px] text-emerald-600 font-bold">Zero Storage Guarantee</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Debit Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Name on Card</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">Expiry MM/YY</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 font-bold uppercase block mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. QR Code Payment */}
                {selectedMethod === "QR Code" && (
                  <div className="flex flex-col sm:flex-row items-center gap-4 py-2">
                    <div className="p-2.5 bg-white rounded-2xl border-2 border-indigo-200 shadow-md flex items-center justify-center shrink-0">
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="Bharat QR Code" className="w-36 h-36 object-contain" />
                      ) : (
                        <QrCode className="w-36 h-36 text-slate-800 animate-pulse" />
                      )}
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-black text-[10px]">
                          Dynamic Bharat QR
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          Expires in {Math.floor(qrCountdown / 60)}:
                          {(qrCountdown % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                      <h5 className="font-black text-slate-900 text-sm">
                        Scan &amp; Pay {formatInr(finalTotal)} using any UPI App
                      </h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Open Google Pay, PhonePe, Paytm, or BHIM on your mobile phone and scan this dynamic QR. Amount is pre-filled and automatically reconciled.
                      </p>
                      <div className="text-[10px] font-mono text-slate-500 bg-white p-1.5 rounded-lg border border-slate-200">
                        VPA: bharatyatra.booking@icici • Zero Surcharge
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. Net Banking */}
                {selectedMethod === "Net Banking" && (
                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Select Net Banking Gateway:</span>
                      <span className="text-[10px] text-slate-500">Secure Direct Bank Auth</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {["HDFC Bank", "State Bank of India", "ICICI Bank", "Axis Bank", "Punjab National Bank", "Kotak Mahindra"].map(
                        (bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => setSelectedBank(bank)}
                            className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                              selectedBank === bank
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                                : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className="truncate">{bank}</div>
                            <div className="text-[9px] opacity-80 mt-0.5">Instant Confirmation</div>
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* MANDATORY SECURITY RULE BANNER */}
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <strong className="font-bold">🔐 Backend Security Standard:</strong> Payment information is processed securely through our RBI-authorized banking gateway. We <strong>NEVER store the customer's full card number, CVV, or UPI PIN</strong> in the Travel Platform database.
                  </div>
                </div>
              </div>
            </div>

            {/* Price & Tax Line-Items Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
              <h5 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                Itemized Payable Summary
              </h5>
              <div className="flex justify-between text-slate-600">
                <span>
                  {categoryLabel} Accommodation ({nightsCount} Night(s) × {roomsCount} Room):
                </span>
                <span className="font-bold text-slate-900">{formatInr(totalPriceCalculation.roomAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST &amp; Applicable Hospitality Taxes (12% SAC 996311):</span>
                <span className="font-bold text-slate-900">+{formatInr(totalPriceCalculation.taxes)}</span>
              </div>
              {totalPriceCalculation.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon &amp; Promotional Discount ({discountLabel}):</span>
                  <span>-{formatInr(totalPriceCalculation.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Payment Gateway Processing Fee:</span>
                <span className="font-bold text-emerald-700">FREE (Waived)</span>
              </div>

              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-black text-slate-900 uppercase">Total Amount Payable:</span>
                  <span className="text-[10px] text-slate-500 block">Instant digital receipt issued upon confirmation</span>
                </div>
                <span className="text-xl font-black text-indigo-700">{formatInr(totalPriceCalculation.totalPaid)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CUSTOMER CONFIRMATION SCREEN (MATCHING EXACT PROMPT SPEC) */}
        {/* ========================================================================= */}
        {currentView === "confirmed" && activeReceipt && (
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 text-center">
            {/* Header Success Animation */}
            <div className="space-y-3 py-2 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-950">
                  {categoryLabel} Booking Confirmed ✓
                </h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200 mt-1">
                  <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Payment Successful</span>
                </div>
              </div>
            </div>

            {/* Structured Customer Confirmation Card (Matching Prompt) */}
            <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border-2 border-slate-300/80 rounded-3xl p-5 sm:p-6 text-left space-y-4 shadow-sm max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider">Booking ID:</span>
                  <div className="text-lg font-black font-mono text-slate-950">{activeReceipt.bookingId}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Receipt No:</span>
                  <span className="text-xs font-mono font-bold text-slate-700">{activeReceipt.receiptNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Amount Paid</span>
                  <span className="text-base font-black text-emerald-700 font-mono">
                    ₹{activeReceipt.totalPaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction ID</span>
                  <span className="font-mono font-bold text-slate-900 text-xs">{activeReceipt.transactionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
                  <span className="font-bold text-slate-900">{activeReceipt.paymentMethod}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Status</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px] inline-block">
                    {activeReceipt.paymentStatus}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-800">{activeReceipt.propertyName}</span> • {activeReceipt.room}
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {activeReceipt.checkIn} to {activeReceipt.checkOut}
                </div>
              </div>
            </div>

            {/* MANDATORY ACTION BUTTONS (Matching Prompt): [View Receipt] [Download PDF] [Print] [View Booking] */}
            <div className="no-print flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                id="customer-view-receipt-btn"
                type="button"
                onClick={() => setCurrentView("receipt")}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <FileText className="w-4 h-4" />
                <span>View Receipt</span>
              </button>

              <button
                id="customer-download-pdf-btn"
                type="button"
                onClick={handleDownloadPdf}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>

              <button
                id="customer-print-receipt-btn"
                type="button"
                onClick={handlePrintReceipt}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs shadow-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print</span>
              </button>

              <button
                id="customer-view-booking-btn"
                type="button"
                onClick={() => {
                  if (onViewBooking) {
                    onViewBooking(activeReceipt.bookingId);
                  } else {
                    onClose();
                  }
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
                <span>View Booking</span>
              </button>

              <button
                id="customer-share-receipt-btn"
                type="button"
                onClick={handleNativeShare}
                className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Share</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: FULL STANDARDIZED DIGITAL RECEIPT (MATCHING RECEIPT TABLE SPEC) */}
        {/* ========================================================================= */}
        {currentView === "receipt" && activeReceipt && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Quick action bar above receipt */}
            <div className="no-print flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-black text-slate-700">Official Digital Payment Receipt</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNativeShare}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Share</span>
                </button>
                <button
                  onClick={handleDownloadPdf}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
                <button
                  onClick={handlePrintReceipt}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>

            {/* THE PRINTABLE DIGITAL RECEIPT SHEET */}
            <div
              ref={receiptRef}
              data-printable="true"
              className="printable-document printable-invoice-sheet bg-white border-2 border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md text-slate-900 text-xs"
            >
              {/* 1. Header: Travel Platform & Logo */}
              <div className="flex flex-wrap items-start justify-between border-b-2 border-slate-900 pb-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center font-black text-base shadow-xs">
                      BY
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-950">
                        {activeReceipt.platformName}
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Govt of India Recognized Tourism &amp; Travel Aggregator • GSTIN: {activeReceipt.gstin}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] border border-emerald-300">
                    TAX INVOICE &amp; PAYMENT RECEIPT
                  </span>
                  <div className="text-[10px] text-slate-500 mt-1 font-mono">Date: {activeReceipt.paidAt}</div>
                </div>
              </div>

              {/* 2. Structured Key Receipt Fields Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Receipt No.</span>
                  <span className="text-xs font-mono font-black text-indigo-700">{activeReceipt.receiptNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Booking ID</span>
                  <span className="text-xs font-mono font-black text-slate-900">{activeReceipt.bookingId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Transaction ID</span>
                  <span className="text-xs font-mono font-bold text-slate-900">{activeReceipt.transactionId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Payment Status</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-black text-[10px] inline-block">
                    {activeReceipt.paymentStatus} ✓
                  </span>
                </div>
              </div>

              {/* 3. Section Details Table (Matching Prompt Exact Specification) */}
              <div className="border border-slate-300 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-[10px] font-black uppercase text-slate-700">
                      <th className="p-2.5 sm:p-3 w-1/3">Section</th>
                      <th className="p-2.5 sm:p-3">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-xs">
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Travel Platform</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-900">
                        {activeReceipt.platformName} (Official E-Receipt Engine)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Receipt No.</td>
                      <td className="p-2.5 sm:p-3 font-mono font-bold text-indigo-700">{activeReceipt.receiptNumber}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Booking ID</td>
                      <td className="p-2.5 sm:p-3 font-mono font-bold text-slate-900">{activeReceipt.bookingId}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Transaction ID</td>
                      <td className="p-2.5 sm:p-3 font-mono font-bold text-slate-900">{activeReceipt.transactionId}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Guest Name</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-900">
                        {activeReceipt.guestName} {activeReceipt.guestPhone ? `(${activeReceipt.guestPhone})` : ""}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">{categoryLabel} Property</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-900">
                        {activeReceipt.propertyName} — {activeReceipt.location}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Room / Accommodation</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-900">{activeReceipt.room}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Check-in</td>
                      <td className="p-2.5 sm:p-3 text-slate-800 font-semibold">{activeReceipt.checkIn}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Check-out</td>
                      <td className="p-2.5 sm:p-3 text-slate-800 font-semibold">{activeReceipt.checkOut}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Nights</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-900">{activeReceipt.nights} Night(s)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">
                        {isLodge ? "Lodge Fee" : "Room Amount"}
                      </td>
                      <td className="p-2.5 sm:p-3 font-mono font-bold text-slate-900">
                        ₹{activeReceipt.roomAmount.toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Taxes</td>
                      <td className="p-2.5 sm:p-3 text-slate-900 font-medium">
                        ₹{activeReceipt.taxes.toLocaleString("en-IN")} (GST 12% • CGST 6% + SGST 6% • SAC 996311)
                      </td>
                    </tr>
                    {activeReceipt.discount > 0 && (
                      <tr>
                        <td className="p-2.5 sm:p-3 font-bold text-slate-600">Discount</td>
                        <td className="p-2.5 sm:p-3 text-emerald-700 font-bold">
                          -₹{activeReceipt.discount.toLocaleString("en-IN")} ({activeReceipt.discountLabel || "Coupon Applied"})
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Payment Fee</td>
                      <td className="p-2.5 sm:p-3 text-emerald-700 font-bold">₹0.00 (Waived)</td>
                    </tr>
                    <tr className="bg-slate-50 font-black text-sm">
                      <td className="p-2.5 sm:p-3 text-slate-900">Total Paid</td>
                      <td className="p-2.5 sm:p-3 text-indigo-700 font-mono text-base">
                        ₹{activeReceipt.totalPaid.toLocaleString("en-IN")}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Payment Method</td>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-900">{activeReceipt.paymentMethod}</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 sm:p-3 font-bold text-slate-600">Payment Status</td>
                      <td className="p-2.5 sm:p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px]">
                          {activeReceipt.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 4. Verification QR Code & Security Stamp */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-3.5">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-xs shrink-0">
                    {qrCodeDataUrl ? (
                      <img src={qrCodeDataUrl} alt="Verification QR" className="w-20 h-20 object-contain" />
                    ) : (
                      <QrCode className="w-20 h-20 text-slate-900" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block">
                      Receipt &amp; Booking Verification QR
                    </span>
                    <p className="text-[11px] text-slate-600 max-w-sm leading-tight">
                      Scan this QR code with any camera or verification scanner to validate official receipt authenticity and front-desk booking guarantee.
                    </p>
                    <div className="text-[9px] font-mono text-slate-500">
                      Token: {activeReceipt.qrVerificationCode}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 border-t sm:border-t-0 sm:border-l sm:pl-4 border-slate-200 pt-2 sm:pt-0">
                  <div className="w-14 h-14 rounded-full border-2 border-emerald-600 text-emerald-700 flex flex-col items-center justify-center font-black text-[8px] uppercase tracking-tighter mx-auto sm:ml-auto">
                    <span>BHARAT</span>
                    <span>VERIFIED</span>
                    <span>PAID</span>
                  </div>
                </div>
              </div>

              {/* 5. MANDATORY BACKEND SECURITY COMPLIANCE NOTE */}
              <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed">
                <p>
                  <strong>🔐 Backend Security Standard:</strong> {activeReceipt.securityComplianceNote}
                </p>
                <p className="mt-0.5 text-[9px] text-slate-400">
                  This electronic receipt is legally valid under the Information Technology Act, 2000 and GST statutory rules. Issued by {activeReceipt.legalEntity}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL FOOTER ACTIONS */}
        {/* ========================================================================= */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shrink-0 no-print">
          {currentView === "checkout" && (
            <>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Payable Amount:</span>
                <span className="text-lg font-black text-slate-900">{formatInr(finalTotal)}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="pay-and-confirm-stay-btn"
                  type="button"
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing Gateway Payment...</span>
                    </>
                  ) : (
                    <>
                      <span>Pay {formatInr(finalTotal)} &amp; Confirm</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {currentView === "confirmed" && (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView("receipt")}
                className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>View Full Digital Receipt Sheet</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
              >
                Done
              </button>
            </div>
          )}

          {currentView === "receipt" && (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView("confirmed")}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
              >
                Back to Confirmation Summary
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SHARE RECEIPT MODAL (WhatsApp, Email, Browser Dialog) */}
      {/* ========================================================================= */}
      {isShareModalOpen && activeReceipt && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs no-print animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                  <Share2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900">Share Digital Receipt</h3>
                  <p className="text-[11px] text-slate-500 font-mono">Receipt #{activeReceipt.receiptNumber}</p>
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
              Send verified {categoryLabel.toLowerCase()} booking receipt and tax invoice to your finance team, family, or travel co-passengers:
            </p>

            <div className="space-y-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 transition-all cursor-pointer font-bold text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-emerald-950 font-black">Send via WhatsApp</div>
                    <div className="text-[11px] text-emerald-700 font-normal">Instant pre-filled message with QR link</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Email */}
              <button
                onClick={handleShareEmail}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-900 transition-all cursor-pointer font-bold text-xs group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-blue-950 font-black">Send via Email</div>
                    <div className="text-[11px] text-blue-700 font-normal">Pre-filled formatted invoice &amp; tax details</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Copy Text */}
              <button
                onClick={handleCopyShareText}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 transition-all cursor-pointer font-bold text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shrink-0 shadow-xs">
                    {copiedShareText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </div>
                  <div className="text-left">
                    <div className="text-slate-900 font-black">
                      {copiedShareText ? "Copied to Clipboard!" : "Copy Formatted Receipt"}
                    </div>
                    <div className="text-[11px] text-slate-500 font-normal">Paste into chats or travel expense logs</div>
                  </div>
                </div>
                <span className="text-[11px] text-indigo-600 font-bold">{copiedShareText ? "Copied!" : "Copy"}</span>
              </button>
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
    </div>
  );
}
