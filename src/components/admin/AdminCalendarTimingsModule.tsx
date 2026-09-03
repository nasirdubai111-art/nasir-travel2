import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Ban,
  Filter,
  Search,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Settings,
  ArrowRight,
  UserCheck,
  Sliders,
  DollarSign,
  Globe,
  Tag,
  Save,
  X,
} from "lucide-react";
import {
  CalendarSchedule,
  CalendarTimeSlot,
  CalendarHoliday,
  CalendarBlackoutDate,
  BookingCutoffRule,
  CancellationCutoffRule,
  OperatingHoursRule,
  CalendarServiceType,
  TimeOfDayFilter,
  CalendarEngineOverview,
} from "../../types";
import { CalendarService } from "../../services/CalendarService";

type AdminCalendarSubTab =
  | "schedules"
  | "time_slots"
  | "availability"
  | "holidays"
  | "blackout_dates"
  | "settings";

export function AdminCalendarTimingsModule() {
  const [activeSubTab, setActiveSubTab] = useState<AdminCalendarSubTab>("schedules");
  const [selectedService, setSelectedService] = useState<CalendarServiceType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Live state
  const [overview, setOverview] = useState<CalendarEngineOverview | null>(null);
  const [schedules, setSchedules] = useState<CalendarSchedule[]>([]);
  const [timeSlots, setTimeSlots] = useState<CalendarTimeSlot[]>([]);
  const [holidays, setHolidays] = useState<CalendarHoliday[]>([]);
  const [blackoutDates, setBlackoutDates] = useState<CalendarBlackoutDate[]>([]);
  const [cutoffRules, setCutoffRules] = useState<{
    bookingCutoffs: BookingCutoffRule[];
    cancellationCutoffs: CancellationCutoffRule[];
  }>({ bookingCutoffs: [], cancellationCutoffs: [] });
  const [operatingHours, setOperatingHours] = useState<OperatingHoursRule[]>([]);

  // Modals & Forms
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [isNewHolidayModalOpen, setIsNewHolidayModalOpen] = useState(false);
  const [isNewBlackoutModalOpen, setIsNewBlackoutModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New schedule form state
  const [newScheduleData, setNewScheduleData] = useState<Partial<CalendarSchedule>>({
    serviceType: "flights",
    title: "",
    routeOrLocation: "",
    scheduleDate: "2026-09-03",
    departureTime: "08:00",
    arrivalTime: "10:30",
    timezone: "Asia/Kolkata",
    capacity: 60,
    availableCapacity: 60,
    basePrice: 2999,
    dynamicPrice: 2999,
    status: "active",
  });

  // New holiday form state
  const [newHolidayData, setNewHolidayData] = useState({
    date: "2026-10-15",
    name: "",
    type: "festival" as const,
    surgePercent: 20,
    description: "",
  });

  // New blackout form state
  const [newBlackoutData, setNewBlackoutData] = useState({
    serviceType: "all" as CalendarServiceType | "all",
    startDate: "2026-09-25",
    endDate: "2026-09-26",
    reason: "",
    blockedBy: "Operations Command",
  });

  // Load initial data
  const loadData = async () => {
    try {
      const [ov, hol, cutoffs, hours, slots] = await Promise.all([
        CalendarService.getOverview(),
        CalendarService.getHolidays(),
        CalendarService.getCutoffRules(),
        CalendarService.getOperatingHours(),
        CalendarService.getTimeSlots("flights", "2026-09-03", "all"),
      ]);
      setOverview(ov);
      setHolidays(hol);
      setCutoffRules(cutoffs);
      setOperatingHours(hours);
      setTimeSlots(slots);

      // Fetch sample schedules via API
      const res = await fetch("/api/calendar/availability?serviceType=flights&startDate=2026-09-03&endDate=2026-09-04");
      if (res.ok) {
        // Mock default schedules if needed
        setSchedules([
          {
            id: "SCH-FL-01",
            serviceType: "flights",
            serviceId: "fl-6e-2041",
            title: "IndiGo 6E-2041 (A321neo)",
            routeOrLocation: "DEL ➔ BOM",
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
            id: "SCH-TR-01",
            serviceType: "trains",
            serviceId: "tr-22436",
            title: "Vande Bharat Express (22436)",
            routeOrLocation: "NDLS ➔ BSB (Varanasi)",
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
            id: "SCH-BUS-01",
            serviceType: "buses",
            serviceId: "bus-zb-del-mnl",
            title: "Zingbus Premium AC Sleeper",
            routeOrLocation: "Delhi ➔ Manali",
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
            id: "SCH-HTL-01",
            serviceType: "hotels",
            serviceId: "htl-taj-del",
            title: "Taj Palace New Delhi (Luxury Room)",
            routeOrLocation: "Chanakyapuri, New Delhi",
            scheduleDate: "2026-09-03",
            departureTime: "14:00",
            arrivalTime: "11:00",
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
            id: "SCH-TOUR-01",
            serviceType: "tours",
            serviceId: "tour-gold-tri",
            title: "Golden Triangle Heritage Expedition (4D/3N)",
            routeOrLocation: "Delhi-Agra-Jaipur",
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
            id: "SCH-PILG-01",
            serviceType: "pilgrimage",
            serviceId: "pilg-kashi-vip",
            title: "Kashi Vishwanath VIP Sugam Darshan Pass",
            routeOrLocation: "Gate 4, Varanasi",
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
            id: "SCH-CAB-01",
            serviceType: "cabs",
            serviceId: "cab-del-airport",
            title: "Chauffeur Airport Drop Sedan",
            routeOrLocation: "Delhi NCR ➔ IGI T3",
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
            id: "SCH-ACT-01",
            serviceType: "activities",
            serviceId: "act-sam-dunes",
            title: "Jaisalmer Sam Sand Dunes Safari",
            routeOrLocation: "Sam Sand Dunes, Jaisalmer",
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
        ]);
      }

      // Load blackouts
      setBlackoutDates([
        {
          id: "blk-01",
          serviceType: "flights",
          startDate: "2026-09-22",
          endDate: "2026-09-23",
          reason: "Runway 28/10 Resurfacing & Instrument Calibration at IGI Airport",
          blockedBy: "Airports Authority of India (AAI)",
          createdAt: "2026-08-01T10:00:00Z",
        },
        {
          id: "blk-02",
          serviceType: "tours",
          startDate: "2026-11-10",
          endDate: "2026-12-31",
          reason: "Winter Temple Portal Closure & Heavy Alpine Snowfall",
          blockedBy: "Uttarakhand Disaster Management",
          createdAt: "2026-08-05T09:00:00Z",
        },
      ]);
    } catch (err) {
      console.error("Failed loading calendar admin data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Schedule creation handler
  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await CalendarService.createSchedule(newScheduleData);
      setSchedules((prev) => [created, ...prev]);
      setIsNewScheduleModalOpen(false);
      showToast("New service schedule created and synced across API endpoints");
    } catch {
      // Offline fallback
      const localSch: CalendarSchedule = {
        id: `SCH-${Date.now().toString(36).toUpperCase()}`,
        serviceType: newScheduleData.serviceType || "flights",
        serviceId: `svc-${Date.now()}`,
        title: newScheduleData.title || "New Service Schedule",
        routeOrLocation: newScheduleData.routeOrLocation || "Delhi ➔ Destination",
        scheduleDate: newScheduleData.scheduleDate || "2026-09-03",
        departureTime: newScheduleData.departureTime || "08:00",
        arrivalTime: newScheduleData.arrivalTime || "10:30",
        timezone: "Asia/Kolkata",
        status: newScheduleData.status || "active",
        capacity: Number(newScheduleData.capacity) || 50,
        availableCapacity: Number(newScheduleData.capacity) || 50,
        basePrice: Number(newScheduleData.basePrice) || 2999,
        dynamicPrice: Number(newScheduleData.basePrice) || 2999,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setSchedules((prev) => [localSch, ...prev]);
      setIsNewScheduleModalOpen(false);
      showToast("Schedule created and stored in local memory");
    }
  };

  // Toggle schedule status (Active vs Sold Out vs Delayed)
  const handleToggleScheduleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "active" ? "sold_out" : "active";
    try {
      await CalendarService.updateSchedule(id, { status: nextStatus as any });
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextStatus as any } : s))
      );
      showToast(`Schedule status updated to ${nextStatus.toUpperCase()}`);
    } catch {
      setSchedules((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: nextStatus as any } : s))
      );
      showToast(`Schedule status updated to ${nextStatus.toUpperCase()} (local)`);
    }
  };

  // Delete schedule
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;
    try {
      await CalendarService.deleteSchedule(id);
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      showToast("Schedule deleted successfully");
    } catch {
      setSchedules((prev) => prev.filter((s) => s.id !== id));
      showToast("Schedule deleted from view");
    }
  };

  // Add holiday handler
  const handleAddHoliday = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolidayData.name) return;
    try {
      const created = await CalendarService.addHoliday(newHolidayData);
      setHolidays((prev) => [...prev, created]);
      setIsNewHolidayModalOpen(false);
      showToast(`Holiday "${newHolidayData.name}" added with +${newHolidayData.surgePercent}% surge`);
    } catch {
      setHolidays((prev) => [
        ...prev,
        {
          id: `hol-${Date.now()}`,
          date: newHolidayData.date,
          name: newHolidayData.name,
          type: newHolidayData.type,
          surgePercent: newHolidayData.surgePercent,
          description: newHolidayData.description,
        },
      ]);
      setIsNewHolidayModalOpen(false);
      showToast(`Holiday added locally`);
    }
  };

  // Add blackout date handler
  const handleAddBlackout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlackoutData.reason) return;
    try {
      const created = await CalendarService.addBlackoutDate(newBlackoutData);
      setBlackoutDates((prev) => [created, ...prev]);
      setIsNewBlackoutModalOpen(false);
      showToast("Blackout date blocked successfully");
    } catch {
      setBlackoutDates((prev) => [
        {
          id: `blk-${Date.now()}`,
          serviceType: newBlackoutData.serviceType,
          startDate: newBlackoutData.startDate,
          endDate: newBlackoutData.endDate,
          reason: newBlackoutData.reason,
          blockedBy: newBlackoutData.blockedBy,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setIsNewBlackoutModalOpen(false);
      showToast("Blackout registered locally");
    }
  };

  // Remove blackout handler
  const handleRemoveBlackout = async (id: string) => {
    try {
      await CalendarService.removeBlackoutDate(id);
      setBlackoutDates((prev) => prev.filter((b) => b.id !== id));
      showToast("Blackout date cleared — booking opened");
    } catch {
      setBlackoutDates((prev) => prev.filter((b) => b.id !== id));
      showToast("Blackout cleared locally");
    }
  };

  // Filtered schedules
  const filteredSchedules = schedules.filter((s) => {
    if (selectedService !== "all" && s.serviceType !== selectedService) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.routeOrLocation.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Engine KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Schedules</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {overview?.totalSchedules || schedules.length}
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Across 8 Travel Services</div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Capacity</div>
          <div className="text-xl font-black text-slate-900 mt-1">
            {overview?.overallCapacity?.toLocaleString("en-IN") || "4,500"}
          </div>
          <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
            {overview?.availableCapacity?.toLocaleString("en-IN") || "2,840"} Available Seats/Rooms
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Holiday</div>
          <div className="text-sm font-black text-amber-900 truncate mt-1">
            {overview?.upcomingHoliday?.name || "Janmashtami"}
          </div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            {overview?.upcomingHoliday?.date || "2026-09-04"} (+{overview?.upcomingHoliday?.surgePercent || 25}% Surge)
          </div>
        </div>

        <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Blackout Controls</div>
          <div className="text-xl font-black text-rose-600 mt-1">
            {blackoutDates.length} Blocked
          </div>
          <div className="text-[10px] text-slate-500 font-semibold mt-0.5">Runway &amp; Weather Safe</div>
        </div>
      </div>

      {/* Navigation Sub-Tabs matching user requirements */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab("schedules")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "schedules"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Schedules Management
          </button>

          <button
            onClick={() => setActiveSubTab("time_slots")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "time_slots"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Time Slots &amp; Batches
          </button>

          <button
            onClick={() => setActiveSubTab("availability")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "availability"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Availability Matrix
          </button>

          <button
            onClick={() => setActiveSubTab("holidays")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "holidays"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Holidays ({holidays.length})
          </button>

          <button
            onClick={() => setActiveSubTab("blackout_dates")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "blackout_dates"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Blackout Dates ({blackoutDates.length})
          </button>

          <button
            onClick={() => setActiveSubTab("settings")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "settings"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Cut-off &amp; Operating SLA
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === "schedules" && (
            <button
              onClick={() => setIsNewScheduleModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Schedule</span>
            </button>
          )}

          {activeSubTab === "holidays" && (
            <button
              onClick={() => setIsNewHolidayModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Holiday</span>
            </button>
          )}

          {activeSubTab === "blackout_dates" && (
            <button
              onClick={() => setIsNewBlackoutModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Block Dates</span>
            </button>
          )}
        </div>
      </div>

      {/* 1. SCHEDULES MANAGEMENT SUBTAB */}
      {activeSubTab === "schedules" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Filter Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Service:</span>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-white"
              >
                <option value="all">All Services</option>
                <option value="flights">Flights</option>
                <option value="trains">Trains</option>
                <option value="buses">Buses</option>
                <option value="hotels">Hotels</option>
                <option value="tours">Tours</option>
                <option value="pilgrimage">Pilgrimage</option>
                <option value="cabs">Cabs</option>
                <option value="activities">Activities</option>
              </select>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search schedule title, route, or ID..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 w-full sm:w-64 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Schedules Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Service &amp; Title</th>
                  <th className="py-3 px-3">Route / Location</th>
                  <th className="py-3 px-3">Date &amp; Departure</th>
                  <th className="py-3 px-3">Arrival</th>
                  <th className="py-3 px-3">Capacity</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSchedules.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-extrabold text-slate-900">{item.title}</div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                        <span className="uppercase font-bold text-blue-600">{item.serviceType}</span>
                        <span>•</span>
                        <span>{item.id}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{item.routeOrLocation}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.scheduleDate}</div>
                      <div className="text-[11px] text-blue-700 font-semibold">{item.departureTime} ({item.timezone.split("/")[1] || "IST"})</div>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-700">{item.arrivalTime}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">
                        {item.availableCapacity} / {item.capacity}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Math.round(((item.capacity - item.availableCapacity) / item.capacity) * 100)}% Booked
                      </div>
                    </td>
                    <td className="py-3 px-3 font-black text-slate-900">
                      ₹{item.dynamicPrice.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleScheduleStatus(item.id, item.status)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer ${
                          item.status === "active"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : item.status === "sold_out"
                            ? "bg-rose-100 text-rose-800 hover:bg-rose-200"
                            : "bg-amber-100 text-amber-800"
                        }`}
                        title="Click to toggle Sold Out / Active"
                      >
                        {item.status}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleScheduleStatus(item.id, item.status)}
                          className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                          title="Toggle Status"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(item.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete Schedule"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. TIME SLOTS SUBTAB */}
      {activeSubTab === "time_slots" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">Time Slots &amp; Batches Engine</h3>
              <p className="text-xs text-slate-500">Configured time slots for morning, afternoon, evening, and night operations</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timeSlots.map((slot) => (
              <div key={slot.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{slot.startTime} ➔ {slot.endTime}</span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {slot.timeOfDay}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-semibold mt-0.5">{slot.slotLabel}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Capacity: {slot.availableCapacity} / {slot.capacity} spots available
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-slate-900 text-sm">₹{slot.price}</div>
                  <span className={`text-[10px] font-extrabold uppercase ${slot.status === "sold_out" ? "text-rose-600" : "text-emerald-600"}`}>
                    {slot.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AVAILABILITY MATRIX SUBTAB */}
      {activeSubTab === "availability" && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Real-Time Seat &amp; Room Availability Matrix</h3>
            <p className="text-xs text-slate-500">Live operational capacity across 8 services for September 2026</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {schedules.map((s) => (
              <div key={s.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                    {s.serviceType}
                  </span>
                  <div className="font-bold text-slate-800 text-xs mt-1 truncate">{s.title}</div>
                  <div className="text-[11px] text-slate-500">{s.scheduleDate} • {s.departureTime}</div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="font-extrabold text-slate-900">{s.availableCapacity}</span>
                    <span className="text-slate-400">/{s.capacity} left</span>
                  </div>

                  <button
                    onClick={() => handleToggleScheduleStatus(s.id, s.status)}
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded cursor-pointer ${
                      s.status === "active" ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"
                    }`}
                  >
                    {s.status === "active" ? "Open" : "Sold Out"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. HOLIDAYS MANAGEMENT SUBTAB */}
      {activeSubTab === "holidays" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm">National, Festival &amp; Regional Holidays</h3>
            <p className="text-xs text-slate-500">Configured holidays automatically trigger dynamic surge pricing multipliers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-3">Holiday Name</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Surge Surcharge</th>
                  <th className="py-3 px-4">Description / Regulatory Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-black text-slate-900">{h.date}</td>
                    <td className="py-3 px-3 font-extrabold text-amber-950">{h.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        {h.type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-black text-emerald-700">+{h.surgePercent}%</td>
                    <td className="py-3 px-4 text-slate-600">{h.description || "Official gazetted calendar"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. BLACKOUT DATES SUBTAB */}
      {activeSubTab === "blackout_dates" && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-900 text-sm">Blackout &amp; Maintenance Blocked Dates</h3>
            <p className="text-xs text-slate-500">Dates blocked for runway resurfacing, alpine winter closures, or state safety protocols</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">End Date</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-3">Blocked By</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {blackoutDates.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900 uppercase">{b.serviceType}</td>
                    <td className="py-3 px-3 font-semibold text-rose-700">{b.startDate}</td>
                    <td className="py-3 px-3 font-semibold text-rose-700">{b.endDate}</td>
                    <td className="py-3 px-4 text-slate-700">{b.reason}</td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">{b.blockedBy}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleRemoveBlackout(b.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] cursor-pointer"
                      >
                        Open Dates
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. SETTINGS & CUTOFF RULES SUBTAB */}
      {activeSubTab === "settings" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Booking Cut-off Rules */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Booking Cut-off Rules</h3>
            <p className="text-xs text-slate-500 mb-4">Minimum lead time required before departure or service commencement</p>
            <div className="space-y-3">
              {cutoffRules.bookingCutoffs.map((rule) => (
                <div key={rule.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{rule.serviceName}</div>
                    <div className="text-slate-500 text-[11px]">{rule.description}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-blue-600">{rule.minMinutesBeforeDeparture} mins</span>
                    <div className="text-[10px] text-slate-400">Advance: {rule.maxDaysInAdvance}d</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancellation SLA Rules */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-extrabold text-slate-900 text-sm mb-1">Cancellation Cut-off Matrix</h3>
            <p className="text-xs text-slate-500 mb-4">Statutory refund windows and penalties by service category</p>
            <div className="space-y-3">
              {cutoffRules.cancellationCutoffs.map((rule) => (
                <div key={rule.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-slate-900 uppercase">{rule.serviceType}</div>
                    <div className="text-slate-500 text-[11px]">
                      Full Refund &gt; {rule.fullRefundHoursBefore}h • Partial ({rule.partialRefundPercent}%) &gt; {rule.partialRefundHoursBefore}h
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-rose-600">0% under {rule.noRefundHoursBefore}h</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE NEW SCHEDULE MODAL */}
      {isNewScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-200 p-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Create Service Schedule</h3>
              <button onClick={() => setIsNewScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Category</label>
                <select
                  value={newScheduleData.serviceType}
                  onChange={(e) => setNewScheduleData({ ...newScheduleData, serviceType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold text-slate-800"
                >
                  <option value="flights">Flights</option>
                  <option value="trains">Trains</option>
                  <option value="buses">Buses</option>
                  <option value="hotels">Hotels</option>
                  <option value="tours">Tours</option>
                  <option value="pilgrimage">Pilgrimage</option>
                  <option value="cabs">Cabs</option>
                  <option value="activities">Activities</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Schedule Title / Carrier Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. IndiGo 6E-4521 or Vande Bharat Express"
                  value={newScheduleData.title}
                  onChange={(e) => setNewScheduleData({ ...newScheduleData, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Route / Terminal / City</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DEL (Delhi) ➔ BLR (Bengaluru)"
                  value={newScheduleData.routeOrLocation}
                  onChange={(e) => setNewScheduleData({ ...newScheduleData, routeOrLocation: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Schedule Date</label>
                  <input
                    type="date"
                    required
                    value={newScheduleData.scheduleDate}
                    onChange={(e) => setNewScheduleData({ ...newScheduleData, scheduleDate: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Departure Time</label>
                  <input
                    type="time"
                    required
                    value={newScheduleData.departureTime}
                    onChange={(e) => setNewScheduleData({ ...newScheduleData, departureTime: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Arrival Time</label>
                  <input
                    type="time"
                    required
                    value={newScheduleData.arrivalTime}
                    onChange={(e) => setNewScheduleData({ ...newScheduleData, arrivalTime: e.target.value })}
                    className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Total Capacity</label>
                  <input
                    type="number"
                    required
                    value={newScheduleData.capacity}
                    onChange={(e) =>
                      setNewScheduleData({
                        ...newScheduleData,
                        capacity: Number(e.target.value),
                        availableCapacity: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Base Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newScheduleData.basePrice}
                    onChange={(e) =>
                      setNewScheduleData({
                        ...newScheduleData,
                        basePrice: Number(e.target.value),
                        dynamicPrice: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewScheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD HOLIDAY MODAL */}
      {isNewHolidayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Add Calendar Holiday</h3>
              <button onClick={() => setIsNewHolidayModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddHoliday} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Holiday Date</label>
                <input
                  type="date"
                  required
                  value={newHolidayData.date}
                  onChange={(e) => setNewHolidayData({ ...newHolidayData, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Holiday Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali (Deepavali) or Eid-ul-Fitr"
                  value={newHolidayData.name}
                  onChange={(e) => setNewHolidayData({ ...newHolidayData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newHolidayData.type}
                    onChange={(e) => setNewHolidayData({ ...newHolidayData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  >
                    <option value="festival">Festival</option>
                    <option value="national">National</option>
                    <option value="gazetted">Gazetted</option>
                    <option value="restricted">Restricted</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Surge Price Multiplier (%)</label>
                  <input
                    type="number"
                    value={newHolidayData.surgePercent}
                    onChange={(e) => setNewHolidayData({ ...newHolidayData, surgePercent: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewHolidayModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Add Holiday
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD BLACKOUT DATE MODAL */}
      {isNewBlackoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">Block Dates (Blackout)</h3>
              <button onClick={() => setIsNewBlackoutModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBlackout} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Service Type</label>
                <select
                  value={newBlackoutData.serviceType}
                  onChange={(e) => setNewBlackoutData({ ...newBlackoutData, serviceType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                >
                  <option value="all">All Services</option>
                  <option value="flights">Flights</option>
                  <option value="trains">Trains</option>
                  <option value="buses">Buses</option>
                  <option value="hotels">Hotels</option>
                  <option value="tours">Tours</option>
                  <option value="pilgrimage">Pilgrimage</option>
                  <option value="cabs">Cabs</option>
                  <option value="activities">Activities</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newBlackoutData.startDate}
                    onChange={(e) => setNewBlackoutData({ ...newBlackoutData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newBlackoutData.endDate}
                    onChange={(e) => setNewBlackoutData({ ...newBlackoutData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Blocking Reason</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Runway Resurfacing or Monsoon Alert"
                  value={newBlackoutData.reason}
                  onChange={(e) => setNewBlackoutData({ ...newBlackoutData, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewBlackoutModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Register Blackout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
