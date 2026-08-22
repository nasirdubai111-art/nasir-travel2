import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Plane,
  Train,
  Bus,
  Hotel,
  Compass,
  Sparkles,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  QrCode,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  FileText,
  Building2,
  Tag,
  Phone,
  Mail,
  User,
  HeartHandshake,
} from "lucide-react";
import {
  TravelAgentPublicProfile,
  AgentTourPackageSummary,
  BookingItem,
  UserProfile,
} from "../../types";

interface AgentCustomerBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  agent: TravelAgentPublicProfile;
  initialService?: string;
  initialPackage?: AgentTourPackageSummary | null;
  userProfile: UserProfile;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function AgentCustomerBookingModal({
  isOpen,
  onClose,
  agent,
  initialService = "flights",
  initialPackage = null,
  userProfile,
  onBookingSuccess,
}: AgentCustomerBookingModalProps) {
  if (!isOpen) return null;

  // Booking Steps: 1: Details & Requirements -> 2: Pricing & Summary -> 3: Payment -> 4: Confirmed Voucher
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected Service
  const [selectedService, setSelectedService] = useState<string>(
    initialPackage ? "tours" : initialService
  );

  // Travel Requirements State
  const [originCity, setOriginCity] = useState("Pune");
  const [destinationCity, setDestinationCity] = useState(
    initialPackage?.destination.split("•")[0].trim() || "New Delhi"
  );
  const [travelStartDate, setTravelStartDate] = useState("2026-09-15");
  const [travelReturnDate, setTravelReturnDate] = useState("2026-09-20");
  const [preferredClassOrRoom, setPreferredClassOrRoom] = useState("Standard AC / Deluxe");
  const [specialNotes, setSpecialNotes] = useState("Pure Vegetarian / Jain Meal requested");

  // Travellers State
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // Primary Customer Details
  const [leadFullName, setLeadFullName] = useState(userProfile.name || "Vikramaditya Joshi");
  const [leadPhone, setLeadPhone] = useState(userProfile.phone || "+91 98230 45678");
  const [leadEmail, setLeadEmail] = useState(userProfile.email || "dr.v.joshi@rubyhall.com");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 98220 55432");
  const [idType, setIdType] = useState<"Aadhaar" | "Passport" | "Voter ID">("Aadhaar");
  const [idNumber, setIdNumber] = useState("XXXX-XXXX-9104");

  // GST Invoice Option
  const [needGstInvoice, setNeedGstInvoice] = useState(false);
  const [gstin, setGstin] = useState("27AAWFS9102K1ZV");
  const [companyName, setCompanyName] = useState("Joshi Health & Diagnostic Labs LLP");

  // Pricing & Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<string>(
    agent.offers?.[0]?.code || "SWASTIKVIP"
  );
  const [couponDiscount, setCouponDiscount] = useState<number>(450);
  const [useWalletCoins, setUseWalletCoins] = useState<boolean>(true);
  const [coinsDeduction, setCoinsDeduction] = useState<number>(200);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking" | "wallet">("upi");
  const [upiVpa, setUpiVpa] = useState("vjoshi@okhdfcbank");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Pricing Math
  let baseUnitRate = 4800;
  if (initialPackage) {
    baseUnitRate = initialPackage.price;
  } else if (selectedService === "tours") {
    baseUnitRate = 18500;
  } else if (selectedService === "trains") {
    baseUnitRate = 2450;
  } else if (selectedService === "hotels" || selectedService === "resorts") {
    baseUnitRate = 6500;
  } else if (selectedService === "pilgrimage") {
    baseUnitRate = 14500;
  } else if (selectedService === "buses") {
    baseUnitRate = 1350;
  }

  const basePrice = baseUnitRate * adultsCount + Math.round(baseUnitRate * 0.6) * childrenCount;
  const gstRate = selectedService === "hotels" || selectedService === "resorts" ? 0.12 : 0.05;
  const taxesGst = Math.round(basePrice * gstRate);
  const agentServiceFee = 0; // Complimentary through official agent desk
  const platformFee = 49;
  const totalDeductions = couponDiscount + (useWalletCoins ? coinsDeduction : 0);
  const totalPayable = Math.max(0, basePrice + taxesGst + agentServiceFee + platformFee - totalDeductions);

  const handleApplyCoupon = (code: string) => {
    if (code.toUpperCase() === "SWASTIKVIP" || code.toUpperCase() === "AGENTPROMO") {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(450);
    } else if (code.toUpperCase() === "YATRA1000") {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(1000);
    } else if (code.toUpperCase() === "HERITAGE12") {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(Math.round(basePrice * 0.12));
    } else {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscount(250);
    }
  };

  const handleExecutePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedBookingId = `BY-AGT-${Date.now().toString().slice(-6)}`;
      const generatedPnr = `${agent.businessName.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;

      const bookingRecord: BookingItem = {
        id: generatedBookingId,
        serviceCategory: (selectedService as any) || "flights",
        title: initialPackage
          ? initialPackage.title
          : `${agent.businessName} • ${selectedService.toUpperCase()} (${originCity} → ${destinationCity})`,
        provider: `${agent.businessName} (Verified Agent)`,
        fromLocation: originCity,
        toLocation: destinationCity,
        date: travelStartDate,
        time: "09:30 AM IST Departure",
        status: "confirmed",
        amountPaid: totalPayable,
        pnr: generatedPnr,
        passengersCount: adultsCount + childrenCount,
        seatOrRoomInfo: `${adultsCount} Adults, ${childrenCount} Kids (${preferredClassOrRoom})`,
      };

      setConfirmedBookingData({
        ...bookingRecord,
        agent,
        leadFullName,
        leadPhone,
        leadEmail,
        idType,
        idNumber,
        specialNotes,
        taxesGst,
        paymentMethod,
        invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      });

      onBookingSuccess(bookingRecord);
      setIsProcessing(false);
      setCurrentStep(4);
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header with Agent Branding */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={agent.logo}
              alt={agent.businessName}
              className="w-10 h-10 rounded-xl object-cover border-2 border-indigo-400/40"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Travel Agent Desk
                </span>
                <span className="text-[11px] text-slate-300 hidden sm:inline-block">
                  IATA: <strong>{agent.accreditations.iata || "Accredited"}</strong>
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white leading-tight mt-0.5">
                {initialPackage ? initialPackage.title : `Book with ${agent.businessName}`}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs font-bold text-slate-600 shrink-0">
          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                currentStep >= 1 ? "bg-indigo-600 text-white" : "bg-slate-300 text-slate-700"
              }`}
            >
              1
            </span>
            <span className={currentStep === 1 ? "text-indigo-900 font-black" : ""}>
              Requirements &amp; Travellers
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                currentStep >= 2 ? "bg-indigo-600 text-white" : "bg-slate-300 text-slate-700"
              }`}
            >
              2
            </span>
            <span className={currentStep === 2 ? "text-indigo-900 font-black" : ""}>
              Price &amp; Summary
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                currentStep >= 3 ? "bg-indigo-600 text-white" : "bg-slate-300 text-slate-700"
              }`}
            >
              3
            </span>
            <span className={currentStep === 3 ? "text-indigo-900 font-black" : ""}>
              Payment
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-400" />

          <div className="flex items-center gap-2">
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black ${
                currentStep === 4 ? "bg-emerald-600 text-white" : "bg-slate-300 text-slate-700"
              }`}
            >
              4
            </span>
            <span className={currentStep === 4 ? "text-emerald-900 font-black" : ""}>
              Voucher
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* ----------------- STEP 1: REQUIREMENTS & TRAVELLER DETAILS ----------------- */}
          {currentStep === 1 && (
            <div className="space-y-5">
              {/* Service Selection */}
              <div>
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Select Travel Service Category
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { id: "flights", label: "Flights", icon: Plane },
                    { id: "trains", label: "IRCTC Trains", icon: Train },
                    { id: "buses", label: "Volvo Buses", icon: Bus },
                    { id: "hotels", label: "Hotels & Stays", icon: Hotel },
                    { id: "tours", label: "Tour Circuits", icon: Compass },
                    { id: "pilgrimage", label: "Pilgrimage / Yatra", icon: Sparkles },
                  ].map((srv) => {
                    const Icon = srv.icon;
                    const isSelected = selectedService === srv.id;
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => setSelectedService(srv.id)}
                        className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isSelected ? "text-indigo-600" : "text-slate-500"}`} />
                        <span className="truncate w-full">{srv.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Journey Dates & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Origin / Departure City</label>
                  <input
                    type="text"
                    value={originCity}
                    onChange={(e) => setOriginCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Destination / Circuit</label>
                  <input
                    type="text"
                    value={destinationCity}
                    onChange={(e) => setDestinationCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Journey / Departure Date</label>
                  <input
                    type="date"
                    value={travelStartDate}
                    onChange={(e) => setTravelStartDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Return / Check-out Date</label>
                  <input
                    type="date"
                    value={travelReturnDate}
                    onChange={(e) => setTravelReturnDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-slate-900"
                  />
                </div>
              </div>

              {/* Guest Counts & Preferred Class */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Adults (12+ yrs)</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Children (2-11 yrs)</label>
                  <input
                    type="number"
                    min={0}
                    max={10}
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Preferred Class / Room Tier</label>
                  <select
                    value={preferredClassOrRoom}
                    onChange={(e) => setPreferredClassOrRoom(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                  >
                    <option value="Standard AC / Deluxe">Standard AC / Deluxe Room</option>
                    <option value="Executive / Suite">Executive / Palace Suite</option>
                    <option value="Business Class / 1st AC">Business Class / IRCTC 1st AC</option>
                    <option value="Economy / Sleeper">Economy / 3rd AC</option>
                  </select>
                </div>
              </div>

              {/* Primary Traveller Profile Details */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Lead Customer &amp; ID Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Lead Traveller Full Name *</label>
                    <input
                      type="text"
                      required
                      value={leadFullName}
                      onChange={(e) => setLeadFullName(e.target.value)}
                      placeholder="e.g. Vikramaditya Joshi"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile (for WhatsApp Voucher) *</label>
                    <input
                      type="tel"
                      required
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="+91 98230 45678"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="dr.v.joshi@rubyhall.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Govt ID Proof Type</label>
                    <select
                      value={idType}
                      onChange={(e) => setIdType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white"
                    >
                      <option value="Aadhaar">Aadhaar Card (UIDAI)</option>
                      <option value="Passport">Passport (International/Domestic)</option>
                      <option value="Voter ID">Election Voter ID</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">ID Number / Expiry</label>
                    <input
                      type="text"
                      value={idNumber}
                      onChange={(e) => setIdNumber(e.target.value)}
                      placeholder="XXXX-XXXX-9104"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Emergency Contact Phone</label>
                    <input
                      type="tel"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Requirements &amp; Notes</label>
                  <input
                    type="text"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="e.g. Jain meals, senior citizen wheelchair, adjoining rooms"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  />
                </div>

                {/* GST Invoice Toggle */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-bold text-slate-800">Add Business GSTIN for Input Tax Credit</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={needGstInvoice}
                      onChange={(e) => setNeedGstInvoice(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                  </div>

                  {needGstInvoice && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                      <input
                        type="text"
                        value={gstin}
                        onChange={(e) => setGstin(e.target.value)}
                        placeholder="e.g. 27AAWFS9102K1ZV"
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Company Legal Entity Name"
                        className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ----------------- STEP 2: PRICING & BOOKING SUMMARY ----------------- */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider block">
                      Booking Summary
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900">
                      {initialPackage ? initialPackage.title : `${selectedService.toUpperCase()} Service via ${agent.businessName}`}
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                    {adultsCount + childrenCount} Passengers
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Sector</span>
                    <strong>{originCity} → {destinationCity}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Dates</span>
                    <strong>{travelStartDate} to {travelReturnDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Lead Traveller</span>
                    <strong>{leadFullName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Fulfillment Agent</span>
                    <strong className="text-indigo-700">{agent.businessName}</strong>
                  </div>
                </div>
              </div>

              {/* Coupon Codes from Agent */}
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-indigo-600" />
                  Available Agent Promo Coupons
                </span>
                <div className="flex flex-wrap gap-2">
                  {agent.offers?.map((off) => (
                    <button
                      key={off.code}
                      type="button"
                      onClick={() => handleApplyCoupon(off.code)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                        appliedCoupon === off.code
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-white text-indigo-900 border-indigo-200 hover:bg-indigo-100"
                      }`}
                    >
                      <span>{off.code}</span>
                      <span className="text-[10px] opacity-80">({off.discountText})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Breakdown Calculation */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Base Service Fare ({adultsCount} Adults, {childrenCount} Kids)</span>
                  <span className="font-bold text-slate-900">₹{basePrice.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Taxes &amp; Statutory GST ({gstRate * 100}%)</span>
                  <span className="font-bold text-slate-900">₹{taxesGst.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Agent Desk Convenience Fee</span>
                  <span>FREE (₹0)</span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Secure Processing Fee</span>
                  <span className="font-bold text-slate-900">₹{platformFee}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {useWalletCoins && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Yatra Coins &amp; Loyalty Deduction</span>
                    <span>-₹{coinsDeduction}</span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-slate-900">
                  <span>Total Amount Payable</span>
                  <span className="text-xl font-black text-indigo-900">₹{totalPayable.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* ----------------- STEP 3: PAYMENT GATEWAY ----------------- */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Final Step</span>
                <h3 className="text-lg font-black text-slate-900">Choose Secure Payment Method</h3>
                <div className="text-2xl font-black text-indigo-900">₹{totalPayable.toLocaleString("en-IN")}</div>
              </div>

              {/* Payment Methods */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { id: "upi", label: "Instant UPI / QR", icon: QrCode },
                  { id: "card", label: "Credit/Debit Card", icon: CreditCard },
                  { id: "netbanking", label: "Net Banking", icon: Building2 },
                  { id: "wallet", label: "BharatYatra Wallet", icon: ShieldCheck },
                ].map((pm) => {
                  const Icon = pm.icon;
                  const isSelected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all text-xs font-bold ${
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-indigo-600"}`} />
                      <span>{pm.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Method Details */}
              {paymentMethod === "upi" && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-center">
                  <div className="w-32 h-32 bg-white p-2 border border-slate-300 rounded-2xl mx-auto flex items-center justify-center shadow-xs">
                    <QrCode className="w-24 h-24 text-slate-800" />
                  </div>
                  <span className="text-xs text-slate-500 block">Scan using any UPI App (GPay, PhonePe, Paytm, BHIM)</span>
                  <div className="max-w-xs mx-auto">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Or enter UPI VPA</label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white text-center"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Card Number</label>
                    <input
                      type="text"
                      defaultValue="4532 •••• •••• 8912"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono font-semibold"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        defaultValue="08/29"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-slate-700 block mb-1">CVV</label>
                      <input
                        type="password"
                        defaultValue="•••"
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-emerald-900 block">BharatYatra Escrow Wallet</span>
                    <span className="text-emerald-700">Available Balance: ₹{userProfile.walletBalance.toLocaleString("en-IN")}</span>
                  </div>
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-full font-bold text-[10px]">
                    Instant 1-Click Debit
                  </span>
                </div>
              )}

              {paymentMethod === "netbanking" && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
                  <label className="font-bold text-slate-700 block">Select Preferred Bank</label>
                  <select className="w-full px-3 py-2 rounded-xl border border-slate-300 font-semibold bg-white">
                    <option>HDFC Bank Direct Corporate &amp; Retail</option>
                    <option>State Bank of India (SBI)</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                  </select>
                </div>
              )}
            </div>
          )}

          {/* ----------------- STEP 4: CONFIRMED VOUCHER & TICKET ----------------- */}
          {currentStep === 4 && confirmedBookingData && (
            <div className="space-y-5 text-center py-2 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs text-emerald-600 font-black uppercase tracking-wider">
                  Booking Confirmed &amp; Voucher Issued!
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  {confirmedBookingData.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Confirmation Ref / PNR: <strong className="text-indigo-900">{confirmedBookingData.pnr}</strong> • ID: {confirmedBookingData.id}
                </p>
              </div>

              {/* Digital Voucher Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 text-left text-xs space-y-4 max-w-lg mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Authorized Agent</span>
                    <strong className="text-slate-900 text-sm">{agent.businessName}</strong>
                    <span className="text-[10px] text-emerald-600 font-bold block">Ministry of Tourism Reg: {agent.accreditations.ministryOfTourism || "VERIFIED"}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount Paid</span>
                    <strong className="text-emerald-700 text-sm font-black">₹{confirmedBookingData.amountPaid.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Traveller Name</span>
                    <strong className="text-slate-900">{confirmedBookingData.leadFullName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Contact</span>
                    <strong className="text-slate-900">{confirmedBookingData.leadPhone}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Travel Date</span>
                    <strong className="text-slate-900">{travelStartDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Class / Allocation</span>
                    <strong className="text-slate-900">{preferredClassOrRoom}</strong>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Saved to <strong>My Trips</strong> &amp; Central Customer Profile</span>
                  <span className="text-emerald-700 font-bold">100% Guaranteed Fulfilment</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  onClick={() => alert(`Voucher for PNR ${confirmedBookingData.pnr} downloaded as PDF.`)}
                  className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Voucher (PDF)</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 flex items-center gap-1.5 border border-slate-300"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {currentStep < 4 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div>
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">Step 1 of 3</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] text-slate-400 block uppercase">Total Payable</span>
                <span className="text-base sm:text-lg font-black text-slate-900">₹{totalPayable.toLocaleString("en-IN")}</span>
              </div>

              {currentStep === 1 && (
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <span>Review Summary</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 2 && (
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition-all"
                >
                  <span>Proceed to Payment</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/30 flex items-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isProcessing ? (
                    "Confirming Booking..."
                  ) : (
                    <>
                      <span>Pay ₹{totalPayable.toLocaleString("en-IN")} &amp; Confirm</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
