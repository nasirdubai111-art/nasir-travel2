import {
  CalendarSchedule,
  CalendarTimeSlot,
  CalendarDateAvailability,
  CalendarHoliday,
  CalendarBlackoutDate,
  OperatingHoursRule,
  BookingCutoffRule,
  CancellationCutoffRule,
  CalendarServiceType,
  TimeOfDayFilter,
  CalendarEngineOverview,
} from "../types";
import { INITIAL_REGIONAL_HOLIDAYS, getStateNameByCode } from "../data/regionalHolidaysData";

const HOLIDAYS_STORAGE_KEY = "bharat_regional_holidays_v2";

export class CalendarService {
  /**
   * Fetch system overview metrics
   */
  static async getOverview(): Promise<CalendarEngineOverview> {
    try {
      const res = await fetch("/api/calendar/overview");
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const json = await res.json();
      return json.data;
    } catch {
      return {
        totalSchedules: 24,
        activeTimeSlots: 18,
        totalHolidays: 12,
        activeBlackoutDates: 4,
        overallCapacity: 4500,
        availableCapacity: 2840,
        occupancyRate: 37,
        upcomingHoliday: {
          id: "hol-03",
          date: "2026-09-04",
          name: "Janmashtami",
          type: "festival",
          surgePercent: 25,
          description: "Peak pilgrimage demand for Mathura, Vrindavan, and Dwarka.",
        },
      };
    }
  }

  /**
   * Fetch availability for a date range and service
   */
  static async getAvailability(
    serviceType: CalendarServiceType = "flights",
    startDate: string = "2026-09-01",
    endDate: string = "2026-09-30"
  ): Promise<CalendarDateAvailability[]> {
    try {
      const params = new URLSearchParams({ serviceType, startDate, endDate });
      const res = await fetch(`/api/calendar/availability?${params.toString()}`);
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const json = await res.json();
      return json.data || [];
    } catch {
      return this.generateFallbackDates(serviceType, startDate, endDate);
    }
  }

  /**
   * Fetch calendar month dates
   */
  static async getMonthDates(
    serviceType: CalendarServiceType = "flights",
    year: number = 2026,
    month: number = 9
  ): Promise<CalendarDateAvailability[]> {
    try {
      const params = new URLSearchParams({
        serviceType,
        year: year.toString(),
        month: month.toString(),
      });
      const res = await fetch(`/api/calendar/dates?${params.toString()}`);
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const json = await res.json();
      return json.data || [];
    } catch {
      const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
      return this.generateFallbackDates(serviceType, startDate, endDate);
    }
  }

  /**
   * Fetch time slots with filtering
   */
  static async getTimeSlots(
    serviceType: CalendarServiceType = "flights",
    date: string = "2026-09-03",
    timeOfDay: TimeOfDayFilter = "all",
    serviceId?: string
  ): Promise<CalendarTimeSlot[]> {
    try {
      const params = new URLSearchParams({ serviceType, date, timeOfDay });
      if (serviceId) params.append("serviceId", serviceId);
      const res = await fetch(`/api/calendar/time-slots?${params.toString()}`);
      if (!res.ok) throw new Error("HTTP error " + res.status);
      const json = await res.json();
      return json.data || [];
    } catch {
      return this.getFallbackTimeSlots(serviceType, date, timeOfDay);
    }
  }

  /**
   * Holidays Local Storage & Cache Helper
   */
  static getLocalHolidays(): CalendarHoliday[] {
    try {
      const stored = localStorage.getItem(HOLIDAYS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return INITIAL_REGIONAL_HOLIDAYS;
  }

  static saveLocalHolidays(holidays: CalendarHoliday[]): void {
    try {
      localStorage.setItem(HOLIDAYS_STORAGE_KEY, JSON.stringify(holidays));
      window.dispatchEvent(new CustomEvent("calendar_holidays_updated", { detail: { holidays } }));
    } catch {
      // ignore
    }
  }

  /**
   * Fetch Regional Holidays via GET /api/calendar/holidays/regional?state={stateCode}
   * Directly queries the PostgreSQL regional_holidays database table representation
   */
  static async getRegionalHolidays(
    stateCode: string = "ALL",
    options?: { includeNational?: boolean; year?: number; month?: number; service?: string }
  ): Promise<{
    data: CalendarHoliday[];
    count: number;
    state: string;
    stateCode: string;
    stateName: string;
    dbSchema?: any;
    meta?: any;
  }> {
    try {
      const params = new URLSearchParams();
      if (stateCode) params.append("state", stateCode);
      if (options?.includeNational !== undefined) {
        params.append("includeNational", String(options.includeNational));
      }
      if (options?.year) params.append("year", String(options.year));
      if (options?.month) params.append("month", String(options.month));
      if (options?.service) params.append("service", options.service);

      const res = await fetch(`/api/calendar/holidays/regional?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          return {
            data: json.data,
            count: json.count ?? json.data.length,
            state: json.state || stateCode,
            stateCode: json.stateCode || stateCode,
            stateName: json.stateName || stateCode,
            dbSchema: json.dbSchema,
            meta: json.meta,
          };
        }
      }
    } catch {
      // fallback
    }

    const all = this.getLocalHolidays();
    const upper = stateCode ? stateCode.toUpperCase() : "ALL";
    if (upper === "ALL") {
      return {
        data: all,
        count: all.length,
        state: "ALL",
        stateCode: "ALL",
        stateName: "All India / National",
      };
    }

    const filtered = all.filter(
      (h) =>
        h.stateCode === upper ||
        h.applicableStateCodes?.includes(upper) ||
        h.category === "national" ||
        h.stateCode === "ALL"
    );

    return {
      data: filtered,
      count: filtered.length,
      state: upper,
      stateCode: upper,
      stateName: getStateNameByCode(upper),
    };
  }

  /**
   * Holidays API with regional state filtering
   */
  static async getHolidays(stateFilter?: string): Promise<CalendarHoliday[]> {
    try {
      const params = stateFilter ? `?state=${encodeURIComponent(stateFilter)}` : "";
      const res = await fetch(`/api/calendar/holidays${params}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch {
      // fallback to local storage / memory
    }
    const all = this.getLocalHolidays();
    if (!stateFilter || stateFilter === "ALL" || stateFilter === "All India / National") {
      return all;
    }
    return all.filter(
      (h) =>
        h.category === "national" ||
        h.state?.toLowerCase().includes(stateFilter.toLowerCase()) ||
        h.applicableStates?.some((st) => st.toLowerCase().includes(stateFilter.toLowerCase()))
    );
  }

  static async updateHoliday(
    id: string,
    updates: Partial<CalendarHoliday>
  ): Promise<CalendarHoliday> {
    const list = this.getLocalHolidays();
    const idx = list.findIndex((h) => h.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      this.saveLocalHolidays(list);
      return list[idx];
    }
    return updates as CalendarHoliday;
  }

  static async toggleHolidayPricing(id: string, enabled: boolean): Promise<CalendarHoliday> {
    return this.updateHoliday(id, { pricingEnabled: enabled });
  }

  static async resetHolidaysToDefault(): Promise<CalendarHoliday[]> {
    this.saveLocalHolidays(INITIAL_REGIONAL_HOLIDAYS);
    return INITIAL_REGIONAL_HOLIDAYS;
  }

  static async addHoliday(holiday: Partial<CalendarHoliday>): Promise<CalendarHoliday> {
    const list = this.getLocalHolidays();
    const newHol: CalendarHoliday = {
      id: holiday.id || `hol-${Date.now()}`,
      date: holiday.date || "2026-09-04",
      name: holiday.name || "Special Regional Holiday",
      type: holiday.type || "festival",
      category: holiday.category || "state",
      surgePercent: holiday.surgePercent ?? 25,
      description: holiday.description || "State-specific public holiday",
      state: holiday.state || "Maharashtra",
      applicableStates: holiday.applicableStates || ["Maharashtra"],
      isLongWeekend: holiday.isLongWeekend ?? false,
      longWeekendDays: holiday.longWeekendDays ?? 1,
      pricingEnabled: holiday.pricingEnabled ?? true,
      availabilityStatus: holiday.availabilityStatus || "available",
      affectedServices: holiday.affectedServices || ["flights", "trains", "buses", "hotels"],
    };
    list.push(newHol);
    this.saveLocalHolidays(list);
    return newHol;
  }

  /**
   * Blackout Dates API
   */
  static async addBlackoutDate(blackout: Partial<CalendarBlackoutDate>): Promise<CalendarBlackoutDate> {
    const res = await fetch("/api/calendar/blackout-dates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(blackout),
    });
    const json = await res.json();
    return json.data;
  }

  static async removeBlackoutDate(id: string): Promise<boolean> {
    const res = await fetch(`/api/calendar/blackout-dates/${id}`, { method: "DELETE" });
    const json = await res.json();
    return json.success;
  }

  /**
   * Operating Hours API
   */
  static async getOperatingHours(): Promise<OperatingHoursRule[]> {
    try {
      const res = await fetch("/api/calendar/operating-hours");
      const json = await res.json();
      return json.data || [];
    } catch {
      return [
        { dayOfWeek: 0, dayName: "Sunday", openTime: "00:00", closeTime: "23:59", isOpen: true },
        { dayOfWeek: 1, dayName: "Monday", openTime: "00:00", closeTime: "23:59", isOpen: true },
        { dayOfWeek: 2, dayName: "Tuesday", openTime: "00:00", closeTime: "23:59", isOpen: true },
        { dayOfWeek: 3, dayName: "Wednesday", openTime: "00:00", closeTime: "23:59", isOpen: true },
        { dayOfWeek: 4, dayName: "Thursday", openTime: "00:00", closeTime: "23:59", isOpen: true },
        { dayOfWeek: 5, dayName: "Friday", openTime: "00:00", closeTime: "23:59", isOpen: true },
        { dayOfWeek: 6, dayName: "Saturday", openTime: "00:00", closeTime: "23:59", isOpen: true },
      ];
    }
  }

  /**
   * Cutoff Rules API
   */
  static async getCutoffRules(): Promise<{
    bookingCutoffs: BookingCutoffRule[];
    cancellationCutoffs: CancellationCutoffRule[];
  }> {
    try {
      const res = await fetch("/api/calendar/cutoff-rules");
      const json = await res.json();
      return {
        bookingCutoffs: json.bookingCutoffs || [],
        cancellationCutoffs: json.cancellationCutoffs || [],
      };
    } catch {
      return {
        bookingCutoffs: [
          { id: "cut-fl", serviceType: "flights", serviceName: "Flights", minMinutesBeforeDeparture: 120, maxDaysInAdvance: 365, bufferMinutes: 30, description: "Closes 2 hours prior to scheduled departure" },
          { id: "cut-tr", serviceType: "trains", serviceName: "Trains", minMinutesBeforeDeparture: 60, maxDaysInAdvance: 120, bufferMinutes: 15, description: "Current booking closes 60 mins before departure" },
          { id: "cut-bus", serviceType: "buses", serviceName: "Buses", minMinutesBeforeDeparture: 45, maxDaysInAdvance: 60, bufferMinutes: 15, description: "Driver manifests printed 45 mins prior" },
          { id: "cut-htl", serviceType: "hotels", serviceName: "Hotels", minMinutesBeforeDeparture: 0, maxDaysInAdvance: 365, bufferMinutes: 60, description: "Same day bookings till 23:00" },
          { id: "cut-tour", serviceType: "tours", serviceName: "Tours", minMinutesBeforeDeparture: 240, maxDaysInAdvance: 180, bufferMinutes: 60, description: "Tour guide assignment requires 4 hours" },
          { id: "cut-pilg", serviceType: "pilgrimage", serviceName: "Pilgrimage", minMinutesBeforeDeparture: 180, maxDaysInAdvance: 90, bufferMinutes: 45, description: "Token validation closes 3 hours prior" },
          { id: "cut-cab", serviceType: "cabs", serviceName: "Cabs", minMinutesBeforeDeparture: 30, maxDaysInAdvance: 30, bufferMinutes: 10, description: "Nearest chauffeur dispatched in 30 mins" },
          { id: "cut-act", serviceType: "activities", serviceName: "Activities", minMinutesBeforeDeparture: 90, maxDaysInAdvance: 90, bufferMinutes: 20, description: "Instructor safety requires 90 mins" },
        ],
        cancellationCutoffs: [
          { id: "canc-fl", serviceType: "flights", fullRefundHoursBefore: 72, partialRefundHoursBefore: 24, partialRefundPercent: 50, noRefundHoursBefore: 4 },
          { id: "canc-tr", serviceType: "trains", fullRefundHoursBefore: 48, partialRefundHoursBefore: 12, partialRefundPercent: 75, noRefundHoursBefore: 4 },
          { id: "canc-bus", serviceType: "buses", fullRefundHoursBefore: 24, partialRefundHoursBefore: 6, partialRefundPercent: 50, noRefundHoursBefore: 2 },
          { id: "canc-htl", serviceType: "hotels", fullRefundHoursBefore: 48, partialRefundHoursBefore: 24, partialRefundPercent: 70, noRefundHoursBefore: 12 },
          { id: "canc-tour", serviceType: "tours", fullRefundHoursBefore: 120, partialRefundHoursBefore: 48, partialRefundPercent: 50, noRefundHoursBefore: 24 },
          { id: "canc-pilg", serviceType: "pilgrimage", fullRefundHoursBefore: 48, partialRefundHoursBefore: 24, partialRefundPercent: 50, noRefundHoursBefore: 6 },
          { id: "canc-cab", serviceType: "cabs", fullRefundHoursBefore: 6, partialRefundHoursBefore: 2, partialRefundPercent: 80, noRefundHoursBefore: 1 },
          { id: "canc-act", serviceType: "activities", fullRefundHoursBefore: 24, partialRefundHoursBefore: 8, partialRefundPercent: 50, noRefundHoursBefore: 3 },
        ],
      };
    }
  }

  /**
   * Schedule CRUD
   */
  static async createSchedule(schedule: Partial<CalendarSchedule>): Promise<CalendarSchedule> {
    const res = await fetch("/api/calendar/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule),
    });
    const json = await res.json();
    return json.data;
  }

  static async updateSchedule(id: string, updates: Partial<CalendarSchedule>): Promise<CalendarSchedule> {
    const res = await fetch(`/api/calendar/schedules/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const json = await res.json();
    return json.data;
  }

  static async deleteSchedule(id: string): Promise<boolean> {
    const res = await fetch(`/api/calendar/schedules/${id}`, { method: "DELETE" });
    const json = await res.json();
    return json.success;
  }

  // --- Fallback helpers ---
  private static generateFallbackDates(
    serviceType: CalendarServiceType,
    start: string,
    end: string
  ): CalendarDateAvailability[] {
    const dates: CalendarDateAvailability[] = [];
    const curr = new Date(start);
    const stop = new Date(end);

    const basePrices = {
      flights: 3999,
      trains: 850,
      buses: 599,
      hotels: 3500,
      tours: 4200,
      pilgrimage: 300,
      cabs: 999,
      activities: 1200,
    };
    const base = basePrices[serviceType] || 1500;
    const localHolidays = this.getLocalHolidays();

    let count = 0;
    while (curr <= stop && count < 60) {
      const dStr = curr.toISOString().split("T")[0];
      const day = curr.getDay();
      const isWeekend = day === 0 || day === 6;

      // Find matching holiday for this date if any
      const hol = localHolidays.find((h) => h.date === dStr);
      const isBlackout =
        (dStr === "2026-09-22" && serviceType === "flights") ||
        hol?.availabilityStatus === "blackout";

      const priceVariance = isWeekend ? 1.25 : 1.0;
      let holidayMultiplier = 1.0;

      if (hol) {
        const isImpactedService =
          !hol.affectedServices || hol.affectedServices.length === 0 || hol.affectedServices.includes(serviceType);
        if (hol.pricingEnabled !== false && isImpactedService) {
          const surge = hol.customSurgePercent ?? hol.surgePercent ?? 20;
          holidayMultiplier = 1 + surge / 100;
        }
      }

      const finalPrice = Math.round(base * priceVariance * holidayMultiplier);

      let status: "available" | "filling_fast" | "sold_out" | "blackout" = "available";
      if (isBlackout) {
        status = "blackout";
      } else if (dStr === "2026-09-18") {
        status = "sold_out";
      } else if (hol?.availabilityStatus === "restricted" || hol?.availabilityStatus === "filling_fast") {
        status = "filling_fast";
      }

      dates.push({
        date: dStr,
        status,
        minPrice: finalPrice,
        maxPrice: Math.round(finalPrice * 1.3),
        availableCapacity: isBlackout ? 0 : hol?.availabilityStatus === "restricted" ? 8 : 45,
        totalCapacity: 120,
        isHoliday: !!hol,
        holidayName: hol ? hol.name : undefined,
        isBlackout,
        blackoutReason: isBlackout
          ? hol?.availabilityStatus === "blackout"
            ? `${hol.name} - Service Suspended`
            : "Runway Maintenance at IGI Airport"
          : undefined,
        surgeMultiplier: holidayMultiplier,
        schedulesCount: 3,
      });

      curr.setDate(curr.getDate() + 1);
      count++;
    }
    return dates;
  }

  private static getFallbackTimeSlots(
    serviceType: CalendarServiceType,
    date: string,
    timeOfDay: TimeOfDayFilter
  ): CalendarTimeSlot[] {
    const slots: CalendarTimeSlot[] = [
      { id: "SLOT-F-1", serviceType, serviceId: "svc-1", slotDate: date, startTime: "06:15", endTime: "08:35", slotLabel: "Morning Prime Flight / Train / Tour", timeOfDay: "morning", capacity: 60, availableCapacity: 18, price: 3499, status: "available" },
      { id: "SLOT-F-2", serviceType, serviceId: "svc-2", slotDate: date, startTime: "10:30", endTime: "13:00", slotLabel: "Mid-Day Express Slot", timeOfDay: "morning", capacity: 80, availableCapacity: 34, price: 3899, status: "available" },
      { id: "SLOT-F-3", serviceType, serviceId: "svc-3", slotDate: date, startTime: "14:00", endTime: "16:45", slotLabel: "Afternoon Check-in / Transit", timeOfDay: "afternoon", capacity: 75, availableCapacity: 12, price: 3199, status: "filling_fast" },
      { id: "SLOT-F-4", serviceType, serviceId: "svc-4", slotDate: date, startTime: "18:30", endTime: "21:00", slotLabel: "Sunset & Evening Departure", timeOfDay: "evening", capacity: 50, availableCapacity: 25, price: 4299, status: "available" },
      { id: "SLOT-F-5", serviceType, serviceId: "svc-5", slotDate: date, startTime: "22:45", endTime: "01:15", slotLabel: "Late Night Red-Eye / Sleeper", timeOfDay: "night", capacity: 40, availableCapacity: 6, price: 2899, status: "filling_fast" },
    ];
    return slots.filter((s) => timeOfDay === "all" || s.timeOfDay === timeOfDay);
  }
}
