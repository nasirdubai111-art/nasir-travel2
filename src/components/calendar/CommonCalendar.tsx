import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Sun,
  AlertCircle,
  Tag,
  Sparkles,
  Info,
  CheckCircle2,
  Ban,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import {
  CalendarDateAvailability,
  CalendarServiceType,
} from "../../types";
import { CalendarService } from "../../services/CalendarService";

interface CommonCalendarProps {
  serviceType: CalendarServiceType;
  mode?: "single" | "range";
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  onSelectSingleDate?: (date: string) => void;
  onSelectRange?: (startDate: string, endDate: string) => void;
  minDate?: string;   // Defaults to current date (2026-09-03)
  maxDaysAdvance?: number; // Defaults to 180 days
  serviceTitle?: string;
  startLabel?: string; // e.g. "Departure Date" or "Check-in"
  endLabel?: string;   // e.g. "Return Date" or "Check-out"
  onOpenRegionalHolidays?: () => void;
}

export function CommonCalendar({
  serviceType = "flights",
  mode = "single",
  startDate: initialStartDate,
  endDate: initialEndDate,
  onSelectSingleDate,
  onSelectRange,
  minDate = "2026-09-03",
  maxDaysAdvance = 180,
  startLabel,
  endLabel,
  onOpenRegionalHolidays,
}: CommonCalendarProps) {
  // Current view month & year (starting from Sept 2026)
  const initialDateObj = initialStartDate ? new Date(initialStartDate) : new Date("2026-09-03");
  const [currentYear, setCurrentYear] = useState(initialDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDateObj.getMonth() + 1); // 1-12

  // Selected date states
  const [selectedStart, setSelectedStart] = useState<string>(initialStartDate || "2026-09-03");
  const [selectedEnd, setSelectedEnd] = useState<string>(initialEndDate || "2026-09-06");
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  // Month availability data from central backend
  const [monthDates, setMonthDates] = useState<Record<string, CalendarDateAvailability>>({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchMonthDates = () => {
    setIsLoading(true);
    CalendarService.getMonthDates(serviceType, currentYear, currentMonth)
      .then((dates) => {
        const map: Record<string, CalendarDateAvailability> = {};
        dates.forEach((d) => {
          map[d.date] = d;
        });
        setMonthDates(map);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  // Load calendar availability from API
  useEffect(() => {
    fetchMonthDates();

    const handleHolidaysUpdate = () => {
      fetchMonthDates();
    };
    window.addEventListener("calendar_holidays_updated", handleHolidaysUpdate);
    return () => {
      window.removeEventListener("calendar_holidays_updated", handleHolidaysUpdate);
    };
  }, [serviceType, currentYear, currentMonth]);

  // Max allowed date calculation
  const maxDateStr = useMemo(() => {
    const minD = new Date(minDate);
    minD.setDate(minD.getDate() + maxDaysAdvance);
    return minD.toISOString().split("T")[0];
  }, [minDate, maxDaysAdvance]);

  // Labels customization based on service type
  const resolvedStartLabel =
    startLabel ||
    (serviceType === "hotels"
      ? "Check-in Date"
      : serviceType === "cabs"
      ? "Pickup Date"
      : serviceType === "tours" || serviceType === "pilgrimage"
      ? "Tour / Yatra Date"
      : "Departure Date");

  const resolvedEndLabel =
    endLabel ||
    (serviceType === "hotels"
      ? "Check-out Date"
      : serviceType === "cabs"
      ? "Drop-off / Return"
      : "Return Date");

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Quick shortcut setters
  const handleShortcut = (type: "today" | "tomorrow" | "weekend" | "next_weekend") => {
    const today = new Date("2026-09-03");
    let sDate = new Date(today);
    let eDate = new Date(today);

    if (type === "today") {
      sDate = new Date(today);
      eDate = new Date(today);
      eDate.setDate(eDate.getDate() + 2);
    } else if (type === "tomorrow") {
      sDate.setDate(today.getDate() + 1);
      eDate.setDate(today.getDate() + 3);
    } else if (type === "weekend") {
      // Find upcoming Saturday (Sept 5, 2026)
      const day = today.getDay(); // 4 = Thursday
      const daysUntilSat = (6 - day + 7) % 7 || 7;
      sDate.setDate(today.getDate() + daysUntilSat);
      eDate = new Date(sDate);
      eDate.setDate(sDate.getDate() + 1); // Sunday
    } else if (type === "next_weekend") {
      const day = today.getDay();
      const daysUntilSat = ((6 - day + 7) % 7 || 7) + 7;
      sDate.setDate(today.getDate() + daysUntilSat);
      eDate = new Date(sDate);
      eDate.setDate(sDate.getDate() + 1);
    }

    const sStr = sDate.toISOString().split("T")[0];
    const eStr = eDate.toISOString().split("T")[0];

    setSelectedStart(sStr);
    if (mode === "range") {
      setSelectedEnd(eStr);
      onSelectRange?.(sStr, eStr);
    } else {
      onSelectSingleDate?.(sStr);
    }

    // Auto navigate to that month if needed
    setCurrentYear(sDate.getFullYear());
    setCurrentMonth(sDate.getMonth() + 1);
  };

  // Date click handler
  const handleDateClick = (dateStr: string) => {
    const avail = monthDates[dateStr];
    if (dateStr < minDate || dateStr > maxDateStr) return;
    if (avail && (avail.status === "blackout" || avail.status === "sold_out")) return;

    if (mode === "single") {
      setSelectedStart(dateStr);
      onSelectSingleDate?.(dateStr);
    } else {
      // Range mode selection logic
      if (!selectedStart || (selectedStart && selectedEnd)) {
        setSelectedStart(dateStr);
        setSelectedEnd("");
      } else if (selectedStart && !selectedEnd) {
        if (dateStr < selectedStart) {
          // If user clicked an earlier date, make it the start
          setSelectedStart(dateStr);
        } else {
          setSelectedEnd(dateStr);
          onSelectRange?.(selectedStart, dateStr);
        }
      }
    }
  };

  // Calendar Grid Calculation
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth - 1, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth - 1, 0).getDate();

    const cells: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isPast: boolean;
      isFutureMax: boolean;
    }> = [];

    // Preceding empty/prev-month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 1 ? 12 : currentMonth - 1;
      const y = currentMonth === 1 ? currentYear - 1 : currentYear;
      const dStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: false,
        isPast: dStr < minDate,
        isFutureMax: dStr > maxDateStr,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        dateStr: dStr,
        dayNumber: d,
        isCurrentMonth: true,
        isPast: dStr < minDate,
        isFutureMax: dStr > maxDateStr,
      });
    }

    // Trailing days to fill 35 or 42 grid cells
    const remaining = 42 - cells.length;
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        const m = currentMonth === 12 ? 1 : currentMonth + 1;
        const y = currentMonth === 12 ? currentYear + 1 : currentYear;
        const dStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        cells.push({
          dateStr: dStr,
          dayNumber: d,
          isCurrentMonth: false,
          isPast: false,
          isFutureMax: dStr > maxDateStr,
        });
      }
    }

    return cells;
  }, [currentYear, currentMonth, minDate, maxDateStr]);

  // Month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Active hover preview date range
  const isInRange = (dateStr: string) => {
    if (mode !== "range") return false;
    const effectiveEnd = selectedEnd || hoverDate;
    if (!selectedStart || !effectiveEnd) return false;
    const start = selectedStart < effectiveEnd ? selectedStart : effectiveEnd;
    const end = selectedStart < effectiveEnd ? effectiveEnd : selectedStart;
    return dateStr > start && dateStr < end;
  };

  const selectedHoliday = monthDates[selectedStart]?.holidayName;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 flex flex-col gap-4 select-none">
      {/* Top Header: Selected Dates Summary & Shortcuts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {mode === "range" ? `${resolvedStartLabel} ➔ ${resolvedEndLabel}` : resolvedStartLabel}
            </div>
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm sm:text-base">
              <span className="text-blue-600">
                {selectedStart
                  ? new Date(selectedStart).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                  : "Choose date"}
              </span>
              {mode === "range" && (
                <>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                  <span className={selectedEnd ? "text-blue-600" : "text-slate-400 font-semibold italic"}>
                    {selectedEnd
                      ? new Date(selectedEnd).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
                      : "Choose return"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Date Shortcuts */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => handleShortcut("today")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => handleShortcut("tomorrow")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Tomorrow
          </button>
          <button
            type="button"
            onClick={() => handleShortcut("weekend")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            This Weekend
          </button>
          <button
            type="button"
            onClick={() => handleShortcut("next_weekend")}
            className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-colors whitespace-nowrap cursor-pointer"
          >
            Next Weekend
          </button>
        </div>
      </div>

      {/* Holiday / Peak Demand Alert banner */}
      {selectedHoliday && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>{selectedHoliday} Festival:</strong> High passenger demand observed. Fares may rise closer to departure.
            </span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            {onOpenRegionalHolidays && (
              <button
                type="button"
                onClick={onOpenRegionalHolidays}
                className="text-[11px] font-bold text-amber-900 hover:text-amber-950 underline cursor-pointer"
              >
                View Regional Holiday Pricing →
              </button>
            )}
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-200/70 text-amber-800">
              Holiday Peak
            </span>
          </div>
        </div>
      )}

      {/* Month & Year Navigation Toolbar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-800 text-base sm:text-lg">
            {monthNames[currentMonth - 1]} {currentYear}
          </span>
          {isLoading && (
            <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            disabled={currentYear === 2026 && currentMonth <= 9}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer text-slate-700"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 cursor-pointer text-slate-700"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 text-center text-[11px] font-black uppercase text-slate-400 border-b border-slate-100 pb-1.5">
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {calendarGrid.map((cell, idx) => {
          const avail = monthDates[cell.dateStr];
          const isSelectedStart = cell.dateStr === selectedStart;
          const isSelectedEnd = cell.dateStr === selectedEnd;
          const inRange = isInRange(cell.dateStr);

          const isBlackout = avail?.status === "blackout";
          const isSoldOut = avail?.status === "sold_out";
          const isHoliday = !!avail?.isHoliday;
          const isDisabled = cell.isPast || cell.isFutureMax || !cell.isCurrentMonth || isBlackout || isSoldOut;

          // Price display
          const displayPrice = avail ? `₹${avail.minPrice}` : null;
          const isCheapest = avail && avail.minPrice < 2500;

          return (
            <div
              key={`${cell.dateStr}-${idx}`}
              onMouseEnter={() => mode === "range" && selectedStart && !selectedEnd && setHoverDate(cell.dateStr)}
              onClick={() => !isDisabled && handleDateClick(cell.dateStr)}
              className={`relative min-h-[58px] sm:min-h-[64px] rounded-xl p-1 flex flex-col justify-between items-center transition-all ${
                isDisabled
                  ? "opacity-35 cursor-not-allowed bg-slate-50/50"
                  : "cursor-pointer hover:border-blue-400 hover:shadow-xs"
              } ${
                isSelectedStart || isSelectedEnd
                  ? "bg-blue-600 text-white font-black shadow-md shadow-blue-600/30 ring-2 ring-blue-600 z-10"
                  : inRange
                  ? "bg-blue-50 text-blue-900 border-y border-blue-200"
                  : isBlackout
                  ? "bg-rose-50/60 border border-rose-200 text-rose-800"
                  : "bg-white border border-slate-100"
              }`}
            >
              {/* Day Number + Holiday Dot */}
              <div className="w-full flex items-center justify-between px-1">
                <span
                  className={`text-xs sm:text-sm font-bold ${
                    isSelectedStart || isSelectedEnd
                      ? "text-white"
                      : cell.isCurrentMonth
                      ? "text-slate-900"
                      : "text-slate-400"
                  }`}
                >
                  {cell.dayNumber}
                </span>

                {isHoliday && !isSelectedStart && !isSelectedEnd && (
                  <span
                    className="w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"
                    title={avail.holidayName || "Public Holiday"}
                  />
                )}
                {isBlackout && (
                  <span title={avail?.blackoutReason || "Blackout Date"}>
                    <Ban className="w-3 h-3 text-rose-500" />
                  </span>
                )}
              </div>

              {/* Price Display or Sold Out Badge */}
              <div className="w-full text-center pb-0.5">
                {isBlackout ? (
                  <span className="text-[9px] font-bold text-rose-600 block">Blocked</span>
                ) : isSoldOut ? (
                  <span className="text-[9px] font-bold text-slate-400 block">Sold Out</span>
                ) : displayPrice && cell.isCurrentMonth ? (
                  <span
                    className={`text-[10px] sm:text-[11px] font-extrabold tracking-tight block ${
                      isSelectedStart || isSelectedEnd
                        ? "text-white"
                        : isCheapest
                        ? "text-emerald-600"
                        : "text-slate-600"
                    }`}
                  >
                    {displayPrice}
                  </span>
                ) : null}
              </div>

              {/* Holiday indicator name pill */}
              {isHoliday && avail?.holidayName && !isSelectedStart && !isSelectedEnd && (
                <div className="hidden sm:block absolute -top-1 right-0 text-[8px] font-black uppercase tracking-tighter px-1 rounded bg-amber-100 text-amber-800 border border-amber-200 pointer-events-none">
                  Fest
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Lowest Fare</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Festival / Holiday</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Blackout</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400">
          Advance Booking: Up to {maxDaysAdvance} days
        </div>
      </div>
    </div>
  );
}
