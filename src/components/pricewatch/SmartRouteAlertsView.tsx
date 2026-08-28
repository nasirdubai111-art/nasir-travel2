import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingDown,
  Calendar,
  Plane,
  Train,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Trash2,
  RotateCcw,
  Plus,
  Info,
  ShieldCheck,
  ChevronRight,
  Filter,
  Search,
  BellRing,
} from "lucide-react";
import {
  SmartRouteAlert,
  SearchHistoryItem,
  AlternativeDateOption,
  WatchedRoute,
} from "../../types";
import { PriceWatchService } from "../../services/PriceWatchService";

interface SmartRouteAlertsViewProps {
  onApplyAlternativeDate?: (
    routeType: "flight" | "train",
    date: string,
    originCode: string,
    destCode: string,
    carrierName?: string
  ) => void;
  onTrackRoute?: (route: Parameters<typeof PriceWatchService.addWatchedRoute>[0]) => void;
  onBookRoute?: (alert: SmartRouteAlert, selectedDate: AlternativeDateOption) => void;
}

export function SmartRouteAlertsView({
  onApplyAlternativeDate,
  onTrackRoute,
  onBookRoute,
}: SmartRouteAlertsViewProps) {
  const [smartAlerts, setSmartAlerts] = useState<SmartRouteAlert[]>(
    PriceWatchService.getSmartRouteAlerts()
  );
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(
    PriceWatchService.getSearchHistory()
  );
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(
    smartAlerts[0]?.id || null
  );
  const [filterType, setFilterType] = useState<"all" | "flight" | "train">("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = () => {
    setSmartAlerts(PriceWatchService.getSmartRouteAlerts());
    setSearchHistory(PriceWatchService.getSearchHistory());
  };

  useEffect(() => {
    const handleUpdate = () => {
      refreshData();
    };

    window.addEventListener("bharatyatra:search-history-updated", handleUpdate);
    return () => {
      window.removeEventListener("bharatyatra:search-history-updated", handleUpdate);
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Simulate proactive smart route alert discovery
  const handleSimulateDiscovery = (type: "flight" | "train" = "flight") => {
    const newAlert = PriceWatchService.simulateSmartAlertDiscovery(type);
    refreshData();
    setSelectedAlertId(newAlert.id);
    showToast(
      `Discovered cheaper date for ${newAlert.originCode} ➔ ${newAlert.destinationCode}: Save ₹${newAlert.maxSavingsAmount.toLocaleString("en-IN")} (-${newAlert.maxSavingsPercent}%)`
    );
  };

  // Filtered alerts
  const filteredAlerts = smartAlerts.filter((a) => {
    if (filterType === "flight" && a.routeType !== "flight") return false;
    if (filterType === "train" && a.routeType !== "train") return false;
    return true;
  });

  const activeSelectedAlert =
    smartAlerts.find((a) => a.id === selectedAlertId) || filteredAlerts[0] || null;

  // Calculate cumulative potential savings
  const totalPotentialSavings = smartAlerts.reduce(
    (acc, alert) => acc + alert.maxSavingsAmount,
    0
  );

  return (
    <div id="smart-route-alerts-view" className="space-y-6">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#172033] text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Value Proposition & Simulation Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 rounded-3xl p-6 text-white border border-indigo-500/20 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span>Proactive Search Intelligence</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                  {smartAlerts.length} Active Deals Found
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Automated Smart Route Alerts
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Our algorithm scans your recent flight &amp; train search queries across ±3 days to find off-peak departures and carrier yield discounts.
              </p>
            </div>

            {/* Savings Badge */}
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center min-w-[200px] shrink-0">
              <span className="text-[10px] uppercase font-extrabold text-indigo-300 block mb-1">
                Total Discovered Savings
              </span>
              <span className="text-2xl font-black text-emerald-400">
                ₹{totalPotentialSavings.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] text-slate-300 block mt-0.5">
                across {smartAlerts.length} searched trips
              </span>
            </div>
          </div>

          {/* Action Bar: Test Simulation + Filters */}
          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* Filter Pills */}
            <div className="flex items-center bg-white/10 p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterType === "all"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                All Alerts ({smartAlerts.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("flight")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "flight"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Plane className="w-3.5 h-3.5" />
                <span>Flights</span>
              </button>
              <button
                type="button"
                onClick={() => setFilterType("train")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  filterType === "train"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>Trains</span>
              </button>
            </div>

            {/* Simulate Discovery & History CTAs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleSimulateDiscovery("flight")}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Simulate discovering off-peak flight fare"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate Flight Alert (-28%)</span>
              </button>

              <button
                type="button"
                onClick={() => handleSimulateDiscovery("train")}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                title="Simulate discovering non-flexi train fare"
              >
                <Train className="w-3.5 h-3.5" />
                <span>Simulate Train Alert</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  PriceWatchService.resetSearchHistoryToDefault();
                  PriceWatchService.restoreSmartAlerts();
                  refreshData();
                  showToast("Reset search history & restored all smart alerts.");
                }}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Reset Search History Demo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredAlerts.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h4 className="text-base font-bold text-slate-800">
              No Active Smart Alerts in History
            </h4>
            <p className="text-xs text-slate-500">
              When you search for flights or trains on peak weekend dates, our AI will automatically suggest cheaper alternative departure days here.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleSimulateDiscovery("flight")}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Sample Smart Date Discovery</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: List of Smart Alert Cards */}
          <div className="space-y-3 lg:col-span-1">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Discovered Opportunities ({filteredAlerts.length})
              </span>
              <span className="text-[11px] text-indigo-600 font-semibold">
                Click to inspect date matrix
              </span>
            </div>

            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredAlerts.map((alert) => {
                const isSelected = activeSelectedAlert?.id === alert.id;
                const isFlight = alert.routeType === "flight";
                const best = alert.bestAlternativeDate;

                return (
                  <div
                    key={alert.id}
                    onClick={() => setSelectedAlertId(alert.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative space-y-2.5 ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-600 shadow-md ring-2 ring-indigo-500/20"
                        : "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 shadow-xs"
                    }`}
                  >
                    {/* Top Row: Type, Route, and Savings Badge */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`p-1.5 rounded-lg text-white ${
                            isFlight ? "bg-sky-600" : "bg-amber-600"
                          }`}
                        >
                          {isFlight ? <Plane className="w-3.5 h-3.5" /> : <Train className="w-3.5 h-3.5" />}
                        </span>
                        <span className="text-sm font-black text-slate-800">
                          {alert.originCode} ➔ {alert.destinationCode}
                        </span>
                      </div>

                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black flex items-center gap-0.5">
                        <TrendingDown className="w-3 h-3 text-emerald-600" />
                        <span>-{best.savingsPercent}%</span>
                      </span>
                    </div>

                    {/* Searched vs Suggested Date */}
                    <div className="text-xs space-y-1">
                      <div className="text-slate-500 flex items-center justify-between">
                        <span>Searched: {alert.searchedFormattedDate}</span>
                        <span className="line-through text-slate-400">
                          ₹{alert.searchedPrice.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="text-emerald-700 font-bold flex items-center justify-between">
                        <span>Better Date: {best.formattedDate}</span>
                        <span className="text-sm font-black text-emerald-600">
                          ₹{best.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Reason Tag */}
                    <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="truncate max-w-[180px] font-medium">
                        {best.reason}
                      </span>
                      <span className="font-bold text-indigo-600 flex items-center gap-0.5">
                        <span>Save ₹{alert.maxSavingsAmount.toLocaleString("en-IN")}</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Date Matrix & Visualizer for Active Selected Alert */}
          {activeSelectedAlert && (
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
                {/* Header of selected alert */}
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold text-white ${
                          activeSelectedAlert.routeType === "flight"
                            ? "bg-sky-600"
                            : "bg-amber-600"
                        }`}
                      >
                        {activeSelectedAlert.routeType === "flight" ? "Flight Alert" : "Train Alert"}
                      </span>
                      <span className="text-xs font-bold text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">
                        {activeSelectedAlert.carrierName}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">
                        {activeSelectedAlert.confidenceScore}% Algorithm Confidence
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-slate-900">
                      {activeSelectedAlert.originCity} ({activeSelectedAlert.originCode}) ➔{" "}
                      {activeSelectedAlert.destinationCity} ({activeSelectedAlert.destinationCode})
                    </h4>
                  </div>

                  {/* Savings Spotlight Pill */}
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl text-right">
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 block">
                      Max Alternative Savings
                    </span>
                    <span className="text-xl font-black text-emerald-600">
                      ₹{activeSelectedAlert.maxSavingsAmount.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 block">
                      ({activeSelectedAlert.maxSavingsPercent}% cheaper)
                    </span>
                  </div>
                </div>

                {/* Insight Description Banner */}
                <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100/80 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-indigo-600 text-white shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-indigo-950">
                      {activeSelectedAlert.alertTitle}
                    </h5>
                    <p className="text-xs text-indigo-900/80 leading-relaxed">
                      {activeSelectedAlert.alertDescription}
                    </p>
                  </div>
                </div>

                {/* +/- 3 Days Comparison Matrix & Visualizer */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-600" />
                      <span>7-Day Flexible Fare Comparison Matrix</span>
                    </h5>
                    <span className="text-[11px] text-slate-400 font-medium">
                      Searched: {activeSelectedAlert.searchedFormattedDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                    {activeSelectedAlert.alternativeDates.map((opt) => {
                      const isSearched = opt.isSearchedDate;
                      const isBest = opt.status === "cheapest";
                      const isPeak = opt.status === "peak";

                      let borderClass = "border-slate-200 bg-slate-50/60";
                      if (isSearched) {
                        borderClass = "border-indigo-500 bg-indigo-50/70 ring-2 ring-indigo-500/20";
                      } else if (isBest) {
                        borderClass = "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20";
                      } else if (isPeak) {
                        borderClass = "border-rose-200 bg-rose-50/30";
                      }

                      return (
                        <div
                          key={opt.date}
                          className={`p-3 rounded-2xl border flex flex-col justify-between space-y-3 transition-all ${borderClass}`}
                        >
                          {/* Day Header */}
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                              {opt.dayOfWeek.substring(0, 3)}
                            </span>
                            <span className="text-xs font-extrabold text-slate-800 block">
                              {opt.formattedDate.split(", ")[1] || opt.date}
                            </span>
                            {isSearched && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-indigo-600 text-white inline-block mt-0.5">
                                Original
                              </span>
                            )}
                            {isBest && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-600 text-white inline-block mt-0.5">
                                Best Deal
                              </span>
                            )}
                          </div>

                          {/* Price & Savings */}
                          <div className="space-y-1">
                            <span className="text-sm font-black text-slate-900 block">
                              ₹{opt.price.toLocaleString("en-IN")}
                            </span>

                            {opt.savingsAmount > 0 ? (
                              <span className="text-[10px] font-bold text-emerald-600 block">
                                -₹{opt.savingsAmount.toLocaleString("en-IN")} (-{opt.savingsPercent}%)
                              </span>
                            ) : isPeak ? (
                              <span className="text-[10px] font-medium text-rose-500 block">
                                Surge (+{Math.abs(opt.savingsPercent)}%)
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-400 block">Base Rate</span>
                            )}
                          </div>

                          {/* Switch Button */}
                          {!isSearched ? (
                            <button
                              type="button"
                              onClick={() => {
                                if (onApplyAlternativeDate) {
                                  onApplyAlternativeDate(
                                    activeSelectedAlert.routeType,
                                    opt.date,
                                    activeSelectedAlert.originCode,
                                    activeSelectedAlert.destinationCode,
                                    activeSelectedAlert.carrierName
                                  );
                                }
                                showToast(`Applied departure date: ${opt.formattedDate}`);
                              }}
                              className={`w-full py-1.5 px-2 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                                isBest
                                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs"
                                  : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                              }`}
                            >
                              <span>Apply</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          ) : (
                            <div className="text-[10px] font-semibold text-indigo-600 text-center py-1 bg-white/60 rounded-lg">
                              Current
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Action Button Row */}
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        PriceWatchService.dismissSmartAlert(activeSelectedAlert.id);
                        refreshData();
                        showToast("Alert dismissed from your radar.");
                      }}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>Dismiss Alert</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        PriceWatchService.addWatchedRoute({
                          type: activeSelectedAlert.routeType,
                          originCode: activeSelectedAlert.originCode,
                          originName: `${activeSelectedAlert.originCity} Terminal`,
                          originCity: activeSelectedAlert.originCity,
                          destinationCode: activeSelectedAlert.destinationCode,
                          destinationName: `${activeSelectedAlert.destinationCity} Terminal`,
                          destinationCity: activeSelectedAlert.destinationCity,
                          journeyDate: activeSelectedAlert.bestAlternativeDate.date,
                          carrierName: activeSelectedAlert.carrierName,
                          serviceNumber: activeSelectedAlert.routeType === "flight" ? "6E-2041" : "22436",
                          travelClass: "Economy",
                          basePrice: activeSelectedAlert.bestAlternativeDate.price,
                          targetDropPercent: 10,
                          notificationChannels: ["push", "whatsapp", "email"],
                        });
                        showToast(`Added ${activeSelectedAlert.originCode} ➔ ${activeSelectedAlert.destinationCode} (${activeSelectedAlert.bestAlternativeDate.formattedDate}) to Live Price Watch.`);
                      }}
                      className="px-3.5 py-2 rounded-xl border border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <BellRing className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Track in Price Watch</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (onBookRoute) {
                        onBookRoute(
                          activeSelectedAlert,
                          activeSelectedAlert.bestAlternativeDate
                        );
                      } else if (onApplyAlternativeDate) {
                        onApplyAlternativeDate(
                          activeSelectedAlert.routeType,
                          activeSelectedAlert.bestAlternativeDate.date,
                          activeSelectedAlert.originCode,
                          activeSelectedAlert.destinationCode,
                          activeSelectedAlert.carrierName
                        );
                      }
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Switch to {activeSelectedAlert.bestAlternativeDate.formattedDate} &amp; Save ₹{activeSelectedAlert.maxSavingsAmount.toLocaleString("en-IN")}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search History Log Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h4 className="text-sm font-bold text-slate-800">
              Recent Search History Logged for Radar ({searchHistory.length})
            </h4>
          </div>

          <button
            type="button"
            onClick={() => {
              PriceWatchService.clearSearchHistory();
              refreshData();
              showToast("Cleared search history.");
            }}
            className="text-xs font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {searchHistory.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <span>{item.originCode} ➔ {item.destinationCode}</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    ({item.type})
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Date: {item.searchedDate} • ₹{item.currentPrice.toLocaleString("en-IN")}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const alert = PriceWatchService.computeSmartAlertForSearch(item);
                  if (alert) {
                    refreshData();
                    setSelectedAlertId(alert.id);
                    showToast(`Scanned alternative dates for ${item.originCode} ➔ ${item.destinationCode}`);
                  }
                }}
                className="p-1.5 rounded-lg bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer"
                title="Scan for alternative date savings"
              >
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
