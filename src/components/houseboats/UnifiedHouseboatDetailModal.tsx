import React, { useState, useMemo } from "react";
import {
  X,
  Ship,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Users,
  Utensils,
  Navigation,
  Compass,
  Calendar,
  Waves,
  CreditCard,
  QrCode,
  FileCheck,
  Info,
  ChevronRight,
  ChevronLeft,
  Anchor,
  Sun,
  BedDouble,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  Check,
  Percent,
  Coins,
  Receipt,
  Download,
  Printer,
  FileText,
  AlertTriangle,
  LifeBuoy,
  Eye,
  Camera,
  Share2,
  Heart,
  Plus,
  Minus,
  Fish,
  Coffee,
  HelpCircle,
} from "lucide-react";
import {
  HouseboatItem,
  HouseboatCabin,
  HouseboatPackage,
  HouseboatExperienceActivity,
  HouseboatPriceCalculation,
  BookingItem,
} from "../../types";
import { HOUSEBOAT_EXPERIENCE_ACTIVITIES } from "../../data/houseboatData";

interface UnifiedHouseboatDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseboat: HouseboatItem;
  onBookSuccess: (booking: BookingItem) => void;
  onOpenOperatorPortal?: () => void;
}

export function UnifiedHouseboatDetailModal({
  isOpen,
  onClose,
  houseboat,
  onBookSuccess,
  onOpenOperatorPortal,
}: UnifiedHouseboatDetailModalProps) {
  if (!isOpen) return null;

  // Visual & Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [is360TourMode, setIs360TourMode] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  // Profile Tab state
  const [activeProfileTab, setActiveProfileTab] = useState<
    | "overview"
    | "cabins"
    | "packages"
    | "dining"
    | "activities"
    | "routes"
    | "policies"
    | "reviews"
    | "contact"
  >("overview");

  // Booking Flow Step State (1 through 7)
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);

  // STEP 1: Journey & Stay Details
  const [selectedRoute, setSelectedRoute] = useState(houseboat.routes[0]);
  const [selectedPackage, setSelectedPackage] = useState<HouseboatPackage>(houseboat.packages[0]);
  const [checkInDate, setCheckInDate] = useState("2026-09-15");
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);

  // STEP 2: Accommodation Selection
  const [charterType, setCharterType] = useState<"Private Charter (Full Boat)" | "Sharing Cabin">(
    houseboat.charterType === "Private Houseboat" ? "Private Charter (Full Boat)" : "Sharing Cabin"
  );
  const [selectedCabin, setSelectedCabin] = useState<HouseboatCabin>(houseboat.cabins[0]);
  const [cabinsCount, setCabinsCount] = useState(1);
  const [acTimingOption, setAcTimingOption] = useState<"24 Hours Full AC" | "9 PM to 6 AM Night AC">(
    "24 Hours Full AC"
  );

  // STEP 3: Food & Experience Add-ons
  const [mealPreference, setMealPreference] = useState<
    "Non-Veg (Authentic Karimeen Fish & Chicken)" | "Pure Vegetarian & Jain Sadhya" | "Kashmiri Wazwan & Kahwa" | "Goan Coastal Gourmet"
  >("Non-Veg (Authentic Karimeen Fish & Chicken)");
  const [isSpecialSeafoodUpgrade, setIsSpecialSeafoodUpgrade] = useState(false); // Jumbo Tiger Prawns
  const [selectedActivities, setSelectedActivities] = useState<string[]>(["act-canoe-village"]);

  // STEP 4: Guest Profile & GST
  const [guestProfile, setGuestProfile] = useState({
    title: "Mr.",
    fullName: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    phone: "+91 98450 11223",
    nationality: "Indian",
    idType: "Aadhaar Card",
    idNumber: "XXXX-XXXX-8921",
    specialRequests: "Anniversary flower decoration on upper deck",
    isGstInvoiceRequested: false,
    gstDetails: {
      gstin: "32AABCR9912E1Z8",
      companyName: "Kerala Backwater Voyages Pvt Ltd",
      companyAddress: "M.G. Road, Ernakulam, Kerala 682016",
    },
  });

  // STEP 5: Pricing, Loyalty & Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string>("HOUSEBOAT20");
  const [couponDiscountVal, setCouponDiscountVal] = useState<number>(1000);
  const [useYatraCoins, setUseYatraCoins] = useState(true);
  const coinsDiscountVal = useYatraCoins ? 350 : 0;

  // STEP 6: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "CARD" | "NET_BANKING" | "WALLET" | "PAY_AT_JETTY"
  >("UPI");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // STEP 7: Confirmed Booking Output
  const [completedBooking, setCompletedBooking] = useState<BookingItem | null>(null);

  // Price Calculation Engine
  const priceBreakdown: HouseboatPriceCalculation = useMemo(() => {
    // Base tariff calculation
    let baseCharterTariff = selectedPackage?.startingPrice || selectedCabin?.pricePerNight || houseboat.startingPricePerNight;
    
    // Multi-cabin multiplier if sharing
    const accommodationCharges = charterType === "Private Charter (Full Boat)" 
      ? baseCharterTariff 
      : (selectedCabin?.pricePerNight || 8500) * cabinsCount;

    // Extra guest charges (beyond 2 adults per cabin)
    const totalGuests = adultsCount + childrenCount;
    const baseIncludedGuests = charterType === "Private Charter (Full Boat)" ? (houseboat.totalBedrooms * 2) : (cabinsCount * 2);
    const extraGuests = Math.max(0, totalGuests - baseIncludedGuests);
    const guestCharges = extraGuests * 1800; // Extra bed & food charge

    // Meal upgrades (e.g. Jumbo Tiger prawns)
    const mealUpgradeCharges = isSpecialSeafoodUpgrade ? 750 * totalGuests : 0;

    // Experience activities calculation
    const activityCharges = selectedActivities.reduce((sum, actId) => {
      const act = HOUSEBOAT_EXPERIENCE_ACTIVITIES.find((a) => a.id === actId);
      return sum + (act ? act.price : 0);
    }, 0);

    const subtotal = accommodationCharges + guestCharges + mealUpgradeCharges + activityCharges;
    const totalDiscounts = couponDiscountVal + coinsDiscountVal;
    const taxableAmount = Math.max(0, subtotal - totalDiscounts);

    // GST at 12% for Houseboat stays (SAC 996311 / 996412)
    const gstRate = 12;
    const gstAmount = Math.round(taxableAmount * (gstRate / 100));
    const portSafetyLevy = 250; // Mandatory Port Authority Green Fee
    const convenienceFee = 0; // Transparent zero fee
    const finalPayable = taxableAmount + gstAmount + portSafetyLevy;

    return {
      baseCharterTariff,
      cruiseDurationHours: 21,
      nightsCount: 1,
      charterTypeSelected: charterType,
      cabinsCount,
      grossAccommodationCharges: accommodationCharges,
      guestCharges,
      mealUpgradeCharges,
      activityCharges,
      transferCharges: 0,
      subtotal,
      couponDiscount: couponDiscountVal,
      coinsDiscount: coinsDiscountVal,
      taxableAmount,
      gstRate,
      gstAmount,
      portSafetyLevy,
      convenienceFee,
      finalPayable,
    };
  }, [
    selectedPackage,
    selectedCabin,
    houseboat,
    charterType,
    cabinsCount,
    adultsCount,
    childrenCount,
    isSpecialSeafoodUpgrade,
    selectedActivities,
    couponDiscountVal,
    coinsDiscountVal,
  ]);

  const handleApplyCoupon = (code: string) => {
    if (code.toUpperCase() === "HOUSEBOAT20" || code.toUpperCase() === "KERALAMAGIC") {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscountVal(1200);
    } else if (code.toUpperCase() === "DALPALACE") {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscountVal(800);
    } else {
      setAppliedCoupon(code.toUpperCase());
      setCouponDiscountVal(500);
    }
  };

  const handleToggleActivity = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Step 6 to Step 7: Finalize Booking
  const handleExecutePayment = () => {
    setIsProcessingPayment(true);

    const bookingId = `HBK-${Date.now().toString().slice(-6)}`;
    const pnrRef = `HB-${Math.floor(100000 + Math.random() * 900000)}`;

    const newBooking: BookingItem = {
      id: bookingId,
      serviceType: "houseboats",
      provider: houseboat.operatorName,
      title: `${houseboat.name} (${selectedPackage.title})`,
      status: "confirmed",
      date: checkInDate,
      returnDate: "2026-09-16",
      amount: priceBreakdown.finalPayable,
      fromLocation: selectedRoute.startPoint,
      toLocation: selectedRoute.endPoint,
      pnr: pnrRef,
      passengersCount: adultsCount + childrenCount,
      seatOrRoomInfo: `${charterType} • ${cabinsCount} Cabin(s) • ${selectedPackage.mealPlanIncluded}`,
      paymentSummary: {
        baseFare: priceBreakdown.grossAccommodationCharges,
        taxesAndGst: priceBreakdown.gstAmount + priceBreakdown.portSafetyLevy,
        convenienceFee: 0,
        discountApplied: priceBreakdown.couponDiscount + priceBreakdown.coinsDiscount,
        totalAmount: priceBreakdown.finalPayable,
        paymentMode: paymentMethod,
        paymentStatus: paymentMethod === "PAY_AT_JETTY" ? "PAY_AT_HOTEL" : "PAID",
        transactionRef: `TXN-HB-${Date.now()}`,
        paidAt: new Date().toISOString(),
      },
      gstInvoice: {
        invoiceNumber: `INV-SAC996412-${Date.now().toString().slice(-6)}`,
        sacCode: "996412",
        legalEntity: "Inland Vessel & Backwater Cruise Accommodation Services",
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
    };

    setTimeout(() => {
      setCompletedBooking(newBooking);
      onBookSuccess(newBooking);
      setIsProcessingPayment(false);
      setBookingStep(7);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[94vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-cyan-950 via-teal-950 to-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
              <Ship className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-500/30 text-cyan-200 border border-cyan-400/40">
                  {houseboat.category} Tier • {houseboat.stayType}
                </span>
                <span className="text-[10px] font-mono text-cyan-200">
                  {houseboat.portRegistrationNumber}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white line-clamp-1">
                {houseboat.name}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenOperatorPortal && (
              <button
                onClick={onOpenOperatorPortal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/30 text-cyan-200 text-xs font-bold transition-all"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Operator PMS</span>
              </button>
            )}

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2 rounded-xl transition-all ${
                isFavorite
                  ? "bg-rose-500/30 text-rose-300 border border-rose-400/40"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? "fill-rose-400" : ""}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Content Container */}
        <div className="flex-1 overflow-y-auto">
          {/* Top Mode Toggle: Explorer Profile View vs 7-Step Booking Flow */}
          <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsBookingMode(false)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  !isBookingMode
                    ? "bg-cyan-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Houseboat Profile &amp; Specs</span>
              </button>

              <button
                onClick={() => setIsBookingMode(true)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  isBookingMode
                    ? "bg-cyan-700 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Cruise &amp; Cabins (7 Steps)</span>
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-amber-600 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {houseboat.rating} ({houseboat.reviewsCount} verified reviews)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">
                Starting from <strong className="text-cyan-950">₹{houseboat.startingPricePerNight.toLocaleString("en-IN")}</strong>
              </span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIEW A: HOUSEBOAT EXPLORER PROFILE (10 Comprehensive Modules)             */}
          {/* ========================================================================= */}
          {!isBookingMode ? (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Media Carousel / 360 Degree Virtual Tour */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg aspect-21/9 bg-slate-900">
                {!is360TourMode ? (
                  <>
                    <img
                      src={houseboat.gallery[activeImageIndex] || houseboat.image}
                      alt={houseboat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {/* Carousel Navigators */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex flex-col justify-between p-4">
                      <div className="flex justify-between items-center">
                        <span className="px-3 py-1 rounded-full bg-slate-950/70 text-cyan-300 text-xs font-bold backdrop-blur-xs border border-cyan-400/30 flex items-center gap-1.5">
                          <Anchor className="w-3.5 h-3.5" /> {houseboat.destination} • {houseboat.waterbody}
                        </span>

                        <button
                          onClick={() => setIs360TourMode(true)}
                          className="px-3 py-1 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg transition-all"
                        >
                          <Camera className="w-3.5 h-3.5" /> 360° Virtual Deck Tour
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-white">
                          <h3 className="text-lg font-black">{houseboat.name}</h3>
                          <p className="text-xs text-cyan-200">
                            {houseboat.totalBedrooms} Luxury Bedrooms • {houseboat.crewCount} Dedicated Crew Members (Captain, Master Chef &amp; Deckmaster)
                          </p>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-xl backdrop-blur-xs">
                          {houseboat.gallery.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveImageIndex(idx)}
                              className={`w-10 h-7 rounded-lg overflow-hidden border transition-all ${
                                activeImageIndex === idx ? "border-cyan-400 scale-105" : "border-transparent opacity-60"
                              }`}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  /* 360 Degree Panoramic Simulation */
                  <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-r from-teal-950 via-cyan-950 to-slate-950 p-6 text-white text-center">
                    <div className="space-y-3 max-w-md">
                      <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center animate-pulse">
                        <Camera className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black">Interactive 360° Upper Sun Deck &amp; Saloon</h4>
                      <p className="text-xs text-slate-300">
                        Simulating active 360° panoramic view of Vembanad Lake horizon, teak wood dining saloon, and glass-paneled master suites.
                      </p>
                      <button
                        onClick={() => setIs360TourMode(false)}
                        className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold border border-slate-600"
                      >
                        Exit 360° Mode
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Navigation Tabs (10 Modules) */}
              <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "overview", label: "Overview", icon: Info },
                  { id: "cabins", label: "Cabins & Decks", icon: BedDouble },
                  { id: "packages", label: "Cruise Packages", icon: Sparkles },
                  { id: "dining", label: "Culinary & Meals", icon: Utensils },
                  { id: "activities", label: "Canal Activities", icon: Waves },
                  { id: "routes", label: "Route & Map", icon: MapPin },
                  { id: "policies", label: "Safety & Policies", icon: ShieldCheck },
                  { id: "reviews", label: "Guest Reviews", icon: Star },
                  { id: "contact", label: "Captain Desk", icon: Phone },
                ].map((t) => {
                  const Icon = t.icon;
                  const isActive = activeProfileTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveProfileTab(t.id as any)}
                      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-cyan-900 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab 1: OVERVIEW */}
              {activeProfileTab === "overview" && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-4">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="text-sm font-black text-slate-900">Vessel Description &amp; Architecture</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {houseboat.boatTypeDescription ||
                            "Handcrafted Kettuvallam with seasoned Anjili timber, tied with natural coir ropes without a single iron nail. Featuring luxurious panoramic glass lounge, 24-hour central air-conditioning, and expansive upper viewing sun deck."}
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-cyan-700" /> Key Luxury Highlights
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                          {houseboat.amenities.map((item, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Quick Specs Sidebar */}
                    <div className="p-5 rounded-2xl bg-cyan-950 text-white space-y-4 shadow-md">
                      <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300">
                        Vessel Profile Card
                      </h4>
                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between border-b border-cyan-900 pb-1.5">
                          <span className="text-cyan-300">Charter Type</span>
                          <span className="font-bold">{houseboat.charterType}</span>
                        </div>
                        <div className="flex justify-between border-b border-cyan-900 pb-1.5">
                          <span className="text-cyan-300">Bedrooms Count</span>
                          <span className="font-bold">{houseboat.totalBedrooms} Luxury Bedrooms</span>
                        </div>
                        <div className="flex justify-between border-b border-cyan-900 pb-1.5">
                          <span className="text-cyan-300">Max Guest Capacity</span>
                          <span className="font-bold">{houseboat.maxGuestCapacity || 9} Passengers</span>
                        </div>
                        <div className="flex justify-between border-b border-cyan-900 pb-1.5">
                          <span className="text-cyan-300">Port Registration</span>
                          <span className="font-mono font-bold text-cyan-200">{houseboat.portRegistrationNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-cyan-300">Safety Class</span>
                          <span className="font-bold text-emerald-400">IRS Level 1 Certified</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setIsBookingMode(true);
                          setBookingStep(1);
                        }}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
                      >
                        <span>Reserve this Houseboat</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: CABINS & DECKS */}
              {activeProfileTab === "cabins" && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="text-sm font-black text-slate-900">Bedrooms, Suites &amp; Upper Deck Lounge</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {houseboat.cabins.map((cabin) => (
                      <div
                        key={cabin.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3"
                      >
                        <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-900 relative">
                          <img
                            src={cabin.image}
                            alt={cabin.name}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-slate-950/80 text-cyan-300 text-[10px] font-bold backdrop-blur-xs">
                            {cabin.type}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-black text-slate-900 text-sm">{cabin.name}</h5>
                            <span className="text-xs text-slate-500">{cabin.bedType} • Max {cabin.capacity} Guests</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-cyan-900 block">
                              ₹{cabin.pricePerNight.toLocaleString("en-IN")}
                            </span>
                            <span className="text-[10px] text-slate-400">per night</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                          {cabin.features.map((f, i) => (
                            <span key={i} className="flex items-center gap-1">
                              <Check className="w-3 h-3 text-cyan-600 shrink-0" /> {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Deck Facilities Breakdown */}
                  {houseboat.deckFacilities && (
                    <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-2">
                      <h5 className="text-xs font-black text-cyan-950 uppercase flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-cyan-700" /> Deck &amp; Open Air Saloon Facilities
                      </h5>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-cyan-900">
                        {houseboat.deckFacilities.map((df, idx) => (
                          <span key={idx} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-cyan-700" /> {df}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: PACKAGES */}
              {activeProfileTab === "packages" && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="text-sm font-black text-slate-900">Curated Cruise Packages &amp; Timings</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {houseboat.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4 hover:border-cyan-400 transition-all shadow-xs"
                      >
                        <div className="space-y-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[10px] font-black uppercase">
                            {pkg.type}
                          </span>
                          <h5 className="font-black text-slate-900 text-sm">{pkg.title}</h5>
                          <p className="text-xs text-slate-600 leading-relaxed">{pkg.description}</p>

                          <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-200">
                            <div><strong className="text-slate-900">Boarding:</strong> {pkg.checkInTime}</div>
                            <div><strong className="text-slate-900">Disembark:</strong> {pkg.checkOutTime}</div>
                            <div><strong className="text-slate-900">Cruising Time:</strong> {pkg.cruiseHours}</div>
                            <div><strong className="text-slate-900">Meal Plan:</strong> {pkg.mealPlanIncluded}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-lg font-black text-cyan-950 mb-2">
                            ₹{pkg.startingPrice.toLocaleString("en-IN")}{" "}
                            <span className="text-xs font-normal text-slate-500">base</span>
                          </div>
                          <button
                            onClick={() => {
                              setSelectedPackage(pkg);
                              setIsBookingMode(true);
                              setBookingStep(1);
                            }}
                            className="w-full py-2 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs"
                          >
                            Select this Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: CULINARY & MEALS */}
              {activeProfileTab === "dining" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                    <h4 className="text-sm font-black text-amber-950 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-amber-700" /> Traditional Master Chef Gastronomy
                    </h4>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      Every meal is prepared fresh on board inside our stainless steel marine galley. Featuring organic spices, locally caught Pearl Spot fish (Karimeen), Kuttanad duck roast, and vegetarian banana leaf feast.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {houseboat.diningHighlights.map((item, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                        <Fish className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-slate-800">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: CANAL ACTIVITIES */}
              {activeProfileTab === "activities" && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="text-sm font-black text-slate-900">Backwater &amp; Village Canal Experiences</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {HOUSEBOAT_EXPERIENCE_ACTIVITIES.map((act) => (
                      <div
                        key={act.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          {act.highlightTag && (
                            <span className="px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800 text-[10px] font-black uppercase">
                              {act.highlightTag}
                            </span>
                          )}
                          <h5 className="font-bold text-slate-900 text-xs">{act.name}</h5>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{act.description}</p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <span className="text-xs font-black text-cyan-900">₹{act.price}</span>
                          <span className="text-[10px] text-slate-500">{act.duration}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 6: ROUTES */}
              {activeProfileTab === "routes" && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="text-sm font-black text-slate-900">Cruising Routes, Timetable &amp; Mooring Points</h4>
                  <div className="space-y-4">
                    {houseboat.routes.map((rt) => (
                      <div key={rt.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
                          <div>
                            <h5 className="text-sm font-black text-cyan-950">{rt.name}</h5>
                            <span className="text-xs text-slate-500">
                              Boarding at: <strong>{rt.startPoint}</strong>
                            </span>
                          </div>
                          <span className="px-3 py-1 rounded-xl bg-cyan-100 text-cyan-900 font-bold text-xs">
                            {rt.cruiseDuration}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Cruise Waypoints &amp; Anchoring Schedule
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {rt.itinerary.map((step, idx) => (
                              <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-black text-cyan-700">{step.time}</span>
                                  <span className="font-bold text-slate-900 text-[11px]">{step.title}</span>
                                </div>
                                <p className="text-[11px] text-slate-600">{step.activity}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 7: POLICIES */}
              {activeProfileTab === "policies" && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="text-sm font-black text-slate-900">Safety Compliance &amp; Inland Vessel Act Rules</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h5 className="font-black text-slate-900">Check-in &amp; Check-out Timings</h5>
                      <p className="text-slate-600">
                        Boarding commences at <strong>{houseboat.policies.checkInTime}</strong>. Disembarkation next morning at <strong>{houseboat.policies.checkOutTime}</strong>.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                      <h5 className="font-black text-emerald-950">Free Cancellation Policy</h5>
                      <p className="text-emerald-900">{houseboat.policies.cancellationPolicy}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-200 space-y-2">
                      <h5 className="font-black text-cyan-950">Government Mooring Rule (5:30 PM)</h5>
                      <p className="text-cyan-900">{houseboat.policies.dockingRules}</p>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <h5 className="font-black text-slate-900">Safety &amp; IRS Life-Saving Gear</h5>
                      <p className="text-slate-600">{houseboat.policies.safetyCompliance}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 8: REVIEWS */}
              {activeProfileTab === "reviews" && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        <span>{houseboat.rating}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">Based on {houseboat.reviewsCount} customer reviews</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {houseboat.reviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 text-xs">{rev.author}</span>
                            <span className="text-[10px] text-slate-400 block">{rev.city} • {rev.tripType}</span>
                          </div>
                          <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400" /> {rev.rating}.0
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 9: CONTACT */}
              {activeProfileTab === "contact" && (
                <div className="space-y-4 animate-in fade-in">
                  <h4 className="text-sm font-black text-slate-900">Direct Captain &amp; Concierge Support Desk</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-cyan-700" />
                        <span className="font-bold text-slate-900">Captain Direct Call &amp; WhatsApp</span>
                      </div>
                      <div className="font-mono text-cyan-900 font-bold text-sm">
                        {houseboat.captainBio?.phone || "+91 94470 23819"}
                      </div>
                      <p className="text-slate-500">
                        {houseboat.captainBio?.name} (Master Inland Navigation License {houseboat.captainBio?.licenseNumber})
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-cyan-700" />
                        <span className="font-bold text-slate-900">Jetty GPS Address</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {houseboat.locationCoordinates?.jettyAddress || "Finishing Point Jetty, Punnamada, Alappuzha, Kerala 688013"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* VIEW B: 7-STEP INTERACTIVE GUEST BOOKING ENGINE                           */
            /* ========================================================================= */
            <div className="p-4 sm:p-6 space-y-6">
              {/* Stepper Progress Indicator */}
              <div className="overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center justify-between min-w-[580px] px-2">
                  {[
                    { num: 1, label: "Journey" },
                    { num: 2, label: "Boat & Cabin" },
                    { num: 3, label: "Food & Addons" },
                    { num: 4, label: "Guest ID" },
                    { num: 5, label: "Summary" },
                    { num: 6, label: "Payment" },
                    { num: 7, label: "Voucher" },
                  ].map((s, idx) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                          bookingStep === s.num
                            ? "bg-cyan-800 text-white shadow-md ring-2 ring-cyan-400 ring-offset-2"
                            : bookingStep > s.num
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        {bookingStep > s.num ? <Check className="w-4 h-4" /> : s.num}
                      </div>
                      <span
                        className={`text-xs font-bold ${
                          bookingStep === s.num ? "text-cyan-900" : "text-slate-500"
                        }`}
                      >
                        {s.label}
                      </span>
                      {idx < 6 && <div className="w-6 sm:w-10 h-0.5 bg-slate-200 mx-1" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 1: JOURNEY & STAY DETAILS */}
              {bookingStep === 1 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <h3 className="text-sm font-black text-cyan-950">Step 1: Select Date, Route &amp; Cruise Package</h3>
                    <p className="text-xs text-cyan-800">
                      Configure check-in date, preferred backwater route, and passenger counts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Boarding Date</label>
                      <input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Adults (Age 12+)</label>
                      <div className="flex items-center justify-between bg-white border border-slate-300 rounded-xl p-1">
                        <button
                          onClick={() => setAdultsCount(Math.max(1, adultsCount - 1))}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-xs text-slate-900">{adultsCount} Adults</span>
                        <button
                          onClick={() => setAdultsCount(adultsCount + 1)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                      <label className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Children (Age 5-11)</label>
                      <div className="flex items-center justify-between bg-white border border-slate-300 rounded-xl p-1">
                        <button
                          onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-black text-xs text-slate-900">{childrenCount} Kids</span>
                        <button
                          onClick={() => setChildrenCount(childrenCount + 1)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Route Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 block">Select Cruise Route:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {houseboat.routes.map((rt) => (
                        <div
                          key={rt.id}
                          onClick={() => setSelectedRoute(rt)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            selectedRoute.id === rt.id
                              ? "bg-cyan-50 border-cyan-500 ring-2 ring-cyan-200"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-black text-xs text-slate-900">{rt.name}</span>
                            <span className="text-[10px] font-bold text-cyan-800">{rt.cruiseDuration}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">From: {rt.startPoint}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Package Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 block">Select Package Type:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {houseboat.packages.map((pkg) => (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            selectedPackage.id === pkg.id
                              ? "bg-cyan-50 border-cyan-500 ring-2 ring-cyan-200"
                              : "bg-white border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="text-xs font-black text-slate-900 mb-1">{pkg.title}</div>
                          <div className="text-[10px] text-slate-500 mb-2">{pkg.cruiseHours}</div>
                          <div className="text-xs font-black text-cyan-900">
                            ₹{pkg.startingPrice.toLocaleString("en-IN")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>Proceed to Boat &amp; Cabin Selection</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ACCOMMODATION SELECTION */}
              {bookingStep === 2 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <h3 className="text-sm font-black text-cyan-950">Step 2: Choose Charter Mode &amp; Cabin Category</h3>
                    <p className="text-xs text-cyan-800">
                      Reserve the entire private houseboat or book individual luxury bedrooms.
                    </p>
                  </div>

                  {/* Charter Type Toggle */}
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      onClick={() => setCharterType("Private Charter (Full Boat)")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
                        charterType === "Private Charter (Full Boat)"
                          ? "bg-cyan-900 text-white border-cyan-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <Ship className="w-5 h-5 mx-auto mb-1.5" />
                      <div className="font-black text-xs">Private Full Boat Charter</div>
                      <p className="text-[10px] opacity-80 mt-1">Entire houseboat with all {houseboat.totalBedrooms} bedrooms exclusive to your group</p>
                    </div>

                    <div
                      onClick={() => setCharterType("Sharing Cabin")}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
                        charterType === "Sharing Cabin"
                          ? "bg-cyan-900 text-white border-cyan-700 shadow-md"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <BedDouble className="w-5 h-5 mx-auto mb-1.5" />
                      <div className="font-black text-xs">Sharing Cabin Booking</div>
                      <p className="text-[10px] opacity-80 mt-1">Book 1 or 2 private ensuite cabins while sharing upper sun deck</p>
                    </div>
                  </div>

                  {/* Cabin Category Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 block">Selected Cabin Specification:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {houseboat.cabins.map((cab) => (
                        <div
                          key={cab.id}
                          onClick={() => setSelectedCabin(cab)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                            selectedCabin.id === cab.id
                              ? "bg-cyan-50 border-cyan-500 ring-2 ring-cyan-200"
                              : "bg-white border-slate-200"
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-black text-xs text-slate-900">{cab.name}</span>
                            <span className="text-xs font-black text-cyan-900">₹{cab.pricePerNight.toLocaleString("en-IN")}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 block mt-0.5">{cab.bedType}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AC Timing Preference */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-xs font-black text-slate-900 block">Air Conditioning Mode:</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setAcTimingOption("24 Hours Full AC")}
                        className={`p-3 rounded-xl border text-left font-bold transition-all ${
                          acTimingOption === "24 Hours Full AC"
                            ? "bg-cyan-800 text-white border-cyan-700"
                            : "bg-white text-slate-700 border-slate-300"
                        }`}
                      >
                        24-Hour Full-Time AC (Day &amp; Night)
                      </button>
                      <button
                        type="button"
                        onClick={() => setAcTimingOption("9 PM to 6 AM Night AC")}
                        className={`p-3 rounded-xl border text-left font-bold transition-all ${
                          acTimingOption === "9 PM to 6 AM Night AC"
                            ? "bg-cyan-800 text-white border-cyan-700"
                            : "bg-white text-slate-700 border-slate-300"
                        }`}
                      >
                        Eco Night-Time AC (9 PM - 6 AM)
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBookingStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>Proceed to Food &amp; Add-ons</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FOOD & EXPERIENCE ADD-ONS */}
              {bookingStep === 3 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <h3 className="text-sm font-black text-cyan-950">Step 3: Meal Plan &amp; Experiential Add-ons</h3>
                    <p className="text-xs text-cyan-800">
                      Customize the master chef menu and select optional backwater canal activities.
                    </p>
                  </div>

                  {/* Meal Plan Preference */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 block">Select Culinary Menu Course:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        "Non-Veg (Authentic Karimeen Fish & Chicken)",
                        "Pure Vegetarian & Jain Sadhya",
                        "Kashmiri Wazwan & Kahwa",
                        "Goan Coastal Gourmet",
                      ].map((diet) => (
                        <div
                          key={diet}
                          onClick={() => setMealPreference(diet as any)}
                          className={`p-3.5 rounded-xl border cursor-pointer font-bold transition-all ${
                            mealPreference === diet
                              ? "bg-cyan-800 text-white border-cyan-700"
                              : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          {diet}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Special Live Grill Upgrade */}
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                    <div>
                      <span className="font-black text-xs text-amber-950 block">
                        Jumbo Tiger Prawns &amp; Live Catch Grill Upgrade
                      </span>
                      <span className="text-[11px] text-amber-800">
                        Marinated jumbo prawns &amp; crab roast served on upper deck (+₹750 per person)
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isSpecialSeafoodUpgrade}
                      onChange={(e) => setIsSpecialSeafoodUpgrade(e.target.checked)}
                      className="w-5 h-5 accent-cyan-800 cursor-pointer"
                    />
                  </div>

                  {/* Addon Activities */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-900 block">Select Experiential Addons:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {HOUSEBOAT_EXPERIENCE_ACTIVITIES.map((act) => {
                        const isSelected = selectedActivities.includes(act.id);
                        return (
                          <div
                            key={act.id}
                            onClick={() => handleToggleActivity(act.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                              isSelected
                                ? "bg-cyan-50 border-cyan-500 ring-2 ring-cyan-200"
                                : "bg-slate-50 border-slate-200 hover:border-slate-300"
                            }`}
                          >
                            <div>
                              <div className="font-bold text-xs text-slate-900">{act.name}</div>
                              <span className="text-[10px] text-slate-500">{act.duration}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-black text-cyan-900 block">+₹{act.price}</span>
                              <span className={`text-[10px] font-bold ${isSelected ? "text-cyan-700" : "text-slate-400"}`}>
                                {isSelected ? "Added" : "+ Add"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBookingStep(4)}
                      className="px-6 py-2.5 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>Proceed to Guest Profile</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: GUEST PROFILE & GOVERNMENT ID */}
              {bookingStep === 4 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <h3 className="text-sm font-black text-cyan-950">Step 4: Lead Guest Details &amp; Government ID</h3>
                    <p className="text-xs text-cyan-800">
                      Required by Inland Waterways Port Authority for vessel manifest compliance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Lead Guest Full Name</label>
                      <input
                        type="text"
                        value={guestProfile.fullName}
                        onChange={(e) => setGuestProfile({ ...guestProfile, fullName: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Mobile Contact (WhatsApp Enabled)</label>
                      <input
                        type="text"
                        value={guestProfile.phone}
                        onChange={(e) => setGuestProfile({ ...guestProfile, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Email Address for E-Voucher</label>
                      <input
                        type="email"
                        value={guestProfile.email}
                        onChange={(e) => setGuestProfile({ ...guestProfile, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-1">Government ID Type</label>
                      <select
                        value={guestProfile.idType}
                        onChange={(e) => setGuestProfile({ ...guestProfile, idType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-900 focus:outline-none"
                      >
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Passport">Passport (Foreign / NRI)</option>
                        <option value="Voter ID">Voter ID</option>
                        <option value="Driving License">Driving License</option>
                      </select>
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Special Stay / Anniversary Requests</label>
                    <input
                      type="text"
                      value={guestProfile.specialRequests}
                      onChange={(e) => setGuestProfile({ ...guestProfile, specialRequests: e.target.value })}
                      placeholder="e.g. Honeymoon floral decoration, low-spice food, baby cot"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 focus:outline-none"
                    />
                  </div>

                  {/* GST B2B Invoice Option */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-black text-xs text-slate-900 block">
                          Request GST Tax Invoice (SAC 996412 / 996311)
                        </span>
                        <span className="text-[10px] text-slate-500">Claim 12% Input Tax Credit for business travel</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={guestProfile.isGstInvoiceRequested}
                        onChange={(e) =>
                          setGuestProfile({ ...guestProfile, isGstInvoiceRequested: e.target.checked })
                        }
                        className="w-4 h-4 accent-cyan-800 cursor-pointer"
                      />
                    </div>

                    {guestProfile.isGstInvoiceRequested && (
                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                        <div>
                          <label className="text-[10px] text-slate-500 block">Company GSTIN</label>
                          <input
                            type="text"
                            value={guestProfile.gstDetails?.gstin}
                            onChange={(e) =>
                              setGuestProfile({
                                ...guestProfile,
                                gstDetails: { ...guestProfile.gstDetails!, gstin: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block">Company Legal Name</label>
                          <input
                            type="text"
                            value={guestProfile.gstDetails?.companyName}
                            onChange={(e) =>
                              setGuestProfile({
                                ...guestProfile,
                                gstDetails: { ...guestProfile.gstDetails!, companyName: e.target.value },
                              })
                            }
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5 font-bold"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setBookingStep(3)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBookingStep(5)}
                      className="px-6 py-2.5 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>Proceed to Price Summary</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: BOOKING SUMMARY & PRICING */}
              {bookingStep === 5 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <h3 className="text-sm font-black text-cyan-950">Step 5: Review Booking Summary &amp; Transparent Price Calculation</h3>
                    <p className="text-xs text-cyan-800">
                      Itemized breakdown of accommodation, meals, taxes, and promotional loyalty discounts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Stay Review Card */}
                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                      <h4 className="font-black text-slate-900 uppercase tracking-wider text-[11px]">
                        Itinerary &amp; Stay Review
                      </h4>
                      <div className="space-y-2 text-slate-700">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Houseboat:</span>
                          <span className="font-bold text-slate-900">{houseboat.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Boarding Jetty:</span>
                          <span className="font-bold">{selectedRoute.startPoint}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Boarding Date:</span>
                          <span className="font-bold text-cyan-900">{checkInDate} (12:00 PM)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Accommodation:</span>
                          <span className="font-bold">{charterType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Total Guests:</span>
                          <span className="font-bold">{adultsCount} Adults, {childrenCount} Kids</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Meal Plan:</span>
                          <span className="font-bold text-amber-800">{mealPreference}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price Breakdown Calculation */}
                    <div className="p-5 rounded-2xl bg-cyan-950 text-white space-y-3 text-xs shadow-md">
                      <h4 className="font-black text-cyan-300 uppercase tracking-wider text-[11px] flex items-center justify-between">
                        <span>Transparent Price Bill</span>
                        <Receipt className="w-4 h-4" />
                      </h4>

                      <div className="space-y-1.5 text-slate-300">
                        <div className="flex justify-between">
                          <span>Gross Accommodation Charges:</span>
                          <span className="font-mono font-bold text-white">₹{priceBreakdown.grossAccommodationCharges.toLocaleString("en-IN")}</span>
                        </div>

                        {priceBreakdown.guestCharges > 0 && (
                          <div className="flex justify-between">
                            <span>Extra Guest Surcharge:</span>
                            <span className="font-mono">₹{priceBreakdown.guestCharges.toLocaleString("en-IN")}</span>
                          </div>
                        )}

                        {priceBreakdown.mealUpgradeCharges > 0 && (
                          <div className="flex justify-between">
                            <span>Seafood Grill Upgrade:</span>
                            <span className="font-mono">₹{priceBreakdown.mealUpgradeCharges.toLocaleString("en-IN")}</span>
                          </div>
                        )}

                        {priceBreakdown.activityCharges > 0 && (
                          <div className="flex justify-between">
                            <span>Experiential Addons:</span>
                            <span className="font-mono">₹{priceBreakdown.activityCharges.toLocaleString("en-IN")}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-emerald-400">
                          <span>Promo Coupon ({appliedCoupon}):</span>
                          <span className="font-mono font-bold">-₹{priceBreakdown.couponDiscount}</span>
                        </div>

                        {useYatraCoins && (
                          <div className="flex justify-between text-emerald-400">
                            <span>YatraCoins Loyalty Redemption:</span>
                            <span className="font-mono font-bold">-₹{priceBreakdown.coinsDiscount}</span>
                          </div>
                        )}

                        <div className="flex justify-between pt-2 border-t border-cyan-900">
                          <span>GST (12% SAC 996412):</span>
                          <span className="font-mono">₹{priceBreakdown.gstAmount.toLocaleString("en-IN")}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Port Safety &amp; Green Levy:</span>
                          <span className="font-mono">₹{priceBreakdown.portSafetyLevy}</span>
                        </div>

                        <div className="flex justify-between">
                          <span>Platform Service Fee:</span>
                          <span className="font-bold text-emerald-400">₹0 (Free)</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-cyan-800 flex justify-between items-center text-sm">
                        <span className="font-black text-white">Total Amount Payable:</span>
                        <span className="font-mono font-black text-lg text-cyan-300">
                          ₹{priceBreakdown.finalPayable.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setBookingStep(4)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setBookingStep(6)}
                      className="px-6 py-2.5 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>Proceed to Payment</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 6: PAYMENT GATEWAY */}
              {bookingStep === 6 && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-200">
                    <h3 className="text-sm font-black text-cyan-950">Step 6: Select Secure Payment Gateway</h3>
                    <p className="text-xs text-cyan-800">
                      Instant UPI confirmation or Pay at Jetty on boarding day.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { id: "UPI", label: "Instant UPI (GPay, PhonePe, Paytm, QR)", icon: QrCode },
                      { id: "CARD", label: "Credit / Debit Card (Visa, Mastercard, RuPay)", icon: CreditCard },
                      { id: "NET_BANKING", label: "Net Banking (SBI, HDFC, ICICI, Axis)", icon: Navigation },
                      { id: "WALLET", label: "Travel Wallet & YatraPay", icon: Coins },
                      { id: "PAY_AT_JETTY", label: "Pay at Boat Jetty upon Boarding", icon: Anchor },
                    ].map((mode) => {
                      const Icon = mode.icon;
                      const isSelected = paymentMethod === mode.id;
                      return (
                        <div
                          key={mode.id}
                          onClick={() => setPaymentMethod(mode.id as any)}
                          className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3 transition-all ${
                            isSelected
                              ? "bg-cyan-900 text-white border-cyan-700 shadow-md"
                              : "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-5 h-5 shrink-0" />
                          <span className="font-bold text-xs">{mode.label}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-950">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-700" />
                      <span>256-Bit SSL Encrypted &amp; 100% Refund Protection Guarantee</span>
                    </div>
                    <span className="font-mono font-black text-sm">
                      ₹{priceBreakdown.finalPayable.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-200">
                    <button
                      onClick={() => setBookingStep(5)}
                      className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                    >
                      Back
                    </button>
                    <button
                      disabled={isProcessingPayment}
                      onClick={handleExecutePayment}
                      className="px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg transition-all"
                    >
                      {isProcessingPayment ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Generating Official Boarding Pass...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Confirm &amp; Pay ₹{priceBreakdown.finalPayable.toLocaleString("en-IN")}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 7: OFFICIAL BOARDING VOUCHER & CONFIRMATION */}
              {bookingStep === 7 && completedBooking && (
                <div className="space-y-6 animate-in zoom-in-95 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-1">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                      Official Houseboat Boarding Confirmed
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Welcome Aboard, {guestProfile.fullName}!
                    </h3>
                    <p className="text-xs text-slate-500">
                      Your booking is registered with Kerala Port Authority &amp; synchronized to <strong>My Trips</strong>.
                    </p>
                  </div>

                  {/* Official Voucher Card */}
                  <div className="p-6 rounded-3xl bg-slate-950 text-white text-left space-y-4 shadow-xl border border-cyan-500/30 max-w-2xl mx-auto">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-900 pb-3">
                      <div>
                        <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                          Houseboat Boarding Voucher
                        </span>
                        <h4 className="text-base font-black text-white">{houseboat.name}</h4>
                        <span className="text-xs text-cyan-200">{houseboat.operatorName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 block">Vessel PNR</span>
                        <span className="text-sm font-mono font-black text-cyan-300">{completedBooking.pnr}</span>
                        <span className="text-[10px] text-slate-400 block mt-1">Booking ID</span>
                        <span className="text-xs font-mono text-white">{completedBooking.id}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Boarding Date</span>
                        <span className="font-bold">{checkInDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Check-in Time</span>
                        <span className="font-bold text-cyan-300">12:00 PM Sharp</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Boarding Jetty</span>
                        <span className="font-bold">{selectedRoute.startPoint}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total Paid</span>
                        <span className="font-bold font-mono text-emerald-400">
                          ₹{completedBooking.amount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-cyan-950/60 border border-cyan-800 text-xs space-y-1 text-cyan-200">
                      <div className="flex items-center gap-2 font-bold text-white">
                        <LifeBuoy className="w-4 h-4 text-cyan-400" />
                        <span>Captain Contact on Board:</span>
                      </div>
                      <p>
                        {houseboat.captainBio?.name || "Captain Sasi Kumar"} ({houseboat.captainBio?.phone || "+91 94470 23819"}) • Master License {houseboat.captainBio?.licenseNumber || "KIV-MST-2011-884"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print Voucher
                    </button>

                    <button
                      onClick={onClose}
                      className="px-6 py-2 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <span>View in My Trips</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Sticky Bottom Action Bar (if in Explorer mode) */}
        {!isBookingMode && (
          <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">Starting Nightly Charter Rate</span>
              <div className="text-base sm:text-lg font-black text-slate-900">
                ₹{houseboat.startingPricePerNight.toLocaleString("en-IN")}{" "}
                <span className="text-xs text-slate-500 line-through font-normal">
                  ₹{houseboat.originalPrice.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsBookingMode(true);
                setBookingStep(1);
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-800 hover:bg-cyan-700 text-white font-black text-xs shadow-md flex items-center gap-1.5 transition-all"
            >
              <span>Instant Reserve Cruise</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
