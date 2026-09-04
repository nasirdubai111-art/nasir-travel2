import React, { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plane,
  Train,
  Bus,
  Building2,
  Car,
  UtensilsCrossed,
  Palmtree,
  Map as MapIcon,
  Landmark,
  Ticket,
  QrCode,
  Eye,
  Download,
  CalendarPlus,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Share2,
  Layers,
  Filter,
  ExternalLink,
  Ship,
  Tent,
  FileSpreadsheet,
  Luggage,
} from "lucide-react";
import { BookingItem, ServiceCategory, UserProfile } from "../types";

interface TripsCalendarViewProps {
  bookings: BookingItem[];
  userProfile: UserProfile;
  onSelectPass: (booking: BookingItem) => void;
  onSelectInvoice: (booking: BookingItem) => void;
  onDownloadInvoice: (booking: BookingItem) => void;
  generatingInvoiceId: string | null;
  onSimulateWebCheckIn: (id: string) => void;
  onOpenAIDrawer: () => void;
  onOpenExpenseExport?: () => void;
  onOpenQRScanner?: () => void;
  onOpenPackingChecklist?: (booking: BookingItem) => void;
}

// Resilient Date Parser that handles diverse string representations
export function parseBookingDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const clean = dateStr.trim();

  // Try direct Date parse
  const direct = new Date(clean);
  if (!isNaN(direct.getTime())) {
    return direct;
  }

  // Common patterns: "28 Aug 2026", "04 Sep 2026", "12 Oct 2026"
  const textMonthRegex = /^(\d{1,2})[\s\-]+([A-Za-z]{3,9})[\s\-]+(\d{4})/;
  const match = clean.match(textMonthRegex);
  if (match) {
    const day = parseInt(match[1], 10);
    const monthStr = match[2].toLowerCase();
    const year = parseInt(match[3], 10);

    const monthNames = [
      "jan", "feb", "mar", "apr", "may", "jun",
      "jul", "aug", "sep", "oct", "nov", "dec"
    ];
    const monthIdx = monthNames.findIndex((m) => monthStr.startsWith(m));
    if (monthIdx !== -1) {
      return new Date(year, monthIdx, day);
    }
  }

  // Pattern: "DD/MM/YYYY" or "DD-MM-YYYY"
  const slashRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/;
  const slashMatch = clean.match(slashRegex);
  if (slashMatch) {
    const day = parseInt(slashMatch[1], 10);
    const month = parseInt(slashMatch[2], 10) - 1;
    const year = parseInt(slashMatch[3], 10);
    return new Date(year, month, day);
  }

  return null;
}

// Generate single iCalendar (.ics) string for a booking
export function generateSingleBookingICS(booking: BookingItem, userProfile: UserProfile): string {
  if (!booking) return "";
  const parsedDate = parseBookingDate(booking?.date) || new Date();
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");
  
  // Format start time if available
  let startHour = "09";
  let startMinute = "00";
  if (booking.time) {
    const timeMatch = booking.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2];
      const meridiem = timeMatch[3]?.toUpperCase();
      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      startHour = String(h).padStart(2, "0");
      startMinute = m;
    }
  }

  const startDateStr = `${year}${month}${day}T${startHour}${startMinute}00`;
  const endHour = String((parseInt(startHour, 10) + 3) % 24).padStart(2, "0");
  const endDateStr = `${year}${month}${day}T${endHour}${startMinute}00`;

  const pnr = booking.pnr || "BY-" + booking.id.slice(-6).toUpperCase();
  const summary = `🇮🇳 BharatYatra: ${booking.title}`;
  const description = `Booking PNR: ${pnr}\\nService: ${booking.serviceType || 'Travel'}\\nDetails: ${booking.subtitle || ''}\\nPassenger: ${userProfile.name}\\nSeat/Room: ${booking.seatInfo || 'Confirmed'}`;
  const location = booking.subtitle || booking.route || "India";

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BharatYatra SuperApp//Travel Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:by-trip-${booking.id}-${Date.now()}@bharatyatra.in`,
    `DTSTAMP:${startDateStr}Z`,
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "TRIGGER:-PT2H",
    "ACTION:DISPLAY",
    `DESCRIPTION:Reminder: Upcoming BharatYatra journey (${pnr}) in 2 hours`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

// Generate Google Calendar Link
export function getGoogleCalendarUrl(booking: BookingItem, userProfile: UserProfile): string {
  if (!booking) return "#";
  const parsedDate = parseBookingDate(booking?.date) || new Date();
  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  let startHour = "09";
  let startMinute = "00";
  if (booking?.time) {
    const timeMatch = booking.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2];
      const meridiem = timeMatch[3]?.toUpperCase();
      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      startHour = String(h).padStart(2, "0");
      startMinute = m;
    }
  }

  const startDateStr = `${year}${month}${day}T${startHour}${startMinute}00`;
  const endHour = String((parseInt(startHour, 10) + 3) % 24).padStart(2, "0");
  const endDateStr = `${year}${month}${day}T${endHour}${startMinute}00`;

  const pnr = booking?.pnr || "BY-" + (booking?.id ? booking.id.slice(-6).toUpperCase() : "000000");
  const text = encodeURIComponent(`🇮🇳 BharatYatra: ${booking?.title || "Trip"}`);
  const details = encodeURIComponent(
    `PNR: ${pnr}\nService: ${booking?.serviceType || "Travel"}\nDetails: ${booking?.subtitle || ""}\nPassenger: ${userProfile.name}\nSeat/Unit: ${booking?.seatInfo || "Confirmed"}`
  );
  const location = encodeURIComponent(booking?.subtitle || booking?.route || "India");

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startDateStr}/${endDateStr}&details=${details}&location=${location}`;
}

// Generate consolidated itinerary .ics file for all bookings
export function exportConsolidatedItineraryICS(bookings: BookingItem[], userProfile: UserProfile): void {
  const events = (bookings || [])
    .filter(Boolean)
    .map((booking) => {
      const parsedDate = parseBookingDate(booking?.date) || new Date();
      const year = parsedDate.getFullYear();
      const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
      const day = String(parsedDate.getDate()).padStart(2, "0");

      let startHour = "09";
      let startMinute = "00";
      if (booking.time) {
        const timeMatch = booking.time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          let h = parseInt(timeMatch[1], 10);
          const m = timeMatch[2];
          const meridiem = timeMatch[3]?.toUpperCase();
          if (meridiem === "PM" && h < 12) h += 12;
          if (meridiem === "AM" && h === 12) h = 0;
          startHour = String(h).padStart(2, "0");
          startMinute = m;
        }
      }

      const startDateStr = `${year}${month}${day}T${startHour}${startMinute}00`;
      const endHour = String((parseInt(startHour, 10) + 3) % 24).padStart(2, "0");
      const endDateStr = `${year}${month}${day}T${endHour}${startMinute}00`;

      const pnr = booking.pnr || "BY-" + booking.id.slice(-6).toUpperCase();
      const summary = `🇮🇳 BharatYatra: ${booking.title}`;
      const description = `Booking PNR: ${pnr}\\nService: ${booking.serviceType || 'Travel'}\\nDetails: ${booking.subtitle || ''}\\nPassenger: ${userProfile.name}\\nSeat: ${booking.seatInfo || 'Confirmed'}`;
      const location = booking.subtitle || booking.route || "India";

      return [
        "BEGIN:VEVENT",
        `UID:by-itinerary-${booking.id}-${Date.now()}@bharatyatra.in`,
        `DTSTAMP:${startDateStr}Z`,
        `DTSTART:${startDateStr}`,
        `DTEND:${endDateStr}`,
        `SUMMARY:${summary}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${location}`,
        "STATUS:CONFIRMED",
        "BEGIN:VALARM",
        "TRIGGER:-PT2H",
        "ACTION:DISPLAY",
        `DESCRIPTION:Reminder: Upcoming BharatYatra journey (${pnr}) in 2 hours`,
        "END:VALARM",
        "END:VEVENT",
      ].join("\r\n");
    })
    .join("\r\n");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BharatYatra SuperApp//Consolidated Travel Schedule//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    events,
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `BharatYatra_Travel_Schedule_${Date.now()}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function TripsCalendarView({
  bookings,
  userProfile,
  onSelectPass,
  onSelectInvoice,
  onDownloadInvoice,
  generatingInvoiceId,
  onSimulateWebCheckIn,
  onOpenAIDrawer,
  onOpenExpenseExport,
  onOpenQRScanner,
  onOpenPackingChecklist,
}: TripsCalendarViewProps) {
  // Mode: Month Grid vs Chronological Timeline vs Compact Agenda
  const [viewMode, setViewMode] = useState<"calendar" | "timeline">("calendar");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);

  // Chronologically sorted bookings with parsed dates
  const parsedAndSortedBookings = useMemo(() => {
    const items = (bookings || []).filter(Boolean).map((b) => {
      const parsedDate = parseBookingDate(b?.date) || new Date(2026, 7, 28);
      return {
        ...b,
        _parsedDate: parsedDate,
        _dayKey: `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, "0")}-${String(parsedDate.getDate()).padStart(2, "0")}`,
      };
    });

    // Sort chronologically ascending
    return items.sort((a, b) => a._parsedDate.getTime() - b._parsedDate.getTime());
  }, [bookings]);

  // Determine initial calendar month based on earliest upcoming booking or current month
  const initialDate = useMemo(() => {
    if (parsedAndSortedBookings.length > 0) {
      // Find first upcoming/confirmed
      const firstUpcoming = parsedAndSortedBookings.find((b) => b.status === "upcoming" || b.status === "confirmed");
      if (firstUpcoming) return new Date(firstUpcoming._parsedDate);
      return new Date(parsedAndSortedBookings[0]._parsedDate);
    }
    return new Date();
  }, [parsedAndSortedBookings]);

  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());

  // Filtered list based on category
  const filteredBookings = useMemo(() => {
    return parsedAndSortedBookings.filter((b) => {
      if (selectedCategory === "all") return true;
      return b.serviceType === selectedCategory;
    });
  }, [parsedAndSortedBookings, selectedCategory]);

  // Next upcoming booking for countdown badge
  const nextUpcomingBooking = useMemo(() => {
    const now = new Date();
    // Reset hours to compare dates only
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return parsedAndSortedBookings.find((b) => {
      return (b.status === "upcoming" || b.status === "confirmed") && b._parsedDate >= today;
    });
  }, [parsedAndSortedBookings]);

  // Calendar Day Map for current viewed month
  const bookingsByDayKey = useMemo(() => {
    const map = new Map<string, typeof parsedAndSortedBookings>();
    filteredBookings.forEach((b) => {
      const existing = map.get(b._dayKey) || [];
      existing.push(b);
      map.set(b._dayKey, existing);
    });
    return map;
  }, [filteredBookings]);

  // Helper for service icons & styling
  const getCategoryConfig = (category?: ServiceCategory) => {
    switch (category) {
      case "flights":
        return {
          icon: <Plane className="w-3.5 h-3.5 text-sky-600" />,
          bgColor: "bg-sky-50",
          textColor: "text-sky-700",
          borderColor: "border-sky-200",
          dotColor: "bg-sky-500",
          label: "Flight",
        };
      case "trains":
        return {
          icon: <Train className="w-3.5 h-3.5 text-amber-600" />,
          bgColor: "bg-amber-50",
          textColor: "text-amber-700",
          borderColor: "border-amber-200",
          dotColor: "bg-amber-500",
          label: "Train",
        };
      case "buses":
        return {
          icon: <Bus className="w-3.5 h-3.5 text-red-600" />,
          bgColor: "bg-red-50",
          textColor: "text-red-700",
          borderColor: "border-red-200",
          dotColor: "bg-red-500",
          label: "Bus",
        };
      case "hotels":
        return {
          icon: <Building2 className="w-3.5 h-3.5 text-indigo-600" />,
          bgColor: "bg-indigo-50",
          textColor: "text-indigo-700",
          borderColor: "border-indigo-200",
          dotColor: "bg-indigo-500",
          label: "Hotel",
        };
      case "resorts":
        return {
          icon: <Palmtree className="w-3.5 h-3.5 text-emerald-600" />,
          bgColor: "bg-emerald-50",
          textColor: "text-emerald-700",
          borderColor: "border-emerald-200",
          dotColor: "bg-emerald-500",
          label: "Resort",
        };
      case "houseboats":
        return {
          icon: <Ship className="w-3.5 h-3.5 text-cyan-600" />,
          bgColor: "bg-cyan-50",
          textColor: "text-cyan-700",
          borderColor: "border-cyan-200",
          dotColor: "bg-cyan-500",
          label: "Houseboat",
        };
      case "lodges":
        return {
          icon: <Tent className="w-3.5 h-3.5 text-amber-800" />,
          bgColor: "bg-amber-50",
          textColor: "text-amber-900",
          borderColor: "border-amber-300",
          dotColor: "bg-amber-700",
          label: "Lodge",
        };
      case "tours":
        return {
          icon: <MapIcon className="w-3.5 h-3.5 text-fuchsia-600" />,
          bgColor: "bg-fuchsia-50",
          textColor: "text-fuchsia-700",
          borderColor: "border-fuchsia-200",
          dotColor: "bg-fuchsia-500",
          label: "Tour",
        };
      case "pilgrimage":
        return {
          icon: <Landmark className="w-3.5 h-3.5 text-amber-700" />,
          bgColor: "bg-amber-50",
          textColor: "text-amber-800",
          borderColor: "border-amber-200",
          dotColor: "bg-amber-600",
          label: "Yatra",
        };
      case "cabs":
        return {
          icon: <Car className="w-3.5 h-3.5 text-cyan-600" />,
          bgColor: "bg-cyan-50",
          textColor: "text-cyan-700",
          borderColor: "border-cyan-200",
          dotColor: "bg-cyan-500",
          label: "Cab",
        };
      case "dining":
        return {
          icon: <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />,
          bgColor: "bg-orange-50",
          textColor: "text-orange-700",
          borderColor: "border-orange-200",
          dotColor: "bg-orange-500",
          label: "Dining",
        };
      default:
        return {
          icon: <Ticket className="w-3.5 h-3.5 text-slate-600" />,
          bgColor: "bg-slate-50",
          textColor: "text-slate-700",
          borderColor: "border-slate-200",
          dotColor: "bg-slate-500",
          label: "Ticket",
        };
    }
  };

  // Calendar month days calculation
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sun, 1 = Mon ...
    const totalDaysInMonth = lastDay.getDate();

    const days: Array<{
      dayNumber: number;
      dayKey: string;
      isCurrentMonth: boolean;
      date: Date;
      hasBookings: boolean;
      bookings: typeof parsedAndSortedBookings;
    }> = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const prevDate = new Date(currentYear, currentMonth - 1, d);
      const dayKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayBookings = bookingsByDayKey.get(dayKey) || [];
      days.push({
        dayNumber: d,
        dayKey,
        isCurrentMonth: false,
        date: prevDate,
        hasBookings: dayBookings.length > 0,
        bookings: dayBookings,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const curDate = new Date(currentYear, currentMonth, d);
      const dayKey = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayBookings = bookingsByDayKey.get(dayKey) || [];
      days.push({
        dayNumber: d,
        dayKey,
        isCurrentMonth: true,
        date: curDate,
        hasBookings: dayBookings.length > 0,
        bookings: dayBookings,
      });
    }

    // Next month padding to fill 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remainingCells; d++) {
      const nextDate = new Date(currentYear, currentMonth + 1, d);
      const dayKey = `${nextDate.getFullYear()}-${String(nextDate.getMonth() + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayBookings = bookingsByDayKey.get(dayKey) || [];
      days.push({
        dayNumber: d,
        dayKey,
        isCurrentMonth: false,
        date: nextDate,
        hasBookings: dayBookings.length > 0,
        bookings: dayBookings,
      });
    }

    return days;
  }, [currentYear, currentMonth, bookingsByDayKey]);

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToNextTrip = () => {
    if (nextUpcomingBooking) {
      setCurrentYear(nextUpcomingBooking._parsedDate.getFullYear());
      setCurrentMonth(nextUpcomingBooking._parsedDate.getMonth());
      setSelectedDayKey(nextUpcomingBooking._dayKey);
    }
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper for human-readable countdowns
  const getRelativeCountdown = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    const diffMs = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `${Math.abs(diffDays)} days ago (Completed)`, badgeClass: "bg-slate-100 text-slate-600 border-slate-200" };
    }
    if (diffDays === 0) {
      return { text: "Today's Journey! 🚀", badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300 font-black animate-pulse" };
    }
    if (diffDays === 1) {
      return { text: "Tomorrow! ⏱️", badgeClass: "bg-amber-100 text-amber-800 border-amber-300 font-bold" };
    }
    if (diffDays <= 7) {
      return { text: `In ${diffDays} days`, badgeClass: "bg-blue-100 text-blue-800 border-blue-200 font-bold" };
    }
    return { text: `In ${diffDays} days`, badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" };
  };

  // Selected Day Bookings
  const selectedDayBookings = useMemo(() => {
    if (!selectedDayKey) return [];
    return bookingsByDayKey.get(selectedDayKey) || [];
  }, [selectedDayKey, bookingsByDayKey]);

  return (
    <div className="space-y-4">
      {/* Top Banner: Travel Schedule Insights & Controls */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-4 sm:p-5 text-white border border-indigo-800/50 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 uppercase tracking-wider">
                Confirmed Travel Schedule
              </span>
              {nextUpcomingBooking && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Next: {getRelativeCountdown(nextUpcomingBooking._parsedDate).text}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Confirmed Travel Schedule &amp; Itinerary Map</span>
            </h3>
            <p className="text-xs text-slate-300 max-w-xl">
              All your booked Flights, Vande Bharat trains, hotels, and yatras synchronized in exact departure sequence.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportConsolidatedItineraryICS(parsedAndSortedBookings, userProfile)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
              title="Download standard .ics iCalendar file for Apple, Google, or Outlook Calendar"
            >
              <CalendarPlus className="w-4 h-4 text-amber-300" />
              <span>Export Full Itinerary (.ics)</span>
            </button>

            {onOpenExpenseExport && (
              <button
                onClick={onOpenExpenseExport}
                className="px-3.5 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-400/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="Export corporate expense reconciliation CSV with GST & SAC codes"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
                <span>Expense CSV</span>
              </button>
            )}

            {onOpenQRScanner && (
              <button
                onClick={onOpenQRScanner}
                className="px-3.5 py-2 rounded-xl bg-indigo-500/30 hover:bg-indigo-500/45 text-indigo-200 border border-indigo-400/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                title="Scan and validate e-tickets or boarding passes at terminal gates with live camera or image"
              >
                <QrCode className="w-4 h-4 text-indigo-300" />
                <span>Scan QR Ticket</span>
              </button>
            )}

            {nextUpcomingBooking && (
              <button
                onClick={handleJumpToNextTrip}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Jump to Next Trip</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Travel Span Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-indigo-800/40 text-xs">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Confirmed</span>
            <span className="font-mono font-bold text-sm text-white">{parsedAndSortedBookings.length} Journeys</span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Upcoming Schedule</span>
            <span className="font-mono font-bold text-sm text-emerald-400">
              {parsedAndSortedBookings.filter((b) => b.status === "upcoming" || b.status === "confirmed").length} Active
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Date Range</span>
            <span className="font-bold text-xs text-slate-200 truncate block">
              {parsedAndSortedBookings.length > 0
                ? `${parsedAndSortedBookings[0].date} ➔ ${parsedAndSortedBookings[parsedAndSortedBookings.length - 1].date}`
                : "No active trips"}
            </span>
          </div>

          <div className="bg-white/5 rounded-xl p-2.5 border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Travel Spend</span>
            <span className="font-mono font-bold text-sm text-amber-300">
              ₹{parsedAndSortedBookings.reduce((sum, b) => sum + (b.amount || 0), 0).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Filter & View Mode Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-slate-500 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" /> Filter:
          </span>
          {[
            { id: "all", label: "All Services" },
            { id: "flights", label: "✈️ Flights" },
            { id: "trains", label: "🚆 Trains" },
            { id: "buses", label: "🚌 Buses" },
            { id: "hotels", label: "🏨 Stays" },
            { id: "cabs", label: "🚕 Cabs" },
            { id: "tours", label: "🗺️ Tours & Yatra" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("calendar")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "calendar"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Monthly Grid</span>
          </button>

          <button
            onClick={() => setViewMode("timeline")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === "timeline"
                ? "bg-white text-indigo-700 shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Chronological Stream</span>
          </button>
        </div>
      </div>

      {/* View Mode 1: Monthly Calendar Grid */}
      {viewMode === "calendar" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Calendar Header with Month/Year Navigation */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h4 className="font-extrabold text-base text-slate-900">
                {monthNames[currentMonth]} {currentYear}
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                {
                  filteredBookings.filter(
                    (b) => b._parsedDate.getFullYear() === currentYear && b._parsedDate.getMonth() === currentMonth
                  ).length
                }{" "}
                Bookings in month
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const now = new Date();
                  setCurrentYear(now.getFullYear());
                  setCurrentMonth(now.getMonth());
                }}
                className="px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Today
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100/70 text-center text-[11px] font-bold text-slate-600 py-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Grid Days */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100">
            {calendarDays.map((cell, idx) => {
              const isSelected = selectedDayKey === cell.dayKey;
              const isToday =
                cell.date.toDateString() === new Date().toDateString();

              return (
                <div
                  key={`${cell.dayKey}-${idx}`}
                  onClick={() => {
                    if (cell.hasBookings) {
                      setSelectedDayKey(isSelected ? null : cell.dayKey);
                    }
                  }}
                  className={`min-h-[90px] sm:min-h-[105px] p-1.5 sm:p-2 transition-all flex flex-col justify-between ${
                    cell.isCurrentMonth ? "bg-white" : "bg-slate-50/50 text-slate-400"
                  } ${
                    cell.hasBookings
                      ? "cursor-pointer hover:bg-indigo-50/40"
                      : "cursor-default"
                  } ${
                    isSelected
                      ? "ring-2 ring-indigo-600 bg-indigo-50/60 z-10"
                      : ""
                  }`}
                >
                  {/* Day Number & Status Dot */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday
                          ? "bg-indigo-600 text-white font-black"
                          : cell.hasBookings
                          ? "text-indigo-950 font-black bg-indigo-100"
                          : cell.isCurrentMonth
                          ? "text-slate-800"
                          : "text-slate-400"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {cell.hasBookings && (
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-indigo-700 hidden sm:inline">
                          {cell.bookings.length} {cell.bookings.length > 1 ? "trips" : "trip"}
                        </span>
                      </span>
                    )}
                  </div>

                  {/* Day Bookings Visual Chips */}
                  <div className="space-y-1 mt-1 flex-1 overflow-hidden">
                    {cell.bookings.slice(0, 2).map((booking) => {
                      const cfg = getCategoryConfig(booking.serviceType);
                      return (
                        <div
                          key={booking.id}
                          className={`p-1 rounded-md border text-[10px] truncate flex items-center gap-1 font-semibold ${cfg.bgColor} ${cfg.textColor} ${cfg.borderColor} shadow-2xs`}
                          title={`${booking.title} • PNR: ${booking.pnr || "BY"}`}
                        >
                          <span className="shrink-0">{cfg.icon}</span>
                          <span className="truncate">{booking.title.split("(")[0]}</span>
                        </div>
                      );
                    })}
                    {cell.bookings.length > 2 && (
                      <div className="text-[9px] text-slate-500 font-bold text-center">
                        +{cell.bookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Date Inspector Card */}
          {selectedDayKey && (
            <div className="p-4 bg-indigo-50/80 border-t border-indigo-200 animate-in slide-in-from-top duration-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-indigo-700" />
                  <h5 className="font-extrabold text-sm text-slate-900">
                    Schedule for {selectedDayKey} ({selectedDayBookings.length} Confirmed Journey{selectedDayBookings.length > 1 ? "s" : ""})
                  </h5>
                </div>
                <button
                  onClick={() => setSelectedDayKey(null)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-bold"
                >
                  Close Day Inspector
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedDayBookings.map((b) => {
                  const cfg = getCategoryConfig(b.serviceType);
                  const countdown = getRelativeCountdown(b._parsedDate);

                  return (
                    <div
                      key={b.id}
                      className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg ${cfg.bgColor}`}>
                            {cfg.icon}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 uppercase">
                              {b.serviceType}
                            </span>
                            {b.pnr && (
                              <span className="text-[11px] font-mono text-indigo-700 ml-1.5 font-bold">
                                PNR: {b.pnr}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] border ${countdown.badgeClass}`}>
                          {countdown.text}
                        </span>
                      </div>

                      <div>
                        <h6 className="font-extrabold text-xs text-slate-900">{b.title}</h6>
                        <p className="text-[11px] text-slate-600">{b.subtitle}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-700 pt-1 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {b.time || "06:00 AM"}
                        </span>
                        <span className="font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                          {b.seatInfo || "Confirmed"}
                        </span>
                        <span className="text-slate-500">
                          {b.passengers || 1} Pax
                        </span>
                        <span className="font-extrabold text-slate-900 ml-auto">
                          ₹{b.amount.toLocaleString("en-IN")}
                        </span>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 flex-wrap">
                        <button
                          onClick={() => onSelectPass(b)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        >
                          <QrCode className="w-3 h-3" />
                          <span>Digital Pass</span>
                        </button>

                        {onOpenPackingChecklist && (b.status === "upcoming" || b.status === "confirmed") && (
                          <button
                            onClick={() => onOpenPackingChecklist(b)}
                            className="py-1.5 px-2.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                            title="Interactive Packing Checklist"
                          >
                            <Luggage className="w-3 h-3 text-indigo-600" />
                            <span>Pack</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSelectInvoice(b)}
                          className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                          title="Preview Tax Invoice"
                        >
                          <Eye className="w-3 h-3 text-indigo-600" />
                          <span>Invoice</span>
                        </button>

                        <a
                          href={getGoogleCalendarUrl(b, userProfile)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-1.5 px-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                          title="Sync to Google Calendar"
                        >
                          <ExternalLink className="w-3 h-3 text-slate-600" />
                          <span>Cal</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Chronological Timeline Stream */}
      {viewMode === "timeline" && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                Chronological Travel Sequence
              </h4>
              <p className="text-xs text-slate-500">
                Visual travel timeline plotted in strict chronological order with countdowns &amp; layover insights
              </p>
            </div>

            <button
              onClick={() => exportConsolidatedItineraryICS(parsedAndSortedBookings, userProfile)}
              className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5 hover:bg-indigo-100 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .ICS</span>
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="text-center py-10">
              <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No journeys matching this filter</p>
            </div>
          ) : (
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-200">
              {filteredBookings.map((booking, index) => {
                const cfg = getCategoryConfig(booking.serviceType);
                const countdown = getRelativeCountdown(booking._parsedDate);
                const formattedDate = booking._parsedDate.toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                // Calculate gap from previous booking if applicable
                let gapNotice = null;
                if (index > 0) {
                  const prevBooking = filteredBookings[index - 1];
                  const diffMs = booking._parsedDate.getTime() - prevBooking._parsedDate.getTime();
                  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
                  if (diffDays > 0) {
                    gapNotice = `${diffDays} day${diffDays > 1 ? "s" : ""} transit gap between departures`;
                  }
                }

                return (
                  <div key={booking.id} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-2 border-indigo-600 shadow-sm flex items-center justify-center z-10">
                      {cfg.icon}
                    </div>

                    {/* Transit Gap Pill if applicable */}
                    {gapNotice && (
                      <div className="mb-3 text-[10px] font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{gapNotice}</span>
                      </div>
                    )}

                    {/* Timeline Card */}
                    <div className="bg-slate-50/80 hover:bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-md">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            Leg {index + 1}: {booking.serviceType}
                          </span>
                          <span className="text-xs font-bold text-indigo-700">
                            {formattedDate}
                          </span>
                          {booking.pnr && (
                            <span className="text-xs font-mono text-slate-600">
                              PNR: <strong className="text-slate-900">{booking.pnr}</strong>
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] border ${countdown.badgeClass}`}>
                            {countdown.text}
                          </span>
                          <span className="text-xs font-black text-slate-900">
                            ₹{booking.amount.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Details Content */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="md:col-span-2 space-y-1">
                          <h5 className="font-black text-slate-900 text-sm sm:text-base">
                            {booking.title}
                          </h5>
                          <p className="text-xs text-slate-600">{booking.subtitle}</p>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700 pt-2">
                            <span className="flex items-center gap-1 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {booking.time || "06:00 AM"}
                            </span>
                            <span className="font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded">
                              Seat/Berth: {booking.seatInfo || "Confirmed"}
                            </span>
                            <span className="text-slate-500">
                              {booking.passengers || 1} Passenger{(booking.passengers || 1) > 1 ? "s" : ""}
                            </span>
                          </div>
                        </div>

                        {/* Direct Timeline Action Hub */}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
                          <button
                            onClick={() => onSelectPass(booking)}
                            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Digital Ticket &amp; QR</span>
                          </button>

                          <div className="flex items-center gap-2">
                            {onOpenPackingChecklist && (booking.status === "upcoming" || booking.status === "confirmed") && (
                              <button
                                onClick={() => onOpenPackingChecklist(booking)}
                                className="flex-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-800 text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                                title="Open Interactive Packing Checklist"
                              >
                                <Luggage className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Packing Checklist</span>
                              </button>
                            )}

                            <button
                              onClick={() => onSelectInvoice(booking)}
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                              title="Preview Tax Invoice"
                            >
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Invoice</span>
                            </button>

                            <a
                              href={getGoogleCalendarUrl(booking, userProfile)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                              title="Sync event to Google Calendar"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                              <span>Google Cal</span>
                            </a>
                          </div>

                          {booking.serviceType === "flights" && booking.status !== "cancelled" && (
                            <button
                              onClick={() => onSimulateWebCheckIn(booking.id)}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 hover:bg-sky-100 text-[11px] font-bold transition-colors cursor-pointer"
                            >
                              Instant Web Check-in
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
