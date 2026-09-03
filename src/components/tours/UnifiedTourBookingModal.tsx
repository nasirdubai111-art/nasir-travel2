import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Building2,
  Bus,
  UtensilsCrossed,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  QrCode,
  Wallet,
  Building,
  Tag,
  Download,
  Printer,
  Compass,
  AlertCircle,
  Phone,
  Mail,
  UserCheck,
  Check,
} from "lucide-react";
import {
  UnifiedTourPackage,
  TourBookingTravellerProfile,
  TourPriceCalculation,
  BookingItem,
} from "../../types";

interface UnifiedTourBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: UnifiedTourPackage | null;
  onBookingConfirmed: (booking: BookingItem) => void;
}

export function UnifiedTourBookingModal({
  isOpen,
  onClose,
  tour,
  onBookingConfirmed,
}: UnifiedTourBookingModalProps) {
  if (!isOpen || !tour) return null;

  // Multi-step state: 1 to 7
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // Step 1: Tour Selection & Travel Dates
  const [selectedBatchId, setSelectedBatchId] = useState<string>(
    tour.departureBatches[0]?.id || "batch-01"
  );
  const [adultsCount, setAdultsCount] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<string>(tour.accommodation.tier);

  // Step 2: Room & Transport Option
  const [roomRequirement, setRoomRequirement] = useState<
    "Single Occupancy" | "Double Occupancy" | "Twin Beds" | "Family Suite + Extra Bed"
  >("Double Occupancy");
  const [transportOption, setTransportOption] = useState<
    "Standard AC Coach" | "Upgrade to Private Sedan" | "Upgrade to Private SUV (Innova Crysta)"
  >("Upgrade to Private SUV (Innova Crysta)");
  const [dietaryPreference, setDietaryPreference] = useState<
    "Vegetarian" | "Non-Vegetarian" | "Jain Food" | "No Preference"
  >("Vegetarian");

  // Step 3: Add-ons
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>(
    tour.addOns.filter((a) => a.selectedByDefault).map((a) => a.id)
  );

  // Step 4: Traveller Profile & ID
  const [travellerProfile, setTravellerProfile] = useState<TourBookingTravellerProfile>({
    leadName: "Vikramaditya Sharma",
    mobile: "+91 98100 22334",
    email: "vikram.sharma@example.com",
    adultsCount: 2,
    childrenCount: 0,
    nationality: "Indian",
    idType: "Aadhaar Card",
    idNumber: "8821 9012 4410",
    emergencyContact: {
      name: "Rohit Sharma (Brother)",
      phone: "+91 98111 55667",
      relationship: "Brother",
    },
    specialRequests: ["Ground floor room preferred", "Early check-in if possible"],
    roomRequirement: "Double Occupancy",
    transportOption: "Upgrade to Private SUV (Innova Crysta)",
    dietaryPreference: "Vegetarian",
    isGstInvoice: false,
    gstDetails: {
      companyName: "Sharma Global Enterprises",
      gstin: "07AABCS9012E1Z5",
      address: "Connaught Place, New Delhi",
    },
  });

  // Step 5: Offers & Coupons
  const [couponCode, setCouponCode] = useState<string>("TOUR10");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>("TOUR10");
  const [useYatraCoins, setUseYatraCoins] = useState<boolean>(false);

  // Step 6: Payment
  const [paymentMode, setPaymentMode] = useState<"upi" | "card" | "netbanking" | "wallet" | "advance25">("upi");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Step 7: Generated Booking Confirmation
  const [confirmedBooking, setConfirmedBooking] = useState<BookingItem | null>(null);

  // Selected batch info
  const selectedBatch =
    tour.departureBatches.find((b) => b.id === selectedBatchId) ||
    tour.departureBatches[0] || {
      departureDate: "2026-09-12",
      returnDate: "2026-09-18",
      priceMultiplier: 1.0,
    };

  // Pricing Calculation
  const baseRate = Math.round(tour.pricePerAdult * (selectedBatch.priceMultiplier || 1.0));
  const travellerPriceAdults = baseRate * adultsCount;
  const travellerPriceChildren = Math.round(baseRate * 0.6) * childrenCount;
  const basePackagePrice = travellerPriceAdults + travellerPriceChildren;

  // Transport upgrade delta
  const transportUpgradeCharges =
    transportOption === "Upgrade to Private SUV (Innova Crysta)"
      ? 4500
      : transportOption === "Upgrade to Private Sedan"
      ? 2500
      : 0;

  // Add-ons total
  const addOnsTotal = tour.addOns
    .filter((a) => selectedAddOnIds.includes(a.id))
    .reduce((sum, item) => {
      if (item.priceType === "per_person") {
        return sum + item.pricePerUnit * (adultsCount + childrenCount);
      }
      return sum + item.pricePerUnit;
    }, 0);

  const subtotal = basePackagePrice + transportUpgradeCharges + addOnsTotal;

  // Discount
  let couponDiscount = 0;
  if (appliedCoupon === "TOUR10") {
    couponDiscount = Math.min(Math.round(subtotal * 0.1), 3000);
  } else if (appliedCoupon === "EARLYBIRD25") {
    couponDiscount = Math.min(Math.round(subtotal * 0.12), 4000);
  } else if (appliedCoupon === "BHARATYATRA") {
    couponDiscount = Math.min(Math.round(subtotal * 0.05), 1500);
  }

  const coinsDiscount = useYatraCoins ? 500 : 0;
  const taxableAmount = Math.max(0, subtotal - couponDiscount - coinsDiscount);
  // GST @ 5% SAC 998555 for Tour Operator Services
  const gstAmount = Math.round(taxableAmount * 0.05);
  const platformFee = 0; // Transparent zero fee
  const finalPayable = taxableAmount + gstAmount + platformFee;
  const advanceAmount = Math.round(finalPayable * 0.25);

  const toggleAddOn = (id: string) => {
    setSelectedAddOnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === "TOUR10") {
      setAppliedCoupon("TOUR10");
    } else if (couponCode.trim().toUpperCase() === "EARLYBIRD25") {
      setAppliedCoupon("EARLYBIRD25");
    } else if (couponCode.trim().toUpperCase() === "BHARATYATRA") {
      setAppliedCoupon("BHARATYATRA");
    } else {
      setAppliedCoupon(null);
    }
  };

  const handleProcessPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedPnr = `TOUR-${Math.floor(100000 + Math.random() * 900000)}`;
      const amountPaid = paymentMode === "advance25" ? advanceAmount : finalPayable;

      const newBookingItem: BookingItem = {
        id: `TB-${Date.now()}`,
        serviceType: "tours",
        serviceCategory: "tours",
        title: tour.title,
        subtitle: `${tour.durationText} • ${tour.category} Circuit`,
        provider: tour.operatorName,
        providerLogo: tour.operatorLogo,
        fromLocation: tour.destination.split("(")[0].trim() || "Delhi NCR",
        toLocation: tour.destination,
        route: `${tour.destination} (${tour.durationText})`,
        date: selectedBatch.departureDate,
        returnDate: selectedBatch.returnDate,
        time: "08:30 AM Departure",
        status: "confirmed",
        amountPaid: amountPaid,
        amount: finalPayable,
        pnr: generatedPnr,
        passengersCount: adultsCount + childrenCount,
        passengers: adultsCount + childrenCount,
        seatOrRoomInfo: `${adultsCount} Adults, ${childrenCount} Kids • ${roomRequirement} • ${transportOption}`,
        bookingRef: generatedPnr,
        pickupAddress: `Meeting point / Airport pickup as coordinated by ${tour.operatorName}`,
        passengerDetailsList: [
          {
            name: travellerProfile.leadName,
            age: 36,
            gender: "M",
            roomType: roomRequirement,
            seatNumber: "Confirmed Group Allocation",
            idProofNumber: travellerProfile.idNumber,
          },
        ],
        paymentSummary: {
          baseFare: subtotal,
          taxesAndGst: gstAmount,
          convenienceFee: 0,
          discountApplied: couponDiscount + coinsDiscount,
          totalAmount: amountPaid,
          paymentMode: paymentMode === "advance25" ? "Part Advance (25%)" : paymentMode.toUpperCase(),
          paymentStatus: "PAID",
          transactionRef: `TXN-${Date.now().toString().slice(-8)}`,
          paidAt: new Date().toISOString(),
        },
        gstInvoice: travellerProfile.isGstInvoice
          ? {
              invoiceNumber: `INV/TOUR/${Date.now().toString().slice(-6)}`,
              gstin: "08AABCR4921E1Z4",
              legalEntity: tour.operatorName || "BharatYatra Holidays",
              sacCode: "998555",
              date: new Date().toISOString().split("T")[0],
              taxableAmount: taxableAmount,
              cgst: Math.round(gstAmount / 2),
              sgst: Math.round(gstAmount / 2),
              igst: 0,
              totalInvoiceAmount: finalPayable,
              customerGst: travellerProfile.gstDetails?.gstin || "07AABCS9012E1Z5",
              customerCompanyName: travellerProfile.gstDetails?.companyName || "Client Corporate",
            }
          : undefined,
      };

      setConfirmedBooking(newBookingItem);
      onBookingConfirmed(newBookingItem);
      setIsProcessing(false);
      setCurrentStep(7);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header with Progress Steps */}
        <div className={`${currentStep === 7 ? "no-print" : ""} bg-gradient-to-r from-fuchsia-800 via-purple-900 to-pink-900 p-5 sm:p-6 text-white shrink-0`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-white/20 text-white">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
                  Tour Package Reservation Engine
                </h2>
                <p className="text-xs text-fuchsia-200">
                  {tour.title} • Operated by {tour.operatorName}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Wizard (1 to 7) */}
          <div className="mt-5 grid grid-cols-7 gap-1 text-center">
            {[
              { num: 1, label: "Tour Dates" },
              { num: 2, label: "Stay & Cab" },
              { num: 3, label: "Add-ons" },
              { num: 4, label: "Traveller" },
              { num: 5, label: "Summary" },
              { num: 6, label: "Payment" },
              { num: 7, label: "Voucher" },
            ].map((st) => (
              <div key={st.num} className="flex flex-col items-center gap-1">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                    currentStep === st.num
                      ? "bg-amber-400 text-slate-950 ring-2 ring-white scale-110 shadow-md"
                      : currentStep > st.num
                      ? "bg-emerald-500 text-white"
                      : "bg-white/20 text-white/70"
                  }`}
                >
                  {currentStep > st.num ? <Check className="w-3 h-3 stroke-[3]" /> : st.num}
                </div>
                <span
                  className={`text-[9px] font-bold hidden sm:block ${
                    currentStep === st.num ? "text-amber-300" : "text-white/70"
                  }`}
                >
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: TOUR DATES & GROUP SIZE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900">Step 1: Select Departure Batch &amp; Group Size</h3>
                <p className="text-xs text-slate-500">Pick your travel departure date and specify travelling passenger count.</p>
              </div>

              {/* Batches Grid */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Available Scheduled Batches ({tour.durationText})
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {tour.departureBatches.map((batch) => {
                    const isSelected = selectedBatchId === batch.id;
                    const isSoldOut = batch.status === "Sold Out";
                    return (
                      <div
                        key={batch.id}
                        onClick={() => !isSoldOut && setSelectedBatchId(batch.id)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSoldOut
                            ? "bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed"
                            : isSelected
                            ? "border-fuchsia-600 bg-fuchsia-50/60 shadow-md"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-extrabold text-slate-900">
                              {batch.departureDate}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                batch.status === "Filling Fast"
                                  ? "bg-amber-100 text-amber-800"
                                  : batch.status === "Guaranteed Departure"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isSoldOut
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {batch.status}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            Return: {batch.returnDate}
                          </span>
                        </div>

                        <div className="pt-2 mt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-400">
                            {batch.totalSeats - batch.bookedSeats} seats open
                          </span>
                          <span className="font-black text-slate-900">
                            ₹{Math.round(tour.pricePerAdult * batch.priceMultiplier).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Travellers Counter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Adult Travellers (Age 12+)</span>
                    <span className="text-[11px] text-slate-500">₹{baseRate.toLocaleString("en-IN")} per adult</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-slate-900 w-4 text-center">{adultsCount}</span>
                    <button
                      onClick={() => setAdultsCount(Math.min(tour.maxGroupSize, adultsCount + 1))}
                      className="w-8 h-8 rounded-xl bg-fuchsia-600 font-black text-white hover:bg-fuchsia-700 shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Children (Age 5 - 11)</span>
                    <span className="text-[11px] text-slate-500">60% Tariff with extra bed (₹{Math.round(baseRate * 0.6).toLocaleString("en-IN")})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                      className="w-8 h-8 rounded-xl bg-white border border-slate-300 font-black text-slate-800 hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-base font-black text-slate-900 w-4 text-center">{childrenCount}</span>
                    <button
                      onClick={() => setChildrenCount(Math.min(6, childrenCount + 1))}
                      className="w-8 h-8 rounded-xl bg-fuchsia-600 font-black text-white hover:bg-fuchsia-700 shadow-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STAY, CAB & MEALS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900">Step 2: Room Requirement, Transport &amp; Food</h3>
                <p className="text-xs text-slate-500">Customize your room bed configuration, transport vehicle upgrade, and dietary preferences.</p>
              </div>

              {/* Room Requirement */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Room Configuration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: "Double Occupancy", title: "Double Occupancy (1 Large King Bed)", desc: "Ideal for couples & partners" },
                    { id: "Twin Beds", title: "Twin Beds (2 Separate Single Beds)", desc: "Ideal for friends & colleagues" },
                    { id: "Single Occupancy", title: "Single Occupancy (Private Solo Room)", desc: "Solo traveller private suite" },
                    { id: "Family Suite + Extra Bed", title: "Family Suite + Extra Mattress", desc: "For families with kids/elderly" },
                  ].map((rm) => (
                    <div
                      key={rm.id}
                      onClick={() => setRoomRequirement(rm.id as any)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                        roomRequirement === rm.id
                          ? "border-fuchsia-600 bg-fuchsia-50/70 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <h4 className="text-xs font-bold text-slate-900">{rm.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{rm.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transport Upgrade */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Transit &amp; Vehicle Preference
                </label>
                <div className="space-y-2.5">
                  {[
                    {
                      id: "Upgrade to Private SUV (Innova Crysta)",
                      title: "Private Dedicated Toyota Innova Crysta (Recommended)",
                      desc: "Dedicated AC vehicle exclusively for your party throughout the tour (+₹4,500 total)",
                      extraCost: 4500,
                    },
                    {
                      id: "Upgrade to Private Sedan",
                      title: "Private AC Sedan (Dzire / Etios)",
                      desc: "Private sedan for comfortable 2-person journey (+₹2,500 total)",
                      extraCost: 2500,
                    },
                    {
                      id: "Standard AC Coach",
                      title: "Standard AC Volvo / Force Urbania Shared Group Coach",
                      desc: "Comfortable air-conditioned luxury coach with group",
                      extraCost: 0,
                    },
                  ].map((tr) => (
                    <div
                      key={tr.id}
                      onClick={() => setTransportOption(tr.id as any)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        transportOption === tr.id
                          ? "border-fuchsia-600 bg-fuchsia-50/70 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{tr.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{tr.desc}</p>
                      </div>
                      <span className="text-xs font-black text-slate-900 shrink-0 ml-2">
                        {tr.extraCost === 0 ? "Included" : `+₹${tr.extraCost.toLocaleString("en-IN")}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Food Preference */}
              <div className="space-y-2 pt-4 border-t border-slate-200">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Dietary &amp; Culinary Preference (Included MAP Plan)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {["Vegetarian", "Non-Vegetarian", "Jain Food", "No Preference"].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDietaryPreference(d as any)}
                      className={`p-2.5 rounded-xl border font-bold text-center transition-all ${
                        dietaryPreference === d
                          ? "bg-fuchsia-600 text-white border-fuchsia-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {d === "Vegetarian" && "🌱 "}
                      {d === "Jain Food" && "✨ "}
                      {d === "Non-Vegetarian" && "🍗 "}
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CURATED ADD-ONS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900">Step 3: Curated Experiences &amp; Add-ons</h3>
                <p className="text-xs text-slate-500">Enhance your tour with flights, palace upgrades, safaris, and comprehensive insurance.</p>
              </div>

              <div className="space-y-3">
                {tour.addOns.map((addon) => {
                  const isChecked = selectedAddOnIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddOn(addon.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isChecked
                          ? "border-fuchsia-600 bg-fuchsia-50/70 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-1 rounded-md text-fuchsia-600 focus:ring-fuchsia-500 w-4 h-4"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-xs font-bold text-slate-900">{addon.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                              {addon.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">{addon.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-slate-900 block">
                          ₹{addon.pricePerUnit.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {addon.priceType === "per_person" ? "/ person" : "/ booking"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: TRAVELLER PROFILE & ID */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900">Step 4: Primary Traveller &amp; Contact Details</h3>
                <p className="text-xs text-slate-500">Provide official details matching your government-issued ID for booking verification.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Lead Traveller Full Name *</label>
                  <input
                    type="text"
                    value={travellerProfile.leadName}
                    onChange={(e) =>
                      setTravellerProfile({ ...travellerProfile, leadName: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-fuchsia-500"
                    placeholder="As per Aadhaar / Passport"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (For WhatsApp Updates) *</label>
                  <input
                    type="tel"
                    value={travellerProfile.mobile}
                    onChange={(e) =>
                      setTravellerProfile({ ...travellerProfile, mobile: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-fuchsia-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email ID (For E-Voucher &amp; Itinerary) *</label>
                  <input
                    type="email"
                    value={travellerProfile.email}
                    onChange={(e) =>
                      setTravellerProfile({ ...travellerProfile, email: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-fuchsia-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nationality</label>
                  <select
                    value={travellerProfile.nationality}
                    onChange={(e) =>
                      setTravellerProfile({ ...travellerProfile, nationality: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-fuchsia-500 bg-white"
                  >
                    <option value="Indian">Indian National</option>
                    <option value="International">International Traveller (NRI / Foreigner)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Govt ID Proof Type</label>
                  <select
                    value={travellerProfile.idType}
                    onChange={(e) =>
                      setTravellerProfile({ ...travellerProfile, idType: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-fuchsia-500 bg-white"
                  >
                    <option value="Aadhaar Card">Aadhaar Card</option>
                    <option value="Passport">Passport</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">ID Document Number *</label>
                  <input
                    type="text"
                    value={travellerProfile.idNumber}
                    onChange={(e) =>
                      setTravellerProfile({ ...travellerProfile, idNumber: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden focus:border-fuchsia-500"
                    placeholder="Enter document number"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  24x7 Emergency Contact (Family / Friend)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={travellerProfile.emergencyContact.name}
                    onChange={(e) =>
                      setTravellerProfile({
                        ...travellerProfile,
                        emergencyContact: { ...travellerProfile.emergencyContact, name: e.target.value },
                      })
                    }
                    placeholder="Contact Person Name & Relationship"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                  <input
                    type="tel"
                    value={travellerProfile.emergencyContact.phone}
                    onChange={(e) =>
                      setTravellerProfile({
                        ...travellerProfile,
                        emergencyContact: { ...travellerProfile.emergencyContact, phone: e.target.value },
                      })
                    }
                    placeholder="Emergency Phone Number"
                    className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                  />
                </div>
              </div>

              {/* Optional GST Invoicing */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">I need a GST Tax Invoice (B2B)</span>
                    <span className="text-[11px] text-slate-500">Claim 5% input tax credit for company travel</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={travellerProfile.isGstInvoice}
                    onChange={(e) =>
                      setTravellerProfile({ ...travellerProfile, isGstInvoice: e.target.checked })
                    }
                    className="w-4 h-4 rounded-md text-fuchsia-600 focus:ring-fuchsia-500"
                  />
                </div>

                {travellerProfile.isGstInvoice && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <input
                      type="text"
                      value={travellerProfile.gstDetails?.companyName}
                      onChange={(e) =>
                        setTravellerProfile({
                          ...travellerProfile,
                          gstDetails: { ...travellerProfile.gstDetails!, companyName: e.target.value },
                        })
                      }
                      placeholder="Company Legal Name"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                    <input
                      type="text"
                      value={travellerProfile.gstDetails?.gstin}
                      onChange={(e) =>
                        setTravellerProfile({
                          ...travellerProfile,
                          gstDetails: { ...travellerProfile.gstDetails!, gstin: e.target.value },
                        })
                      }
                      placeholder="15-digit GSTIN"
                      className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: BOOKING SUMMARY & TARIFF BREAKDOWN */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900">Step 5: Tour Summary &amp; Transparent Tariff</h3>
                <p className="text-xs text-slate-500">Review your full package selection, discounts, and tax breakup.</p>
              </div>

              {/* Package Summary Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500 text-white text-[10px] font-black uppercase">
                    {tour.category} Circuit
                  </span>
                  <span className="text-xs text-slate-300">
                    Operated by: <strong>{tour.operatorName}</strong>
                  </span>
                </div>
                <h4 className="text-lg font-black text-white">{tour.title}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Departure</span>
                    <strong>{selectedBatch.departureDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Return</span>
                    <strong>{selectedBatch.returnDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Travellers</span>
                    <strong>{adultsCount} Adults, {childrenCount} Kids</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Room / Vehicle</span>
                    <strong className="truncate block">{roomRequirement}</strong>
                  </div>
                </div>
              </div>

              {/* Coupon / Promo Code */}
              <div className="p-4 bg-fuchsia-50/60 border border-fuchsia-200 rounded-2xl space-y-2">
                <label className="text-xs font-bold text-fuchsia-950 uppercase tracking-wider block">
                  Promotional Coupon / Offers
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter TOUR10 or EARLYBIRD25"
                    className="flex-1 px-3 py-2 rounded-xl border border-fuchsia-300 text-xs font-bold uppercase bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-5 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Apply Code
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon '{appliedCoupon}' applied successfully! (Savings ₹{couponDiscount.toLocaleString("en-IN")})
                  </p>
                )}
              </div>

              {/* Transparent Tariff Breakdown */}
              <div className="border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Adults Package Base Tariff ({adultsCount} × ₹{baseRate.toLocaleString("en-IN")})</span>
                  <span className="font-semibold text-slate-900">₹{travellerPriceAdults.toLocaleString("en-IN")}</span>
                </div>

                {childrenCount > 0 && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Child Package Tariff ({childrenCount} × ₹{Math.round(baseRate * 0.6).toLocaleString("en-IN")})</span>
                    <span className="font-semibold text-slate-900">₹{travellerPriceChildren.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {transportUpgradeCharges > 0 && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Transport Vehicle Upgrade ({transportOption})</span>
                    <span className="font-semibold text-slate-900">₹{transportUpgradeCharges.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {addOnsTotal > 0 && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Curated Add-ons &amp; Travel Shield ({selectedAddOnIds.length} items)</span>
                    <span className="font-semibold text-slate-900">₹{addOnsTotal.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {couponDiscount > 0 && (
                  <div className="flex items-center justify-between text-emerald-700 font-bold">
                    <span>Promotional Discount ({appliedCoupon})</span>
                    <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span>GST @ 5% (SAC 998555 Tour Operator Service)</span>
                  <span className="font-semibold text-slate-900">₹{gstAmount.toLocaleString("en-IN")}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span>Platform &amp; Payment Service Fee</span>
                  <span className="font-bold text-emerald-700">₹0 (Zero Surcharge)</span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-sm sm:text-base font-black text-slate-900">
                  <span>Total Amount Payable</span>
                  <span className="text-fuchsia-700 text-xl font-black">₹{finalPayable.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PAYMENT GATEWAYS */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in">
              <div>
                <h3 className="text-base font-black text-slate-900">Step 6: Select Payment Method</h3>
                <p className="text-xs text-slate-500">Secure 256-bit encrypted checkout with instant booking confirmation.</p>
              </div>

              {/* Advance 25% Option vs Full Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMode("upi")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMode !== "advance25"
                      ? "border-fuchsia-600 bg-fuchsia-50/60 shadow-xs"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Pay 100% Full Amount</span>
                    <span className="text-sm font-black text-slate-900">₹{finalPayable.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Instant voucher release with zero balance remaining.</p>
                </div>

                <div
                  onClick={() => setPaymentMode("advance25")}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMode === "advance25"
                      ? "border-fuchsia-600 bg-fuchsia-50/60 shadow-xs"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Pay 25% Advance to Reserve</span>
                    <span className="text-sm font-black text-fuchsia-700">₹{advanceAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Pay remaining ₹{(finalPayable - advanceAmount).toLocaleString("en-IN")} 7 days before departure.</p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Select Gateway
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMode("upi")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMode === "upi" ? "border-fuchsia-600 bg-fuchsia-50/60" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">UPI Instant QR &amp; VPA</h4>
                      <p className="text-[10px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMode("card")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMode === "card" ? "border-fuchsia-600 bg-fuchsia-50/60" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Credit / Debit Cards</h4>
                      <p className="text-[10px] text-slate-500">Visa, MasterCard, RuPay, Amex</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMode("netbanking")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMode === "netbanking" ? "border-fuchsia-600 bg-fuchsia-50/60" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Net Banking</h4>
                      <p className="text-[10px] text-slate-500">HDFC, ICICI, SBI, Axis &amp; 45+ Banks</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMode("wallet")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                      paymentMode === "wallet" ? "border-fuchsia-600 bg-fuchsia-50/60" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">BharatYatra Travel Wallet</h4>
                      <p className="text-[10px] text-slate-500">Instant 1-Click Cash Settlement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: CONFIRMATION & E-VOUCHER */}
          {currentStep === 7 && confirmedBooking && (
            <div className="printable-voucher-sheet printable-document space-y-6 animate-in zoom-in-95">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900">
                  Tour Package Confirmed &amp; Voucher Issued!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Your reservation is confirmed with <strong>{tour.operatorName}</strong>. E-voucher and itinerary details have been dispatched to <strong>{travellerProfile.email}</strong> and synced to <strong>My Trips</strong>.
                </p>
              </div>

              {/* Printable Voucher Card */}
              <div className="border-2 border-dashed border-fuchsia-300 rounded-3xl p-5 bg-gradient-to-b from-fuchsia-50/40 to-white space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Official Tour PNR</span>
                    <span className="text-lg font-black text-fuchsia-700 tracking-wider font-mono">
                      {confirmedBooking.pnr}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Status</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300">
                      CONFIRMED &amp; SEATS BLOCKED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tour Circuit</span>
                    <strong className="text-slate-900">{tour.title}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Departure Date</span>
                    <strong className="text-slate-900">{selectedBatch.departureDate}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Lead Guest</span>
                    <strong className="text-slate-900">{travellerProfile.leadName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Amount Paid</span>
                    <strong className="text-emerald-700 text-sm font-mono">₹{confirmedBooking.amountPaid?.toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                {/* Day 1 Meeting Point & Chauffeur Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <MapPin className="w-3.5 h-3.5 text-fuchsia-600" />
                    <span>Meeting Point &amp; Chauffeur Coordination:</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Chauffeur will meet you at Airport / Railway Station arrival gate holding a personalized name placard. Guide: <strong>{tour.guideInfo.name}</strong> ({tour.guideInfo.languages.join(", ")}).
                  </p>
                  <p className="text-[11px] text-fuchsia-700 font-bold pt-1">
                    24x7 Operator Helpline: {tour.supportContact.phone} • WhatsApp: {tour.supportContact.whatsapp}
                  </p>
                </div>

                {/* Tour Voucher Advisory Note */}
                <div className="pt-2 border-t border-slate-200 text-[10px] text-slate-500 leading-relaxed print-break-inside-avoid">
                  <p>
                    • <strong>Voucher Validity:</strong> This official travel voucher is accepted by all affiliated hotels, vehicle chauffeurs, and local monument entry points. Please carry a government-approved Photo ID for each travelling member.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="no-print flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Itinerary &amp; Voucher</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-black shadow-md transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Done • View in My Trips</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls for Steps 1 to 6 */}
        {currentStep < 7 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors"
              >
                Cancel
              </button>
            )}

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <span className="text-[10px] text-slate-400 block">Current Total</span>
                <span className="text-base font-black text-slate-900">₹{finalPayable.toLocaleString("en-IN")}</span>
              </div>

              {currentStep < 6 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
                  className="px-7 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleProcessPayment}
                  className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Confirming Booking...</span>
                  ) : (
                    <>
                      <span>Pay ₹{(paymentMode === "advance25" ? advanceAmount : finalPayable).toLocaleString("en-IN")} &amp; Confirm</span>
                      <CheckCircle2 className="w-4 h-4" />
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
