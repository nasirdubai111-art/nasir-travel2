import React, { useState } from "react";
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
  Anchor,
  Sun,
  BedDouble,
  Sparkles,
} from "lucide-react";
import { HouseboatItem, HouseboatCabin, HouseboatPackage, BookingItem } from "../../types";

interface HouseboatDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  houseboat: HouseboatItem;
  onBookSuccess: (booking: BookingItem) => void;
}

export function HouseboatDetailsModal({
  isOpen,
  onClose,
  houseboat,
  onBookSuccess,
}: HouseboatDetailsModalProps) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "cabins" | "packages" | "itinerary" | "reviews">("overview");
  const [selectedCabin, setSelectedCabin] = useState<HouseboatCabin>(houseboat.cabins[0]);
  const [selectedPackage, setSelectedPackage] = useState<HouseboatPackage>(houseboat.packages[0]);
  const [checkInDate, setCheckInDate] = useState("2026-09-15");
  const [guestCount, setGuestCount] = useState(2);
  const [guestName, setGuestName] = useState("Ananya Sharma");
  const [guestPhone, setGuestPhone] = useState("+91 98450 11223");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Price calculations
  const baseRate = selectedPackage?.startingPrice || selectedCabin?.pricePerNight || houseboat.startingPricePerNight;
  const gst = Math.round(baseRate * 0.12);
  const portSafetyFee = 250;
  const grandTotal = baseRate + gst + portSafetyFee;

  const handleCheckout = () => {
    setIsProcessing(true);

    const bookingPayload = {
      houseboatId: houseboat.id,
      houseboatName: houseboat.name,
      destination: houseboat.destination,
      packageId: selectedPackage.id,
      packageName: selectedPackage.title,
      cabinId: selectedCabin.id,
      cabinName: selectedCabin.name,
      checkInDate,
      guestCount,
      guestName,
      guestPhone,
      totalAmount: grandTotal,
      portRegistrationNumber: houseboat.portRegistrationNumber,
    };

    fetch("/api/houseboats/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    })
      .then((r) => r.json())
      .catch(() => ({}))
      .finally(() => {
        const generatedPnr = `HB-${Math.floor(100000 + Math.random() * 900000)}`;
        const newBooking: BookingItem = {
          id: `HBK-${Date.now()}`,
          serviceCategory: "houseboats",
          title: `${houseboat.name} (${selectedPackage.title})`,
          provider: houseboat.operatorName,
          fromLocation: houseboat.routes[0]?.startPoint || houseboat.destination,
          toLocation: houseboat.routes[0]?.endPoint || houseboat.waterbody,
          date: checkInDate,
          time: selectedPackage.checkInTime,
          status: "confirmed",
          amountPaid: grandTotal,
          pnr: generatedPnr,
          passengersCount: guestCount,
          seatOrRoomInfo: `${selectedCabin.name} • ${selectedPackage.mealPlanIncluded}`,
        };

        setConfirmedBookingData({
          ...newBooking,
          houseboat,
          selectedPackage,
          selectedCabin,
          voucherId: `VOUCH-HB-${Math.floor(10000 + Math.random() * 90000)}`,
        });

        onBookSuccess(newBooking);
        setIsProcessing(false);
        setIsConfirmed(true);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 via-teal-950 to-slate-950 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black">{houseboat.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-black uppercase">
                  {houseboat.category}
                </span>
              </div>
              <p className="text-xs text-cyan-200 flex items-center gap-2">
                <span>📍 {houseboat.destination} ({houseboat.waterbody})</span>
                <span>• Port Reg: {houseboat.portRegistrationNumber}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <>
            {/* Nav Tabs */}
            <div className="flex bg-slate-100 p-1.5 border-b border-slate-200 overflow-x-auto text-xs font-bold">
              {[
                { id: "overview", label: "Overview & Meals" },
                { id: "cabins", label: `Cabins (${houseboat.cabins.length})` },
                { id: "packages", label: `Packages & Rates (${houseboat.packages.length})` },
                { id: "itinerary", label: "Route & Itinerary" },
                { id: "reviews", label: `Guest Reviews (${houseboat.reviews.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-white text-slate-900 shadow-xs font-black border border-slate-200"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Tab 1: Overview & Dining */}
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Photo Gallery Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <img
                      src={houseboat.image}
                      alt={houseboat.name}
                      className="sm:col-span-2 h-56 w-full object-cover rounded-2xl shadow-xs"
                    />
                    <div className="grid grid-cols-1 gap-3">
                      {houseboat.gallery.slice(1, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt="Gallery view"
                          className="h-[106px] w-full object-cover rounded-2xl"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Highlights Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl text-center">
                      <span className="text-[10px] text-cyan-800 font-bold uppercase block">Charter Type</span>
                      <span className="text-xs font-black text-slate-900">{houseboat.charterType}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                      <span className="text-[10px] text-emerald-800 font-bold uppercase block">Private Crew</span>
                      <span className="text-xs font-black text-slate-900">{houseboat.crewCount} Onboard (Captain &amp; Chef)</span>
                    </div>
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-center">
                      <span className="text-[10px] text-amber-800 font-bold uppercase block">Rating</span>
                      <span className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {houseboat.rating} ({houseboat.reviewsCount} reviews)
                      </span>
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-center">
                      <span className="text-[10px] text-indigo-800 font-bold uppercase block">Safety Certified</span>
                      <span className="text-xs font-black text-slate-900">Port Approved Vessel</span>
                    </div>
                  </div>

                  {/* Dining Inclusions */}
                  <div className="p-4 rounded-2xl border border-cyan-200 bg-cyan-50/50 space-y-2.5">
                    <div className="flex items-center gap-2 text-cyan-900 font-black text-sm">
                      <Utensils className="w-4 h-4 text-cyan-700" />
                      <span>Onboard Gourmet Dining Inclusions:</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {houseboat.diningHighlights.map((dish, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span>{dish}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-2">
                    <h4 className="font-black text-slate-900 uppercase tracking-wider text-xs">Vessel Amenities &amp; Deck Facilities:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {houseboat.amenities.map((amenity, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                          <Anchor className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span className="font-semibold">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Cabins */}
              {activeTab === "cabins" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {houseboat.cabins.map((cabin) => {
                      const isSelected = selectedCabin.id === cabin.id;
                      return (
                        <div
                          key={cabin.id}
                          onClick={() => setSelectedCabin(cabin)}
                          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20 shadow-md"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <img
                            src={cabin.image}
                            alt={cabin.name}
                            className="h-36 w-full object-cover rounded-xl mb-3"
                          />
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-900">{cabin.name}</h4>
                              <span className="text-[10px] text-cyan-700 font-bold block">{cabin.type}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-cyan-900">₹{cabin.pricePerNight}</span>
                              <span className="text-[10px] text-slate-400 block">/night</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-600 my-2">
                            <span>👥 Max {cabin.capacity} Guests</span>
                            <span>🛏️ {cabin.bedType}</span>
                            <span>❄️ {cabin.acTiming}</span>
                          </div>

                          <div className="space-y-1 pt-1 border-t border-slate-200">
                            {cabin.features.map((f, i) => (
                              <div key={i} className="text-[10px] text-slate-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{f}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 3: Packages */}
              {activeTab === "packages" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {houseboat.packages.map((pkg) => {
                      const isSelected = selectedPackage.id === pkg.id;
                      return (
                        <div
                          key={pkg.id}
                          onClick={() => setSelectedPackage(pkg)}
                          className={`rounded-2xl border p-4 cursor-pointer transition-all ${
                            isSelected
                              ? "border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20 shadow-md"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-black uppercase">
                                {pkg.type}
                              </span>
                              <h4 className="font-extrabold text-sm text-slate-900 mt-1">{pkg.title}</h4>
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-black text-cyan-900">₹{pkg.startingPrice}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 mt-2 font-medium">{pkg.description}</p>

                          <div className="bg-white p-2.5 rounded-xl border border-slate-200 mt-3 space-y-1 text-[11px]">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Timings:</span>
                              <span className="font-bold text-slate-800">{pkg.checkInTime} to {pkg.checkOutTime}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Cruising Time:</span>
                              <span className="font-bold text-slate-800">{pkg.cruiseHours}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Meals:</span>
                              <span className="font-bold text-emerald-700">{pkg.mealPlanIncluded}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 4: Itinerary */}
              {activeTab === "itinerary" && (
                <div className="space-y-4">
                  {houseboat.routes.map((route) => (
                    <div key={route.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-4">
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{route.name}</h4>
                        <p className="text-xs text-cyan-800 font-semibold">
                          Cruise Duration: {route.cruiseDuration} • Jetty: {route.startPoint}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {route.highlights.map((h, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700">
                            🌊 {h}
                          </span>
                        ))}
                      </div>

                      <div className="space-y-3 pt-2">
                        {route.itinerary.map((leg, i) => (
                          <div key={i} className="flex gap-3 text-xs">
                            <span className="w-16 font-mono font-black text-cyan-800 shrink-0">{leg.time}</span>
                            <div className="flex-1 bg-white p-2.5 rounded-xl border border-slate-200">
                              <span className="font-bold text-slate-900 block">{leg.title}</span>
                              <span className="text-slate-600 text-[11px]">{leg.activity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 5: Reviews */}
              {activeTab === "reviews" && (
                <div className="space-y-3">
                  {houseboat.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-cyan-600 text-white font-black flex items-center justify-center text-xs">
                            {rev.author[0]}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{rev.author} ({rev.city})</span>
                            <span className="text-[10px] text-slate-400">{rev.tripType} • {rev.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{rev.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Guest Details & Booking Form Bar */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="font-black text-xs text-slate-900 uppercase tracking-wider">
                  Select Dates &amp; Primary Guest Details:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Guest Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Contact Mobile (+91)</label>
                    <input
                      type="text"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-slate-600">
                <div className="flex justify-between">
                  <span>Package Base Rate ({selectedPackage?.title || houseboat.name})</span>
                  <span>₹{baseRate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Port Authority Environmental &amp; Safety Surcharge</span>
                  <span>₹{portSafetyFee}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (12%)</span>
                  <span>₹{gst}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Grand Total (All Inclusive)</span>
                  <span className="text-cyan-900">₹{grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-slate-900 hover:from-cyan-700 hover:to-slate-950 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing ? "Reserving Houseboat..." : `Pay ₹${grandTotal} & Book Stay`}
              </button>
            </div>
          </>
        ) : (
          /* Confirmed Digital Voucher View */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Houseboat Cruise Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your private charter reservation is secured with {houseboat.operatorName}.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-3xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-cyan-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-cyan-800">Booking Ref / PNR</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData?.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-cyan-800">Digital Voucher ID</span>
                  <div className="text-sm font-black font-mono text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                    {confirmedBookingData?.voucherId}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Houseboat &amp; Package</span>
                  <span className="font-bold text-slate-900 block">{houseboat.name} ({selectedPackage.title})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Jetty / Boarding Point</span>
                  <span className="font-bold text-slate-900 block">{houseboat.locationCoordinates?.jettyAddress || houseboat.destination}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-2xl border border-cyan-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 block">Boarding Pass &amp; Port Permit</span>
                  <span className="text-[11px] text-slate-500">Show QR at jetty check-in desk</span>
                </div>
                <QrCode className="w-10 h-10 text-cyan-900" />
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done &amp; View My Trips
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
