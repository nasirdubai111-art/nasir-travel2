import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Wallet,
  Tag,
  Download,
  Calendar,
  User,
  Phone,
  Mail,
  Building,
  Sparkles,
  Ticket,
  QrCode,
  ArrowRight,
  Globe,
  ArrowRightLeft,
} from "lucide-react";
import confetti from "canvas-confetti";
import { BookingItem, ServiceCategory, TravelOffer, UserProfile } from "../types";
import { PROMO_OFFERS } from "../data/mockTravelData";
import { SUPPORTED_CURRENCIES, convertFromInr, getCurrencyInfo } from "../data/currencyData";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  serviceCategory: ServiceCategory;
  userProfile: UserProfile;
  onConfirmBooking: (newBooking: BookingItem) => void;
}

export function BookingModal({
  isOpen,
  onClose,
  item,
  serviceCategory,
  userProfile,
  onConfirmBooking,
}: BookingModalProps) {
  const [passengerName, setPassengerName] = useState(userProfile.name);
  const [passengerPhone, setPassengerPhone] = useState(userProfile.phone);
  const [passengerEmail, setPassengerEmail] = useState(userProfile.email);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<TravelOffer | null>(null);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "wallet" | "card" | "emi">("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingItem | null>(null);

  // Currency Toggle State
  const [selectedCurrency, setSelectedCurrency] = useState<string>(userProfile.preferredCurrency || "INR");

  if (!isOpen || !item) return null;

  // Calculate Base Cost in INR
  const basePrice = item.price || item.pricePerNight || item.pricePerPerson || item.estimatedFare || 2999;
  const insuranceRatePercent = 2.5; // 2.5% of total trip value
  const calculatedInsurancePremium = Math.max(99, Math.round(basePrice * (insuranceRatePercent / 100)));
  const insuranceCost = includeInsurance ? calculatedInsurancePremium : 0;
  const convenienceFee = serviceCategory === "trains" ? 30 : serviceCategory === "flights" ? 249 : 49;
  const discountAmount = appliedOffer ? 500 : 0;
  
  // Applicable taxes (5%)
  const taxesAndFees = Math.round((basePrice + convenienceFee + insuranceCost) * 0.05);
  const finalTotalInr = Math.max(0, basePrice + insuranceCost + convenienceFee + taxesAndFees - discountAmount);

  // Conversion calculations
  const currencyInfo = getCurrencyInfo(selectedCurrency);
  const convertedTotal = convertFromInr(finalTotalInr, selectedCurrency);
  const convertedBase = convertFromInr(basePrice, selectedCurrency);

  const handleApplyPromo = (code: string) => {
    const offer = PROMO_OFFERS.find((o) => o.code.toLowerCase() === code.trim().toLowerCase());
    if (offer) {
      setAppliedOffer(offer);
      setPromoCodeInput(offer.code);
    } else {
      alert("Invalid promo code. Try HDFCFLY, VANDEZERO, or YATRASTAY.");
    }
  };

  const handlePayAndConfirm = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const generatedPolicyNumber = includeInsurance 
        ? `POL-BY-INS-${Math.floor(100000 + Math.random() * 900000)}` 
        : undefined;

      const newBooking: BookingItem = {
        id: `BK-${serviceCategory.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceType: serviceCategory,
        title: item.title || item.name || item.trainName || item.operator || "Travel Reservation",
        subtitle: item.subtitle || item.destination || item.city || `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`,
        date: "28 Aug 2026",
        time: item.departTime || item.departureTime || "10:00 AM",
        status: "confirmed",
        pnr: `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`,
        amount: finalTotalInr,
        baseFare: basePrice,
        insuranceIncluded: includeInsurance,
        insurancePremium: insuranceCost,
        insurancePolicyNumber: generatedPolicyNumber,
        taxesAndFees: taxesAndFees,
        convenienceFee: convenienceFee,
        discountAmount: discountAmount,
        passengers: 1,
        seatInfo: item.seatInfo || "Confirmed Class",
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      onConfirmBooking(newBooking);
      setConfirmedBooking(newBooking);
      setIsProcessing(false);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-600" />
              {confirmedBooking ? "Booking Confirmed & Issued!" : "Review & Instant Checkout"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {confirmedBooking ? "Your verified e-ticket and invoice have been generated." : "IRCTC / Airline / Partner direct confirmation"}
            </p>
          </div>
          <button
            onClick={() => {
              setConfirmedBooking(null);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {confirmedBooking ? (
            /* Confirmation Voucher View */
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900">Reservation Successful!</h4>
                <p className="text-xs text-emerald-700 max-w-md mx-auto">
                  A confirmation SMS &amp; WhatsApp ticket have been sent to <strong>{passengerPhone}</strong>.
                </p>
              </div>

              {/* Digital Boarding Pass Ticket */}
              <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">BharatYatra Verified E-Ticket</span>
                    <h5 className="text-base font-extrabold text-slate-900 mt-0.5">{confirmedBooking.title}</h5>
                    <p className="text-xs text-slate-500">{confirmedBooking.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400">PNR NUMBER</span>
                    <div className="text-sm font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                      {confirmedBooking.pnr}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs border-b border-slate-100">
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Passenger</span>
                    <span className="font-bold text-slate-800">{passengerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Date & Time</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.date} • {confirmedBooking.time}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Seat / Room</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.seatInfo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] block uppercase font-bold">Total Paid</span>
                    <span className="font-bold text-emerald-600 block">
                      ₹{confirmedBooking.amount.toLocaleString("en-IN")}
                    </span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-[11px] text-slate-500 font-semibold block">
                        ({convertedTotal.formatted})
                      </span>
                    )}
                  </div>
                </div>

                {/* Travel Insurance Policy Certificate (if opted) */}
                {confirmedBooking.insuranceIncluded && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-3.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                        <span className="text-xs font-black text-emerald-900">
                          Active Travel Insurance Policy Certificate
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                        {confirmedBooking.insurancePolicyNumber || "POL-BY-INS-839201"}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                      <div>
                        <span className="text-slate-400 text-[10px] block">Sum Insured:</span>
                        <strong className="text-emerald-900">₹5,00,000 Medical + 100% Cancellation</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Underwritten By:</span>
                        <strong className="text-slate-900">Go Digit Gen. Insurance</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block">Premium Paid:</span>
                        <strong className="text-emerald-700">₹{confirmedBooking.insurancePremium} (Included)</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Itemized Tax Invoice Breakdown */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                      Tax Invoice Summary ({confirmedBooking.invoiceNumber || "INV-2026-9021"})
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">GSTIN: 07AAACB1234F1Z5</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div className="flex justify-between">
                      <span>Base Trip Tariff:</span>
                      <span className="font-mono text-slate-900">₹{basePrice.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center gap-1">
                        Travel Insurance Premium:
                        {confirmedBooking.insuranceIncluded ? (
                          <span className="text-[9px] text-emerald-600 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                            2.5% Trip Cover
                          </span>
                        ) : null}
                      </span>
                      <span className={`font-mono ${confirmedBooking.insuranceIncluded ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                        {confirmedBooking.insuranceIncluded ? `+ ₹${confirmedBooking.insurancePremium}` : "₹0 (Not Opted)"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Authorized Platform Convenience Fee:</span>
                      <span className="font-mono text-slate-900">+ ₹{convenienceFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Statutory Taxes (GST 5%):</span>
                      <span className="font-mono text-slate-900">+ ₹{taxesAndFees}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Promo Coupon Discount:</span>
                        <span className="font-mono">- ₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-slate-900 pt-1.5 border-t border-slate-200 text-xs">
                      <span>Total Invoice Amount (Paid):</span>
                      <span className="font-mono text-emerald-700">₹{confirmedBooking.amount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <QrCode className="w-8 h-8 text-slate-800 shrink-0" />
                    <span>Scan at terminal / station gate for automated entry.</span>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => alert(`Downloaded Official Tax Invoice PDF (${confirmedBooking.invoiceNumber || "INV-2026-9021"}) with itemized Insurance & GST details!`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 border border-slate-300 shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Invoice PDF</span>
                    </button>
                    <button
                      onClick={() => alert(`Downloaded Official Ticket Confirmation PDF (${confirmedBooking.id})!`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>E-Ticket</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <div className="space-y-5">
              {/* Item Card Overview with Currency Toggle */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2 py-0.5 rounded">
                    {serviceCategory.toUpperCase()} RESERVATION
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">
                    {item.title || item.name || item.trainName || item.operator || "Travel Booking"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {item.subtitle || item.destination || item.city || item.models || "Direct Partner Confirmation"}
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-start gap-2">
                    <div>
                      <span className="text-lg font-black text-slate-900">₹{basePrice.toLocaleString("en-IN")}</span>
                      {selectedCurrency !== "INR" && (
                        <span className="text-xs text-indigo-600 font-bold block">
                          ≈ {convertedBase.formatted}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block">+ GST & Fees</span>
                  </div>
                </div>
              </div>

              {/* Currency Converter Bar */}
              <div className="p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-900">Currency Display & Conversion</span>
                    <p className="text-[11px] text-slate-500">
                      Live RBI Reference Rate: 1 {selectedCurrency} = ₹{currencyInfo.inrPerUnit.toFixed(2)} INR
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedCurrency}
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-indigo-200 bg-white font-bold text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {SUPPORTED_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Primary Traveler Details */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-400" />
                  Primary Passenger Information
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">Full Name (as per Govt ID)</label>
                    <input
                      type="text"
                      value={passengerName}
                      onChange={(e) => setPassengerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">Mobile Number</label>
                    <input
                      type="text"
                      value={passengerPhone}
                      onChange={(e) => setPassengerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 block mb-1 font-medium">Email for E-Ticket</label>
                    <input
                      type="email"
                      value={passengerEmail}
                      onChange={(e) => setPassengerEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Travel Insurance Addon with Dynamic Trip-Value Premium Calculation */}
              <div 
                onClick={() => setIncludeInsurance(!includeInsurance)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                  includeInsurance 
                    ? "border-emerald-500 bg-emerald-50/70 shadow-xs ring-1 ring-emerald-500/30" 
                    : "border-slate-200 bg-slate-50/60 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="pt-0.5">
                      <input
                        type="checkbox"
                        id="add-travel-insurance-checkbox"
                        checked={includeInsurance}
                        onChange={(e) => {
                          e.stopPropagation();
                          setIncludeInsurance(e.target.checked);
                        }}
                        className="w-5 h-5 rounded-md text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0 border-slate-300 accent-emerald-600 cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <label 
                          htmlFor="add-travel-insurance-checkbox"
                          onClick={(e) => e.stopPropagation()}
                          className="font-extrabold text-slate-900 text-xs sm:text-sm cursor-pointer flex items-center gap-1.5"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          Add Travel Insurance
                        </label>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Digit Partnered • IRDAI Approved
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Comprehensive trip protection calculated at <strong>{insuranceRatePercent}% of trip value</strong> (₹{basePrice.toLocaleString("en-IN")}):
                      </p>
                      
                      {/* Benefits Matrix */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2.5 text-[11px] text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>₹5,00,000</strong> Emergency Medical & Hospitalization</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>100% Refund</strong> on Trip Cancellation / Delay</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>Up to ₹25,000</strong> Baggage & Loss Protection</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>24x7 Roadside & SOS</strong> Assistance</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-black text-sm text-emerald-700">
                      +₹{calculatedInsurancePremium.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {selectedCurrency !== "INR" ? `(${convertFromInr(calculatedInsurancePremium, selectedCurrency).formatted})` : "Total Premium"}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block ${
                      includeInsurance ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {includeInsurance ? "Covered" : "Optional"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Promo Code Applicator */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter Coupon (e.g. HDFCFLY, VANDEZERO, YATRASTAY)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyPromo(promoCodeInput)}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black"
                  >
                    Apply
                  </button>
                </div>
                {appliedOffer && (
                  <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon {appliedOffer.code} applied! Saved ₹500.</span>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: "wallet", label: "Yatra Cash", sub: `₹${userProfile.walletBalance}`, icon: <Wallet className="w-4 h-4 text-emerald-600" /> },
                    { id: "upi", label: "Instant UPI", sub: "GPay/PhonePe", icon: <CreditCard className="w-4 h-4 text-indigo-600" /> },
                    { id: "card", label: "Credit/Debit", sub: "All Banks", icon: <CreditCard className="w-4 h-4 text-slate-600" /> },
                    { id: "emi", label: "No Cost EMI", sub: "3/6 Months", icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        paymentMethod === pm.id
                          ? "border-indigo-600 bg-indigo-50/50 shadow-2xs"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        {pm.icon}
                        <span className="font-bold text-slate-900">{pm.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{pm.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown Summary with Multi-Currency Transparency */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Base Booking Rate</span>
                  <div className="text-right">
                    <span>₹{basePrice.toLocaleString("en-IN")}</span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-[11px] text-slate-400 ml-1.5">({convertFromInr(basePrice, selectedCurrency).formatted})</span>
                    )}
                  </div>
                </div>
                {includeInsurance && (
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Travel Insurance (2.5% of trip value - Digit)</span>
                    </span>
                    <div className="text-right">
                      <span className="font-semibold text-emerald-700 font-mono">+₹{insuranceCost.toLocaleString("en-IN")}</span>
                      {selectedCurrency !== "INR" && (
                        <span className="text-[11px] text-slate-400 ml-1.5">({convertFromInr(insuranceCost, selectedCurrency).formatted})</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Authorized Convenience Fee</span>
                  <div className="text-right">
                    <span>₹{convenienceFee}</span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-[11px] text-slate-400 ml-1.5">({convertFromInr(convenienceFee, selectedCurrency).formatted})</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes &amp; Surcharges</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">₹{taxesAndFees}</span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-[11px] text-slate-400 ml-1.5">({convertFromInr(taxesAndFees, selectedCurrency).formatted})</span>
                    )}
                  </div>
                </div>
                {appliedOffer && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Discount ({appliedOffer.code})</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
                <div className="pt-2.5 border-t border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-slate-900 block">Total Amount Payable</span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        Live equivalent at {currencyInfo.symbol} {currencyInfo.ratePerInr.toFixed(4)} / INR
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-indigo-700 block">
                      ₹{finalTotalInr.toLocaleString("en-IN")}
                    </span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {convertedTotal.formatted}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handlePayAndConfirm}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-slate-900 hover:brightness-110 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>
                  {isProcessing
                    ? "Connecting to IRCTC & Banking Gateway..."
                    : `Pay ₹${finalTotalInr.toLocaleString("en-IN")} ${
                        selectedCurrency !== "INR" ? `(${convertedTotal.formatted})` : ""
                      } & Confirm`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
