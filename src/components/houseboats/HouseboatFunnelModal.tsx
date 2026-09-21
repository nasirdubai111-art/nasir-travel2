import React, { useState } from "react";
import {
  X,
  Ship,
  Search,
  Calendar,
  Users,
  CreditCard,
  CheckCircle2,
  FileText,
  Printer,
  Share2,
  MapPin,
  Clock,
  ShieldCheck,
  Star,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Utensils,
  BedDouble,
  Compass,
  Phone,
  Mail,
  QrCode,
  Download,
  Sparkles,
  Award,
} from "lucide-react";
import { Houseboat, HouseboatBooking } from "../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../services/travelVerticalsService";

export type HouseboatFunnelStep =
  | "customer"
  | "search"
  | "details"
  | "select_dates"
  | "guest_details"
  | "booking"
  | "payment"
  | "confirmed"
  | "ticket_invoice";

interface HouseboatFunnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedHouseboat?: Houseboat | null;
  onBookingSuccess?: (booking: HouseboatBooking) => void;
}

export function HouseboatFunnelModal({
  isOpen,
  onClose,
  preSelectedHouseboat,
  onBookingSuccess,
}: HouseboatFunnelModalProps) {
  if (!isOpen) return null;

  const houseboats = travelVerticalsService.getHouseboats();

  // Funnel Steps
  const [currentStep, setCurrentStep] = useState<HouseboatFunnelStep>(
    preSelectedHouseboat ? "details" : "customer"
  );

  // 1. Customer
  const [customer, setCustomer] = useState({
    customerId: "CUST-IN-90812",
    name: "Vikram Malhotra",
    email: "vikram.malhotra@corporate.in",
    phone: "+91 98200 44102",
    city: "Mumbai",
  });

  // 2. Search
  const [searchDestination, setSearchDestination] = useState<string>("All");
  const [searchWaterbody, setSearchWaterbody] = useState<string>("All");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 3. Details
  const [selectedHouseboat, setSelectedHouseboat] = useState<Houseboat>(
    preSelectedHouseboat || houseboats[0]
  );
  const [selectedCabin, setSelectedCabin] = useState(
    selectedHouseboat.cabins[0] || null
  );

  // 4. Select Dates
  const [checkInDate, setCheckInDate] = useState("2026-09-22");
  const [checkOutDate, setCheckOutDate] = useState("2026-09-23");
  const [totalNights, setTotalNights] = useState(1);
  const [charterType, setCharterType] = useState<
    "Exclusive Private Charter" | "Single Cabin Booking"
  >("Exclusive Private Charter");

  // 5. Guest Details
  const [adultsCount, setAdultsCount] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [guestManifest, setGuestManifest] = useState([
    {
      name: "Vikram Malhotra",
      age: 36,
      gender: "Male" as const,
      idProofType: "Aadhaar" as const,
      idProofNumber: "XXXX-XXXX-4910",
    },
    {
      name: "Sunita Malhotra",
      age: 34,
      gender: "Female" as const,
      idProofType: "Aadhaar" as const,
      idProofNumber: "XXXX-XXXX-7721",
    },
  ]);
  const [mealPlan, setMealPlan] = useState<any>(
    "Authentic Kerala Sadhya & Karimeen Fry"
  );
  const [specialRequests, setSpecialRequests] = useState(
    "Fresh flower decoration on bow sundeck"
  );

  // 6. Booking & Financials
  const baseFare =
    charterType === "Exclusive Private Charter"
      ? selectedHouseboat.startingPricePerNight * totalNights
      : (selectedCabin?.pricePerNight || 8000) * totalNights;
  const discountAmount = 1500;
  const taxAmountGst = Math.round((baseFare - discountAmount) * 0.05);
  const totalAmount = baseFare - discountAmount + taxAmountGst;

  // 7. Payment
  const [paymentMethod, setPaymentMethod] = useState<
    "UPI" | "NetBanking" | "CreditCard" | "DebitCard"
  >("UPI");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // 8 & 9. Confirmed Booking & Ticket/Invoice
  const [confirmedBooking, setConfirmedBooking] =
    useState<HouseboatBooking | null>(null);

  // Steps breadcrumb
  const STEPS_CONFIG: { step: HouseboatFunnelStep; label: string; icon: any }[] = [
    { step: "customer", label: "Customer", icon: Users },
    { step: "search", label: "Search", icon: Search },
    { step: "details", label: "Details", icon: Ship },
    { step: "select_dates", label: "Dates", icon: Calendar },
    { step: "guest_details", label: "Guests", icon: Users },
    { step: "booking", label: "Booking", icon: FileText },
    { step: "payment", label: "Payment", icon: CreditCard },
    { step: "confirmed", label: "Confirmed", icon: CheckCircle2 },
    { step: "ticket_invoice", label: "Ticket / Invoice", icon: Award },
  ];

  const filteredHouseboats = houseboats.filter((hb) => {
    if (
      searchDestination !== "All" &&
      hb.destination.toLowerCase() !== searchDestination.toLowerCase()
    )
      return false;
    if (
      searchWaterbody !== "All" &&
      hb.waterbody.toLowerCase() !== searchWaterbody.toLowerCase()
    )
      return false;
    if (searchKeyword) {
      const q = searchKeyword.toLowerCase();
      return (
        hb.name.toLowerCase().includes(q) ||
        hb.destination.toLowerCase().includes(q) ||
        hb.waterbody.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      const booking = travelVerticalsService.createHouseboatBooking({
        houseboatId: selectedHouseboat.houseboatId,
        customer,
        checkInDate,
        checkOutDate,
        totalNights,
        guestsCount: { adults: adultsCount, children: childrenCount },
        guestManifest,
        selectedCabinId: selectedCabin?.cabinId,
        selectedCabinName: selectedCabin?.name,
        charterType,
        mealPlan,
        specialRequests,
        baseFare,
        discountAmount,
        taxAmountGst,
        totalAmount,
        paymentMethod,
      });

      setConfirmedBooking(booking);
      setIsProcessingPayment(false);
      setCurrentStep("confirmed");
      if (onBookingSuccess) {
        onBookingSuccess(booking);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Relational Schema & Step Indicator */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/70 border-b border-slate-800 text-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Ship className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Houseboat Reservation &amp; Relational Engine
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    houseboats ➔ houseboat_bookings
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Relational Foreign Keys:{" "}
                  <code className="text-cyan-300 font-mono">houseboat_id</code> •{" "}
                  <code className="text-purple-300 font-mono">customer_id</code> •{" "}
                  <code className="text-amber-300 font-mono">partner_id</code> •{" "}
                  <code className="text-emerald-300 font-mono">payment_id</code>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 9-Step Funnel Breadcrumb */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-semibold">
            {STEPS_CONFIG.map((s, idx) => {
              const Icon = s.icon;
              const isActive = currentStep === s.step;
              const isPast =
                STEPS_CONFIG.findIndex((x) => x.step === currentStep) > idx;

              return (
                <div key={s.step} className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      // Only allow jumping back or to confirmed if completed
                      if (isPast || (confirmedBooking && s.step === "ticket_invoice")) {
                        setCurrentStep(s.step);
                      }
                    }}
                    disabled={!isPast && !isActive && !(confirmedBooking && s.step === "ticket_invoice")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow-md shadow-cyan-500/20"
                        : isPast
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                        : "bg-slate-950/60 text-slate-600 cursor-not-allowed"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>
                      {idx + 1}. {s.label}
                    </span>
                  </button>
                  {idx < STEPS_CONFIG.length - 1 && (
                    <ChevronRight className="w-3 h-3 text-slate-700 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Body based on Funnel Step */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60 text-slate-200">
          {/* 1. CUSTOMER */}
          {currentStep === "customer" && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Step 1: Customer Identity (`customer_id`)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Specify the primary account holder or lead passenger for this booking
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Customer ID
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={customer.customerId}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customer.email}
                    onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={customer.phone}
                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Origin City
                  </label>
                  <input
                    type="text"
                    value={customer.city}
                    onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setCurrentStep("search")}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg shadow-cyan-600/30"
                >
                  <span>Continue to Houseboat Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 2. HOUSEBOAT SEARCH */}
          {currentStep === "search" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Search className="w-4 h-4 text-cyan-400" />
                    <span>Step 2: Houseboat Search &amp; Discovery</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Filter by destination, backwater lagoon, bedrooms, or vessel name
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                  >
                    <option value="All">All Destinations</option>
                    <option value="Alleppey">Alleppey (Kerala)</option>
                    <option value="Kumarakom">Kumarakom (Kerala)</option>
                    <option value="Srinagar">Srinagar (Dal &amp; Nigeen)</option>
                  </select>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search vessel or waterbody..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {filteredHouseboats.map((hb) => (
                  <div
                    key={hb.houseboatId}
                    className={`rounded-2xl border p-4 transition-all flex flex-col justify-between ${
                      selectedHouseboat.houseboatId === hb.houseboatId
                        ? "bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/30"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="h-36 rounded-xl overflow-hidden relative">
                        <img
                          src={hb.image}
                          alt={hb.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-cyan-300 text-[10px] font-bold">
                          {hb.houseboatId}
                        </span>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{hb.rating}</span>
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm line-clamp-1">{hb.name}</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>
                            {hb.destination} • {hb.waterbody}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400 py-1.5 border-y border-slate-800/80">
                        <span>{hb.totalBedrooms} Bedrooms</span>
                        <span>•</span>
                        <span>Max {hb.maxGuests} Guests</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">Meals Inc.</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-3">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase">From</span>
                        <p className="text-sm font-bold text-white">
                          ₹{hb.startingPricePerNight.toLocaleString("en-IN")}{" "}
                          <span className="text-[10px] text-slate-400 font-normal">/night</span>
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedHouseboat(hb);
                          setSelectedCabin(hb.cabins[0] || null);
                          setCurrentStep("details");
                        }}
                        className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <span>Select</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. HOUSEBOAT DETAILS */}
          {currentStep === "details" && (
            <div className="space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Ship className="w-4 h-4 text-cyan-400" />
                    <span>Step 3: Houseboat Specifications &amp; Partner Details</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Vessel registry, partner operator, crew, and cabin suites
                  </p>
                </div>
                <button
                  onClick={() => setCurrentStep("search")}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Search</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Left 2 Cols: Vessel Overview */}
                <div className="md:col-span-2 space-y-4">
                  <div className="h-56 rounded-2xl overflow-hidden relative">
                    <img
                      src={selectedHouseboat.image}
                      alt={selectedHouseboat.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                      <div>
                        <h4 className="text-lg font-black text-white">{selectedHouseboat.name}</h4>
                        <p className="text-xs text-cyan-300 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>
                            {selectedHouseboat.destination}, {selectedHouseboat.state} •{" "}
                            {selectedHouseboat.waterbody}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Relational Foreign Key Badges */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 block">houseboat_id</span>
                      <span className="font-mono text-cyan-300 font-bold">
                        {selectedHouseboat.houseboatId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">partner_id</span>
                      <span className="font-mono text-purple-300 font-bold">
                        {selectedHouseboat.partnerId}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Registry Seal</span>
                      <span className="text-slate-300 text-[11px] truncate block">
                        {selectedHouseboat.vesselRegistrationNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Captain &amp; Cook</span>
                      <span className="text-emerald-400 font-semibold text-[11px]">
                        {selectedHouseboat.crewDetails.captainName.split(" ")[1] || "Capt"} (Crew of{" "}
                        {selectedHouseboat.crewCount})
                      </span>
                    </div>
                  </div>

                  {/* Cabins Available */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                      Available Cabin Suites
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedHouseboat.cabins.map((cab) => (
                        <div
                          key={cab.cabinId}
                          onClick={() => setSelectedCabin(cab)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedCabin?.cabinId === cab.cabinId
                              ? "bg-cyan-950/40 border-cyan-500 text-white"
                              : "bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-white">{cab.name}</span>
                            <span className="text-xs text-cyan-300 font-bold">
                              ₹{cab.pricePerNight.toLocaleString("en-IN")}/n
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-1">{cab.beds}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {cab.amenities.slice(0, 2).map((a, i) => (
                              <span
                                key={i}
                                className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300"
                              >
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Col: Menu & Features */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                    <h5 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase">
                      <Utensils className="w-3.5 h-3.5" />
                      <span>On-Board Master Chef Menu</span>
                    </h5>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedHouseboat.diningSpecialties.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Safety &amp; Compliance</span>
                    </h5>
                    <ul className="space-y-1 text-[11px] text-slate-400">
                      {selectedHouseboat.safetyCertificates.map((cert, idx) => (
                        <li key={idx} className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate">{cert}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => setCurrentStep("select_dates")}
                    className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all"
                  >
                    <span>Proceed to Select Dates</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. SELECT DATES */}
          {currentStep === "select_dates" && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Step 4: Select Cruise Dates &amp; Charter Format</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Choose overnight stay dates, boarding times, and private vs cabin charter
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Check-in Date (Boarding 12:00 PM)
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Check-out Date (Disembark 09:30 AM)
                  </label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Duration (Nights)
                  </label>
                  <select
                    value={totalNights}
                    onChange={(e) => setTotalNights(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value={1}>1 Night (Standard Lagoon Cruise)</option>
                    <option value={2}>2 Nights (Deep Backwater Expedition)</option>
                    <option value={3}>3 Nights (Royal Extended Safari)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Charter Type
                  </label>
                  <select
                    value={charterType}
                    onChange={(e) => setCharterType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  >
                    <option value="Exclusive Private Charter">
                      Exclusive Private Charter (Full Houseboat)
                    </option>
                    <option value="Single Cabin Booking">Single Cabin Booking</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-200">
                <span className="font-bold block mb-1">Backwater Cruise Routine:</span>
                Cruise sets sail at 12:30 PM with hot welcome tender coconut. Anchors safely at
                sunset (05:30 PM) near scenic paddy banks per Kerala Inland Port regulations.
                Air conditioning operates continuously throughout the journey.
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep("details")}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep("guest_details")}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Enter Guest Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 5. GUEST DETAILS */}
          {currentStep === "guest_details" && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>Step 5: Passenger Manifest &amp; Culinary Preference</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Required for Inland Waterways Authority passenger manifest clearance
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Adults (12+ Yrs)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={selectedHouseboat.maxGuests}
                    value={adultsCount}
                    onChange={(e) => setAdultsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                    Children (Under 12 Yrs)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={4}
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              {/* Guest Manifest List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase">
                  Passenger Government ID Manifest
                </h4>
                {guestManifest.map((g, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-3 gap-2 text-xs"
                  >
                    <div>
                      <span className="text-[10px] text-slate-500 block">Name</span>
                      <span className="font-semibold text-white">{g.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ID Type &amp; Number</span>
                      <span className="text-slate-300">
                        {g.idProofType}: {g.idProofNumber}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Age &amp; Gender</span>
                      <span className="text-slate-300">
                        {g.age} yrs, {g.gender}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Meal Plan */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  On-Board Chef Meal Plan
                </label>
                <select
                  value={mealPlan}
                  onChange={(e) => setMealPlan(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                >
                  <option value="Authentic Kerala Sadhya & Karimeen Fry">
                    Authentic Kerala Sadhya, Pearl Spot Karimeen &amp; Country Chicken
                  </option>
                  <option value="Pure Vegetarian & Jain">
                    Pure Vegetarian Traditional Kerala Sadhya &amp; Jain Friendly
                  </option>
                  <option value="Kashmiri Wazwan & Kahwa">
                    Kashmiri Wazwan, Rista, Gushtaba &amp; Saffron Kahwa
                  </option>
                  <option value="Goan Coastal Gourmet">
                    Goan Coastal Gourmet &amp; Prawn Balchão
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">
                  Special Requests / Occasions
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Birthday cake, candlelit deck dinner, quiet cabin..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                />
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep("select_dates")}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep("booking")}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>Review Booking Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 6. BOOKING REVIEW */}
          {currentStep === "booking" && (
            <div className="max-w-2xl mx-auto space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Step 6: Booking Breakdown &amp; Relational Pre-Check</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Inspect the relational links and price calculation before payment
                </p>
              </div>

              {/* Relational Link Table Preview */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  PostgreSQL Relational Schema Pre-Allocation:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">houseboat_id</span>
                    <span className="font-mono text-cyan-300 font-bold text-[11px]">
                      {selectedHouseboat.houseboatId}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">customer_id</span>
                    <span className="font-mono text-purple-300 font-bold text-[11px]">
                      {customer.customerId}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">partner_id</span>
                    <span className="font-mono text-amber-300 font-bold text-[11px]">
                      {selectedHouseboat.partnerId}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-[10px] text-slate-500 block">payment_id</span>
                    <span className="font-mono text-emerald-300 font-bold text-[11px]">
                      Pending TX
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Item Box */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vessel &amp; Destination:</span>
                  <span className="font-bold text-white">
                    {selectedHouseboat.name} ({selectedHouseboat.destination})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Dates:</span>
                  <span className="text-slate-200">
                    {checkInDate} ➔ {checkOutDate} ({totalNights} Night)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Guests &amp; Format:</span>
                  <span className="text-slate-200">
                    {adultsCount} Adults, {childrenCount} Children • {charterType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Boarding Jetty:</span>
                  <span className="text-slate-200">{selectedHouseboat.waterbody} Main Tourist Dock</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Meal Plan:</span>
                  <span className="text-emerald-400 font-semibold">{mealPlan}</span>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Cruise Fare ({totalNights} night):</span>
                  <span className="text-white font-medium">₹{baseFare.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Special Backwater Discount:</span>
                  <span>-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GST (5% Inland Cruise Tax):</span>
                  <span>+₹{taxAmountGst.toLocaleString("en-IN")}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-sm font-bold text-white">
                  <span>Net Payable Amount:</span>
                  <span className="text-cyan-300 font-black text-base">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setCurrentStep("guest_details")}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setCurrentStep("payment")}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30"
                >
                  <span>Proceed to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* 7. PAYMENT */}
          {currentStep === "payment" && (
            <div className="max-w-md mx-auto space-y-5 animate-in fade-in">
              <div className="border-b border-slate-800 pb-3 text-center">
                <h3 className="text-base font-bold text-white flex items-center justify-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span>Step 7: UPI &amp; Cards Secure Payment Gateway</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Generates verified `payment_id` and releases confirmed voucher
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                <span className="text-xs text-slate-400">Total Transaction Value</span>
                <p className="text-2xl font-black text-white">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </p>
                <span className="text-[10px] text-emerald-400 font-bold block">
                  Includes 5% Port Authority GST
                </span>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-400">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: "UPI", label: "Instant UPI / QR" },
                    { id: "CreditCard", label: "Credit Card" },
                    { id: "DebitCard", label: "Debit Card" },
                    { id: "NetBanking", label: "Net Banking" },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-3 rounded-xl border font-bold text-left transition-all ${
                        paymentMethod === pm.id
                          ? "bg-emerald-950/50 border-emerald-500 text-emerald-300"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>256-Bit SSL Encrypted Escrow Nodal Account</span>
                </div>
                <p className="text-[10px]">
                  Funds held securely until cruise completion per Maritime Tourist Board Guidelines.
                </p>
              </div>

              <button
                disabled={isProcessingPayment}
                onClick={handleProcessPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                {isProcessingPayment ? (
                  <span>Securing Payment &amp; Generating PNR...</span>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹{totalAmount.toLocaleString("en-IN")} &amp; Confirm</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* 8. CONFIRMED BOOKING */}
          {currentStep === "confirmed" && confirmedBooking && (
            <div className="max-w-xl mx-auto space-y-5 animate-in zoom-in-95 text-center">
              <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  Step 8: Booking Confirmed
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Houseboat Charter Confirmed!
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your reservation is logged in the central database with all relational linkages
                </p>
              </div>

              {/* Relational Foreign Key Confirmation */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-3 text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Booking ID:</span>
                  <span className="font-mono text-cyan-300 font-bold">
                    {confirmedBooking.bookingId}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Houseboat ID:</span>
                  <span className="font-mono text-slate-200">
                    {confirmedBooking.houseboatId}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Customer ID:</span>
                  <span className="font-mono text-purple-300">
                    {confirmedBooking.customerId}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Partner ID:</span>
                  <span className="font-mono text-amber-300">
                    {confirmedBooking.partnerId}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment ID:</span>
                  <span className="font-mono text-emerald-300 font-bold">
                    {confirmedBooking.paymentId}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={() => setCurrentStep("ticket_invoice")}
                  className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Step 9: View Houseboat Ticket / Tax Invoice</span>
                </button>
              </div>
            </div>
          )}

          {/* 9. HOUSEBOAT TICKET / INVOICE */}
          {currentStep === "ticket_invoice" && confirmedBooking && (
            <div className="max-w-3xl mx-auto space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>Step 9: Official Houseboat Boarding Pass &amp; GST Tax Invoice</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Government port verified boarding pass and tax compliance invoice
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / PDF</span>
                  </button>
                </div>
              </div>

              {/* Printable Ticket Card */}
              <div className="rounded-3xl bg-white text-slate-900 p-6 shadow-2xl border border-slate-200 space-y-6">
                {/* Brand & Pass Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-cyan-600 text-white">
                      <Ship className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700">
                        BharatYatra Houseboat Flotilla
                      </span>
                      <h4 className="text-xl font-black text-slate-900 leading-tight">
                        HOUSEBOAT BOARDING PASS
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Port Registration: {selectedHouseboat.vesselRegistrationNumber}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-slate-500 block">
                      TICKET NO:
                    </span>
                    <span className="text-base font-mono font-black text-cyan-800">
                      {confirmedBooking.ticketNumber}
                    </span>
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      CONFIRMED &amp; PAID
                    </span>
                  </div>
                </div>

                {/* Primary Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Primary Passenger
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {confirmedBooking.customer.name}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {confirmedBooking.customer.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Houseboat Vessel
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedHouseboat.name}
                    </span>
                    <span className="text-[11px] text-cyan-700 font-medium block">
                      {selectedHouseboat.waterbody}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Check-in &amp; Boarding
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {confirmedBooking.checkInDate}
                    </span>
                    <span className="text-[11px] text-slate-500 block">12:00 PM Sharp</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">
                      Disembarkation
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {confirmedBooking.checkOutDate}
                    </span>
                    <span className="text-[11px] text-slate-500 block">09:30 AM</span>
                  </div>
                </div>

                {/* Captain, Crew & Pier Location */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      Assigned Captain
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedHouseboat.crewDetails.captainName}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Tel: {selectedHouseboat.crewDetails.contactPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      In-House Master Chef
                    </span>
                    <span className="font-bold text-slate-800">
                      {selectedHouseboat.crewDetails.chefName}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      Meal Plan: {confirmedBooking.mealPlan.split(" ")[0]}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">
                      Boarding Jetty Address
                    </span>
                    <span className="font-semibold text-slate-800">
                      {confirmedBooking.dockLocation}
                    </span>
                  </div>
                </div>

                {/* GST Tax Invoice Box */}
                <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <span className="text-[10px] text-cyan-400 font-bold uppercase">
                        GST Compliance Tax Invoice
                      </span>
                      <h5 className="font-mono text-sm font-bold">
                        {confirmedBooking.taxInvoiceNumber}
                      </h5>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Payment Reference:</span>
                      <span className="font-mono text-emerald-300 font-bold text-xs">
                        {confirmedBooking.paymentId}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <p className="text-slate-400">Total Net Amount Paid (INR):</p>
                      <p className="text-lg font-black text-cyan-300">
                        ₹{confirmedBooking.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="p-2 rounded-xl bg-white text-slate-900 flex items-center gap-2">
                      <QrCode className="w-9 h-9 text-slate-900" />
                      <div className="text-[9px] font-mono leading-tight">
                        <span>SCAN AT JETTY</span>
                        <br />
                        <span className="text-slate-500 font-bold">PORT GATE AUTH</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
                  This is a computer-generated tax invoice and verified electronic boarding pass issued
                  under the authority of Inland Waterways &amp; Maritime Tourism Registry.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
                >
                  Close &amp; Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
