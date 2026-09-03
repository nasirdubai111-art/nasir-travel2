import React, { useState, useEffect } from "react";
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  Plane,
  Train,
  Bus,
  Building2,
  Palmtree,
  Landmark,
  Car,
  Compass,
  Sparkles,
  ShieldCheck,
  Tag,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Settings,
} from "lucide-react";
import {
  CalendarServiceType,
  CalendarTimeSlot,
  CalendarDateAvailability,
} from "../../types";
import { CommonCalendar } from "./CommonCalendar";
import { TimeSlotSelector } from "./TimeSlotSelector";
import { RegionalHolidayCalendarView } from "./RegionalHolidayCalendarView";
import { CalendarService } from "../../services/CalendarService";
import { Flag } from "lucide-react";

interface CalendarTimingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialServiceType?: CalendarServiceType;
  onSelectBookingPlan?: (plan: {
    serviceType: CalendarServiceType;
    startDate: string;
    endDate?: string;
    timeSlot?: CalendarTimeSlot;
    customTime?: string;
  }) => void;
  onOpenAdminCalendar?: () => void;
}

export function CalendarTimingsModal({
  isOpen,
  onClose,
  initialServiceType = "flights",
  onSelectBookingPlan,
  onOpenAdminCalendar,
}: CalendarTimingsModalProps) {
  const [activeService, setActiveService] = useState<CalendarServiceType>(initialServiceType);
  const [activeSubTab, setActiveSubTab] = useState<
    "calendar" | "time_slots" | "regional_holidays" | "rules"
  >("calendar");

  // Selection states
  const [selectedStartDate, setSelectedStartDate] = useState("2026-09-03");
  const [selectedEndDate, setSelectedEndDate] = useState("2026-09-06");
  const [selectedSlot, setSelectedSlot] = useState<CalendarTimeSlot | undefined>();
  const [customTime, setCustomTime] = useState("09:00");
  const [calendarMode, setCalendarMode] = useState<"single" | "range">(
    initialServiceType === "hotels" ? "range" : "single"
  );

  // Sync service changes with calendar mode
  useEffect(() => {
    if (activeService === "hotels") {
      setCalendarMode("range");
    }
  }, [activeService]);

  if (!isOpen) return null;

  const servicesList: Array<{ id: CalendarServiceType; name: string; icon: any; badge: string }> = [
    { id: "flights", name: "Flights", icon: Plane, badge: "DEL ➔ BOM" },
    { id: "trains", name: "Trains", icon: Train, badge: "Vande Bharat" },
    { id: "buses", name: "Buses", icon: Bus, badge: "Volvo Sleeper" },
    { id: "hotels", name: "Hotels", icon: Building2, badge: "Taj Palace" },
    { id: "tours", name: "Tours", icon: Palmtree, badge: "Golden Triangle" },
    { id: "pilgrimage", name: "Pilgrimage", icon: Landmark, badge: "Kashi VIP" },
    { id: "cabs", name: "Cabs", icon: Car, badge: "Airport & Outstation" },
    { id: "activities", name: "Activities", icon: Compass, badge: "Scuba & Dunes" },
  ];

  const handleConfirmSelection = () => {
    onSelectBookingPlan?.({
      serviceType: activeService,
      startDate: selectedStartDate,
      endDate: calendarMode === "range" ? selectedEndDate : undefined,
      timeSlot: selectedSlot,
      customTime,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-50 w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/25 border border-blue-400/30 flex items-center justify-center text-blue-400 font-bold shadow-inner">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-widest font-black text-blue-400">
                  Universal Engine
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Shared Service Tier
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white">
                Calendar &amp; Timings Hub
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAdminCalendar && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdminCalendar();
                }}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer transition-all"
                title="Manage in Admin Console"
              >
                <Settings className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Schedules</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 8 Travel Services Tabs Bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
          {servicesList.map((svc) => {
            const Icon = svc.icon;
            const isActive = activeService === svc.id;
            return (
              <button
                key={svc.id}
                onClick={() => setActiveService(svc.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{svc.name}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {svc.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-view switcher: Calendar vs Time Slots vs Regional Holiday Calendar vs Cut-off Rules */}
        <div className="bg-slate-100 px-4 py-2 flex items-center justify-between border-b border-slate-200 text-xs font-bold overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setActiveSubTab("calendar")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === "calendar"
                  ? "bg-white text-blue-700 shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>1. Date Availability &amp; Pricing</span>
            </button>

            <button
              onClick={() => setActiveSubTab("time_slots")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === "time_slots"
                  ? "bg-white text-blue-700 shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>2. Time Slots &amp; Batches</span>
            </button>

            <button
              onClick={() => setActiveSubTab("regional_holidays")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === "regional_holidays"
                  ? "bg-white text-purple-700 shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Flag className="w-3.5 h-3.5 text-purple-600" />
              <span>3. Regional Holiday Calendar</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 font-black">
                State &amp; National
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab("rules")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeSubTab === "rules"
                  ? "bg-white text-blue-700 shadow-2xs font-extrabold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>4. Cut-off &amp; Cancellation SLA</span>
            </button>
          </div>

          {activeSubTab === "calendar" && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 hidden sm:inline">Mode:</span>
              <div className="inline-flex rounded-lg p-0.5 bg-slate-200 text-[11px]">
                <button
                  onClick={() => setCalendarMode("single")}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    calendarMode === "single" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Single Date
                </button>
                <button
                  onClick={() => setCalendarMode("range")}
                  className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                    calendarMode === "range" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600"
                  }`}
                >
                  Date Range
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {activeSubTab === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2">
                <CommonCalendar
                  serviceType={activeService}
                  mode={calendarMode}
                  startDate={selectedStartDate}
                  endDate={selectedEndDate}
                  onSelectSingleDate={(d) => {
                    setSelectedStartDate(d);
                  }}
                  onSelectRange={(s, e) => {
                    setSelectedStartDate(s);
                    setSelectedEndDate(e);
                  }}
                  onOpenRegionalHolidays={() => setActiveSubTab("regional_holidays")}
                />
              </div>

              {/* Side Summary & Time Preview */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="text-[11px] font-bold uppercase text-slate-400">Current Selection</div>
                  <div className="mt-1 font-black text-slate-900 text-lg">
                    {activeService.toUpperCase()} Booking
                  </div>

                  <div className="mt-3 space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Departure / Check-in:</span>
                      <strong className="text-slate-900">{selectedStartDate}</strong>
                    </div>

                    {calendarMode === "range" && (
                      <div className="flex justify-between py-1.5 border-b border-slate-100">
                        <span className="text-slate-500">Return / Check-out:</span>
                        <strong className="text-slate-900">{selectedEndDate}</strong>
                      </div>
                    )}

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Timezone:</span>
                      <strong className="text-slate-900">IST (Asia/Kolkata +05:30)</strong>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-100">
                      <span className="text-slate-500">Booking Engine:</span>
                      <span className="font-bold text-emerald-600">Centralized Postgres</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveSubTab("time_slots")}
                    className="w-full mt-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-600/20 cursor-pointer"
                  >
                    <span>Proceed to Time Slots</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab("regional_holidays")}
                    className="w-full mt-2 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-purple-200 transition-all cursor-pointer"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>View State &amp; National Holidays</span>
                  </button>
                </div>

                {/* Micro info panel */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 text-xs text-blue-900">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Cross-Product Architecture</span>
                  </div>
                  <p className="text-blue-800/80 leading-relaxed text-[11px]">
                    This centralized Calendar &amp; Timing Engine serves all BharatYatra modules through uniform REST endpoints (`/api/calendar/dates`, `/api/calendar/time-slots`).
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "time_slots" && (
            <div className="flex flex-col gap-4">
              <TimeSlotSelector
                serviceType={activeService}
                selectedDate={selectedStartDate}
                selectedSlotId={selectedSlot?.id}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
                customTime={customTime}
                onCustomTimeChange={(t) => setCustomTime(t)}
              />
            </div>
          )}

          {activeSubTab === "regional_holidays" && (
            <div className="flex flex-col gap-4">
              <RegionalHolidayCalendarView
                activeService={activeService}
                selectedDate={selectedStartDate}
                onSelectDate={(d) => {
                  setSelectedStartDate(d);
                }}
                onProceedToSlots={() => {
                  setActiveSubTab("time_slots");
                }}
              />
            </div>
          )}

          {activeSubTab === "rules" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Booking Cut-off Rules */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 font-black text-slate-900 text-base mb-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Booking Cut-off Rules</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">Flights (Domestic &amp; Intl)</div>
                    <div className="text-slate-600 mt-0.5">Closes 120 minutes prior to scheduled flight departure. Max advance: 365 days.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">IRCTC Trains &amp; Vande Bharat</div>
                    <div className="text-slate-600 mt-0.5">Chart preparation 4 hrs prior; final current booking cutoff 60 mins before departure. Max advance: 120 days.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">Intercity Buses</div>
                    <div className="text-slate-600 mt-0.5">Driver manifest locks 45 mins prior to boarding at source terminal.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">Hotels &amp; Lodges</div>
                    <div className="text-slate-600 mt-0.5">Same-day check-in allowed till 23:00 PM local property time.</div>
                  </div>
                </div>
              </div>

              {/* Cancellation Cut-off Rules */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 font-black text-slate-900 text-base mb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Cancellation &amp; Refund Cut-off Matrix</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200">
                    <div className="font-bold text-emerald-950">&gt; 48 Hours Before Service</div>
                    <div className="text-emerald-800 mt-0.5">100% Full statutory refund (nominal gateway processing fee ₹50 applies).</div>
                  </div>
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                    <div className="font-bold text-amber-950">24 to 48 Hours Before Service</div>
                    <div className="text-amber-800 mt-0.5">50% to 75% partial refund according to carrier SLA.</div>
                  </div>
                  <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-200">
                    <div className="font-bold text-rose-950">&lt; 4 Hours Before Service</div>
                    <div className="text-rose-800 mt-0.5">Zero refund; ticket treated as gate No-Show under regulatory aviation/IRCTC rules.</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">
                {selectedStartDate} {selectedSlot ? `• ${selectedSlot.startTime}` : `• ${customTime}`}
              </div>
              <div className="text-slate-500 text-[11px]">
                {calendarMode === "range" ? `Through ${selectedEndDate}` : "Single Departure"} • Central Calendar Verified
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              className="px-5 py-2.5 rounded-xl bg-[#0B5ED7] hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/25 transition-all cursor-pointer"
            >
              Apply Date &amp; Timings to Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
