import React, { useState, useEffect } from "react";
import {
  Clock,
  Sun,
  Sunset,
  Moon,
  Compass,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Zap,
  Timer,
  Info,
} from "lucide-react";
import {
  CalendarServiceType,
  CalendarTimeSlot,
  TimeOfDayFilter,
} from "../../types";
import { CalendarService } from "../../services/CalendarService";

interface TimeSlotSelectorProps {
  serviceType: CalendarServiceType;
  selectedDate: string; // YYYY-MM-DD
  serviceId?: string;
  selectedSlotId?: string;
  onSelectSlot: (slot: CalendarTimeSlot) => void;
  // Fallback explicit time pickers for custom cabs or custom departures
  customTime?: string;
  onCustomTimeChange?: (time: string) => void;
  allowCustomTime?: boolean;
}

export function TimeSlotSelector({
  serviceType = "flights",
  selectedDate = "2026-09-03",
  serviceId,
  selectedSlotId,
  onSelectSlot,
  customTime,
  onCustomTimeChange,
  allowCustomTime = true,
}: TimeSlotSelectorProps) {
  const [timeFilter, setTimeFilter] = useState<TimeOfDayFilter>("all");
  const [is24HourFormat, setIs24HourFormat] = useState(false);
  const [slots, setSlots] = useState<CalendarTimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSlotId, setActiveSlotId] = useState<string | undefined>(selectedSlotId);

  // Load time slots from Central Engine
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    CalendarService.getTimeSlots(serviceType, selectedDate, timeFilter, serviceId)
      .then((data) => {
        if (isMounted) {
          setSlots(data);
          setIsLoading(false);
          // Auto select first available if none selected
          if (!activeSlotId && data.length > 0) {
            const firstAvail = data.find((s) => s.status !== "sold_out") || data[0];
            setActiveSlotId(firstAvail.id);
            onSelectSlot(firstAvail);
          }
        }
      })
      .catch(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [serviceType, selectedDate, timeFilter, serviceId]);

  // Format 24h to 12h or vice-versa
  const formatDisplayTime = (time24: string) => {
    if (is24HourFormat) return `${time24} hrs`;
    if (!time24) return "";
    const [hStr, mStr] = time24.split(":");
    let h = parseInt(hStr, 10);
    const m = mStr || "00";
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  // Service Timing terminology
  const timingLabels = {
    flights: { departure: "Departure Time", arrival: "Arrival Time", slotTitle: "Flight Departure Schedule" },
    trains: { departure: "Boarding Time", arrival: "De-boarding Time", slotTitle: "Train Departure Slot" },
    buses: { departure: "Bus Departure Time", arrival: "Estimated Arrival", slotTitle: "Bus Trip Schedule" },
    hotels: { departure: "Standard Check-in", arrival: "Next Day Check-out", slotTitle: "Check-in Window" },
    tours: { departure: "Tour Start Time", arrival: "Tour Return Time", slotTitle: "Sightseeing Batch" },
    pilgrimage: { departure: "Darshan Slot Start", arrival: "Aarti Concludes", slotTitle: "Temple Trust Pass Slot" },
    cabs: { departure: "Chauffeur Pickup Time", arrival: "Estimated Drop-off", slotTitle: "Dispatch Window" },
    activities: { departure: "Activity Start Time", arrival: "Activity Wrap", slotTitle: "Batch Timing" },
  };

  const currentLabel = timingLabels[serviceType] || timingLabels.flights;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-4">
      {/* Header with 12h/24h Toggle and Time Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {currentLabel.slotTitle}
            </div>
            <div className="font-extrabold text-slate-900 text-sm sm:text-base">
              Select Timings for {new Date(selectedDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
          </div>
        </div>

        {/* 12-Hour vs 24-Hour Format Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Format:</span>
          <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => setIs24HourFormat(false)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                !is24HourFormat ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              12-Hour (AM/PM)
            </button>
            <button
              type="button"
              onClick={() => setIs24HourFormat(true)}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                is24HourFormat ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              24-Hour
            </button>
          </div>
        </div>
      </div>

      {/* Time-of-Day Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
        <button
          type="button"
          onClick={() => setTimeFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            timeFilter === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Times ({slots.length})
        </button>

        <button
          type="button"
          onClick={() => setTimeFilter("morning")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            timeFilter === "morning"
              ? "bg-amber-500 text-white shadow-xs shadow-amber-500/25"
              : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60"
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Morning (06:00 - 12:00)</span>
        </button>

        <button
          type="button"
          onClick={() => setTimeFilter("afternoon")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            timeFilter === "afternoon"
              ? "bg-blue-600 text-white shadow-xs shadow-blue-600/25"
              : "bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200/60"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Afternoon (12:00 - 17:00)</span>
        </button>

        <button
          type="button"
          onClick={() => setTimeFilter("evening")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            timeFilter === "evening"
              ? "bg-indigo-600 text-white shadow-xs shadow-indigo-600/25"
              : "bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200/60"
          }`}
        >
          <Sunset className="w-3.5 h-3.5" />
          <span>Evening (17:00 - 21:00)</span>
        </button>

        <button
          type="button"
          onClick={() => setTimeFilter("night")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            timeFilter === "night"
              ? "bg-purple-900 text-white shadow-xs shadow-purple-900/25"
              : "bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200/60"
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Night (21:00 - 06:00)</span>
        </button>
      </div>

      {/* Slots List / Grid */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-bold">Synchronizing real-time time slots...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="py-8 text-center bg-slate-50 rounded-xl border border-slate-200">
          <AlertTriangle className="w-6 h-6 text-amber-500 mx-auto mb-1.5" />
          <div className="text-sm font-bold text-slate-800">No time slots available for this period</div>
          <div className="text-xs text-slate-500 mt-0.5">Please switch filter or select another date</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
          {slots.map((slot) => {
            const isSelected = slot.id === activeSlotId;
            const isSoldOut = slot.status === "sold_out";
            const isFillingFast = slot.status === "filling_fast";

            return (
              <div
                key={slot.id}
                onClick={() => {
                  if (!isSoldOut) {
                    setActiveSlotId(slot.id);
                    onSelectSlot(slot);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all ${
                  isSoldOut
                    ? "opacity-50 bg-slate-50 border-slate-200 cursor-not-allowed"
                    : isSelected
                    ? "bg-indigo-50/70 border-indigo-600 ring-2 ring-indigo-600 shadow-sm cursor-pointer"
                    : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/80 cursor-pointer"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    {/* Time representation */}
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-base">
                        {formatDisplayTime(slot.startTime)}
                      </span>
                      {slot.endTime && (
                        <>
                          <span className="text-slate-400 text-xs">➔</span>
                          <span className="font-bold text-slate-700 text-sm">
                            {formatDisplayTime(slot.endTime)}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mt-0.5">
                      {slot.slotLabel}
                    </div>
                  </div>

                  {/* Price & Selection Checkmark */}
                  <div className="text-right">
                    <div className="font-black text-sm text-slate-900">
                      ₹{slot.price.toLocaleString("en-IN")}
                    </div>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-indigo-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                      </span>
                    ) : isSoldOut ? (
                      <span className="text-[10px] font-bold uppercase text-rose-600">Sold Out</span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Select Slot</span>
                    )}
                  </div>
                </div>

                {/* Capacity & Cutoff status strip */}
                <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span className={isFillingFast ? "font-bold text-amber-700" : "text-slate-600"}>
                      {isSoldOut
                        ? "0 capacity left"
                        : `${slot.availableCapacity} spots left (${slot.capacity} total)`}
                    </span>
                  </div>

                  {isFillingFast && (
                    <span className="px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-extrabold text-[9px] uppercase tracking-wide">
                      Filling Fast
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Custom Time Picker for Cabs & Custom Service Drop */}
      {allowCustomTime && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Timer className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>
              <strong>Need a custom departure/pickup time?</strong> Type exact time if outside scheduled batches:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="time"
              value={customTime || "09:00"}
              onChange={(e) => onCustomTimeChange?.(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
