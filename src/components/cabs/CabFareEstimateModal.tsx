import React, { useState } from "react";
import {
  X,
  Car,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Phone,
  Zap,
  Navigation,
  CreditCard,
} from "lucide-react";
import { CabVehicleOption, CAB_VEHICLE_FLEET, HOURLY_RENTAL_PACKAGES } from "../../data/cabData";
import { BookingItem } from "../../types";

interface CabFareEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: CabVehicleOption | null;
  tripType?: "oneway" | "roundtrip" | "hourly" | "airport";
  pickupCity?: string;
  dropCity?: string;
  onBookingSuccess: (booking: BookingItem) => void;
}

export function CabFareEstimateModal({
  isOpen,
  onClose,
  vehicle,
  tripType: initialTripType,
  pickupCity: initialPickupCity,
  dropCity: initialDropCity,
  onBookingSuccess,
}: CabFareEstimateModalProps) {
  if (!isOpen) return null;

  const [tripType, setTripType] = useState<"oneway" | "roundtrip" | "hourly" | "airport">(
    initialTripType || "oneway"
  );
  const [pickupCity, setPickupCity] = useState(initialPickupCity || "Delhi NCR");
  const [dropCity, setDropCity] = useState(initialDropCity || "Agra / Taj Mahal");
  const [pickupDate, setPickupDate] = useState("2026-08-28");
  const [pickupTime, setPickupTime] = useState("06:00 AM");
  const [selectedVehicle, setSelectedVehicle] = useState<CabVehicleOption>(
    vehicle || CAB_VEHICLE_FLEET[0]
  );
  const [selectedHourlyPack, setSelectedHourlyPack] = useState(HOURLY_RENTAL_PACKAGES[1]); // 8h / 80km
  const [passengerName, setPassengerName] = useState("Kavita Rao");
  const [passengerPhone, setPassengerPhone] = useState("+91 97110 22334");
  const [pickupAddress, setPickupAddress] = useState("Terminal 3, IGI Airport, New Delhi");
  const [includeTolls, setIncludeTolls] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Dynamic Distance & Price Calculation
  const estimatedKm = tripType === "oneway" ? 230 : tripType === "roundtrip" ? 460 : selectedHourlyPack.km;
  const baseRate = tripType === "hourly" ? (selectedVehicle.capacitySeats > 4 ? selectedHourlyPack.suvPrice : selectedHourlyPack.sedanPrice) : Math.round(estimatedKm * selectedVehicle.baseFarePerKm);
  const tollEstimate = includeTolls ? (tripType === "oneway" ? 415 : tripType === "roundtrip" ? 830 : 0) : 0;
  const driverBata = tripType === "roundtrip" ? selectedVehicle.driverAllowancePerNight : 0;
  const gst = Math.round((baseRate + driverBata) * 0.05);
  const finalTotal = baseRate + tollEstimate + driverBata + gst;

  const handleCheckout = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedCabPnr = `CAB-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
      const newBooking: BookingItem = {
        id: `CB-${Date.now()}`,
        serviceCategory: "cabs",
        title: `${selectedVehicle.categoryName} (${tripType.toUpperCase()})`,
        provider: "BharatYatra Chauffeur Fleet",
        fromLocation: `${pickupCity} (${pickupAddress})`,
        toLocation: dropCity,
        date: pickupDate,
        time: pickupTime,
        status: "confirmed",
        amountPaid: finalTotal,
        pnr: generatedCabPnr,
        passengersCount: selectedVehicle.capacitySeats,
        seatOrRoomInfo: `${selectedVehicle.models} • Ride Start OTP: ${generatedOtp}`,
      };

      setConfirmedBookingData({
        ...newBooking,
        selectedVehicle,
        otp: generatedOtp,
        driverName: "Manpreet Singh",
        driverPhone: "+91 98102 99881",
        vehiclePlate: "DL 01 TA 4421",
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
        <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">BharatYatra Chauffeur Cabs &amp; Rentals</h2>
              <p className="text-xs text-emerald-200">Outstation • Airport Transfer • City Hourly Rentals • Clean AC Fleets</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isConfirmed ? (
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Trip Type Selector */}
            <div className="grid grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
              {[
                { id: "oneway", label: "Outstation One-Way" },
                { id: "roundtrip", label: "Round Trip" },
                { id: "hourly", label: "Hourly Rental" },
                { id: "airport", label: "Airport Drop/Pickup" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTripType(tab.id as any)}
                  className={`py-2 rounded-xl font-bold transition-all text-center ${
                    tripType === tab.id
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Route & Date Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Pickup City &amp; Landmark</label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  {tripType === "hourly" ? "Package Duration" : "Destination Drop City"}
                </label>
                {tripType === "hourly" ? (
                  <select
                    value={selectedHourlyPack.id}
                    onChange={(e) => {
                      const pack = HOURLY_RENTAL_PACKAGES.find((p) => p.id === e.target.value);
                      if (pack) setSelectedHourlyPack(pack);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    {HOURLY_RENTAL_PACKAGES.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} - ₹{p.sedanPrice} (Sedan) / ₹{p.suvPrice} (SUV)
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={dropCity}
                    onChange={(e) => setDropCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Pickup Time</label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>
            </div>

            {/* Vehicle Fleet Selection */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Select Chauffeur Vehicle Fleet:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAB_VEHICLE_FLEET.map((fleet) => {
                  const isSelected = selectedVehicle.id === fleet.id;
                  const estimatedCost = tripType === "hourly" ? (fleet.capacitySeats > 4 ? selectedHourlyPack.suvPrice : selectedHourlyPack.sedanPrice) : Math.round(estimatedKm * fleet.baseFarePerKm);

                  return (
                    <div
                      key={fleet.id}
                      onClick={() => setSelectedVehicle(fleet)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-emerald-600 bg-emerald-50/50 shadow-md ring-2 ring-emerald-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-sm">{fleet.categoryName}</h4>
                            {fleet.isElectric && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                                100% EV
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{fleet.models}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-emerald-700">₹{estimatedCost}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-600">
                        <span>👥 {fleet.capacitySeats} Seats</span>
                        <span>🧳 {fleet.capacityLuggage} Bags</span>
                        <span>⭐ {fleet.rating}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Passenger Address & Contact */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pickup Address &amp; Contact:</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Complete Pickup Address (House / Gate / Landmark)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Passenger Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                  <input
                    type="text"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="Contact Mobile (+91)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Toll & State Tax inclusion */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTolls}
                  onChange={(e) => setIncludeTolls(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-semibold text-slate-700">Include Expressways Toll &amp; FASTag (No Cash on Highway)</span>
              </label>
              <span className="font-bold text-slate-800">+ ₹{tollEstimate}</span>
            </div>

            {/* Price Summary */}
            <div className="border-t border-slate-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-slate-600">
                <span>Base Fare ({estimatedKm} Km @ ₹{selectedVehicle.baseFarePerKm}/km)</span>
                <span>₹{baseRate}</span>
              </div>
              {driverBata > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Chauffeur Night Allowance</span>
                  <span>₹{driverBata}</span>
                </div>
              )}
              {includeTolls && (
                <div className="flex justify-between text-slate-600">
                  <span>Estimated Toll / State Border Permit</span>
                  <span>₹{tollEstimate}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>GST (5%)</span>
                <span>₹{gst}</span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Payable</span>
                <span className="text-emerald-700">₹{finalTotal}</span>
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
              <h3 className="text-xl font-extrabold text-slate-900">Chauffeur Assigned &amp; Confirmed!</h3>
              <p className="text-xs text-slate-500 mt-1">
                Your driver partner has been booked. Share the 4-digit OTP with your captain only when you board.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-emerald-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Booking ID:</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-emerald-800">Start OTP:</span>
                  <div className="text-base font-black font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {confirmedBookingData.otp}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Chauffeur</span>
                  <span className="font-bold text-slate-900 block">{confirmedBookingData.driverName} ({confirmedBookingData.driverPhone})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Model &amp; Reg</span>
                  <span className="font-bold text-slate-900 block">{selectedVehicle.models} ({confirmedBookingData.vehiclePlate})</span>
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
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing ? "Confirming Fleet..." : `Pay ₹${finalTotal} & Book Cab`}
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
