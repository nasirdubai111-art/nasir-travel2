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
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_CAB_VEHICLES, RENTAL_PACKAGES, CabVehicleOption } from "../../data/cabData";
import { CabFareEstimateModal } from "../cabs/CabFareEstimateModal";

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
  const [dropCity, setDropCity] = useState("Agra");
  const [selectedRentalPkg, setSelectedRentalPkg] = useState<string>("8hr_80km");
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<CabVehicleOption | null>(null);

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookCab(selectedVehicleForBooking);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Cab Hero Banner */}
      <div className="bg-gradient-to-br from-cyan-900 via-teal-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                <Car className="w-5 h-5" />
              </span>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Outstation, Airport &amp; Hourly Chauffeur Rentals
                </h1>
                <p className="text-xs text-cyan-200">Zero Toll Surprises • Verified Chauffeurs • One-Way Drop Fares • Sanitized AC Fleets</p>
              </div>
            </div>

            {/* Cab Type Toggles */}
            <div className="flex bg-white/10 p-1 rounded-xl text-xs font-semibold overflow-x-auto">
              {[
                { id: "oneway", label: "Outstation One-Way" },
                { id: "roundtrip", label: "Round Trip" },
                { id: "airport", label: "Airport Transfer" },
                { id: "hourly", label: "Hourly Rental" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setCabTripType(t.id as any)}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    cabTripType === t.id ? "bg-cyan-500 text-slate-950 font-bold shadow-xs" : "text-cyan-200 hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 text-slate-900 grid grid-cols-1 sm:grid-cols-3 gap-3 shadow-lg">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">Pickup City / Address</label>
              <input
                type="text"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none mt-0.5"
              />
            </div>

            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
              <label className="text-[10px] uppercase font-bold text-slate-400 block">
                {cabTripType === "hourly" ? "Rental Duration" : "Destination Drop City"}
              </label>
              {cabTripType === "hourly" ? (
                <select
                  value={selectedRentalPkg}
                  onChange={(e) => setSelectedRentalPkg(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none mt-0.5 cursor-pointer"
                >
                  {RENTAL_PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.name} ({pkg.hours} hrs / {pkg.km} km)
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={dropCity}
                  onChange={(e) => setDropCity(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-900 focus:outline-none mt-0.5"
                />
              )}
            </div>

            <div className="flex items-center">
              <button
                type="button"
                className="w-full h-full min-h-[48px] rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Calculate Exact Fare</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fleet Choice Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center justify-between">
          <span>Available Fleet for {pickupCity} ➔ {dropCity}</span>
          <span className="text-xs text-slate-400 font-normal">All Tolls &amp; State Taxes Included</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {DETAILED_CAB_VEHICLES.map((cab) => (
            <div
              key={cab.id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 hover:border-cyan-400 hover:shadow-xl transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{cab.categoryName}</h3>
                    <p className="text-xs text-slate-500">{cab.models}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-xl">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{cab.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                  <span>👥 {cab.capacitySeats} Seater</span>
                  <span>🧳 {cab.capacityLuggage} Bags</span>
                  <span>❄️ AC Included</span>
                  <span className="font-mono text-cyan-700 font-bold">₹{cab.baseFarePerKm}/km</span>
                </div>

                {/* Features */}
                <div className="mt-3 space-y-1">
                  {cab.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xl font-black text-slate-900">
                    ₹{Math.round(cab.baseFarePerKm * (cabTripType === "oneway" ? 220 : 450)).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">No hidden toll surcharges</span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedVehicleForBooking(cab)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <span>Fare Quote &amp; Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cab Fare Estimator & Driver Booking Modal */}
      <CabFareEstimateModal
        isOpen={!!selectedVehicleForBooking}
        onClose={() => setSelectedVehicleForBooking(null)}
        vehicle={selectedVehicleForBooking}
        tripType={cabTripType}
        pickupCity={pickupCity}
        dropCity={dropCity}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}

