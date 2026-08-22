import React, { useState, useEffect } from "react";
import {
  X,
  Car,
  Navigation,
  Phone,
  ShieldCheck,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Star,
  Share2,
  Lock,
  Compass,
} from "lucide-react";
import { SAMPLE_CHAUFFEURS } from "../../data/cabData";

interface CabLiveTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData?: any;
  onCancelTrip?: (tripId: string) => void;
  onOpenReview?: () => void;
}

export function CabLiveTripModal({
  isOpen,
  onClose,
  bookingData,
  onCancelTrip,
  onOpenReview,
}: CabLiveTripModalProps) {
  if (!isOpen) return null;

  const [tripProgress, setTripProgress] = useState(35); // percentage
  const [currentEtaMinutes, setCurrentEtaMinutes] = useState(18);
  const [speedKmph, setSpeedKmph] = useState(64);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const driver = bookingData?.driver || SAMPLE_CHAUFFEURS[0];
  const rideOtp = bookingData?.otp || "4829";
  const pickup = bookingData?.fromLocation || "Terminal 3, IGI Airport, New Delhi";
  const drop = bookingData?.toLocation || "Taj East Gate, Agra";
  const vehicle = bookingData?.selectedVehicle || { categoryName: "Prime Sedan", models: "Maruti Suzuki Dzire", modelsNumber: "DL 01 TA 4421" };

  // Simulated live GPS progression
  useEffect(() => {
    const timer = setInterval(() => {
      setTripProgress((prev) => (prev >= 95 ? 95 : prev + 2));
      setCurrentEtaMinutes((prev) => (prev <= 3 ? 3 : prev - 1));
      setSpeedKmph(58 + Math.floor(Math.random() * 16));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleCancelClick = () => {
    setIsCancelled(true);
    if (onCancelTrip && bookingData?.id) {
      onCancelTrip(bookingData.id);
    }
  };

  const handleShareTrip = () => {
    setCopiedLink(true);
    navigator.clipboard?.writeText(`https://bharatyatra.in/track/cab/${bookingData?.pnr || "CAB-819201"}`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-teal-950 to-cyan-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse">
              <Navigation className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black">Live Cab Trip &amp; GPS Radar</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  ● ACTIVE RIDE
                </span>
              </div>
              <p className="text-xs text-cyan-200">Trip Ref: {bookingData?.pnr || "CAB-982104"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {!isCancelled ? (
            <>
              {/* Ride Start OTP Card */}
              <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-black">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase text-cyan-800 tracking-wider block">
                      Ride Start OTP (Share with Chauffeur)
                    </span>
                    <span className="text-2xl font-black text-slate-900 font-mono tracking-widest">{rideOtp}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block font-semibold">Speedometer</span>
                  <span className="text-sm font-black text-emerald-700">{speedKmph} km/h</span>
                </div>
              </div>

              {/* Simulated Map Visualizer */}
              <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner flex flex-col justify-between p-4 text-white">
                <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* GPS Header Overlay */}
                <div className="relative z-10 flex justify-between items-center text-xs">
                  <span className="px-2 py-1 rounded-lg bg-black/60 border border-white/20 font-mono flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    GPS Satellite Lock Active
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-cyan-600/80 font-bold text-[11px]">
                    ETA: {currentEtaMinutes} mins remaining
                  </span>
                </div>

                {/* Road Route Path Visualization */}
                <div className="relative z-10 my-auto py-2">
                  <div className="w-full bg-slate-700/80 h-2.5 rounded-full overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${tripProgress}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-300 mt-2 font-medium">
                    <span className="flex items-center gap-1">🟢 {pickup.slice(0, 22)}...</span>
                    <span className="flex items-center gap-1">🏁 {drop.slice(0, 22)}...</span>
                  </div>
                </div>

                {/* Live Distance Info */}
                <div className="relative z-10 flex justify-between items-center text-[11px] text-cyan-200">
                  <span>Yamuna Expressway • Milestone km 84</span>
                  <span>Vehicle: {vehicle.modelsNumber || driver.vehiclePlate}</span>
                </div>
              </div>

              {/* Driver & Vehicle Details Card */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={driver.photo}
                      alt={driver.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-cyan-500 shadow-xs"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-black text-slate-900">{driver.name}</h4>
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black border border-emerald-200">
                          ✓ Verified KYC
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {driver.vehicleModel || vehicle.models} • <span className="font-mono font-bold text-slate-800">{driver.vehiclePlate}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200 text-xs font-black text-slate-900">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{driver.rating || 4.9}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{driver.totalTrips || 1420}+ Trips</span>
                  </div>
                </div>

                {/* Driver Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                  <a
                    href={`tel:${driver.phone}`}
                    className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Call Chauffeur</span>
                  </a>
                  <button
                    onClick={handleShareTrip}
                    className="py-2 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Share2 className="w-3.5 h-3.5 text-cyan-600" />
                    <span>{copiedLink ? "Tracking Link Copied!" : "Share Live Trip"}</span>
                  </button>
                </div>
              </div>

              {/* Safety & SOS Bar */}
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-semibold text-[11px]">24x7 BharatYatra Safety Control Room monitoring this ride</span>
                </div>
                <button
                  onClick={() => alert("Emergency SOS Triggered: Alert sent to local Police Control Room & Emergency Contacts with your live GPS location.")}
                  className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-black text-[10px] uppercase shadow-xs hover:bg-rose-700"
                >
                  Emergency SOS
                </button>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                {!showCancelConfirm ? (
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Cancel Ride
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-rose-700 font-bold">100% Free cancel before OTP:</span>
                    <button
                      onClick={handleCancelClick}
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs font-black shadow-xs"
                    >
                      Confirm Cancel
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-2 py-1 text-slate-500 text-xs font-semibold"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                {onOpenReview && (
                  <button
                    onClick={onOpenReview}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-all shadow-md"
                  >
                    Rate Experience
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Trip Cancelled Successfully</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                No cancellation fee was charged. Any pre-authorized amount has been returned to your original payment method.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
