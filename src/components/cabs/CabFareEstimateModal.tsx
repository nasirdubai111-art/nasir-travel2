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
  Banknote,
  QrCode,
  FileText,
} from "lucide-react";
import { CabVehicleOption, CAB_VEHICLE_FLEET, HOURLY_RENTAL_PACKAGES, SAMPLE_CHAUFFEURS } from "../../data/cabData";
import { BookingItem } from "../../types";

interface CabFareEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle?: CabVehicleOption | null;
  tripType?: "oneway" | "roundtrip" | "hourly" | "airport";
  pickupCity?: string;
  dropCity?: string;
  onBookingSuccess: (booking: BookingItem) => void;
  onOpenLiveTrip?: (bookingData: any) => void;
}

export function CabFareEstimateModal({
  isOpen,
  onClose,
  vehicle,
  tripType: initialTripType,
  pickupCity: initialPickupCity,
  dropCity: initialDropCity,
  onBookingSuccess,
  onOpenLiveTrip,
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
    vehicle || CAB_VEHICLE_FLEET[1] // Default Prime Sedan
  );
  const [selectedHourlyPack, setSelectedHourlyPack] = useState(HOURLY_RENTAL_PACKAGES[1]); // 8h / 80km
  const [passengerName, setPassengerName] = useState("Kavita Rao");
  const [passengerPhone, setPassengerPhone] = useState("+91 97110 22334");
  const [pickupAddress, setPickupAddress] = useState("Terminal 3, IGI Airport, New Delhi");
  const [paymentMode, setPaymentMode] = useState<"UPI" | "Card" | "NetBanking" | "Cash">("UPI");
  const [includeTolls, setIncludeTolls] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBookingData, setConfirmedBookingData] = useState<any>(null);

  // Distance & Price Calculation
  const estimatedKm = tripType === "oneway" ? 230 : tripType === "roundtrip" ? 460 : tripType === "airport" ? 45 : selectedHourlyPack.km;
  const baseRate =
    tripType === "hourly"
      ? selectedVehicle.capacitySeats > 6
        ? selectedHourlyPack.innovaPrice
        : selectedVehicle.capacitySeats > 4
        ? selectedHourlyPack.suvPrice
        : selectedHourlyPack.sedanPrice
      : Math.round(estimatedKm * selectedVehicle.baseFarePerKm);

  const tollEstimate = includeTolls ? (tripType === "oneway" ? 415 : tripType === "roundtrip" ? 830 : tripType === "airport" ? 150 : 0) : 0;
  const driverBata = tripType === "roundtrip" ? selectedVehicle.driverAllowancePerNight : 0;
  const gst = Math.round((baseRate + driverBata) * 0.05);
  const finalTotal = baseRate + tollEstimate + driverBata + gst;

  const assignedChauffeur = SAMPLE_CHAUFFEURS[Math.floor(Math.random() * SAMPLE_CHAUFFEURS.length)];

  const handleCheckout = () => {
    setIsProcessing(true);

    const bookingPayload = {
      tripType,
      pickupCity,
      dropCity: tripType === "hourly" ? selectedHourlyPack.name : dropCity,
      pickupAddress,
      pickupDate,
      pickupTime,
      vehicleId: selectedVehicle.id,
      vehicleCategory: selectedVehicle.categoryName,
      models: selectedVehicle.models,
      passengerName,
      passengerPhone,
      paymentMode,
      distanceKm: estimatedKm,
      totalFare: finalTotal,
      includeTolls,
    };

    fetch("/api/cabs/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingPayload),
    })
      .then((r) => r.json())
      .catch(() => ({}))
      .finally(() => {
        const generatedCabPnr = `CAB-${Math.floor(100000 + Math.random() * 900000)}`;
        const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
        const newBooking: BookingItem = {
          id: `CB-${Date.now()}`,
          serviceCategory: "cabs",
          title: `${selectedVehicle.categoryName} (${tripType.toUpperCase()})`,
          provider: "BharatYatra Chauffeur Fleet",
          fromLocation: `${pickupCity} (${pickupAddress})`,
          toLocation: tripType === "hourly" ? selectedHourlyPack.name : dropCity,
          date: pickupDate,
          time: pickupTime,
          status: "confirmed",
          amountPaid: finalTotal,
          pnr: generatedCabPnr,
          passengersCount: selectedVehicle.capacitySeats,
          seatOrRoomInfo: `${selectedVehicle.models} • Ride OTP: ${generatedOtp}`,
        };

        const fullBookingData = {
          ...newBooking,
          selectedVehicle,
          otp: generatedOtp,
          driver: assignedChauffeur,
          driverName: assignedChauffeur.name,
          driverPhone: assignedChauffeur.phone,
          vehiclePlate: assignedChauffeur.vehiclePlate,
          paymentMode,
        };

        setConfirmedBookingData(fullBookingData);
        onBookingSuccess(newBooking);
        setIsProcessing(false);
        setIsConfirmed(true);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-900 via-teal-950 to-slate-950 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">BharatYatra Chauffeur Cabs &amp; Rentals</h2>
              <p className="text-xs text-cyan-200">Outstation • Airport Transfer • City Hourly Rentals • Clean AC Fleets</p>
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
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1 text-xs">
            {/* Trip Type Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
              {[
                { id: "oneway", label: "Outstation One-Way" },
                { id: "roundtrip", label: "Round Trip" },
                { id: "hourly", label: "Hourly Rental" },
                { id: "airport", label: "Airport Transfer" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setTripType(tab.id as any)}
                  className={`py-2 rounded-xl font-bold transition-all text-center ${
                    tripType === tab.id
                      ? "bg-white text-slate-900 shadow-xs border border-slate-200"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  {tripType === "hourly" ? "Rental Package Duration" : "Destination Drop City"}
                </label>
                {tripType === "hourly" ? (
                  <select
                    value={selectedHourlyPack.id}
                    onChange={(e) => {
                      const pack = HOURLY_RENTAL_PACKAGES.find((p) => p.id === e.target.value);
                      if (pack) setSelectedHourlyPack(pack);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
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
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
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
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Pickup Time</label>
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Vehicle Fleet Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Select Chauffeur Vehicle Fleet ({CAB_VEHICLE_FLEET.length}):
                </h3>
                <span className="text-[11px] text-slate-500">Live GPS &amp; Fastag Included</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CAB_VEHICLE_FLEET.map((fleet) => {
                  const isSelected = selectedVehicle.id === fleet.id;
                  const estimatedCost =
                    tripType === "hourly"
                      ? fleet.capacitySeats > 6
                        ? selectedHourlyPack.innovaPrice
                        : fleet.capacitySeats > 4
                        ? selectedHourlyPack.suvPrice
                        : selectedHourlyPack.sedanPrice
                      : Math.round(estimatedKm * fleet.baseFarePerKm);

                  return (
                    <div
                      key={fleet.id}
                      onClick={() => setSelectedVehicle(fleet)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? "border-cyan-600 bg-cyan-50/60 shadow-md ring-2 ring-cyan-500/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-slate-900 text-xs">{fleet.categoryName}</h4>
                            {fleet.isElectric && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                                ⚡ EV
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block line-clamp-1">{fleet.models}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-black text-cyan-800">₹{estimatedCost}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-600 font-medium">
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
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Pickup Address &amp; Contact:</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Complete Pickup Address (House / Terminal / Gate / Landmark)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Passenger Name"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                  <input
                    type="text"
                    value={passengerPhone}
                    onChange={(e) => setPassengerPhone(e.target.value)}
                    placeholder="Contact Mobile (+91)"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="font-bold text-slate-700 block">Select Payment Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "UPI", label: "UPI / GPay / PhonePe", icon: QrCode },
                  { id: "Card", label: "Debit / Credit Card", icon: CreditCard },
                  { id: "NetBanking", label: "Net Banking", icon: Banknote },
                  { id: "Cash", label: "Pay Cash to Driver", icon: Banknote },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMode(m.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        paymentMode === m.id
                          ? "bg-cyan-600 text-white border-cyan-600 shadow-xs font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-[10px]">{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toll & State Tax inclusion */}
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeTolls}
                  onChange={(e) => setIncludeTolls(e.target.checked)}
                  className="w-4 h-4 text-cyan-600 rounded"
                />
                <span className="font-semibold text-slate-700 text-xs">Include Expressways Toll &amp; FASTag (Zero Highway Cash)</span>
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
                <span className="text-cyan-800">₹{finalTotal}</span>
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
                Your verified chauffeur has been dispatched. Share the 4-digit OTP with your captain only when you board.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-3xl p-5 text-left space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-cyan-200 pb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase text-cyan-800">Trip Ref:</span>
                  <div className="text-base font-black font-mono text-slate-950">{confirmedBookingData?.pnr}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase text-cyan-800">Ride Start OTP:</span>
                  <div className="text-base font-black font-mono text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-md">
                    {confirmedBookingData?.otp}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Chauffeur</span>
                  <span className="font-bold text-slate-900 block">{confirmedBookingData?.driverName} ({confirmedBookingData?.driverPhone})</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Vehicle Model &amp; Reg</span>
                  <span className="font-bold text-slate-900 block">{selectedVehicle.models} ({confirmedBookingData?.vehiclePlate})</span>
                </div>
              </div>
            </div>

            {/* Action to Track Live */}
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenLiveTrip) onOpenLiveTrip(confirmedBookingData);
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                <span>Track Ride on Live GPS Radar</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          {!isConfirmed ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-slate-900 hover:from-cyan-700 hover:to-slate-950 text-white font-black text-xs shadow-md transition-all flex items-center gap-2"
              >
                {isProcessing ? "Confirming Fleet & Dispatching..." : `Pay ₹${finalTotal} & Book Cab`}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
