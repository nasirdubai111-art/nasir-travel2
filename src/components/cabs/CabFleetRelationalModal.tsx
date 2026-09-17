import React, { useState } from "react";
import {
  Car,
  X,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  FileText,
  User,
  Fuel,
  Star,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Printer,
  Sparkles,
  Phone,
  KeyRound,
  DollarSign,
} from "lucide-react";
import { Cab, CabBooking } from "../../types/travelVerticalsHierarchy";
import { travelVerticalsService } from "../../services/travelVerticalsService";

interface CabFleetRelationalModalProps {
  isOpen: boolean;
  onClose: () => void;
  preSelectedCabId?: string;
}

export function CabFleetRelationalModal({
  isOpen,
  onClose,
  preSelectedCabId,
}: CabFleetRelationalModalProps) {
  if (!isOpen) return null;

  const cabs = travelVerticalsService.getCabs();
  const [selectedCabId, setSelectedCabId] = useState<string>(
    preSelectedCabId || cabs[0]?.cabId || "CAB-INNOVA-001"
  );
  const [isAddingBooking, setIsAddingBooking] = useState(false);

  // New Booking Form linked to this 1 Cab
  const [newTripType, setNewTripType] = useState<
    "Outstation One-Way" | "Outstation Round-Trip" | "Local Hourly Rental" | "Airport Transfer"
  >("Outstation One-Way");
  const [customerName, setCustomerName] = useState("Rohan Mathur");
  const [customerPhone, setCustomerPhone] = useState("+91 98100 22334");
  const [customerEmail, setCustomerEmail] = useState("rohan@mail.in");
  const [pickupLocation, setPickupLocation] = useState("Vasant Kunj, New Delhi");
  const [dropLocation, setDropLocation] = useState("Taj East Gate, Agra");
  const [pickupDatetime, setPickupDatetime] = useState("2026-09-24 06:00 AM");
  const [totalEstimatedKm, setTotalEstimatedKm] = useState(230);

  const selectedCab = cabs.find((c) => c.cabId === selectedCabId) || cabs[0];
  const cabBookings = travelVerticalsService.getCabBookingsForCab(selectedCab.cabId);

  // Fare Math for new booking
  const baseFare = Math.round(totalEstimatedKm * selectedCab.baseFarePerKm);
  const tollAndTaxes = 415;
  const driverAllowance = newTripType.includes("Round-Trip") ? 450 : 0;
  const gstAmount = Math.round((baseFare + tollAndTaxes + driverAllowance) * 0.05);
  const totalAmount = baseFare + tollAndTaxes + driverAllowance + gstAmount;

  const handleCreateCabBooking = () => {
    travelVerticalsService.createCabBooking(selectedCab.cabId, {
      customerName,
      customerPhone,
      customerEmail,
      tripType: newTripType,
      pickupLocation,
      dropLocation,
      pickupDatetime,
      totalEstimatedKm,
      baseFare,
      tollAndTaxes,
      driverAllowance,
      gstAmount,
      totalAmount,
    });
    setIsAddingBooking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-5xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with 1:Many Visual Cue */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 border-b border-slate-800 text-white flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Car className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                    Cab Fleet &amp; 1:Many Bookings Architecture
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono">
                    cab (1) ➔ cab_bookings (many)
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Select a specific taxi/chauffeur vehicle to inspect all past, current, and upcoming
                  dispatches.
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

          {/* Vehicle selector pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {cabs.map((cab) => (
              <button
                key={cab.cabId}
                onClick={() => setSelectedCabId(cab.cabId)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-2 ${
                  selectedCab.cabId === cab.cabId
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 font-black"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <span>{cab.vehicleModel.split(" ")[0]} ({cab.registrationNumber})</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    selectedCab.cabId === cab.cabId
                      ? "bg-slate-950/30 text-slate-900 font-bold"
                      : "bg-slate-900 text-amber-300"
                  }`}
                >
                  {cab.allCabBookingsCount || 0} Bookings
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60 text-slate-200 space-y-6">
          {/* THE 1 (Cab Single Entity Record) */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCab.driverPhoto}
                  alt={selectedCab.driverName}
                  className="w-12 h-12 rounded-2xl object-cover border border-amber-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">{selectedCab.vehicleModel}</h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {selectedCab.cabCategory}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Registration:{" "}
                    <span className="font-mono text-cyan-300 font-bold">
                      {selectedCab.registrationNumber}
                    </span>{" "}
                    • Chauffeur: {selectedCab.driverName} ({selectedCab.driverRating} ★)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  Status: {selectedCab.status.replace("_", " ").toUpperCase()}
                </span>
                <button
                  onClick={() => setIsAddingBooking(true)}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Attach New Booking to this Cab</span>
                </button>
              </div>
            </div>

            {/* Cab Entity Spec Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">
                  cab_id (Primary Key)
                </span>
                <span className="font-mono text-amber-300 font-bold">{selectedCab.cabId}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">
                  Rate Per Kilometer
                </span>
                <span className="font-bold text-white">₹{selectedCab.baseFarePerKm} / km</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">
                  Seating &amp; Luggage
                </span>
                <span className="font-semibold text-slate-200">
                  {selectedCab.seatingCapacity} Passengers, {selectedCab.luggageBagsCapacity} Bags
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] text-slate-500 block font-bold uppercase">
                  Total Trips Completed
                </span>
                <span className="font-bold text-emerald-400">
                  {selectedCab.totalTripsCompleted} Safe Trips
                </span>
              </div>
            </div>
          </div>

          {/* THE MANY (All cab_bookings attached to this cab_id) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>
                  Attached Bookings (`cab_bookings` where cab_id = &apos;{selectedCab.cabId}&apos;)
                </span>
              </h4>
              <span className="text-xs text-slate-400 font-mono">
                {cabBookings.length} bookings linked
              </span>
            </div>

            {cabBookings.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-500 text-xs">
                No bookings currently attached to this vehicle. Click &quot;Attach New Booking&quot;
                above.
              </div>
            ) : (
              <div className="space-y-3">
                {cabBookings.map((b) => (
                  <div
                    key={b.cabBookingId}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-300">
                          {b.cabBookingId}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300">
                          {b.tripType}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 uppercase">
                          {b.bookingStatus}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="text-slate-400">
                          OTP: <strong className="text-amber-300 font-mono">{b.otpStart}</strong>
                        </span>
                        <span className="text-slate-400">
                          Invoice: <strong className="text-slate-200 font-mono">{b.taxInvoiceNumber}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">Customer</span>
                        <span className="font-bold text-white">{b.customerName}</span>
                        <span className="text-[10px] text-slate-400 block">{b.customerPhone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">
                          Pickup &amp; Drop
                        </span>
                        <p className="text-slate-200 font-medium text-[11px] truncate">
                          {b.pickupLocation} ➔ {b.dropLocation}
                        </p>
                        <span className="text-[10px] text-slate-400 block">
                          {b.pickupDatetime} ({b.totalEstimatedKm} km)
                        </span>
                      </div>
                      <div className="sm:text-right">
                        <span className="text-[10px] text-slate-500 block uppercase">
                          Total Amount Paid
                        </span>
                        <span className="font-black text-white text-sm">
                          ₹{b.totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-medium block">
                          Payment ID: {b.paymentId} (Captured)
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ADD BOOKING SUB-MODAL */}
        {isAddingBooking && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 animate-in zoom-in-95 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-amber-400 uppercase">
                    1:Many Relational Dispatch
                  </span>
                  <h4 className="text-sm font-black text-white">
                    Attach New Booking to {selectedCab.vehicleModel} ({selectedCab.cabId})
                  </h4>
                </div>
                <button onClick={() => setIsAddingBooking(false)} className="text-slate-400 hover:text-white">
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Trip Type</label>
                  <select
                    value={newTripType}
                    onChange={(e) => setNewTripType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  >
                    <option value="Outstation One-Way">Outstation One-Way</option>
                    <option value="Outstation Round-Trip">Outstation Round-Trip</option>
                    <option value="Local Hourly Rental">Local Hourly Rental (8h / 80km)</option>
                    <option value="Airport Transfer">Airport Transfer</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Customer Phone</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Pickup Location</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Drop Location</label>
                  <input
                    type="text"
                    value={dropLocation}
                    onChange={(e) => setDropLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Estimated Distance (KM)</label>
                    <input
                      type="number"
                      value={totalEstimatedKm}
                      onChange={(e) => setTotalEstimatedKm(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Total Calculated Fare</label>
                    <input
                      type="text"
                      readOnly
                      value={`₹${totalAmount.toLocaleString("en-IN")}`}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-amber-300 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddingBooking(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCabBooking}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
