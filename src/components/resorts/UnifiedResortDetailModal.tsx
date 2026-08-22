import React, { useState, useMemo } from "react";
import {
  X,
  Palmtree,
  Star,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Mail,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  Tv,
  Wifi,
  Waves,
  Coffee,
  Heart,
  Eye,
  Camera,
  Compass,
  Utensils,
  Sun,
  Flame,
  Award,
  CreditCard,
  QrCode,
  Download,
  Printer,
  FileText,
  Clock,
  HelpCircle,
  Building,
  Navigation,
  Info,
  Car,
  Plane,
  Train,
  Check,
  AlertCircle,
  Percent,
  Coins,
  Share2,
} from "lucide-react";
import {
  UnifiedResortItem,
  HotelRoomSpecification,
  HotelMealPlan,
  ResortPackageOption,
  ResortActivityItem,
  BookingItem,
  HotelBookingGuestProfile,
} from "../../types";

interface UnifiedResortDetailModalProps {
  resort: UnifiedResortItem;
  isOpen: boolean;
  onClose: () => void;
  onBookingComplete?: (booking: BookingItem) => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialRooms?: number;
}

type ModalTab =
  | "overview"
  | "accommodations"
  | "packages"
  | "activities"
  | "dining"
  | "amenities"
  | "location"
  | "policies"
  | "reviews"
  | "contact";

type BookingStep =
  | "search"
  | "accommodation"
  | "package_addons"
  | "guest_profile"
  | "summary"
  | "payment"
  | "confirmation";

export function UnifiedResortDetailModal({
  resort,
  isOpen,
  onClose,
  onBookingComplete,
  initialCheckIn = "2026-09-15",
  initialCheckOut = "2026-09-18",
  initialGuests = 2,
  initialRooms = 1,
}: UnifiedResortDetailModalProps) {
  if (!isOpen || !resort) return null;

  // Navigation & View Mode State
  const [activeTab, setActiveTab] = useState<ModalTab>("overview");
  const [isBookingFlowActive, setIsBookingFlowActive] = useState(false);
  const [bookingStep, setBookingStep] = useState<BookingStep>("accommodation");

  // Gallery & Media State
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [is360TourActive, setIs360TourActive] = useState(false);

  // Search & Stay Configuration
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [adultsCount, setAdultsCount] = useState(initialGuests);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(initialRooms);

  // Selection States
  const [selectedRoom, setSelectedRoom] = useState<HotelRoomSpecification>(
    resort.roomTypes[0] || null
  );
  const [selectedRatePlan, setSelectedRatePlan] = useState<HotelMealPlan>(
    resort.roomTypes[0]?.ratePlans[0] || null
  );
  const [selectedPackage, setSelectedPackage] = useState<ResortPackageOption | null>(null);
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [isAirportTransferSelected, setIsAirportTransferSelected] = useState(false);
  const [isExtraBedSelected, setIsExtraBedSelected] = useState(false);

  // Coupon & Loyalty
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("");
  const [couponInput, setCouponInput] = useState<string>("");
  const [couponError, setCouponError] = useState<string>("");
  const [useYatraCoins, setUseYatraCoins] = useState(false);
  const availableYatraCoins = 1800; // ₹1,800 discount value

  // Lead Guest Profile
  const [guestProfile, setGuestProfile] = useState<HotelBookingGuestProfile>({
    title: "Mr",
    firstName: "Nasir",
    lastName: "Khan",
    mobile: "9876543210",
    email: "nasir.travel@example.com",
    nationality: "Indian",
    idDocumentType: "Aadhaar Card",
    idDocumentNumber: "XXXX-XXXX-8921",
    specialRequests: ["Honeymoon bed decoration", "Ground floor near pool"],
    customRequestNote: "Please arrange quiet room with direct sunset lake view.",
    emergencyContact: {
      name: "Aisha Khan",
      phone: "9876500000",
      relationship: "Spouse",
    },
    isGstInvoiceRequested: true,
    gstDetails: {
      companyName: "Bharat Global Enterprises LLP",
      gstin: "29ABCDE1234F1Z5",
      companyAddress: "MG Road, Bengaluru, Karnataka",
    },
  });

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "WALLET" | "PAY_AT_RESORT">("UPI");
  const [upiIdInput, setUpiIdInput] = useState("nasir@oksbi");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedBooking, setCompletedBooking] = useState<BookingItem | null>(null);

  // Nights Calculation
  const nightsCount = useMemo(() => {
    try {
      const d1 = new Date(checkInDate);
      const d2 = new Date(checkOutDate);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 1;
    } catch {
      return 3;
    }
  }, [checkInDate, checkOutDate]);

  // Price Calculation Engine
  const priceBreakdown = useMemo(() => {
    const baseNightRate = selectedRatePlan
      ? selectedRatePlan.pricePerNight
      : selectedRoom
      ? selectedRoom.ratePlans[0]?.pricePerNight || resort.priceStart
      : resort.priceStart;

    const grossRoomTariff = baseNightRate * nightsCount * roomsCount;

    // Package charges
    const packageCharges = selectedPackage
      ? selectedPackage.priceDeltaPerNight * nightsCount * roomsCount
      : 0;

    // Activities charges
    const activityCharges = selectedActivityIds.reduce((sum, actId) => {
      const act = resort.resortActivities.find((a) => a.id === actId);
      return sum + (act ? act.pricePerPerson * (adultsCount + childrenCount) : 0);
    }, 0);

    // Extra bed & Transfer charges
    const transferCharges = isAirportTransferSelected ? 3500 : 0;
    const extraBedCharges = isExtraBedSelected ? 2800 * nightsCount : 0;

    const subtotal =
      grossRoomTariff + packageCharges + activityCharges + transferCharges + extraBedCharges;

    // Coupon discount
    let couponDiscount = 0;
    if (appliedCouponCode) {
      const foundCoupon = resort.availableOffers.find(
        (c) => c.code.toUpperCase() === appliedCouponCode.toUpperCase()
      );
      if (foundCoupon) {
        if (foundCoupon.discountType === "percentage") {
          couponDiscount = Math.min(
            (subtotal * foundCoupon.discountValue) / 100,
            foundCoupon.maxDiscount
          );
        } else {
          couponDiscount = foundCoupon.discountValue;
        }
      }
    }

    // YatraCoins discount
    const coinsDiscount = useYatraCoins ? Math.min(availableYatraCoins, subtotal * 0.1) : 0;

    const taxableAmount = Math.max(0, subtotal - couponDiscount - coinsDiscount);

    // GST SAC 996311 (12% for tariff < 7500/night, 18% for tariff >= 7500/night)
    const gstRate = baseNightRate >= 7500 ? 0.18 : 0.12;
    const gstAmount = Math.round(taxableAmount * gstRate);
    const convenienceFee = 0; // Transparent zero-fee booking

    const finalPayable = taxableAmount + gstAmount + convenienceFee;

    return {
      baseNightRate,
      nightsCount,
      roomsCount,
      grossRoomTariff,
      packageCharges,
      activityCharges,
      transferCharges,
      extraBedCharges,
      subtotal,
      couponDiscount,
      coinsDiscount,
      taxableAmount,
      gstRate: gstRate * 100,
      gstAmount,
      convenienceFee,
      finalPayable,
    };
  }, [
    selectedRoom,
    selectedRatePlan,
    selectedPackage,
    selectedActivityIds,
    isAirportTransferSelected,
    isExtraBedSelected,
    nightsCount,
    roomsCount,
    adultsCount,
    childrenCount,
    appliedCouponCode,
    useYatraCoins,
    resort,
  ]);

  // Handle Coupon Apply
  const handleApplyCoupon = (codeToApply?: string) => {
    const code = (codeToApply || couponInput).trim().toUpperCase();
    if (!code) return;

    const found = resort.availableOffers.find((c) => c.code.toUpperCase() === code);
    if (found) {
      if (priceBreakdown.subtotal < found.minBookingAmount) {
        setCouponError(`Min booking amount of ₹${found.minBookingAmount.toLocaleString("en-IN")} required.`);
        return;
      }
      setAppliedCouponCode(code);
      setCouponInput(code);
      setCouponError("");
    } else {
      setCouponError("Invalid promo coupon code.");
    }
  };

  // Toggle Activity Addon
  const toggleActivity = (actId: string) => {
    if (selectedActivityIds.includes(actId)) {
      setSelectedActivityIds(selectedActivityIds.filter((id) => id !== actId));
    } else {
      setSelectedActivityIds([...selectedActivityIds, actId]);
    }
  };

  // Handle Payment & Confirmation
  const handleCompleteBooking = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const bookingId = `BK-RES-${Date.now().toString().slice(-6)}`;
      const resortConfirmationNumber = `RES-${resort.city.slice(0, 3).toUpperCase()}-${Math.floor(
        100000 + Math.random() * 900000
      )}`;

      const newBookingRecord: BookingItem = {
        id: bookingId,
        serviceType: "resorts",
        provider: resort.name,
        title: `${resort.name} (${selectedRoom?.name || "Luxury Villa"})`,
        status: "confirmed",
        date: checkInDate,
        returnDate: checkOutDate,
        amount: priceBreakdown.finalPayable,
        fromLocation: "Customer Location",
        toLocation: resort.city,
        pnr: resortConfirmationNumber,
        passengersCount: adultsCount + childrenCount,
        seatOrRoomInfo: `${roomsCount} Room(s) • ${nightsCount} Night(s) • ${selectedRoom?.name || "Villa"}`,
        paymentSummary: {
          baseFare: priceBreakdown.grossRoomTariff,
          taxesAndGst: priceBreakdown.gstAmount,
          convenienceFee: priceBreakdown.convenienceFee,
          discountApplied: priceBreakdown.couponDiscount + priceBreakdown.coinsDiscount,
          totalAmount: priceBreakdown.finalPayable,
          paymentMode: paymentMethod,
          paymentStatus: paymentMethod === "PAY_AT_RESORT" ? "PAY_AT_HOTEL" : "PAID",
          transactionRef: `TXN-RES-${Date.now()}`,
          paidAt: new Date().toISOString(),
        },
        gstInvoice: {
          invoiceNumber: `INV-SAC996311-${Date.now().toString().slice(-6)}`,
          sacCode: "996311",
          legalEntity: "Resort Accommodation, Experiential Dining & Wellness Services",
          gstin: "32AABCR9912E1Z8",
          date: new Date().toISOString().split("T")[0],
          customerGst: guestProfile.isGstInvoiceRequested ? guestProfile.gstDetails?.gstin : undefined,
          customerCompanyName: guestProfile.isGstInvoiceRequested ? guestProfile.gstDetails?.companyName : undefined,
          taxableAmount: priceBreakdown.taxableAmount,
          cgst: Math.round(priceBreakdown.gstAmount / 2),
          sgst: Math.round(priceBreakdown.gstAmount / 2),
          igst: 0,
          totalInvoiceAmount: priceBreakdown.finalPayable,
        },
        cancellationDetails: {
          isEligible: true,
          cancellationPolicyRule: resort.policies.cancellationPolicy,
          cancellationFee: 0,
          refundableAmount: priceBreakdown.finalPayable,
          refundStatus: "INSTANT_WALLET_CREDITED",
        },
      };

      setCompletedBooking(newBookingRecord);
      setIsProcessingPayment(false);
      setBookingStep("confirmation");
      if (onBookingComplete) {
        onBookingComplete(newBookingRecord);
      }
    }, 1200);
  };

  return (
    <div
      id="resort-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="resort-detail-modal-container"
        className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-6xl max-h-[94vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* =========================================================================
            MODAL HEADER: Resort Title, Star Rating, Style Badge, Close Action
            ========================================================================= */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-teal-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Palmtree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {resort.name}
                </h2>
                <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{resort.starCategory}-Star Luxury</span>
                </div>
                {resort.badge && (
                  <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-black uppercase">
                    {resort.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-teal-400" />
                <span>{resort.landmark || `${resort.city}, ${resort.state}`}</span>
                <span className="text-teal-400 font-semibold">• {resort.resortStyle}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isBookingFlowActive ? (
              <button
                id="btn-start-booking-flow"
                onClick={() => {
                  setIsBookingFlowActive(true);
                  setBookingStep("accommodation");
                }}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs shadow-lg transition-all"
              >
                <span>Book Resort Stay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="btn-back-to-profile"
                onClick={() => setIsBookingFlowActive(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
              >
                View Full Profile
              </button>
            )}
            <button
              id="btn-close-resort-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* =========================================================================
            CONTENT BODY: Swappable between "Resort Profile" and "7-Step Booking Flow"
            ========================================================================= */}
        <div className="flex-1 overflow-y-auto">
          {!isBookingFlowActive ? (
            /* =====================================================================
               VIEW 1: COMPLETE RESORT PROFILE (All Modules)
               ===================================================================== */
            <div className="space-y-6 p-6">
              {/* Media Gallery / Video / 360 Tour Showcase */}
              <div className="relative rounded-3xl overflow-hidden border border-teal-500/20 bg-slate-950 shadow-2xl">
                <div className="relative h-72 sm:h-96 w-full">
                  <img
                    src={resort.galleryImages[activeImageIndex] || resort.featuredImage}
                    alt={resort.name}
                    className="w-full h-full object-cover transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Top Media Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-teal-300 border border-teal-500/40 text-xs font-black">
                      {resort.resortStyle}
                    </span>
                    {resort.privatePoolAvailable && (
                      <span className="px-3 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                        <Waves className="w-3 h-3" /> Private Pool Villas Available
                      </span>
                    )}
                  </div>

                  {/* 360 & Video Quick Buttons */}
                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    {resort.propertyVideoUrl && (
                      <button
                        id="btn-play-resort-video"
                        onClick={() => setIsVideoModalOpen(!isVideoModalOpen)}
                        className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Video Tour</span>
                      </button>
                    )}
                    <button
                      id="btn-resort-360-tour"
                      onClick={() => setIs360TourActive(!is360TourActive)}
                      className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-bold flex items-center gap-1.5 border transition-all ${
                        is360TourActive
                          ? "bg-teal-500 text-slate-950 border-teal-400"
                          : "bg-slate-950/80 hover:bg-slate-900 text-teal-300 border-teal-500/40"
                      }`}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{is360TourActive ? "Exit 360°" : "360° Virtual Tour"}</span>
                    </button>
                  </div>

                  {/* Bottom Image Carousel Strip */}
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-[80%] scrollbar-none">
                      {resort.galleryImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`w-16 h-12 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                            activeImageIndex === idx
                              ? "border-teal-400 scale-105 shadow-md"
                              : "border-slate-700 opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-slate-950/90 backdrop-blur-md text-slate-200 text-xs font-bold border border-slate-700">
                      {activeImageIndex + 1} / {resort.galleryImages.length}
                    </div>
                  </div>
                </div>

                {/* 360 Virtual Tour Simulation Panel */}
                {is360TourActive && (
                  <div className="p-4 bg-teal-950/80 border-t border-teal-500/30 flex items-center justify-between text-xs text-teal-200">
                    <div className="flex items-center gap-2">
                      <Compass className="w-5 h-5 text-teal-400 animate-spin" />
                      <span>
                        <strong>360° Virtual Panoramic View Active:</strong> Drag with cursor or touch to pan through the private villa, lagoon pool, and tropical foliage.
                      </span>
                    </div>
                    <button
                      onClick={() => setIs360TourActive(false)}
                      className="px-2.5 py-1 rounded-lg bg-teal-500 text-slate-950 font-bold text-xs"
                    >
                      Close 360°
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
                {[
                  { id: "overview", label: "Overview" },
                  { id: "accommodations", label: "Villas & Rooms" },
                  { id: "packages", label: "Curated Packages" },
                  { id: "activities", label: "Activities & Spa" },
                  { id: "dining", label: "Dining & Gazebos" },
                  { id: "amenities", label: "Amenities" },
                  { id: "location", label: "Location & Transit" },
                  { id: "policies", label: "Policies" },
                  { id: "reviews", label: `Reviews (${resort.reviewCount})` },
                  { id: "contact", label: "Direct Concierge" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as ModalTab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      activeTab === t.id
                        ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                      <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block">
                        Style & Category
                      </span>
                      <p className="text-sm font-extrabold text-white">{resort.resortStyle}</p>
                      <p className="text-[11px] text-slate-400">5-Star Experiential</p>
                    </div>
                    <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                      <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block">
                        Starting Tariff
                      </span>
                      <p className="text-sm font-extrabold text-white">
                        ₹{resort.priceStart.toLocaleString("en-IN")}{" "}
                        <span className="text-xs text-slate-400 font-normal">/ night</span>
                      </p>
                      <p className="text-[11px] text-emerald-400 font-bold">100% Free Cancellation</p>
                    </div>
                    <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                      <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block">
                        Ayurveda & Spa
                      </span>
                      <p className="text-sm font-extrabold text-white">{resort.wellnessSpaRating || 4.9} / 5.0</p>
                      <p className="text-[11px] text-slate-400">Certified Practitioners</p>
                    </div>
                    <div className="bg-slate-800/60 p-3.5 rounded-2xl border border-slate-700/60 space-y-1">
                      <span className="text-[11px] text-teal-400 font-bold uppercase tracking-wider block">
                        Direct Assistance
                      </span>
                      <p className="text-sm font-extrabold text-white">24x7 Royal Butler</p>
                      <p className="text-[11px] text-teal-300 font-mono">{resort.conciergeContact.phone}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50 space-y-2">
                    <h3 className="text-sm font-extrabold text-teal-300 uppercase tracking-wider">
                      About the Resort
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">{resort.description}</p>
                  </div>

                  {/* Curated Highlights Bento */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-teal-950/60 to-slate-900 p-4 rounded-2xl border border-teal-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                        <Waves className="w-4 h-4" />
                        <span>Private Plunge Pools & Lagoons</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Step right from your verandah into our 250-meter serpentine winding lagoon pool or relax in heated cliffside jacuzzis.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-950/60 to-slate-900 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                        <Sparkles className="w-4 h-4" />
                        <span>Ayurvedic Healing & Spa</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Panchakarma detox, Shirodhara, and customized herbal oil therapies guided by resident senior Ayurvedic doctors.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-950/60 to-slate-900 p-4 rounded-2xl border border-emerald-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                        <Utensils className="w-4 h-4" />
                        <span>Experiential & Gazebo Dining</span>
                      </div>
                      <p className="text-[11px] text-slate-300">
                        Private starlit beach dinners, in-pool floating breakfast trays, fresh seafood barbecue, and organic farm-to-table cuisine.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ACCOMMODATIONS (Villas, Suites, Cottages) */}
              {activeTab === "accommodations" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      Rooms, Suites &amp; Private Pool Villas ({resort.roomTypes.length})
                    </h3>
                    <span className="text-xs text-teal-300">Live Inventory Tracker</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {resort.roomTypes.map((room) => (
                      <div
                        key={room.id}
                        className="bg-slate-800/50 rounded-2xl border border-slate-700/70 p-4 space-y-3 flex flex-col justify-between hover:border-teal-400 transition-all group"
                      >
                        <div className="space-y-2">
                          <div className="relative h-44 rounded-xl overflow-hidden">
                            <img
                              src={room.photos[0] || resort.featuredImage}
                              alt={room.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-teal-300 text-[10px] font-bold">
                              {room.category}
                            </div>
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-200 text-[10px] font-mono">
                              {room.roomSizeSqFt} sq. ft.
                            </div>
                          </div>

                          <div>
                            <h4 className="text-sm font-extrabold text-white">{room.name}</h4>
                            <p className="text-[11px] text-teal-400 font-semibold">{room.roomView}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {room.bedType} • Max {room.maxAdults} Adults, {room.maxChildren} Children
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {room.facilities.slice(0, 4).map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-medium"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Starting from</span>
                            <span className="text-sm font-black text-white">
                              ₹{room.ratePlans[0]?.pricePerNight.toLocaleString("en-IN")}
                              <span className="text-[10px] font-normal text-slate-400"> / night</span>
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedRoom(room);
                              setSelectedRatePlan(room.ratePlans[0]);
                              setIsBookingFlowActive(true);
                              setBookingStep("package_addons");
                            }}
                            className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-md transition-colors"
                          >
                            Select Villa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: PACKAGES */}
              {activeTab === "packages" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    Curated Experience Packages &amp; Stay Upgrades ({resort.curatedPackages.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resort.curatedPackages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700 flex flex-col justify-between space-y-3 hover:border-teal-400 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 text-[10px] font-black uppercase">
                              {pkg.category}
                            </span>
                            {pkg.badge && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                                {pkg.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-extrabold text-white">{pkg.name}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{pkg.description}</p>

                          <div className="space-y-1.5 pt-2">
                            <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                              What's Included:
                            </span>
                            {pkg.inclusions.map((inc, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-300">
                                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                                <span>{inc}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-700 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-slate-400 block">Package Addon</span>
                            <span className="text-xs font-black text-white">
                              +₹{pkg.priceDeltaPerNight.toLocaleString("en-IN")}{" "}
                              <span className="text-[10px] font-normal text-slate-400">/ night</span>
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setIsBookingFlowActive(true);
                              setBookingStep("guest_profile");
                            }}
                            className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
                          >
                            Book Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: ACTIVITIES & SPA */}
              {activeTab === "activities" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    Resort Activities, Safari &amp; Wellness Experiences ({resort.resortActivities.length})
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {resort.resortActivities.map((act) => (
                      <div
                        key={act.id}
                        className="bg-slate-800/50 rounded-2xl border border-slate-700/80 p-4 space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-2">
                          <div className="relative h-32 rounded-xl overflow-hidden">
                            <img
                              src={act.image || resort.featuredImage}
                              alt={act.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 text-teal-300 text-[10px] font-bold">
                              {act.category}
                            </div>
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-950/90 text-slate-300 text-[10px]">
                              {act.duration}
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-white">{act.title}</h4>
                          <p className="text-[11px] text-slate-400 line-clamp-2">{act.description}</p>

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Clock className="w-3 h-3 text-teal-400" />
                            <span>Slots: {act.slotsAvailable.join(", ")}</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-700 flex items-center justify-between">
                          <span className="text-xs font-black text-white">
                            {act.isComplimentary ? (
                              <span className="text-emerald-400 font-bold">Free (Included)</span>
                            ) : (
                              `₹${act.pricePerPerson.toLocaleString("en-IN")} / person`
                            )}
                          </span>
                          <button
                            onClick={() => toggleActivity(act.id)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              selectedActivityIds.includes(act.id)
                                ? "bg-emerald-500 text-slate-950"
                                : "bg-slate-700 hover:bg-slate-600 text-slate-200"
                            }`}
                          >
                            {selectedActivityIds.includes(act.id) ? "✓ Added" : "+ Add to Stay"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: DINING & GAZEBOS */}
              {activeTab === "dining" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">
                    Signature Restaurants, Gazebos &amp; Floating Breakfasts ({resort.diningVenues.length})
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resort.diningVenues.map((dine) => (
                      <div
                        key={dine.id}
                        className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4 space-y-3"
                      >
                        <div className="h-36 rounded-xl overflow-hidden">
                          <img
                            src={dine.photos[0] || resort.featuredImage}
                            alt={dine.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                            {dine.type}
                          </span>
                          <h4 className="text-xs font-bold text-white pt-1">{dine.name}</h4>
                          <p className="text-[11px] text-teal-400 font-medium">{dine.cuisine}</p>
                          <p className="text-[11px] text-slate-400">{dine.description}</p>
                          {dine.specialExperience && (
                            <p className="text-[10px] text-amber-300 font-semibold pt-1">
                              ★ {dine.specialExperience}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: AMENITIES */}
              {activeTab === "amenities" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-white">Resort Amenities &amp; Services</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {resort.facilitiesList.map((cat, idx) => (
                      <div key={idx} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                        <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                          {cat.category}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {cat.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <span>{item.name}</span>
                              {item.isComplimentary && (
                                <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded">
                                  Free
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: LOCATION & TRANSIT */}
              {activeTab === "location" && (
                <div className="space-y-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-300">
                      <MapPin className="w-4 h-4" />
                      <span>{resort.address}</span>
                    </div>
                    <p className="text-xs text-slate-300">{resort.landmark}</p>
                    <div className="text-[11px] text-slate-400 font-mono">
                      GPS Coordinates: {resort.latitude}° N, {resort.longitude}° E
                    </div>
                  </div>

                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Nearby Airports, Railway Stations &amp; Attractions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {resort.nearbyTransit.map((t, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          {t.type === "airport" ? (
                            <Plane className="w-4 h-4 text-teal-400 shrink-0" />
                          ) : t.type === "railway" ? (
                            <Train className="w-4 h-4 text-teal-400 shrink-0" />
                          ) : (
                            <Compass className="w-4 h-4 text-teal-400 shrink-0" />
                          )}
                          <span className="text-slate-200 font-medium">{t.name}</span>
                        </div>
                        <span className="text-teal-300 font-bold font-mono text-[11px]">{t.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: POLICIES */}
              {activeTab === "policies" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      Check-In &amp; Check-Out
                    </h4>
                    <p className="text-xs text-slate-300">
                      <strong>Check-In:</strong> {resort.policies.checkInTime} • <strong>Check-Out:</strong>{" "}
                      {resort.policies.checkOutTime}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Early check-in and late check-out subject to availability.
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      Cancellation &amp; Refund Guarantee
                    </h4>
                    <p className="text-xs text-emerald-400 font-medium">
                      {resort.policies.cancellationPolicy}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      Child &amp; Pet Policies
                    </h4>
                    <p className="text-xs text-slate-300">
                      <strong>Child Policy:</strong> {resort.policies.childPolicy}
                    </p>
                    <p className="text-xs text-slate-300">
                      <strong>Pet Policy:</strong> {resort.policies.petPolicy}
                    </p>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                      Accepted Government ID Proofs
                    </h4>
                    <p className="text-xs text-slate-300">
                      {resort.policies.idProofPolicy.join(", ")}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Local ID proofs accepted. {resort.policies.coupleFriendlyPolicy}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 9: REVIEWS */}
              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {/* Rating Breakdown */}
                  <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-1">
                        <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                        <span>{resort.rating}</span>
                        <span className="text-sm font-normal text-slate-400">/ 5.0</span>
                      </div>
                      <p className="text-xs text-slate-400">Based on {resort.reviewCount} verified guest reviews</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Cleanliness</span>
                        <span className="font-bold text-teal-300">{resort.ratingBreakdown.cleanliness}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Location</span>
                        <span className="font-bold text-teal-300">{resort.ratingBreakdown.location}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Service</span>
                        <span className="font-bold text-teal-300">{resort.ratingBreakdown.service}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Dining</span>
                        <span className="font-bold text-teal-300">{resort.ratingBreakdown.food}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Value</span>
                        <span className="font-bold text-teal-300">{resort.ratingBreakdown.valueForMoney}</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Cards */}
                  <div className="space-y-3">
                    {resort.reviewsList.map((rev) => (
                      <div key={rev.id} className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700/60 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-white">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400 ml-2">{rev.userCity}</span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">"{rev.comment}"</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{rev.date}</span>
                          <span>•</span>
                          <span className="text-teal-400 font-semibold">{rev.tag}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 10: DIRECT CONCIERGE */}
              {activeTab === "contact" && (
                <div className="bg-slate-800/50 p-6 rounded-3xl border border-slate-700 space-y-4 max-w-xl mx-auto text-center">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center mx-auto">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Direct Resort Concierge Desk</h3>
                    <p className="text-xs text-slate-400 mt-1">{resort.conciergeContact.managerName}</p>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 text-teal-300 font-mono font-bold flex items-center justify-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{resort.conciergeContact.phone}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{resort.conciergeContact.email}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono font-bold flex items-center justify-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      <span>WhatsApp: {resort.conciergeContact.whatsapp}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =====================================================================
               VIEW 2: 7-STEP COMPLETE RESORT CUSTOMER BOOKING FLOW
               ===================================================================== */
            <div className="p-6 space-y-6">
              {/* Stepper Navigation */}
              <div className="flex items-center justify-between overflow-x-auto pb-2 border-b border-slate-800 text-xs">
                {[
                  { id: "accommodation", label: "1. Villa / Room" },
                  { id: "package_addons", label: "2. Package & Add-ons" },
                  { id: "guest_profile", label: "3. Guest Profile" },
                  { id: "summary", label: "4. Review Summary" },
                  { id: "payment", label: "5. Payment" },
                  { id: "confirmation", label: "6. Confirmation" },
                ].map((s, idx) => {
                  const isCurrent = bookingStep === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (bookingStep !== "confirmation") setBookingStep(s.id as BookingStep);
                      }}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                        isCurrent
                          ? "bg-teal-500 text-slate-950 shadow-md"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Stay Dates Bar */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block">Check-In Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Check-Out Date</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-mono font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Guests (Adults)</label>
                  <select
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-bold mt-1"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n} Adult{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block">Rooms / Villas</label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-100 text-xs font-bold mt-1"
                  >
                    {[1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n} Room / Villa{n > 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STEP 1: SELECT ACCOMMODATION & MEAL PLAN */}
              {bookingStep === "accommodation" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-white">
                      Step 1: Choose Your Villa / Suite &amp; Meal Plan
                    </h3>
                    <span className="text-xs text-teal-300 font-mono">{nightsCount} Night(s) Stay</span>
                  </div>

                  <div className="space-y-4">
                    {resort.roomTypes.map((room) => {
                      const isSelected = selectedRoom?.id === room.id;
                      return (
                        <div
                          key={room.id}
                          className={`rounded-2xl border p-4 transition-all ${
                            isSelected
                              ? "bg-slate-800 border-teal-400 ring-1 ring-teal-400 shadow-xl"
                              : "bg-slate-800/50 border-slate-700 hover:border-slate-600"
                          }`}
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-56 h-36 rounded-xl overflow-hidden shrink-0">
                              <img
                                src={room.photos[0] || resort.featuredImage}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-extrabold text-white">{room.name}</h4>
                                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                                  {room.roomSizeSqFt} sq. ft.
                                </span>
                              </div>
                              <p className="text-xs text-teal-400 font-semibold">{room.roomView}</p>
                              <p className="text-[11px] text-slate-400">
                                {room.bedType} • Max {room.maxAdults} Adults, {room.maxChildren} Children
                              </p>

                              {/* Rate Plans */}
                              <div className="space-y-2 pt-2">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
                                  Select Meal Plan:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {room.ratePlans.map((plan) => {
                                    const isPlanActive =
                                      isSelected && selectedRatePlan?.planCode === plan.planCode;
                                    return (
                                      <button
                                        key={plan.planCode}
                                        onClick={() => {
                                          setSelectedRoom(room);
                                          setSelectedRatePlan(plan);
                                        }}
                                        className={`p-2.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                                          isPlanActive
                                            ? "bg-teal-950/70 border-teal-400 text-white"
                                            : "bg-slate-900/60 border-slate-700 text-slate-300 hover:bg-slate-900"
                                        }`}
                                      >
                                        <div>
                                          <div className="flex items-center justify-between font-bold">
                                            <span>{plan.planName}</span>
                                            <span className="text-teal-300">
                                              ₹{plan.pricePerNight.toLocaleString("en-IN")}
                                            </span>
                                          </div>
                                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                                            {plan.description}
                                          </p>
                                        </div>
                                        <div className="text-[9px] text-emerald-400 font-semibold mt-1">
                                          ✓ {plan.freeCancellationUntil}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      id="btn-next-step-addons"
                      onClick={() => setBookingStep("package_addons")}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg"
                    >
                      <span>Continue to Packages &amp; Add-ons</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT PACKAGE & ADD-ONS */}
              {bookingStep === "package_addons" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Step 2: Choose Curated Stay Package &amp; Resort Add-ons
                    </h3>
                    <p className="text-xs text-slate-400">
                      Enhance your stay with honeymoon surprises, ayurvedic healing, and private activities.
                    </p>
                  </div>

                  {/* Curated Packages */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                      Curated Experience Packages (Optional)
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {resort.curatedPackages.map((pkg) => {
                        const isPkgSelected = selectedPackage?.id === pkg.id;
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => setSelectedPackage(isPkgSelected ? null : pkg)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                              isPkgSelected
                                ? "bg-teal-950/70 border-teal-400 ring-1 ring-teal-400"
                                : "bg-slate-800/60 border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 text-[10px] font-bold">
                                  {pkg.category}
                                </span>
                                <span className="text-xs font-black text-teal-300">
                                  +₹{pkg.priceDeltaPerNight.toLocaleString("en-IN")}/nt
                                </span>
                              </div>
                              <h4 className="text-xs font-bold text-white">{pkg.name}</h4>
                              <p className="text-[10px] text-slate-400 leading-tight">{pkg.description}</p>
                            </div>
                            <div className="pt-2 text-[10px] font-bold text-teal-400">
                              {isPkgSelected ? "✓ Package Selected" : "+ Click to Select"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activities & Experiences */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-teal-300 uppercase tracking-wider block">
                      Activities &amp; Wellness Add-ons
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {resort.resortActivities.map((act) => {
                        const isSelected = selectedActivityIds.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            onClick={() => toggleActivity(act.id)}
                            className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? "bg-emerald-950/60 border-emerald-400"
                                : "bg-slate-800/40 border-slate-700"
                            }`}
                          >
                            <div>
                              <h5 className="text-xs font-bold text-white">{act.title}</h5>
                              <p className="text-[10px] text-slate-400">
                                {act.duration} • {act.category}
                              </p>
                              <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                                {act.isComplimentary
                                  ? "Complimentary"
                                  : `₹${act.pricePerPerson.toLocaleString("en-IN")} / person`}
                              </p>
                            </div>
                            <button
                              className={`px-3 py-1 rounded-lg text-xs font-bold ${
                                isSelected
                                  ? "bg-emerald-500 text-slate-950"
                                  : "bg-slate-700 text-slate-300"
                              }`}
                            >
                              {isSelected ? "✓ Added" : "Add"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Essential Services */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <label className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAirportTransferSelected}
                        onChange={(e) => setIsAirportTransferSelected(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Private Airport / Station Cab Pickup (+₹3,500)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Chauffeured luxury AC sedan waiting with name placard
                        </span>
                      </div>
                    </label>

                    <label className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isExtraBedSelected}
                        onChange={(e) => setIsExtraBedSelected(e.target.checked)}
                        className="w-4 h-4 rounded text-teal-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">
                          Extra Rollaway Bed with Organic Linen (+₹2,800/nt)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Recommended for 3rd adult or elder child
                        </span>
                      </div>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setBookingStep("accommodation")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                    >
                      Back
                    </button>
                    <button
                      id="btn-next-step-guest-profile"
                      onClick={() => setBookingStep("guest_profile")}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg"
                    >
                      <span>Continue to Guest Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: GUEST BOOKING PROFILE */}
              {bookingStep === "guest_profile" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Step 3: Primary Guest Booking Profile &amp; ID Details
                    </h3>
                    <p className="text-xs text-slate-400">
                      As per hospitality regulations, please provide primary guest credentials for check-in.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Title</label>
                      <select
                        value={guestProfile.title}
                        onChange={(e) => setGuestProfile({ ...guestProfile, title: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold mt-1"
                      >
                        <option value="Mr">Mr.</option>
                        <option value="Mrs">Mrs.</option>
                        <option value="Ms">Ms.</option>
                        <option value="Dr">Dr.</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">First Name</label>
                      <input
                        type="text"
                        value={guestProfile.firstName}
                        onChange={(e) => setGuestProfile({ ...guestProfile, firstName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Last Name</label>
                      <input
                        type="text"
                        value={guestProfile.lastName}
                        onChange={(e) => setGuestProfile({ ...guestProfile, lastName: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Mobile Phone (+91)</label>
                      <input
                        type="tel"
                        value={guestProfile.mobile}
                        onChange={(e) => setGuestProfile({ ...guestProfile, mobile: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Email for Voucher &amp; Invoice</label>
                      <input
                        type="email"
                        value={guestProfile.email}
                        onChange={(e) => setGuestProfile({ ...guestProfile, email: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white mt-1"
                      />
                    </div>
                  </div>

                  {/* ID Document Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-slate-400 block">Government ID Document</label>
                      <select
                        value={guestProfile.idDocumentType}
                        onChange={(e) => setGuestProfile({ ...guestProfile, idDocumentType: e.target.value as any })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold mt-1"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Driving License">Driving License</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block">Document Identification Number</label>
                      <input
                        type="text"
                        value={guestProfile.idDocumentNumber}
                        onChange={(e) => setGuestProfile({ ...guestProfile, idDocumentNumber: e.target.value })}
                        placeholder="e.g. 1234-5678-9012"
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono mt-1"
                      />
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-[10px] text-slate-400 block">Special Requests &amp; Notes</label>
                    <textarea
                      rows={2}
                      value={guestProfile.customRequestNote}
                      onChange={(e) => setGuestProfile({ ...guestProfile, customRequestNote: e.target.value })}
                      placeholder="e.g. Honeymoon bed decoration, ground floor, pure vegetarian food preference..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white mt-1"
                    />
                  </div>

                  {/* GST Invoice */}
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={guestProfile.isGstInvoiceRequested}
                        onChange={(e) =>
                          setGuestProfile({ ...guestProfile, isGstInvoiceRequested: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-teal-500"
                      />
                      <span className="text-xs font-bold text-white">
                        Generate SAC 996311 GST Business Tax Invoice (Claim 18% Input Tax Credit)
                      </span>
                    </label>

                    {guestProfile.isGstInvoiceRequested && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[10px] text-slate-400 block">Company Legal Name</label>
                          <input
                            type="text"
                            value={guestProfile.gstDetails?.companyName || ""}
                            onChange={(e) =>
                              setGuestProfile({
                                ...guestProfile,
                                gstDetails: { ...guestProfile.gstDetails!, companyName: e.target.value },
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block">GSTIN Number</label>
                          <input
                            type="text"
                            value={guestProfile.gstDetails?.gstin || ""}
                            onChange={(e) =>
                              setGuestProfile({
                                ...guestProfile,
                                gstDetails: { ...guestProfile.gstDetails!, gstin: e.target.value },
                              })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono uppercase mt-1"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      onClick={() => setBookingStep("package_addons")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs"
                    >
                      Back
                    </button>
                    <button
                      id="btn-next-step-summary"
                      onClick={() => setBookingStep("summary")}
                      className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-lg"
                    >
                      <span>Review Booking &amp; Price</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW SUMMARY & PRICE BREAKDOWN */}
              {bookingStep === "summary" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Step 4: Review Booking Summary &amp; Price Breakdown
                    </h3>
                    <p className="text-xs text-slate-400">
                      Transparent cost calculation with zero hidden platform charges.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-700">
                          <span className="font-bold text-white text-sm">{resort.name}</span>
                          <span className="text-teal-300 font-bold">{resort.city}, {resort.state}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-slate-300">
                          <div>
                            <span className="text-slate-400 block text-[10px]">Dates &amp; Duration</span>
                            <span className="font-bold">{checkInDate} to {checkOutDate} ({nightsCount} Nights)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Villa / Room Type</span>
                            <span className="font-bold">{selectedRoom?.name} ({roomsCount} Room)</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Meal Plan</span>
                            <span className="font-bold">{selectedRatePlan?.planName}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px]">Guests</span>
                            <span className="font-bold">{adultsCount} Adult(s), {childrenCount} Child(ren)</span>
                          </div>
                        </div>

                        {selectedPackage && (
                          <div className="p-2.5 rounded-xl bg-teal-950/60 border border-teal-500/40 text-[11px] text-teal-200">
                            <strong>Selected Package:</strong> {selectedPackage.name} (+₹{selectedPackage.priceDeltaPerNight.toLocaleString("en-IN")}/nt)
                          </div>
                        )}

                        {selectedActivityIds.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-slate-300">
                            <strong>Activities:</strong>{" "}
                            {selectedActivityIds
                              .map((id) => resort.resortActivities.find((a) => a.id === id)?.title)
                              .join(", ")}
                          </div>
                        )}
                      </div>

                      {/* Coupon Code Input */}
                      <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700 space-y-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter Promo Code (e.g. RESORTLUX)"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white uppercase"
                          />
                          <button
                            onClick={() => handleApplyCoupon()}
                            className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && <p className="text-[11px] text-rose-400 font-medium">{couponError}</p>}
                        {appliedCouponCode && (
                          <p className="text-[11px] text-emerald-400 font-bold">
                            ✓ Coupon {appliedCouponCode} applied! Saved ₹{priceBreakdown.couponDiscount.toLocaleString("en-IN")}
                          </p>
                        )}

                        {/* Quick Offers List */}
                        <div className="flex flex-wrap gap-2 pt-1">
                          {resort.availableOffers.map((off) => (
                            <button
                              key={off.code}
                              onClick={() => handleApplyCoupon(off.code)}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-teal-500/30 text-teal-300 text-[10px] font-mono font-bold flex items-center gap-1"
                            >
                              <span>{off.code}</span>
                              <span className="text-slate-400">• {off.badge}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* YatraCoins Redeem */}
                      <label className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={useYatraCoins}
                            onChange={(e) => setUseYatraCoins(e.target.checked)}
                            className="w-4 h-4 rounded text-teal-500"
                          />
                          <div className="text-xs">
                            <span className="font-bold text-white block flex items-center gap-1">
                              <Coins className="w-3.5 h-3.5 text-amber-400" />
                              Redeem YatraCoins Balance (1,800 Coins = ₹1,800)
                            </span>
                            <span className="text-[10px] text-slate-400">
                              Instant loyalty discount deducted from gross tariff
                            </span>
                          </div>
                        </div>
                        {useYatraCoins && (
                          <span className="text-xs font-bold text-emerald-400">
                            -₹{priceBreakdown.coinsDiscount.toLocaleString("en-IN")}
                          </span>
                        )}
                      </label>
                    </div>

                    {/* Right Col: Price Breakdown Card */}
                    <div className="bg-slate-800/80 p-5 rounded-3xl border border-teal-500/30 space-y-4 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-black text-teal-300 uppercase tracking-wider pb-2 border-b border-slate-700">
                          Price Calculation Engine
                        </h4>

                        <div className="space-y-2 text-xs pt-3">
                          <div className="flex items-center justify-between text-slate-300">
                            <span>
                              Room Tariff ({nightsCount}N x ₹{priceBreakdown.baseNightRate.toLocaleString("en-IN")})
                            </span>
                            <span className="font-mono">₹{priceBreakdown.grossRoomTariff.toLocaleString("en-IN")}</span>
                          </div>

                          {priceBreakdown.packageCharges > 0 && (
                            <div className="flex items-center justify-between text-slate-300">
                              <span>Package Add-on Charges</span>
                              <span className="font-mono">
                                +₹{priceBreakdown.packageCharges.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}

                          {priceBreakdown.activityCharges > 0 && (
                            <div className="flex items-center justify-between text-slate-300">
                              <span>Activities &amp; Spa</span>
                              <span className="font-mono">
                                +₹{priceBreakdown.activityCharges.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}

                          {priceBreakdown.transferCharges > 0 && (
                            <div className="flex items-center justify-between text-slate-300">
                              <span>Private Airport Transfer</span>
                              <span className="font-mono">+₹{priceBreakdown.transferCharges.toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          {priceBreakdown.extraBedCharges > 0 && (
                            <div className="flex items-center justify-between text-slate-300">
                              <span>Extra Bed ({nightsCount}N)</span>
                              <span className="font-mono">+₹{priceBreakdown.extraBedCharges.toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          {priceBreakdown.couponDiscount > 0 && (
                            <div className="flex items-center justify-between text-emerald-400 font-semibold">
                              <span>Promo Coupon Discount</span>
                              <span className="font-mono">
                                -₹{priceBreakdown.couponDiscount.toLocaleString("en-IN")}
                              </span>
                            </div>
                          )}

                          {priceBreakdown.coinsDiscount > 0 && (
                            <div className="flex items-center justify-between text-emerald-400 font-semibold">
                              <span>YatraCoins Loyalty</span>
                              <span className="font-mono">-₹{priceBreakdown.coinsDiscount.toLocaleString("en-IN")}</span>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-700/60">
                            <span>GST SAC 996311 ({priceBreakdown.gstRate}%)</span>
                            <span className="font-mono">₹{priceBreakdown.gstAmount.toLocaleString("en-IN")}</span>
                          </div>

                          <div className="flex items-center justify-between text-slate-300">
                            <span>Platform Convenience Fee</span>
                            <span className="text-emerald-400 font-bold">₹0 (FREE)</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-300">Total Payable Amount</span>
                          <span className="text-xl font-black text-white font-mono">
                            ₹{priceBreakdown.finalPayable.toLocaleString("en-IN")}
                          </span>
                        </div>

                        <button
                          id="btn-proceed-to-payment"
                          onClick={() => setBookingStep("payment")}
                          className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-xl shadow-teal-500/20"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>Proceed to Payment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: PAYMENT GATEWAY */}
              {bookingStep === "payment" && (
                <div className="space-y-6 max-w-2xl mx-auto">
                  <div>
                    <h3 className="text-sm font-extrabold text-white text-center">
                      Step 5: Secure Payment Gateway
                    </h3>
                    <p className="text-xs text-slate-400 text-center">
                      Pay ₹{priceBreakdown.finalPayable.toLocaleString("en-IN")} via 256-bit encrypted gateway.
                    </p>
                  </div>

                  {/* Payment Mode Tabs */}
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-xs font-bold">
                    {[
                      { id: "UPI", label: "Instant UPI" },
                      { id: "CARD", label: "Credit/Debit" },
                      { id: "NETBANKING", label: "NetBanking" },
                      { id: "WALLET", label: "Wallets" },
                      { id: "PAY_AT_RESORT", label: "Pay at Resort" },
                    ].map((pm) => (
                      <button
                        key={pm.id}
                        onClick={() => setPaymentMethod(pm.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          paymentMethod === pm.id
                            ? "bg-teal-500 text-slate-950 font-black border-teal-400"
                            : "bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700"
                        }`}
                      >
                        {pm.label}
                      </button>
                    ))}
                  </div>

                  {/* UPI Mode */}
                  {paymentMethod === "UPI" && (
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-4 text-center">
                      <div className="p-3 bg-white w-40 h-40 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                        <QrCode className="w-32 h-32 text-slate-950" />
                      </div>
                      <p className="text-xs text-slate-300">Scan UPI QR with GPay, PhonePe, Paytm, or BHIM</p>
                      <div className="max-w-xs mx-auto flex items-center gap-2">
                        <input
                          type="text"
                          value={upiIdInput}
                          onChange={(e) => setUpiIdInput(e.target.value)}
                          placeholder="yourname@upi"
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white text-center"
                        />
                        <button
                          onClick={handleCompleteBooking}
                          disabled={isProcessingPayment}
                          className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs"
                        >
                          Verify &amp; Pay
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Card Mode */}
                  {paymentMethod === "CARD" && (
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400 block">Card Number</label>
                        <input
                          type="text"
                          defaultValue="4532 •••• •••• 8821"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white mt-1"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 block">Expiry (MM/YY)</label>
                          <input
                            type="text"
                            defaultValue="08/29"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white mt-1"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block">CVV / CVC</label>
                          <input
                            type="password"
                            defaultValue="•••"
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Pay at Resort */}
                  {paymentMethod === "PAY_AT_RESORT" && (
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-700 space-y-2 text-center">
                      <ShieldCheck className="w-8 h-8 text-teal-400 mx-auto" />
                      <h4 className="text-xs font-bold text-white">Zero Card Hold • Pay Upon Check-In</h4>
                      <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                        Your luxury villa reservation is instantly guaranteed. Settle the balance directly at resort reception via Cash, Card, or UPI upon arrival.
                      </p>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      id="btn-confirm-pay"
                      onClick={handleCompleteBooking}
                      disabled={isProcessingPayment}
                      className="w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-2xl transition-all"
                    >
                      {isProcessingPayment ? (
                        <span>Authorizing Resort Reservation...</span>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>
                            {paymentMethod === "PAY_AT_RESORT" ? "Confirm Resort Booking" : `Pay ₹${priceBreakdown.finalPayable.toLocaleString("en-IN")} Now`}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: CONFIRMATION & E-VOUCHER */}
              {bookingStep === "confirmation" && completedBooking && (
                <div className="space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300">
                  <div className="text-center space-y-2">
                    <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-black text-white">Resort Stay Confirmed!</h3>
                    <p className="text-xs text-slate-300">
                      Your reservation at <strong>{resort.name}</strong> is successfully booked.
                    </p>
                  </div>

                  {/* Printable E-Voucher */}
                  <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-200">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] text-teal-800 font-extrabold uppercase tracking-wider block">
                          Official Resort E-Voucher
                        </span>
                        <h4 className="text-base font-black text-slate-900">{resort.name}</h4>
                        <p className="text-xs text-slate-600">{resort.address}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Booking ID</span>
                        <span className="text-xs font-mono font-black text-teal-800">{completedBooking.id}</span>
                        <span className="text-[10px] text-slate-500 block mt-1">Resort PNR / Ref</span>
                        <span className="text-xs font-mono font-black text-slate-900">{completedBooking.pnr}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Guest Name</span>
                        <span className="font-bold">{guestProfile.title} {guestProfile.firstName} {guestProfile.lastName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Check-In</span>
                        <span className="font-bold">{checkInDate} (14:00)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Check-Out</span>
                        <span className="font-bold">{checkOutDate} (11:00)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Total Paid</span>
                        <span className="font-bold text-teal-800 font-mono">₹{completedBooking.amount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">Accommodation &amp; Inclusions</span>
                        <span className="font-bold text-teal-800">{selectedRoom?.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {selectedRatePlan?.planName} • {adultsCount} Adults, {childrenCount} Children • {selectedRoom?.roomView}
                      </p>
                      {selectedPackage && (
                        <p className="text-[11px] text-teal-700 font-semibold">
                          ★ Package: {selectedPackage.name}
                        </p>
                      )}
                    </div>

                    <div className="pt-2 text-[11px] text-slate-600 flex items-center justify-between">
                      <span>Concierge Contact: {resort.conciergeContact.phone}</span>
                      <span>SAC Code: 996311 (Accommodation)</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs flex items-center gap-2 border border-slate-700"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Voucher &amp; Invoice</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs shadow-lg"
                    >
                      View in My Trips
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
