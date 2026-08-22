import React, { useState } from "react";
import {
  X,
  Building2,
  Star,
  MapPin,
  CheckCircle2,
  Coffee,
  Wifi,
  ShieldCheck,
  Heart,
  Calendar,
  Users,
  CreditCard,
} from "lucide-react";
import { DetailedHotelItem, HotelRoomType } from "../../data/hotelData";
import { BookingItem } from "../../types";

interface HotelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hotel: DetailedHotelItem | null;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function HotelDetailsModal({
  isOpen,
  onClose,
  hotel,
  onBookingSuccess,
}: HotelDetailsModalProps) {
  if (!isOpen || !hotel) return null;

  const [selectedRoom, setSelectedRoom] = useState<HotelRoomType>(hotel.roomTypes[0]);
  const [selectedPlanCode, setSelectedPlanCode] = useState<string>(hotel.roomTypes[0].ratePlans[0].planCode);
  const [checkInDate, setCheckInDate] = useState("2026-08-28");
  const [checkOutDate, setCheckOutDate] = useState("2026-08-30");
  const [guestsCount, setGuestsCount] = useState(2);
  const [roomsCount, setRoomsCount] = useState(1);
  const [guestName, setGuestName] = useState("Ananya Deshmukh");
  const [guestPhone, setGuestPhone] = useState("+91 98200 12345");
  const [specialRequest, setSpecialRequest] = useState("High floor room with lake view please");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  const activePlan = selectedRoom.ratePlans.find((p) => p.planCode === selectedPlanCode) || selectedRoom.ratePlans[0];
  const totalNights = 2;
  const roomBasePrice = activePlan.pricePerNight * roomsCount * totalNights;
  const taxesAmount = Math.round(roomBasePrice * 0.12);
  const finalTotal = roomBasePrice + taxesAmount;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedConfirmation = `HTL-${Math.floor(100000 + Math.random() * 900000)}`;
      const newBooking: BookingItem = {
        id: `HB-${Date.now()}`,
        serviceCategory: "hotels",
        title: `${hotel.name} (${selectedRoom.name})`,
        provider: hotel.name,
        fromLocation: hotel.city,
        toLocation: hotel.landmark,
        date: `${checkInDate} to ${checkOutDate}`,
        time: hotel.policies.checkInTime,
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedConfirmation,
        passengersCount: guestsCount,
        seatOrRoomInfo: `${roomsCount} × ${selectedRoom.name} (${activePlan.planName})`,
      };

      setConfirmedBookingData({
        ...newBooking,
        hotel,
        selectedRoom,
        activePlan,
        guestName,
      });

      onBookingSuccess(newBooking);
      setIsProcessing(false);
      setIsConfirmed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-800 via-purple-900 to-indigo-950 p-6 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold">{hotel.name}</h2>
              <div className="flex items-center gap-0.5 bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full text-xs font-black">
                <Star className="w-3 h-3 fill-slate-950" />
                <span>{hotel.rating}</span>
              </div>
            </div>
            <p className="text-xs text-indigo-200 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {hotel.address}, {hotel.city} ({hotel.landmark})
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Gallery Images Strip */}
            <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-40">
              {hotel.galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={hotel.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ))}
            </div>

            {/* Room Type Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                1. Select Room Category &amp; Bed Type:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {hotel.roomTypes.map((room) => {
                  const isSelected = selectedRoom.id === room.id;
                  return (
                    <div
                      key={room.id}
                      onClick={() => {
                        setSelectedRoom(room);
                        setSelectedPlanCode(room.ratePlans[0].planCode);
                      }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{room.name}</h4>
                          <span className="text-xs text-slate-500">{room.bedType} • {room.sizeSqFt} sq.ft</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 font-bold text-[10px]">
                          Only {room.inventoryLeft} left
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] text-slate-600">
                        {room.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100">
                            ✓ {a}
                          </span>
                        ))}
                      </div>

                      <div className="mt-3 text-right">
                        <span className="text-sm font-black text-indigo-700">
                          ₹{room.ratePlans[0].pricePerNight} <span className="text-[10px] text-slate-400 font-normal">/ night</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Meal / Rate Plan Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                2. Choose Meal Plan &amp; Cancellation:
              </h3>
              <div className="space-y-2">
                {selectedRoom.ratePlans.map((plan) => {
                  const isSelected = selectedPlanCode === plan.planCode;
                  return (
                    <div
                      key={plan.planCode}
                      onClick={() => setSelectedPlanCode(plan.planCode)}
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-3 transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/60 shadow-xs"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{plan.planName}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {plan.freeCancellationUntil}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{plan.description}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-base font-black text-indigo-700">₹{plan.pricePerNight}</span>
                        <span className="text-[10px] text-slate-400 block">per room / night</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Guest Policies & Nearby */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider">Property Rules &amp; Timings:</h4>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>• Check-in: <strong>{hotel.policies.checkInTime}</strong></div>
                <div>• Check-out: <strong>{hotel.policies.checkOutTime}</strong></div>
                <div>• Couple Friendly: <strong>{hotel.isCoupleFriendly ? "Yes (Local IDs OK)" : "No"}</strong></div>
                <div>• Cancellation: <strong>{hotel.policies.cancellationRule}</strong></div>
              </div>
            </div>

            {/* Primary Guest Info Form */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Guest Information:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Lead Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block font-bold mb-1">Mobile Number</label>
                  <input
                    type="text"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{roomsCount} Room(s) × {totalNights} Nights ({selectedRoom.name})</span>
                <span>₹{roomBasePrice}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Hotel GST (12%)</span>
                <span>₹{taxesAmount}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Payable</span>
                <span className="text-indigo-700">₹{finalTotal}</span>
              </div>
            </div>
          </div>
        ) : (
          /* Confirmed View */
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Hotel Reservation Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your booking voucher has been issued. Show confirmation SMS or ID at hotel reception during check-in.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-3xl p-5 text-left space-y-3">
              <div className="flex justify-between items-center border-b border-indigo-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-indigo-800">Booking Confirmation ID:</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-indigo-800">Status:</span>
                  <div className="text-xs font-bold text-emerald-700">Guaranteed Room</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Property</span>
                  <span className="font-bold text-slate-900 block">{hotel.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Room &amp; Rate Plan</span>
                  <span className="font-bold text-slate-900 block">{selectedRoom.name} ({activePlan.planName})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Check-In</span>
                  <span className="font-bold text-slate-900 block">{checkInDate} (From {hotel.policies.checkInTime})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Check-Out</span>
                  <span className="font-bold text-slate-900 block">{checkOutDate} (Till {hotel.policies.checkOutTime})</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-between items-center">
          {!isConfirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing ? "Confirming with Hotel..." : `Pay ₹${finalTotal} & Confirm Stay`}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
