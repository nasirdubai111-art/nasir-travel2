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
  const [paymentOption, setPaymentOption] = useState<"UPI" | "WALLET" | "CARD" | "PAY_AT_LODGE">("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

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
      const voucherCode = `LDG-${Math.floor(100000 + Math.random() * 900000)}`;
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
          voucherCode,
          addons: selectedAddons.map((id) => lodge.addons.find((a) => a.id === id)?.name).filter(Boolean),
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
                  <div className="flex gap-1.5 text-xs font-bold">
                    {[
                      { id: "UPI", label: "⚡ UPI (0% Fee)" },
                      { id: "WALLET", label: "👛 BY Wallet" },
                      { id: "CARD", label: "💳 Card" },
                      { id: "PAY_AT_LODGE", label: "🏡 Pay @ Lodge" },
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
          /* BOOKING CONFIRMATION & PRINTABLE VOUCHER VIEW */
          <div className="printable-voucher-sheet printable-document flex-1 overflow-y-auto p-6 space-y-6 text-slate-900 animate-in fade-in">
            <div className="text-center space-y-2 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Lodge Booking Confirmed!</h3>
              <p className="text-xs text-slate-500">
                Your reservation voucher and safari access permit details have been registered.
              </p>
            </div>

            {/* Official Voucher Card */}
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

            <div className="no-print flex justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-2"
              >
                <span>🖨️ Print Stay Voucher</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all"
              >
                <span>Done</span>
              </button>
            </div>
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
