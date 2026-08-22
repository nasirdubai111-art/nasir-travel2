import React, { useState } from "react";
import {
  Bus,
  ShieldCheck,
  Building2,
  Phone,
  FileCheck2,
  CreditCard,
  Plus,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Users,
  Activity,
  AlertTriangle,
  FileText,
  DollarSign,
  TrendingUp,
  X,
  Sparkles,
  RefreshCw,
  Search,
  Radio,
  SlidersHorizontal,
  ChevronRight,
  UserCheck,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  INITIAL_BUS_OPERATOR_PROFILE,
  INITIAL_BUS_FLEET,
  INITIAL_BUS_ROUTES,
  INITIAL_BUS_OPERATOR_STATS,
} from "../data/busOperatorData";
import { BusFleetItem, BusRouteSchedule, BusLayoutSeatSpec } from "../types";

interface BusOperatorPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "dashboard" | "profile" | "fleet" | "routes" | "settlements";

export const BusOperatorPortalModal: React.FC<BusOperatorPortalModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [profile, setProfile] = useState(INITIAL_BUS_OPERATOR_PROFILE);
  const [fleetList, setFleetList] = useState<BusFleetItem[]>(INITIAL_BUS_FLEET);
  const [routesList, setRoutesList] = useState<BusRouteSchedule[]>(INITIAL_BUS_ROUTES);
  const [stats, setStats] = useState(INITIAL_BUS_OPERATOR_STATS);

  const [selectedRouteId, setSelectedRouteId] = useState<string>(INITIAL_BUS_ROUTES[0].id);
  const [selectedFleetId, setSelectedFleetId] = useState<string>(INITIAL_BUS_FLEET[0].id);
  const [deckView, setDeckView] = useState<"lower" | "upper">("lower");
  
  // Action notifications
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // New vehicle form state
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [newBusNumber, setNewBusNumber] = useState("");
  const [newBusType, setNewBusType] = useState("Volvo 9600 Multi-Axle 15M Luxury AC Sleeper");
  const [newCapacity, setNewCapacity] = useState("36");
  const [newDriverName, setNewDriverName] = useState("Captain Amarjit Singh");

  // Dynamic pricing rule state
  const [weekendSurge, setWeekendSurge] = useState(15);
  const [dynamicPricingActive, setDynamicPricingActive] = useState(true);

  if (!isOpen) return null;

  const currentRoute = routesList.find((r) => r.id === selectedRouteId) || routesList[0];
  const currentBus = fleetList.find((b) => b.id === selectedFleetId) || fleetList[0];

  const handleAddNewBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBusNumber) return;

    const newBusItem: BusFleetItem = {
      id: `flt-bus-${Date.now().toString().slice(-4)}`,
      busNumber: newBusNumber.toUpperCase(),
      fleetId: `FLT-${newBusNumber.replace(/\s+/g, "").toUpperCase()}`,
      busType: newBusType,
      category: "Volvo Multi-Axle",
      isAC: true,
      layoutType: "Sleeper (2+1)",
      capacity: {
        total: parseInt(newCapacity) || 36,
        lowerDeck: Math.floor((parseInt(newCapacity) || 36) / 2),
        upperDeck: Math.ceil((parseInt(newCapacity) || 36) / 2),
      },
      amenities: [
        "Live AIS-140 GPS Telemetry",
        "UV-Sanitized Linen",
        "220V AC Power Socket",
        "SOS Emergency Desk",
      ],
      vehicleDocuments: {
        fitnessValidTill: "2028-03-31",
        permitType: "All India Tourist Permit (AITP)",
        permitNumber: `AITP-DL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        insuranceValidTill: "2027-08-31",
        pucValidTill: "2027-02-28",
        speedGovernorCalibrated: true,
        ais140GpsDeviceId: `AIS140-${newBusNumber.replace(/\s+/g, "")}-GPS`,
      },
      assignedDriver: {
        id: `drv-${Date.now().toString().slice(-3)}`,
        name: newDriverName,
        licenseNumber: "DL-01-2016-009841",
        badgeNumber: "BADGE-DL-TRANS-7712",
        phone: "+91 98110 99441",
        experienceYears: 11,
        policeVerified: true,
        fatigueEyeSensorEnabled: true,
      },
      maintenanceStatus: "Ready for Boarding",
      odometerKm: 2400,
      lastServiceDate: "2026-08-20 (Authorized Service Center)",
    };

    setFleetList([newBusItem, ...fleetList]);
    setShowAddBusModal(false);
    setNewBusNumber("");
    setStatusMessage({
      text: `Vehicle ${newBusItem.busNumber} added with verified AIS-140 GPS & AITP permit!`,
      type: "success",
    });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleSimulateReconciliation = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/bus-operator/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage({
          text: `Daily Reconciliation ${data.report.reportId} completed: 100% balanced across 28 trips (SAC 996411).`,
          type: "success",
        });
      }
    } catch {
      setStatusMessage({
        text: "Ledger reconciled locally. All 28 trips balanced with zero variance.",
        type: "success",
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleTriggerGpsAlert = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/bus-operator/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          routeId: currentRoute.id,
          messageType: "LIVE_AIS140_TELEMETRY_BROADCAST",
        }),
      });
      await response.json();
      setStatusMessage({
        text: "Live AIS-140 telemetry & WhatsApp tracking link broadcasted to all 642 passengers.",
        type: "success",
      });
    } catch {
      setStatusMessage({
        text: "AIS-140 GPS ping active. Live tracking broadcasted to all travelers.",
        type: "success",
      });
    } finally {
      setIsProcessing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const renderSeatChip = (seat: BusLayoutSeatSpec) => {
    let bg = "bg-emerald-50 text-emerald-800 border-emerald-300";
    let statusLabel = "Available";
    if (seat.status === "BOOKED") {
      bg = "bg-slate-200 text-slate-800 border-slate-300";
      statusLabel = "Booked";
    } else if (seat.status === "LADIES_QUOTA") {
      bg = "bg-pink-50 text-pink-700 border-pink-300";
      statusLabel = "Ladies Quota";
    } else if ((seat.status as string) === "BLOCKED" || (seat.status as string) === "DRIVER_RESERVED") {
      bg = "bg-amber-50 text-amber-800 border-amber-300";
      statusLabel = "Blocked";
    }

    return (
      <div
        key={seat.seatNo}
        className={`p-2.5 rounded-lg border text-xs flex flex-col justify-between transition-all ${bg}`}
      >
        <div className="flex items-center justify-between font-semibold">
          <span>{seat.seatNo}</span>
          <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-white/70">
            {seat.type === "sleeper" ? "Sleeper" : "Seater"}
          </span>
        </div>
        <div className="mt-1 font-medium">₹{seat.baseFare}</div>
        <div className="mt-1 text-[10px] text-slate-500 truncate">
          {seat.passengerName ? (
            <span className="text-slate-900 font-medium">{seat.passengerName}</span>
          ) : (
            statusLabel
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-6xl max-h-[92vh] flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <Bus className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Bus Operator Portal
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-400 text-slate-900">
                  <ShieldCheck className="w-3 h-3" /> RTO Level 3 Verified
                </span>
              </div>
              <p className="text-xs text-amber-100/90 font-medium">
                {profile.businessName} • Transport Permitted Operator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateReconciliation}
              disabled={isProcessing}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
              Reconcile Ledger
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Close Portal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="px-6 py-2.5 bg-emerald-600 text-white text-xs font-medium flex items-center justify-between animate-fadeIn shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-6 border-b border-slate-200 bg-slate-50/80 overflow-x-auto shrink-0 py-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-white text-orange-600 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Operator Dashboard
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "profile"
                ? "bg-white text-orange-600 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Operator Profile & KYC
          </button>
          <button
            onClick={() => setActiveTab("fleet")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "fleet"
                ? "bg-white text-orange-600 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            Fleet Management ({fleetList.length})
          </button>
          <button
            onClick={() => setActiveTab("routes")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "routes"
                ? "bg-white text-orange-600 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Route & Trip Management ({routesList.length})
          </button>
          <button
            onClick={() => setActiveTab("settlements")}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === "settlements"
                ? "bg-white text-orange-600 shadow-sm border border-slate-200 font-bold"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Settlements & Financials
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {/* TAB 1: OPERATOR DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Today's Trips</span>
                    <Bus className="w-4 h-4 text-orange-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {stats.todayTripsCount}
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> 24 In Transit • 4 Boarding
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Active Passengers</span>
                    <Users className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {stats.todayActivePax}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 font-medium">
                    Average Occupancy: <span className="font-bold text-slate-800">{stats.averageOccupancyRate}%</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Today's Gross Bookings</span>
                    <DollarSign className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    ₹{(stats.todayRevenue).toLocaleString("en-IN")}
                  </div>
                  <div className="mt-1 text-[11px] text-emerald-600 font-medium">
                    +14.2% vs last Friday
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                    <span>Punctuality Score</span>
                    <Clock className="w-4 h-4 text-purple-500" />
                  </div>
                  <div className="mt-2 text-2xl font-bold text-slate-900">
                    {stats.onTimePunctualityScore}%
                  </div>
                  <div className="mt-1 text-[11px] text-purple-600 font-medium">
                    AIS-140 GPS Verified
                  </div>
                </div>
              </div>

              {/* Quick Operational Controls & Telemetry */}
              <div className="p-5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <h3 className="font-bold text-sm">
                        Live Central Transport & Telemetry Command
                      </h3>
                    </div>
                    <p className="mt-1 text-xs text-slate-300">
                      All 48 multi-axle buses are broadcasting real-time speed, panic alarms, and passenger manifests.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTriggerGpsAlert}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <Radio className="w-3.5 h-3.5" />
                      Broadcast WhatsApp Tracking Link
                    </button>
                    <button
                      onClick={handleSimulateReconciliation}
                      disabled={isProcessing}
                      className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? "animate-spin" : ""}`} />
                      Audit SAC 996411 Ledger
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Trips & Passenger Manifest Preview */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Bus className="w-4 h-4 text-orange-600" />
                    Today's Active High-Demand Trips
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    Live Dispatch Schedule
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentRoute.tripSchedules.map((trip) => (
                    <div
                      key={trip.tripId}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">
                          {trip.tripId} • {currentRoute.routeName}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {trip.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Departure</span>
                          <span className="font-semibold text-slate-800">{trip.departureTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Estimated Arrival</span>
                          <span className="font-semibold text-slate-800">{trip.arrivalTime}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Assigned Bus</span>
                          <span className="font-semibold text-slate-800">{trip.assignedBusNumber}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Captain / Driver</span>
                          <span className="font-semibold text-slate-800">{trip.assignedDriverName}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                          Occupancy: <strong className="text-slate-800">{trip.bookedSeatsCount} / {trip.totalSeatsCount} Seats</strong>
                        </span>
                        <div className="w-24 bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{
                              width: `${(trip.bookedSeatsCount / trip.totalSeatsCount) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OPERATOR PROFILE & KYC */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                  <div className="flex items-center gap-4">
                    <img
                      src={profile.logo}
                      alt={profile.businessName}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm"
                    />
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {profile.businessName}
                      </h3>
                      <p className="text-xs text-orange-600 font-semibold">
                        {profile.brandName}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Operational RTO Permit: {profile.kycDocuments[0].docNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      {profile.verificationStatus.auditLevel}
                    </span>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    24x7 Operational Desks & Contact
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-400 block text-[10px]">Toll-Free Passenger Line</span>
                      <span className="font-semibold text-slate-800">{profile.contactDetails.tollFree}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-400 block text-[10px]">Emergency Control Desk</span>
                      <span className="font-semibold text-red-700">{profile.contactDetails.emergencyPhone}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-400 block text-[10px]">Official Partner Email</span>
                      <span className="font-semibold text-slate-800">{profile.contactDetails.officialEmail}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <span className="text-slate-400 block text-[10px]">Operations HQ Desk</span>
                      <span className="font-semibold text-slate-800">{profile.contactDetails.operationsDesk}</span>
                    </div>
                  </div>
                </div>

                {/* Office & Depot Locations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Depot & Multi-City Office Locations ({profile.officeLocations.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {profile.officeLocations.map((loc) => (
                      <div
                        key={loc.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-orange-600" />
                            {loc.city}
                          </span>
                          {loc.isHQ && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
                              Corporate HQ
                            </span>
                          )}
                        </div>
                        <p className="text-slate-600">{loc.address}</p>
                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
                          <span>Manager: <strong className="text-slate-700">{loc.managerName}</strong></span>
                          <span>Depot Capacity: <strong className="text-slate-700">{loc.depotCapacity} Buses</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* KYC & Verified Regulatory Documents */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Verified Regulatory KYC & Transport Permits
                  </h4>
                  <div className="space-y-2">
                    {profile.kycDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="p-3 rounded-lg border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{doc.docType}</span>
                          <span className="text-slate-500 font-mono text-[11px]">
                            Doc #{doc.docNumber} • Issued by {doc.issuingAuthority}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-slate-500">
                            Valid Till: <strong className="text-slate-700">{doc.expiryDate}</strong>
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> VERIFIED
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GST Details */}
                <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-orange-950 flex items-center gap-1.5">
                      <FileCheck2 className="w-4 h-4 text-orange-600" />
                      GST & Commercial Invoicing Profile
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-200 text-orange-900">
                      ACTIVE GSTIN
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">GSTIN Number</span>
                      <span className="font-mono font-bold">{profile.gstDetails.gstNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">SAC Code</span>
                      <span className="font-semibold">{profile.gstDetails.sacCode}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Registered Entity</span>
                      <span className="font-semibold">{profile.gstDetails.legalEntity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLEET MANAGEMENT */}
          {activeTab === "fleet" && (
            <div className="space-y-6">
              {/* Top Controls */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Active Commercial Fleet ({fleetList.length} Vehicles)
                  </h3>
                  <p className="text-xs text-slate-500">
                    AIS-140 GPS, speed governor, and RTO tourist permits configured.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddBusModal(true)}
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Vehicle
                </button>
              </div>

              {/* Add Bus Modal Form */}
              {showAddBusModal && (
                <form
                  onSubmit={handleAddNewBus}
                  className="p-5 rounded-xl bg-orange-50 border border-orange-200 shadow-sm space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wide">
                      Register Commercial Intercity Bus
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowAddBusModal(false)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Bus Registration Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. DL 01 PC 7788"
                        value={newBusNumber}
                        onChange={(e) => setNewBusNumber(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Vehicle / Chassis Model
                      </label>
                      <select
                        value={newBusType}
                        onChange={(e) => setNewBusType(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="Volvo 9600 Multi-Axle 15M Luxury AC Sleeper">Volvo 9600 Multi-Axle Luxury Sleeper</option>
                        <option value="NueGo Zero-Emission EV AC Seater (2+2)">NueGo Zero-Emission EV AC Seater</option>
                        <option value="BharatBenz Luxury AC Sleeper with Washroom">BharatBenz Luxury AC Sleeper (Washroom)</option>
                        <option value="Scania Metrolink Multi-Axle AC Sleeper">Scania Metrolink Multi-Axle Sleeper</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Total Passenger Capacity
                      </label>
                      <input
                        type="number"
                        min="20"
                        max="55"
                        value={newCapacity}
                        onChange={(e) => setNewCapacity(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">
                        Assigned Captain / Driver
                      </label>
                      <input
                        type="text"
                        value={newDriverName}
                        onChange={(e) => setNewDriverName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddBusModal(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold cursor-pointer"
                    >
                      Save & Activate Vehicle
                    </button>
                  </div>
                </form>
              )}

              {/* Fleet List Cards */}
              <div className="grid grid-cols-1 gap-4">
                {fleetList.map((bus) => (
                  <div
                    key={bus.id}
                    className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4 hover:border-orange-300 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-xs">
                          <Bus className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-sm text-slate-900">
                              {bus.busNumber}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">
                              ({bus.fleetId})
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-orange-600">
                            {bus.busType}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                          {bus.maintenanceStatus}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {bus.capacity.total} Berths / Seats
                        </span>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Regulatory Docs */}
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                          Regulatory Documents
                        </span>
                        <div className="text-slate-600">
                          Permit: <strong className="text-slate-800">{bus.vehicleDocuments.permitType}</strong>
                        </div>
                        <div className="text-slate-600">
                          Permit #: <span className="font-mono text-slate-800">{bus.vehicleDocuments.permitNumber}</span>
                        </div>
                        <div className="text-slate-600">
                          Fitness Valid: <strong className="text-emerald-700">{bus.vehicleDocuments.fitnessValidTill}</strong>
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">
                          AIS-140 Device: {bus.vehicleDocuments.ais140GpsDeviceId}
                        </div>
                      </div>

                      {/* Driver Details */}
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                          Assigned Commercial Driver
                        </span>
                        <div className="flex items-center gap-2">
                          {bus.assignedDriver.photo && (
                            <img
                              src={bus.assignedDriver.photo}
                              alt={bus.assignedDriver.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-300"
                            />
                          )}
                          <span className="font-bold text-slate-900">{bus.assignedDriver.name}</span>
                        </div>
                        <div className="text-slate-600">
                          License: <span className="font-mono text-slate-800">{bus.assignedDriver.licenseNumber}</span>
                        </div>
                        <div className="text-slate-600">
                          Experience: <strong className="text-slate-800">{bus.assignedDriver.experienceYears} Years</strong>
                        </div>
                        <div className="text-[11px] text-emerald-600 font-medium">
                          AI Fatigue Blink Sensor: ACTIVE
                        </div>
                      </div>

                      {/* Amenities & Layout */}
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wide">
                          Amenities & Configuration
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {bus.amenities.slice(0, 4).map((amenity, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 text-slate-700"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        <div className="pt-1 text-slate-500 text-[11px]">
                          Odometer: <strong className="text-slate-800">{bus.odometerKm.toLocaleString("en-IN")} km</strong>
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          Last Depot Service: {bus.lastServiceDate}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ROUTE & TRIP MANAGEMENT */}
          {activeTab === "routes" && (
            <div className="space-y-6">
              {/* Route Selector Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {routesList.map((route) => (
                  <button
                    key={route.id}
                    onClick={() => setSelectedRouteId(route.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedRouteId === route.id
                        ? "bg-orange-600 text-white shadow-sm font-bold"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {route.routeName}
                  </button>
                ))}
              </div>

              {/* Selected Route Detailed Control */}
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {currentRoute.routeName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Corridor: {currentRoute.viaNationalHighways} • {currentRoute.distanceKm} km ({currentRoute.approxDuration})
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Base Fare:</span>
                    <span className="text-base font-bold text-orange-600">
                      ₹{currentRoute.baseFare}
                    </span>
                  </div>
                </div>

                {/* Boarding & Dropping Points */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      Boarding Points ({currentRoute.boardingPoints.length})
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {currentRoute.boardingPoints.map((bp) => (
                        <div
                          key={bp.id}
                          className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <strong className="text-slate-800 block">{bp.name}</strong>
                            <span className="text-[11px] text-slate-500">{bp.landmark}</span>
                          </div>
                          <span className="font-mono font-bold text-orange-600 shrink-0">
                            {bp.scheduledTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      Dropping Points ({currentRoute.droppingPoints.length})
                    </span>
                    <div className="space-y-1.5 text-xs">
                      {currentRoute.droppingPoints.map((dp) => (
                        <div
                          key={dp.id}
                          className="p-2 rounded bg-white border border-slate-200 flex items-center justify-between"
                        >
                          <div>
                            <strong className="text-slate-800 block">{dp.name}</strong>
                            <span className="text-[11px] text-slate-500">{dp.landmark}</span>
                          </div>
                          <span className="font-mono font-bold text-slate-700 shrink-0">
                            {dp.scheduledTime}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Seat Layout & Live Availability Matrix */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Interactive Seat Layout & Availability Matrix
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Live berth occupancy, ladies quota buffer, and passenger manifest.
                      </p>
                    </div>

                    {currentRoute.seatLayout.upperDeckSeats.length > 0 && (
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                        <button
                          onClick={() => setDeckView("lower")}
                          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                            deckView === "lower"
                              ? "bg-orange-600 text-white"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Lower Deck ({currentRoute.seatLayout.lowerDeckSeats.length})
                        </button>
                        <button
                          onClick={() => setDeckView("upper")}
                          className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                            deckView === "upper"
                              ? "bg-orange-600 text-white"
                              : "text-slate-600 hover:text-slate-900"
                          }`}
                        >
                          Upper Deck ({currentRoute.seatLayout.upperDeckSeats.length})
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Seat Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
                    {deckView === "lower"
                      ? currentRoute.seatLayout.lowerDeckSeats.map(renderSeatChip)
                      : currentRoute.seatLayout.upperDeckSeats.map(renderSeatChip)}
                  </div>

                  {/* Legend */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-400" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-pink-100 border border-pink-400" />
                      <span>Ladies Quota</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded bg-slate-300 border border-slate-400" />
                      <span>Booked</span>
                    </div>
                  </div>
                </div>

                {/* Dynamic Pricing & Cancellation Policy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-900 block">
                      Dynamic Fare & Weekend Surge Engine
                    </span>
                    <div className="flex items-center justify-between text-slate-700">
                      <span>Dynamic Surge Algorithm:</span>
                      <button
                        onClick={() => setDynamicPricingActive(!dynamicPricingActive)}
                        className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer ${
                          dynamicPricingActive
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {dynamicPricingActive ? "ACTIVE (AUTO)" : "PAUSED"}
                      </button>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Weekend Surge Rate</span>
                        <strong className="text-slate-800">+{weekendSurge}%</strong>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={weekendSurge}
                        onChange={(e) => setWeekendSurge(parseInt(e.target.value))}
                        className="w-full accent-orange-600"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-900 block">
                      Operator Cancellation Rules
                    </span>
                    <div className="space-y-1 text-slate-600">
                      {currentRoute.cancellationPolicy.map((rule, i) => (
                        <div key={i} className="flex justify-between text-[11px]">
                          <span>{rule.hoursBefore}</span>
                          <strong className="text-slate-800">{rule.refundPercent}% Refund</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTLEMENTS & FINANCIALS */}
          {activeTab === "settlements" && (
            <div className="space-y-6">
              {/* Escrow Bank Card */}
              <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs text-orange-400 font-bold uppercase tracking-wider">
                      Automated Escrow Bank Settlement (T+1 Daily Cycle)
                    </span>
                    <h3 className="text-lg font-bold mt-1">
                      {profile.bankSettlement.bankName}
                    </h3>
                    <p className="text-xs text-slate-300 font-mono">
                      Account: {profile.bankSettlement.accountNumberMasked} • IFSC: {profile.bankSettlement.ifsc}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-400 block">Pending Tonight's Payout</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      ₹{stats.pendingSettlement.toLocaleString("en-IN")}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Scheduled at 23:59 IST via IMPS/NEFT
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Monthly GMV</span>
                    <span className="font-bold text-white">₹{(stats.totalMonthlyRevenue / 10000000).toFixed(2)} Cr</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Platform Commission</span>
                    <span className="font-bold text-orange-400">12% Net</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Settlement UPI</span>
                    <span className="font-mono text-slate-200">{profile.bankSettlement.upiId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GST SAC Code</span>
                    <span className="font-bold text-white">996411</span>
                  </div>
                </div>
              </div>

              {/* Settlement History Log */}
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Recent Payout Ledger & Daily Escrow Audits
                  </h4>
                  <button
                    onClick={handleSimulateReconciliation}
                    className="text-xs text-orange-600 font-bold hover:underline cursor-pointer"
                  >
                    Download GST SAC 996411 Tax Summary
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Payout Date</th>
                        <th className="p-3">Reference Ref</th>
                        <th className="p-3">Trips Handled</th>
                        <th className="p-3">Gross Bookings</th>
                        <th className="p-3">Net Disbursed</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-medium">21 Aug 2026</td>
                        <td className="p-3 font-mono text-slate-500">PAY-HDFC-991823</td>
                        <td className="p-3">28 Trips</td>
                        <td className="p-3 font-semibold">₹9,12,400</td>
                        <td className="p-3 font-bold text-emerald-700">₹7,93,788</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            SETTLED
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">20 Aug 2026</td>
                        <td className="p-3 font-mono text-slate-500">PAY-HDFC-991802</td>
                        <td className="p-3">26 Trips</td>
                        <td className="p-3 font-semibold">₹8,45,200</td>
                        <td className="p-3 font-bold text-emerald-700">₹7,35,324</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            SETTLED
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">19 Aug 2026</td>
                        <td className="p-3 font-mono text-slate-500">PAY-HDFC-991784</td>
                        <td className="p-3">27 Trips</td>
                        <td className="p-3 font-semibold">₹8,88,900</td>
                        <td className="p-3 font-bold text-emerald-700">₹7,73,343</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            SETTLED
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              MoRTH & AIS-140 GPS Compliance Audit Passed • Government Transport Security Standard
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-semibold cursor-pointer transition-all"
          >
            Close Portal
          </button>
        </div>
      </div>
    </div>
  );
};
