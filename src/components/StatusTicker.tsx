import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  AlertTriangle,
  Sun,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudFog,
  Wind,
  Zap,
  Plane,
  Train,
  Car,
  Landmark,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  MapPin,
  ExternalLink,
  PhoneCall,
  CheckCircle2,
  Info,
  X,
  Radio,
  Sparkles,
} from "lucide-react";
import { CityLocation } from "../types";
import {
  getCityStatusProfile,
  LocationTravelAlert,
  CityWeatherAlert,
} from "../data/locationAlertsData";

interface StatusTickerProps {
  currentLocation: CityLocation;
  onOpenLocationModal: () => void;
}

export function StatusTicker({ currentLocation, onOpenLocationModal }: StatusTickerProps) {
  const statusProfile = getCityStatusProfile(currentLocation);
  const alerts = statusProfile.alerts;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<LocationTravelAlert | null>(null);

  // Reset index when location changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [currentLocation.id]);

  // Auto-advance ticker every 5.5 seconds if not paused and modal not open
  useEffect(() => {
    if (isPaused || isDetailModalOpen || alerts.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % alerts.length);
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, isDetailModalOpen, alerts.length]);

  const activeAlert = alerts[currentIndex] || alerts[0];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % alerts.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + alerts.length) % alerts.length);
  };

  const togglePause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPaused((prev) => !prev);
  };

  const handleAlertClick = (alertItem: LocationTravelAlert) => {
    setSelectedAlert(alertItem);
    setIsDetailModalOpen(true);
  };

  // Weather icon selector
  const getWeatherIcon = (iconType: CityWeatherAlert["iconType"], className: string = "w-3.5 h-3.5") => {
    switch (iconType) {
      case "sun":
        return <Sun className={`${className} text-amber-400`} />;
      case "cloud-sun":
        return <CloudSun className={`${className} text-amber-300`} />;
      case "cloud-rain":
        return <CloudRain className={`${className} text-sky-400`} />;
      case "cloud-snow":
        return <CloudSnow className={`${className} text-cyan-300`} />;
      case "cloud-fog":
        return <CloudFog className={`${className} text-slate-300`} />;
      case "wind":
        return <Wind className={`${className} text-teal-300`} />;
      case "zap":
        return <Zap className={`${className} text-yellow-400`} />;
      default:
        return <Sun className={`${className} text-amber-400`} />;
    }
  };

  // Category Icon Selector
  const getCategoryIcon = (category: LocationTravelAlert["category"]) => {
    switch (category) {
      case "WEATHER_WARNING":
        return <CloudSun className="w-3.5 h-3.5 text-amber-400" />;
      case "TRANSIT_ONTIME":
      case "AIRPORT_SECURITY":
        return <Plane className="w-3.5 h-3.5 text-sky-400" />;
      case "RAIL_UPDATE":
        return <Train className="w-3.5 h-3.5 text-orange-400" />;
      case "TRAFFIC_ALERT":
        return <Car className="w-3.5 h-3.5 text-emerald-400" />;
      case "PILGRIMAGE_UPDATE":
        return <Landmark className="w-3.5 h-3.5 text-amber-300" />;
      default:
        return <Radio className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  // Severity style helper
  const getSeverityBadgeClass = (severity: LocationTravelAlert["severity"]) => {
    switch (severity) {
      case "warning":
      case "critical":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40";
      case "advisory":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "info":
        return "bg-sky-500/20 text-sky-300 border-sky-500/40";
      case "normal":
      default:
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    }
  };

  const getAQIBadgeClass = (category: CityWeatherAlert["aqiCategory"]) => {
    switch (category) {
      case "Good":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "Moderate":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      case "Poor":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      case "Severe":
        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
    }
  };

  return (
    <>
      {/* Real-time Status Ticker Strip */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-slate-200 border-b border-indigo-900/50 text-[11px] px-3 sm:px-5 py-1 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
          {/* Left: Live Radar Pulse + Location Capsule */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-all text-[10px] font-bold group"
              title="Click to view live city situation report & weather forecast"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wider uppercase font-black text-emerald-400">Live Radar</span>
            </button>

            {/* Current City Pill with Click to Change */}
            <button
              onClick={onOpenLocationModal}
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-amber-300 font-semibold px-2 py-0.5 rounded-md hover:bg-slate-800/60 transition-colors"
              title="Change current location"
            >
              <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
              <span className="truncate max-w-[120px] font-bold text-white">{statusProfile.cityName}</span>
              <span className="text-[10px] text-slate-400">({statusProfile.state})</span>
            </button>
          </div>

          {/* Center: Dynamic Animated Ticker Item */}
          <div className="flex-1 min-w-0 mx-1 sm:mx-3 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeAlert && (
                <motion.div
                  key={`${currentLocation.id}-${activeAlert.id}-${currentIndex}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => handleAlertClick(activeAlert)}
                  className="flex items-center gap-2 cursor-pointer group hover:opacity-90 transition-opacity"
                >
                  {/* Category Badge */}
                  <span
                    className={`shrink-0 hidden xs:inline-flex items-center gap-1 px-1.5 py-0.2 rounded border font-bold text-[9px] uppercase tracking-wider ${getSeverityBadgeClass(
                      activeAlert.severity
                    )}`}
                  >
                    {getCategoryIcon(activeAlert.category)}
                    <span>{activeAlert.badgeText}</span>
                  </span>

                  {/* Headline / Message */}
                  <span className="font-semibold text-slate-100 group-hover:text-amber-300 truncate text-[11px] transition-colors">
                    {activeAlert.headline}
                  </span>

                  <span className="hidden md:inline-block text-slate-400 truncate text-[10px]">
                    — {activeAlert.details}
                  </span>

                  <span className="shrink-0 hidden lg:inline-block text-[9px] text-slate-400 font-mono">
                    [{activeAlert.timestamp}]
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Live Weather Capsule + Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Weather Capsule */}
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 hover:border-indigo-500 text-slate-200 hover:text-white transition-all text-[10px] font-bold"
              title={`Weather: ${statusProfile.weather.condition}, Temp: ${statusProfile.weather.temp}°C, AQI: ${statusProfile.weather.aqi} (${statusProfile.weather.aqiCategory})`}
            >
              {getWeatherIcon(statusProfile.weather.iconType)}
              <span className="font-mono font-bold text-white">
                {statusProfile.weather.temp}
                {statusProfile.weather.tempUnit}
              </span>
              <span className="hidden md:inline text-slate-300">{statusProfile.weather.condition}</span>
              <span
                className={`hidden lg:inline-block px-1 rounded text-[9px] font-bold border ${getAQIBadgeClass(
                  statusProfile.weather.aqiCategory
                )}`}
              >
                AQI {statusProfile.weather.aqi}
              </span>
            </button>

            {/* Navigation & Controls */}
            <div className="flex items-center gap-0.5 bg-slate-900/90 rounded-md border border-slate-800 p-0.5 text-slate-400">
              <button
                onClick={handlePrev}
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Previous alert"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>

              <button
                onClick={togglePause}
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title={isPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
              >
                {isPaused ? <Play className="w-2.5 h-2.5 text-amber-400" /> : <Pause className="w-2.5 h-2.5" />}
              </button>

              <button
                onClick={handleNext}
                className="p-1 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Next alert"
              >
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* View Full Report Button */}
            <button
              onClick={() => setIsDetailModalOpen(true)}
              className="hidden xl:flex items-center gap-1 text-[10px] font-bold text-indigo-300 hover:text-white underline underline-offset-2 ml-1"
            >
              <span>Full Advisory</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comprehensive Situation & Weather Advisory Modal */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-white">Live Travel Radar &amp; Weather Advisory</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {statusProfile.overallStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    <span className="font-bold text-white">{statusProfile.cityName}</span>, {statusProfile.state}
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        onOpenLocationModal();
                      }}
                      className="text-amber-400 hover:underline font-semibold ml-2 text-[11px]"
                    >
                      Change City ➔
                    </button>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
              {/* 1. Weather Snapshot Card */}
              <div className="bg-gradient-to-br from-slate-800 to-indigo-950/60 rounded-xl p-4 border border-indigo-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-sm text-white">Current Weather &amp; Atmosphere</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Real-Time Sensor Station</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Temperature</span>
                    <span className="text-lg font-black text-white">
                      {statusProfile.weather.temp}
                      {statusProfile.weather.tempUnit}
                    </span>
                    <span className="text-[10px] text-slate-300 block">{statusProfile.weather.condition}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Air Quality (AQI)</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-lg font-black text-white">{statusProfile.weather.aqi}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${getAQIBadgeClass(
                          statusProfile.weather.aqiCategory
                        )}`}
                      >
                        {statusProfile.weather.aqiCategory}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block">Clean &amp; Breathable</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Visibility</span>
                    <span className="text-base font-black text-white">{statusProfile.weather.visibility}</span>
                    <span className="text-[10px] text-emerald-400 block">Zero Fog Obstruction</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Humidity &amp; Wind</span>
                    <span className="text-base font-black text-white">{statusProfile.weather.humidity}</span>
                    <span className="text-[10px] text-slate-300 block">{statusProfile.weather.windSpeed}</span>
                  </div>
                </div>
              </div>

              {/* 2. Active Travel Alerts & Advisories List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>Active Location Advisories ({alerts.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">Pushed to field operatives &amp; travelers</span>
                </div>

                <div className="space-y-2">
                  {alerts.map((alt) => (
                    <div
                      key={alt.id}
                      className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/70 hover:bg-slate-800 transition-colors space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-extrabold uppercase ${getSeverityBadgeClass(
                              alt.severity
                            )}`}
                          >
                            {getCategoryIcon(alt.category)}
                            <span>{alt.badgeText}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
                        </div>

                        {alt.helpline && (
                          <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-700 rounded-md font-mono">
                            SOS: {alt.helpline}
                          </span>
                        )}
                      </div>

                      <h5 className="font-bold text-white text-xs leading-snug">{alt.headline}</h5>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{alt.details}</p>

                      <div className="pt-1.5 border-t border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{alt.impact}</span>
                        </span>

                        {alt.recommendedAction && (
                          <span className="text-amber-300 italic">Tip: {alt.recommendedAction}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Multi-Modal Transit Operations Radar */}
              <div className="bg-slate-800/40 rounded-xl p-4 border border-slate-700/60 space-y-3">
                <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span>Transit Punctuality &amp; Gate Radar</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-sky-400">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <Plane className="w-3.5 h-3.5" />
                        <span>Airport &amp; Flights</span>
                      </span>
                      <span className="text-[10px] font-bold bg-sky-950 px-1.5 py-0.2 rounded border border-sky-700/50">
                        {statusProfile.transitSummary.flights.onTimeRate}
                      </span>
                    </div>
                    <p className="text-white font-semibold">{statusProfile.transitSummary.flights.status}</p>
                    <p className="text-[10px] text-slate-400">Queue: {statusProfile.transitSummary.flights.gateQueue}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-amber-400">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <Train className="w-3.5 h-3.5" />
                        <span>Vande Bharat / Rail</span>
                      </span>
                      <span className="text-[10px] font-bold bg-amber-950 px-1.5 py-0.2 rounded border border-amber-700/50">
                        {statusProfile.transitSummary.trains.punctuality}
                      </span>
                    </div>
                    <p className="text-white font-semibold">{statusProfile.transitSummary.trains.status}</p>
                    <p className="text-[10px] text-slate-400 truncate">Hub: {statusProfile.transitSummary.trains.majorHub}</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60 space-y-1">
                    <div className="flex items-center justify-between text-emerald-400">
                      <span className="font-bold flex items-center gap-1 text-[11px]">
                        <Car className="w-3.5 h-3.5" />
                        <span>Highways &amp; Cabs</span>
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700/50">
                        FASTag Active
                      </span>
                    </div>
                    <p className="text-white font-semibold">{statusProfile.transitSummary.cabsHighways.status}</p>
                    <p className="text-[10px] text-slate-400 truncate">Corridor: {statusProfile.transitSummary.cabsHighways.expressway}</p>
                  </div>
                </div>
              </div>

              {/* 4. Official 24x7 Emergency Contacts */}
              <div className="pt-2 border-t border-slate-700/60">
                <span className="font-bold text-slate-300 block mb-2 text-[11px]">
                  Emergency &amp; Government Travel Helplines:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {statusProfile.emergencyContacts.map((c, i) => (
                    <div key={i} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
                      <span className="text-slate-400 block truncate">{c.service}</span>
                      <span className="font-mono font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                        <PhoneCall className="w-2.5 h-2.5" />
                        <span>{c.number}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Data refreshed via IMD Satellite, DGCA Flight Radar &amp; NHAI FASTag grid
              </span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
              >
                Close Radar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
