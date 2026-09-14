import React, { useState } from "react";
import {
  Plane,
  Train,
  Bus,
  Building2,
  Compass,
  Car,
  Search,
  MapPin,
  Calendar,
  Users,
  ArrowRightLeft,
} from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";

export type TravelSearchMode = "flights" | "trains" | "buses" | "hotels" | "tours" | "cabs";

export interface TravelSearchProps {
  initialMode?: TravelSearchMode;
  onSearch?: (searchParams: Record<string, any>) => void;
  className?: string;
}

export const TravelSearch: React.FC<TravelSearchProps> = ({
  initialMode = "flights",
  onSearch,
  className,
}) => {
  const [activeMode, setActiveMode] = useState<TravelSearchMode>(initialMode);
  const [fromLocation, setFromLocation] = useState("New Delhi (DEL)");
  const [toLocation, setToLocation] = useState("Mumbai (BOM)");
  const [departDate, setDepartDate] = useState("Tomorrow");
  const [returnDate, setReturnDate] = useState("");
  const [travellers, setTravellers] = useState("1 Adult");
  const [travelClass, setTravelClass] = useState("Economy");
  const [rooms, setRooms] = useState("1 Room, 2 Guests");
  const [vehicleType, setVehicleType] = useState("Sedan");

  const MODES: { id: TravelSearchMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "flights", label: "Flights", icon: Plane },
    { id: "trains", label: "IRCTC Trains", icon: Train },
    { id: "buses", label: "Buses", icon: Bus },
    { id: "hotels", label: "Hotels & Stays", icon: Building2 },
    { id: "tours", label: "Tours & Yatras", icon: Compass },
    { id: "cabs", label: "Cabs & Rentals", icon: Car },
  ];

  const handleSwap = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const handleExecuteSearch = () => {
    if (onSearch) {
      onSearch({
        mode: activeMode,
        from: fromLocation,
        to: toLocation,
        departDate,
        returnDate,
        travellers,
        travelClass,
        rooms,
        vehicleType,
      });
    }
  };

  return (
    <div
      className={cn(
        "bg-white border border-[#E5E7EB] rounded-[16px] shadow-md p-4 sm:p-6 text-left",
        className
      )}
    >
      {/* Category Mode Switcher Tabs */}
      <div className="flex items-center gap-1.5 pb-4 border-b border-[#F3F4F6] overflow-x-auto no-scrollbar">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-[8px] text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer select-none",
                isActive
                  ? "bg-[#0B5ED7] text-white shadow-xs font-bold"
                  : "bg-slate-50 text-[#4B5563] hover:bg-[#E7F1FF] hover:text-[#0B5ED7]"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-white" : "text-[#0B5ED7]")} />
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Form Grid based on Active Mode */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* From / Origin / Pickup */}
        <div className="lg:col-span-3 bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] focus-within:border-[#0B5ED7] rounded-[12px] p-3 transition-colors shadow-2xs">
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            {activeMode === "hotels" ? "City / Destination" : activeMode === "cabs" ? "Pickup Location" : "From / Origin"}
          </label>
          <div className="flex items-center gap-2 mt-1">
            <MapPin className="w-4 h-4 text-[#0B5ED7] shrink-0" />
            <input
              type="text"
              value={fromLocation}
              onChange={(e) => setFromLocation(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#111827] outline-none"
              placeholder="Enter city or airport"
            />
          </div>
        </div>

        {/* Swap Button (for transit) */}
        {activeMode !== "hotels" && (
          <div className="hidden lg:flex lg:col-span-1 justify-center -mx-3 z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="w-8 h-8 rounded-full bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] hover:bg-[#E7F1FF] text-[#0B5ED7] flex items-center justify-center transition-colors cursor-pointer shadow-xs"
              title="Swap Locations"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* To / Destination (unless hotels) */}
        {activeMode !== "hotels" && (
          <div className="lg:col-span-3 bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] focus-within:border-[#0B5ED7] rounded-[12px] p-3 transition-colors shadow-2xs">
            <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
              {activeMode === "cabs" ? "Drop Destination" : "To / Destination"}
            </label>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#111827] outline-none"
                placeholder="Enter destination"
              />
            </div>
          </div>
        )}

        {/* Departure Date */}
        <div
          className={cn(
            "bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] rounded-[12px] p-3 transition-colors shadow-2xs",
            activeMode === "hotels" ? "lg:col-span-4" : "lg:col-span-3"
          )}
        >
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            {activeMode === "hotels" ? "Check-in Date" : "Departure Date"}
          </label>
          <div className="flex items-center gap-2 mt-1">
            <Calendar className="w-4 h-4 text-[#0B5ED7] shrink-0" />
            <input
              type="text"
              value={departDate}
              onChange={(e) => setDepartDate(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-bold text-[#111827] outline-none"
              placeholder="Select date"
            />
          </div>
        </div>

        {/* Travellers / Guests / Class */}
        <div
          className={cn(
            "bg-white border border-[#E5E7EB] hover:border-[#0B5ED7] rounded-[12px] p-3 transition-colors shadow-2xs",
            activeMode === "hotels" ? "lg:col-span-3" : "lg:col-span-2"
          )}
        >
          <label className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider block">
            {activeMode === "hotels" ? "Rooms & Guests" : "Travellers & Class"}
          </label>
          <div className="flex items-center gap-1.5 mt-1">
            <Users className="w-4 h-4 text-[#0B5ED7] shrink-0" />
            <span className="text-xs sm:text-sm font-bold text-[#111827] truncate">
              {activeMode === "hotels" ? rooms : travellers}
            </span>
          </div>
        </div>

        {/* Search CTA Button */}
        <div
          className={cn(
            "w-full",
            activeMode === "hotels" ? "lg:col-span-2" : "lg:col-span-12 xl:col-span-12 mt-2"
          )}
        >
          <Button
            variant="accent"
            size="lg"
            isFullWidth
            onClick={handleExecuteSearch}
            leftIcon={<Search className="w-4 h-4 text-white" />}
          >
            Search {activeMode.toUpperCase()}
          </Button>
        </div>
      </div>
    </div>
  );
};
