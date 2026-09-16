import React, { useState } from "react";
import {
  X,
  Tent,
  Star,
  MapPin,
  CheckCircle2,
  Coffee,
  Flame,
  ShieldCheck,
  Calendar,
  Users,
  Compass,
  CreditCard,
  TreePine,
  Sparkles,
  Award,
  Clock,
  Car,
  ChevronRight,
  Info,
  Printer,
  Download,
  Copy,
  Share2,
  FileText,
  QrCode,
  BadgeCheck,
  Smartphone,
  Mail,
} from "lucide-react";
import { LodgeItem, LodgeRoomType, LodgeRatePlan } from "../../types";
import { BookingItem } from "../../types";

interface LodgeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lodge: LodgeItem | null;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function LodgeDetailsModal({
  isOpen,
  onClose,
  lodge,
  onBookingSuccess,
}: LodgeDetailsModalProps) {
  if (!isOpen || !lodge) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "rooms" | "safari_addons" | "reviews" | "policies">("rooms");
  const [selectedRoom, setSelectedRoom] = useState<LodgeRoomType>(lodge.roomTypes[0]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(lodge.roomTypes[0].ratePlans[0].planId);
  const [checkInDate, setCheckInDate] = useState("2026-08-28");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-30");
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestName, setGuestName] = useState("Vikramaditya Sengupta");
  const [guestPhone, setGuestPhone] = useState("+91 98112 34567");
  const [guestEmail, setGuestEmail] = useState("vikram.sengupta@example.com");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [paymentOption, setPaymentOption] = useState<"UPI" | "CREDIT_CARD" | "DEBIT_CARD" | "QR" | "NETBANKING">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);
  const [receiptViewMode, setReceiptViewMode] = useState<"summary" | "full_receipt">("summary");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copiedTxn, setCopiedTxn] = useState(false);

  const activePlan: LodgeRatePlan =
    selectedRoom.ratePlans.find((p) => p.planId === selectedPlanId) || selectedRoom.ratePlans[0];

  const totalNights = 2;
  const roomBaseTotal = activePlan.pricePerNight * roomsCount * totalNights;
  
  // Calculate add-ons cost
  const addonsTotal = selectedAddons.reduce((acc, addonId) => {
    const addon = lodge.addons.find((a) => a.id === addonId);
    return acc + (addon ? addon.price : 0);
  }, 0);

  const subTotal = roomBaseTotal + addonsTotal;
  const gstAmount = Math.round(subTotal * 0.12);
  const discount = 400; // Special Eco-stay discount
  const finalPayable = Math.max(0, subTotal + gstAmount - discount);

  const toggleAddon = (addonId: string) => {
    setSelectedAddons((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const handleRoomChange = (room: LodgeRoomType) => {
    setSelectedRoom(room);
    setSelectedPlanId(room.ratePlans[0].planId);
  };

  const handleExecuteBooking = async () => {
    setIsProcessing(true);
    try {
      const voucherCode = `LODGE-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      const txnId = `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

      const bookingRecord: BookingItem = {
        id: `BK-LDG-${Date.now()}`,
        serviceCategory: "lodges",
        serviceType: "lodges",
        title: `${lodge.name} (${selectedRoom.name})`,
        provider: lodge.name,
        fromLocation: lodge.destination,
        toLocation: lodge.region,
        date: `${checkInDate} to ${checkOutDate}`,
        time: lodge.policies.checkInTime,
        status: "confirmed",
        amountPaid: finalPayable,
        pnr: voucherCode,
        passengersCount: guestsCount,
        seatOrRoomInfo: `${roomsCount} × ${selectedRoom.name} (${activePlan.planName})`,
        invoiceNumber: `INV-LDG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      // Call backend API in background
      fetch("/api/lodges/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lodgeId: lodge.id,
          lodgeName: lodge.name,
          roomId: selectedRoom.roomId,
          roomName: selectedRoom.name,
          planName: activePlan.planName,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests: guestsCount,
          rooms: roomsCount,
          guestName,
          guestPhone,
          guestEmail,
          totalAmount: finalPayable,
          paymentMethod: paymentOption,
          voucherCode,
          addons: selectedAddons,
        }),
      }).catch(() => {});

      setTimeout(() => {
        setConfirmedBookingData({
          ...bookingRecord,
          lodge,
          selectedRoom,
          activePlan,
          guestName,
          guestPhone,
          guestEmail,
          voucherCode,
          bookingId: voucherCode,
          receiptNumber: receiptNo,
          transactionId: txnId,
          amountPaid: finalPayable,
          paymentMethod: paymentOption === "CREDIT_CARD" ? "Credit Card" : paymentOption === "DEBIT_CARD" ? "Debit Card" : paymentOption === "QR" ? "QR Code" : paymentOption === "NETBANKING" ? "Net Banking" : "UPI",
          paymentStatus: "PAID",
          roomBaseTotal,
          gstAmount,
          discount,
          addons: selectedAddons.map((id) => lodge.addons.find((a) => a.id === id)?.name).filter(Boolean),
          paidAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        });
        onBookingSuccess(bookingRecord);
        setIsProcessing(false);
        setIsConfirmed(true);
      }, 1000);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className={`${isConfirmed ? "no-print" : ""} bg-gradient-to-r from-amber-900 via-stone-900 to-teal-950 p-5 sm:p-6 text-white flex items-center justify-between`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <Tent className="w-3.5 h-3.5" />
                {lodge.lodgeType}
              </span>
              {lodge.isEcoCertified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                  <TreePine className="w-3 h-3" />
                  Eco-Certified
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">{lodge.name}</h2>
            <p className="text-xs text-amber-200/90 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span>{lodge.region}, {lodge.destination}, {lodge.state}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal View Content */}
        {!isConfirmed ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {/* Gallery Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 rounded-2xl overflow-hidden shadow-inner">
              <div className="md:col-span-2 h-56 sm:h-64 overflow-hidden">
                <img
                  src={lodge.image}
                  alt={lodge.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="hidden md:grid grid-rows-2 gap-2 h-64">
                {lodge.gallery.slice(1, 3).map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${lodge.name} view ${idx + 2}`}
                    className="w-full h-full object-cover rounded-xl"
                  />
                ))}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 gap-2 overflow-x-auto text-xs font-bold pb-2">
              {[
                { id: "rooms", label: "🛏️ Rooms & Cottages", count: lodge.roomTypes.length },
                { id: "safari_addons", label: "🌿 Safaris & Activities", count: lodge.addons.length },
                { id: "overview", label: "🏡 Host & Amenities" },
                { id: "reviews", label: "⭐ Verified Reviews", count: lodge.reviews.length },
                { id: "policies", label: "📜 Forest & Check-In Policies" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    activeTab === tab.id
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className="px-1.5 py-0.5 rounded-full bg-black/20 text-[10px]">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* TAB 1: ROOMS & COTTAGES SELECTION */}
            {activeTab === "rooms" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Select Your Lodge Room or Cottage Category
                  </h3>
                  <span className="text-xs text-amber-700 font-semibold">
                    100% Free Cancellation Available
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {lodge.roomTypes.map((room) => {
                    const isSelected = selectedRoom.roomId === room.roomId;
                    return (
                      <div
                        key={room.roomId}
                        onClick={() => handleRoomChange(room)}
                        className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                          isSelected
                            ? "border-amber-600 bg-amber-50/50 shadow-md ring-2 ring-amber-500/20"
                            : "border-slate-200 hover:border-amber-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[10px] font-black uppercase">
                              {room.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">{room.name}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{room.view} • {room.sizeSqFt} sq ft</p>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-5 h-5 text-amber-600 shrink-0" />
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {room.features.map((f, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px]">
                              ✓ {f}
                            </span>
                          ))}
                        </div>

                        {/* Rate Plans inside room */}
                        <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                          <span className="text-[11px] font-bold text-slate-700 block">Available Meal &amp; Rate Plans:</span>
                          {room.ratePlans.map((plan) => (
                            <label
                              key={plan.planId}
                              className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer ${
                                selectedPlanId === plan.planId && isSelected
                                  ? "border-amber-500 bg-white shadow-xs"
                                  : "border-slate-200 bg-slate-50/50"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`ratePlan_${room.roomId}`}
                                  checked={selectedPlanId === plan.planId && isSelected}
                                  onChange={() => {
                                    handleRoomChange(room);
                                    setSelectedPlanId(plan.planId);
                                  }}
                                  className="text-amber-600 focus:ring-amber-500"
                                />
                                <div>
                                  <span className="font-bold text-slate-800">{plan.planName}</span>
                                  <p className="text-[10px] text-slate-500 leading-tight">{plan.description}</p>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="font-black text-amber-900 text-sm">₹{plan.pricePerNight.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-400 block">/ night</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: SAFARI & EXPERIENCES ADDONS */}
            {activeTab === "safari_addons" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Enhance Your Stay with Authentic Safari &amp; Forest Experiences
                  </h3>
                  <span className="text-xs text-slate-500">Curated &amp; Conducted by Lodge Naturalists</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {lodge.addons.map((addon) => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        onClick={() => toggleAddon(addon.id)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                          isChecked
                            ? "border-amber-600 bg-amber-50/60 shadow-xs"
                            : "border-slate-200 hover:border-amber-300 bg-white"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{addon.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-500">{addon.unit}</span>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="font-black text-amber-900 text-sm">₹{addon.price.toLocaleString()}</span>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 rounded-sm text-amber-600 focus:ring-amber-500"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: OVERVIEW & HOST */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-black text-lg flex items-center justify-center shadow-md shrink-0">
                    {lodge.hostName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">Hosted by {lodge.hostName}</h4>
                      {lodge.isSuperHost && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 text-[10px] font-black border border-amber-500/30">
                          ⭐ Superhost ({lodge.hostExperienceYears} yrs experience)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Pioneer naturalist &amp; eco-conservation host providing personalized wildlife trail curation.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Lodge Amenities &amp; Services
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {lodge.amenities.map((amenity, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="line-clamp-1">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: VERIFIED REVIEWS */}
            {activeTab === "reviews" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">{lodge.rating}</span>
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">({lodge.reviewsCount} verified guest ratings)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {lodge.reviews.map((rev) => (
                    <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{rev.userName} ({rev.userCity})</span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-200 text-stone-700 text-[10px]">
                            {rev.travelerType}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: POLICIES */}
            {activeTab === "policies" && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-700">Check-in / Check-out</span>
                    <span className="font-semibold text-slate-900">{lodge.policies.checkInTime} / {lodge.policies.checkOutTime}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-700">Cancellation Policy</span>
                    <span className="font-semibold text-emerald-700">{lodge.policies.cancellationPolicy}</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="font-bold text-slate-700">ID Requirement</span>
                    <span className="font-semibold text-slate-900">{lodge.policies.idRequirement}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700">Forest Permit Requirement</span>
                    <span className="font-semibold text-amber-700">
                      {lodge.policies.forestEntryPermitRequired ? "Required (Lodge desk arranges upon arrival)" : "Not Required"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKING CONFIGURATION & PRICE BREAKDOWN BAR */}
            <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-stone-400 font-bold block mb-1">Check-in</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 font-bold block mb-1">Check-out</label>
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-2 text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 font-bold block mb-1">Guests</label>
                  <select
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-2 text-xs font-semibold"
                  >
                    {[1, 2, 3, 4, 6].map((n) => (
                      <option key={n} value={n}>{n} Guests</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-stone-400 font-bold block mb-1">Cottages / Rooms</label>
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(Number(e.target.value))}
                    className="w-full bg-stone-800 border border-stone-700 text-white rounded-xl p-2 text-xs font-semibold"
                  >
                    {[1, 2, 3].map((n) => (
                      <option key={n} value={n}>{n} Cottage{n > 1 ? "s" : ""}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guest Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <input
                  type="text"
                  placeholder="Primary Guest Name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded-xl p-2 text-white font-medium placeholder-stone-500"
                />
                <input
                  type="tel"
                  placeholder="Mobile for SMS Voucher"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded-xl p-2 text-white font-medium placeholder-stone-500"
                />
                <input
                  type="email"
                  placeholder="Email for E-Receipt"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  className="bg-stone-800 border border-stone-700 rounded-xl p-2 text-white font-medium placeholder-stone-500"
                />
              </div>

              {/* Payment Methods */}
              <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-400 font-bold">Payment Method:</span>
                  <div className="flex flex-wrap gap-1.5 text-xs font-bold">
                    {[
                      { id: "UPI", label: "⚡ UPI" },
                      { id: "CREDIT_CARD", label: "💳 Credit Card" },
                      { id: "DEBIT_CARD", label: "💳 Debit Card" },
                      { id: "QR", label: "📱 QR Code" },
                      { id: "NETBANKING", label: "🏛️ Net Banking" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPaymentOption(m.id as any)}
                        className={`px-2.5 py-1 rounded-lg transition-all ${
                          paymentOption === m.id
                            ? "bg-amber-500 text-stone-950 font-black shadow-xs"
                            : "bg-stone-800 text-stone-300 hover:bg-stone-700"
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-baseline gap-2 justify-end">
                    <span className="text-[11px] text-stone-400 line-through">₹{(subTotal + gstAmount).toLocaleString()}</span>
                    <span className="text-xl font-black text-amber-400">₹{finalPayable.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-semibold block">
                    Includes 12% GST &amp; Free Cancellation
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* STANDARDIZED LODGE PAYMENT & DIGITAL RECEIPT CONFIRMATION FLOW */
          /* ========================================================================= */
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-900 animate-in fade-in">
            {/* Customer Confirmation Header Card */}
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-3xl p-6 text-center space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-emerald-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-emerald-600/30">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-emerald-950">Lodge Booking Confirmed</h3>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                  <BadgeCheck className="w-4 h-4 text-emerald-700" />
                  <span>Payment Successful ✓</span>
                </div>
              </div>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your eco-lodge reservation at <span className="font-bold">{lodge.name}</span> has been confirmed and registered with the host and forest department.
              </p>

              {/* High-level Transaction & Booking Summary Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-w-2xl mx-auto text-left">
                <div className="p-3 bg-white border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Amount Paid</span>
                  <span className="text-sm font-black text-slate-900">
                    ₹{confirmedBookingData.amountPaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-3 bg-white border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Method</span>
                  <span className="text-sm font-black text-amber-800">
                    {confirmedBookingData.paymentMethod}
                  </span>
                </div>
                <div className="p-3 bg-white border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Booking ID</span>
                  <span className="text-sm font-mono font-black text-emerald-700">
                    {confirmedBookingData.bookingId}
                  </span>
                </div>
                <div className="p-3 bg-white border border-emerald-200 rounded-2xl">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Status</span>
                  <span className="text-sm font-black text-emerald-600">PAID</span>
                </div>
              </div>

              {/* Transaction ID with Copy functionality */}
              <div className="flex items-center justify-center gap-2 pt-1 text-xs">
                <span className="text-slate-500 font-medium">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-800 bg-white px-2.5 py-1 rounded-lg border border-emerald-200">
                  {confirmedBookingData.transactionId}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(confirmedBookingData.transactionId);
                    setCopiedTxn(true);
                    setTimeout(() => setCopiedTxn(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors flex items-center gap-1 text-[11px] font-bold"
                  title="Copy Transaction ID"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedTxn ? "Copied!" : "Copy Transaction ID"}</span>
                </button>
              </div>

              {/* Standardized Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setReceiptViewMode(receiptViewMode === "full_receipt" ? "summary" : "full_receipt")}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{receiptViewMode === "full_receipt" ? "Hide Receipt" : "View Receipt"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReceiptViewMode("summary")}
                  className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Tent className="w-3.5 h-3.5 text-slate-600" />
                  <span>View Booking</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: `Lodge Booking Receipt - ${lodge.name}`,
                        text: `Lodge reservation confirmed at ${lodge.name}! Booking ID: ${confirmedBookingData.bookingId}, Txn ID: ${confirmedBookingData.transactionId}, Total Paid: ₹${confirmedBookingData.amountPaid}`,
                        url: window.location.href,
                      }).catch(() => {});
                    } else {
                      setIsShareModalOpen(true);
                    }
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Full Standardized Digital Receipt Sheet */}
            {receiptViewMode === "full_receipt" && (
              <div className="printable-invoice-sheet bg-white border-2 border-slate-900 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in slide-in-from-top-3">
                {/* Header Strip with Platform & Receipt Numbers */}
                <div className="flex flex-wrap items-start justify-between border-b-2 border-slate-900 pb-5 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-xl bg-amber-600 text-white font-black">
                        <Tent className="w-5 h-5" />
                      </span>
                      <div>
                        <span className="text-base font-black text-slate-900 tracking-tight block">BharatYatra Travel Platform</span>
                        <span className="text-[10px] text-slate-500 font-medium">Official Digital Lodge Payment &amp; Reservation Receipt</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black tracking-wider uppercase inline-block">
                      ✓ Status: Paid
                    </span>
                    <div className="text-xs text-slate-500">
                      Receipt No: <span className="font-mono font-bold text-slate-900">{confirmedBookingData.receiptNumber}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Date &amp; Time: <span className="font-semibold text-slate-700">{confirmedBookingData.paidAt}</span>
                    </div>
                  </div>
                </div>

                {/* Standardized Section Breakdown Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-black uppercase tracking-wider">
                    <span>Receipt Section</span>
                    <span>Details</span>
                  </div>
                  <div className="divide-y divide-slate-200 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Travel Platform</span>
                      <span className="sm:col-span-2 font-black text-slate-900 flex items-center gap-2">
                        <span>BharatYatra Eco &amp; Wildlife Tourism Network</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Verified Platform</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Receipt No.</span>
                      <span className="sm:col-span-2 font-mono font-bold text-amber-800">
                        {confirmedBookingData.receiptNumber}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Booking ID</span>
                      <span className="sm:col-span-2 font-mono font-black text-slate-900">
                        {confirmedBookingData.bookingId}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Transaction ID</span>
                      <span className="sm:col-span-2 font-mono font-bold text-slate-800 flex items-center gap-2">
                        <span>{confirmedBookingData.transactionId}</span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(confirmedBookingData.transactionId);
                            setCopiedTxn(true);
                            setTimeout(() => setCopiedTxn(false), 2000);
                          }}
                          className="text-amber-700 hover:text-amber-900 text-[10px] underline font-bold"
                        >
                          Copy
                        </button>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Guest Name</span>
                      <span className="sm:col-span-2 font-bold text-slate-900">
                        {confirmedBookingData.guestName} ({confirmedBookingData.guestPhone})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Lodge</span>
                      <span className="sm:col-span-2 font-bold text-slate-900">
                        {lodge.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Location</span>
                      <span className="sm:col-span-2 font-bold text-slate-900">
                        {lodge.region}, {lodge.destination}, {lodge.state}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Room</span>
                      <span className="sm:col-span-2 font-bold text-slate-900">
                        {roomsCount} × {selectedRoom.name} ({activePlan.planName})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Check-in</span>
                      <span className="sm:col-span-2 font-bold text-slate-900">
                        {checkInDate} (From {lodge.policies.checkInTime})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Check-out</span>
                      <span className="sm:col-span-2 font-bold text-slate-900">
                        {checkOutDate} (Till {lodge.policies.checkOutTime})
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Nights</span>
                      <span className="sm:col-span-2 font-bold text-slate-900">
                        {totalNights} Nights
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Lodge Fee</span>
                      <span className="sm:col-span-2 font-semibold text-slate-900">
                        ₹{confirmedBookingData.roomBaseTotal.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Taxes</span>
                      <span className="sm:col-span-2 text-slate-700">
                        ₹{confirmedBookingData.gstAmount.toLocaleString("en-IN")} (12% GST)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Discount</span>
                      <span className="sm:col-span-2 font-bold text-emerald-700">
                        -₹{confirmedBookingData.discount.toLocaleString("en-IN")} (Eco-stay Special)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3.5 bg-emerald-50/80 font-black text-sm">
                      <span className="text-emerald-950">Total Amount</span>
                      <span className="sm:col-span-2 text-emerald-900 font-mono text-base">
                        ₹{confirmedBookingData.amountPaid.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3">
                      <span className="font-bold text-slate-600">Payment Method</span>
                      <span className="sm:col-span-2 font-bold text-indigo-700">
                        {confirmedBookingData.paymentMethod} (Verified Gateway)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 p-3 bg-slate-50/50">
                      <span className="font-bold text-slate-600">Payment Status</span>
                      <span className="sm:col-span-2 font-black text-emerald-700">
                        PAID
                      </span>
                    </div>
                  </div>
                </div>

                {/* QR Code & Invoice Verification Card */}
                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-white rounded-xl border border-slate-300 shadow-xs">
                      <QrCode className="w-14 h-14 text-slate-900" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-black text-slate-900 block">Lodge &amp; Forest Check-In QR</span>
                      <p className="text-[11px] text-slate-500 max-w-sm">
                        Verified at lodge reception &amp; forest checkpost for instant contactless clearance and keycard handover.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Receipt</span>
                    </button>
                  </div>
                </div>

                {/* Backend Security Mandate Callout */}
                <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-2xl text-[11px] text-amber-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">🔐 Backend Security:</span>
                    <span>
                      Your database stores the payment gateway transaction/reference ID ({confirmedBookingData.transactionId}) and payment status, but not the customer's full card number, CVV, or UPI PIN.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Official Lodge Travel Voucher Card */}
            <div className="border-2 border-amber-600/30 rounded-3xl p-6 bg-gradient-to-br from-amber-50/40 via-white to-stone-50 space-y-4 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-900 text-[10px] font-black uppercase">
                    Official Lodge Travel Voucher
                  </span>
                  <h4 className="text-lg font-black text-slate-900 mt-1">{lodge.name}</h4>
                  <p className="text-xs text-slate-600">{lodge.region}, {lodge.destination}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Voucher / PNR Code</span>
                  <span className="text-lg font-mono font-black text-amber-700">{confirmedBookingData.voucherCode}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Primary Guest</span>
                  <span className="font-bold text-slate-900">{confirmedBookingData.guestName}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Dates &amp; Nights</span>
                  <span className="font-bold text-slate-900">{checkInDate} to {checkOutDate} (2 Nights)</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Cottage Type</span>
                  <span className="font-bold text-slate-900">{selectedRoom.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Meal Plan</span>
                  <span className="font-bold text-amber-800">{activePlan.planName}</span>
                </div>
              </div>

              {confirmedBookingData.addons && confirmedBookingData.addons.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-100/50 text-xs text-amber-900 flex items-center gap-2">
                  <TreePine className="w-4 h-4 shrink-0 text-amber-700" />
                  <span><strong>Included Addons:</strong> {confirmedBookingData.addons.join(", ")}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Host Direct Contact: </span>
                  <span className="font-bold text-slate-800">{lodge.hostName} ({guestPhone})</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 text-[11px]">Total Paid: </span>
                  <span className="font-black text-base text-slate-950 font-mono">₹{finalPayable.toLocaleString()}</span>
                </div>
              </div>

              {/* Eco-Resort & Forest Department Check-in Advisory */}
              <div className="pt-2 border-t border-amber-200/60 text-[10px] text-slate-500 leading-relaxed print-break-inside-avoid">
                <p>
                  • <strong>Forest Entry Permit:</strong> Carry government-issued Photo ID for all occupants at the checkpost. Standard check-in is 01:00 PM; late evening wildlife zone driving restrictions apply after 06:00 PM.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="no-print flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt &amp; Voucher</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Done</span>
              </button>
            </div>

            {/* Share Modal for Lodge */}
            {isShareModalOpen && (
              <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60">
                <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl border border-slate-200">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h5 className="font-bold text-sm text-slate-900">Share Receipt</h5>
                    <button onClick={() => setIsShareModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <a
                      href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Lodge reservation confirmed at ${lodge.name}! Booking ID: ${confirmedBookingData.bookingId}, Txn ID: ${confirmedBookingData.transactionId}, Total Paid: ₹${confirmedBookingData.amountPaid}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Share on WhatsApp</span>
                    </a>
                    <a
                      href={`mailto:?subject=${encodeURIComponent(`Lodge Booking Receipt - ${lodge.name}`)}&body=${encodeURIComponent(`Dear Guest,\n\nYour eco-lodge reservation at ${lodge.name} is confirmed!\n\nBooking ID: ${confirmedBookingData.bookingId}\nReceipt No: ${confirmedBookingData.receiptNumber}\nTransaction ID: ${confirmedBookingData.transactionId}\nTotal Paid: ₹${confirmedBookingData.amountPaid}\n\nThank you for traveling with BharatYatra!`)}`}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Share via Email</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer actions for booking view */}
        {!isConfirmed && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free Cancellation until 48h prior • Verified Eco Host</span>
            </div>
            <button
              onClick={handleExecuteBooking}
              disabled={isProcessing}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-teal-700 hover:from-amber-700 hover:to-teal-800 text-white font-extrabold text-sm transition-all shadow-lg hover:scale-105 flex items-center gap-2 disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Locking Lodge Reservation...</span>
              ) : (
                <>
                  <span>Confirm Lodge Booking (₹{finalPayable.toLocaleString()})</span>
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
