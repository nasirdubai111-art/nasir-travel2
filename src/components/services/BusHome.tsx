import React, { useState } from "react";
import {
  Bus,
  Search,
  Star,
  Zap,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Wifi,
  Coffee,
  CheckCircle2,
  Radio,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ArrowRightLeft,
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_BUSES, DetailedBusItem } from "../../data/busData";
import { BusSeatMapModal } from "../buses/BusSeatMapModal";
import { BusLiveTrackingModal } from "../buses/BusLiveTrackingModal";
import { TravelCheckbox } from "../common/TravelCheckbox";

interface BusHomeProps {
  currentLocation: CityLocation;
  onBookBus: (bus: any) => void;
  onOpenAIDrawer: () => void;
}

export function BusHome({
  currentLocation,
  onBookBus,
  onOpenAIDrawer,
}: BusHomeProps) {
  const [fromCity, setFromCity] = useState(currentLocation.name || "New Delhi");
  const [toCity, setToCity] = useState("Jaipur");
  const [journeyDate, setJourneyDate] = useState("2026-09-02");

  // Checkbox Filter states
  const [filterElectric, setFilterElectric] = useState(false);
  const [filterVolvo, setFilterVolvo] = useState(false);
  const [filterPrimo, setFilterPrimo] = useState(false);
  const [filterAcSleeper, setFilterAcSleeper] = useState(false);
  const [filterGpsOnly, setFilterGpsOnly] = useState(false);
  const [filterWifi, setFilterWifi] = useState(false);

  const [selectedBusForSeatMap, setSelectedBusForSeatMap] = useState<DetailedBusItem | null>(null);
  const [selectedBusForTracking, setSelectedBusForTracking] = useState<DetailedBusItem | null>(null);

  const filteredBuses = DETAILED_BUSES.filter((bus) => {
    if (filterElectric && !bus.isElectric) return false;
    if (filterVolvo && !bus.busType.toLowerCase().includes("volvo")) return false;
    if (filterPrimo && !bus.isPrimo) return false;
    if (filterAcSleeper && !bus.busType.toLowerCase().includes("sleeper")) return false;
    if (filterGpsOnly && !bus.liveTracking) return false;
    return true;
  });

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookBus(selectedBusForSeatMap);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Hero Bus Banner */}
      <div className="bg-gradient-to-br from-[#0B5ED7] via-[#172033] to-[#0B5ED7] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="max-w-5xl space-y-6 relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20">
                <Bus className="w-6 h-6 text-[#38BDF8]" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Intercity Volvo &amp; Electric Bus Hub
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#16A34A]/20 text-[#16A34A] text-xs font-bold border border-[#16A34A]/40 uppercase bg-white">
                    Live GPS Tracking
                  </span>
                </div>
                <p className="text-sm text-slate-200 mt-0.5">
                  10,000+ AC Sleeper &amp; Seater Routes • On-time Guarantee • Female Passenger Safe Rows
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenAIDrawer}
              className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs flex items-center gap-1.5 border border-white/20 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              <span>Ask AI Bus Deals</span>
            </button>
          </div>

          {/* Search Inputs (Height 48-52px) */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
            {/* From City */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">From Origin</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full h-11 bg-white text-[#172033] font-medium pl-9 pr-3 rounded-xl focus:outline-hidden text-sm"
                  placeholder="Leaving from..."
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex items-end justify-center pb-0.5">
              <button
                type="button"
                onClick={() => {
                  const temp = fromCity;
                  setFromCity(toCity);
                  setToCity(temp);
                }}
                className="w-11 h-11 rounded-xl bg-white text-[#0B5ED7] hover:bg-[#F0F7FF] flex items-center justify-center shadow-xs transition-transform active:scale-95 cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* To City */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">To Destination</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full h-11 bg-white text-[#172033] font-medium pl-9 pr-3 rounded-xl focus:outline-hidden text-sm"
                  placeholder="Going to..."
                />
              </div>
            </div>

            {/* Journey Date */}
            <div className="md:col-span-3 space-y-1">
              <label className="text-slate-200 text-xs font-semibold block">Date of Journey</label>
              <input
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full h-11 bg-white text-[#172033] font-medium px-3 rounded-xl focus:outline-hidden text-sm"
              />
            </div>

            {/* Search Trigger */}
            <div className="md:col-span-2 flex items-end">
              <button
                type="button"
                className="w-full h-11 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout (240-260px Filter Sidebar + Bus Cards) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Bus Filter Sidebar */}
        <aside className="w-full lg:w-[256px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-5 text-[#172033]">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#0B5ED7]" />
              <h3 className="text-sm font-bold text-[#172033]">Bus Filters</h3>
            </div>
            <span className="text-xs text-[#64748B]">{filteredBuses.length} buses</span>
          </div>

          {/* Bus Type */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Bus Type</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="bus-filter-electric"
                checked={filterElectric}
                onChange={setFilterElectric}
                label="🌱 Electric Bus (NueGo)"
                count="Zero Emission"
              />
              <TravelCheckbox
                id="bus-filter-volvo"
                checked={filterVolvo}
                onChange={setFilterVolvo}
                label="🚌 Volvo Multi-Axle"
              />
              <TravelCheckbox
                id="bus-filter-primo"
                checked={filterPrimo}
                onChange={setFilterPrimo}
                label="⭐ Primo Certified"
                count="Top Rated"
              />
              <TravelCheckbox
                id="bus-filter-sleeper"
                checked={filterAcSleeper}
                onChange={setFilterAcSleeper}
                label="🛏️ AC Sleeper (2+1)"
              />
            </div>
          </div>

          {/* Amenities & Tracking */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Features</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="bus-feat-gps"
                checked={filterGpsOnly}
                onChange={setFilterGpsOnly}
                label="📡 Live GPS Tracking"
              />
              <TravelCheckbox
                id="bus-feat-wifi"
                checked={filterWifi}
                onChange={setFilterWifi}
                label="📶 High-Speed WiFi"
              />
              <TravelCheckbox
                id="bus-feat-charging"
                checked={true}
                onChange={() => {}}
                label="🔌 Power Outlets"
              />
              <TravelCheckbox
                id="bus-feat-water"
                checked={true}
                onChange={() => {}}
                label="💧 Mineral Water Bottle"
              />
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="pt-3 border-t border-[#E2E8F0] space-y-3">
            <h4 className="text-xs font-bold text-[#64748B] uppercase tracking-wider">Cancellation Policy</h4>
            <div className="space-y-2.5">
              <TravelCheckbox
                id="bus-cancel-free"
                checked={true}
                onChange={() => {}}
                label="Free Cancellation (up to 6h)"
              />
              <TravelCheckbox
                id="bus-cancel-instant"
                checked={true}
                onChange={() => {}}
                label="Instant UPI Refund"
              />
            </div>
          </div>
        </aside>

        {/* Bus Listing */}
        <div className="flex-1 space-y-4 w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#172033] flex items-center gap-2">
              <span>Available Intercity Buses ({filteredBuses.length})</span>
            </h2>
            <span className="text-xs text-[#16A34A] font-semibold bg-[#16A34A]/10 px-2.5 py-1 rounded-full border border-[#16A34A]/20">
              ✓ ₹500 Delay Guarantee
            </span>
          </div>

          <div className="space-y-4">
            {filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className="bg-white rounded-2xl border border-[#E2E8F0] p-5 sm:p-6 hover:border-[#0B5ED7] hover:shadow-xs transition-all flex flex-col lg:flex-row justify-between lg:items-center gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-[#172033] text-[16px]">{bus.operator}</h3>
                    <div className="flex items-center gap-0.5 bg-[#FF8A00] text-white px-2 py-0.5 rounded-md text-xs font-bold">
                      <Star className="w-3 h-3 fill-white" />
                      <span>{bus.rating}</span>
                    </div>
                    {bus.isPrimo && (
                      <span className="px-2 py-0.5 rounded-full bg-[#F0F7FF] text-[#0B5ED7] text-[10px] font-bold uppercase border border-[#0B5ED7]/30">
                        Primo 5★
                      </span>
                    )}
                    {bus.isElectric && (
                      <span className="px-2 py-0.5 rounded-full bg-[#16A34A]/10 text-[#16A34A] text-[10px] font-bold uppercase border border-[#16A34A]/30 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-[#16A34A]" /> Zero Emission
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#64748B] font-medium">{bus.busType}</p>

                  {/* Route & Times */}
                  <div className="flex items-center gap-4 text-xs pt-1">
                    <div>
                      <span className="font-bold text-[#172033] text-sm">{bus.departureTime}</span>
                      <span className="text-[11px] text-[#64748B] block">{bus.fromCity}</span>
                    </div>
                    <div className="text-center px-2.5 py-1 rounded-lg bg-[#F5F9FC] text-[#64748B] text-[11px] font-bold border border-[#E2E8F0]">
                      {bus.duration}
                    </div>
                    <div>
                      <span className="font-bold text-[#172033] text-sm">{bus.arrivalTime}</span>
                      <span className="text-[11px] text-[#64748B] block">{bus.toCity}</span>
                    </div>
                  </div>

                  {/* Amenities Badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {bus.amenities.map((am, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-[#F5F9FC] text-[#64748B] text-[11px] font-medium border border-[#E2E8F0]">
                        {am.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E2E8F0]">
                  <div className="text-left lg:text-right">
                    <div className="text-xl font-bold text-[#172033]">
                      ₹{bus.price.toLocaleString("en-IN")}
                    </div>
                    <span className="text-[11px] text-[#16A34A] font-semibold block">
                      {bus.availableSeatsCount} Seats Left
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedBusForTracking(bus)}
                      className="h-10 px-3 rounded-xl bg-[#F0F7FF] hover:bg-[#0B5ED7]/10 text-[#0B5ED7] text-xs font-semibold transition-colors flex items-center gap-1.5 border border-[#0B5ED7]/20 cursor-pointer"
                      title="Live GPS Bus Location"
                    >
                      <Radio className="w-3.5 h-3.5 animate-pulse" />
                      <span className="hidden sm:inline">Track Bus</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedBusForSeatMap(bus)}
                      className="h-10 px-5 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Select Seats</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Seat Map & Booking Modal */}
      <BusSeatMapModal
        isOpen={!!selectedBusForSeatMap}
        onClose={() => setSelectedBusForSeatMap(null)}
        bus={selectedBusForSeatMap}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* Live GPS Telemetry Modal */}
      <BusLiveTrackingModal
        isOpen={!!selectedBusForTracking}
        onClose={() => setSelectedBusForTracking(null)}
        bus={selectedBusForTracking}
      />
    </div>
  );
}
