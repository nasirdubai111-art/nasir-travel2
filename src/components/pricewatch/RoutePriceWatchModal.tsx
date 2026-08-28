import React, { useState, useEffect } from "react";
import {
  X,
  Bell,
  Plane,
  Train,
  TrendingDown,
  Sparkles,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  ArrowRight,
  SlidersHorizontal,
  Smartphone,
  Mail,
  MessageSquare,
  AlertTriangle,
  History,
  Info,
  Filter,
  Search,
  Percent,
  ArrowUpDown,
  Tag,
  Check,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { WatchedRoute, PriceDropAlertEvent, PriceWatchTransportType } from "../../types";
import { PriceWatchService } from "../../services/PriceWatchService";
import { PriceForecastInsight } from "./PriceForecastInsight";
import { SmartRouteAlertsView } from "./SmartRouteAlertsView";
import { AIRPORTS_DATABASE } from "../../data/flightData";
import { CITIES_DATABASE } from "../../data/mockTravelData";

interface RoutePriceWatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookFlight?: (route: WatchedRoute) => void;
  onBookTrain?: (route: WatchedRoute) => void;
  onSelectRoute?: (route: WatchedRoute) => void;
}

export function RoutePriceWatchModal({
  isOpen,
  onClose,
  onBookFlight,
  onBookTrain,
  onSelectRoute,
}: RoutePriceWatchModalProps) {
  const [routes, setRoutes] = useState<WatchedRoute[]>(PriceWatchService.getRoutes());
  const [alertHistory, setAlertHistory] = useState<PriceDropAlertEvent[]>(PriceWatchService.getAlertHistory());
  const [activeTab, setActiveTab] = useState<"all" | "flights" | "trains" | "smart_alerts" | "forecast" | "history">("all");
  const [expandedForecastRouteId, setExpandedForecastRouteId] = useState<string | null>(null);
  const [selectedForecastRouteId, setSelectedForecastRouteId] = useState<string>(routes[0]?.id || "");
  const [isAddingRoute, setIsAddingRoute] = useState(false);
  const [selectedSimRouteId, setSelectedSimRouteId] = useState<string>("");
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<string>(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );

  // Filter & Search Controls
  const [filterCategory, setFilterCategory] = useState<"all" | "flight" | "train">("all");
  const [minDiscountFilter, setMinDiscountFilter] = useState<number>(0);
  const [onlyActiveDrops, setOnlyActiveDrops] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"discount_desc" | "savings_desc" | "price_asc" | "date_asc">("discount_desc");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState<boolean>(false);

  // New Route Form State
  const [newType, setNewType] = useState<PriceWatchTransportType>("flight");
  const [newOrigin, setNewOrigin] = useState("DEL");
  const [newDestination, setNewDestination] = useState("BOM");
  const [newDate, setNewDate] = useState("2026-09-10");
  const [newCarrier, setNewCarrier] = useState("");
  const [newBasePrice, setNewBasePrice] = useState<number>(4500);
  const [newDropPercent, setNewDropPercent] = useState<number>(10);
  const [newChannels, setNewChannels] = useState<Array<"push" | "whatsapp" | "email" | "sms">>([
    "push",
    "whatsapp",
  ]);

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = PriceWatchService.subscribe((updatedRoutes, latestAlert) => {
      setRoutes(updatedRoutes);
      setAlertHistory(PriceWatchService.getAlertHistory());
      if (latestAlert) {
        setFeedbackToast(`🔔 Push alert sent: ${latestAlert.title}`);
        setTimeout(() => setFeedbackToast(null), 4000);
      }
    });

    if (routes.length > 0 && !selectedSimRouteId) {
      setSelectedSimRouteId(routes[0].id);
    }

    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3500);
  };

  const handleRequestPermission = async () => {
    const res = await PriceWatchService.requestNotificationPermission();
    setPermissionStatus(res);
    if (res === "granted") {
      showToast("✓ Push notifications enabled! You'll receive system alerts on price drops.");
      PriceWatchService.playNotificationChime();
    } else {
      showToast("ℹ In-app push banners and audio chimes will continue to work.");
    }
  };

  const handleSimulateSingle = (routeId: string, dropPercent: number) => {
    const result = PriceWatchService.simulatePriceDrop(routeId, dropPercent);
    if (result) {
      showToast(`⚡ Simulated ${dropPercent}% drop on ${result.route.originCode} ➔ ${result.route.destinationCode}!`);
    }
  };

  const handleSimulateScanAll = () => {
    const result = PriceWatchService.simulateLiveScan();
    showToast(`⚡ Scanned ${result.updatedCount} routes. Generated ${result.alerts.length} drop alerts!`);
  };

  const handleCreateRoute = (e: React.FormEvent) => {
    e.preventDefault();
    if (newOrigin === newDestination) {
      alert("Origin and destination cannot be identical.");
      return;
    }

    let originName = newOrigin;
    let destinationName = newDestination;
    let originCity = newOrigin;
    let destinationCity = newDestination;

    if (newType === "flight") {
      const origA = AIRPORTS_DATABASE.find((a) => a.code === newOrigin);
      const destA = AIRPORTS_DATABASE.find((a) => a.code === newDestination);
      if (origA) {
        originName = origA.name;
        originCity = origA.city;
      }
      if (destA) {
        destinationName = destA.name;
        destinationCity = destA.city;
      }
    } else {
      const origC = CITIES_DATABASE.find((c) => c.railwayCode === newOrigin);
      const destC = CITIES_DATABASE.find((c) => c.railwayCode === newDestination);
      if (origC) {
        originName = `${origC.name} Station`;
        originCity = origC.name;
      }
      if (destC) {
        destinationName = `${destC.name} Station`;
        destinationCity = destC.name;
      }
    }

    const created = PriceWatchService.addWatchedRoute({
      type: newType,
      originCode: newOrigin,
      originName,
      originCity,
      destinationCode: newDestination,
      destinationName,
      destinationCity,
      journeyDate: newDate,
      carrierName: newCarrier.trim() || (newType === "flight" ? "Direct Flight" : "Express Train"),
      basePrice: Number(newBasePrice) || 3000,
      targetDropPercent: Number(newDropPercent) || 10,
      notificationChannels: newChannels,
    });

    setIsAddingRoute(false);
    setSelectedSimRouteId(created.id);
    showToast(`✓ Watching ${created.originCode} ➔ ${created.destinationCode} for ≥${created.targetDropPercent}% drop!`);
  };

  // Sync tab clicks with category filter when explicitly clicked
  const handleTabChange = (tab: "all" | "flights" | "trains" | "smart_alerts" | "forecast" | "history") => {
    setActiveTab(tab);
    if (tab === "flights") {
      setFilterCategory("flight");
    } else if (tab === "trains") {
      setFilterCategory("train");
    } else if (tab === "all") {
      setFilterCategory("all");
    }
  };

  const handleCategoryFilterChange = (cat: "all" | "flight" | "train") => {
    setFilterCategory(cat);
    if (activeTab !== "history" && activeTab !== "forecast") {
      if (cat === "flight") setActiveTab("flights");
      else if (cat === "train") setActiveTab("trains");
      else setActiveTab("all");
    }
  };

  const handleResetFilters = () => {
    setFilterCategory("all");
    setMinDiscountFilter(0);
    setOnlyActiveDrops(false);
    setSearchQuery("");
    if (activeTab !== "history" && activeTab !== "forecast") {
      setActiveTab("all");
    }
  };

  // Filter routes based on Category, Minimum Discount %, Active Drop status, and Search query
  const filteredRoutes = routes
    .filter((r) => {
      // 1. Category Filter
      if (filterCategory !== "all" && r.type !== filterCategory) return false;
      if (activeTab === "flights" && r.type !== "flight") return false;
      if (activeTab === "trains" && r.type !== "train") return false;

      // 2. Active Price Drop toggle
      const isDrop = r.currentPrice < r.basePrice;
      const currentDropPercent = isDrop
        ? Math.round(((r.basePrice - r.currentPrice) / r.basePrice) * 100)
        : 0;

      if (onlyActiveDrops && !isDrop && !r.alertTriggered) {
        return false;
      }

      // 3. Minimum Discount % Filter
      if (minDiscountFilter > 0) {
        const effectiveDrop = isDrop ? currentDropPercent : (r.targetDropPercent || 0);
        if (effectiveDrop < minDiscountFilter) {
          return false;
        }
      }

      // 4. Search Query Filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          r.originCity.toLowerCase().includes(q) ||
          r.originCode.toLowerCase().includes(q) ||
          r.destinationCity.toLowerCase().includes(q) ||
          r.destinationCode.toLowerCase().includes(q) ||
          (r.carrierName && r.carrierName.toLowerCase().includes(q)) ||
          (r.serviceNumber && r.serviceNumber.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aDrop = a.currentPrice < a.basePrice ? ((a.basePrice - a.currentPrice) / a.basePrice) * 100 : 0;
      const bDrop = b.currentPrice < b.basePrice ? ((b.basePrice - b.currentPrice) / b.basePrice) * 100 : 0;
      const aSaving = Math.max(0, a.basePrice - a.currentPrice);
      const bSaving = Math.max(0, b.basePrice - b.currentPrice);

      if (sortBy === "discount_desc") return bDrop - aDrop;
      if (sortBy === "savings_desc") return bSaving - aSaving;
      if (sortBy === "price_asc") return a.currentPrice - b.currentPrice;
      if (sortBy === "date_asc") return a.journeyDate.localeCompare(b.journeyDate);
      return 0;
    });

  // Filter alert history based on Category, Minimum Discount %, and Search query
  const filteredAlertHistory = alertHistory.filter((alert) => {
    // 1. Category filter
    if (filterCategory !== "all" && alert.routeType !== filterCategory) return false;
    if (activeTab === "flights" && alert.routeType !== "flight") return false;
    if (activeTab === "trains" && alert.routeType !== "train") return false;

    // 2. Minimum Discount % Filter
    if (minDiscountFilter > 0 && alert.dropPercent < minDiscountFilter) {
      return false;
    }

    // 3. Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match =
        alert.originCity.toLowerCase().includes(q) ||
        alert.originCode.toLowerCase().includes(q) ||
        alert.destinationCity.toLowerCase().includes(q) ||
        alert.destinationCode.toLowerCase().includes(q) ||
        alert.carrierName.toLowerCase().includes(q) ||
        alert.title.toLowerCase().includes(q) ||
        alert.message.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  const totalWatched = routes.length;
  const activeAlertsCount = routes.filter((r) => r.alertTriggered || r.currentPrice < r.basePrice).length;
  const totalSimulatedSavings = routes.reduce((acc, r) => {
    if (r.currentPrice < r.basePrice) {
      return acc + (r.basePrice - r.currentPrice);
    }
    return acc;
  }, 0);

  const hasActiveFilters =
    filterCategory !== "all" ||
    minDiscountFilter > 0 ||
    onlyActiveDrops ||
    searchQuery.trim().length > 0;

  const activeFiltersCount =
    (filterCategory !== "all" ? 1 : 0) +
    (minDiscountFilter > 0 ? 1 : 0) +
    (onlyActiveDrops ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#172033]/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0B5ED7] via-[#172033] to-[#0B5ED7] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#38BDF8]">
              <Bell className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Route Price Watch &amp; Drop Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold uppercase">
                  ≥ 10% Drop Trigger Active
                </span>
              </div>
              <p className="text-xs text-slate-200">
                Continuous fare tracking for Flights &amp; Trains with instant simulated push notifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Toast Notification */}
        {feedbackToast && (
          <div className="bg-[#16A34A] text-white text-xs font-semibold px-4 py-2 text-center animate-in fade-in flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* Top Quick Simulator Bar */}
        <div className="bg-[#F0F7FF] px-6 py-3 border-b border-[#E2E8F0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#0B5ED7]" />
            <span className="font-bold text-[#172033]">Push Alert Simulator:</span>
            <select
              value={selectedSimRouteId}
              onChange={(e) => setSelectedSimRouteId(e.target.value)}
              className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs font-bold text-[#172033]"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.type === "flight" ? "✈️" : "🚆"} {r.originCode} ➔ {r.destinationCode} (₹{r.basePrice})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleSimulateSingle(selectedSimRouteId, 12)}
              className="h-8 px-2.5 rounded-lg bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Simulate 12% Price Drop"
            >
              <TrendingDown className="w-3 h-3" />
              <span>Simulate -12% Drop</span>
            </button>

            <button
              type="button"
              onClick={() => handleSimulateSingle(selectedSimRouteId, 18)}
              className="h-8 px-2.5 rounded-lg bg-[#16A34A] hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Simulate 18% Price Drop"
            >
              <TrendingDown className="w-3 h-3" />
              <span>Simulate -18% Drop</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateScanAll}
              className="h-8 px-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#172033] hover:bg-[#F5F9FC] text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 text-[#0B5ED7]" />
              <span>Scan All Fares</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 p-4 sm:px-6 bg-white border-b border-[#E2E8F0]">
          <div className="bg-[#F5F9FC] p-3 rounded-2xl border border-[#E2E8F0]">
            <span className="text-[11px] font-bold text-[#64748B] block">Watched Routes</span>
            <span className="text-xl font-bold text-[#172033]">{totalWatched} active</span>
          </div>

          <div className="bg-[#F5F9FC] p-3 rounded-2xl border border-[#E2E8F0]">
            <span className="text-[11px] font-bold text-[#64748B] block">Drop Alerts Triggered</span>
            <span className="text-xl font-bold text-[#16A34A]">{activeAlertsCount} drops</span>
          </div>

          <div className="bg-[#F5F9FC] p-3 rounded-2xl border border-[#E2E8F0]">
            <span className="text-[11px] font-bold text-[#64748B] block">Total Savings Unlocked</span>
            <span className="text-xl font-bold text-[#0B5ED7]">₹{totalSimulatedSavings.toLocaleString("en-IN")}</span>
          </div>

          <div className="bg-[#F5F9FC] p-3 rounded-2xl border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#64748B] block">Web Push Status</span>
              <span className="text-xs font-bold capitalize text-[#172033]">{permissionStatus}</span>
            </div>
            {permissionStatus !== "granted" && (
              <button
                type="button"
                onClick={handleRequestPermission}
                className="px-2 py-1 bg-[#0B5ED7] text-white rounded-lg text-[10px] font-bold cursor-pointer"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F5F9FC]">
          {/* Navigation Sub-Tabs & Add Route Trigger */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E2E8F0] text-xs">
              <button
                type="button"
                onClick={() => handleTabChange("all")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === "all" ? "bg-[#0B5ED7] text-white shadow-xs" : "text-[#64748B] hover:text-[#172033]"
                }`}
              >
                All Routes ({routes.length})
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("flights")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === "flights" ? "bg-[#0B5ED7] text-white shadow-xs" : "text-[#64748B] hover:text-[#172033]"
                }`}
              >
                <Plane className="w-3.5 h-3.5" /> Flights
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("trains")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === "trains" ? "bg-[#0B5ED7] text-white shadow-xs" : "text-[#64748B] hover:text-[#172033]"
                }`}
              >
                <Train className="w-3.5 h-3.5" /> Trains
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("smart_alerts")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "smart_alerts" ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xs" : "text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>Smart Date Alerts</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${
                  activeTab === "smart_alerts" ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-800"
                }`}>
                  New
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("forecast")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "forecast" ? "bg-[#0B5ED7] text-white shadow-xs" : "text-[#0B5ED7] hover:bg-blue-50/50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Price Forecast</span>
                <span className={`px-1.5 py-0.2 rounded-md text-[9px] font-black uppercase tracking-wider ${
                  activeTab === "forecast" ? "bg-white/20 text-white" : "bg-blue-100 text-[#0B5ED7]"
                }`}>
                  AI 7d
                </span>
              </button>
              <button
                type="button"
                onClick={() => handleTabChange("history")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  activeTab === "history" ? "bg-[#0B5ED7] text-white shadow-xs" : "text-[#64748B] hover:text-[#172033]"
                }`}
              >
                <History className="w-3.5 h-3.5" /> Alert History ({alertHistory.length})
              </button>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
                className={`h-10 px-3.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  hasActiveFilters || isFilterPanelOpen
                    ? "bg-[#0B5ED7]/10 border-[#0B5ED7] text-[#0B5ED7]"
                    : "bg-white border-[#E2E8F0] text-[#172033] hover:bg-slate-50"
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#0B5ED7] text-white text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsAddingRoute(!isAddingRoute)}
                className="h-10 px-4 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ml-auto sm:ml-0"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddingRoute ? "Cancel" : "Watch New Route"}</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ADVANCED FILTER TOOLBAR (Category, Minimum Discount %, Active Drops, Search) */}
          {/* ========================================================================= */}
          <div className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3.5">
            {/* Row 1: Search & Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              {/* Search Bar */}
              <div className="md:col-span-6 relative">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by city, station, DEL, BOM, IndiGo, Vande Bharat..."
                  className="w-full h-10 pl-9 pr-8 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl text-xs font-medium text-[#172033] focus:outline-none focus:border-[#0B5ED7] focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#172033]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Filter Pills */}
              <div className="md:col-span-6 flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-bold text-[#64748B] mr-1 hidden sm:inline">Category:</span>
                <button
                  type="button"
                  onClick={() => handleCategoryFilterChange("all")}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                    filterCategory === "all"
                      ? "bg-[#0B5ED7] text-white border-[#0B5ED7] shadow-xs"
                      : "bg-[#F5F9FC] text-[#64748B] border-[#E2E8F0] hover:text-[#172033]"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>All Modes</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryFilterChange("flight")}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                    filterCategory === "flight"
                      ? "bg-[#0B5ED7] text-white border-[#0B5ED7] shadow-xs"
                      : "bg-[#F5F9FC] text-[#64748B] border-[#E2E8F0] hover:text-[#172033]"
                  }`}
                >
                  <Plane className="w-3.5 h-3.5" />
                  <span>Flights</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleCategoryFilterChange("train")}
                  className={`h-9 px-3 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 cursor-pointer ${
                    filterCategory === "train"
                      ? "bg-[#EA580C] text-white border-[#EA580C] shadow-xs"
                      : "bg-[#F5F9FC] text-[#64748B] border-[#E2E8F0] hover:text-[#172033]"
                  }`}
                >
                  <Train className="w-3.5 h-3.5" />
                  <span>Trains</span>
                </button>
              </div>
            </div>

            {/* Row 2: Minimum Discount % Filter & Quick Drop Selector */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-[#E2E8F0] text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 font-bold text-[#172033]">
                  <Percent className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Min Discount:</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { label: "All Fares", value: 0 },
                    { label: "≥ 10% Off", value: 10 },
                    { label: "≥ 15% Off", value: 15 },
                    { label: "≥ 20% Off", value: 20 },
                    { label: "≥ 25% Flash", value: 25 },
                  ].map((chip) => (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => setMinDiscountFilter(chip.value)}
                      className={`h-8 px-2.5 rounded-lg font-bold text-[11px] transition-all border cursor-pointer flex items-center gap-1 ${
                        minDiscountFilter === chip.value
                          ? "bg-[#16A34A] text-white border-[#16A34A] shadow-xs"
                          : "bg-[#F5F9FC] text-[#64748B] border-[#E2E8F0] hover:text-[#172033]"
                      }`}
                    >
                      {chip.value > 0 && <TrendingDown className="w-3 h-3" />}
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Drops Toggle & Sort */}
              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
                {activeTab !== "history" && (
                  <button
                    type="button"
                    onClick={() => setOnlyActiveDrops(!onlyActiveDrops)}
                    className={`h-8 px-3 rounded-lg font-bold text-[11px] transition-all border flex items-center gap-1.5 cursor-pointer ${
                      onlyActiveDrops
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300 ring-1 ring-emerald-400"
                        : "bg-[#F5F9FC] text-[#64748B] border-[#E2E8F0] hover:text-[#172033]"
                    }`}
                  >
                    <Zap className={`w-3.5 h-3.5 ${onlyActiveDrops ? "text-amber-500 fill-amber-500" : "text-slate-400"}`} />
                    <span>Active Drops Only</span>
                  </button>
                )}

                {/* Sort dropdown */}
                <div className="flex items-center gap-1 bg-[#F5F9FC] border border-[#E2E8F0] rounded-lg px-2 h-8">
                  <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent text-[11px] font-bold text-[#172033] border-none focus:outline-none cursor-pointer"
                  >
                    <option value="discount_desc">Sort: Highest % Drop</option>
                    <option value="savings_desc">Sort: Max ₹ Savings</option>
                    <option value="price_asc">Sort: Lowest Price</option>
                    <option value="date_asc">Sort: Journey Date</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filter summary tags strip */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E2E8F0] text-[11px] flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-[#64748B]">Active Filters:</span>

                  {filterCategory !== "all" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B5ED7]/10 text-[#0B5ED7] font-semibold border border-[#0B5ED7]/20">
                      Category: {filterCategory === "flight" ? "✈️ Flights" : "🚆 Trains"}
                      <button
                        type="button"
                        onClick={() => handleCategoryFilterChange("all")}
                        className="hover:text-[#172033]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {minDiscountFilter > 0 && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-[#16A34A] font-semibold border border-emerald-200">
                      Min Drop: ≥{minDiscountFilter}%
                      <button
                        type="button"
                        onClick={() => setMinDiscountFilter(0)}
                        className="hover:text-emerald-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {onlyActiveDrops && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                      ⚡ Active Drops Only
                      <button
                        type="button"
                        onClick={() => setOnlyActiveDrops(false)}
                        className="hover:text-amber-950"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                      Search: "{searchQuery}"
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="hover:text-slate-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Results Counter / Header */}
          <div className="flex items-center justify-between text-xs text-[#64748B] px-1">
            <span className="font-semibold">
              {activeTab === "history" ? (
                <>
                  Showing <strong className="text-[#172033]">{filteredAlertHistory.length}</strong> of{" "}
                  {alertHistory.length} price drop alerts
                </>
              ) : (
                <>
                  Showing <strong className="text-[#172033]">{filteredRoutes.length}</strong> of{" "}
                  {routes.length} watched routes
                  {minDiscountFilter > 0 && ` (≥${minDiscountFilter}% discount threshold)`}
                </>
              )}
            </span>
            {hasActiveFilters && (
              <span className="text-[11px] text-[#16A34A] font-bold">
                Filtered view active
              </span>
            )}
          </div>

          {/* New Watched Route Drawer / Form */}
          {isAddingRoute && (
            <form
              onSubmit={handleCreateRoute}
              className="bg-white p-5 rounded-2xl border border-[#0B5ED7]/30 shadow-md space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#0B5ED7]" />
                  <h4 className="text-sm font-bold text-[#172033]">Set Up Route Price Alert</h4>
                </div>
                <span className="text-xs text-[#64748B]">Triggers simulated push when fare drops ≥ 10%</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {/* Transport Type */}
                <div className="space-y-1">
                  <label className="font-bold text-[#64748B] block">Transport Mode</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setNewType("flight");
                        setNewOrigin("DEL");
                        setNewDestination("BOM");
                        setNewBasePrice(4800);
                      }}
                      className={`h-10 rounded-xl font-bold flex items-center justify-center gap-1 border cursor-pointer ${
                        newType === "flight"
                          ? "bg-[#0B5ED7] text-white border-[#0B5ED7]"
                          : "bg-[#F5F9FC] text-[#172033] border-[#E2E8F0]"
                      }`}
                    >
                      <Plane className="w-3.5 h-3.5" /> Flight
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setNewType("train");
                        setNewOrigin("NDLS");
                        setNewDestination("BSB");
                        setNewBasePrice(2450);
                      }}
                      className={`h-10 rounded-xl font-bold flex items-center justify-center gap-1 border cursor-pointer ${
                        newType === "train"
                          ? "bg-[#0B5ED7] text-white border-[#0B5ED7]"
                          : "bg-[#F5F9FC] text-[#172033] border-[#E2E8F0]"
                      }`}
                    >
                      <Train className="w-3.5 h-3.5" /> Train
                    </button>
                  </div>
                </div>

                {/* Origin */}
                <div className="space-y-1">
                  <label className="font-bold text-[#64748B] block">Origin (From)</label>
                  <select
                    value={newOrigin}
                    onChange={(e) => setNewOrigin(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl font-bold text-xs text-[#172033]"
                  >
                    {newType === "flight"
                      ? AIRPORTS_DATABASE.map((a) => (
                          <option key={a.code} value={a.code}>
                            {a.city} ({a.code})
                          </option>
                        ))
                      : CITIES_DATABASE.filter((c) => c.railwayCode).map((c) => (
                          <option key={c.railwayCode} value={c.railwayCode}>
                            {c.name} ({c.railwayCode})
                          </option>
                        ))}
                  </select>
                </div>

                {/* Destination */}
                <div className="space-y-1">
                  <label className="font-bold text-[#64748B] block">Destination (To)</label>
                  <select
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl font-bold text-xs text-[#172033]"
                  >
                    {newType === "flight"
                      ? AIRPORTS_DATABASE.map((a) => (
                          <option key={a.code} value={a.code}>
                            {a.city} ({a.code})
                          </option>
                        ))
                      : CITIES_DATABASE.filter((c) => c.railwayCode).map((c) => (
                          <option key={c.railwayCode} value={c.railwayCode}>
                            {c.name} ({c.railwayCode})
                          </option>
                        ))}
                  </select>
                </div>

                {/* Journey Date */}
                <div className="space-y-1">
                  <label className="font-bold text-[#64748B] block">Journey Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full h-10 px-3 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl font-bold text-xs text-[#172033]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                {/* Carrier/Flight Name */}
                <div className="space-y-1">
                  <label className="font-bold text-[#64748B] block">Carrier / Train Name (Optional)</label>
                  <input
                    type="text"
                    value={newCarrier}
                    onChange={(e) => setNewCarrier(e.target.value)}
                    placeholder={newType === "flight" ? "e.g. IndiGo 6E-2041" : "e.g. 22436 Vande Bharat"}
                    className="w-full h-10 px-3 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl font-bold text-xs text-[#172033]"
                  />
                </div>

                {/* Current Baseline Fare */}
                <div className="space-y-1">
                  <label className="font-bold text-[#64748B] block">Current Baseline Fare (₹)</label>
                  <input
                    type="number"
                    value={newBasePrice}
                    onChange={(e) => setNewBasePrice(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl font-bold text-xs text-[#172033]"
                    min={500}
                    required
                  />
                </div>

                {/* Minimum Drop % Threshold */}
                <div className="space-y-1">
                  <label className="font-bold text-[#64748B] block">Trigger Alert When Price Drops By:</label>
                  <select
                    value={newDropPercent}
                    onChange={(e) => setNewDropPercent(Number(e.target.value))}
                    className="w-full h-10 px-3 bg-[#F5F9FC] border border-[#E2E8F0] rounded-xl font-bold text-xs text-[#172033]"
                  >
                    <option value={10}>At least 10% Drop (Recommended)</option>
                    <option value={15}>At least 15% Drop</option>
                    <option value={20}>At least 20% Drop</option>
                    <option value={25}>At least 25% Flash Drop</option>
                  </select>
                </div>
              </div>

              {/* Alert Notification Channels */}
              <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <span className="font-bold text-[#64748B]">Notification Channels:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChannels.includes("push")}
                      onChange={(e) => {
                        if (e.target.checked) setNewChannels([...newChannels, "push"]);
                        else setNewChannels(newChannels.filter((c) => c !== "push"));
                      }}
                      className="rounded text-[#0B5ED7]"
                    />
                    <span className="text-[#172033] font-semibold">Push Radar</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChannels.includes("whatsapp")}
                      onChange={(e) => {
                        if (e.target.checked) setNewChannels([...newChannels, "whatsapp"]);
                        else setNewChannels(newChannels.filter((c) => c !== "whatsapp"));
                      }}
                      className="rounded text-[#0B5ED7]"
                    />
                    <span className="text-[#172033] font-semibold">WhatsApp</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newChannels.includes("email")}
                      onChange={(e) => {
                        if (e.target.checked) setNewChannels([...newChannels, "email"]);
                        else setNewChannels(newChannels.filter((c) => c !== "email"));
                      }}
                      className="rounded text-[#0B5ED7]"
                    />
                    <span className="text-[#172033] font-semibold">Email</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Start Watching Route
                </button>
              </div>
            </form>
          )}

          {/* Active Routes Listing */}
          {activeTab !== "history" && (
            <div className="space-y-3">
              {filteredRoutes.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#64748B]">
                    {hasActiveFilters ? <Filter className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#172033]">
                      {hasActiveFilters ? "No Routes Match Selected Filters" : "No Watched Routes in this category"}
                    </h4>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto">
                      {hasActiveFilters
                        ? "Try lowering the minimum discount threshold, switching transport category, or clearing your search term."
                        : "Click 'Watch New Route' to add flights or trains to your live radar."}
                    </p>
                  </div>

                  {hasActiveFilters ? (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsAddingRoute(true)}
                      className="px-4 py-2 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Watch New Route</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredRoutes.map((route) => {
                  const isDrop = route.currentPrice < route.basePrice;
                  const dropPercent = isDrop
                    ? Math.round(((route.basePrice - route.currentPrice) / route.basePrice) * 100)
                    : 0;
                  const targetThresholdPrice = Math.round(
                    route.basePrice * (1 - (route.targetDropPercent || 10) / 100)
                  );

                  return (
                    <div
                      key={route.id}
                      className={`bg-white rounded-2xl border transition-all p-5 shadow-xs flex flex-col gap-4 ${
                        route.alertTriggered
                          ? "border-[#16A34A] ring-2 ring-[#16A34A]/20"
                          : "border-[#E2E8F0] hover:border-[#0B5ED7]"
                      }`}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        {/* Left Route Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`p-1.5 rounded-lg text-white ${
                                route.type === "flight" ? "bg-[#0B5ED7]" : "bg-[#EA580C]"
                              }`}
                            >
                              {route.type === "flight" ? <Plane className="w-4 h-4" /> : <Train className="w-4 h-4" />}
                            </span>

                            <span className="text-base font-bold text-[#172033]">
                              {route.originCity} ({route.originCode}) ➔ {route.destinationCity} ({route.destinationCode})
                            </span>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                route.type === "flight"
                                  ? "bg-blue-50 text-[#0B5ED7] border border-blue-100"
                                  : "bg-orange-50 text-[#EA580C] border border-orange-100"
                              }`}
                            >
                              {route.type === "flight" ? "Flight Alert" : "Train Alert"}
                            </span>

                            {route.alertTriggered && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#16A34A] text-white text-xs font-bold flex items-center gap-1 animate-pulse">
                                <TrendingDown className="w-3.5 h-3.5" />
                                <span>{dropPercent}% Drop Alert Triggered!</span>
                              </span>
                            )}

                            {!route.isActive && (
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[#64748B] text-[10px] font-bold">
                                Paused
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                            <span className="font-semibold text-[#172033]">{route.carrierName}</span>
                            <span>•</span>
                            <span>Date: {route.journeyDate}</span>
                            <span>•</span>
                            <span>Class: {route.travelClass || "Economy"}</span>
                            <span>•</span>
                            <span>Target: Alert at ≤ ₹{targetThresholdPrice.toLocaleString("en-IN")} ({route.targetDropPercent}% off)</span>
                          </div>

                          {/* Price History Spark Strip */}
                          <div className="bg-[#F5F9FC] p-2 rounded-xl border border-[#E2E8F0] text-xs space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-semibold text-[#64748B]">Latest Activity:</span>
                              <span className="text-[#64748B] text-[10px]">
                                {route.priceHistory[route.priceHistory.length - 1]?.timestamp}
                              </span>
                            </div>
                            <p className="text-[11px] font-medium text-[#172033]">
                              {route.priceHistory[route.priceHistory.length - 1]?.note || "Monitoring live GDS fare stream"}
                            </p>
                          </div>
                        </div>

                        {/* Right Price & Actions */}
                        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-4 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E2E8F0]">
                          <div className="text-left lg:text-right">
                            <div className="flex items-baseline gap-2">
                              {isDrop && (
                                <span className="text-xs text-[#64748B] line-through">
                                  ₹{route.basePrice.toLocaleString("en-IN")}
                                </span>
                              )}
                              <span
                                className={`text-xl font-black ${
                                  isDrop ? "text-[#16A34A]" : "text-[#172033]"
                                }`}
                              >
                                ₹{route.currentPrice.toLocaleString("en-IN")}
                              </span>
                            </div>
                            {isDrop ? (
                              <span className="text-[11px] font-bold text-[#16A34A] block">
                                Instant Saving: ₹{(route.basePrice - route.currentPrice).toLocaleString("en-IN")} (-{dropPercent}%)
                              </span>
                            ) : (
                              <span className="text-[10px] text-[#64748B] block">Base Fare</span>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Forecast Toggle Button */}
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedForecastRouteId(
                                  expandedForecastRouteId === route.id ? null : route.id
                                )
                              }
                              className={`h-9 px-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                expandedForecastRouteId === route.id
                                  ? "bg-[#0B5ED7] text-white border-[#0B5ED7] shadow-xs"
                                  : "bg-[#F0F7FF] hover:bg-[#E0EFFF] text-[#0B5ED7] border-[#0B5ED7]/25"
                              }`}
                              title="Toggle 7-day AI Price Forecast"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>7d Forecast</span>
                              {expandedForecastRouteId === route.id ? (
                                <ChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Test Simulate Drop Button */}
                            <button
                              type="button"
                              onClick={() => handleSimulateSingle(route.id, 15)}
                              className="h-9 px-2.5 rounded-xl bg-[#F0F7FF] hover:bg-[#E0EFFF] text-[#0B5ED7] border border-[#0B5ED7]/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Simulate 15% drop on this route"
                            >
                              <TrendingDown className="w-3.5 h-3.5" />
                              <span>Simulate Drop</span>
                            </button>

                            {/* Reset button if price was dropped */}
                            {isDrop && (
                              <button
                                type="button"
                                onClick={() => {
                                  PriceWatchService.resetRoutePrice(route.id);
                                  showToast(`Reset ${route.originCode} ➔ ${route.destinationCode} to base fare.`);
                                }}
                                className="h-9 p-2 rounded-xl text-[#64748B] hover:bg-slate-100 hover:text-[#172033] border border-[#E2E8F0] transition-colors cursor-pointer"
                                title="Reset to Base Price"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Book CTA */}
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                if (route.type === "flight" && onBookFlight) {
                                  onBookFlight(route);
                                } else if (route.type === "train" && onBookTrain) {
                                  onBookTrain(route);
                                }
                              }}
                              className="h-9 px-3.5 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <span>Book</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                PriceWatchService.removeWatchedRoute(route.id);
                                showToast(`Removed route from watch list.`);
                              }}
                              className="h-9 p-2 rounded-xl text-rose-500 hover:bg-rose-50 border border-[#E2E8F0] transition-colors cursor-pointer"
                              title="Stop Watching"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Inline Expanded Price Forecast */}
                      {expandedForecastRouteId === route.id && (
                        <div className="pt-3 border-t border-[#E2E8F0] animate-in fade-in slide-in-from-top-2 duration-200">
                          <PriceForecastInsight
                            route={route}
                            onBookRoute={(r) => {
                              onClose();
                              if (r.type === "flight" && onBookFlight) onBookFlight(r);
                              else if (r.type === "train" && onBookTrain) onBookTrain(r);
                            }}
                            onSetTargetAlert={(r, targetPrice) => {
                              const newDrop = Math.max(5, Math.round(((r.basePrice - targetPrice) / r.basePrice) * 100));
                              PriceWatchService.updateWatchedRoute(r.id, {
                                targetDropPercent: newDrop,
                              });
                              showToast(`Target alert adjusted to ₹${targetPrice.toLocaleString("en-IN")} (${newDrop}% off)`);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* SMART ROUTE ALERTS TAB (Alternative Dates & History Savings) */}
          {/* ========================================================================= */}
          {activeTab === "smart_alerts" && (
            <SmartRouteAlertsView
              onApplyAlternativeDate={(type, date, origin, dest, carrier) => {
                showToast(`Applied alternative date: ${date} for ${origin} ➔ ${dest}`);
                onClose();
                window.dispatchEvent(
                  new CustomEvent("bharatyatra:apply-alternative-date", {
                    detail: { type, date, origin, dest, carrier },
                  })
                );
              }}
              onTrackRoute={(routeData) => {
                PriceWatchService.addWatchedRoute(routeData);
                showToast("Added route to active price tracking!");
              }}
              onBookRoute={(alert, selectedDate) => {
                onClose();
                window.dispatchEvent(
                  new CustomEvent("bharatyatra:book-smart-alert", {
                    detail: { alert, selectedDate },
                  })
                );
              }}
            />
          )}

          {/* ========================================================================= */}
          {/* PRICE FORECAST TAB VIEW (Deep Dive Intelligence & Projections) */}
          {/* ========================================================================= */}
          {activeTab === "forecast" && (
            <div className="space-y-4">
              {routes.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mx-auto text-[#0B5ED7]">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#172033]">No Active Routes to Forecast</h4>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto">
                      Add flights or trains to your radar to view 7-day predictive fare trajectories and algorithm purchase signals.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingRoute(true)}
                    className="px-4 py-2 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Watch a Route Now</span>
                  </button>
                </div>
              ) : (
                (() => {
                  const currentForecastRoute =
                    routes.find((r) => r.id === selectedForecastRouteId) || routes[0];

                  return (
                    <PriceForecastInsight
                      route={currentForecastRoute}
                      allRoutes={routes}
                      onSelectRoute={(r) => setSelectedForecastRouteId(r.id)}
                      onBookRoute={(r) => {
                        onClose();
                        if (r.type === "flight" && onBookFlight) onBookFlight(r);
                        else if (r.type === "train" && onBookTrain) onBookTrain(r);
                      }}
                      onSetTargetAlert={(r, targetPrice) => {
                        const newDrop = Math.max(5, Math.round(((r.basePrice - targetPrice) / r.basePrice) * 100));
                        PriceWatchService.updateWatchedRoute(r.id, {
                          targetDropPercent: newDrop,
                        });
                        showToast(`Target alert adjusted to ₹${targetPrice.toLocaleString("en-IN")} (${newDrop}% off)`);
                      }}
                    />
                  );
                })()
              )}
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-3">
              {filteredAlertHistory.length === 0 ? (
                <div className="bg-white p-8 rounded-2xl border border-[#E2E8F0] text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-[#64748B]">
                    {hasActiveFilters ? <Filter className="w-6 h-6" /> : <History className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#172033]">
                      {hasActiveFilters ? "No Alert History Matches Filter" : "No Simulated Push Alerts in Log Yet"}
                    </h4>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto">
                      {hasActiveFilters
                        ? "Try clearing filters or reducing the discount threshold to view all logged alerts."
                        : "Click 'Simulate -12% Drop' or 'Scan All Fares' above to trigger push events."}
                    </p>
                  </div>

                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-[#0B5ED7] hover:bg-[#094eb3] text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredAlertHistory.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-emerald-50 text-[#16A34A] border border-emerald-100 shrink-0 mt-0.5">
                        <TrendingDown className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-[#172033]">{alert.title}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-[#16A34A] text-white text-[10px] font-bold">
                            -{alert.dropPercent}% OFF
                          </span>
                          <span
                            className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                              alert.routeType === "flight"
                                ? "bg-blue-50 text-[#0B5ED7] border border-blue-100"
                                : "bg-orange-50 text-[#EA580C] border border-orange-100"
                            }`}
                          >
                            {alert.routeType === "flight" ? "Flight" : "Train"}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B]">{alert.message}</p>
                        <span className="text-[10px] text-[#64748B] block">{alert.timestamp}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold text-[#16A34A] block">
                        Saved ₹{alert.savedAmount.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs font-bold text-[#172033]">
                        Now ₹{alert.currentPrice.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer info strip */}
        <div className="px-6 py-3 bg-white border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
            <span>Real-time price drop detection with browser push &amp; Web Audio alerts</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#172033] font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
