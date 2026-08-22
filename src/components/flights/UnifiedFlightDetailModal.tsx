import React, { useState, useMemo } from "react";
import {
  X,
  Plane,
  Calendar,
  Users,
  Clock,
  MapPin,
  Luggage,
  Armchair,
  UtensilsCrossed,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Tv,
  Wifi,
  Zap,
  CreditCard,
  QrCode,
  Download,
  Phone,
  Mail,
  FileText,
  Heart,
  Share2,
  Info,
  Check,
  Tag,
  AlertCircle,
  Percent,
  Compass,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Receipt,
} from "lucide-react";
import {
  FlightAirport,
  FlightExtendedDeal,
  FlightFareTier,
  FLIGHT_FARE_TIERS,
  EXTRA_BAGGAGE_OPTIONS,
  INFLIGHT_MEALS,
  FLIGHT_ADDONS_LIST,
  GENERATE_AIRCRAFT_SEATS,
  FlightSeatItem,
} from "../../data/flightData";
import { BookingItem } from "../../types";

export interface UnifiedFlightDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightExtendedDeal | null;
  onBookingSuccess: (booking: BookingItem) => void;
  initialFromCode?: string;
  initialToCode?: string;
  initialDepartDate?: string;
  initialReturnDate?: string;
  initialPassengersCount?: number;
  initialCabinClass?: "Economy" | "Premium Economy" | "Business" | "First";
  initialTripType?: "oneway" | "round" | "multi";
}

type ModalStep = "details" | "passengers" | "seats_addons" | "payment" | "confirmed";

export interface FlightPassengerProfileItem {
  id: string;
  type: "adult" | "child" | "infant";
  title: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  nationality: string;
  idDocumentType: "Aadhaar Card" | "Passport" | "Voter ID" | "Driving License";
  idDocumentNumber: string;
  passportNumber?: string;
  passportExpiry?: string;
  passportCountry?: string;
  frequentFlyerAirline?: string;
  frequentFlyerNumber?: string;
  wheelchair: boolean;
  selectedSeatId?: string;
  selectedMealId?: string;
}

export function UnifiedFlightDetailModal({
  isOpen,
  onClose,
  flight,
  onBookingSuccess,
  initialFromCode = "DEL",
  initialToCode = "BOM",
  initialDepartDate = "2026-08-28",
  initialReturnDate = "2026-09-04",
  initialPassengersCount = 1,
  initialCabinClass = "Economy",
  initialTripType = "oneway",
}: UnifiedFlightDetailModalProps) {
  if (!isOpen || !flight) return null;

  // Active Flow Step
  const [currentStep, setCurrentStep] = useState<ModalStep>("details");
  const [activeMediaTab, setActiveMediaTab] = useState<"overview" | "fare_rules" | "amenities">("overview");

  // Flight Route & Date Config
  const [tripType, setTripType] = useState<"oneway" | "round" | "multi">(initialTripType);
  const [fromCode, setFromCode] = useState(flight.fromCode || initialFromCode);
  const [toCode, setToCode] = useState(flight.toCode || initialToCode);
  const [departDate, setDepartDate] = useState(initialDepartDate);
  const [returnDate, setReturnDate] = useState(initialReturnDate);
  const [cabinClass, setCabinClass] = useState<"Economy" | "Premium Economy" | "Business" | "First">(initialCabinClass);
  const [passengersCount, setPassengersCount] = useState(initialPassengersCount);

  // Selected Fare Tier (Saver, Flexi, SuperFlex, Business)
  const [selectedTierId, setSelectedTierId] = useState<"saver" | "flexi" | "superflex" | "business">("saver");

  // Coupon & Rewards
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("FLYBHARAT");
  const [customCouponInput, setCustomCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [useYatraCoins, setUseYatraCoins] = useState(true);

  // Lead Passenger & Contact
  const [leadContact, setLeadContact] = useState({
    mobile: "+91 98765 43210",
    email: "aarav.sharma@example.com",
    whatsappAlerts: true,
  });

  // Corporate GST Invoice
  const [isGstRequested, setIsGstRequested] = useState(false);
  const [gstDetails, setGstDetails] = useState({
    companyName: "Sharma Tech Enterprises LLP",
    gstin: "07AAACB1234F1Z8",
    address: "Connaught Place, New Delhi - 110001",
  });

  // Passenger List
  const [passengers, setPassengers] = useState<FlightPassengerProfileItem[]>([
    {
      id: "p-1",
      type: "adult",
      title: "Mr",
      firstName: "Aarav",
      lastName: "Sharma",
      dob: "1992-06-15",
      gender: "Male",
      nationality: "Indian",
      idDocumentType: flight.isInternational ? "Passport" : "Aadhaar Card",
      idDocumentNumber: flight.isInternational ? "Z4829104" : "XXXX-XXXX-8921",
      passportNumber: flight.isInternational ? "Z4829104" : "",
      passportExpiry: flight.isInternational ? "2032-05-18" : "",
      passportCountry: "India",
      frequentFlyerAirline: `${flight.airline} Club`,
      frequentFlyerNumber: "FF-982140",
      wheelchair: false,
      selectedSeatId: "12A",
      selectedMealId: "meal-veg-thali",
    },
  ]);

  // Seats and Addons State
  const [selectedBaggageOptionId, setSelectedBaggageOptionId] = useState<string>("none");
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(["addon-zero-cancel", "addon-lounge"]);
  const [aircraftSeats] = useState<FlightSeatItem[]>(() => GENERATE_AIRCRAFT_SEATS());
  const [activeSeatPassengerIdx, setActiveSeatPassengerIdx] = useState<number>(0);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "WALLET">("UPI");
  const [upiIdInput, setUpiIdInput] = useState("aarav@okhdfcbank");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Active Fare Tier details
  const activeTier: FlightFareTier = useMemo(() => {
    const found = FLIGHT_FARE_TIERS.find((t) => t.id === selectedTierId);
    return found || FLIGHT_FARE_TIERS[0];
  }, [selectedTierId]);

  // Adjust Passenger List Size
  const handlePassengerCountChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(6, newCount));
    setPassengersCount(validCount);

    const updated = [...passengers];
    if (validCount > updated.length) {
      for (let i = updated.length + 1; i <= validCount; i++) {
        updated.push({
          id: `p-${i}`,
          type: "adult",
          title: "Ms",
          firstName: `Passenger ${i}`,
          lastName: "Sharma",
          dob: "1995-08-20",
          gender: "Female",
          nationality: "Indian",
          idDocumentType: flight.isInternational ? "Passport" : "Aadhaar Card",
          idDocumentNumber: `XXXX-XXXX-${1000 + i}`,
          passportNumber: flight.isInternational ? `Z${5000000 + i}` : "",
          passportExpiry: flight.isInternational ? "2032-10-10" : "",
          passportCountry: "India",
          wheelchair: false,
          selectedSeatId: `${12 + i}B`,
          selectedMealId: "meal-snack-box",
        });
      }
    } else if (validCount < updated.length) {
      updated.splice(validCount);
    }
    setPassengers(updated);
  };

  // Price Calculation Engine
  const priceBreakdown = useMemo(() => {
    const baseFarePerPassenger = flight.price + activeTier.priceDelta;
    const grossBaseAirfare = baseFarePerPassenger * passengers.length;

    // Fuel Surcharge (YQ) + Airport UDF / PSF
    const fuelSurchargePerPax = flight.isInternational ? 2200 : 750;
    const airportTaxesPerPax = flight.isInternational ? 1800 : 450;
    const totalTaxes = (fuelSurchargePerPax + airportTaxesPerPax) * passengers.length;

    // GST (K3 tax: 5% for Economy, 12% for Business)
    const gstRate = activeTier.id === "business" ? 0.12 : 0.05;
    const gstAmount = Math.round((grossBaseAirfare + totalTaxes) * gstRate);

    // Extra Baggage Cost
    const extraBaggage = EXTRA_BAGGAGE_OPTIONS.find((b) => b.id === selectedBaggageOptionId);
    const extraBaggageCost = extraBaggage ? extraBaggage.price * passengers.length : 0;

    // Meals Cost
    const hasFreeMeal = activeTier.id === "superflex" || activeTier.id === "business" || activeTier.id === "flexi";
    const mealsCost = passengers.reduce((sum, p) => {
      if (hasFreeMeal) return sum; // Free with flexi/business
      const meal = INFLIGHT_MEALS.find((m) => m.id === p.selectedMealId);
      return sum + (meal ? meal.price : 0);
    }, 0);

    // Seat Cost
    const seatCost = passengers.reduce((sum, p) => {
      if (activeTier.id === "business" || activeTier.id === "superflex") return sum; // Free premium seat
      const seat = aircraftSeats.find((s) => s.id === p.selectedSeatId);
      return sum + (seat ? seat.price : 0);
    }, 0);

    // Addon Services Cost
    const addonsCost = selectedAddonIds.reduce((sum, aId) => {
      const addon = FLIGHT_ADDONS_LIST.find((a) => a.id === aId);
      return sum + (addon ? addon.price * passengers.length : 0);
    }, 0);

    // Coupon discount
    let couponDiscount = 0;
    if (appliedCouponCode === "FLYBHARAT") {
      couponDiscount = Math.min(Math.round(grossBaseAirfare * 0.1), 1500);
    } else if (appliedCouponCode === "YATRAFLIGHT") {
      couponDiscount = Math.min(600 * passengers.length, 1800);
    } else if (appliedCouponCode === "BUSINESS2026" && activeTier.id === "business") {
      couponDiscount = 4000;
    }

    // YatraCoins discount (480 coins = ₹480)
    const yatraCoinsDiscount = useYatraCoins ? 480 : 0;

    // Platform convenience fee (Waived for Yatra Club)
    const platformConvenienceFee = 0;

    const subtotal = grossBaseAirfare + totalTaxes + gstAmount + extraBaggageCost + mealsCost + seatCost + addonsCost;
    const finalPayableAmount = Math.max(0, subtotal - couponDiscount - yatraCoinsDiscount + platformConvenienceFee);

    return {
      baseFarePerPassenger,
      passengersCount: passengers.length,
      grossBaseAirfare,
      fuelSurcharge: fuelSurchargePerPax * passengers.length,
      airportTaxes: airportTaxesPerPax * passengers.length,
      totalTaxes,
      gstRatePercent: gstRate * 100,
      gstAmount,
      extraBaggageCost,
      mealsCost,
      seatCost,
      addonsCost,
      couponDiscount,
      yatraCoinsDiscount,
      platformConvenienceFee,
      finalPayableAmount,
    };
  }, [
    flight,
    activeTier,
    passengers,
    selectedBaggageOptionId,
    selectedAddonIds,
    aircraftSeats,
    appliedCouponCode,
    useYatraCoins,
  ]);

  // Apply Coupon
  const handleApplyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "FLYBHARAT" || trimmed === "YATRAFLIGHT" || (trimmed === "BUSINESS2026" && activeTier.id === "business")) {
      setAppliedCouponCode(trimmed);
      setCouponError("");
    } else {
      setCouponError(`Invalid coupon '${trimmed}'. Try FLYBHARAT or YATRAFLIGHT.`);
    }
  };

  // Toggle Addon
  const handleToggleAddon = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddonIds([...selectedAddonIds, addonId]);
    }
  };

  // Assign Seat to Active Passenger
  const handleAssignSeat = (seat: FlightSeatItem) => {
    if (!seat.isAvailable) return;
    const updated = [...passengers];
    updated[activeSeatPassengerIdx].selectedSeatId = seat.id;
    setPassengers(updated);

    // Auto-advance to next passenger if unassigned
    if (activeSeatPassengerIdx < passengers.length - 1) {
      setActiveSeatPassengerIdx(activeSeatPassengerIdx + 1);
    }
  };

  // Handle Payment & Official Ticket Issuance
  const handleProcessFlightBooking = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedBookingId = `BY-FLT-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedAirlinePNR = `${flight.airline.substring(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedTicketNumber = `098-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const newBooking: BookingItem = {
        id: `FL-${Date.now()}`,
        serviceCategory: "flights",
        title: `${flight.airline} ${flight.flightNumber} • ${flight.fromCode} ➔ ${flight.toCode}`,
        subtitle: `${passengers.length} Passenger(s) • ${activeTier.name} • ${flight.aircraft}`,
        provider: flight.airline,
        fromLocation: `${flight.fromCity} (${flight.fromCode}) - ${flight.terminalDep}`,
        toLocation: `${flight.toCity} (${flight.toCode}) - ${flight.terminalArr}`,
        date: departDate,
        time: flight.departTime,
        status: "confirmed",
        amountPaid: priceBreakdown.finalPayableAmount,
        pnr: generatedAirlinePNR,
        bookingRef: generatedBookingId,
        passengersCount: passengers.length,
        seatOrRoomInfo: passengers.map((p) => `${p.firstName} (${p.selectedSeatId || "12A"})`).join(", "),
        paymentSummary: {
          baseFare: priceBreakdown.grossBaseAirfare,
          taxesAndGst: priceBreakdown.totalTaxes + priceBreakdown.gstAmount,
          convenienceFee: priceBreakdown.platformConvenienceFee,
          discountApplied: priceBreakdown.couponDiscount + priceBreakdown.yatraCoinsDiscount,
          totalAmount: priceBreakdown.finalPayableAmount,
          paymentMode: paymentMethod,
          paymentStatus: "PAID",
          transactionRef: `TXN-FLT-${Date.now()}`,
          paidAt: new Date().toISOString(),
        },
        gstInvoice: {
          invoiceNumber: `INV-BY-${Math.floor(1000000 + Math.random() * 9000000)}`,
          gstin: "07AAACB9876K1Z2",
          legalEntity: `${flight.airline} Airlines India Limited`,
          sacCode: "996411",
          date: new Date().toISOString().split("T")[0],
          taxableAmount: priceBreakdown.grossBaseAirfare + priceBreakdown.totalTaxes,
          cgst: Math.round(priceBreakdown.gstAmount / 2),
          sgst: Math.round(priceBreakdown.gstAmount / 2),
          igst: 0,
          totalInvoiceAmount: priceBreakdown.finalPayableAmount,
          customerGst: isGstRequested ? gstDetails.gstin : undefined,
          customerCompanyName: isGstRequested ? gstDetails.companyName : undefined,
        },
        cancellationDetails: {
          isEligible: true,
          cancellationPolicyRule: activeTier.cancellationFee,
          cancellationFee: activeTier.id === "business" || activeTier.id === "superflex" ? 0 : 1500,
          refundableAmount: priceBreakdown.finalPayableAmount - (activeTier.id === "saver" ? 1500 : 0),
          refundStatus: "INSTANT_WALLET_CREDITED",
        },
      };

      setConfirmedBookingData({
        ...newBooking,
        ticketNumber: generatedTicketNumber,
        flight,
        activeTier,
        passengers,
        priceBreakdown,
        leadContact,
      });

      onBookingSuccess(newBooking);
      setIsProcessingPayment(false);
      setCurrentStep("confirmed");
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* ========================================================================= */}
        {/* MODAL TOP BAR: FLIGHT HEADER & FLOW BREADCRUMBS */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-sky-600 text-white">
              <Plane className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight">
                  {flight.airline} • {flight.flightNumber}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-mono font-bold">
                  {flight.aircraft}
                </span>
                {flight.isInternational && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    International
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span className="font-bold text-white">{flight.fromCity} ({flight.fromCode})</span>
                <span>➔</span>
                <span className="font-bold text-white">{flight.toCity} ({flight.toCode})</span>
                <span>•</span>
                <span>{departDate} • {flight.duration} • {flight.stops}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Step Breadcrumbs */}
            {currentStep !== "confirmed" && (
              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className={`px-2.5 py-1 rounded-lg ${currentStep === "details" ? "bg-white/10 text-white font-bold" : ""}`}>
                  1. Flight &amp; Fare
                </span>
                <span>→</span>
                <span className={`px-2.5 py-1 rounded-lg ${currentStep === "passengers" ? "bg-white/10 text-white font-bold" : ""}`}>
                  2. Passengers
                </span>
                <span>→</span>
                <span className={`px-2.5 py-1 rounded-lg ${currentStep === "seats_addons" ? "bg-white/10 text-white font-bold" : ""}`}>
                  3. Seats &amp; Add-ons
                </span>
                <span>→</span>
                <span className={`px-2.5 py-1 rounded-lg ${currentStep === "payment" ? "bg-white/10 text-white font-bold" : ""}`}>
                  4. Payment
                </span>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* STEP 1: FLIGHT DETAIL PROFILE & FARE SELECTION */}
        {/* ========================================================================= */}
        {currentStep === "details" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-7">
            {/* 1. FLIGHT SEARCH PARAMETERS STRIP */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <ArrowRightLeft className="w-3.5 h-3.5 text-slate-700" /> Trip Type:
                </span>
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-hidden"
                >
                  <option value="oneway">One-Way</option>
                  <option value="round">Round-Trip</option>
                  <option value="multi">Multi-City</option>
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-700" /> Departure Date:
                </span>
                <input
                  type="date"
                  value={departDate}
                  onChange={(e) => setDepartDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-700" /> Return Date:
                </span>
                <input
                  type="date"
                  value={returnDate}
                  disabled={tripType === "oneway"}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className={`w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-hidden ${
                    tripType === "oneway" ? "opacity-40 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-700" /> Passengers:
                </span>
                <select
                  value={passengersCount}
                  onChange={(e) => handlePassengerCountChange(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-hidden"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n} Passenger{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Armchair className="w-3.5 h-3.5 text-slate-700" /> Cabin Class:
                </span>
                <select
                  value={cabinClass}
                  onChange={(e) => setCabinClass(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-hidden"
                >
                  <option value="Economy">Economy</option>
                  <option value="Premium Economy">Premium Economy</option>
                  <option value="Business">Business Class</option>
                  <option value="First">First Class</option>
                </select>
              </div>
            </div>

            {/* 2. FLIGHT ROUTE & SCHEDULE CARD */}
            <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                {/* Origin */}
                <div className="text-center md:text-left space-y-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">{flight.fromCode}</span>
                  <p className="text-sm font-extrabold text-sky-200">{flight.fromCity}</p>
                  <p className="text-xs text-slate-400 font-mono">{flight.terminalDep}</p>
                  <div className="mt-2 inline-block px-3 py-1 rounded-xl bg-white/10 text-white font-black text-sm">
                    {flight.departTime}
                  </div>
                </div>

                {/* Route Vector */}
                <div className="flex-1 flex flex-col items-center px-4 max-w-xs w-full">
                  <span className="text-xs font-bold text-sky-300 mb-1">{flight.duration}</span>
                  <div className="w-full flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-sky-400 via-white to-sky-400 relative">
                      <Plane className="w-4 h-4 text-white absolute left-1/2 -top-2 -translate-x-1/2 rotate-90" />
                    </div>
                    <div className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30">
                      {flight.stops}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      OTP: {flight.onTimePerformance || "94% Punctual"}
                    </span>
                  </div>
                </div>

                {/* Destination */}
                <div className="text-center md:text-right space-y-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight">{flight.toCode}</span>
                  <p className="text-sm font-extrabold text-sky-200">{flight.toCity}</p>
                  <p className="text-xs text-slate-400 font-mono">{flight.terminalArr}</p>
                  <div className="mt-2 inline-block px-3 py-1 rounded-xl bg-white/10 text-white font-black text-sm">
                    {flight.arriveTime}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. FLIGHT FACILITIES & AMENITIES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-sky-100 text-sky-700">
                  <UtensilsCrossed className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-black text-slate-900 block">In-Flight Meals</span>
                  <span className="text-[11px] text-slate-500">
                    {flight.mealsIncluded ? "Complimentary Meal" : "Pre-book Gourmet Menu"}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-700">
                  <Luggage className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-black text-slate-900 block">Baggage Allowance</span>
                  <span className="text-[11px] text-slate-500">
                    Cabin: {flight.cabinBaggageKg}kg • Check-in: {flight.checkInBaggageKg}kg
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                  <Wifi className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-black text-slate-900 block">Wi-Fi &amp; USB Power</span>
                  <span className="text-[11px] text-slate-500">In-seat power &amp; messaging</span>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 flex items-center gap-3">
                <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Tv className="w-4 h-4" />
                </span>
                <div>
                  <span className="text-xs font-black text-slate-900 block">Entertainment</span>
                  <span className="text-[11px] text-slate-500">Live streaming to phone</span>
                </div>
              </div>
            </div>

            {/* 4. FARE OPTIONS MATRIX (SAVER, FLEXI, SUPERFLEX, BUSINESS) */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Choose Your Fare Family
                </h3>
                <p className="text-xs text-slate-500">
                  Select your desired flexibility, baggage allowance, and cancellation policy
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {FLIGHT_FARE_TIERS.map((tier) => {
                  const isSelected = selectedTierId === tier.id;
                  const tierPrice = flight.price + tier.priceDelta;

                  return (
                    <div
                      key={tier.id}
                      onClick={() => setSelectedTierId(tier.id as any)}
                      className={`border-2 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between space-y-4 ${
                        isSelected
                          ? "border-sky-600 bg-sky-50/40 shadow-lg ring-2 ring-sky-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                            {tier.name}
                          </span>
                          {tier.badge && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                              {tier.badge}
                            </span>
                          )}
                        </div>

                        <div className="py-1">
                          <span className="text-xl font-black text-slate-900">
                            ₹{tierPrice.toLocaleString("en-IN")}
                          </span>
                          <span className="text-[10px] text-slate-500 block">per passenger + taxes</span>
                        </div>

                        {/* Inclusions list */}
                        <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Cabin: {tier.cabinBaggage}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Check-in: {tier.checkInBaggage}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="line-clamp-1">{tier.dateChangeFee}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="line-clamp-1">{tier.cancellationFee}</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{tier.mealBenefit}</span>
                          </li>
                        </ul>
                      </div>

                      <div className="pt-2 border-t border-slate-100">
                        {isSelected ? (
                          <div className="w-full py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center justify-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Selected
                          </div>
                        ) : (
                          <div className="w-full py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs text-center hover:bg-slate-200">
                            Select Fare
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. FARE RULES & CANCELLATION TIMELINE SUMMARY */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Fare Rules &amp; Rescheduling Conditions ({activeTier.name})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">Date Change Fee</span>
                  <p className="text-slate-600">{activeTier.dateChangeFee}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">Cancellation Penalty</span>
                  <p className="text-slate-600">{activeTier.cancellationFee}</p>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">Seat Selection Rule</span>
                  <p className="text-slate-600">{activeTier.seatSelection}</p>
                </div>
              </div>
            </div>

            {/* 6. PROMO OFFERS STRIP */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                  <Percent className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Apply Airline Promo Code FLYBHARAT</h4>
                  <p className="text-[11px] text-slate-600">Save 10% instant discount up to ₹1,500 on all flights</p>
                </div>
              </div>
              <button
                onClick={() => handleApplyCoupon("FLYBHARAT")}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Apply Coupon FLYBHARAT
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: PASSENGER PROFILE FORM */}
        {/* ========================================================================= */}
        {currentStep === "passengers" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Journey Header */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{flight.airline} • {flight.flightNumber}</span>
                <p className="text-slate-500">{flight.fromCity} ({flight.fromCode}) ➔ {flight.toCity} ({flight.toCode})</p>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900">{departDate}</span>
                <p className="text-slate-500">{activeTier.name} • {passengers.length} Passenger(s)</p>
              </div>
            </div>

            {/* Primary Contact & Notification Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-600" />
                Lead Passenger Contact &amp; E-Ticket Delivery
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Mobile Number (For SMS &amp; Gate Alerts)</label>
                  <input
                    type="text"
                    value={leadContact.mobile}
                    onChange={(e) => setLeadContact({ ...leadContact, mobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email Address (E-Ticket &amp; Tax Invoice)</label>
                  <input
                    type="email"
                    value={leadContact.email}
                    onChange={(e) => setLeadContact({ ...leadContact, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Passengers List */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                Passenger Details ({passengers.length} Passenger{passengers.length > 1 ? "s" : ""})
              </h3>

              {passengers.map((pax, idx) => (
                <div key={pax.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-black text-slate-900 text-sm">
                      Passenger {idx + 1} {idx === 0 ? "(Lead Traveler)" : ""}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-bold uppercase text-[10px]">
                      {pax.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Title</label>
                      <select
                        value={pax.title}
                        onChange={(e) => {
                          const copy = [...passengers];
                          copy[idx].title = e.target.value;
                          setPassengers(copy);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                      >
                        <option value="Mr">Mr.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Dr">Dr.</option>
                        <option value="Master">Master</option>
                      </select>
                    </div>

                    <div className="sm:col-span-1 space-y-1">
                      <label className="font-bold text-slate-700">First &amp; Middle Name</label>
                      <input
                        type="text"
                        value={pax.firstName}
                        onChange={(e) => {
                          const copy = [...passengers];
                          copy[idx].firstName = e.target.value;
                          setPassengers(copy);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-700">Last Name</label>
                      <input
                        type="text"
                        value={pax.lastName}
                        onChange={(e) => {
                          const copy = [...passengers];
                          copy[idx].lastName = e.target.value;
                          setPassengers(copy);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Date of Birth</label>
                      <input
                        type="date"
                        value={pax.dob}
                        onChange={(e) => {
                          const copy = [...passengers];
                          copy[idx].dob = e.target.value;
                          setPassengers(copy);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700">Gender</label>
                      <select
                        value={pax.gender}
                        onChange={(e) => {
                          const copy = [...passengers];
                          copy[idx].gender = e.target.value as any;
                          setPassengers(copy);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-bold text-slate-700">Frequent Flyer Number (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. 6E-9920144 / AI-778219"
                        value={pax.frequentFlyerNumber || ""}
                        onChange={(e) => {
                          const copy = [...passengers];
                          copy[idx].frequentFlyerNumber = e.target.value;
                          setPassengers(copy);
                        }}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                      />
                    </div>

                    {flight.isInternational && (
                      <>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-slate-700">Passport Number (Required for Int'l)</label>
                          <input
                            type="text"
                            value={pax.passportNumber || ""}
                            onChange={(e) => {
                              const copy = [...passengers];
                              copy[idx].passportNumber = e.target.value;
                              setPassengers(copy);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="font-bold text-slate-700">Passport Expiry Date</label>
                          <input
                            type="date"
                            value={pax.passportExpiry || ""}
                            onChange={(e) => {
                              const copy = [...passengers];
                              copy[idx].passportExpiry = e.target.value;
                              setPassengers(copy);
                            }}
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Corporate GST Tax Invoice Toggle */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGstRequested}
                  onChange={(e) => setIsGstRequested(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Use Corporate GSTIN for 18% / 5% Tax Input Credit (SAC 996411)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Get an instant GST-compliant B2B invoice with corporate name &amp; GST number
                  </span>
                </div>
              </label>

              {isGstRequested && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Company Registered Name</label>
                    <input
                      type="text"
                      value={gstDetails.companyName}
                      onChange={(e) => setGstDetails({ ...gstDetails, companyName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">15-Digit GSTIN</label>
                    <input
                      type="text"
                      value={gstDetails.gstin}
                      onChange={(e) => setGstDetails({ ...gstDetails, gstin: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900 uppercase"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: SEATS, BAGGAGE & ANCILLARY ADD-ONS */}
        {/* ========================================================================= */}
        {currentStep === "seats_addons" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-7">
            {/* 1. SEAT SELECTION CABIN MAP */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Armchair className="w-4 h-4 text-sky-600" />
                    Select Seats for Travelers
                  </h3>
                  <p className="text-xs text-slate-500">
                    Active passenger: <span className="font-bold text-sky-700">{passengers[activeSeatPassengerIdx]?.firstName} ({passengers[activeSeatPassengerIdx]?.selectedSeatId || "None"})</span>
                  </p>
                </div>

                {/* Passenger Selector Tabs */}
                <div className="flex gap-1">
                  {passengers.map((p, idx) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveSeatPassengerIdx(idx)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        activeSeatPassengerIdx === idx
                          ? "bg-sky-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      Pax {idx + 1}: {p.selectedSeatId || "Select"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aircraft Cabin Seat Grid */}
              <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-300 border-b border-slate-800 pb-3">
                  <span>Front of Aircraft (Cockpit ➔)</span>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-emerald-500" /> Free Seat (₹0)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-sky-500" /> Window / Aisle (₹250)
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-sm bg-purple-500" /> XL Legroom (₹650)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 max-h-48 overflow-y-auto p-2">
                  {aircraftSeats.map((seat) => {
                    const isSelectedByAny = passengers.some((p) => p.selectedSeatId === seat.id);
                    const isSelectedByCurrent = passengers[activeSeatPassengerIdx]?.selectedSeatId === seat.id;

                    return (
                      <button
                        key={seat.id}
                        disabled={!seat.isAvailable}
                        onClick={() => handleAssignSeat(seat)}
                        className={`p-2 rounded-xl text-center flex flex-col items-center justify-center border transition-all text-xs ${
                          !seat.isAvailable
                            ? "bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed opacity-40"
                            : isSelectedByCurrent
                            ? "bg-white text-slate-950 border-white ring-2 ring-sky-400 font-black shadow-lg scale-105"
                            : isSelectedByAny
                            ? "bg-sky-700 border-sky-500 text-white font-bold"
                            : seat.price === 0
                            ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900"
                            : seat.price > 500
                            ? "bg-purple-950/60 border-purple-500/40 text-purple-300 hover:bg-purple-900"
                            : "bg-sky-950/60 border-sky-500/40 text-sky-300 hover:bg-sky-900"
                        }`}
                      >
                        <span className="font-mono font-bold text-[11px]">{seat.id}</span>
                        <span className="text-[9px] opacity-80">
                          {seat.price === 0 ? "Free" : `₹${seat.price}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 2. EXTRA BAGGAGE PACKS */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Luggage className="w-4 h-4 text-sky-600" />
                Pre-book Extra Check-in Baggage (Save up to 40% vs Airport Counter)
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div
                  onClick={() => setSelectedBaggageOptionId("none")}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedBaggageOptionId === "none"
                      ? "border-sky-600 bg-sky-50 font-bold"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span className="font-black text-slate-900 block">Standard Allowance</span>
                  <span className="text-slate-500 text-[11px]">{activeTier.checkInBaggage} included</span>
                  <span className="text-slate-900 font-bold block mt-1">₹0</span>
                </div>

                {EXTRA_BAGGAGE_OPTIONS.map((bag) => (
                  <div
                    key={bag.id}
                    onClick={() => setSelectedBaggageOptionId(bag.id)}
                    className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedBaggageOptionId === bag.id
                        ? "border-sky-600 bg-sky-50 font-bold"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-900">{bag.label}</span>
                      <span className="text-[10px] text-emerald-700 font-bold">Save ₹{(bag.airportCounterPrice - bag.price).toLocaleString("en-IN")}</span>
                    </div>
                    <span className="text-slate-500 text-[11px]">+{bag.weightKg} kg Check-in Pack</span>
                    <span className="text-slate-900 font-black block mt-1">₹{bag.price.toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. IN-FLIGHT GOURMET MEALS SELECTION */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4 text-sky-600" />
                Pre-book In-Flight Gourmet Meals
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {INFLIGHT_MEALS.map((meal) => {
                  const isSelected = passengers[0]?.selectedMealId === meal.id;
                  const isVegDiet = meal.diet === "veg" || meal.diet === "jain" || meal.diet === "vegan";
                  const hasTierFreeMeal = activeTier.id === "superflex" || activeTier.id === "business" || activeTier.id === "flexi";
                  return (
                    <div
                      key={meal.id}
                      onClick={() => {
                        const copy = [...passengers];
                        copy[0].selectedMealId = meal.id;
                        setPassengers(copy);
                      }}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                        isSelected ? "border-sky-600 bg-sky-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-black text-slate-900">{meal.name}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isVegDiet ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                            {isVegDiet ? "VEG" : "NON-VEG"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{meal.description}</p>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="font-black text-slate-900">
                          {hasTierFreeMeal ? "Free (Included)" : `₹${meal.price}`}
                        </span>
                        {isSelected && <span className="text-sky-700 font-bold text-[11px]">✓ Selected</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. VALUE ADD-ONS (LOUNGE PASS, ZERO CANCEL GUARANTEE) */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                BharatYatra Travel Perks &amp; Protection
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {FLIGHT_ADDONS_LIST.map((addon) => {
                  const isChecked = selectedAddonIds.includes(addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => handleToggleAddon(addon.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isChecked ? "border-sky-600 bg-sky-50/50" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">{addon.name}</span>
                          {addon.badge && (
                            <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                              {addon.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-500 text-[11px]">{addon.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-black text-slate-900 block">₹{addon.price}</span>
                        <div className="mt-1">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 text-sky-600 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: REVIEW BOOKING & SECURE PAYMENT */}
        {/* ========================================================================= */}
        {currentStep === "payment" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Review Summary & Payment Modes */}
              <div className="lg:col-span-7 space-y-6">
                {/* Flight & Passenger Summary Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div>
                      <span className="font-black text-slate-900 text-sm">{flight.airline} • {flight.flightNumber}</span>
                      <p className="text-slate-500">{flight.fromCity} ({flight.fromCode}) ➔ {flight.toCity} ({flight.toCode})</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-bold">
                      {activeTier.name}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-600">
                    <p><strong>Departure:</strong> {departDate} at {flight.departTime} ({flight.terminalDep})</p>
                    <p><strong>Arrival:</strong> {flight.arriveTime} ({flight.terminalArr}) • {flight.duration} • {flight.stops}</p>
                    <p><strong>Passengers:</strong> {passengers.map((p) => `${p.title} ${p.firstName} ${p.lastName} (${p.selectedSeatId || "12A"})`).join(", ")}</p>
                    <p><strong>Contact:</strong> {leadContact.mobile} • {leadContact.email}</p>
                  </div>
                </div>

                {/* Payment Gateway Options */}
                <div className="space-y-3">
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-sky-600" />
                    Select Payment Method
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: "UPI", label: "Instant UPI (GPay/PhonePe)", icon: QrCode },
                      { id: "CARD", label: "Credit / Debit Card", icon: CreditCard },
                      { id: "NETBANKING", label: "Net Banking", icon: FileText },
                      { id: "WALLET", label: "BharatYatra Wallet", icon: Sparkles },
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => setPaymentMethod(mode.id as any)}
                        className={`p-3 rounded-xl border-2 text-left transition-all flex flex-col justify-between gap-2 ${
                          paymentMethod === mode.id
                            ? "border-sky-600 bg-sky-50 font-bold"
                            : "border-slate-200 bg-white hover:border-slate-300"
                        }`}
                      >
                        <mode.icon className="w-4 h-4 text-sky-600" />
                        <span className="text-xs text-slate-900">{mode.label}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "UPI" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
                      <label className="font-bold text-slate-700">Enter UPI ID / VPA</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          placeholder="e.g. mobile@upi"
                          className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                        />
                        <button className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs">
                          Verify VPA
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        ⚡ Instant payment request will be triggered to your Google Pay / PhonePe app.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Itemized Price Breakdown */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
                  <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider border-b border-slate-200 pb-2">
                    Itemized Fare &amp; Tax Breakdown
                  </h4>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Base Airfare ({passengers.length} Pax × ₹{priceBreakdown.baseFarePerPassenger.toLocaleString("en-IN")})</span>
                      <span className="font-bold text-slate-900">₹{priceBreakdown.grossBaseAirfare.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Airline Fuel Surcharge (YQ)</span>
                      <span className="font-bold text-slate-900">₹{priceBreakdown.fuelSurcharge.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Airport PSF &amp; UDF Fees</span>
                      <span className="font-bold text-slate-900">₹{priceBreakdown.airportTaxes.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>GST (K3 Aviation Tax @ {priceBreakdown.gstRatePercent}%)</span>
                      <span className="font-bold text-slate-900">₹{priceBreakdown.gstAmount.toLocaleString("en-IN")}</span>
                    </div>

                    {priceBreakdown.seatCost > 0 && (
                      <div className="flex justify-between text-indigo-700">
                        <span>Preferred Seat Selection</span>
                        <span className="font-bold">₹{priceBreakdown.seatCost.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {priceBreakdown.mealsCost > 0 && (
                      <div className="flex justify-between text-indigo-700">
                        <span>In-flight Gourmet Meals</span>
                        <span className="font-bold">₹{priceBreakdown.mealsCost.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {priceBreakdown.extraBaggageCost > 0 && (
                      <div className="flex justify-between text-indigo-700">
                        <span>Extra Check-in Baggage Pack</span>
                        <span className="font-bold">₹{priceBreakdown.extraBaggageCost.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {priceBreakdown.addonsCost > 0 && (
                      <div className="flex justify-between text-indigo-700">
                        <span>Lounge &amp; Zero Cancellation Cover</span>
                        <span className="font-bold">₹{priceBreakdown.addonsCost.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {priceBreakdown.couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>Promo Code Discount ({appliedCouponCode})</span>
                        <span>-₹{priceBreakdown.couponDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {priceBreakdown.yatraCoinsDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-bold">
                        <span>YatraCoins Reward Redeemed (480 Coins)</span>
                        <span>-₹{priceBreakdown.yatraCoinsDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-500">
                      <span>Convenience Fee (Yatra Club Waived)</span>
                      <span className="text-emerald-700 font-bold">FREE</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Total Amount Payable</span>
                      <span className="text-2xl font-black text-slate-900">
                        ₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                      Instant Confirmation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: CONFIRMED E-TICKET & AIRLINE PNR */}
        {/* ========================================================================= */}
        {currentStep === "confirmed" && confirmedBookingData && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-emerald-600 text-white rounded-3xl p-6 text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-emerald-100">
                Official E-Ticket Issued &amp; PNR Generated
              </span>
              <h3 className="text-2xl font-black text-white">Have a Safe &amp; Wonderful Flight!</h3>
              <p className="text-xs text-emerald-100">
                Official airline PNR and boarding pass have been dispatched to {leadContact.mobile} &amp; {leadContact.email}.
              </p>
            </div>

            {/* Official Boarding Pass Ticket */}
            <div className="border-2 border-dashed border-slate-300 rounded-3xl p-6 bg-slate-50 space-y-5 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-base text-slate-900">{flight.airline}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono font-bold">
                      {flight.flightNumber}
                    </span>
                  </div>
                  <p className="text-slate-500 font-mono">Aircraft: {flight.aircraft}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Airline PNR</span>
                    <span className="text-sm font-black text-sky-600 font-mono">{confirmedBookingData.pnr}</span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">E-Ticket Number</span>
                    <span className="text-xs font-black text-slate-900 font-mono">{confirmedBookingData.ticketNumber}</span>
                  </div>
                </div>
              </div>

              {/* Route & Times */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">From</span>
                  <span className="text-sm font-black text-slate-900">{flight.fromCity} ({flight.fromCode})</span>
                  <span className="text-[11px] text-slate-500 block">{flight.terminalDep}</span>
                  <span className="text-xs font-bold text-sky-600 block mt-1">{flight.departTime} ({departDate})</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">To</span>
                  <span className="text-sm font-black text-slate-900">{flight.toCity} ({flight.toCode})</span>
                  <span className="text-[11px] text-slate-500 block">{flight.terminalArr}</span>
                  <span className="text-xs font-bold text-sky-600 block mt-1">{flight.arriveTime}</span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Passengers &amp; Seats</span>
                  {passengers.map((p, i) => (
                    <span key={i} className="text-xs font-bold text-slate-900 block">
                      {p.firstName} {p.lastName} • Seat {p.selectedSeatId || "12A"}
                    </span>
                  ))}
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Baggage &amp; Meals</span>
                  <span className="text-xs font-bold text-slate-900 block">
                    Cabin: {flight.cabinBaggageKg}kg • Check-in: {flight.checkInBaggageKg}kg
                  </span>
                  <span className="text-[11px] text-emerald-700 font-semibold block">
                    {activeTier.mealBenefit}
                  </span>
                </div>
              </div>

              {/* GST Tax Invoice Bar */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-slate-600" />
                  <span className="text-slate-600 font-medium">
                    Invoice #{confirmedBookingData.gstInvoice?.invoiceNumber} • SAC Code 996411 • Total Paid: <strong>₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")}</strong>
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Print E-Ticket
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs"
                  >
                    View in My Trips
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL FOOTER: BACK & STEP FORWARD ACTIONS */}
        {/* ========================================================================= */}
        {currentStep !== "confirmed" && (
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <div>
              {currentStep !== "details" ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === "passengers") setCurrentStep("details");
                    if (currentStep === "seats_addons") setCurrentStep("passengers");
                    if (currentStep === "payment") setCurrentStep("seats_addons");
                  }}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 flex items-center gap-1.5 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div className="text-xs text-slate-500">
                  <span>100% Secure &amp; DGCA Verified Aviation Booking</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Total Payable</span>
                <span className="text-lg font-black text-slate-900">
                  ₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")}
                </span>
              </div>

              {currentStep === "details" && (
                <button
                  type="button"
                  onClick={() => setCurrentStep("passengers")}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Select Fare &amp; Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === "passengers" && (
                <button
                  type="button"
                  onClick={() => setCurrentStep("seats_addons")}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Pick Seats &amp; Add-ons</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === "seats_addons" && (
                <button
                  type="button"
                  onClick={() => setCurrentStep("payment")}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === "payment" && (
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleProcessFlightBooking}
                  className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Issuing Ticket &amp; PNR...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Pay ₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")} &amp; Issue PNR</span>
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
