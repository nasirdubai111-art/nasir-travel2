import React, { useState, useEffect } from "react";
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
  Users,
  UserPlus,
  Trash2,
  Phone,
  Mail,
  Building,
  Sparkles,
  Ticket,
  QrCode,
  ArrowRight,
  Globe,
  ArrowRightLeft,
  Share2,
  Send,
  Smartphone,
  Printer,
  Copy,
  Check,
  Layers,
  ExternalLink,
  Zap,
  Lock,
  Settings,
} from "lucide-react";
import confetti from "canvas-confetti";
import { BookingItem, BookingPassengerDetail, ServiceCategory, TravelOffer, UserProfile, RazorpayPaymentResult, SavedQuickPayMethod, SplitBillConfig } from "../types";
import { PROMO_OFFERS } from "../data/mockTravelData";
import { SUPPORTED_CURRENCIES, convertFromInr, getCurrencyInfo } from "../data/currencyData";
import { RazorpayCheckoutModal } from "./RazorpayCheckoutModal";
import { DynamicQRCode } from "./DynamicQRCode";
import { QuickPayService } from "../services/QuickPayService";
import { QuickPayManagerModal } from "./payment/QuickPayManagerModal";
import { SplitBillSection } from "./payment/SplitBillSection";
import { SplitBillModal } from "./payment/SplitBillModal";
import { SplitBillService } from "../services/SplitBillService";
import { CommonCalendar } from "./calendar/CommonCalendar";
import { TimeSlotSelector } from "./calendar/TimeSlotSelector";
import { CalendarService } from "../services/CalendarService";
import { CalendarTimeSlot, CalendarDateAvailability, CalendarServiceType } from "../types";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  serviceCategory: ServiceCategory;
  userProfile: UserProfile;
  onConfirmBooking: (newBooking: BookingItem) => void;
}

interface PassengerInputItem {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  seatPreference: string;
  phone: string;
  email: string;
}

function getSeatAllocationForService(serviceCategory: ServiceCategory, index: number): string {
  if (serviceCategory === "flights") {
    const row = 12 + Math.floor(index / 3);
    const col = ["A (Window)", "B (Middle)", "C (Aisle)", "D (Aisle)", "E (Middle)", "F (Window)"][index % 6];
    return `Seat ${row}${col}`;
  }
  if (serviceCategory === "trains") {
    const coach = "B3";
    const berthNum = 21 + index;
    const berthType = ["Lower Berth", "Middle Berth", "Upper Berth", "Side Lower"][index % 4];
    return `Coach ${coach} • Berth ${berthNum} (${berthType})`;
  }
  if (serviceCategory === "buses") {
    const seatNum = 14 + index;
    const pos = index % 2 === 0 ? "Window - Lower" : "Aisle - Lower";
    return `Seat ${seatNum} (${pos})`;
  }
  if (serviceCategory === "hotels" || serviceCategory === "resorts" || serviceCategory === "lodges" || serviceCategory === "houseboats") {
    return `Room 30${1 + Math.floor(index / 2)} • Bed ${index % 2 === 0 ? "A (King)" : "B (Twin)"}`;
  }
  return `Pass #${index + 1} (Confirmed Standard)`;
}

export function BookingModal({
  isOpen,
  onClose,
  item,
  serviceCategory,
  userProfile,
  onConfirmBooking,
}: BookingModalProps) {
  // Multi-passenger state
  const [passengersList, setPassengersList] = useState<PassengerInputItem[]>([
    {
      id: "p-1",
      name: userProfile.name || "Primary Traveler",
      age: 32,
      gender: "Male",
      seatPreference: getSeatAllocationForService(serviceCategory, 0),
      phone: userProfile.phone || "+91 98765 43210",
      email: userProfile.email || "yatri@bharatyatra.in",
    },
  ]);

  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<TravelOffer | null>(null);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "wallet" | "card" | "emi">("upi");
  const [rememberAsQuickPay, setRememberAsQuickPay] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuickPaying, setIsQuickPaying] = useState(false);
  const [isQuickPayManagerOpen, setIsQuickPayManagerOpen] = useState(false);
  const [preferredQuickPay, setPreferredQuickPay] = useState<SavedQuickPayMethod>(() => QuickPayService.getPreferredMethod());
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingItem | null>(null);

  // Subscribe to QuickPay preference updates
  useEffect(() => {
    const unsub = QuickPayService.subscribe(() => {
      setPreferredQuickPay(QuickPayService.getPreferredMethod());
    });
    return unsub;
  }, []);

  // Post-booking view mode state
  const [activeConfirmationTab, setActiveConfirmationTab] = useState<"master" | "split" | "splitbill">("split");
  const [selectedSplitPassengerIndex, setSelectedSplitPassengerIndex] = useState<number>(0);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [dispatchedToast, setDispatchedToast] = useState<string | null>(null);

  // Split Bill State
  const [isSplitBillModalOpen, setIsSplitBillModalOpen] = useState(false);
  const [showPreBookingSplitBill, setShowPreBookingSplitBill] = useState(false);
  const [customSplitConfig, setCustomSplitConfig] = useState<SplitBillConfig | null>(null);

  // Currency Toggle State
  const [selectedCurrency, setSelectedCurrency] = useState<string>(userProfile.preferredCurrency || "INR");

  // Central Calendar & Timings Integration
  const getCalendarServiceType = (cat: ServiceCategory): CalendarServiceType => {
    switch (cat) {
      case "flights": return "flights";
      case "trains": return "trains";
      case "buses": return "buses";
      case "hotels":
      case "lodges":
      case "resorts":
      case "houseboats": return "hotels";
      case "tours": return "tours";
      case "pilgrimage": return "pilgrimage";
      case "cabs": return "cabs";
      default: return "activities";
    }
  };
  const calendarServiceType: CalendarServiceType = getCalendarServiceType(serviceCategory);

  const [bookingDate, setBookingDate] = useState<string>(item.date || "2026-09-03");
  const [bookingEndDate, setBookingEndDate] = useState<string>("2026-09-06");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<CalendarTimeSlot | null>(null);
  const [customBookingTime, setCustomBookingTime] = useState<string>(item.departTime || item.departureTime || "08:30");
  const [isCalendarExpanded, setIsCalendarExpanded] = useState(false);
  const [isTimeSlotsExpanded, setIsTimeSlotsExpanded] = useState(false);
  const [currentDateAvailability, setCurrentDateAvailability] = useState<CalendarDateAvailability | null>(null);

  useEffect(() => {
    let isMounted = true;
    CalendarService.getAvailability(calendarServiceType, bookingDate, bookingDate)
      .then((res) => {
        if (isMounted && res && res.length > 0) {
          setCurrentDateAvailability(res[0]);
        }
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, [calendarServiceType, bookingDate]);

  if (!isOpen || !item) return null;

  // Passenger count & dynamic cost calculations
  const passengerCount = passengersList.length;
  const basePricePerPerson = item.price || item.pricePerNight || item.pricePerPerson || item.estimatedFare || 2999;
  const totalBasePrice = basePricePerPerson * passengerCount;

  const insuranceRatePercent = 2.5; // 2.5% of total trip value
  const singleInsurancePremium = Math.max(99, Math.round(basePricePerPerson * (insuranceRatePercent / 100)));
  const totalInsuranceCost = includeInsurance ? singleInsurancePremium * passengerCount : 0;
  
  const convenienceFee = serviceCategory === "trains" ? 30 : serviceCategory === "flights" ? 249 : 49;
  const discountAmount = appliedOffer ? 500 : 0;
  
  // Applicable taxes (5%)
  const taxesAndFees = Math.round((totalBasePrice + convenienceFee + totalInsuranceCost) * 0.05);
  const finalTotalInr = Math.max(0, totalBasePrice + totalInsuranceCost + convenienceFee + taxesAndFees - discountAmount);

  // Conversion calculations
  const currencyInfo = getCurrencyInfo(selectedCurrency);
  const convertedTotal = convertFromInr(finalTotalInr, selectedCurrency);
  const convertedBase = convertFromInr(totalBasePrice, selectedCurrency);

  const handleAddPassenger = () => {
    if (passengersList.length >= 6) {
      alert("Maximum 6 passengers allowed per group booking.");
      return;
    }
    const nextIdx = passengersList.length;
    const sampleNames = ["Priya Sharma", "Aarav Sharma", "Ananya Verma", "Vikram Malhotra", "Sneha Patel"];
    const nextName = sampleNames[nextIdx - 1] || `Traveler ${nextIdx + 1}`;
    
    setPassengersList([
      ...passengersList,
      {
        id: `p-${Date.now()}-${nextIdx}`,
        name: nextName,
        age: 28 + nextIdx,
        gender: nextIdx % 2 === 1 ? "Female" : "Male",
        seatPreference: getSeatAllocationForService(serviceCategory, nextIdx),
        phone: userProfile.phone || "+91 98765 43210",
        email: userProfile.email || "co-traveler@bharatyatra.in",
      },
    ]);
  };

  const handleRemovePassenger = (id: string) => {
    if (passengersList.length <= 1) {
      alert("At least 1 passenger is required for booking.");
      return;
    }
    const updated = passengersList.filter((p) => p.id !== id);
    setPassengersList(updated);
  };

  const handleUpdatePassenger = (id: string, field: keyof PassengerInputItem, val: any) => {
    setPassengersList(
      passengersList.map((p) => (p.id === id ? { ...p, [field]: val } : p))
    );
  };

  const handleApplyPromo = (code: string) => {
    const offer = PROMO_OFFERS.find((o) => o.code.toLowerCase() === code.trim().toLowerCase());
    if (offer) {
      setAppliedOffer(offer);
      setPromoCodeInput(offer.code);
    } else {
      alert("Invalid promo code. Try HDFCFLY, VANDEZERO, or YATRASTAY.");
    }
  };

  const createStructuredPassengerDetails = (masterPnr: string): BookingPassengerDetail[] => {
    const shareAmount = Math.round(finalTotalInr / passengersList.length);
    return passengersList.map((p, idx) => ({
      id: p.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      seatNumber: p.seatPreference || getSeatAllocationForService(serviceCategory, idx),
      phone: p.phone,
      email: p.email,
      subPnr: `${masterPnr}-P${idx + 1}`,
      ticketId: `TKT-${serviceCategory.slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-0${idx + 1}`,
      gateToken: `GP-${masterPnr}-P${idx + 1}`,
      fareShare: shareAmount,
      idProofType: "Aadhaar / DigiLocker Verified",
      idProofNumber: `XXXX-XXXX-${Math.floor(1000 + Math.random() * 9000)}`,
    }));
  };

  const generateAndSaveSplitBill = (
    masterPnr: string,
    structuredPassengers: BookingPassengerDetail[],
    totalInr: number
  ): SplitBillConfig => {
    const splitConfig =
      customSplitConfig ||
      SplitBillService.createDefaultSplitConfig({
        totalAmount: totalInr,
        title: item.title || item.name || item.trainName || item.operator || "Travel Reservation",
        subtitle:
          item.subtitle ||
          item.destination ||
          item.city ||
          `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`,
        serviceCategory,
        pnr: masterPnr,
        userProfile,
        passengers: structuredPassengers.map((p) => ({
          id: p.id,
          name: p.name,
          phone: p.phone,
          email: p.email,
          seatNumber: p.seatNumber,
        })),
        customUpiId: preferredQuickPay.upiId,
      });

    SplitBillService.saveSplitBill(splitConfig);
    setCustomSplitConfig(splitConfig);
    return splitConfig;
  };

  const handleQuickPay = async () => {
    if (isQuickPaying || isProcessing) return;
    setIsQuickPaying(true);

    try {
      const activePref = QuickPayService.getPreferredMethod();
      const result = await QuickPayService.executeOneClickAuth(activePref, finalTotalInr);

      const generatedPolicyNumber = includeInsurance 
        ? `POL-BY-INS-${Math.floor(100000 + Math.random() * 900000)}` 
        : undefined;

      const masterPnr = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const structuredPassengers = createStructuredPassengerDetails(masterPnr);
      const splitBillConfig = generateAndSaveSplitBill(masterPnr, structuredPassengers, finalTotalInr);

      const newBooking: BookingItem = {
        id: `BK-${serviceCategory.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceType: serviceCategory,
        title: item.title || item.name || item.trainName || item.operator || "Travel Reservation",
        subtitle: item.subtitle || item.destination || item.city || `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`,
        date: "28 Aug 2026",
        time: item.departTime || item.departureTime || "10:00 AM",
        status: "confirmed",
        pnr: masterPnr,
        amount: finalTotalInr,
        baseFare: totalBasePrice,
        insuranceIncluded: includeInsurance,
        insurancePremium: totalInsuranceCost,
        insurancePolicyNumber: generatedPolicyNumber,
        taxesAndFees: taxesAndFees,
        convenienceFee: convenienceFee,
        discountAmount: discountAmount,
        passengers: passengerCount,
        passengersCount: passengerCount,
        passengerDetailsList: structuredPassengers,
        seatInfo: structuredPassengers.map((p) => p.seatNumber).join(", "),
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        splitBillConfig,
        paymentSummary: {
          totalAmount: finalTotalInr,
          baseFare: totalBasePrice,
          taxesAndGst: taxesAndFees,
          convenienceFee: convenienceFee,
          discountApplied: discountAmount,
          paymentMode: `Quick Pay™ (1-Click • ${activePref.title})`,
          paymentStatus: "PAID",
          transactionRef: result.razorpayPaymentId,
          paidAt: new Date().toISOString(),
          gateway: "BharatYatra QuickPay Express (RBI Tokenized)",
          method: activePref.type,
          transactionId: result.razorpayPaymentId,
          orderId: result.razorpayOrderId,
          rbiRrn: result.rbiRrn,
        },
      };

      onConfirmBooking(newBooking);
      setConfirmedBooking(newBooking);
      setIsQuickPaying(false);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } catch {
      setIsQuickPaying(false);
      alert("Quick Pay authorization error. Please choose a standard checkout method.");
    }
  };

  const handlePayAndConfirm = () => {
    if (rememberAsQuickPay) {
      if (paymentMethod === "wallet") {
        QuickPayService.saveNewMethod({
          type: "wallet",
          title: "BharatYatra Cash Wallet",
          detail: `₹${userProfile.walletBalance} Balance • Zero OTP`,
          iconName: "wallet",
          isDefault: true,
        });
      }
    }

    if (paymentMethod !== "wallet") {
      setIsRazorpayModalOpen(true);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const generatedPolicyNumber = includeInsurance 
        ? `POL-BY-INS-${Math.floor(100000 + Math.random() * 900000)}` 
        : undefined;

      const masterPnr = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const structuredPassengers = createStructuredPassengerDetails(masterPnr);
      const splitBillConfig = generateAndSaveSplitBill(masterPnr, structuredPassengers, finalTotalInr);

      const resolvedDateDisplay = new Date(bookingDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
      const resolvedTimeDisplay = selectedTimeSlot
        ? `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`
        : customBookingTime || item.departTime || item.departureTime || "10:00 AM";

      const newBooking: BookingItem = {
        id: `BK-${serviceCategory.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        serviceType: serviceCategory,
        title: item.title || item.name || item.trainName || item.operator || "Travel Reservation",
        subtitle: item.subtitle || item.destination || item.city || `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`,
        date: resolvedDateDisplay,
        time: resolvedTimeDisplay,
        status: "confirmed",
        pnr: masterPnr,
        amount: finalTotalInr,
        baseFare: totalBasePrice,
        insuranceIncluded: includeInsurance,
        insurancePremium: totalInsuranceCost,
        insurancePolicyNumber: generatedPolicyNumber,
        taxesAndFees: taxesAndFees,
        convenienceFee: convenienceFee,
        discountAmount: discountAmount,
        passengers: passengerCount,
        passengersCount: passengerCount,
        passengerDetailsList: structuredPassengers,
        seatInfo: structuredPassengers.map((p) => p.seatNumber).join(", "),
        invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        splitBillConfig,
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
    }, 1200);
  };

  const handleRazorpaySuccess = (result: RazorpayPaymentResult) => {
    setIsRazorpayModalOpen(false);

    if (rememberAsQuickPay) {
      if (result.method === "upi") {
        QuickPayService.saveNewMethod({
          type: "upi",
          title: "Saved UPI 1-Click",
          detail: result.vpa || `${passengersList[0]?.name?.toLowerCase().replace(/\s+/g, "") || "user"}@upi`,
          iconName: "upi",
          isDefault: true,
          upiId: result.vpa || "preferred@upi",
        });
      } else if (result.method === "card") {
        QuickPayService.saveNewMethod({
          type: "card",
          title: `${result.bank || "Saved"} Card`,
          detail: `•••• ${result.card?.last4 || "4821"} • RBI Tokenized`,
          iconName: "card",
          isDefault: true,
          cardLast4: result.card?.last4 || "4821",
          cardNetwork: (result.card?.network?.toLowerCase() === "rupay" ? "rupay" : result.card?.network?.toLowerCase() === "mastercard" ? "mastercard" : result.card?.network?.toLowerCase() === "amex" ? "amex" : "visa"),
        });
      }
    }

    const generatedPolicyNumber = includeInsurance 
      ? `POL-BY-INS-${Math.floor(100000 + Math.random() * 900000)}` 
      : undefined;

    const masterPnr = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const structuredPassengers = createStructuredPassengerDetails(masterPnr);
    const splitBillConfig = generateAndSaveSplitBill(masterPnr, structuredPassengers, finalTotalInr);

    const resolvedDateDisplay = new Date(bookingDate).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    const resolvedTimeDisplay = selectedTimeSlot
      ? `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`
      : customBookingTime || item.departTime || item.departureTime || "10:00 AM";

    const newBooking: BookingItem = {
      id: `BK-${serviceCategory.slice(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      serviceType: serviceCategory,
      title: item.title || item.name || item.trainName || item.operator || "Travel Reservation",
      subtitle: item.subtitle || item.destination || item.city || `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`,
      date: resolvedDateDisplay,
      time: resolvedTimeDisplay,
      status: "confirmed",
      pnr: masterPnr,
      amount: finalTotalInr,
      baseFare: totalBasePrice,
      insuranceIncluded: includeInsurance,
      insurancePremium: totalInsuranceCost,
      insurancePolicyNumber: generatedPolicyNumber,
      taxesAndFees: taxesAndFees,
      convenienceFee: convenienceFee,
      discountAmount: discountAmount,
      passengers: passengerCount,
      passengersCount: passengerCount,
      passengerDetailsList: structuredPassengers,
      seatInfo: structuredPassengers.map((p) => p.seatNumber).join(", "),
      invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      splitBillConfig,
      paymentSummary: {
        totalAmount: finalTotalInr,
        baseFare: totalBasePrice,
        taxesAndGst: taxesAndFees,
        convenienceFee: convenienceFee,
        discountApplied: discountAmount,
        paymentMode: `Razorpay (${result.method.toUpperCase()})`,
        paymentStatus: "PAID",
        transactionRef: result.razorpayPaymentId,
        paidAt: new Date().toISOString(),
        gateway: "Razorpay Standard Checkout",
        method: result.method,
        transactionId: result.razorpayPaymentId,
        orderId: result.razorpayOrderId,
        rbiRrn: result.rbiRrn,
      },
    };

    onConfirmBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  const handleSharePassengerTicket = (passenger: BookingPassengerDetail) => {
    const text = `🇮🇳 *BharatYatra Digital Boarding Pass*\n👤 *Passenger:* ${passenger.name}\n🔖 *Sub-PNR:* ${passenger.subPnr}\n💺 *Seat:* ${passenger.seatNumber}\n📅 *Date & Time:* ${confirmedBooking?.date} • ${confirmedBooking?.time}\n🚦 *Gate Pass Token:* ${passenger.gateToken}\n🔒 *Verification:* Digilocker & IRCTC/AAI Validated\n\nShow this pass or QR at Station/Airport gate for direct check-in.`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setDispatchedToast(`Individual ticket for ${passenger.name} copied to clipboard! Ready to WhatsApp.`);
      setTimeout(() => setDispatchedToast(null), 3500);
    }
  };

  const handleDispatchAllPasses = () => {
    setDispatchedToast(`Dispatched individual digital tickets to all ${passengersList.length} passengers via SMS & WhatsApp!`);
    setTimeout(() => setDispatchedToast(null), 3500);
  };

  // Active confirmed passenger list
  const confirmedPassengers = confirmedBooking?.passengerDetailsList && confirmedBooking.passengerDetailsList.length > 0
    ? confirmedBooking.passengerDetailsList
    : [{
        id: "p-1",
        name: passengersList[0]?.name || userProfile.name,
        age: 32,
        gender: "Male",
        seatNumber: confirmedBooking?.seatInfo || "Confirmed",
        phone: userProfile.phone,
        email: userProfile.email,
        subPnr: `${confirmedBooking?.pnr}-P1`,
        ticketId: `TKT-01`,
        gateToken: `GP-${confirmedBooking?.pnr}-P1`,
        fareShare: confirmedBooking?.amount || finalTotalInr,
      }];

  const currentSplitPassenger = confirmedPassengers[selectedSplitPassengerIndex] || confirmedPassengers[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-600" />
              {confirmedBooking ? "Booking Confirmed & Split Tickets Ready!" : "Group & Individual Reservation Checkout"}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {confirmedBooking 
                ? "Split master invoice into individual passenger-specific digital boarding passes." 
                : "IRCTC / Airline / Partner direct confirmation with multi-passenger split ticketing"}
            </p>
          </div>
          <button
            onClick={() => {
              setConfirmedBooking(null);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {confirmedBooking ? (
            /* Post-Booking Split-Ticketing Confirmation Hub */
            <div className="space-y-5">
              {/* Success Notification Banner */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-emerald-900">Reservation &amp; Split Tickets Generated!</h4>
                <p className="text-xs text-emerald-700 max-w-lg mx-auto">
                  Master PNR <strong>{confirmedBooking.pnr}</strong> has been issued. You can now split the single large booking invoice into individual passenger-specific digital tickets for independent gate check-ins.
                </p>

                {dispatchedToast && (
                  <div className="mt-2 bg-emerald-700 text-white text-xs font-bold py-1.5 px-3 rounded-lg animate-in fade-in shadow-xs">
                    {dispatchedToast}
                  </div>
                )}
              </div>

              {/* View Mode Tabs: Split Tickets vs Split Bill vs Consolidated Group Invoice */}
              <div className="flex items-center justify-between gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold flex-wrap sm:flex-nowrap">
                <button
                  onClick={() => setActiveConfirmationTab("split")}
                  className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeConfirmationTab === "split"
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Layers className="w-4 h-4 text-indigo-600" />
                  <span>Split E-Tickets ({confirmedPassengers.length})</span>
                </button>

                <button
                  onClick={() => setActiveConfirmationTab("splitbill")}
                  className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeConfirmationTab === "splitbill"
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Split Bill &amp; Links</span>
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 hidden sm:inline">
                    UPI Links
                  </span>
                </button>

                <button
                  onClick={() => setActiveConfirmationTab("master")}
                  className={`flex-1 py-2 px-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeConfirmationTab === "master"
                      ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Ticket className="w-4 h-4 text-slate-700" />
                  <span>Master Invoice</span>
                </button>
              </div>

              {activeConfirmationTab === "split" ? (
                /* Split Passenger Digital Tickets View */
                <div className="space-y-4">
                  {/* Passenger Pill Selector */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {confirmedPassengers.map((p, idx) => (
                      <button
                        key={p.id || idx}
                        onClick={() => setSelectedSplitPassengerIndex(idx)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border shrink-0 transition-all cursor-pointer ${
                          selectedSplitPassengerIndex === idx
                            ? "bg-indigo-600 text-white border-indigo-700 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          selectedSplitPassengerIndex === idx ? "bg-white/20 text-white" : "bg-indigo-50 text-indigo-700"
                        }`}>
                          {idx + 1}
                        </div>
                        <span>{p.name}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          selectedSplitPassengerIndex === idx ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                        }`}>
                          {p.seatNumber?.split("•")[0] || p.seatNumber}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Active Passenger Individual E-Ticket Card */}
                  <div className="rounded-2xl border-2 border-indigo-600 bg-white p-5 space-y-4 shadow-sm relative overflow-hidden">
                    {/* Watermark Tag */}
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                      Individual Pass #{selectedSplitPassengerIndex + 1} of {confirmedPassengers.length}
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {serviceCategory.toUpperCase()} INDEPENDENT BOARDING PASS
                        </span>
                        <h5 className="text-base font-extrabold text-slate-900 mt-0.5">
                          {confirmedBooking.title}
                        </h5>
                        <p className="text-xs text-slate-500">{confirmedBooking.subtitle}</p>
                      </div>

                      <div className="text-left sm:text-right mt-1 sm:mt-0">
                        <span className="text-[10px] font-mono text-slate-400 block">INDIVIDUAL SUB-PNR</span>
                        <div className="text-sm font-mono font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 inline-block">
                          {currentSplitPassenger.subPnr || `${confirmedBooking.pnr}-P${selectedSplitPassengerIndex + 1}`}
                        </div>
                      </div>
                    </div>

                    {/* Passenger & Journey Highlights */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs border-b border-slate-100 items-center">
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Passenger Name</span>
                        <span className="font-bold text-slate-900 text-sm">{currentSplitPassenger.name}</span>
                        <span className="text-[10px] text-slate-500 block">Age: {currentSplitPassenger.age || 30} • {currentSplitPassenger.gender || "Adult"}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Assigned Seat / Berth</span>
                        <span className="font-bold text-indigo-700 text-sm block">{currentSplitPassenger.seatNumber}</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Confirmed Berth</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Departure Time</span>
                        <span className="font-bold text-slate-800">{confirmedBooking.date}</span>
                        <span className="text-[10px] text-slate-500 block">{confirmedBooking.time}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] block uppercase font-bold">Per-Passenger Share</span>
                        <span className="font-bold text-emerald-700 text-sm block">
                          ₹{(currentSplitPassenger.fareShare || Math.round(confirmedBooking.amount / confirmedPassengers.length)).toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-slate-400">All Taxes Paid</span>
                      </div>
                    </div>

                    {/* Dynamic Gate Pass QR Block */}
                    <div className="bg-gradient-to-r from-slate-50 to-indigo-50/50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1.5 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-indigo-950">
                          <QrCode className="w-4 h-4 text-indigo-600" />
                          <span>Passenger Dedicated Check-In QR</span>
                        </div>
                        <p className="text-[11px] text-slate-600 max-w-sm">
                          Encodes <strong>{currentSplitPassenger.name}</strong>'s individual credentials, seat assignment, and sub-PNR for direct automated gate clearance.
                        </p>
                        <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                          <span className="font-mono text-[10px] font-bold text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded">
                            TOKEN: {currentSplitPassenger.gateToken || `GP-${confirmedBooking.pnr}-P${selectedSplitPassengerIndex + 1}`}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                            KYC VERIFIED
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <DynamicQRCode
                          booking={confirmedBooking}
                          passenger={currentSplitPassenger}
                          userProfile={userProfile}
                          size={95}
                          showDetails={false}
                        />
                      </div>
                    </div>

                    {/* Passenger Direct Dispatch & Share Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSharePassengerTicket(currentSplitPassenger)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                          title="Copy formatted pass details for WhatsApp / SMS"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Send Pass to {currentSplitPassenger.name.split(" ")[0]}</span>
                        </button>

                        <button
                          onClick={() => {
                            if (navigator.clipboard) {
                              navigator.clipboard.writeText(
                                `https://bharatyatra.in/pass?pnr=${currentSplitPassenger.subPnr}&token=${currentSplitPassenger.gateToken}`
                              );
                              setCopiedToken(currentSplitPassenger.subPnr || "copied");
                              setTimeout(() => setCopiedToken(null), 2000);
                            }
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedToken === currentSplitPassenger.subPnr ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">Link Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Pass Link</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => alert(`Downloaded Individual Digital E-Ticket PDF for ${currentSplitPassenger.name} (${currentSplitPassenger.subPnr})!`)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Single Pass</span>
                      </button>
                    </div>
                  </div>

                  {/* Batch Action Bar */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="font-bold">Group Travelers Management:</span>
                      <span className="text-slate-500">{confirmedPassengers.length} Independent Digital Tickets Generated</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setActiveConfirmationTab("splitbill")}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Split Bill &amp; Collect (₹)</span>
                      </button>

                      <button
                        onClick={handleDispatchAllPasses}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>SMS / WhatsApp All Passes</span>
                      </button>

                      <button
                        onClick={() => alert(`Downloaded All ${confirmedPassengers.length} Individual E-Tickets in a Single PDF Bundle!`)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Passes Bundle</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeConfirmationTab === "splitbill" ? (
                /* Split Bill & Payment Links View */
                <div className="space-y-4">
                  <SplitBillSection
                    totalAmount={confirmedBooking.amount || finalTotalInr}
                    title={confirmedBooking.title}
                    subtitle={confirmedBooking.subtitle}
                    serviceCategory={serviceCategory}
                    pnr={confirmedBooking.pnr}
                    userProfile={userProfile}
                    passengersList={confirmedPassengers.map((p) => ({
                      id: p.id,
                      name: p.name,
                      phone: p.phone,
                      email: p.email,
                      seatNumber: p.seatNumber,
                    }))}
                    initialConfig={confirmedBooking.splitBillConfig || customSplitConfig || undefined}
                    onConfigChange={(updated) => {
                      setCustomSplitConfig(updated);
                      if (confirmedBooking) {
                        setConfirmedBooking({
                          ...confirmedBooking,
                          splitBillConfig: updated,
                        });
                      }
                    }}
                    isConfirmed={true}
                  />
                </div>
              ) : (
                /* Master Consolidated Group Invoice View */
                <div className="rounded-2xl border-2 border-slate-900 bg-white p-5 space-y-4 shadow-sm relative overflow-hidden">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">BharatYatra Verified Group Reservation</span>
                      <h5 className="text-base font-extrabold text-slate-900 mt-0.5">{confirmedBooking.title}</h5>
                      <p className="text-xs text-slate-500">{confirmedBooking.subtitle}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-slate-400">MASTER PNR</span>
                      <div className="text-sm font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">
                        {confirmedBooking.pnr}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 text-xs border-b border-slate-100 items-center">
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Group Leader</span>
                      <span className="font-bold text-slate-800">{passengersList[0]?.name || userProfile.name}</span>
                      <span className="text-[10px] text-slate-500 block">{confirmedPassengers.length} Total Travelers</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Date & Time</span>
                      <span className="font-bold text-slate-800">{confirmedBooking.date} • {confirmedBooking.time}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Seat Allocations</span>
                      <span className="font-bold text-slate-800 line-clamp-1">{confirmedBooking.seatInfo}</span>
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
                            Active Group Travel Insurance Policy ({confirmedPassengers.length} Travelers Covered)
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                          {confirmedBooking.insurancePolicyNumber || "POL-BY-INS-839201"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                        <div>
                          <span className="text-slate-400 text-[10px] block">Sum Insured:</span>
                          <strong className="text-emerald-900">₹5,00,000 / Passenger Medical + Cancellation</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Underwritten By:</span>
                          <strong className="text-slate-900">Go Digit Gen. Insurance</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 text-[10px] block">Total Premium Paid:</span>
                          <strong className="text-emerald-700">₹{confirmedBooking.insurancePremium} (Included)</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Itemized Tax Invoice Breakdown */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                      <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                        Master Tax Invoice Summary ({confirmedBooking.invoiceNumber || "INV-2026-9021"})
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">GSTIN: 07AAACB1234F1Z5</span>
                    </div>

                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div className="flex justify-between">
                        <span>Base Trip Tariff ({confirmedPassengers.length} Travelers × ₹{basePricePerPerson.toLocaleString("en-IN")}):</span>
                        <span className="font-mono text-slate-900">₹{totalBasePrice.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="flex items-center gap-1">
                          Group Travel Insurance:
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
                      {confirmedBooking.paymentSummary?.paymentMode && (
                        <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1 border-t border-dashed border-slate-200">
                          <span>Payment Settlement:</span>
                          <span className="font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {confirmedBooking.paymentSummary.paymentMode}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setActiveConfirmationTab("split")}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        <span>Individual Passes</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setActiveConfirmationTab("splitbill")}
                        className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Split Bill &amp; Links</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => alert(`Downloaded Official Tax Invoice PDF (${confirmedBooking.invoiceNumber || "INV-2026-9021"}) with itemized Insurance & GST details!`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold hover:bg-slate-200 border border-slate-300 shadow-2xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Master Invoice PDF</span>
                      </button>
                      <button
                        onClick={() => alert(`Downloaded Master E-Ticket Confirmation PDF (${confirmedBooking.id})!`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black shadow-xs cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Master E-Ticket</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Checkout Form View with Group Passenger Setup */
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
                      <span className="text-lg font-black text-slate-900">₹{basePricePerPerson.toLocaleString("en-IN")}</span>
                      <span className="text-[11px] text-slate-500 ml-1">/ passenger</span>
                      {selectedCurrency !== "INR" && (
                        <span className="text-xs text-indigo-600 font-bold block">
                          ≈ {convertFromInr(basePricePerPerson, selectedCurrency).formatted} / person
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 block">+ GST & Fees</span>
                  </div>
                </div>
              </div>

              {/* Currency Converter Bar */}
              <div className="p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
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

              {/* Central Calendar & Timings Section */}
              <div className="p-4 rounded-2xl border border-indigo-200 bg-linear-to-b from-indigo-50/40 to-white space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                        Travel Schedule &amp; Timings
                      </h5>
                      <p className="text-[11px] text-slate-500">
                        Powered by Universal Calendar &amp; Timings Engine
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    Live Availability Active
                  </span>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* Date Card */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-600">
                        {calendarServiceType === "hotels" ? "Check-in Date" : "Departure Date"}
                      </span>
                      {currentDateAvailability?.holidayName && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                          ★ {currentDateAvailability.holidayName}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          {new Date(bookingDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {currentDateAvailability && (
                          <span className="text-[10px] font-bold text-emerald-600 block">
                            ₹{currentDateAvailability.minPrice.toLocaleString("en-IN")} •{" "}
                            {currentDateAvailability.status === "available" ? "Available" : "Limited Seats"}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCalendarExpanded(!isCalendarExpanded);
                          setIsTimeSlotsExpanded(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {isCalendarExpanded ? "Close" : "Change Date"}
                      </button>
                    </div>
                  </div>

                  {/* Time Card */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition-all">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-semibold uppercase tracking-wider text-[10px] text-indigo-600">
                        {calendarServiceType === "hotels"
                          ? "Check-in / Check-out Time"
                          : calendarServiceType === "cabs"
                          ? "Pickup Window"
                          : "Departure Slot"}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        120m cutoff SLA
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          {selectedTimeSlot
                            ? `${selectedTimeSlot.startTime} - ${selectedTimeSlot.endTime}`
                            : customBookingTime || "10:00 AM"}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {selectedTimeSlot?.timeOfDay
                            ? `${selectedTimeSlot.timeOfDay.toUpperCase()} • ${selectedTimeSlot.availableCapacity} seats open`
                            : "Standard Scheduled Departure"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsTimeSlotsExpanded(!isTimeSlotsExpanded);
                          setIsCalendarExpanded(false);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {isTimeSlotsExpanded ? "Close" : "Choose Slot"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inline Common Calendar View */}
                {isCalendarExpanded && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm">
                      <CommonCalendar
                        serviceType={calendarServiceType}
                        mode={calendarServiceType === "hotels" ? "range" : "single"}
                        startDate={bookingDate}
                        endDate={bookingEndDate}
                        onSelectSingleDate={(date) => {
                          setBookingDate(date);
                          setIsCalendarExpanded(false);
                        }}
                        onSelectRange={(start, end) => {
                          setBookingDate(start);
                          if (end) setBookingEndDate(end);
                          if (end) setIsCalendarExpanded(false);
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Inline Time Slot Selector View */}
                {isTimeSlotsExpanded && (
                  <div className="pt-2 animate-in fade-in duration-200">
                    <div className="p-3 bg-white rounded-xl border border-indigo-100 shadow-sm">
                      <TimeSlotSelector
                        serviceType={calendarServiceType}
                        selectedDate={bookingDate}
                        selectedSlotId={selectedTimeSlot?.id}
                        onSelectSlot={(slot) => {
                          setSelectedTimeSlot(slot);
                          setIsTimeSlotsExpanded(false);
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Group Passenger Manager & Traveler Profiles */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-600" />
                    Travelers ({passengersList.length} Selected)
                  </h5>

                  <button
                    type="button"
                    onClick={handleAddPassenger}
                    disabled={passengersList.length >= 6}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Add Passenger</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {passengersList.map((passenger, index) => (
                    <div
                      key={passenger.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3 text-xs relative"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                            {index + 1}
                          </div>
                          <span className="font-bold text-slate-900">
                            {index === 0 ? "Primary Traveler (Lead Passenger)" : `Co-Traveler ${index + 1}`}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                            {passenger.seatPreference || getSeatAllocationForService(serviceCategory, index)}
                          </span>

                          {passengersList.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemovePassenger(passenger.id)}
                              className="p-1 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Remove passenger"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-slate-500 block mb-1 font-medium text-[11px]">Full Name (as per Govt ID)</label>
                          <input
                            type="text"
                            value={passenger.name}
                            onChange={(e) => handleUpdatePassenger(passenger.id, "name", e.target.value)}
                            placeholder="e.g. Rajesh Sharma"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-slate-500 block mb-1 font-medium text-[11px]">Age &amp; Gender</label>
                          <div className="flex gap-1.5">
                            <input
                              type="number"
                              min={1}
                              max={120}
                              value={passenger.age}
                              onChange={(e) => handleUpdatePassenger(passenger.id, "age", parseInt(e.target.value) || 18)}
                              className="w-14 px-2 py-1.5 rounded-lg border border-slate-200 bg-white text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            />
                            <select
                              value={passenger.gender}
                              onChange={(e) => handleUpdatePassenger(passenger.id, "gender", e.target.value as any)}
                              className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            >
                              <option value="Male">M</option>
                              <option value="Female">F</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-slate-500 block mb-1 font-medium text-[11px]">Mobile for Pass SMS</label>
                          <input
                            type="text"
                            value={passenger.phone}
                            onChange={(e) => handleUpdatePassenger(passenger.id, "phone", e.target.value)}
                            placeholder="+91 98765..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-[11px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Travel Insurance Addon */}
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
                          Add Group Travel Insurance ({passengersList.length} Travelers)
                        </label>
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          Digit Partnered • IRDAI Approved
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">
                        Comprehensive trip protection at <strong>{insuranceRatePercent}% of trip value</strong> (₹{singleInsurancePremium} per traveler):
                      </p>
                      
                      {/* Benefits Matrix */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2.5 text-[11px] text-slate-700">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>₹5,00,000</strong> Emergency Medical per Passenger</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>100% Refund</strong> on Group Cancellation / Delay</span>
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
                      +₹{totalInsuranceCost.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {selectedCurrency !== "INR" ? `(${convertFromInr(totalInsuranceCost, selectedCurrency).formatted})` : `For ${passengersList.length} Travelers`}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 inline-block ${
                      includeInsurance ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {includeInsurance ? "Covered" : "Optional"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* QUICK PAY HERO CARD & 1-CLICK INSTANT CHECKOUT (PRIMARY ACTION) */}
              {/* ========================================================================= */}
              <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-br from-amber-50 via-orange-50/50 to-indigo-50/70 border-2 border-amber-400 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-xs">
                      <Zap className="w-4 h-4 fill-slate-950" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                          Quick Pay™
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200 text-amber-950">
                          1-Click Fast Pass
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        Saved preference ready for instant one-tap checkout
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsQuickPayManagerOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl bg-white/90 hover:bg-white text-slate-800 border border-slate-300 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:border-amber-400 transition-all cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-600" />
                    <span>Change Instrument</span>
                  </button>
                </div>

                {/* Active Preferred Instrument Details */}
                <div className="p-3 rounded-xl bg-white/95 border border-amber-300/80 shadow-2xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      {preferredQuickPay.type === "upi" ? (
                        <Smartphone className="w-4 h-4 text-indigo-600" />
                      ) : preferredQuickPay.type === "wallet" ? (
                        <Wallet className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <CreditCard className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900">
                          {preferredQuickPay.title}
                        </span>
                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                          Preferred
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 block">
                        {preferredQuickPay.detail}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Auth Mode
                    </span>
                    <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 justify-end">
                      <Lock className="w-3 h-3 text-indigo-600" />
                      Zero-Wait
                    </span>
                  </div>
                </div>

                {/* 1-Click Quick Pay Button */}
                <button
                  type="button"
                  id="booking-quick-pay-btn"
                  onClick={handleQuickPay}
                  disabled={isQuickPaying || isProcessing}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer border border-amber-300/60"
                >
                  <Zap className="w-4 h-4 fill-slate-950 animate-bounce" />
                  <span>
                    {isQuickPaying
                      ? "Authorizing 1-Click Payment via " + preferredQuickPay.title + "..."
                      : `⚡ Quick Pay ₹${finalTotalInr.toLocaleString("en-IN")} (1-Click Instant)`}
                  </span>
                  {!isQuickPaying && (
                    <ArrowRight className="w-4 h-4 text-slate-950 font-bold" />
                  )}
                </button>

                <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Instant Booking Confirmation • RBI Tokenized</span>
                  </div>
                  <span>100% Secure &amp; Protected</span>
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
                    className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black cursor-pointer"
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

              {/* Standard Alternative Payment Method Selector */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Or Select Alternative Payment Method
                  </label>
                  <span className="text-[11px] text-slate-400">All payment options</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: "wallet", label: "Yatra Cash", sub: `₹${userProfile.walletBalance}`, icon: <Wallet className="w-4 h-4 text-emerald-600" /> },
                    { id: "upi", label: "Instant UPI", sub: "GPay/PhonePe", icon: <Smartphone className="w-4 h-4 text-indigo-600" /> },
                    { id: "card", label: "Credit/Debit", sub: "All Banks", icon: <CreditCard className="w-4 h-4 text-slate-600" /> },
                    { id: "emi", label: "No Cost EMI", sub: "3/6 Months", icon: <Sparkles className="w-4 h-4 text-amber-600" /> },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        paymentMethod === pm.id
                          ? "border-indigo-600 bg-indigo-50/50 shadow-2xs ring-1 ring-indigo-500/20"
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

                {/* Remember as Quick Pay Checkbox */}
                <div className="flex items-center gap-2 pt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
                  <input
                    type="checkbox"
                    id="save-as-quickpay-checkbox"
                    checked={rememberAsQuickPay}
                    onChange={(e) => setRememberAsQuickPay(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 accent-amber-600 cursor-pointer"
                  />
                  <label htmlFor="save-as-quickpay-checkbox" className="text-slate-700 font-semibold cursor-pointer select-none">
                    Save this method as my <strong>Quick Pay</strong> preference for 1-click checkout on future bookings
                  </label>
                </div>
              </div>

              {/* Split Bill & Share Cost Quick Access Card */}
              <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-blue-50/70 border-2 border-indigo-200/80 rounded-2xl p-3.5 sm:p-4 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-2xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-slate-900">
                          Split Bill with Co-Travelers
                        </span>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800">
                          UPI Links
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block font-medium">
                        ₹{Math.round(finalTotalInr / Math.max(1, passengersList.length)).toLocaleString("en-IN")} / traveler ({passengersList.length} {passengersList.length === 1 ? "person" : "persons"})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowPreBookingSplitBill(!showPreBookingSplitBill)}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>{showPreBookingSplitBill ? "Hide Shares" : "Split & Shares"}</span>
                    </button>
                  </div>
                </div>

                {/* Quick Share Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-indigo-100 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        const cfg =
                          customSplitConfig ||
                          SplitBillService.createDefaultSplitConfig({
                            totalAmount: finalTotalInr,
                            title: item.title || item.name || "Travel Reservation",
                            serviceCategory,
                            userProfile,
                            passengers: passengersList,
                          });
                        const msg = SplitBillService.formatGroupWhatsAppMessage(cfg);
                        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>WhatsApp Bill</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const cfg =
                          customSplitConfig ||
                          SplitBillService.createDefaultSplitConfig({
                            totalAmount: finalTotalInr,
                            title: item.title || item.name || "Travel Reservation",
                            serviceCategory,
                            userProfile,
                            passengers: passengersList,
                          });
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(cfg.masterPaymentLink);
                          alert("Group Master Split Payment Link copied to clipboard!");
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Group Link</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsSplitBillModalOpen(true)}
                    className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Open Split Manager</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Expanded Pre-Booking Inline Split View */}
                {showPreBookingSplitBill && (
                  <div className="pt-2">
                    <SplitBillSection
                      totalAmount={finalTotalInr}
                      title={item.title || item.name || "Travel Reservation"}
                      subtitle={item.subtitle || `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`}
                      serviceCategory={serviceCategory}
                      userProfile={userProfile}
                      passengersList={passengersList}
                      initialConfig={customSplitConfig || undefined}
                      onConfigChange={(updated) => setCustomSplitConfig(updated)}
                      isConfirmed={false}
                    />
                  </div>
                )}
              </div>

              {/* Price Breakdown Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Base Tariff ({passengersList.length} Travelers × ₹{basePricePerPerson.toLocaleString("en-IN")})</span>
                  <div className="text-right">
                    <span>₹{totalBasePrice.toLocaleString("en-IN")}</span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-[11px] text-slate-400 ml-1.5">({convertFromInr(totalBasePrice, selectedCurrency).formatted})</span>
                    )}
                  </div>
                </div>
                {includeInsurance && (
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Travel Insurance ({passengersList.length} Travelers - Digit)</span>
                    </span>
                    <div className="text-right">
                      <span className="font-semibold text-emerald-700 font-mono">+₹{totalInsuranceCost.toLocaleString("en-IN")}</span>
                      {selectedCurrency !== "INR" && (
                        <span className="text-[11px] text-slate-400 ml-1.5">({convertFromInr(totalInsuranceCost, selectedCurrency).formatted})</span>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Authorized Platform Convenience Fee</span>
                  <div className="text-right">
                    <span>₹{convenienceFee}</span>
                    {selectedCurrency !== "INR" && (
                      <span className="text-[11px] text-slate-400 ml-1.5">({convertFromInr(convenienceFee, selectedCurrency).formatted})</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Taxes &amp; Surcharges (GST 5%)</span>
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
                    <span className="text-[11px] text-slate-500 font-medium">
                      Split rate: ₹{Math.round(finalTotalInr / passengersList.length).toLocaleString("en-IN")} per passenger
                    </span>
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

              {/* Standard Action Button */}
              <button
                type="button"
                onClick={handlePayAndConfirm}
                disabled={isProcessing || isQuickPaying}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-[#0c2340] hover:brightness-110 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <span>
                  {isProcessing
                    ? "Connecting to Banking Gateway..."
                    : paymentMethod === "wallet"
                    ? `Pay ₹${finalTotalInr.toLocaleString("en-IN")} via Yatra Wallet`
                    : `Checkout with Razorpay (₹${finalTotalInr.toLocaleString("en-IN")})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 mt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Powered by Razorpay &amp; QuickPay • 256-Bit Encrypted • RBI Tokenized</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* QUICK PAY PREFERENCE MANAGER MODAL */}
      <QuickPayManagerModal
        isOpen={isQuickPayManagerOpen}
        onClose={() => setIsQuickPayManagerOpen(false)}
        onSelectAndClose={(method) => {
          setPreferredQuickPay(method);
          setIsQuickPayManagerOpen(false);
        }}
      />

      {/* RAZORPAY CHECKOUT MODAL OVERLAY */}
      <RazorpayCheckoutModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        amount={finalTotalInr}
        title={item.title || item.name || item.trainName || item.operator || "Travel Booking"}
        subtitle={item.subtitle || item.destination || item.city || `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`}
        serviceCategory={serviceCategory}
        bookingPassengers={passengersList}
        customerDetails={{
          name: passengersList[0]?.name || userProfile.name,
          email: passengersList[0]?.email || userProfile.email,
          phone: passengersList[0]?.phone || userProfile.phone,
        }}
        preferredCurrency={selectedCurrency}
        onSuccess={handleRazorpaySuccess}
        onFailure={(err) => {
          setIsRazorpayModalOpen(false);
          alert(`Payment Error: ${err.description}`);
        }}
      />

      {/* SPLIT BILL OVERLAY MODAL */}
      <SplitBillModal
        isOpen={isSplitBillModalOpen}
        onClose={() => setIsSplitBillModalOpen(false)}
        totalAmount={confirmedBooking ? confirmedBooking.amount : finalTotalInr}
        title={confirmedBooking ? confirmedBooking.title : (item.title || item.name || "Travel Reservation")}
        subtitle={confirmedBooking ? confirmedBooking.subtitle : (item.subtitle || `${item.fromCity || "Origin"} ➔ ${item.toCity || "Destination"}`)}
        serviceCategory={serviceCategory}
        pnr={confirmedBooking?.pnr}
        userProfile={userProfile}
        passengersList={
          confirmedPassengers.length > 0
            ? confirmedPassengers.map((p) => ({
                id: p.id,
                name: p.name,
                phone: p.phone,
                email: p.email,
                seatNumber: p.seatNumber,
              }))
            : passengersList
        }
        initialConfig={confirmedBooking?.splitBillConfig || customSplitConfig || undefined}
        onSaveConfig={(updated) => {
          setCustomSplitConfig(updated);
          if (confirmedBooking) {
            setConfirmedBooking({
              ...confirmedBooking,
              splitBillConfig: updated,
            });
          }
        }}
        isConfirmed={!!confirmedBooking}
      />
    </div>
  );
}

