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
  SlidersHorizontal,
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
import { TravelCheckbox } from "../common/TravelCheckbox";

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

  // Checkbox filters
  const [filterElectric, setFilterElectric] = useState(false);
  const [filterSuv, setFilterSuv] = useState(false);
  const [filterSedan, setFilterSedan] = useState(false);
  const [filterFreeCancel, setFilterFreeCancel] = useState(true);

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

  const filteredVehicles = DETAILED_CAB_VEHICLES.filter((vehicle) => {
    if (filterElectric && !vehicle.isElectric) return false;
    if (filterSuv && vehicle.capacitySeats < 6) return false;
    if (filterSedan && (vehicle.capacitySeats > 4 || !vehicle.categoryName.toLowerCase().includes("sedan"))) return false;
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Cab Hero Banner */}
      <div className="bg-gradient-to-br from-[#0B5ED7] via-[#172033] to-[#0B5ED7] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Car className="w-6 h-6 text-[#38BDF8]" />
              </span>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Outstation, Airport &amp; Hourly Chauffeur Rentals
                </h1>
                <p className="text-sm text-slate-200 mt-0.5">
                  Zero Toll Surprises • Verified Chauffeurs • One-Way Drop Fares • Sanitized AC Fleets
                </p>
              </div>
            </div>

            {/* Quick Live Trip Tracking & Review Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setIsLiveTripModalOpen(true)}
                className="h-10 px-3.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" />
                <span>Live Trip Radar</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all flex items-center gap-1 cursor-pointer border border-white/15"
              >
                <Star className="w-3.5 h-3.5 text-[#FF8A00] fill-[#FF8A00]" />
                <span>Rate Driver</span>
              </button>
            </div>
          </div>

          {/* Cab Type Toggles */}
          <div className="flex bg-white/15 p-1 rounded-xl text-xs font-semibold overflow-x-auto w-fit border border-white/20">
            {[
              { id: "oneway", label: "Outstation One-Way" },
              { id: "roundtrip", label: "Round Trip" },
              { id: "airport", label: "Airport Transfer" },
              { id: "hourly", label: "Hourly Rental" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setCabTripType(t.id as any)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  cabTripType === t.id
                    ? "bg-white text-[#0B5ED7] font-bold shadow-xs"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search Card (Height 48-52px) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 sm:grid-cols-4 gap-3 text-sm">
            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" /> Pickup City / Address
              </label>
              <input
                type="text"
                value={pickupCity}
                onChange={(e) => setPickupCity(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-[#38BDF8]" />
                {cabTripType === "hourly" ? "Rental Duration" : "Destination Drop City"}
              </label>
              {cabTripType === "hourly" ? (
                <select
                  value={selectedRentalPkg}
                  onChange={(e) => setSelectedRentalPkg(e.target.value)}
                  className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm cursor-pointer"
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
                  className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
                />
              )}
            </div>

            <div className="space-y-1">
              <label className="text-slate-200 text-xs font-semibold block flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#38BDF8]" /> Pickup Date &amp; Time
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-1/2 h-11 bg-white text-[#172033] font-medium px-2 rounded-xl focus:outline-hidden text-xs"
                />
                <input
                  type="text"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-1/2 h-11 bg-white text-[#172033] font-medium px-2 rounded-xl focus:outline-hidden text-xs"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedVehicleForBooking(DETAILED_CAB_VEHICLES[1]);
                  setIsEstimateModalOpen(true);
                }}
                className="w-full h-11 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search &amp; Estimate</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section (240-260px Filter Sidebar + Vehicle Cards) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Cab Filter Sidebar */}
        <aside className="w-full lg:w-[256px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-5 text-[#172033]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B5ED7]" />
              <h3 className="text-sm font-bold text-[#172033]">Cab Filters</h3>
            </div>
            <span className="text-xs text-[#64748B]">{filteredVehicles.length} options</span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Vehicle Type</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="cab-filter-ev"
                checked={filterElectric}
                onChange={setFilterElectric}
                label="⚡ 100% Electric EV"
                count="Zero Emission"
              />
              <TravelCheckbox
                id="cab-filter-suv"
                checked={filterSuv}
                onChange={setFilterSuv}
                label="🚙 SUV (6-7 Seater)"
              />
              <TravelCheckbox
                id="cab-filter-sedan"
                checked={filterSedan}
                onChange={setFilterSedan}
                label="🚗 Prime Sedan (4 Seater)"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Inclusions</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="cab-feat-cancel"
                checked={filterFreeCancel}
                onChange={setFilterFreeCancel}
                label="✓ Free Cancellation"
              />
              <TravelCheckbox
                id="cab-feat-toll"
                checked={true}
                onChange={() => {}}
                label="✓ Toll & Taxes Included"
              />
              <TravelCheckbox
                id="cab-feat-ac"
                checked={true}
                onChange={() => {}}
                label="✓ Sanitized & AC Working"
              />
            </div>
          </div>
        </aside>

        {/* Cab Vehicle Listings */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#172033]">Available Chauffeur Fleets &amp; Rates</h2>
              <p className="text-xs text-[#64748B]">All fares include fuel, driver allowance, FASTag tolls, and state permits</p>
            </div>
            <span className="text-xs font-semibold text-[#0B5ED7] bg-[#F0F7FF] px-3 py-1 rounded-xl border border-[#0B5ED7]/20">
              {filteredVehicles.length} Vehicle Categories
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-xs hover:border-[#0B5ED7] transition-all duration-300 flex flex-col group"
              >
                <div className="h-44 relative overflow-hidden bg-slate-100">
                  <img
                    src={vehicle.image}
                    alt={vehicle.categoryName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-[#172033]/80 backdrop-blur-xs text-white text-[10px] font-bold">
                      {vehicle.categoryName}
                    </span>
                    {vehicle.isElectric && (
                      <span className="px-2.5 py-1 rounded-md bg-[#16A34A] text-white text-[10px] font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3" /> 100% Electric
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-xs text-[#172033] text-xs font-bold shadow-xs flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00]" />
                    <span>{vehicle.rating}</span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-[#172033] text-base">{vehicle.categoryName}</h3>
                      <div className="text-right">
                        <span className="text-xs text-[#64748B]">Starts at</span>
                        <span className="text-base font-bold text-[#0B5ED7] ml-1">₹{vehicle.baseFarePerKm}/km</span>
                      </div>
                    </div>
                    <p className="text-xs text-[#64748B] font-medium">{vehicle.models}</p>

                    <div className="flex items-center gap-4 text-xs text-[#64748B] py-1 border-y border-[#E2E8F0]">
                      <span className="flex items-center gap-1 font-semibold text-[#172033]">
                        <Users className="w-3.5 h-3.5 text-[#0B5ED7]" /> {vehicle.capacitySeats} Seats
                      </span>
                      <span className="font-semibold text-[#172033]">🧳 {vehicle.capacityLuggage} Bags</span>
                      <span className="text-[11px] text-[#16A34A] font-bold">✓ Zero Cancel Fee</span>
                    </div>

                    <div className="space-y-1 pt-1">
                      {vehicle.features.slice(0, 3).map((f, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                          <span className="line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#64748B] uppercase font-semibold block">One-Way Estimate</span>
                      <span className="text-sm font-bold text-[#172033]">
                        ₹{Math.round(230 * vehicle.baseFarePerKm)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleOpenBooking(vehicle)}
                      className="h-10 px-4 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white font-semibold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
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
      </div>

      {/* Driver Assurance & Safety Banner */}
      <div className="bg-white rounded-2xl p-6 text-[#172033] grid grid-cols-1 md:grid-cols-3 gap-5 shadow-xs border border-[#E2E8F0]">
        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-[#F0F7FF] text-[#0B5ED7] border border-[#0B5ED7]/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#172033]">Police &amp; KYC Verified Chauffeurs</h4>
            <p className="text-xs text-[#64748B] mt-1">
              Every driver undergoes criminal record verification, Aadhaar KYC, and commercial DL checks.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20">
            <Navigation className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#172033]">Live GPS &amp; Share Trip Link</h4>
            <p className="text-xs text-[#64748B] mt-1">
              Share real-time tracking links with family and friends with single-tap 24x7 SOS integration.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-3 rounded-xl bg-[#FF8A00]/10 text-[#FF8A00] border border-[#FF8A00]/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#172033]">No Highway Toll Surprises</h4>
            <p className="text-xs text-[#64748B] mt-1">
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
        />
      )}

      {/* Live Trip Radar Modal */}
      {isLiveTripModalOpen && (
        <CabLiveTripModal
          isOpen={isLiveTripModalOpen}
          onClose={() => setIsLiveTripModalOpen(false)}
          bookingData={activeTripData}
          onCancelTrip={() => setIsLiveTripModalOpen(false)}
          onOpenReview={() => {
            setIsLiveTripModalOpen(false);
            setIsReviewModalOpen(true);
          }}
        />
      )}

      {/* Driver Review Modal */}
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
