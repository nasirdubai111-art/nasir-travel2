import { Router, Request, Response } from "express";
import {
  CalendarSchedule,
  CalendarTimeSlot,
  CalendarDateAvailability,
  CalendarHoliday,
  CalendarBlackoutDate,
  OperatingHoursRule,
  BookingCutoffRule,
  CancellationCutoffRule,
  RecurringScheduleRule,
  CalendarServiceType,
  TimeOfDayFilter,
  CalendarEngineOverview,
  RegionalHolidayDBRow,
} from "../types";
import { INITIAL_REGIONAL_HOLIDAYS, STATE_CODE_MAP, getStateNameByCode } from "../data/regionalHolidaysData";

// =================================================================
// POSTGRESQL DATABASE SCHEMA DEFINITION: REGIONAL HOLIDAYS
// =================================================================
export const REGIONAL_HOLIDAY_POSTGRES_SCHEMA = `
-- =================================================================
-- PostgreSQL Database Schema: regional_holidays
-- Engine: PostgreSQL 14+ / Cloud SQL for PostgreSQL
-- Supports state-specific identifiers (e.g. 'KA' for Karnataka, 'MH' for Maharashtra)
-- =================================================================

CREATE TABLE IF NOT EXISTS regional_holidays (
    id VARCHAR(64) PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL, -- State identifier, e.g. 'KA', 'MH', 'KL', 'WB', 'ALL'
    state_name VARCHAR(100) NOT NULL, -- e.g. 'Karnataka', 'Maharashtra'
    applicable_state_codes VARCHAR(10)[] NOT NULL DEFAULT '{}', -- e.g. ARRAY['KA', 'MH', 'GA']
    applicable_states TEXT[] NOT NULL DEFAULT '{}',
    holiday_date DATE NOT NULL,
    holiday_name VARCHAR(255) NOT NULL,
    holiday_type VARCHAR(50) NOT NULL DEFAULT 'festival', -- 'national', 'gazetted', 'festival', 'restricted', 'state'
    category VARCHAR(50) NOT NULL DEFAULT 'state', -- 'national' | 'state'
    surge_percent NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    custom_surge_percent NUMERIC(5,2),
    pricing_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'available', -- 'available', 'filling_fast', 'restricted', 'blackout'
    is_long_weekend BOOLEAN NOT NULL DEFAULT FALSE,
    long_weekend_days INT NOT NULL DEFAULT 1,
    affected_services TEXT[] NOT NULL DEFAULT '{"flights","trains","buses","hotels","tours","pilgrimage","cabs","activities"}',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_regional_holidays_state_code ON regional_holidays (state_code);
CREATE INDEX IF NOT EXISTS idx_regional_holidays_holiday_date ON regional_holidays (holiday_date);
CREATE INDEX IF NOT EXISTS idx_regional_holidays_category ON regional_holidays (category);
CREATE INDEX IF NOT EXISTS idx_regional_holidays_pricing ON regional_holidays (pricing_enabled);
`;

// ==========================================
// CENTRAL DATABASE STORE (PostgreSQL Simulation)
// ==========================================

export interface CalendarDBStore {
  calendars: Array<{
    id: string;
    serviceType: CalendarServiceType;
    name: string;
    timezone: string;
    isActive: boolean;
  }>;
  calendarDates: Array<{
    id: string;
    calendarId: string;
    date: string;
    isAvailable: boolean;
    surgeMultiplier: number;
  }>;
  schedules: CalendarSchedule[];
  timeSlots: CalendarTimeSlot[];
  operatingHours: OperatingHoursRule[];
  holidays: CalendarHoliday[];
  regionalHolidays: RegionalHolidayDBRow[];
  blackoutDates: CalendarBlackoutDate[];
  bookingCutoffRules: BookingCutoffRule[];
  cancellationCutoffRules: CancellationCutoffRule[];
  recurringSchedules: RecurringScheduleRule[];
  timeZones: Array<{ id: string; name: string; offset: string; isDefault: boolean }>;
}

// Seed Database State
export const calendarDb: CalendarDBStore = {
  calendars: [
    { id: "cal-flights", serviceType: "flights", name: "Commercial Aviation Calendar", timezone: "Asia/Kolkata", isActive: true },
    { id: "cal-trains", serviceType: "trains", name: "IRCTC Railway Schedule Calendar", timezone: "Asia/Kolkata", isActive: true },
    { id: "cal-buses", serviceType: "buses", name: "Intercity Bus Operations Calendar", timezone: "Asia/Kolkata", isActive: true },
    { id: "cal-hotels", serviceType: "hotels", name: "Hospitality & Room Inventory Calendar", timezone: "Asia/Kolkata", isActive: true },
    { id: "cal-tours", serviceType: "tours", name: "Curated Tours & Expeditions Calendar", timezone: "Asia/Kolkata", isActive: true },
    { id: "cal-pilgrimage", serviceType: "pilgrimage", name: "Sacred Yatra & Darshan Calendar", timezone: "Asia/Kolkata", isActive: true },
    { id: "cal-cabs", serviceType: "cabs", name: "Chauffeur & Fleet Dispatch Calendar", timezone: "Asia/Kolkata", isActive: true },
    { id: "cal-activities", serviceType: "activities", name: "Adventure & Cultural Experiences Calendar", timezone: "Asia/Kolkata", isActive: true },
  ],

  timeZones: [
    { id: "Asia/Kolkata", name: "India Standard Time (IST)", offset: "+05:30", isDefault: true },
    { id: "Asia/Dubai", name: "Gulf Standard Time (GST)", offset: "+04:00", isDefault: false },
    { id: "UTC", name: "Coordinated Universal Time (UTC)", offset: "+00:00", isDefault: false },
    { id: "Asia/Singapore", name: "Singapore Time (SGT)", offset: "+08:00", isDefault: false },
    { id: "Europe/London", name: "Greenwich Mean Time (GMT/BST)", offset: "+01:00", isDefault: false },
  ],

  holidays: [
    { id: "hol-01", date: "2026-08-15", name: "Independence Day", type: "national", surgePercent: 20, description: "National celebration with peak domestic travel across all corridors." },
    { id: "hol-02", date: "2026-08-28", name: "Raksha Bandhan", type: "festival", surgePercent: 15, description: "Heavy weekend rush on intercity buses and short-haul flights." },
    { id: "hol-03", date: "2026-09-04", name: "Janmashtami", type: "festival", surgePercent: 25, description: "Peak pilgrimage demand for Mathura, Vrindavan, and Dwarka." },
    { id: "hol-04", date: "2026-09-14", name: "Ganesh Chaturthi", type: "festival", surgePercent: 30, description: "High surge in Maharashtra, Goa, and Karnataka transit routes." },
    { id: "hol-05", date: "2026-10-02", name: "Gandhi Jayanti", type: "national", surgePercent: 15, description: "National holiday with extended weekend getaway bookings." },
    { id: "hol-06", date: "2026-10-20", name: "Dussehra / Vijayadashami", type: "festival", surgePercent: 25, description: "Kullu, Mysore, and Varanasi yatra peak tourist schedules." },
    { id: "hol-07", date: "2026-11-08", name: "Diwali (Deepavali)", type: "festival", surgePercent: 40, description: "Highest annual travel volume nationwide across air and rail." },
    { id: "hol-08", date: "2026-11-15", name: "Chhath Puja", type: "festival", surgePercent: 35, description: "Heavy eastbound train and flight traffic to Bihar and UP." },
    { id: "hol-09", date: "2026-12-25", name: "Christmas", type: "festival", surgePercent: 30, description: "Goa, Kerala, and hill station peak holiday rates." },
    { id: "hol-10", date: "2026-12-31", name: "New Year's Eve", type: "festival", surgePercent: 45, description: "Year-end celebratory high occupancy across hotels and resorts." },
    { id: "hol-11", date: "2027-01-26", name: "Republic Day", type: "national", surgePercent: 15, description: "Delhi airspace restrictions and nationwide long weekend travel." },
    { id: "hol-12", date: "2027-03-24", name: "Holi Festival of Colors", type: "festival", surgePercent: 25, description: "Braj, Jaipur, and Pushkar tourism surge." },
  ],

  // PostgreSQL Table representation: regional_holidays
  regionalHolidays: INITIAL_REGIONAL_HOLIDAYS.map((h) => ({
    id: h.id,
    stateCode: h.stateCode || (h.category === "national" ? "ALL" : "MH"),
    stateName: h.state || (h.stateCode ? getStateNameByCode(h.stateCode) : "Pan-India"),
    applicableStateCodes: h.applicableStateCodes || (h.stateCode ? [h.stateCode] : ["ALL"]),
    applicableStates: h.applicableStates || (h.state ? [h.state] : ["All India"]),
    holidayDate: h.date,
    holidayName: h.name,
    holidayType: h.type,
    category: (h.category as "national" | "state") || (h.type === "national" || h.type === "gazetted" ? "national" : "state"),
    surgePercent: h.surgePercent,
    customSurgePercent: h.customSurgePercent ?? h.surgePercent,
    pricingEnabled: h.pricingEnabled ?? true,
    availabilityStatus: h.availabilityStatus ?? "available",
    isLongWeekend: h.isLongWeekend ?? false,
    longWeekendDays: h.longWeekendDays ?? 1,
    affectedServices: h.affectedServices || ["flights", "trains", "buses", "hotels", "tours", "pilgrimage", "cabs", "activities"],
    description: h.description,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-09-01T00:00:00Z",
  })),

  blackoutDates: [
    {
      id: "blk-01",
      serviceType: "flights",
      serviceId: "fl-del-airspace",
      startDate: "2026-09-22",
      endDate: "2026-09-23",
      reason: "Runway 28/10 Resurfacing & AAI Instrument Landing Calibration at IGI Airport",
      blockedBy: "Airports Authority of India (AAI)",
      createdAt: "2026-08-01T10:00:00Z",
    },
    {
      id: "blk-02",
      serviceType: "tours",
      serviceId: "tour-kedarnath",
      startDate: "2026-11-10",
      endDate: "2026-12-31",
      reason: "Winter Temple Portal Closure & Heavy Alpine Snowfall (Chardham Protocol)",
      blockedBy: "Uttarakhand State Disaster Management Authority",
      createdAt: "2026-08-05T09:00:00Z",
    },
    {
      id: "blk-03",
      serviceType: "activities",
      serviceId: "act-rishikesh-rafting",
      startDate: "2026-08-01",
      endDate: "2026-09-15",
      reason: "High Monsoon Water Level Alert in River Ganga (Safety Regulations)",
      blockedBy: "Uttarakhand Tourism Board",
      createdAt: "2026-07-20T14:30:00Z",
    },
    {
      id: "blk-04",
      serviceType: "trains",
      serviceId: "tr-del-vrn",
      startDate: "2026-09-18",
      endDate: "2026-09-18",
      reason: "Northern Railway Track Interlocking Maintenance at Kanpur Central Yard",
      blockedBy: "Ministry of Railways Operations Directorate",
      createdAt: "2026-08-10T11:00:00Z",
    },
  ],

  operatingHours: [
    { dayOfWeek: 0, dayName: "Sunday", openTime: "00:00", closeTime: "23:59", isOpen: true, notes: "24x7 Operations with weekend support desk" },
    { dayOfWeek: 1, dayName: "Monday", openTime: "00:00", closeTime: "23:59", isOpen: true, notes: "Standard 24x7 automated bookings" },
    { dayOfWeek: 2, dayName: "Tuesday", openTime: "00:00", closeTime: "23:59", isOpen: true, notes: "Standard 24x7 automated bookings" },
    { dayOfWeek: 3, dayName: "Wednesday", openTime: "00:00", closeTime: "23:59", isOpen: true, notes: "Midweek scheduled maintenance at 02:00-02:30 AM" },
    { dayOfWeek: 4, dayName: "Thursday", openTime: "00:00", closeTime: "23:59", isOpen: true, notes: "Standard 24x7 automated bookings" },
    { dayOfWeek: 5, dayName: "Friday", openTime: "00:00", closeTime: "23:59", isOpen: true, notes: "Weekend dispatch scaling active" },
    { dayOfWeek: 6, dayName: "Saturday", openTime: "00:00", closeTime: "23:59", isOpen: true, notes: "High volume 24x7 emergency response" },
  ],

  bookingCutoffRules: [
    { id: "cut-fl", serviceType: "flights", serviceName: "Domestic & International Flights", minMinutesBeforeDeparture: 120, maxDaysInAdvance: 365, bufferMinutes: 30, description: "Web check-in closes 60 mins before; bookings close 2 hrs prior to scheduled departure." },
    { id: "cut-tr", serviceType: "trains", serviceName: "IRCTC Trains & Vande Bharat", minMinutesBeforeDeparture: 60, maxDaysInAdvance: 120, bufferMinutes: 15, description: "Reservation chart prepared 4 hours prior; final current booking closes 60 mins before train departure." },
    { id: "cut-bus", serviceType: "buses", serviceName: "Intercity Volvo & Sleeper Buses", minMinutesBeforeDeparture: 45, maxDaysInAdvance: 60, bufferMinutes: 15, description: "Driver manifests printed 45 minutes before departure from source terminal." },
    { id: "cut-htl", serviceType: "hotels", serviceName: "Hotels, Lodges & Resorts", minMinutesBeforeDeparture: 0, maxDaysInAdvance: 365, bufferMinutes: 60, description: "Same-day bookings accepted until 23:00 local time on check-in day." },
    { id: "cut-tour", serviceType: "tours", serviceName: "Curated Sightseeing & Multi-day Tours", minMinutesBeforeDeparture: 240, maxDaysInAdvance: 180, bufferMinutes: 60, description: "Tour guide and transport assignment requires minimum 4 hours advance notice." },
    { id: "cut-pilg", serviceType: "pilgrimage", serviceName: "Temple Darshan & Pilgrimage Passes", minMinutesBeforeDeparture: 180, maxDaysInAdvance: 90, bufferMinutes: 45, description: "Temple trust token validation closes 3 hours prior to darshan slot." },
    { id: "cut-cab", serviceType: "cabs", serviceName: "Airport Drop & Outstation Cabs", minMinutesBeforeDeparture: 30, maxDaysInAdvance: 30, bufferMinutes: 10, description: "Nearest chauffeur dispatched within 30 minutes of scheduled pickup time." },
    { id: "cut-act", serviceType: "activities", serviceName: "Adventure & Cultural Activities", minMinutesBeforeDeparture: 90, maxDaysInAdvance: 90, bufferMinutes: 20, description: "Safety equipment and instructor readiness requires 90 minutes lead time." },
  ],

  cancellationCutoffRules: [
    { id: "canc-fl", serviceType: "flights", fullRefundHoursBefore: 72, partialRefundHoursBefore: 24, partialRefundPercent: 50, noRefundHoursBefore: 4 },
    { id: "canc-tr", serviceType: "trains", fullRefundHoursBefore: 48, partialRefundHoursBefore: 12, partialRefundPercent: 75, noRefundHoursBefore: 4 },
    { id: "canc-bus", serviceType: "buses", fullRefundHoursBefore: 24, partialRefundHoursBefore: 6, partialRefundPercent: 50, noRefundHoursBefore: 2 },
    { id: "canc-htl", serviceType: "hotels", fullRefundHoursBefore: 48, partialRefundHoursBefore: 24, partialRefundPercent: 70, noRefundHoursBefore: 12 },
    { id: "canc-tour", serviceType: "tours", fullRefundHoursBefore: 120, partialRefundHoursBefore: 48, partialRefundPercent: 50, noRefundHoursBefore: 24 },
    { id: "canc-pilg", serviceType: "pilgrimage", fullRefundHoursBefore: 48, partialRefundHoursBefore: 24, partialRefundPercent: 50, noRefundHoursBefore: 6 },
    { id: "canc-cab", serviceType: "cabs", fullRefundHoursBefore: 6, partialRefundHoursBefore: 2, partialRefundPercent: 80, noRefundHoursBefore: 1 },
    { id: "canc-act", serviceType: "activities", fullRefundHoursBefore: 24, partialRefundHoursBefore: 8, partialRefundPercent: 50, noRefundHoursBefore: 3 },
  ],

  recurringSchedules: [
    { id: "rec-01", serviceType: "flights", serviceId: "6E-2041", title: "IndiGo 6E-2041 DEL ➔ BOM", frequency: "daily", departureTime: "06:15", arrivalTime: "08:35", capacity: 186, price: 4399, isActive: true },
    { id: "rec-02", serviceType: "trains", serviceId: "22436", title: "Vande Bharat Express (22436) NDLS ➔ BSB", frequency: "daily", departureTime: "06:00", arrivalTime: "14:00", capacity: 1128, price: 1750, isActive: true },
    { id: "rec-03", serviceType: "buses", serviceId: "ZB-910", title: "Zingbus Premium AC Sleeper Delhi ➔ Manali", frequency: "daily", departureTime: "20:30", arrivalTime: "08:30", capacity: 36, price: 1299, isActive: true },
    { id: "rec-04", serviceType: "cabs", serviceId: "CAB-DEL-AGR", title: "Express Cab Delhi Airport ➔ Agra Taj Corridor", frequency: "daily", departureTime: "07:00", arrivalTime: "10:30", capacity: 4, price: 3499, isActive: true },
  ],

  // Sample Multi-Service Schedules
  schedules: [
    // Flights
    {
      id: "SCH-FL-01",
      serviceType: "flights",
      serviceId: "fl-6e-2041",
      title: "IndiGo 6E-2041 (A321neo)",
      routeOrLocation: "DEL (New Delhi) ➔ BOM (Mumbai)",
      scheduleDate: "2026-09-03",
      departureTime: "06:15",
      arrivalTime: "08:35",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 186,
      availableCapacity: 42,
      basePrice: 4399,
      dynamicPrice: 4699,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-FL-02",
      serviceType: "flights",
      serviceId: "fl-ai-102",
      title: "Air India AI-102 (Boeing 787 Dreamliner)",
      routeOrLocation: "DEL (New Delhi) ➔ BLR (Bengaluru)",
      scheduleDate: "2026-09-03",
      departureTime: "09:30",
      arrivalTime: "12:15",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 256,
      availableCapacity: 88,
      basePrice: 5299,
      dynamicPrice: 5299,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-FL-03",
      serviceType: "flights",
      serviceId: "fl-uk-945",
      title: "Vistara UK-945 (A320neo)",
      routeOrLocation: "DEL (New Delhi) ➔ GOI (Goa Dabolim)",
      scheduleDate: "2026-09-03",
      departureTime: "14:10",
      arrivalTime: "16:45",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 158,
      availableCapacity: 14,
      basePrice: 5899,
      dynamicPrice: 6299,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-FL-04",
      serviceType: "flights",
      serviceId: "fl-6e-2188",
      title: "IndiGo 6E-2188 Late Night Express",
      routeOrLocation: "DEL (New Delhi) ➔ CCU (Kolkata)",
      scheduleDate: "2026-09-03",
      departureTime: "22:45",
      arrivalTime: "01:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 180,
      availableCapacity: 65,
      basePrice: 3899,
      dynamicPrice: 3899,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },

    // Trains
    {
      id: "SCH-TR-01",
      serviceType: "trains",
      serviceId: "tr-22436",
      title: "Vande Bharat Express (22436)",
      routeOrLocation: "NDLS (New Delhi) ➔ BSB (Varanasi Junction)",
      scheduleDate: "2026-09-03",
      departureTime: "06:00",
      arrivalTime: "14:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 1128,
      availableCapacity: 94,
      basePrice: 1750,
      dynamicPrice: 1750,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-TR-02",
      serviceType: "trains",
      serviceId: "tr-12433",
      title: "Rajdhani Express (12433)",
      routeOrLocation: "NZM (Hazrat Nizamuddin) ➔ MAS (Chennai Central)",
      scheduleDate: "2026-09-03",
      departureTime: "15:35",
      arrivalTime: "20:45",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 960,
      availableCapacity: 120,
      basePrice: 2890,
      dynamicPrice: 2890,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-TR-03",
      serviceType: "trains",
      serviceId: "tr-12002",
      title: "Bhopal Shatabdi Express (12002)",
      routeOrLocation: "NDLS (New Delhi) ➔ AGC (Agra Cantt)",
      scheduleDate: "2026-09-03",
      departureTime: "06:00",
      arrivalTime: "07:50",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 840,
      availableCapacity: 6,
      basePrice: 690,
      dynamicPrice: 790,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },

    // Buses
    {
      id: "SCH-BUS-01",
      serviceType: "buses",
      serviceId: "bus-zb-del-mnl",
      title: "Zingbus Electric & Multi-Axle Volvo AC Sleeper",
      routeOrLocation: "Kashmere Gate ISBT Delhi ➔ Private Bus Stand Manali",
      scheduleDate: "2026-09-03",
      departureTime: "20:30",
      arrivalTime: "08:30",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 36,
      availableCapacity: 11,
      basePrice: 1299,
      dynamicPrice: 1450,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-BUS-02",
      serviceType: "buses",
      serviceId: "bus-ic-del-jpr",
      title: "IntrCity SmartBus AC Seater / Lounge",
      routeOrLocation: "Dhaula Kuan Delhi ➔ Sindhi Camp Jaipur",
      scheduleDate: "2026-09-03",
      departureTime: "07:30",
      arrivalTime: "12:45",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 45,
      availableCapacity: 28,
      basePrice: 499,
      dynamicPrice: 499,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-BUS-03",
      serviceType: "buses",
      serviceId: "bus-nuego-del-chd",
      title: "NueGo 100% Green Electric Luxury Bus",
      routeOrLocation: "Majnu Ka Tilla Delhi ➔ Sector 43 Chandigarh",
      scheduleDate: "2026-09-03",
      departureTime: "15:00",
      arrivalTime: "19:30",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 40,
      availableCapacity: 19,
      basePrice: 549,
      dynamicPrice: 549,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },

    // Hotels
    {
      id: "SCH-HTL-01",
      serviceType: "hotels",
      serviceId: "htl-taj-del",
      title: "Taj Palace New Delhi (Luxury Room)",
      routeOrLocation: "Sardar Patel Marg, Chanakyapuri, New Delhi",
      scheduleDate: "2026-09-03",
      departureTime: "14:00", // Standard Check-in
      arrivalTime: "11:00",   // Next day Check-out
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 80,
      availableCapacity: 12,
      basePrice: 12500,
      dynamicPrice: 13800,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-HTL-02",
      serviceType: "hotels",
      serviceId: "htl-oberoi-agr",
      title: "The Oberoi Amarvilas (Premier Taj View Room)",
      routeOrLocation: "Taj East Gate Road, Agra, Uttar Pradesh",
      scheduleDate: "2026-09-03",
      departureTime: "14:00",
      arrivalTime: "12:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 65,
      availableCapacity: 8,
      basePrice: 28500,
      dynamicPrice: 28500,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },

    // Tours
    {
      id: "SCH-TOUR-01",
      serviceType: "tours",
      serviceId: "tour-gold-tri",
      title: "Golden Triangle Heritage Expedition (Delhi-Agra-Jaipur 4D/3N)",
      routeOrLocation: "Starting at New Delhi Connaught Place",
      scheduleDate: "2026-09-03",
      departureTime: "08:00",
      arrivalTime: "18:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 24,
      availableCapacity: 7,
      basePrice: 14999,
      dynamicPrice: 14999,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-TOUR-02",
      serviceType: "tours",
      serviceId: "tour-kerala-backwater",
      title: "Alleppey Backwaters & Vembanad Lake Cruise Tour",
      routeOrLocation: "Finishing Jetty, Alleppey, Kerala",
      scheduleDate: "2026-09-03",
      departureTime: "11:30",
      arrivalTime: "17:30",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 30,
      availableCapacity: 14,
      basePrice: 4200,
      dynamicPrice: 4200,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },

    // Pilgrimage
    {
      id: "SCH-PILG-01",
      serviceType: "pilgrimage",
      serviceId: "pilg-kashi-vip",
      title: "Kashi Vishwanath Corridor VIP Sugam Darshan Pass",
      routeOrLocation: "Gate 4 (Chhattadwar), Varanasi",
      scheduleDate: "2026-09-03",
      departureTime: "06:00",
      arrivalTime: "08:30",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 150,
      availableCapacity: 22,
      basePrice: 500,
      dynamicPrice: 500,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-PILG-02",
      serviceType: "pilgrimage",
      serviceId: "pilg-tirupati-sed",
      title: "Tirumala Tirupati Devasthanams Special Entry Darshan",
      routeOrLocation: "Vaikuntam Queue Complex 1, Tirumala",
      scheduleDate: "2026-09-03",
      departureTime: "10:00",
      arrivalTime: "13:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 300,
      availableCapacity: 45,
      basePrice: 300,
      dynamicPrice: 300,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },

    // Cabs
    {
      id: "SCH-CAB-01",
      serviceType: "cabs",
      serviceId: "cab-del-airport",
      title: "Premium Chauffeur Airport Drop Sedan (Camry / Honda City)",
      routeOrLocation: "Any Delhi NCR Address ➔ IGI Airport T3",
      scheduleDate: "2026-09-03",
      departureTime: "05:00",
      arrivalTime: "06:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 4,
      availableCapacity: 4,
      basePrice: 1299,
      dynamicPrice: 1299,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-CAB-02",
      serviceType: "cabs",
      serviceId: "cab-del-agra-innova",
      title: "Outstation Innova Crysta Full-Day Taj Mahal Return",
      routeOrLocation: "Delhi NCR ➔ Yamuna Expressway ➔ Agra Fort & Taj",
      scheduleDate: "2026-09-03",
      departureTime: "06:30",
      arrivalTime: "21:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 7,
      availableCapacity: 5,
      basePrice: 5800,
      dynamicPrice: 5800,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },

    // Activities
    {
      id: "SCH-ACT-01",
      serviceType: "activities",
      serviceId: "act-sam-dunes",
      title: "Jaisalmer Sam Sand Dunes Sunset Camel & 4x4 Safari",
      routeOrLocation: "Sam Sand Dunes, Desert National Park, Jaisalmer",
      scheduleDate: "2026-09-03",
      departureTime: "16:30",
      arrivalTime: "19:30",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 40,
      availableCapacity: 18,
      basePrice: 1450,
      dynamicPrice: 1450,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
    {
      id: "SCH-ACT-02",
      serviceType: "activities",
      serviceId: "act-havelock-scuba",
      title: "Havelock Island Certified PADI Coral Reef Scuba Dive",
      routeOrLocation: "Nemo Reef, Beach No. 3, Havelock Island",
      scheduleDate: "2026-09-03",
      departureTime: "08:00",
      arrivalTime: "11:00",
      timezone: "Asia/Kolkata",
      status: "active",
      capacity: 12,
      availableCapacity: 4,
      basePrice: 3800,
      dynamicPrice: 3800,
      createdAt: "2026-08-01T00:00:00Z",
      updatedAt: "2026-09-01T12:00:00Z",
    },
  ],

  // Sample Granular Time Slots (Morning, Afternoon, Evening, Night)
  timeSlots: [
    // Morning Slots (06:00 - 12:00)
    { id: "SLOT-01", serviceType: "flights", serviceId: "fl-6e-2041", slotDate: "2026-09-03", startTime: "06:15", endTime: "08:35", slotLabel: "Early Morning Express", timeOfDay: "morning", capacity: 186, availableCapacity: 42, price: 4399, status: "available" },
    { id: "SLOT-02", serviceType: "trains", serviceId: "tr-22436", slotDate: "2026-09-03", startTime: "06:00", endTime: "14:00", slotLabel: "Vande Bharat Prime Morning", timeOfDay: "morning", capacity: 1128, availableCapacity: 94, price: 1750, status: "available" },
    { id: "SLOT-03", serviceType: "pilgrimage", serviceId: "pilg-kashi-vip", slotDate: "2026-09-03", startTime: "06:00", endTime: "08:30", slotLabel: "Mangala Aarti & Sunrise Darshan", timeOfDay: "morning", capacity: 80, availableCapacity: 8, price: 500, status: "filling_fast" },
    { id: "SLOT-04", serviceType: "cabs", serviceId: "cab-del-airport", slotDate: "2026-09-03", startTime: "07:00", endTime: "08:00", slotLabel: "Peak Morning Airport Transfer", timeOfDay: "morning", capacity: 15, availableCapacity: 12, price: 1299, status: "available" },
    { id: "SLOT-05", serviceType: "activities", serviceId: "act-havelock-scuba", slotDate: "2026-09-03", startTime: "08:00", endTime: "11:00", slotLabel: "Calm Water Morning Dive Batch", timeOfDay: "morning", capacity: 12, availableCapacity: 4, price: 3800, status: "filling_fast" },
    { id: "SLOT-06", serviceType: "flights", serviceId: "fl-ai-102", slotDate: "2026-09-03", startTime: "09:30", endTime: "12:15", slotLabel: "Mid-Morning Corporate Flight", timeOfDay: "morning", capacity: 256, availableCapacity: 88, price: 5299, status: "available" },
    { id: "SLOT-07", serviceType: "pilgrimage", serviceId: "pilg-tirupati-sed", slotDate: "2026-09-03", startTime: "10:00", endTime: "13:00", slotLabel: "Special Entry Mid-day Slot", timeOfDay: "morning", capacity: 150, availableCapacity: 25, price: 300, status: "available" },

    // Afternoon Slots (12:00 - 17:00)
    { id: "SLOT-08", serviceType: "hotels", serviceId: "htl-taj-del", slotDate: "2026-09-03", startTime: "14:00", endTime: "18:00", slotLabel: "Standard Afternoon Check-in Window", timeOfDay: "afternoon", capacity: 80, availableCapacity: 12, price: 12500, status: "available" },
    { id: "SLOT-09", serviceType: "flights", serviceId: "fl-uk-945", slotDate: "2026-09-03", startTime: "14:10", endTime: "16:45", slotLabel: "Afternoon Holiday Flight", timeOfDay: "afternoon", capacity: 158, availableCapacity: 14, price: 5899, status: "filling_fast" },
    { id: "SLOT-10", serviceType: "buses", serviceId: "bus-nuego-del-chd", slotDate: "2026-09-03", startTime: "15:00", endTime: "19:30", slotLabel: "Intercity Highway Afternoon Cruiser", timeOfDay: "afternoon", capacity: 40, availableCapacity: 19, price: 549, status: "available" },
    { id: "SLOT-11", serviceType: "trains", serviceId: "tr-12433", slotDate: "2026-09-03", startTime: "15:35", endTime: "20:45", slotLabel: "Rajdhani Afternoon Departure", timeOfDay: "afternoon", capacity: 960, availableCapacity: 120, price: 2890, status: "available" },
    { id: "SLOT-12", serviceType: "activities", serviceId: "act-sam-dunes", slotDate: "2026-09-03", startTime: "16:30", endTime: "19:30", slotLabel: "Golden Hour Sunset Safari Batch", timeOfDay: "afternoon", capacity: 40, availableCapacity: 18, price: 1450, status: "available" },

    // Evening Slots (17:00 - 21:00)
    { id: "SLOT-13", serviceType: "pilgrimage", serviceId: "pilg-kashi-vip", slotDate: "2026-09-03", startTime: "17:30", endTime: "20:00", slotLabel: "Ganga Maha Aarti & Evening Darshan", timeOfDay: "evening", capacity: 70, availableCapacity: 0, price: 650, status: "sold_out" },
    { id: "SLOT-14", serviceType: "cabs", serviceId: "cab-del-airport", slotDate: "2026-09-03", startTime: "18:00", endTime: "19:00", slotLabel: "Evening Corporate City Pickup", timeOfDay: "evening", capacity: 20, availableCapacity: 16, price: 1399, status: "available" },
    { id: "SLOT-15", serviceType: "buses", serviceId: "bus-zb-del-mnl", slotDate: "2026-09-03", startTime: "20:30", endTime: "08:30", slotLabel: "Overnight Sleeper Boarding Batch 1", timeOfDay: "evening", capacity: 36, availableCapacity: 11, price: 1299, status: "available" },

    // Night Slots (21:00 - 06:00)
    { id: "SLOT-16", serviceType: "flights", serviceId: "fl-6e-2188", slotDate: "2026-09-03", startTime: "22:45", endTime: "01:00", slotLabel: "Red-Eye Economy Saver", timeOfDay: "night", capacity: 180, availableCapacity: 65, price: 3899, status: "available" },
    { id: "SLOT-17", serviceType: "cabs", serviceId: "cab-del-airport", slotDate: "2026-09-03", startTime: "23:30", endTime: "00:30", slotLabel: "Late Night Terminal Transfer", timeOfDay: "night", capacity: 10, availableCapacity: 8, price: 1499, status: "available" },
    { id: "SLOT-18", serviceType: "buses", serviceId: "bus-zb-del-mnl", slotDate: "2026-09-03", startTime: "23:45", endTime: "11:45", slotLabel: "Late Night Sleeper Boarding Batch 2", timeOfDay: "night", capacity: 36, availableCapacity: 5, price: 1399, status: "filling_fast" },
  ],

  calendarDates: [],
};

// ==========================================
// CENTRAL DATE AVAILABILITY GENERATOR
// ==========================================

export function computeCalendarDateAvailability(
  serviceType: CalendarServiceType,
  targetDate: string
): CalendarDateAvailability {
  // Check if date is in blackout
  const blackout = calendarDb.blackoutDates.find(
    (b) =>
      (b.serviceType === "all" || b.serviceType === serviceType) &&
      targetDate >= b.startDate &&
      targetDate <= b.endDate
  );

  // Check if date is a holiday
  const holiday = calendarDb.holidays.find((h) => h.date === targetDate);

  // Find schedules for date and serviceType
  const matchingSchedules = calendarDb.schedules.filter(
    (s) => s.serviceType === serviceType && s.scheduleDate === targetDate
  );

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

  const defaultBasePrice = basePrices[serviceType] || 1500;
  const surgeMultiplier = holiday ? 1 + holiday.surgePercent / 100 : 1.0;

  // Compute total capacity and available capacity
  let totalCap = 0;
  let availCap = 0;
  let minP = Math.round(defaultBasePrice * surgeMultiplier);
  let maxP = Math.round(defaultBasePrice * 1.5 * surgeMultiplier);

  if (matchingSchedules.length > 0) {
    totalCap = matchingSchedules.reduce((acc, s) => acc + s.capacity, 0);
    availCap = matchingSchedules.reduce((acc, s) => acc + s.availableCapacity, 0);
    const prices = matchingSchedules.map((s) => s.dynamicPrice || s.basePrice);
    minP = Math.min(...prices);
    maxP = Math.max(...prices);
  } else {
    // Generated deterministic pseudo capacity for un-seeded dates within 90 days
    const hash = targetDate.split("-").reduce((acc, p) => acc + parseInt(p, 10), 0);
    totalCap = 100 + (hash % 150);
    availCap = Math.max(0, totalCap - (hash % 120));
  }

  let status: "available" | "filling_fast" | "sold_out" | "blackout" = "available";
  if (blackout) {
    status = "blackout";
    availCap = 0;
  } else if (availCap === 0) {
    status = "sold_out";
  } else if (availCap <= totalCap * 0.2) {
    status = "filling_fast";
  }

  return {
    date: targetDate,
    status,
    minPrice: minP,
    maxPrice: maxP,
    availableCapacity: availCap,
    totalCapacity: totalCap,
    isHoliday: !!holiday,
    holidayName: holiday?.name,
    isBlackout: !!blackout,
    blackoutReason: blackout?.reason,
    surgeMultiplier,
    schedulesCount: matchingSchedules.length || 1,
  };
}

// ==========================================
// EXPRESS ROUTER
// ==========================================

export const calendarRouter = Router();

/**
 * GET /api/calendar/overview
 * System-wide calendar and timings operational statistics
 */
calendarRouter.get("/overview", (req: Request, res: Response) => {
  const totalSchedules = calendarDb.schedules.length;
  const activeTimeSlots = calendarDb.timeSlots.length;
  const totalHolidays = calendarDb.holidays.length;
  const activeBlackoutDates = calendarDb.blackoutDates.length;
  const overallCapacity = calendarDb.schedules.reduce((acc, s) => acc + s.capacity, 0);
  const availableCapacity = calendarDb.schedules.reduce((acc, s) => acc + s.availableCapacity, 0);
  const occupancyRate = overallCapacity > 0 ? Math.round(((overallCapacity - availableCapacity) / overallCapacity) * 100) : 0;

  // Find next upcoming holiday
  const today = "2026-09-03";
  const upcomingHoliday = calendarDb.holidays
    .filter((h) => h.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const overview: CalendarEngineOverview = {
    totalSchedules,
    activeTimeSlots,
    totalHolidays,
    activeBlackoutDates,
    overallCapacity,
    availableCapacity,
    occupancyRate,
    upcomingHoliday,
  };

  res.json({ success: true, data: overview });
});

/**
 * GET /api/calendar/availability
 * Fetch date availability range with pricing, holidays, and capacity
 */
calendarRouter.get("/availability", (req: Request, res: Response) => {
  const serviceType = (req.query.serviceType as CalendarServiceType) || "flights";
  const startDate = (req.query.startDate as string) || "2026-09-01";
  const endDate = (req.query.endDate as string) || "2026-09-30";

  const results: CalendarDateAvailability[] = [];
  const curr = new Date(startDate);
  const end = new Date(endDate);

  // Safeguard: max 60 days
  let count = 0;
  while (curr <= end && count < 60) {
    const dStr = curr.toISOString().split("T")[0];
    results.push(computeCalendarDateAvailability(serviceType, dStr));
    curr.setDate(curr.getDate() + 1);
    count++;
  }

  res.json({
    success: true,
    serviceType,
    startDate,
    endDate,
    count: results.length,
    data: results,
  });
});

/**
 * GET /api/calendar/dates
 * Fast calendar month matrix of dates
 */
calendarRouter.get("/dates", (req: Request, res: Response) => {
  const serviceType = (req.query.serviceType as CalendarServiceType) || "flights";
  const year = parseInt(req.query.year as string, 10) || 2026;
  const month = parseInt(req.query.month as string, 10) || 9; // 1-indexed

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;

  const dates: CalendarDateAvailability[] = [];
  for (let d = 1; d <= lastDay; d++) {
    const dStr = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    dates.push(computeCalendarDateAvailability(serviceType, dStr));
  }

  res.json({
    success: true,
    serviceType,
    year,
    month,
    daysCount: lastDay,
    data: dates,
  });
});

/**
 * GET /api/calendar/time-slots
 * Fetch granular time-slots for a service & date with morning/afternoon/evening/night filtering
 */
calendarRouter.get("/time-slots", (req: Request, res: Response) => {
  const serviceType = req.query.serviceType as CalendarServiceType;
  const serviceId = req.query.serviceId as string;
  const slotDate = (req.query.date as string) || "2026-09-03";
  const timeOfDay = (req.query.timeOfDay as TimeOfDayFilter) || "all";

  let slots = calendarDb.timeSlots.filter((slot) => {
    if (serviceType && slot.serviceType !== serviceType) return false;
    if (serviceId && slot.serviceId !== serviceId) return false;
    if (timeOfDay !== "all" && slot.timeOfDay !== timeOfDay) return false;
    return true;
  });

  // If no slots exist for specific date, generate dynamic slots based on service type
  if (slots.length === 0) {
    const presets = [
      { start: "06:30", end: "08:45", tod: "morning" as const, label: "Early Morning Slot", cap: 40 },
      { start: "10:00", end: "12:30", tod: "morning" as const, label: "Mid-Day Slot", cap: 50 },
      { start: "14:30", end: "17:00", tod: "afternoon" as const, label: "Afternoon Batch", cap: 45 },
      { start: "18:00", end: "20:30", tod: "evening" as const, label: "Evening Express", cap: 35 },
      { start: "22:00", end: "00:30", tod: "night" as const, label: "Late Night Transit", cap: 30 },
    ];

    slots = presets
      .filter((p) => timeOfDay === "all" || p.tod === timeOfDay)
      .map((p, idx) => ({
        id: `GEN-SLOT-${idx + 1}`,
        serviceType: serviceType || "flights",
        serviceId: serviceId || "gen-service-01",
        slotDate,
        startTime: p.start,
        endTime: p.end,
        slotLabel: p.label,
        timeOfDay: p.tod,
        capacity: p.cap,
        availableCapacity: Math.max(3, p.cap - idx * 7),
        price: 1999 + idx * 400,
        status: idx === 3 ? "filling_fast" : "available",
      }));
  }

  res.json({
    success: true,
    serviceType,
    serviceId,
    date: slotDate,
    timeOfDay,
    count: slots.length,
    data: slots,
  });
});

/**
 * POST /api/calendar/schedules
 * Admin creates a new schedule
 */
calendarRouter.post("/schedules", (req: Request, res: Response) => {
  const body = req.body;
  const newSchedule: CalendarSchedule = {
    id: `SCH-${Date.now().toString(36).toUpperCase()}`,
    serviceType: body.serviceType || "flights",
    serviceId: body.serviceId || `svc-${Date.now()}`,
    title: body.title || "Custom Service Schedule",
    routeOrLocation: body.routeOrLocation || "Delhi ➔ Destination",
    scheduleDate: body.scheduleDate || "2026-09-03",
    departureTime: body.departureTime || "10:00",
    arrivalTime: body.arrivalTime || "12:00",
    timezone: body.timezone || "Asia/Kolkata",
    status: body.status || "active",
    capacity: Number(body.capacity) || 50,
    availableCapacity: Number(body.availableCapacity ?? body.capacity) || 50,
    basePrice: Number(body.basePrice) || 2499,
    dynamicPrice: Number(body.dynamicPrice ?? body.basePrice) || 2499,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  calendarDb.schedules.unshift(newSchedule);
  res.status(201).json({ success: true, message: "Schedule created successfully", data: newSchedule });
});

/**
 * PUT /api/calendar/schedules/:id
 * Admin updates a schedule
 */
calendarRouter.put("/schedules/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = calendarDb.schedules.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }

  calendarDb.schedules[idx] = {
    ...calendarDb.schedules[idx],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json({ success: true, message: "Schedule updated successfully", data: calendarDb.schedules[idx] });
});

/**
 * DELETE /api/calendar/schedules/:id
 * Admin deletes a schedule
 */
calendarRouter.delete("/schedules/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = calendarDb.schedules.findIndex((s) => s.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Schedule not found" });
  }

  const removed = calendarDb.schedules.splice(idx, 1)[0];
  res.json({ success: true, message: "Schedule deleted successfully", data: removed });
});

/**
 * GET /api/calendar/holidays/regional
 * PostgreSQL Database Query Endpoint: Fetch regional holidays by state-specific identifier
 * Query params:
 *   - state (or stateCode): state identifier (e.g. 'KA', 'MH', 'KL', 'WB', 'ALL') or state name ('Karnataka')
 *   - includeNational: 'true' (default) or 'false'
 *   - year: '2026'
 *   - month: '09' or '9'
 *   - service: 'flights' | 'trains' | etc.
 */
calendarRouter.get("/holidays/regional", (req: Request, res: Response) => {
  const rawState = (
    (req.query.state as string) ||
    (req.query.stateCode as string) ||
    ""
  ).trim();
  const includeNational = req.query.includeNational !== "false";
  const yearFilter = req.query.year ? String(req.query.year) : undefined;
  const monthFilter = req.query.month
    ? String(req.query.month).padStart(2, "0")
    : undefined;
  const serviceFilter = req.query.service as CalendarServiceType | undefined;

  // Resolve target state code & name
  let targetCode = rawState ? rawState.toUpperCase() : "ALL";
  let targetName = STATE_CODE_MAP[targetCode]?.name;

  if (!targetName && rawState) {
    // Try matching state name in dictionary
    const found = Object.values(STATE_CODE_MAP).find(
      (s) =>
        s.name.toLowerCase().includes(rawState.toLowerCase()) ||
        rawState.toLowerCase().includes(s.name.toLowerCase())
    );
    if (found) {
      targetCode = found.code;
      targetName = found.name;
    }
  }

  let results = [...calendarDb.regionalHolidays];

  if (targetCode !== "ALL") {
    results = results.filter((item) => {
      const itemCode = (item.stateCode || "").toUpperCase();
      const isDirectMatch = itemCode === targetCode;
      const isApplicableCodeMatch = item.applicableStateCodes?.some(
        (sc) => sc.toUpperCase() === targetCode
      );
      const isStateNameMatch =
        targetName &&
        (item.stateName.toLowerCase().includes(targetName.toLowerCase()) ||
          item.applicableStates?.some((st) =>
            st.toLowerCase().includes(targetName!.toLowerCase())
          ));
      const isNational =
        includeNational &&
        (item.category === "national" || itemCode === "ALL");

      return isDirectMatch || isApplicableCodeMatch || isStateNameMatch || isNational;
    });
  }

  if (yearFilter) {
    results = results.filter((h) => h.holidayDate.startsWith(yearFilter));
  }

  if (monthFilter) {
    results = results.filter((h) => {
      const parts = h.holidayDate.split("-");
      return parts[1] === monthFilter;
    });
  }

  if (serviceFilter) {
    results = results.filter((h) =>
      h.affectedServices?.includes(serviceFilter)
    );
  }

  // Sort chronologically
  results.sort((a, b) => a.holidayDate.localeCompare(b.holidayDate));

  // Format data for standard client consumption
  const formattedData = results.map((row) => ({
    ...row,
    date: row.holidayDate,
    name: row.holidayName,
    type: row.holidayType,
    state: row.stateName,
  }));

  res.json({
    success: true,
    state: targetCode,
    stateCode: targetCode,
    stateName: targetName || (targetCode === "ALL" ? "All India / National" : targetCode),
    count: formattedData.length,
    data: formattedData,
    dbSchema: {
      engine: "PostgreSQL",
      table: "regional_holidays",
      primaryKey: "id",
      indexedColumns: ["state_code", "holiday_date", "category", "pricing_enabled"],
      columns: [
        { name: "id", type: "VARCHAR(64)", isPrimary: true },
        { name: "state_code", type: "VARCHAR(10)", indexed: true, description: "State identifier (e.g., 'KA', 'MH', 'ALL')" },
        { name: "state_name", type: "VARCHAR(100)", description: "Full State Name" },
        { name: "applicable_state_codes", type: "VARCHAR(10)[]", description: "Array of associated state codes" },
        { name: "applicable_states", type: "TEXT[]" },
        { name: "holiday_date", type: "DATE", indexed: true },
        { name: "holiday_name", type: "VARCHAR(255)" },
        { name: "holiday_type", type: "VARCHAR(50)" },
        { name: "category", type: "VARCHAR(50)", indexed: true },
        { name: "surge_percent", type: "NUMERIC(5,2)" },
        { name: "custom_surge_percent", type: "NUMERIC(5,2)" },
        { name: "pricing_enabled", type: "BOOLEAN", indexed: true },
        { name: "availability_status", type: "VARCHAR(50)" },
        { name: "is_long_weekend", type: "BOOLEAN" },
        { name: "long_weekend_days", type: "INT" },
        { name: "affected_services", type: "TEXT[]" },
        { name: "description", type: "TEXT" },
        { name: "created_at", type: "TIMESTAMP WITH TIME ZONE" },
        { name: "updated_at", type: "TIMESTAMP WITH TIME ZONE" },
      ],
      ddl: REGIONAL_HOLIDAY_POSTGRES_SCHEMA.trim(),
    },
    meta: {
      requestedState: rawState || "ALL",
      resolvedStateCode: targetCode,
      resolvedStateName: targetName || "All India / National",
      includeNational,
      totalMatched: formattedData.length,
      nationalHolidaysCount: formattedData.filter((h) => h.category === "national").length,
      stateSpecificCount: formattedData.filter((h) => h.category === "state").length,
      timestamp: new Date().toISOString(),
    },
  });
});

/**
 * GET /api/calendar/holidays/regional/schema
 * Returns the raw PostgreSQL DDL Schema for regional_holidays table
 */
calendarRouter.get("/holidays/regional/schema", (_req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    engine: "PostgreSQL 14+ / Cloud SQL for PostgreSQL",
    table: "regional_holidays",
    ddl: REGIONAL_HOLIDAY_POSTGRES_SCHEMA.trim(),
  });
});

/**
 * POST /api/calendar/holidays/regional
 * Insert a new regional holiday into the PostgreSQL database table representation
 */
calendarRouter.post("/holidays/regional", (req: Request, res: Response) => {
  const body = req.body;
  if (!body.date && !body.holidayDate) {
    return res.status(400).json({ success: false, message: "Date is required (YYYY-MM-DD)" });
  }
  if (!body.name && !body.holidayName) {
    return res.status(400).json({ success: false, message: "Holiday name is required" });
  }

  const rawStateCode = (body.stateCode || "ALL").toUpperCase();
  const stateName = body.stateName || body.state || getStateNameByCode(rawStateCode);
  const applicableCodes = Array.isArray(body.applicableStateCodes)
    ? body.applicableStateCodes
    : [rawStateCode];
  const applicableNames = Array.isArray(body.applicableStates)
    ? body.applicableStates
    : [stateName];

  const newRow: RegionalHolidayDBRow = {
    id: body.id || `hol-reg-${Date.now().toString(36)}`,
    stateCode: rawStateCode,
    stateName,
    applicableStateCodes: applicableCodes,
    applicableStates: applicableNames,
    holidayDate: body.date || body.holidayDate,
    holidayName: body.name || body.holidayName,
    holidayType: body.type || body.holidayType || "state",
    category: body.category || (rawStateCode === "ALL" ? "national" : "state"),
    surgePercent: Number(body.surgePercent) || 20,
    customSurgePercent: Number(body.customSurgePercent ?? body.surgePercent) || 20,
    pricingEnabled: body.pricingEnabled !== false,
    availabilityStatus: body.availabilityStatus || "available",
    isLongWeekend: Boolean(body.isLongWeekend),
    longWeekendDays: Number(body.longWeekendDays) || 1,
    affectedServices: body.affectedServices || [
      "flights",
      "trains",
      "buses",
      "hotels",
      "tours",
      "cabs",
    ],
    description: body.description || `${stateName} regional public holiday`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  calendarDb.regionalHolidays.push(newRow);

  res.status(201).json({
    success: true,
    message: "Regional holiday inserted into PostgreSQL database table successfully",
    data: newRow,
  });
});

/**
 * PUT /api/calendar/holidays/regional/:id
 * Update a regional holiday record in the PostgreSQL table representation
 */
calendarRouter.put("/holidays/regional/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = calendarDb.regionalHolidays.findIndex((h) => h.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Regional holiday record not found" });
  }

  const existing = calendarDb.regionalHolidays[idx];
  const updated: RegionalHolidayDBRow = {
    ...existing,
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  calendarDb.regionalHolidays[idx] = updated;

  res.json({
    success: true,
    message: "Regional holiday updated successfully in PostgreSQL database table",
    data: updated,
  });
});

/**
 * DELETE /api/calendar/holidays/regional/:id
 * Remove a regional holiday from the PostgreSQL table representation
 */
calendarRouter.delete("/holidays/regional/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = calendarDb.regionalHolidays.findIndex((h) => h.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Regional holiday not found" });
  }

  const removed = calendarDb.regionalHolidays.splice(idx, 1)[0];
  res.json({
    success: true,
    message: "Regional holiday deleted successfully from PostgreSQL table",
    data: removed,
  });
});

/**
 * GET /api/calendar/holidays
 * List gazetted, restricted, and festival holidays (supports ?state={stateCode} query param)
 */
calendarRouter.get("/holidays", (req: Request, res: Response) => {
  const stateQuery = (
    (req.query.state as string) ||
    (req.query.stateCode as string) ||
    ""
  ).trim();

  if (stateQuery) {
    // If state parameter provided, delegate to regional holidays logic
    const upper = stateQuery.toUpperCase();
    const matched = calendarDb.regionalHolidays.filter(
      (h) =>
        h.stateCode.toUpperCase() === upper ||
        h.applicableStateCodes?.some((c) => c.toUpperCase() === upper) ||
        h.stateName.toLowerCase().includes(stateQuery.toLowerCase()) ||
        h.category === "national" ||
        h.stateCode === "ALL"
    );
    return res.json({
      success: true,
      state: upper,
      count: matched.length,
      data: matched.map((h) => ({
        ...h,
        date: h.holidayDate,
        name: h.holidayName,
        type: h.holidayType,
        state: h.stateName,
      })),
    });
  }

  res.json({ success: true, count: calendarDb.holidays.length, data: calendarDb.holidays });
});

/**
 * POST /api/calendar/holidays
 * Admin adds a holiday
 */
calendarRouter.post("/holidays", (req: Request, res: Response) => {
  const { date, name, type, surgePercent, description } = req.body;
  if (!date || !name) {
    return res.status(400).json({ success: false, message: "Date and holiday name are required" });
  }

  const newHol: CalendarHoliday = {
    id: `hol-${Date.now().toString(36)}`,
    date,
    name,
    type: type || "festival",
    surgePercent: Number(surgePercent) || 15,
    description: description || "Custom holiday addition",
  };

  calendarDb.holidays.push(newHol);
  res.status(201).json({ success: true, message: "Holiday added successfully", data: newHol });
});

/**
 * POST /api/calendar/blackout-dates
 * Admin blocks dates (maintenance, weather, protocol)
 */
calendarRouter.post("/blackout-dates", (req: Request, res: Response) => {
  const { serviceType, serviceId, startDate, endDate, reason, blockedBy } = req.body;
  if (!startDate || !endDate || !reason) {
    return res.status(400).json({ success: false, message: "Start date, end date, and reason are required" });
  }

  const newBlackout: CalendarBlackoutDate = {
    id: `blk-${Date.now().toString(36)}`,
    serviceType: serviceType || "all",
    serviceId,
    startDate,
    endDate,
    reason,
    blockedBy: blockedBy || "Admin Operations Command",
    createdAt: new Date().toISOString(),
  };

  calendarDb.blackoutDates.unshift(newBlackout);
  res.status(201).json({ success: true, message: "Blackout date registered successfully", data: newBlackout });
});

/**
 * DELETE /api/calendar/blackout-dates/:id
 * Admin unblocks / opens dates
 */
calendarRouter.delete("/blackout-dates/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = calendarDb.blackoutDates.findIndex((b) => b.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Blackout rule not found" });
  }

  const removed = calendarDb.blackoutDates.splice(idx, 1)[0];
  res.json({ success: true, message: "Blackout dates opened successfully", data: removed });
});

/**
 * GET /api/calendar/operating-hours
 */
calendarRouter.get("/operating-hours", (req: Request, res: Response) => {
  res.json({ success: true, data: calendarDb.operatingHours });
});

/**
 * PUT /api/calendar/operating-hours
 */
calendarRouter.put("/operating-hours", (req: Request, res: Response) => {
  if (Array.isArray(req.body)) {
    calendarDb.operatingHours = req.body;
  }
  res.json({ success: true, message: "Operating hours updated", data: calendarDb.operatingHours });
});

/**
 * GET /api/calendar/cutoff-rules
 */
calendarRouter.get("/cutoff-rules", (req: Request, res: Response) => {
  res.json({
    success: true,
    bookingCutoffs: calendarDb.bookingCutoffRules,
    cancellationCutoffs: calendarDb.cancellationCutoffRules,
  });
});

/**
 * PUT /api/calendar/cutoff-rules/:id
 */
calendarRouter.put("/cutoff-rules/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const idx = calendarDb.bookingCutoffRules.findIndex((r) => r.id === id);
  if (idx !== -1) {
    calendarDb.bookingCutoffRules[idx] = {
      ...calendarDb.bookingCutoffRules[idx],
      ...req.body,
    };
    return res.json({ success: true, message: "Booking cutoff updated", data: calendarDb.bookingCutoffRules[idx] });
  }

  const cIdx = calendarDb.cancellationCutoffRules.findIndex((r) => r.id === id);
  if (cIdx !== -1) {
    calendarDb.cancellationCutoffRules[cIdx] = {
      ...calendarDb.cancellationCutoffRules[cIdx],
      ...req.body,
    };
    return res.json({ success: true, message: "Cancellation cutoff updated", data: calendarDb.cancellationCutoffRules[cIdx] });
  }

  res.status(404).json({ success: false, message: "Cutoff rule not found" });
});

// ==========================================
// SERVICE-SPECIFIC ALIAS ROUTES
// ==========================================

export const serviceCalendarRouter = Router({ mergeParams: true });

serviceCalendarRouter.get("/:serviceId/availability", (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const startDate = (req.query.startDate as string) || "2026-09-01";
  const endDate = (req.query.endDate as string) || "2026-09-30";

  // Match schedule or detect service type
  const matchedSchedule = calendarDb.schedules.find((s) => s.serviceId === serviceId);
  const serviceType: CalendarServiceType = matchedSchedule?.serviceType || "flights";

  const results: CalendarDateAvailability[] = [];
  const curr = new Date(startDate);
  const end = new Date(endDate);

  let count = 0;
  while (curr <= end && count < 60) {
    const dStr = curr.toISOString().split("T")[0];
    results.push(computeCalendarDateAvailability(serviceType, dStr));
    curr.setDate(curr.getDate() + 1);
    count++;
  }

  res.json({
    success: true,
    serviceId,
    serviceType,
    startDate,
    endDate,
    count: results.length,
    data: results,
  });
});

serviceCalendarRouter.get("/:serviceId/time-slots", (req: Request, res: Response) => {
  const { serviceId } = req.params;
  const slotDate = (req.query.date as string) || "2026-09-03";
  const timeOfDay = (req.query.timeOfDay as TimeOfDayFilter) || "all";

  let slots = calendarDb.timeSlots.filter(
    (s) => s.serviceId === serviceId && (timeOfDay === "all" || s.timeOfDay === timeOfDay)
  );

  if (slots.length === 0) {
    // Generate default slots for this service
    slots = [
      { id: `SLOT-${serviceId}-1`, serviceType: "flights", serviceId, slotDate, startTime: "08:00", endTime: "10:30", slotLabel: "Morning Slot", timeOfDay: "morning", capacity: 40, availableCapacity: 15, price: 2999, status: "available" },
      { id: `SLOT-${serviceId}-2`, serviceType: "flights", serviceId, slotDate, startTime: "14:00", endTime: "16:30", slotLabel: "Afternoon Slot", timeOfDay: "afternoon", capacity: 40, availableCapacity: 8, price: 3499, status: "filling_fast" },
      { id: `SLOT-${serviceId}-3`, serviceType: "flights", serviceId, slotDate, startTime: "19:00", endTime: "21:30", slotLabel: "Evening Slot", timeOfDay: "evening", capacity: 40, availableCapacity: 22, price: 3199, status: "available" },
    ];
  }

  res.json({
    success: true,
    serviceId,
    date: slotDate,
    count: slots.length,
    data: slots,
  });
});
