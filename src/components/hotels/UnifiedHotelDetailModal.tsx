import React, { useState, useMemo } from "react";
import {
  X,
  Star,
  MapPin,
  Calendar,
  Users,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Coffee,
  Wifi,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Tv,
  Bath,
  Compass,
  CreditCard,
  QrCode,
  Download,
  Phone,
  Mail,
  FileText,
  Clock,
  Heart,
  Share2,
  Info,
  Check,
  Tag,
  AlertCircle,
  Car,
  Utensils,
  Play,
  Maximize2,
  TreePine,
  Palmtree,
  Shield,
  Percent,
} from "lucide-react";
import {
  UnifiedPropertyItem,
  HotelRoomSpecification,
  HotelMealPlan,
  RoomGuestAllocationItem,
  HotelBookingGuestProfile,
  BookingItem,
} from "../../types";

interface UnifiedHotelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: UnifiedPropertyItem | null;
  onBookingSuccess: (booking: BookingItem) => void;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
  initialRooms?: number;
}

type ModalStep = "details" | "guest_profile" | "payment" | "confirmed";

export function UnifiedHotelDetailModal({
  isOpen,
  onClose,
  property,
  onBookingSuccess,
  initialCheckIn = "2026-08-28",
  initialCheckOut = "2026-08-30",
  initialGuests = 2,
  initialRooms = 1,
}: UnifiedHotelDetailModalProps) {
  if (!isOpen || !property) return null;

  // Flow State
  const [currentStep, setCurrentStep] = useState<ModalStep>("details");
  const [activeMediaTab, setActiveMediaTab] = useState<"photos" | "video">("photos");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Search & Stay State
  const [checkInDate, setCheckInDate] = useState(initialCheckIn);
  const [checkOutDate, setCheckOutDate] = useState(initialCheckOut);
  const [adultsCount, setAdultsCount] = useState(initialGuests);
  const [childrenCount, setChildrenCount] = useState(0);
  const [roomsCount, setRoomsCount] = useState(initialRooms);

  // Selected Room & Meal Plan
  const [selectedRoom, setSelectedRoom] = useState<HotelRoomSpecification>(property.roomTypes[0]);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>(
    property.roomTypes[0].ratePlans[0]?.planCode || "CP"
  );

  // Offers & Coupons
  const [appliedCouponCode, setAppliedCouponCode] = useState<string>("BHARATSTAY");
  const [customCouponInput, setCustomCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [useYatraCoins, setUseYatraCoins] = useState(true);

  // Guest Profile Form State
  const [guestProfile, setGuestProfile] = useState<HotelBookingGuestProfile>({
    title: "Mr",
    firstName: "Aarav",
    lastName: "Sharma",
    mobile: "+91 98765 43210",
    email: "aarav.sharma@example.com",
    nationality: "Indian",
    idDocumentType: "Aadhaar Card",
    idDocumentNumber: "XXXX-XXXX-8921",
    specialRequests: ["High floor room", "Late check-in anticipated"],
    customRequestNote: "Traveling for anniversary celebration, quiet room appreciated.",
    emergencyContact: {
      name: "Devendra Sharma",
      phone: "+91 98111 22334",
      relationship: "Brother",
    },
    isGstInvoiceRequested: false,
    gstDetails: {
      companyName: "Sharma Tech Enterprises LLP",
      gstin: "07AAACB1234F1Z8",
      companyAddress: "Connaught Place, New Delhi - 110001",
    },
  });

  // Dynamic Room & Guest Allocations
  const [roomAllocations, setRoomAllocations] = useState<RoomGuestAllocationItem[]>([
    {
      roomNumber: 1,
      adultsCount: 2,
      childrenCount: 0,
      guestNames: ["Aarav Sharma", "Pooja Sharma"],
      bedPreference: "King Bed",
      smokingPreference: "Non-Smoking",
      extraBedRequested: false,
    },
  ]);

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"UPI" | "CARD" | "NETBANKING" | "WALLET" | "PAY_AT_HOTEL">("UPI");
  const [upiIdInput, setUpiIdInput] = useState("aarav@okhdfcbank");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Number of nights calculation
  const totalNights = useMemo(() => {
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 2;
  }, [checkInDate, checkOutDate]);

  // Active Rate Plan
  const activeRatePlan: HotelMealPlan = useMemo(() => {
    const plan = selectedRoom.ratePlans.find((p) => p.planCode === selectedPlanCode);
    return plan || selectedRoom.ratePlans[0];
  }, [selectedRoom, selectedPlanCode]);

  // Price Calculation Engine
  const priceBreakdown = useMemo(() => {
    const basePerNight = activeRatePlan.pricePerNight;
    const grossRoomAmount = basePerNight * totalNights * roomsCount;

    // Coupon discount
    let couponDiscount = 0;
    if (appliedCouponCode === "BHARATSTAY") {
      couponDiscount = Math.min(Math.round(grossRoomAmount * 0.12), 4000);
    } else if (appliedCouponCode === "LUXURY2026" && grossRoomAmount >= 35000) {
      couponDiscount = 5000;
    } else if (appliedCouponCode === "YATRAMEMBER") {
      couponDiscount = Math.min(Math.round(grossRoomAmount * 0.05), 2000);
    } else if (appliedCouponCode === "SAFARI2026" && grossRoomAmount >= 15000) {
      couponDiscount = 2500;
    }

    // YatraCoins discount (480 coins = ₹480)
    const yatraCoinsDiscount = useYatraCoins ? 480 : 0;

    // Extra bed fee if requested in any room
    const extraBedCount = roomAllocations.filter((r) => r.extraBedRequested).length;
    const extraBedCharges = extraBedCount * 1200 * totalNights;

    // GST calculation (12% for < ₹7500/night base, 18% for >= ₹7500/night base)
    const gstRate = basePerNight >= 7500 ? 0.18 : 0.12;
    const taxableSubtotal = Math.max(0, grossRoomAmount + extraBedCharges - couponDiscount - yatraCoinsDiscount);
    const taxGstAmount = Math.round(taxableSubtotal * gstRate);

    // Platform convenience fee (Waived for Yatra Club)
    const platformConvenienceFee = 0;
    const serviceCharges = Math.round(taxableSubtotal * 0.02); // 2% service charge

    const finalPayableAmount = taxableSubtotal + taxGstAmount + serviceCharges + platformConvenienceFee;

    return {
      baseRoomRatePerNight: basePerNight,
      numberOfNights: totalNights,
      numberOfRooms: roomsCount,
      grossRoomAmount,
      couponDiscount,
      yatraCoinsDiscount,
      extraBedCharges,
      gstRatePercent: gstRate * 100,
      taxGstAmount,
      serviceCharges,
      platformConvenienceFee,
      finalPayableAmount,
    };
  }, [activeRatePlan, totalNights, roomsCount, appliedCouponCode, useYatraCoins, roomAllocations]);

  // Handle Room Category Change
  const handleSelectRoom = (room: HotelRoomSpecification) => {
    setSelectedRoom(room);
    setSelectedPlanCode(room.ratePlans[0]?.planCode || "CP");
  };

  // Adjust Room Count & Allocations
  const handleRoomsCountChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(5, newCount));
    setRoomsCount(validCount);

    const updated = [...roomAllocations];
    if (validCount > updated.length) {
      for (let i = updated.length + 1; i <= validCount; i++) {
        updated.push({
          roomNumber: i,
          adultsCount: 2,
          childrenCount: 0,
          guestNames: [`Guest ${i}A`, `Guest ${i}B`],
          bedPreference: "King Bed",
          smokingPreference: "Non-Smoking",
          extraBedRequested: false,
        });
      }
    } else if (validCount < updated.length) {
      updated.splice(validCount);
    }
    setRoomAllocations(updated);
  };

  // Apply Coupon
  const handleApplyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const found = property.availableOffers.find((o) => o.code === trimmed);
    if (found) {
      setAppliedCouponCode(trimmed);
      setCouponError("");
    } else {
      setCouponError(`Invalid coupon code '${trimmed}'. Try BHARATSTAY or LUXURY2026.`);
    }
  };

  // Handle Payment & Booking Confirmation
  const handleProcessBooking = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const generatedBookingId = `BY-HTL-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedHotelConfirmation = `${property.name.substring(0, 3).toUpperCase()}-${property.city.substring(0, 3).toUpperCase()}-${Math.floor(10000 + Math.random() * 90000)}`;

      const newBooking: BookingItem = {
        id: `HB-${Date.now()}`,
        serviceCategory: property.categoryTag,
        title: `${property.name} • ${selectedRoom.name}`,
        subtitle: `${roomsCount} Room(s) • ${totalNights} Night(s) • ${activeRatePlan.planName}`,
        provider: property.name,
        fromLocation: `${property.city}, ${property.state}`,
        toLocation: property.landmark,
        date: `${checkInDate} to ${checkOutDate}`,
        time: property.policies.checkInTime,
        status: "confirmed",
        amountPaid: priceBreakdown.finalPayableAmount,
        pnr: generatedBookingId,
        bookingRef: generatedHotelConfirmation,
        passengersCount: adultsCount + childrenCount,
        seatOrRoomInfo: `${roomsCount} × ${selectedRoom.name} (${selectedRoom.category}) • ${activeRatePlan.planName}`,
        paymentSummary: {
          baseFare: priceBreakdown.grossRoomAmount,
          taxesAndGst: priceBreakdown.taxGstAmount + priceBreakdown.serviceCharges,
          convenienceFee: priceBreakdown.platformConvenienceFee,
          discountApplied: priceBreakdown.couponDiscount + priceBreakdown.yatraCoinsDiscount,
          totalAmount: priceBreakdown.finalPayableAmount,
          paymentMode: paymentMethod,
          paymentStatus: paymentMethod === "PAY_AT_HOTEL" ? "PAY_AT_HOTEL" : "PAID",
          transactionRef: `TXN-HTL-${Date.now()}`,
          paidAt: new Date().toISOString(),
        },
        gstInvoice: {
          invoiceNumber: `INV-BY-${Math.floor(1000000 + Math.random() * 9000000)}`,
          gstin: "07AAACB9876K1Z2",
          legalEntity: `${property.name} Hospitality Pvt Ltd`,
          sacCode: "996311",
          date: new Date().toISOString().split("T")[0],
          taxableAmount: priceBreakdown.grossRoomAmount - priceBreakdown.couponDiscount,
          cgst: Math.round(priceBreakdown.taxGstAmount / 2),
          sgst: Math.round(priceBreakdown.taxGstAmount / 2),
          igst: 0,
          totalInvoiceAmount: priceBreakdown.finalPayableAmount,
          customerGst: guestProfile.isGstInvoiceRequested ? guestProfile.gstDetails?.gstin : undefined,
          customerCompanyName: guestProfile.isGstInvoiceRequested ? guestProfile.gstDetails?.companyName : undefined,
        },
        cancellationDetails: {
          isEligible: true,
          cancellationPolicyRule: property.policies.cancellationPolicy,
          cancellationFee: 0,
          refundableAmount: priceBreakdown.finalPayableAmount,
          refundStatus: "INSTANT_WALLET_CREDITED",
        },
      };

      setConfirmedBookingData({
        ...newBooking,
        hotelConfirmationNumber: generatedHotelConfirmation,
        voucherCode: `VCH-${generatedBookingId}`,
        property,
        selectedRoom,
        activeRatePlan,
        guestProfile,
        roomAllocations,
        priceBreakdown,
      });

      onBookingSuccess(newBooking);
      setIsProcessingPayment(false);
      setCurrentStep("confirmed");
    }, 1200);
  };

  // Theme styling based on category
  const theme = useMemo(() => {
    if (property.categoryTag === "lodges") {
      return {
        badgeBg: "bg-emerald-600",
        btnBg: "bg-emerald-600 hover:bg-emerald-700",
        borderActive: "border-emerald-500 bg-emerald-50/50",
        textAccent: "text-emerald-700",
        icon: TreePine,
      };
    }
    if (property.categoryTag === "resorts") {
      return {
        badgeBg: "bg-teal-600",
        btnBg: "bg-teal-600 hover:bg-teal-700",
        borderActive: "border-teal-500 bg-teal-50/50",
        textAccent: "text-teal-700",
        icon: Palmtree,
      };
    }
    return {
      badgeBg: "bg-indigo-600",
      btnBg: "bg-indigo-600 hover:bg-indigo-700",
      borderActive: "border-indigo-500 bg-indigo-50/50",
      textAccent: "text-indigo-700",
      icon: Building2,
    };
  }, [property.categoryTag]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* ========================================================================= */}
        {/* MODAL TOP BAR: PROPERTY TITLE & STEP BREADCRUMBS */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`p-2 rounded-xl text-white ${theme.badgeBg}`}>
              <theme.icon className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight truncate max-w-md">
                  {property.name}
                </h2>
                <div className="flex items-center gap-1 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-xs font-black">
                  <Star className="w-3 h-3 fill-slate-950" />
                  <span>{property.rating}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{property.city}, {property.state} • {property.landmark}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Step Indicators */}
            {currentStep !== "confirmed" && (
              <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-400">
                <span className={`px-2.5 py-1 rounded-lg ${currentStep === "details" ? "bg-white/10 text-white font-bold" : ""}`}>
                  1. Overview &amp; Rooms
                </span>
                <span>→</span>
                <span className={`px-2.5 py-1 rounded-lg ${currentStep === "guest_profile" ? "bg-white/10 text-white font-bold" : ""}`}>
                  2. Guest Profile
                </span>
                <span>→</span>
                <span className={`px-2.5 py-1 rounded-lg ${currentStep === "payment" ? "bg-white/10 text-white font-bold" : ""}`}>
                  3. Payment
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
        {/* STEP 1: HOTEL DETAIL PROFILE (FRONTEND VISIBLE) */}
        {/* ========================================================================= */}
        {currentStep === "details" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* 1. HOTEL SEARCH & STAY SUMMARY BAR */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-700" />
                  Check-in Date:
                </span>
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-700" />
                  Check-out Date:
                </span>
                <input
                  type="date"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-700" />
                  Guests (Adults + Kids):
                </span>
                <div className="flex items-center gap-1">
                  <select
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Number(e.target.value))}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 font-bold text-slate-900"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} Adult{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                  <select
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 font-bold text-slate-900"
                  >
                    {[0, 1, 2, 3].map((n) => (
                      <option key={n} value={n}>{n} Child{n > 1 ? "ren" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-700" />
                  Rooms Count:
                </span>
                <select
                  value={roomsCount}
                  onChange={(e) => handleRoomsCountChange(Number(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n} Room{n > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. PHOTOS & VIDEOS GALLERY WITH VIRTUAL TOUR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveMediaTab("photos")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      activeMediaTab === "photos"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    📷 High-Res Photos ({property.galleryImages.length})
                  </button>
                  <button
                    onClick={() => setActiveMediaTab("video")}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                      activeMediaTab === "video"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>360° Video Virtual Tour</span>
                  </button>
                </div>

                <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                  {property.badge || "Verified 5-Star Luxury"}
                </span>
              </div>

              {activeMediaTab === "photos" ? (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 h-72">
                  <div className="sm:col-span-2 relative rounded-2xl overflow-hidden group">
                    <img
                      src={property.galleryImages[selectedImageIndex] || property.featuredImage}
                      alt={property.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-xl font-bold">
                      {property.propertyType} • {property.city}
                    </div>
                  </div>

                  <div className="sm:col-span-2 grid grid-cols-2 gap-2 h-full">
                    {property.galleryImages.slice(0, 4).map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`rounded-xl overflow-hidden cursor-pointer border-2 transition-all relative ${
                          selectedImageIndex === idx ? "border-indigo-500 shadow-md" : "border-transparent opacity-80 hover:opacity-100"
                        }`}
                      >
                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden bg-slate-950 h-72 relative flex items-center justify-center">
                  <video
                    src={property.propertyVideoUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <Play className="w-3 h-3 fill-white" />
                    <span>Live 360° Property Walkthrough</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. HOTEL OVERVIEW & RATINGS BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">About {property.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{property.description}</p>

                {/* Key Badges */}
                <div className="flex flex-wrap gap-2 pt-1 text-xs">
                  {property.isCoupleFriendly && (
                    <span className="px-3 py-1 rounded-xl bg-pink-50 border border-pink-200 text-pink-700 font-semibold flex items-center gap-1">
                      ❤️ Couple Friendly (Local IDs Welcomed)
                    </span>
                  )}
                  {property.freeBreakfast && (
                    <span className="px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold flex items-center gap-1">
                      ☕ Free Breakfast Available
                    </span>
                  )}
                  {property.swimmingPool && (
                    <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-semibold flex items-center gap-1">
                      🏊 Outdoor Luxury Swimming Pool
                    </span>
                  )}
                  {property.petFriendly && (
                    <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold flex items-center gap-1">
                      🐾 Pet Friendly Stay
                    </span>
                  )}
                </div>
              </div>

              {/* Verified Ratings Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Guest Review Score</span>
                  <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded-lg text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-white" />
                    <span>{property.rating} / 5.0</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">Based on {property.reviewCount.toLocaleString("en-IN")} verified stays</p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Cleanliness &amp; Hygiene</span>
                    <span className="font-bold text-slate-900">{property.ratingBreakdown.cleanliness} ★</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Location &amp; Scenery</span>
                    <span className="font-bold text-slate-900">{property.ratingBreakdown.location} ★</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Staff Service &amp; Hospitality</span>
                    <span className="font-bold text-slate-900">{property.ratingBreakdown.service} ★</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Food &amp; Dining Quality</span>
                    <span className="font-bold text-slate-900">{property.ratingBreakdown.food} ★</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. ROOM TYPES, INVENTORY & MEAL PLANS (CORE SELECTION ENGINE) */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Select Room Category &amp; Meal Plan
                  </h3>
                  <p className="text-xs text-slate-500">
                    Showing available inventory for {totalNights} Night(s), {roomsCount} Room(s), {adultsCount + childrenCount} Guest(s)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {property.roomTypes.map((room) => {
                  const isSelected = selectedRoom.id === room.id;
                  return (
                    <div
                      key={room.id}
                      className={`border-2 rounded-2xl overflow-hidden transition-all ${
                        isSelected ? "border-indigo-600 shadow-lg bg-indigo-50/20" : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
                        {/* Room Image & Specs */}
                        <div className="lg:col-span-4 space-y-3">
                          <div className="relative rounded-xl overflow-hidden h-44">
                            <img
                              src={room.photos[0] || property.featuredImage}
                              alt={room.name}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-md bg-slate-950/80 text-white text-[10px] font-black uppercase">
                              {room.category}
                            </span>
                            {room.availableInventory <= 3 && (
                              <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-black">
                                🔥 Only {room.availableInventory} Left!
                              </span>
                            )}
                          </div>

                          <div>
                            <h4 className="text-sm font-extrabold text-slate-900">{room.name}</h4>
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <span>📐 {room.roomSizeSqFt} sq.ft</span> • <span>🛏️ {room.bedType}</span> • <span>🌅 {room.roomView}</span>
                            </p>
                          </div>

                          {/* Facilities chips */}
                          <div className="flex flex-wrap gap-1 text-[11px] text-slate-600">
                            {room.facilities.slice(0, 4).map((f, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Meal Plans & Pricing Matrix */}
                        <div className="lg:col-span-8 space-y-3">
                          <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                            Choose Your Meal Option:
                          </h5>

                          <div className="space-y-2">
                            {room.ratePlans.map((plan) => {
                              const isPlanActive = isSelected && selectedPlanCode === plan.planCode;
                              return (
                                <div
                                  key={plan.planCode}
                                  onClick={() => {
                                    handleSelectRoom(room);
                                    setSelectedPlanCode(plan.planCode);
                                  }}
                                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                                    isPlanActive
                                      ? "border-indigo-600 bg-white shadow-xs"
                                      : "border-slate-200 bg-slate-50/50 hover:bg-slate-100"
                                  }`}
                                >
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xs font-black text-slate-900">{plan.planName}</span>
                                      {plan.includesBreakfast && (
                                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">
                                          Breakfast Included
                                        </span>
                                      )}
                                      {plan.includesDinner && (
                                        <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                                          Dinner Included
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-slate-500">{plan.description}</p>
                                    <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      {plan.freeCancellationUntil} • Free Cancellation
                                    </p>
                                  </div>

                                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0">
                                    <div className="text-right">
                                      <span className="text-xs text-slate-400 line-through mr-1.5">
                                        ₹{plan.originalPrice.toLocaleString("en-IN")}
                                      </span>
                                      <span className="text-base font-black text-slate-900">
                                        ₹{plan.pricePerNight.toLocaleString("en-IN")}
                                      </span>
                                      <span className="text-[10px] text-slate-500 block">per night / room</span>
                                    </div>

                                    <div className="mt-1">
                                      {isPlanActive ? (
                                        <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1">
                                          <Check className="w-3.5 h-3.5" /> Selected
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 rounded-lg bg-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-300">
                                          Select
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. PROPERTY FACILITIES CATEGORIZATION */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-slate-900">Property Facilities &amp; Amenities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.facilitiesList.map((cat, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">{cat.category}</h4>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. POLICIES & NEARBY TRANSIT DISTANCES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Hotel Policies */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Property Policies &amp; ID Guidelines
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-semibold text-slate-700">Check-in / Check-out:</span>
                    <span>{property.policies.checkInTime} / {property.policies.checkOutTime}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-semibold text-slate-700">Cancellation Policy:</span>
                    <span className="text-emerald-700 font-bold">{property.policies.cancellationPolicy}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-semibold text-slate-700">Couple Friendly:</span>
                    <span>{property.policies.coupleFriendlyPolicy}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200">
                    <span className="font-semibold text-slate-700">Accepted Government IDs:</span>
                    <span>{property.policies.idProofPolicy.join(", ")}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="font-semibold text-slate-700">Child &amp; Pet Policy:</span>
                    <span>{property.policies.childPolicy}</span>
                  </div>
                </div>
              </div>

              {/* Nearby Transit & Landmarks */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Location, Airport &amp; Station Distance
                </h4>
                <div className="space-y-2 text-xs text-slate-600">
                  {property.nearbyTransit.map((t, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200 last:border-0">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span className="font-medium text-slate-800">{t.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {t.distance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. VERIFIED CUSTOMER REVIEWS */}
            <div className="space-y-3 pt-2">
              <h3 className="text-base font-extrabold text-slate-900">Verified Customer Reviews</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {property.reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-xs font-black text-slate-900">{rev.userName}</h5>
                          <p className="text-[10px] text-slate-400">{rev.userCity} • {rev.date}</p>
                        </div>
                        <div className="flex items-center gap-0.5 bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px] font-black">
                          <span>{rev.rating}</span> ★
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md self-start">
                      {rev.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. ACTIVE OFFERS & COUPONS STRIP */}
            <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-amber-500/10 border border-amber-300 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                  <Percent className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Available Member Discounts &amp; Promo Codes</h4>
                  <p className="text-[11px] text-slate-600">Apply coupon BHARATSTAY at checkout for flat 12% savings up to ₹4,000</p>
                </div>
              </div>
              <button
                onClick={() => handleApplyCoupon("BHARATSTAY")}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Apply Coupon BHARATSTAY
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: GUEST PROFILE & ROOM ALLOCATION */}
        {/* ========================================================================= */}
        {currentStep === "guest_profile" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900">{property.name}</span>
                <p className="text-slate-500">{selectedRoom.name} • {activeRatePlan.planName}</p>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900">{checkInDate} to {checkOutDate}</span>
                <p className="text-slate-500">{totalNights} Night(s) • {roomsCount} Room(s)</p>
              </div>
            </div>

            {/* Primary Guest Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Primary Guest Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Title</label>
                  <select
                    value={guestProfile.title}
                    onChange={(e) => setGuestProfile({ ...guestProfile, title: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>

                <div className="sm:col-span-1 space-y-1">
                  <label className="font-bold text-slate-700">First Name</label>
                  <input
                    type="text"
                    value={guestProfile.firstName}
                    onChange={(e) => setGuestProfile({ ...guestProfile, firstName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Last Name</label>
                  <input
                    type="text"
                    value={guestProfile.lastName}
                    onChange={(e) => setGuestProfile({ ...guestProfile, lastName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Mobile Number (SMS / WhatsApp Voucher)</label>
                  <input
                    type="text"
                    value={guestProfile.mobile}
                    onChange={(e) => setGuestProfile({ ...guestProfile, mobile: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Email Address (E-Ticket &amp; Invoice)</label>
                  <input
                    type="email"
                    value={guestProfile.email}
                    onChange={(e) => setGuestProfile({ ...guestProfile, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Guest Nationality</label>
                  <select
                    value={guestProfile.nationality}
                    onChange={(e) => setGuestProfile({ ...guestProfile, nationality: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="Indian">Indian Citizen (Domestic)</option>
                    <option value="International">International Guest (Foreign National)</option>
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-slate-700">Government ID Document</label>
                  <div className="flex gap-2">
                    <select
                      value={guestProfile.idDocumentType}
                      onChange={(e) => setGuestProfile({ ...guestProfile, idDocumentType: e.target.value as any })}
                      className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-xs"
                    >
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Passport">Passport</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="Driving License">Driving License</option>
                    </select>
                    <input
                      type="text"
                      value={guestProfile.idDocumentNumber}
                      onChange={(e) => setGuestProfile({ ...guestProfile, idDocumentNumber: e.target.value })}
                      placeholder="Enter ID Number / Last 4 Digits"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Room & Guest Allocation */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                Room &amp; Guest Allocation ({roomsCount} Room{roomsCount > 1 ? "s" : ""})
              </h3>

              <div className="space-y-3">
                {roomAllocations.map((alloc, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>Room {alloc.roomNumber} ({selectedRoom.name})</span>
                      <span className="text-[11px] text-slate-500">{alloc.adultsCount} Adult(s)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Bed Preference</label>
                        <select
                          value={alloc.bedPreference}
                          onChange={(e) => {
                            const updated = [...roomAllocations];
                            updated[idx].bedPreference = e.target.value as any;
                            setRoomAllocations(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900"
                        >
                          <option value="King Bed">1 Large King Bed</option>
                          <option value="Twin Beds">2 Separate Twin Beds</option>
                          <option value="No Preference">No Preference</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Smoking Preference</label>
                        <select
                          value={alloc.smokingPreference}
                          onChange={(e) => {
                            const updated = [...roomAllocations];
                            updated[idx].smokingPreference = e.target.value as any;
                            setRoomAllocations(updated);
                          }}
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1.5 font-bold text-slate-900"
                        >
                          <option value="Non-Smoking">Non-Smoking Room</option>
                          <option value="Smoking">Designated Smoking Room</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700">Extra Rollaway Bed</label>
                        <div className="flex items-center gap-2 pt-1">
                          <input
                            type="checkbox"
                            checked={alloc.extraBedRequested}
                            onChange={(e) => {
                              const updated = [...roomAllocations];
                              updated[idx].extraBedRequested = e.target.checked;
                              setRoomAllocations(updated);
                            }}
                            className="w-4 h-4 rounded text-indigo-600"
                          />
                          <span className="text-slate-600 font-medium">Request Extra Bed (+₹1,200/night)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Requests & Emergency Contact */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Special Preferences &amp; Requests</h4>
                <textarea
                  value={guestProfile.customRequestNote}
                  onChange={(e) => setGuestProfile({ ...guestProfile, customRequestNote: e.target.value })}
                  placeholder="E.g., High floor, early check-in, honeymoon celebration cake..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-medium text-slate-900"
                />
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-bold text-slate-900">Emergency Contact Person</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={guestProfile.emergencyContact.name}
                    onChange={(e) =>
                      setGuestProfile({
                        ...guestProfile,
                        emergencyContact: { ...guestProfile.emergencyContact, name: e.target.value },
                      })
                    }
                    placeholder="Contact Name"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  />
                  <input
                    type="text"
                    value={guestProfile.emergencyContact.phone}
                    onChange={(e) =>
                      setGuestProfile({
                        ...guestProfile,
                        emergencyContact: { ...guestProfile.emergencyContact, phone: e.target.value },
                      })
                    }
                    placeholder="Contact Phone"
                    className="bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Corporate GST Claim Option */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={guestProfile.isGstInvoiceRequested}
                  onChange={(e) => setGuestProfile({ ...guestProfile, isGstInvoiceRequested: e.target.checked })}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span className="font-bold text-slate-900">I want a GST Tax Invoice for Business Tax Input Credit</span>
              </div>

              {guestProfile.isGstInvoiceRequested && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-in fade-in">
                  <input
                    type="text"
                    value={guestProfile.gstDetails?.companyName}
                    onChange={(e) =>
                      setGuestProfile({
                        ...guestProfile,
                        gstDetails: { ...guestProfile.gstDetails!, companyName: e.target.value },
                      })
                    }
                    placeholder="Company Registered Legal Name"
                    className="bg-white border border-slate-200 rounded-xl p-2.5 font-medium"
                  />
                  <input
                    type="text"
                    value={guestProfile.gstDetails?.gstin}
                    onChange={(e) =>
                      setGuestProfile({
                        ...guestProfile,
                        gstDetails: { ...guestProfile.gstDetails!, gstin: e.target.value },
                      })
                    }
                    placeholder="15-digit GSTIN (e.g. 07AAACB1234F1Z8)"
                    className="bg-white border border-slate-200 rounded-xl p-2.5 font-medium uppercase"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: REVIEW BOOKING & PAYMENT */}
        {/* ========================================================================= */}
        {currentStep === "payment" && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Payment Methods Selection */}
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  Select Secure Payment Method
                </h3>

                <div className="space-y-3">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod("UPI")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "UPI" ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input type="radio" checked={paymentMethod === "UPI"} readOnly className="text-indigo-600" />
                        <span className="text-xs font-black text-slate-900">Instant UPI (GPay / PhonePe / Paytm / BHIM)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        ⚡ Zero Extra Fee
                      </span>
                    </div>

                    {paymentMethod === "UPI" && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2 text-xs">
                        <label className="font-bold text-slate-700">Enter Virtual Payment Address (UPI ID):</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={upiIdInput}
                            onChange={(e) => setUpiIdInput(e.target.value)}
                            placeholder="username@bank"
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-900"
                          />
                          <button
                            type="button"
                            className="px-3 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs"
                          >
                            Verify VPA
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Credit / Debit Card */}
                  <div
                    onClick={() => setPaymentMethod("CARD")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "CARD" ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input type="radio" checked={paymentMethod === "CARD"} readOnly className="text-indigo-600" />
                        <span className="text-xs font-black text-slate-900">Credit / Debit Card (Visa, Mastercard, RuPay)</span>
                      </div>
                      <span className="text-xs text-slate-400">All Banks Supported</span>
                    </div>
                  </div>

                  {/* Net Banking */}
                  <div
                    onClick={() => setPaymentMethod("NETBANKING")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "NETBANKING" ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input type="radio" checked={paymentMethod === "NETBANKING"} readOnly className="text-indigo-600" />
                        <span className="text-xs font-black text-slate-900">Net Banking (SBI, HDFC, ICICI, Axis, PNB)</span>
                      </div>
                      <span className="text-xs text-slate-400">Direct Gateway</span>
                    </div>
                  </div>

                  {/* BharatYatra Wallet */}
                  <div
                    onClick={() => setPaymentMethod("WALLET")}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      paymentMethod === "WALLET" ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input type="radio" checked={paymentMethod === "WALLET"} readOnly className="text-indigo-600" />
                        <span className="text-xs font-black text-slate-900">BharatYatra Wallet Balance (₹2,450 Available)</span>
                      </div>
                      <span className="text-xs text-emerald-600 font-bold">Instant 1-Click Debit</span>
                    </div>
                  </div>

                  {/* Pay at Hotel if eligible */}
                  {property.payAtHotel && (
                    <div
                      onClick={() => setPaymentMethod("PAY_AT_HOTEL")}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        paymentMethod === "PAY_AT_HOTEL" ? "border-indigo-600 bg-indigo-50/20" : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input type="radio" checked={paymentMethod === "PAY_AT_HOTEL"} readOnly className="text-indigo-600" />
                          <span className="text-xs font-black text-slate-900">Pay at Hotel on Check-in (Zero Advance)</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-black">
                          Guaranteed Booking
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Itemized Price Summary & Coupon Application */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 text-xs">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Booking &amp; Price Breakdown</h4>

                  {/* Applied Coupon Field */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-700">Promo Code / Coupon:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCouponInput || appliedCouponCode}
                        onChange={(e) => setCustomCouponInput(e.target.value)}
                        placeholder="Enter Coupon Code"
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-900 uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(customCouponInput || appliedCouponCode)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[10px] text-rose-600 font-bold">{couponError}</p>}
                  </div>

                  {/* YatraCoins Checkbox */}
                  <div className="flex items-center justify-between py-2 border-y border-slate-200">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={useYatraCoins}
                        onChange={(e) => setUseYatraCoins(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600"
                      />
                      <span className="text-slate-700 font-semibold">Redeem 480 YatraCoins (₹480)</span>
                    </div>
                    <span className="text-emerald-700 font-bold">-₹480</span>
                  </div>

                  {/* Price Line Items */}
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Room Price ({roomsCount} × ₹{priceBreakdown.baseRoomRatePerNight.toLocaleString("en-IN")} × {totalNights}n):</span>
                      <span className="font-bold text-slate-900">₹{priceBreakdown.grossRoomAmount.toLocaleString("en-IN")}</span>
                    </div>

                    {priceBreakdown.extraBedCharges > 0 && (
                      <div className="flex justify-between">
                        <span>Extra Bed Charges:</span>
                        <span className="font-bold text-slate-900">+₹{priceBreakdown.extraBedCharges.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    {priceBreakdown.couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Discount ({appliedCouponCode}):</span>
                        <span>-₹{priceBreakdown.couponDiscount.toLocaleString("en-IN")}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>GST Taxes ({priceBreakdown.gstRatePercent}% SAC 996311):</span>
                      <span className="font-bold text-slate-900">+₹{priceBreakdown.taxGstAmount.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Hotel &amp; Service Charges (2%):</span>
                      <span className="font-bold text-slate-900">+₹{priceBreakdown.serviceCharges.toLocaleString("en-IN")}</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Platform Convenience Fee:</span>
                      <span className="font-bold text-emerald-700">FREE</span>
                    </div>
                  </div>

                  {/* Total Final Amount */}
                  <div className="pt-3 border-t-2 border-slate-300 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs text-slate-500 uppercase font-black">Total Payable:</span>
                      <p className="text-[10px] text-slate-400">Includes all taxes &amp; charges</p>
                    </div>
                    <span className="text-2xl font-black text-slate-900">
                      ₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: CONFIRMATION & HOTEL DIGITAL VOUCHER */}
        {/* ========================================================================= */}
        {currentStep === "confirmed" && confirmedBookingData && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-6 text-center space-y-2 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-emerald-950">Hotel Booking Confirmed!</h3>
              <p className="text-xs text-emerald-800">
                Your reservation at <span className="font-bold">{property.name}</span> is confirmed and synchronized with property front desk.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
                <span className="px-3 py-1 bg-white border border-emerald-300 rounded-xl font-bold text-slate-900">
                  Universal Booking ID: <span className="text-indigo-600">{confirmedBookingData.pnr}</span>
                </span>
                <span className="px-3 py-1 bg-white border border-emerald-300 rounded-xl font-bold text-slate-900">
                  Hotel Confirmation No: <span className="text-emerald-700">{confirmedBookingData.hotelConfirmationNumber}</span>
                </span>
              </div>
            </div>

            {/* Official Hotel Voucher & QR Code Card */}
            <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 space-y-6 shadow-xl relative overflow-hidden">
              <div className="flex flex-wrap items-center justify-between border-b border-slate-200 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-2xl bg-indigo-600 text-white font-black">
                    <Building2 className="w-6 h-6" />
                  </span>
                  <div>
                    <h4 className="text-base font-black text-slate-900">{property.name}</h4>
                    <p className="text-xs text-slate-500">{property.address}, {property.city} ({property.landmark})</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-xl">
                    ✓ CONFIRMED &amp; GUARANTEED
                  </span>
                </div>
              </div>

              {/* Grid of Key Voucher Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Check-In:</span>
                  <p className="font-black text-slate-900">{checkInDate}</p>
                  <p className="text-slate-500">{property.policies.checkInTime}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Check-Out:</span>
                  <p className="font-black text-slate-900">{checkOutDate}</p>
                  <p className="text-slate-500">{property.policies.checkOutTime}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Room &amp; Meal Plan:</span>
                  <p className="font-black text-slate-900">{selectedRoom.name}</p>
                  <p className="text-indigo-600 font-bold">{activeRatePlan.planName}</p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Primary Guest:</span>
                  <p className="font-black text-slate-900">{guestProfile.title} {guestProfile.firstName} {guestProfile.lastName}</p>
                  <p className="text-slate-500">{guestProfile.mobile}</p>
                </div>
              </div>

              {/* Scannable Check-in QR */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-xs">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block">Contactless Express Hotel Check-In QR</span>
                    <p className="text-[11px] text-slate-500 max-w-sm">
                      Present this QR voucher and matching government ID ({guestProfile.idDocumentType}) at hotel front desk for instant keycard handover.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => alert(`Downloading Hotel Voucher & Tax Invoice PDF for ${confirmedBookingData.pnr}...`)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Voucher &amp; Invoice</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL FOOTER: ACTION CONTROLS */}
        {/* ========================================================================= */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
          {currentStep === "details" && (
            <>
              <div>
                <span className="text-xs text-slate-500 block">Total for {totalNights} Night(s) ({roomsCount} Room):</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">
                    ₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400">Incl. taxes &amp; fees</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep("guest_profile")}
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 ${theme.btnBg}`}
                >
                  <span>Proceed to Guest Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {currentStep === "guest_profile" && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep("details")}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Overview</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <span className="text-[11px] text-slate-500 block">Payable:</span>
                  <span className="text-base font-black text-slate-900">₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep("payment")}
                  className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 ${theme.btnBg}`}
                >
                  <span>Review &amp; Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {currentStep === "payment" && (
            <>
              <button
                type="button"
                onClick={() => setCurrentStep("guest_profile")}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Guest Details</span>
              </button>

              <button
                type="button"
                onClick={handleProcessBooking}
                disabled={isProcessingPayment}
                className={`px-8 py-3 rounded-xl text-white text-xs font-black shadow-lg transition-all flex items-center gap-2 ${
                  isProcessingPayment ? "opacity-75 cursor-not-allowed bg-slate-700" : theme.btnBg
                }`}
              >
                {isProcessingPayment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Confirming with Hotel Engine...</span>
                  </>
                ) : (
                  <>
                    <span>Pay ₹{priceBreakdown.finalPayableAmount.toLocaleString("en-IN")} &amp; Confirm</span>
                    <ShieldCheck className="w-4 h-4" />
                  </>
                )}
              </button>
            </>
          )}

          {currentStep === "confirmed" && (
            <div className="w-full flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
              >
                View in Central My Trips
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
