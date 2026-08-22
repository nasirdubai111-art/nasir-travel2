import React, { useState } from "react";
import {
  X,
  UtensilsCrossed,
  MapPin,
  Train,
  CheckCircle2,
  Sparkles,
  Percent,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Star,
  Tag,
  Car,
  Zap,
  Coffee,
  Heart,
  Plus,
  Minus,
  Check,
} from "lucide-react";
import { DetailedDiningItem, MenuItem, DiningOffer } from "../../data/diningData";
import { BookingItem } from "../../types";

interface HighwayDiningModalProps {
  isOpen: boolean;
  onClose: () => void;
  diningItem?: DetailedDiningItem | null;
  dining?: DetailedDiningItem | null;
  initialPnr?: string;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function HighwayDiningModal({
  isOpen,
  onClose,
  diningItem,
  dining,
  initialPnr,
  onBookingSuccess,
}: HighwayDiningModalProps) {
  const activeDining = diningItem || dining;
  if (!isOpen || !activeDining) return null;

  const [activeTab, setActiveTab] = useState<"table" | "train_delivery" | "menu_order" | "reviews_offers">(
    initialPnr ? "train_delivery" : "table"
  );
  const [guestsCount, setGuestsCount] = useState(4);
  const [seatingPreference, setSeatingPreference] = useState<"Family AC Lounge" | "Traditional Charpai / Garden" | "EV Charging Bay Seating" | "Express Counter">("Family AC Lounge");
  const [reservationTime, setReservationTime] = useState("01:30 PM");
  const [reservationDate, setReservationDate] = useState("2026-08-28");
  const [specialRequest, setSpecialRequest] = useState("Need high chair & Jain food options");
  const [appliedOfferCode, setAppliedOfferCode] = useState<string>("HIGHWAY15");

  // Train Delivery Specifics
  const [trainPnr, setTrainPnr] = useState(initialPnr || "284-9104821");
  const [trainStation, setTrainStation] = useState(activeDining.deliveryToTrainStations[0] || "NDLS");
  const [berthInfo, setBerthInfo] = useState("Coach B3, Berth 42");

  // Food Ordering Cart & Dietary Filter
  const [dietaryFilter, setDietaryFilter] = useState<"all" | "pure_veg" | "jain" | "satvik">("all");
  const [cart, setCart] = useState<{ item: MenuItem; count: number; customNote?: string }[]>([]);
  const [customerName, setCustomerName] = useState("Pooja Singhania");
  const [customerPhone, setCustomerPhone] = useState("+91 99887 11223");

  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  const addItemToCart = (item: MenuItem) => {
    const existing = cart.find((c) => c.item.id === item.id);
    if (existing) {
      setCart(cart.map((c) => (c.item.id === item.id ? { ...c, count: c.count + 1 } : c)));
    } else {
      setCart([...cart, { item, count: 1 }]);
    }
  };

  const removeItemFromCart = (itemId: string) => {
    const existing = cart.find((c) => c.item.id === itemId);
    if (existing && existing.count > 1) {
      setCart(cart.map((c) => (c.item.id === itemId ? { ...c, count: c.count - 1 } : c)));
    } else {
      setCart(cart.filter((c) => c.item.id !== itemId));
    }
  };

  const cartTotal = cart.reduce((acc, c) => acc + c.item.price * c.count, 0);
  const discountAmount = appliedOfferCode === "HIGHWAY15" ? Math.round(cartTotal * 0.15) : Math.round(cartTotal * 0.1);
  const finalFoodTotal = Math.max(0, cartTotal - discountAmount);

  const filteredMenuItems = activeDining.menu.filter((m) => {
    if (dietaryFilter === "pure_veg") return m.isPureVeg;
    if (dietaryFilter === "jain") return m.isJainFriendly;
    if (dietaryFilter === "satvik") return m.isSatvik;
    return true;
  });

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedOrder = `DINE-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: BookingItem = {
        id: `DB-${Date.now()}`,
        serviceCategory: "dining",
        title: `${activeDining.name} (${activeTab === "table" ? "Table Reservation" : activeTab === "train_delivery" ? "IRCTC Berth Delivery" : "Takeaway Order Ahead"})`,
        provider: activeDining.name,
        fromLocation: activeDining.city,
        toLocation: activeTab === "table" ? activeDining.highwayCorridor : `Train Delivery @ ${trainStation}`,
        date: reservationDate,
        time: reservationTime,
        status: "confirmed",
        amountPaid: activeTab === "table" ? 0 : finalFoodTotal,
        pnr: generatedOrder,
        passengersCount: guestsCount,
        seatOrRoomInfo: activeTab === "table"
          ? `Table for ${guestsCount} (${seatingPreference}) • ${activeDining.tableDiscountPercent}% Off`
          : `Train PNR ${trainPnr} • ${berthInfo} @ ${trainStation}`,
      };

      setConfirmedBookingData({
        ...newBooking,
        dining: activeDining,
        activeTab,
        cart,
      });

      onBookingSuccess(newBooking);
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header with image banner */}
        <div className="relative bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-white shadow-inner">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">{activeDining.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                  {activeDining.type}
                </span>
              </div>
              <p className="text-xs text-orange-100 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{activeDining.location} • {activeDining.highwayCorridor}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Top Sub-Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200">
              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`py-2 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === "table" ? "bg-white text-orange-700 shadow-xs font-black" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Reserve Table</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("train_delivery")}
                className={`py-2 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === "train_delivery" ? "bg-white text-orange-700 shadow-xs font-black" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>IRCTC Train Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("menu_order")}
                className={`py-2 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === "menu_order" ? "bg-white text-orange-700 shadow-xs font-black" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Menu &amp; Pre-Order ({cart.reduce((a, b) => a + b.count, 0)})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reviews_offers")}
                className={`py-2 rounded-xl font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                  activeTab === "reviews_offers" ? "bg-white text-orange-700 shadow-xs font-black" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Reviews &amp; Offers</span>
              </button>
            </div>

            {/* TAB 1: TABLE RESERVATION */}
            {activeTab === "table" && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-transparent border border-orange-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-orange-950 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-orange-600" />
                      Guaranteed Instant Table with {activeDining.tableDiscountPercent}% Bill Discount
                    </span>
                    <span className="text-[11px] text-slate-600 block">
                      Skip highway pitstop queues, get reserved seating + EV parking spot.
                    </span>
                  </div>
                  <span className="px-3 py-1.5 rounded-xl bg-orange-600 text-white font-black text-xs shrink-0 shadow-xs">
                    {activeDining.tableDiscountPercent}% OFF
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Reservation Date</label>
                    <input
                      type="date"
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Estimated Arrival Time</label>
                    <select
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold bg-white text-xs"
                    >
                      {["08:00 AM (Breakfast)", "10:30 AM", "01:00 PM (Lunch)", "02:30 PM", "05:00 PM (Snacks & Tea)", "08:30 PM (Dinner)", "11:00 PM (Midnight Dhaba)"].map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Party Size</label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                    >
                      {[1, 2, 4, 6, 8, 10, 15, 20].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? "Guest" : "Guests"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1.5">Seating Ambience Choice</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      "Family AC Lounge",
                      "Traditional Charpai / Garden",
                      "EV Charging Bay Seating",
                      "Express Counter",
                    ].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSeatingPreference(opt as any)}
                        className={`p-2.5 rounded-xl border text-left font-bold text-[11px] transition-all ${
                          seatingPreference === opt
                            ? "border-orange-500 bg-orange-50 text-orange-900 ring-2 ring-orange-400/20"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Preferences / Dietary Instructions</label>
                  <input
                    type="text"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                    placeholder="e.g. Jain food required, clean booster seat for toddler"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: IRCTC TRAIN DELIVERY */}
            {activeTab === "train_delivery" && (
              <div className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Train className="w-5 h-5 text-orange-600" />
                    <div>
                      <span className="font-extrabold text-slate-900 block">IRCTC Certified Station Delivery</span>
                      <span className="text-[11px] text-slate-600">Hot, sealed food delivered to your coach 10 mins before train halts.</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    100% On-Time Guarantee
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Train 10-Digit PNR</label>
                    <input
                      type="text"
                      value={trainPnr}
                      onChange={(e) => setTrainPnr(e.target.value)}
                      placeholder="10-Digit PNR"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">En-Route Station</label>
                    <select
                      value={trainStation}
                      onChange={(e) => setTrainStation(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                    >
                      {activeDining.deliveryToTrainStations.map((st) => (
                        <option key={st} value={st}>
                          {st} Junction
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Coach &amp; Berth Number</label>
                    <input
                      type="text"
                      value={berthInfo}
                      onChange={(e) => setBerthInfo(e.target.value)}
                      placeholder="e.g. B3 - 42"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Pre-select popular thali items */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-xs">Recommended Hot Sealed Thalis for Train Journey:</h4>
                    <span className="text-[11px] text-orange-600 font-bold">Free Sanitizer &amp; Cutlery with every box</span>
                  </div>
                  <div className="space-y-2">
                    {activeDining.menu.slice(0, 3).map((m) => {
                      const inCart = cart.find((c) => c.item.id === m.id);
                      return (
                        <div key={m.id} className="p-3 rounded-2xl border border-slate-200 flex items-center justify-between bg-white hover:border-orange-300">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-900 text-xs">{m.name}</span>
                              {m.isBestSeller && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-bold">
                                  Bestseller
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">{m.description}</span>
                            <span className="font-bold text-orange-700 mt-1 block">₹{m.price}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {inCart ? (
                              <div className="flex items-center gap-2 bg-orange-100 rounded-xl px-2 py-1">
                                <button
                                  type="button"
                                  onClick={() => removeItemFromCart(m.id)}
                                  className="w-5 h-5 rounded-lg bg-white font-bold text-slate-800 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span className="font-bold text-xs">{inCart.count}</span>
                                <button
                                  type="button"
                                  onClick={() => addItemToCart(m)}
                                  className="w-5 h-5 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => addItemToCart(m)}
                                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs"
                              >
                                + Add to Meal
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FULL MENU & PRE-ORDER CART */}
            {activeTab === "menu_order" && (
              <div className="space-y-4">
                {/* Dietary Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <button
                    type="button"
                    onClick={() => setDietaryFilter("all")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                      dietaryFilter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    All Items ({activeDining.menu.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietaryFilter("pure_veg")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                      dietaryFilter === "pure_veg" ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    100% Pure Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietaryFilter("jain")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                      dietaryFilter === "jain" ? "bg-amber-600 text-white" : "bg-amber-50 text-amber-800 hover:bg-amber-100"
                    }`}
                  >
                    Jain Friendly (No Onion/Garlic)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDietaryFilter("satvik")}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all shrink-0 ${
                      dietaryFilter === "satvik" ? "bg-purple-600 text-white" : "bg-purple-50 text-purple-800 hover:bg-purple-100"
                    }`}
                  >
                    Satvik Special
                  </button>
                </div>

                {/* Menu List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredMenuItems.map((m) => {
                    const inCart = cart.find((c) => c.item.id === m.id);
                    return (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-2xl border border-slate-200 flex flex-col justify-between bg-white hover:border-orange-300 transition-all space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                              <span className="font-bold text-slate-900 text-xs">{m.name}</span>
                            </div>
                            <span className="font-black text-orange-700 text-xs">₹{m.price}</span>
                          </div>
                          {m.hindiName && (
                            <span className="text-[10px] text-slate-400 block font-medium mt-0.5">{m.hindiName}</span>
                          )}
                          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{m.description}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{m.category}</span>
                          {inCart ? (
                            <div className="flex items-center gap-2 bg-orange-100 rounded-xl px-2 py-1">
                              <button
                                type="button"
                                onClick={() => removeItemFromCart(m.id)}
                                className="w-5 h-5 rounded-lg bg-white font-bold text-slate-800 flex items-center justify-center"
                              >
                                -
                              </button>
                              <span className="font-bold text-xs">{inCart.count}</span>
                              <button
                                type="button"
                                onClick={() => addItemToCart(m)}
                                className="w-5 h-5 rounded-lg bg-orange-600 text-white font-bold flex items-center justify-center"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addItemToCart(m)}
                              className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-xs"
                            >
                              + Add
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: REVIEWS & OFFERS */}
            {activeTab === "reviews_offers" && (
              <div className="space-y-5">
                {/* Active Promo Offers */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-pink-600" />
                    Available Promo Coupons for {activeDining.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeDining.offers.map((off) => (
                      <div
                        key={off.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                          appliedOfferCode === off.code
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 bg-white"
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-xs px-2 py-0.5 rounded-md bg-slate-900 text-amber-300">
                              {off.code}
                            </span>
                            <span className="font-bold text-emerald-700 text-xs">{off.discount}</span>
                          </div>
                          <h5 className="font-bold text-slate-900 text-xs mt-2">{off.title}</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">{off.terms}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAppliedOfferCode(off.code)}
                          className={`mt-3 w-full py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            appliedOfferCode === off.code
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          }`}
                        >
                          {appliedOfferCode === off.code ? "Applied ✓" : "Apply Code"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verified Highway Reviews */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-xs">Verified Traveler &amp; Foodie Reviews</h4>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{activeDining.rating} / 5.0</span>
                      <span className="text-slate-400 font-normal">({activeDining.reviewCount} ratings)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeDining.reviews.map((rev) => (
                      <div key={rev.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">from {rev.userCity}</span>
                            <span className="px-2 py-0.2 rounded-full bg-blue-50 text-blue-700 text-[9px] font-bold border border-blue-200">
                              {rev.verifiedTripType}
                            </span>
                          </div>
                          <div className="flex text-amber-400">
                            {"★".repeat(rev.rating)}
                          </div>
                        </div>
                        <p className="text-slate-600 text-[11px] leading-relaxed">{rev.comment}</p>
                        <div className="text-[10px] font-bold text-orange-700 flex items-center gap-1">
                          <span>Must Try:</span>
                          <span className="text-slate-800">{rev.foodDishRecommended}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Guest Contact & Summary */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact &amp; Notification Details:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="Mobile (+91)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>

            {/* Total breakdown if cart items added */}
            {cart.length > 0 && (
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Food Items Subtotal ({cart.reduce((a, b) => a + b.count, 0)} items)</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Promo Discount ({appliedOfferCode})</span>
                  <span>-₹{discountAmount}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Payable Food Amount</span>
                  <span className="text-orange-700">₹{finalFoodTotal}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Confirmation Screen */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">
                {activeTab === "table" ? "Table Reservation Confirmed!" : activeTab === "train_delivery" ? "IRCTC Train Berth Delivery Scheduled!" : "Dine-in Pre-Order Confirmed!"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {activeTab === "table"
                  ? `Your reserved table for ${guestsCount} guests at ${activeDining.name} is confirmed.`
                  : activeTab === "train_delivery"
                  ? `Your hot meal will be delivered directly to your berth at ${trainStation} Station.`
                  : `Your pre-ordered food is queued at ${activeDining.name}.`}
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-orange-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-orange-800">Booking ID / Order Token</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData?.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-orange-800">Restaurant</span>
                  <div className="text-xs font-bold text-slate-900">{activeDining.name}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Guest Info</span>
                  <span className="font-bold text-slate-900 block">{customerName} ({customerPhone})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Time &amp; Details</span>
                  <span className="font-bold text-slate-900 block">
                    {activeTab === "train_delivery" ? `PNR ${trainPnr} @ ${trainStation}` : `${reservationDate} • ${reservationTime}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          {!isConfirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing
                  ? "Confirming..."
                  : activeTab === "table"
                  ? `Confirm Free Table Reservation (${activeDining.tableDiscountPercent}% Off)`
                  : activeTab === "train_delivery"
                  ? `Confirm Train Meal (${cart.length > 0 ? `₹${finalFoodTotal}` : "Select Items"})`
                  : `Pay & Pre-Order (₹${finalFoodTotal})`}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done &amp; View in My Trips
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
