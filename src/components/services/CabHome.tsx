import React, { useState } from "react";
import {
  Car,
  Search,
  Users,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle2,
  Navigation,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Phone,
  Share2,
  Lock,
  FileText,
  CreditCard,
  Building2,
  Compass,
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import {
  DETAILED_CAB_VEHICLES,
  RENTAL_PACKAGES,
  POPULAR_CAB_ROUTES,
  SAMPLE_CHAUFFEURS,
  CabVehicleOption,
} from "../../data/cabData";
import { CabFareEstimateModal } from "../cabs/CabFareEstimateModal";
import { CabLiveTripModal } from "../cabs/CabLiveTripModal";
import { CabReviewModal } from "../cabs/CabReviewModal";

interface CabHomeProps {
  currentLocation: CityLocation;
  onBookCab: (cab: any) => void;
  onOpenAIDrawer: () => void;
}

export function CabHome({
  currentLocation,
  onBookCab,
  onOpenAIDrawer,
}: CabHomeProps) {
  const [cabTripType, setCabTripType] = useState<"oneway" | "roundtrip" | "hourly" | "airport">("oneway");
  const [pickupCity, setPickupCity] = useState(currentLocation.name);
  const [dropCity, setDropCity] = useState("Agra (Taj Expressway)");
  const [pickupDate, setPickupDate] = useState("2026-08-28");
  const [pickupTime, setPickupTime] = useState("06:00 AM");
  const [selectedRentalPkg, setSelectedRentalPkg] = useState<string>("h8");
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<CabVehicleOption | null>(null);
  const [isEstimateModalOpen, setIsEstimateModalOpen] = useState(false);

  // Live Trip & Review Modal states
  const [isLiveTripModalOpen, setIsLiveTripModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [activeTripData, setActiveTripData] = useState<any>({
    id: "CB-LIVE-01",
    pnr: "CAB-849201",
    otp: "5912",
    fromLocation: `${currentLocation.name} (City Center)`,
    toLocation: "Agra (Taj East Gate)",
    selectedVehicle: { categoryName: "Prime Sedan", models: "Maruti Suzuki Dzire", modelsNumber: "DL 01 TA 4421" },
    driver: SAMPLE_CHAUFFEURS[0],
  });

  const handleOpenBooking = (vehicle: CabVehicleOption) => {
    setSelectedVehicleForBooking(vehicle);
    setIsEstimateModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookCab(selectedVehicleForBooking);
  };

  const handleOpenLiveRadarWithData = (bookingData: any) => {
    setActiveTripData(bookingData);
    setIsLiveTripModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cab Hero Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-teal-950 to-cyan-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Car className="w-6 h-6" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                  Outstation, Airport &amp; Hourly Chauffeur Rentals
                </h1>
                <p className="text-xs text-cyan-200">
                  Zero Toll Surprises • Verified Chauffeurs • One-Way Drop Fares • Sanitized AC Fleets
                </p>
              </div>
            </div>

            {/* Quick Live Trip Tracking & Review Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiveTripModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-xs font-bold flex items-center gap-1.5 transition-all"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                <span>Live Trip Radar</span>
              </button>
              <button
                onClick={() => setIsReviewModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition-all flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Rate Driver</span>
              </button>
            </div>
          </div>

          {/* Cab Type Toggles */}
          <div className="flex bg-white/10 p-1.5 rounded-2xl text-xs font-bold overflow-x-auto w-fit">
            {[
              { id: "oneway", label: "Outstation One-Way" },
              { id: "roundtrip", label: "Round Trip" },
              { id: "airport", label: "Airport Transfer" },
              { id: "hourly", label: "Hourly Rental" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setCabTripType(t.id as any)}
                className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  cabTripType === t.id
                    ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                    : "text-cyan-200 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 text-slate-900 grid grid-cols-1 sm:grid-cols-4 gap-3 shadow-xl">
            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-600" /> Pickup City / Address
              </label>
              <input
                type="text"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="w-full bg-transparent font-black text-sm text-slate-900 focus:outline-none mt-0.5"
              />
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                <Compass className="w-3 h-3 text-cyan-600" />
                {cabTripType === "hourly" ? "Rental Duration" : "Destination Drop City"}
              </label>
              {cabTripType === "hourly" ? (
                <select
                  value={selectedRentalPkg}
                  onChange={(e) => setSelectedRentalPkg(e.target.value)}
                  className="w-full bg-transparent font-black text-sm text-slate-900 focus:outline-none mt-0.5 cursor-pointer"
                >
                  {RENTAL_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                  className="w-full bg-transparent font-black text-sm text-slate-900 focus:outline-none mt-0.5"
                />
              )}
            </div>

            <div className="p-3 rounded-2xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-black text-slate-400 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-600" /> Pickup Date &amp; Time
              </label>
              <div className="flex gap-2 mt-0.5">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-1/2 bg-transparent font-bold text-xs text-slate-900 focus:outline-none"
                />
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-1/2 bg-transparent font-bold text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => {
                  setSelectedVehicleForBooking(DETAILED_CAB_VEHICLES[1]);
                  setIsEstimateModalOpen(true);
                }}
                className="w-full h-full min-h-[50px] rounded-2xl bg-gradient-to-r from-cyan-600 to-slate-900 hover:from-cyan-700 hover:to-slate-950 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Search className="w-4 h-4" />
                <span>Search &amp; Estimate Fares</span>
              </button>
            </div>
          </div>

          {/* Popular City Pair Shortcuts */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs pt-1">
            <span className="text-cyan-300 font-bold shrink-0">Popular Routes:</span>
            {POPULAR_CAB_ROUTES.slice(0, 4).map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  setPickupCity(r.from);
                  setDropCity(r.to);
                }}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-100 whitespace-nowrap text-[11px] font-medium transition-all"
              >
                {r.from} ➔ {r.to} ({r.duration})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chauffeur Fleet Vehicles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Select Chauffeur Fleet Category</h2>
            <p className="text-xs text-slate-500">
              Transparent per-km billing • Zero toll surprises • FASTag express tollway clearance
            </p>
          </div>
          <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-3 py-1 rounded-xl border border-cyan-200">
            {DETAILED_CAB_VEHICLES.length} Vehicle Categories
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {DETAILED_CAB_VEHICLES.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="h-44 relative overflow-hidden bg-slate-100">
                <img
                  src={vehicle.image}
                  alt={vehicle.categoryName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-black">
                    {vehicle.categoryName}
                  </span>
                  {vehicle.isElectric && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black flex items-center gap-1">
                      <Zap className="w-3 h-3" /> 100% Electric
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-xs text-slate-900 text-xs font-black shadow-md flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{vehicle.rating}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-extrabold text-slate-900 text-base">{vehicle.categoryName}</h3>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-medium">Starts at</span>
                      <span className="text-base font-black text-cyan-800 ml-1">₹{vehicle.baseFarePerKm}/km</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{vehicle.models}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-600 py-1 border-y border-slate-100">
                    <span className="flex items-center gap-1 font-semibold">
                      <Users className="w-3.5 h-3.5 text-cyan-600" /> {vehicle.capacitySeats} Seats
                    </span>
                    <span className="font-semibold">🧳 {vehicle.capacityLuggage} Bags</span>
                    <span className="text-[11px] text-emerald-700 font-bold">✓ Zero Cancellation Fee</span>
                  </div>

                  <div className="space-y-1 pt-1">
                    {vehicle.features.slice(0, 3).map((f, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                        <span className="line-clamp-1">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">One-Way Estimate</span>
                    <span className="text-sm font-black text-slate-900">
                      ₹{Math.round(230 * vehicle.baseFarePerKm)}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(vehicle)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-slate-900 hover:from-cyan-700 hover:to-slate-950 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <span>Book Cab</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Driver Assurance & Safety Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-teal-950 rounded-3xl p-6 text-white grid grid-cols-1 md:grid-cols-3 gap-5 shadow-lg border border-slate-800">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Police &amp; KYC Verified Chauffeurs</h4>
            <p className="text-xs text-slate-300 mt-1">
              Every driver undergoes criminal record verification, Aadhaar KYC, and commercial DL checks.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">Live GPS &amp; Share Trip Link</h4>
            <p className="text-xs text-slate-300 mt-1">
              Share real-time tracking links with family and friends with single-tap 24x7 SOS integration.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm">No Highway Toll Surprises</h4>
            <p className="text-xs text-slate-300 mt-1">
              Pre-calculated FASTag tolls and state road permits with 100% transparent digital tax invoices.
            </p>
          </div>
        </div>
      </div>

      {/* Cab Booking & Fare Estimate Modal */}
      {isEstimateModalOpen && (
        <CabFareEstimateModal
          isOpen={isEstimateModalOpen}
          onClose={() => setIsEstimateModalOpen(false)}
          vehicle={selectedVehicleForBooking}
          tripType={cabTripType}
          pickupCity={pickupCity}
          dropCity={dropCity}
          onBookingSuccess={handleBookingSuccess}
          onOpenLiveTrip={handleOpenLiveRadarWithData}
        />
      )}

      {/* Cab Live Trip Modal */}
      {isLiveTripModalOpen && (
        <CabLiveTripModal
          isOpen={isLiveTripModalOpen}
          onClose={() => setIsLiveTripModalOpen(false)}
          bookingData={activeTripData}
          onCancelTrip={(tripId) => console.log("Cancelled trip", tripId)}
          onOpenReview={() => {
            setIsLiveTripModalOpen(false);
            setIsReviewModalOpen(true);
          }}
        />
      )}

      {/* Cab Review Modal */}
      {isReviewModalOpen && (
        <CabReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          tripData={activeTripData}
        />
      )}
    </div>
  );
}
