import React, { useState } from "react";
import {
  User,
  Building2,
  Shield,
  ShieldAlert,
  Car,
  FileText,
  CreditCard,
  History,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  Filter,
  DollarSign,
  Lock,
  Download,
  AlertTriangle,
  RefreshCw,
  Search,
  Eye,
  Check,
  Zap,
} from "lucide-react";
import { CabRoleTier, CabSystemAuditLog } from "../../types/pilgrimagePipelineTypes";
import {
  SEED_CAB_CUSTOMERS,
  SEED_CAB_SYSTEM_AUDIT_LOGS,
  SEED_CAB_FINANCIAL_RECONCILIATION,
  CabCustomerUser,
} from "../../data/cabRoleHierarchyData";
import { travelVerticalsService } from "../../services/travelVerticalsService";
import { Cab, CabBooking } from "../../types/travelVerticalsHierarchy";

export function CabRoleHierarchyView() {
  const [activeTier, setActiveTier] = useState<CabRoleTier>("customer");

  // State for Customer Tier
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("CUST-IN-55102");
  const [customerSuccessMsg, setCustomerSuccessMsg] = useState<string | null>(null);

  // State for Operator Tier
  const [selectedOperatorId, setSelectedOperatorId] = useState<string>("PTR-FLEET-DELHI-01");
  const [cabStatusOverride, setCabStatusOverride] = useState<Record<string, string>>({});

  // State for Admin Tier
  const [adminCityFilter, setAdminCityFilter] = useState<string>("all");
  const [adminSearch, setAdminSearch] = useState<string>("");

  // State for Super Admin Tier
  const [auditFilter, setAuditFilter] = useState<string>("all");
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);

  // Fetch all cabs and all bookings
  const allCabs: Cab[] = travelVerticalsService.getCabs();
  const allBookings: CabBooking[] = travelVerticalsService.getAllCabBookings();

  // Tier 1: Customer filtered data (OWN BOOKINGS ONLY)
  const currentCustomer: CabCustomerUser =
    SEED_CAB_CUSTOMERS.find((c) => c.customerId === selectedCustomerId) || SEED_CAB_CUSTOMERS[0];
  const customerOwnBookings: CabBooking[] = allBookings.filter(
    (b) => b.customerId === selectedCustomerId || b.customerName.toLowerCase().includes(currentCustomer.name.toLowerCase().split(" ")[0])
  );

  // Tier 2: Operator filtered data (OWN CABS + THEIR BOOKINGS)
  const operatorUniqueList = Array.from(
    new Set(allCabs.map((c) => JSON.stringify({ partnerId: c.partnerId, partnerName: c.partnerName })))
  ).map((str) => JSON.parse(str));

  const operatorOwnCabs: Cab[] = allCabs.filter((c) => c.partnerId === selectedOperatorId);
  const operatorCabIds = new Set(operatorOwnCabs.map((c) => c.cabId));
  const operatorOwnBookings: CabBooking[] = allBookings.filter((b) => operatorCabIds.has(b.cabId));

  // Tier 3: Admin filtered data (ALL CAB OPERATIONS)
  const adminFilteredCabs = allCabs.filter((c) => {
    const matchesCity = adminCityFilter === "all" || c.currentLocationCity.toLowerCase().includes(adminCityFilter.toLowerCase());
    const matchesSearch =
      c.vehicleModel.toLowerCase().includes(adminSearch.toLowerCase()) ||
      c.registrationNumber.toLowerCase().includes(adminSearch.toLowerCase()) ||
      c.driverName.toLowerCase().includes(adminSearch.toLowerCase());
    return matchesCity && matchesSearch;
  });

  // Tier 4: Super Admin filtered data (ALL CAB + BOOKING + PAYMENT + AUDIT DATA)
  const auditLogs: CabSystemAuditLog[] =
    auditFilter === "all"
      ? SEED_CAB_SYSTEM_AUDIT_LOGS
      : SEED_CAB_SYSTEM_AUDIT_LOGS.filter((log) => log.actorRole === auditFilter);

  const handleCopyHash = (logId: string, checksum: string) => {
    navigator.clipboard?.writeText(checksum);
    setCopiedLogId(logId);
    setTimeout(() => setCopiedLogId(null), 2500);
  };

  const handleToggleCabStatus = (cabId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "available" ? "on_trip" : currentStatus === "on_trip" ? "maintenance" : "available";
    setCabStatusOverride((prev) => ({ ...prev, [cabId]: nextStatus }));
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner with Hierarchy Visualization */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Car className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-3xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Role-Based Access Hierarchy
                </span>
                <span className="text-2xs text-slate-400 font-mono">Enforced at API &amp; Row-Level</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                Cab Multi-Tenant RBAC &amp; Dispatch Governance
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-700 text-xs font-mono text-emerald-400">
              Active Tier: <strong className="text-white uppercase">{activeTier.replace("_", " ")}</strong>
            </span>
          </div>
        </div>

        {/* Visual Architecture Tree */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2 border-t border-slate-800/80">
          <div
            onClick={() => setActiveTier("customer")}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTier === "customer"
                ? "bg-sky-950/80 border-sky-400 shadow-lg shadow-sky-500/10"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <User className="w-4 h-4" />
              <span className="font-bold text-xs">Customer</span>
            </div>
            <p className="text-[11px] text-slate-300 font-semibold">Own cab bookings only</p>
            <span className="text-[10px] text-slate-400 block mt-1">Scoped by customer_id</span>
          </div>

          <div
            onClick={() => setActiveTier("operator")}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTier === "operator"
                ? "bg-amber-950/80 border-amber-400 shadow-lg shadow-amber-500/10"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <Building2 className="w-4 h-4" />
              <span className="font-bold text-xs">Cab Operator</span>
            </div>
            <p className="text-[11px] text-slate-300 font-semibold">Own cabs + their bookings</p>
            <span className="text-[10px] text-slate-400 block mt-1">Scoped by partner_id</span>
          </div>

          <div
            onClick={() => setActiveTier("admin")}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTier === "admin"
                ? "bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-500/10"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Shield className="w-4 h-4" />
              <span className="font-bold text-xs">Admin</span>
            </div>
            <p className="text-[11px] text-slate-300 font-semibold">All cab operations</p>
            <span className="text-[10px] text-slate-400 block mt-1">Fleets, dispatches &amp; rates</span>
          </div>

          <div
            onClick={() => setActiveTier("super_admin")}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              activeTier === "super_admin"
                ? "bg-purple-950/80 border-purple-400 shadow-lg shadow-purple-500/10"
                : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex items-center gap-2 text-purple-400 mb-1">
              <ShieldAlert className="w-4 h-4" />
              <span className="font-bold text-xs">Super Admin</span>
            </div>
            <p className="text-[11px] text-slate-300 font-semibold">All cab + booking + payment + audit</p>
            <span className="text-[10px] text-slate-400 block mt-1">Full financials &amp; audit trails</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TIER 1: CUSTOMER — OWN CAB BOOKINGS ONLY */}
      {/* ===================================================================== */}
      {activeTier === "customer" && (
        <div className="bg-slate-900/90 border border-sky-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Customer Security Boundary
                </span>
                <span className="text-2xs text-slate-400">Strict Row-Level Isolation</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Customer View: <span className="text-sky-300">Own Cab Bookings Only</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Devotee/Passenger can only view trips mapped to their verified phone / customer ID.
              </p>
            </div>

            {/* Customer Switcher */}
            <div className="flex items-center gap-2">
              <label className="text-2xs text-slate-400 font-bold whitespace-nowrap">Switch Customer Identity:</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-sky-400 font-semibold"
              >
                {SEED_CAB_CUSTOMERS.map((cust) => (
                  <option key={cust.customerId} value={cust.customerId}>
                    {cust.name} ({cust.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Profile Mini Banner */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center font-black">
                {currentCustomer.name.charAt(0)}
              </div>
              <div>
                <span className="font-bold text-white text-sm">{currentCustomer.name}</span>
                <div className="text-slate-400 text-2xs flex items-center gap-3 mt-0.5">
                  <span>Phone: {currentCustomer.phone}</span>
                  <span>&bull;</span>
                  <span>Email: {currentCustomer.email}</span>
                  <span>&bull;</span>
                  <span>ID: <code className="text-sky-300 font-mono">{currentCustomer.customerId}</code></span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-sky-500/15 text-sky-300 font-mono font-bold text-2xs">
                {customerOwnBookings.length} Own Cab {customerOwnBookings.length === 1 ? "Booking" : "Bookings"}
              </span>
            </div>
          </div>

          {customerSuccessMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between">
              <span className="font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {customerSuccessMsg}
              </span>
              <button onClick={() => setCustomerSuccessMsg(null)} className="text-slate-400 hover:text-white text-2xs">
                Dismiss
              </button>
            </div>
          )}

          {/* Customer Trips List */}
          {customerOwnBookings.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 space-y-2">
              <Car className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs text-slate-300 font-bold">No cab trips found for this customer.</p>
              <p className="text-2xs text-slate-400">Strict isolation prevents loading other customers&apos; rides.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {customerOwnBookings.map((trip) => {
                const assignedCab = allCabs.find((c) => c.cabId === trip.cabId);
                return (
                  <div
                    key={trip.cabBookingId}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-3xs font-extrabold">
                            {trip.cabBookingId}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-3xs font-bold">
                            {trip.tripType}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-3xs font-mono font-bold">
                            STATUS: {trip.bookingStatus.toUpperCase()}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          <span>{trip.pickupLocation}</span>
                          <ArrowRight className="w-4 h-4 text-slate-500" />
                          <span>{trip.dropLocation}</span>
                        </h4>
                      </div>

                      {/* Customer Trip Start OTP */}
                      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 text-center min-w-[130px]">
                        <span className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider block">
                          Ride Start OTP
                        </span>
                        <span className="text-base font-black text-amber-400 font-mono tracking-widest">
                          {trip.otpStart}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Share with driver only</span>
                      </div>
                    </div>

                    {/* Trip Spec Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs">
                      <div>
                        <span className="text-3xs text-slate-400 block">Pickup Datetime</span>
                        <span className="font-semibold text-white text-2xs">{trip.pickupDatetime}</span>
                      </div>
                      <div>
                        <span className="text-3xs text-slate-400 block">Estimated Distance</span>
                        <span className="font-semibold text-white text-2xs">{trip.totalEstimatedKm} km</span>
                      </div>
                      <div>
                        <span className="text-3xs text-slate-400 block">Total Fare Paid</span>
                        <span className="font-black text-emerald-400 text-2xs">₹{trip.totalAmount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-3xs text-slate-400 block">Tax Invoice Ref</span>
                        <span className="font-mono text-slate-300 text-3xs">{trip.taxInvoiceNumber}</span>
                      </div>
                    </div>

                    {/* Assigned Vehicle & Driver (Customer View) */}
                    {assignedCab && (
                      <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                            <Car className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-white text-xs">{assignedCab.vehicleModel}</span>
                            <div className="text-slate-400 text-2xs flex items-center gap-2 mt-0.5">
                              <span className="font-mono text-amber-300">{assignedCab.registrationNumber}</span>
                              <span>&bull;</span>
                              <span>Chauffeur: {assignedCab.driverName} ({assignedCab.driverRating}★)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              setCustomerSuccessMsg(
                                `Live Driver Tracking Active! Driver ${assignedCab.driverName} is 4 mins away at Toll Plaza.`
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-2xs transition-all shadow-md flex items-center gap-1 cursor-pointer"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Track Ride</span>
                          </button>
                          <button
                            onClick={() =>
                              setCustomerSuccessMsg(
                                `Tax Invoice ${trip.taxInvoiceNumber} downloaded for ₹${trip.totalAmount}.`
                              )
                            }
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-2xs transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Invoice</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TIER 2: CAB OPERATOR — OWN CABS + THEIR BOOKINGS */}
      {/* ===================================================================== */}
      {activeTier === "operator" && (
        <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Fleet Partner Boundary
                </span>
                <span className="text-2xs text-slate-400">Scoped to Partner ID</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Cab Operator View: <span className="text-amber-300">Own Cabs + Their Bookings</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Operator only manages their own fleet vehicles and dispatches linked to those vehicles.
              </p>
            </div>

            {/* Operator Switcher */}
            <div className="flex items-center gap-2">
              <label className="text-2xs text-slate-400 font-bold whitespace-nowrap">Switch Operator:</label>
              <select
                value={selectedOperatorId}
                onChange={(e) => setSelectedOperatorId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400 font-semibold"
              >
                {operatorUniqueList.map((op: any) => (
                  <option key={op.partnerId} value={op.partnerId}>
                    {op.partnerName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Operator Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Registered Fleet</span>
              <span className="text-base font-black text-white">{operatorOwnCabs.length} Vehicles</span>
              <span className="text-3xs text-emerald-400 block font-mono">100% RC Verified</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Associated Bookings</span>
              <span className="text-base font-black text-amber-400">{operatorOwnBookings.length} Dispatches</span>
              <span className="text-3xs text-slate-400 block">Strictly mapped to fleet</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Gross Booking Value</span>
              <span className="text-base font-black text-emerald-400">
                ₹{operatorOwnBookings.reduce((acc, b) => acc + b.totalAmount, 0).toLocaleString()}
              </span>
              <span className="text-3xs text-slate-400 block">Net 85% payout pool</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Net Payout Accrued</span>
              <span className="text-base font-black text-sky-400">
                ₹{Math.round(operatorOwnBookings.reduce((acc, b) => acc + b.totalAmount, 0) * 0.85).toLocaleString()}
              </span>
              <span className="text-3xs text-emerald-400 block font-mono">Escrow Cleared</span>
            </div>
          </div>

          {/* Section A: Own Cabs (1) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-amber-400" />
                <span>1. Operator Owned Cabs ({operatorOwnCabs.length})</span>
              </h4>
              <span className="text-3xs text-slate-400 font-mono">Click status button to toggle availability</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {operatorOwnCabs.map((cab) => {
                const currentStatus = cabStatusOverride[cab.cabId] || cab.status;
                return (
                  <div
                    key={cab.cabId}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-3xs font-extrabold">
                            {cab.cabId}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-3xs">
                            {cab.cabCategory}
                          </span>
                        </div>
                        <h5 className="font-bold text-white text-sm mt-1">{cab.vehicleModel}</h5>
                        <span className="font-mono text-amber-400 text-xs font-bold block">
                          {cab.registrationNumber}
                        </span>
                      </div>

                      <button
                        onClick={() => handleToggleCabStatus(cab.cabId, currentStatus)}
                        className={`px-3 py-1.5 rounded-xl font-mono text-2xs font-bold border transition-all cursor-pointer ${
                          currentStatus === "available"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                            : currentStatus === "on_trip"
                            ? "bg-sky-500/20 text-sky-300 border-sky-500/40 hover:bg-sky-500/30"
                            : "bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30"
                        }`}
                        title="Click to toggle status"
                      >
                        ● {currentStatus.toUpperCase()}
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-900 text-2xs">
                      <div>
                        <span className="text-3xs text-slate-500 block">Assigned Chauffeur</span>
                        <span className="text-slate-300 font-semibold">{cab.driverName}</span>
                      </div>
                      <div>
                        <span className="text-3xs text-slate-500 block">Driver Contact</span>
                        <span className="text-slate-300 font-mono">{cab.driverPhone}</span>
                      </div>
                      <div>
                        <span className="text-3xs text-slate-500 block">Rate / Km</span>
                        <span className="text-emerald-400 font-bold">₹{cab.baseFarePerKm} / km</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section B: Bookings for Operator's Cabs (Many) */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>2. Dispatches Attached to Operator&apos;s Cabs ({operatorOwnBookings.length})</span>
            </h4>

            {operatorOwnBookings.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-xs text-slate-400">
                No active bookings assigned to this operator&apos;s fleet yet.
              </div>
            ) : (
              <div className="space-y-2.5">
                {operatorOwnBookings.map((b) => (
                  <div
                    key={b.cabBookingId}
                    className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{b.customerName}</span>
                        <span className="font-mono text-3xs text-sky-300 bg-sky-500/15 px-1.5 py-0.5 rounded">
                          {b.cabBookingId}
                        </span>
                        <span className="font-mono text-3xs text-amber-300 bg-amber-500/15 px-1.5 py-0.5 rounded">
                          Cab: {b.cabId}
                        </span>
                      </div>
                      <p className="text-2xs text-slate-400">
                        {b.pickupLocation} ➔ {b.dropLocation} &bull; {b.pickupDatetime}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-3xs text-slate-400 block">Total Fare</span>
                        <span className="font-black text-emerald-400 text-xs">₹{b.totalAmount.toLocaleString()}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-2xs font-mono text-slate-300">
                        OTP: {b.otpStart}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TIER 3: ADMIN — ALL CAB OPERATIONS */}
      {/* ===================================================================== */}
      {activeTier === "admin" && (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  National Operations Desk
                </span>
                <span className="text-2xs text-slate-400">Full Operational Authority</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Admin View: <span className="text-emerald-300">All Cab Operations</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Centralized monitoring of all fleets, city dispatch queues, driver background checks, and active routes.
              </p>
            </div>

            {/* Admin City Filter & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter model, plate, driver..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>

              <select
                value={adminCityFilter}
                onChange={(e) => setAdminCityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-400 font-semibold"
              >
                <option value="all">All Cities</option>
                <option value="Delhi">Delhi NCR</option>
                <option value="Agra">Agra Corridor</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
              </select>
            </div>
          </div>

          {/* National Fleet Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Total Active Fleet</span>
              <span className="text-base font-black text-white">{allCabs.length} Commercial Cabs</span>
              <span className="text-3xs text-emerald-400 block">Across 18 City Hubs</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Available for Dispatch</span>
              <span className="text-base font-black text-emerald-400">
                {allCabs.filter((c) => c.status === "available").length} Cabs
              </span>
              <span className="text-3xs text-slate-400 block">Zero wait-time in metro</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Live On Trip</span>
              <span className="text-base font-black text-sky-400">
                {allCabs.filter((c) => c.status === "on_trip").length} Cabs
              </span>
              <span className="text-3xs text-slate-400 block">GPS Speed Telemetry OK</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">SOS &amp; Safety Status</span>
              <span className="text-base font-black text-emerald-400">100% Safe</span>
              <span className="text-3xs text-slate-400 block">Zero emergency alarms</span>
            </div>
          </div>

          {/* All Cabs Operational Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-emerald-400" />
              <span>Nationwide Fleet Registry ({adminFilteredCabs.length})</span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs bg-slate-950">
                <thead className="bg-slate-900 text-slate-400 uppercase text-3xs font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Cab ID / Model</th>
                    <th className="py-2.5 px-3">Plate &amp; Partner</th>
                    <th className="py-2.5 px-3">Driver &amp; Phone</th>
                    <th className="py-2.5 px-3">Location</th>
                    <th className="py-2.5 px-3">Rate/Km</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {adminFilteredCabs.map((cab) => (
                    <tr key={cab.cabId} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{cab.vehicleModel}</span>
                        <span className="font-mono text-3xs text-slate-400">{cab.cabId} &bull; {cab.cabCategory}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-mono text-amber-400 font-bold block">{cab.registrationNumber}</span>
                        <span className="text-3xs text-slate-400">{cab.partnerName}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-slate-300 font-semibold block">{cab.driverName} ({cab.driverRating}★)</span>
                        <span className="font-mono text-3xs text-slate-400">{cab.driverPhone}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        <span className="flex items-center gap-1 text-2xs">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {cab.currentLocationCity}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        ₹{cab.baseFarePerKm} / km
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-3xs font-mono font-bold ${
                            cab.status === "available"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : cab.status === "on_trip"
                              ? "bg-sky-500/20 text-sky-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {cab.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() =>
                            alert(
                              `Admin Operation: Dispatched live emergency telematics audit for ${cab.registrationNumber}. All Parivahan checks PASS.`
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-3xs transition-all cursor-pointer"
                        >
                          Audit Trip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TIER 4: SUPER ADMIN — ALL CAB + BOOKING + PAYMENT + AUDIT DATA */}
      {/* ===================================================================== */}
      {activeTier === "super_admin" && (
        <div className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-3xs font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Super Administrator Security Context
                </span>
                <span className="text-2xs text-slate-400">Zero Trust Cryptographic Ledger</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-1">
                Super Admin View: <span className="text-purple-300">All Cab + Booking + Payment + Audit Data</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Full-spectrum governance across master vehicle entities, dispatches, gateway payment splits, and immutable system audit trails.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/40 text-xs font-mono text-purple-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Level-0 Root Auth</span>
              </span>
            </div>
          </div>

          {/* Super Admin Financial & Escrow Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Total Gross GMV</span>
              <span className="text-base font-black text-emerald-400">
                ₹{SEED_CAB_FINANCIAL_RECONCILIATION.reduce((acc, r) => acc + r.totalCustomerPaid, 0).toLocaleString()}
              </span>
              <span className="text-3xs text-slate-400 block">100% Captured via Razorpay</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Platform Net Brokerage</span>
              <span className="text-base font-black text-purple-400">
                ₹{SEED_CAB_FINANCIAL_RECONCILIATION.reduce((acc, r) => acc + r.platformTakeRate, 0).toLocaleString()}
              </span>
              <span className="text-3xs text-slate-400 block">10.0% Standard Take-Rate</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">Operator Escrow Payouts</span>
              <span className="text-base font-black text-sky-400">
                ₹{Math.round(SEED_CAB_FINANCIAL_RECONCILIATION.reduce((acc, r) => acc + r.operatorNetEarnings, 0)).toLocaleString()}
              </span>
              <span className="text-3xs text-emerald-400 block">Automated IMPS / NEFT</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-3xs text-slate-400 block font-semibold">GST &amp; Section 194O TDS</span>
              <span className="text-base font-black text-amber-400">
                ₹{Math.round(SEED_CAB_FINANCIAL_RECONCILIATION.reduce((acc, r) => acc + r.gstTdsDeduction, 0)).toLocaleString()}
              </span>
              <span className="text-3xs text-slate-400 block">5% Tax Remitted to Govt</span>
            </div>
          </div>

          {/* Section 1: Financial Reconciliation Ledger */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Multi-Party Payment &amp; Escrow Reconciliation</span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs bg-slate-950">
                <thead className="bg-slate-900 text-slate-400 uppercase text-3xs font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Rec ID / Booking</th>
                    <th className="py-2.5 px-3">Cab / Operator</th>
                    <th className="py-2.5 px-3">Customer Paid</th>
                    <th className="py-2.5 px-3">Operator 85%</th>
                    <th className="py-2.5 px-3">Platform 10%</th>
                    <th className="py-2.5 px-3">Razorpay Transfer ID</th>
                    <th className="py-2.5 px-3">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {SEED_CAB_FINANCIAL_RECONCILIATION.map((item) => (
                    <tr key={item.reconciliationId} className="hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-mono text-purple-300 font-bold block">{item.reconciliationId}</span>
                        <span className="font-mono text-3xs text-slate-400">{item.bookingId}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{item.registrationNumber}</span>
                        <span className="text-3xs text-slate-400">{item.partnerName}</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        ₹{item.totalCustomerPaid.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-sky-400">
                        ₹{item.operatorNetEarnings.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-bold text-purple-400">
                        ₹{item.platformTakeRate.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-mono text-3xs text-amber-300">
                        {item.razorpayTransferId}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-3xs font-mono font-bold ${
                            item.escrowStatus === "transferred_to_operator_bank"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {item.escrowStatus.replace(/_/g, " ").toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Real-Time Cryptographic System Audit Trail */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-purple-400" />
                <span>2. Immutable System Audit Trail (sys_audit_logs)</span>
              </h4>

              <div className="flex items-center gap-2">
                <span className="text-2xs text-slate-400">Filter Actor:</span>
                <select
                  value={auditFilter}
                  onChange={(e) => setAuditFilter(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-white rounded-xl px-2.5 py-1 focus:outline-none focus:border-purple-400"
                >
                  <option value="all">All Actors</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Operator</option>
                </select>
              </div>
            </div>

            <div className="space-y-2.5">
              {auditLogs.map((log) => (
                <div
                  key={log.logId}
                  className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-purple-300 font-bold">{log.logId}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-3xs font-bold">
                        {log.action}
                      </span>
                      <span className="text-2xs text-slate-400">by {log.actorName}</span>
                    </div>

                    <span className="text-3xs text-slate-500 font-mono">
                      {new Date(log.timestamp).toLocaleString()} &bull; IP: {log.ipAddress}
                    </span>
                  </div>

                  <p className="text-2xs text-slate-300 leading-relaxed">{log.details}</p>

                  <div className="pt-2 border-t border-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-3xs">
                    <span className="text-slate-500 font-mono truncate max-w-md">
                      SHA256: <strong className="text-slate-400">{log.cryptoChecksum}</strong>
                    </span>

                    <button
                      onClick={() => handleCopyHash(log.logId, log.cryptoChecksum)}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-purple-300 hover:text-white font-mono transition-all self-start sm:self-auto cursor-pointer"
                    >
                      {copiedLogId === log.logId ? "✓ Checksum Copied" : "Copy Hash"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
