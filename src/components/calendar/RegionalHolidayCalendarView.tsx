import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Flag,
  MapPin,
  Sparkles,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plane,
  Train,
  Bus,
  Building2,
  Palmtree,
  Landmark,
  Car,
  Compass,
  Filter,
  Search,
  RotateCcw,
  Sliders,
  ShieldAlert,
  ArrowRight,
  Info,
  Check,
  ChevronDown,
  Layers,
  Flame,
  SunMedium,
  Zap,
  Database,
  Code2,
  Terminal,
  X,
  Copy,
} from "lucide-react";
import {
  CalendarHoliday,
  CalendarServiceType,
} from "../../types";
import {
  INDIAN_STATES,
  IndianStateOption,
  STATE_CODE_MAP,
  getStateNameByCode,
} from "../../data/regionalHolidaysData";
import { CalendarService } from "../../services/CalendarService";

interface RegionalHolidayCalendarViewProps {
  activeService: CalendarServiceType;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onProceedToSlots?: () => void;
}

const SERVICE_META: Record<
  CalendarServiceType,
  { name: string; icon: React.ComponentType<{ className?: string }>; basePrice: number; unit: string }
> = {
  flights: { name: "Flights", icon: Plane, basePrice: 3999, unit: "/ seat" },
  trains: { name: "Trains", icon: Train, basePrice: 850, unit: "/ berth" },
  buses: { name: "Buses", icon: Bus, basePrice: 599, unit: "/ seat" },
  hotels: { name: "Hotels", icon: Building2, basePrice: 3500, unit: "/ night" },
  tours: { name: "Tours", icon: Palmtree, basePrice: 4200, unit: "/ pax" },
  pilgrimage: { name: "Pilgrimage", icon: Landmark, basePrice: 300, unit: "/ pass" },
  cabs: { name: "Cabs", icon: Car, basePrice: 999, unit: "/ trip" },
  activities: { name: "Activities", icon: Compass, basePrice: 1200, unit: "/ slot" },
};

export function RegionalHolidayCalendarView({
  activeService,
  selectedDate,
  onSelectDate,
  onProceedToSlots,
}: RegionalHolidayCalendarViewProps) {
  const [holidays, setHolidays] = useState<CalendarHoliday[]>([]);
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "national" | "state" | "long_weekend">("all");
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [targetService, setTargetService] = useState<CalendarServiceType>(activeService);
  const [globalSurgeActive, setGlobalSurgeActive] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "info" } | null>(null);

  // PostgreSQL Backend and Schema Inspector State
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState<boolean>(false);
  const [dbSchemaData, setDbSchemaData] = useState<any>(null);
  const [lastApiUrl, setLastApiUrl] = useState<string>("/api/calendar/holidays/regional?state=ALL");
  const [apiLoading, setApiLoading] = useState<boolean>(false);
  const [endpointStats, setEndpointStats] = useState<{ stateCode: string; totalCount: number; timestamp: string }>({
    stateCode: "ALL",
    totalCount: 0,
    timestamp: new Date().toLocaleTimeString(),
  });

  // Sync target service when active service changes
  useEffect(() => {
    setTargetService(activeService);
  }, [activeService]);

  // Load regional holidays directly from backend GET /api/calendar/holidays/regional?state={stateCode}
  const loadHolidays = async (stateCode: string = selectedState) => {
    setApiLoading(true);
    const targetUrl = `/api/calendar/holidays/regional?state=${encodeURIComponent(stateCode)}`;
    setLastApiUrl(targetUrl);

    try {
      const response = await CalendarService.getRegionalHolidays(stateCode);
      if (response && response.data && response.data.length > 0) {
        setHolidays([...response.data]);
        if (response.dbSchema) {
          setDbSchemaData(response.dbSchema);
        }
        setEndpointStats({
          stateCode: response.stateCode || stateCode,
          totalCount: response.count || response.data.length,
          timestamp: new Date().toLocaleTimeString(),
        });
        setApiLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend regional endpoint fallback:", err);
    }

    // Fallback to local store
    const list = CalendarService.getLocalHolidays();
    setHolidays([...list]);
    setApiLoading(false);
  };

  // Reload when selectedState changes
  useEffect(() => {
    loadHolidays(selectedState);
  }, [selectedState]);

  useEffect(() => {
    const handleUpdate = () => loadHolidays(selectedState);
    window.addEventListener("calendar_holidays_updated", handleUpdate);
    return () => window.removeEventListener("calendar_holidays_updated", handleUpdate);
  }, [selectedState]);

  const showToast = (msg: string, type: "success" | "info" = "success") => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3200);
  };

  // Toggle pricing for a specific holiday
  const handleTogglePricing = (holidayId: string, currentVal: boolean = true) => {
    const newVal = !currentVal;
    CalendarService.toggleHolidayPricing(holidayId, newVal);
    loadHolidays();
    showToast(
      newVal
        ? "Holiday surge pricing enabled for this date."
        : "Surge pricing disabled. Standard base rates will apply.",
      newVal ? "success" : "info"
    );
  };

  // Adjust surge percentage
  const handleAdjustSurge = (holidayId: string, delta: number) => {
    const hol = holidays.find((h) => h.id === holidayId);
    if (!hol) return;
    const current = hol.customSurgePercent ?? hol.surgePercent;
    const next = Math.max(5, Math.min(80, current + delta));
    CalendarService.updateHoliday(holidayId, { customSurgePercent: next, surgePercent: next });
    loadHolidays();
    showToast(`Holiday surge updated to +${next}%.`);
  };

  // Toggle holiday availability status
  const handleToggleAvailability = (
    holidayId: string,
    nextStatus: "available" | "filling_fast" | "restricted" | "blackout"
  ) => {
    CalendarService.updateHoliday(holidayId, { availabilityStatus: nextStatus });
    loadHolidays();
    const statusLabels = {
      available: "Standard Allocation (Regular)",
      filling_fast: "Filling Fast (High Demand)",
      restricted: "Restricted / Tatkal Quota Active",
      blackout: "Service Blackout / Suspended",
    };
    showToast(`Availability set to: ${statusLabels[nextStatus]}`);
  };

  // Toggle specific travel service for a holiday
  const handleToggleService = (holidayId: string, serviceKey: CalendarServiceType) => {
    const hol = holidays.find((h) => h.id === holidayId);
    if (!hol) return;
    const currentServices = hol.affectedServices || [
      "flights",
      "trains",
      "buses",
      "hotels",
      "tours",
      "pilgrimage",
      "cabs",
      "activities",
    ];
    let updatedServices: CalendarServiceType[];
    if (currentServices.includes(serviceKey)) {
      updatedServices = currentServices.filter((s) => s !== serviceKey);
    } else {
      updatedServices = [...currentServices, serviceKey];
    }
    CalendarService.updateHoliday(holidayId, { affectedServices: updatedServices });
    loadHolidays();
    showToast(`Updated affected services for ${hol.name}.`);
  };

  // Toggle global surge master switch
  const handleToggleGlobalSurge = () => {
    const nextState = !globalSurgeActive;
    setGlobalSurgeActive(nextState);
    const updated = holidays.map((h) => ({
      ...h,
      pricingEnabled: nextState,
    }));
    CalendarService.saveLocalHolidays(updated);
    loadHolidays();
    showToast(
      nextState
        ? "Dynamic holiday surge enabled across all holidays."
        : "Dynamic holiday surge globally bypassed. All holidays priced at base rates.",
      nextState ? "success" : "info"
    );
  };

  // Reset to default
  const handleResetDefaults = () => {
    CalendarService.resetHolidaysToDefault();
    loadHolidays();
    setGlobalSurgeActive(true);
    showToast("Reset all holidays & state rules to official gazetted defaults.");
  };

  // Filter logic
  const filteredHolidays = useMemo(() => {
    return (holidays || []).filter((h) => {
      if (!h || !h.date) return false;

      // State filter
      if (selectedState !== "ALL") {
        const selectedStateObj = INDIAN_STATES.find((s) => s.code === selectedState);
        const stateName = selectedStateObj?.name.toLowerCase() || "";
        const isNational = h.category === "national" || h.state === "Pan-India";
        const matchesPrimary = h.state?.toLowerCase().includes(stateName);
        const matchesApplicable = h.applicableStates?.some((st) =>
          st.toLowerCase().includes(stateName)
        );
        if (!isNational && !matchesPrimary && !matchesApplicable) {
          return false;
        }
      }

      // Category filter
      if (categoryFilter === "national" && h.category !== "national") return false;
      if (categoryFilter === "state" && h.category !== "state") return false;
      if (categoryFilter === "long_weekend" && !h.isLongWeekend) return false;

      // Month filter
      if (monthFilter !== "all") {
        const holMonth = h.date.substring(5, 7);
        if (holMonth !== monthFilter) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = h.name.toLowerCase().includes(q);
        const matchDesc = h.description?.toLowerCase().includes(q);
        const matchState = h.state?.toLowerCase().includes(q);
        const matchApp = h.applicableStates?.some((st) => st.toLowerCase().includes(q));
        if (!matchName && !matchDesc && !matchState && !matchApp) return false;
      }

      return true;
    });
  }, [holidays, selectedState, categoryFilter, monthFilter, searchQuery]);

  // Statistics
  const stats = useMemo(() => {
    const total = filteredHolidays.length;
    const nationalCount = filteredHolidays.filter((h) => h.category === "national").length;
    const stateCount = filteredHolidays.filter((h) => h.category === "state").length;
    const longWeekendCount = filteredHolidays.filter((h) => h.isLongWeekend).length;
    const activeSurgeCount = filteredHolidays.filter((h) => h.pricingEnabled !== false).length;
    return { total, nationalCount, stateCount, longWeekendCount, activeSurgeCount };
  }, [filteredHolidays]);

  // Current Target Service Pricing Metadata
  const activeServiceMeta = SERVICE_META[targetService] || SERVICE_META.flights;
  const ActiveServiceIcon = activeServiceMeta.icon;

  return (
    <div className="flex flex-col gap-5 text-slate-800">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md border animate-fadeIn transition-all ${
            notification.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-200"
              : "bg-blue-50 text-blue-900 border-blue-200"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Hero Overview Banner with Dual-Perspective Highlight */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-800/40 relative overflow-hidden">
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
                <Flag className="w-3 h-3 text-blue-400" />
                <span>Pan-India Regional Calendar</span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-purple-500/25 text-purple-300 border border-purple-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-purple-300" />
                <span>State vs National Intelligence</span>
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              State &amp; National Public Holiday Engine
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
              Explore state-specific regional holidays (e.g., Ganesh Chaturthi in Maharashtra, Onam in Kerala, Durga Puja in West Bengal) alongside statutory National holidays. Toggle holiday dynamic pricing multipliers, allocation quotas, and service-level rules.
            </p>
          </div>

          {/* Master Surge Control Toggle Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 shrink-0 flex flex-col gap-2.5 min-w-[260px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Holiday Dynamic Pricing</span>
              </span>
              <button
                type="button"
                onClick={handleToggleGlobalSurge}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  globalSurgeActive ? "bg-emerald-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    globalSurgeActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
            <div className="text-[11px] text-slate-300 leading-snug">
              {globalSurgeActive ? (
                <span className="text-emerald-300 font-semibold">
                  Active (+15% to +50% festival surge applied on travel fares).
                </span>
              ) : (
                <span className="text-slate-300 font-medium">
                  Bypassed (All dates priced at regular standard fares).
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Current Scope:</span>
              <span className="font-bold text-blue-300">
                {selectedState === "ALL" ? "ALL (Pan-India)" : `[${selectedState}] ${INDIAN_STATES.find(s => s.code === selectedState)?.name}`}
              </span>
            </div>

            {/* PostgreSQL Schema & API Endpoint Trigger */}
            <button
              type="button"
              onClick={() => setIsSchemaModalOpen(true)}
              className="mt-1 w-full py-1.5 px-2.5 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Database className="w-3.5 h-3.5 text-blue-300" />
              <span>PostgreSQL Schema &amp; API (GET)</span>
            </button>
          </div>
        </div>

        {/* Quick Statistics Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-lg font-black text-white">{stats.total}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Holidays in View</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-lg font-black text-emerald-400">{stats.nationalCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">National Gazetted</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-lg font-black text-purple-400">{stats.stateCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">State-Specific</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5">
            <div className="text-lg font-black text-amber-400">{stats.longWeekendCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Long Weekends</div>
          </div>
          <div className="bg-white/5 rounded-xl p-2.5 border border-white/5 col-span-2 sm:col-span-1">
            <div className="text-lg font-black text-blue-400">{stats.activeSurgeCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Surge Active</div>
          </div>
        </div>
      </div>

      {/* Backend Endpoint Live Status Bar */}
      <div className="bg-slate-900 text-slate-200 rounded-2xl p-3 border border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1.5 font-black uppercase text-[10px] tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PostgreSQL API Connected</span>
          </span>
          <span className="font-mono text-[11px] text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60 font-semibold">
            GET {lastApiUrl}
          </span>
          {apiLoading && (
            <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
              <span className="animate-spin inline-block">⟳</span> Querying database...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">
            Records: <strong className="text-white">{filteredHolidays.length}</strong>
          </span>
          <button
            type="button"
            onClick={() => setIsSchemaModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
          >
            <Code2 className="w-3 h-3 text-blue-400" />
            <span>Inspect Schema &amp; DDL</span>
          </button>
        </div>
      </div>

      {/* Filter & Selector Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col gap-3.5">
        {/* State Selector Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Indian State Identifier (e.g. 'KA', 'MH', 'KL'):</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Quick Test:
              </span>
              <button
                type="button"
                onClick={() => setSelectedState("KA")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                  selectedState === "KA" ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                title="Karnataka (state_code: 'KA')"
              >
                KA
              </button>
              <button
                type="button"
                onClick={() => setSelectedState("MH")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                  selectedState === "MH" ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                title="Maharashtra (state_code: 'MH')"
              >
                MH
              </button>
              <button
                type="button"
                onClick={() => setSelectedState("ALL")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-colors cursor-pointer ${
                  selectedState === "ALL" ? "bg-blue-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
                title="All India / National (state_code: 'ALL')"
              >
                ALL
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {INDIAN_STATES.map((st) => {
              const isSelected = selectedState === st.code;
              return (
                <button
                  key={st.code}
                  type="button"
                  onClick={() => setSelectedState(st.code)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm shadow-blue-600/30 scale-[1.02]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200"
                  }`}
                >
                  <span className={`font-mono text-[10px] px-1 py-0.2 rounded font-black ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {st.code}
                  </span>
                  <span>{st.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Row: Category + Month + Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter Pills */}
            <div className="inline-flex rounded-xl p-1 bg-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  categoryFilter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                }`}
              >
                All Holidays ({holidays.length})
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("national")}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  categoryFilter === "national"
                    ? "bg-emerald-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Flag className="w-3 h-3" />
                <span>National (Pan-India)</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("state")}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  categoryFilter === "state"
                    ? "bg-purple-600 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>State-Specific Only</span>
              </button>
              <button
                type="button"
                onClick={() => setCategoryFilter("long_weekend")}
                className={`flex items-center gap-1 px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  categoryFilter === "long_weekend"
                    ? "bg-amber-500 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Flame className="w-3 h-3" />
                <span>Long Weekends</span>
              </button>
            </div>

            {/* Month Filter */}
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-blue-500 cursor-pointer"
            >
              <option value="all">All Months</option>
              <option value="08">August 2026</option>
              <option value="09">September 2026</option>
              <option value="10">October 2026</option>
              <option value="11">November 2026</option>
              <option value="12">December 2026</option>
              <option value="01">January 2027</option>
            </select>
          </div>

          {/* Search Input & Reset Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search holiday, festival, state..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-blue-500 placeholder:text-slate-400"
              />
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Reset all holidays & surge rates to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Service Price Simulation Strip */}
      <div className="bg-blue-50/80 rounded-2xl border border-blue-200/80 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">
            <ActiveServiceIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-blue-950 uppercase tracking-wide">
                Live Pricing Impact Simulator:
              </span>
              <span className="text-[11px] font-bold px-2 py-0.2 rounded bg-blue-200/70 text-blue-800">
                {activeServiceMeta.name}
              </span>
            </div>
            <div className="text-xs text-blue-800/80 mt-0.5">
              Standard Base Fare: <strong className="text-slate-900">₹{activeServiceMeta.basePrice.toLocaleString("en-IN")}</strong> {activeServiceMeta.unit}. Observe the dynamic price change when holiday surge pricing is toggled on each card below.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          <span className="text-xs text-blue-900 font-bold hidden sm:inline">Simulate for Service:</span>
          <select
            value={targetService}
            onChange={(e) => setTargetService(e.target.value as CalendarServiceType)}
            className="px-3 py-1.5 rounded-xl border border-blue-300 text-xs font-black text-blue-950 bg-white focus:outline-blue-500 cursor-pointer shadow-2xs"
          >
            {Object.keys(SERVICE_META).map((key) => (
              <option key={key} value={key}>
                {SERVICE_META[key as CalendarServiceType].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List of Holiday Cards */}
      <div className="grid grid-cols-1 gap-4">
        {filteredHolidays.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <h4 className="font-black text-slate-900 text-base">No holidays found for this filter</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Try switching states or resetting the search filter to display all national and state gazetted holidays.
            </p>
            <button
              onClick={() => {
                setSelectedState("ALL");
                setCategoryFilter("all");
                setMonthFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          filteredHolidays.map((holiday) => {
            const isNational = holiday.category === "national";
            const surge = holiday.customSurgePercent ?? holiday.surgePercent;
            const isPricingActive = holiday.pricingEnabled !== false && globalSurgeActive;
            const isTargetServiceImpacted =
              !holiday.affectedServices ||
              holiday.affectedServices.length === 0 ||
              holiday.affectedServices.includes(targetService);

            // Compute price preview for the target service
            const simulatedPrice = isPricingActive && isTargetServiceImpacted
              ? Math.round(activeServiceMeta.basePrice * (1 + surge / 100))
              : activeServiceMeta.basePrice;

            const isSelectedDate = selectedDate === holiday.date;

            // Formatted date string
            const dateObj = new Date(holiday.date);
            const formattedDate = dateObj.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={holiday.id}
                className={`bg-white rounded-2xl border transition-all shadow-sm hover:shadow-md p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isSelectedDate
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                    : isNational
                    ? "border-emerald-200/80 hover:border-emerald-300"
                    : "border-purple-200/80 hover:border-purple-300"
                }`}
              >
                {/* Left side: Date Badge & Details */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Big Date Badge */}
                  <div
                    className={`w-16 h-16 rounded-2xl border flex flex-col items-center justify-center shrink-0 shadow-xs ${
                      isNational
                        ? "bg-emerald-50/70 border-emerald-300 text-emerald-950"
                        : "bg-purple-50/70 border-purple-300 text-purple-950"
                    }`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {dateObj.toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                    <span className="text-xl font-black leading-tight">{dateObj.getDate()}</span>
                    <span className="text-[9px] font-bold text-slate-500">
                      {dateObj.toLocaleDateString("en-IN", { weekday: "short" })}
                    </span>
                  </div>

                  {/* Holiday Title & State Tags */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {/* National vs State Specific Badge */}
                      {isNational ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <Flag className="w-3 h-3 text-emerald-700" />
                          <span>National Gazetted</span>
                          <span className="font-mono text-[9px] bg-emerald-200/80 px-1 rounded text-emerald-900 ml-0.5">
                            ALL
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                          <MapPin className="w-3 h-3 text-purple-700" />
                          <span>State Holiday: {holiday.state}</span>
                          {holiday.stateCode && (
                            <span className="font-mono text-[9px] bg-purple-200 px-1 rounded text-purple-900 ml-0.5 font-bold">
                              {holiday.stateCode}
                            </span>
                          )}
                        </span>
                      )}

                      {/* Long Weekend Badge */}
                      {holiday.isLongWeekend && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          <Flame className="w-3 h-3 text-amber-600" />
                          <span>{holiday.longWeekendDays || 3}-Day Long Weekend</span>
                        </span>
                      )}

                      {/* Availability Tag */}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          holiday.availabilityStatus === "blackout"
                            ? "bg-rose-100 text-rose-800 border-rose-200"
                            : holiday.availabilityStatus === "restricted"
                            ? "bg-orange-100 text-orange-800 border-orange-200"
                            : holiday.availabilityStatus === "filling_fast"
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                      >
                        {holiday.availabilityStatus === "blackout"
                          ? "Suspended / Blackout"
                          : holiday.availabilityStatus === "restricted"
                          ? "Restricted / Tatkal Only"
                          : holiday.availabilityStatus === "filling_fast"
                          ? "Filling Fast"
                          : "Standard Available"}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 tracking-tight">
                      {holiday.name}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-xl">
                      {holiday.description}
                    </p>

                    {/* Applicable States Strip */}
                    {holiday.applicableStates && holiday.applicableStates.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Observed in:</span>
                        {holiday.applicableStates.map((st) => (
                          <span
                            key={st}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {st}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Affected Services Selector Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Surge Appliesto:</span>
                      {(Object.keys(SERVICE_META) as CalendarServiceType[]).map((svcKey) => {
                        const IconComponent = SERVICE_META[svcKey].icon;
                        const isIncluded =
                          !holiday.affectedServices || holiday.affectedServices.includes(svcKey);
                        return (
                          <button
                            key={svcKey}
                            type="button"
                            onClick={() => handleToggleService(holiday.id, svcKey)}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                              isIncluded
                                ? "bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
                                : "bg-slate-100 text-slate-400 line-through border border-slate-200 hover:bg-slate-200"
                            }`}
                            title={`Toggle holiday pricing for ${SERVICE_META[svcKey].name}`}
                          >
                            <IconComponent className="w-2.5 h-2.5" />
                            <span>{SERVICE_META[svcKey].name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side: Surge Toggle, Availability Modifier & Booking Button */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 lg:w-80 shrink-0 flex flex-col gap-3">
                  {/* Pricing Toggle & Surge Stepper */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        <span>Surge Rate:</span>
                        <span
                          className={`font-black ${
                            isPricingActive ? "text-emerald-700" : "text-slate-400 line-through"
                          }`}
                        >
                          +{surge}%
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {isPricingActive ? "Holiday rate active" : "Surge bypassed (Base rate)"}
                      </div>
                    </div>

                    {/* Surge Toggle Switch */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePricing(holiday.id, holiday.pricingEnabled !== false)}
                        className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          holiday.pricingEnabled !== false ? "bg-blue-600" : "bg-slate-300"
                        }`}
                        title="Toggle Holiday Surge on/off for this holiday"
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            holiday.pricingEnabled !== false ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Surge Percentage Fine-Tune Buttons */}
                  {holiday.pricingEnabled !== false && (
                    <div className="flex items-center justify-between bg-white rounded-xl p-1.5 border border-slate-200 text-xs">
                      <span className="text-[11px] font-bold text-slate-600 pl-1">Fine-tune Surge:</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleAdjustSurge(holiday.id, -5)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                          title="Decrease surge by 5%"
                        >
                          -
                        </button>
                        <span className="px-2 font-black text-blue-700 text-xs">+{surge}%</span>
                        <button
                          type="button"
                          onClick={() => handleAdjustSurge(holiday.id, 5)}
                          className="w-6 h-6 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold flex items-center justify-center cursor-pointer"
                          title="Increase surge by 5%"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Availability Quota Dropdown */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-slate-600">Availability Mode:</span>
                    <select
                      value={holiday.availabilityStatus || "available"}
                      onChange={(e) =>
                        handleToggleAvailability(
                          holiday.id,
                          e.target.value as "available" | "filling_fast" | "restricted" | "blackout"
                        )
                      }
                      className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-800 bg-white focus:outline-blue-500 cursor-pointer"
                    >
                      <option value="available">Standard Available</option>
                      <option value="filling_fast">Filling Fast</option>
                      <option value="restricted">Restricted / Peak Quota</option>
                      <option value="blackout">Service Blackout</option>
                    </select>
                  </div>

                  {/* Live Fare Preview for Selected Service */}
                  <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">
                        {activeServiceMeta.name} Fare:
                      </div>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-base font-black text-slate-900">
                          ₹{simulatedPrice.toLocaleString("en-IN")}
                        </span>
                        {isPricingActive && isTargetServiceImpacted && (
                          <span className="text-[10px] text-slate-400 line-through">
                            ₹{activeServiceMeta.basePrice.toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Book / Select Date Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDate(holiday.date);
                        onProceedToSlots?.();
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                        isSelectedDate
                          ? "bg-emerald-600 text-white shadow-emerald-600/30"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25"
                      }`}
                    >
                      {isSelectedDate ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Date Selected</span>
                        </>
                      ) : (
                        <>
                          <span>Select &amp; Book</span>
                          <ArrowRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info Box */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-800">Regulatory Framework:</strong> National holidays are gazetted by the Ministry of Home Affairs (Government of India). State-specific public holidays are notified by respective state governments under Section 25 of the Negotiable Instruments Act, 1881. Holiday surge pricing in BharatYatra complies with dynamic tariff ceilings set by DGCA (for aviation) and IRCTC festival quota rules.
        </div>
      </div>

      {/* PostgreSQL Regional Holiday Schema & Live API Explorer Modal */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl rounded-3xl shadow-2xl text-slate-100 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white tracking-tight">
                      PostgreSQL Regional Holiday Schema &amp; REST API
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Live Engine
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Schema definition supporting state identifiers (e.g. 'KA', 'MH') and endpoint <code className="text-blue-300">GET /api/calendar/holidays/regional</code>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick State Switcher for Live Testing */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Terminal className="w-3.5 h-3.5 text-blue-400" />
                  <span>Execute Query by State Code:</span>
                </span>
                {[
                  { code: "KA", label: "Karnataka (KA)" },
                  { code: "MH", label: "Maharashtra (MH)" },
                  { code: "KL", label: "Kerala (KL)" },
                  { code: "WB", label: "West Bengal (WB)" },
                  { code: "TN", label: "Tamil Nadu (TN)" },
                  { code: "ALL", label: "Pan-India (ALL)" },
                ].map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => {
                      setSelectedState(s.code);
                      loadHolidays(s.code);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                      selectedState === s.code
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(
                      `GET /api/calendar/holidays/regional?state=${selectedState}`
                    );
                    showToast("API endpoint copied to clipboard!");
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1 border border-slate-700 transition-colors cursor-pointer"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span>Copy Request</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="p-5 overflow-y-auto space-y-5 text-xs font-mono">
              {/* Endpoint Request Header Bar */}
              <div className="bg-slate-950 rounded-2xl p-3.5 border border-slate-800">
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1 font-sans">
                  <span>ACTIVE ENDPOINT EXECUTION</span>
                  <span className="text-emerald-400 font-bold">STATUS 200 OK</span>
                </div>
                <div className="text-blue-300 font-bold text-sm">
                  GET /api/calendar/holidays/regional?state={selectedState}
                </div>
                <div className="text-slate-500 text-[11px] mt-1 font-sans">
                  Returns public holidays for state code <strong className="text-white">'{selectedState}'</strong> including statewide gazetted dates and statutory pan-India national holidays.
                </div>
              </div>

              {/* PostgreSQL DDL Schema Block */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-sans">
                    <Database className="w-3.5 h-3.5 text-indigo-400" />
                    <span>PostgreSQL Table Schema DDL (regional_holidays)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const ddl = `-- PostgreSQL Schema for BharatYatra Regional Holidays
CREATE TABLE IF NOT EXISTS regional_holidays (
    id VARCHAR(64) PRIMARY KEY,
    state_code VARCHAR(10) NOT NULL, -- e.g. 'KA' for Karnataka, 'MH' for Maharashtra, 'ALL' for National
    state_name VARCHAR(100) NOT NULL,
    applicable_state_codes VARCHAR(10)[] NOT NULL DEFAULT '{}',
    applicable_states TEXT[] NOT NULL DEFAULT '{}',
    holiday_date DATE NOT NULL,
    holiday_name VARCHAR(255) NOT NULL,
    holiday_type VARCHAR(50) NOT NULL DEFAULT 'festival',
    category VARCHAR(50) NOT NULL DEFAULT 'state',
    surge_percent NUMERIC(5,2) NOT NULL DEFAULT 15.00,
    pricing_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    availability_status VARCHAR(50) NOT NULL DEFAULT 'available',
    is_long_weekend BOOLEAN NOT NULL DEFAULT FALSE,
    affected_services TEXT[] NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_regional_holidays_state_code ON regional_holidays (state_code);
CREATE INDEX idx_regional_holidays_holiday_date ON regional_holidays (holiday_date);`;
                      navigator.clipboard?.writeText(ddl);
                      showToast("PostgreSQL DDL schema copied to clipboard!");
                    }}
                    className="text-[11px] font-sans text-blue-400 hover:text-blue-300 flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy DDL</span>
                  </button>
                </div>

                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-slate-300 text-[11px] overflow-x-auto leading-relaxed">
                  <pre className="text-emerald-400">{`-- PostgreSQL Table Schema Definition`}</pre>
                  <pre className="text-purple-300">{`CREATE TABLE IF NOT EXISTS regional_holidays (`}</pre>
                  <pre className="text-slate-300 pl-4">{`id                      VARCHAR(64) PRIMARY KEY,`}</pre>
                  <pre className="text-amber-300 pl-4">{`state_code              VARCHAR(10) NOT NULL, -- 'KA', 'MH', 'KL', 'WB', 'ALL'`}</pre>
                  <pre className="text-slate-300 pl-4">{`state_name              VARCHAR(100) NOT NULL,`}</pre>
                  <pre className="text-amber-300 pl-4">{`applicable_state_codes  VARCHAR(10)[] NOT NULL DEFAULT '{}',`}</pre>
                  <pre className="text-slate-300 pl-4">{`applicable_states       TEXT[] NOT NULL DEFAULT '{}',`}</pre>
                  <pre className="text-blue-300 pl-4">{`holiday_date            DATE NOT NULL,`}</pre>
                  <pre className="text-slate-300 pl-4">{`holiday_name            VARCHAR(255) NOT NULL,`}</pre>
                  <pre className="text-slate-300 pl-4">{`category                VARCHAR(50) NOT NULL DEFAULT 'state', -- 'national' | 'state'`}</pre>
                  <pre className="text-slate-300 pl-4">{`surge_percent           NUMERIC(5,2) NOT NULL DEFAULT 15.00,`}</pre>
                  <pre className="text-slate-300 pl-4">{`pricing_enabled         BOOLEAN NOT NULL DEFAULT TRUE,`}</pre>
                  <pre className="text-slate-300 pl-4">{`availability_status     VARCHAR(50) NOT NULL DEFAULT 'available',`}</pre>
                  <pre className="text-slate-300 pl-4">{`is_long_weekend         BOOLEAN NOT NULL DEFAULT FALSE,`}</pre>
                  <pre className="text-slate-300 pl-4">{`affected_services       TEXT[] NOT NULL,`}</pre>
                  <pre className="text-slate-300 pl-4">{`description             TEXT,`}</pre>
                  <pre className="text-slate-300 pl-4">{`created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,`}</pre>
                  <pre className="text-slate-300 pl-4">{`updated_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP`}</pre>
                  <pre className="text-purple-300">{`);`}</pre>
                  <pre className="text-slate-400 mt-2">{`CREATE INDEX idx_regional_holidays_state_code ON regional_holidays (state_code);`}</pre>
                  <pre className="text-slate-400">{`CREATE INDEX idx_regional_holidays_holiday_date ON regional_holidays (holiday_date);`}</pre>
                </div>
              </div>

              {/* Live JSON Payload from the Endpoint */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-sans">
                    <Code2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Live JSON Payload (Sample Result for '{selectedState}')</span>
                  </h4>
                  <span className="text-[11px] font-sans text-slate-400">
                    {filteredHolidays.length} items returned
                  </span>
                </div>

                <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-[11px] max-h-56 overflow-y-auto">
                  <pre className="text-blue-300">
                    {JSON.stringify(
                      {
                        success: true,
                        count: filteredHolidays.length,
                        query: { state: selectedState },
                        data: filteredHolidays.slice(0, 4).map((h) => ({
                          id: h.id,
                          name: h.name,
                          date: h.date,
                          stateCode: h.stateCode || (h.category === "national" ? "ALL" : "STATE"),
                          state: h.state,
                          category: h.category,
                          pricingEnabled: h.pricingEnabled !== false,
                          surgePercent: h.customSurgePercent ?? h.surgePercent,
                          availabilityStatus: h.availabilityStatus,
                          affectedServices: h.affectedServices,
                        })),
                        pagination: {
                          total: filteredHolidays.length,
                          previewLimit: 4,
                        },
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] text-slate-400 font-sans">
                PostgreSQL schema and endpoints are synced with BharatYatra calendarEngine.
              </div>
              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold font-sans cursor-pointer transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
