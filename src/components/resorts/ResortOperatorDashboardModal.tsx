import React, { useState } from "react";
import {
  X,
  Palmtree,
  Calendar,
  DollarSign,
  TrendingUp,
  BedDouble,
  Package,
  Compass,
  Users,
  CheckCircle2,
  AlertCircle,
  FileText,
  Percent,
  Settings,
  Sparkles,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import { UnifiedResortItem } from "../../types";
import { RESORTS_DATABASE } from "../../data/resortData";

interface ResortOperatorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ResortOperatorDashboardModal({
  isOpen,
  onClose,
}: ResortOperatorDashboardModalProps) {
  if (!isOpen) return null;

  const [selectedResortId, setSelectedResortId] = useState<string>(
    RESORTS_DATABASE[0]?.id || "resort-kumarakom"
  );
  const [activeTab, setActiveTab] = useState<
    "overview" | "inventory" | "rates" | "packages" | "activities" | "reservations" | "gst"
  >("overview");

  const currentResort =
    RESORTS_DATABASE.find((r) => r.id === selectedResortId) || RESORTS_DATABASE[0];

  // Operator dynamic state for rooms
  const [roomInventory, setRoomInventory] = useState(
    currentResort.roomTypes.map((rt) => ({
      id: rt.id,
      name: rt.name,
      unitsTotal: rt.totalInventory || 8,
      unitsBooked: Math.max(1, (rt.totalInventory || 8) - (rt.availableInventory || 2)),
      basePrice: rt.ratePlans[0]?.pricePerNight || 18500,
      status: "ACTIVE" as "ACTIVE" | "SOLD_OUT" | "PAUSED",
    }))
  );

  // Mock Active Bookings List
  const [reservations, setReservations] = useState([
    {
      id: "BK-RES-982141",
      guestName: "Nasir Khan",
      roomType: currentResort.roomTypes[0]?.name || "Luxury Lake Villa",
      checkIn: "2026-09-15",
      checkOut: "2026-09-18",
      nights: 3,
      guests: 2,
      package: "Kumarakom Royal Honeymoon Retreat",
      amount: 72450,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      specialRequest: "Honeymoon bed decoration, quiet sunset view",
    },
    {
      id: "BK-RES-982142",
      guestName: "Meera & Rajesh Sharma",
      roomType: currentResort.roomTypes[1]?.name || "Heritage Pool Villa",
      checkIn: "2026-09-16",
      checkOut: "2026-09-20",
      nights: 4,
      guests: 4,
      package: "Ayurvedic Rejuvenation & Detox",
      amount: 114200,
      status: "CHECKED_IN",
      paymentStatus: "PAID",
      specialRequest: "Ayurveda consultation scheduled for 4 PM",
    },
    {
      id: "BK-RES-982143",
      guestName: "Arjun Verma",
      roomType: currentResort.roomTypes[0]?.name || "Luxury Lake Villa",
      checkIn: "2026-09-19",
      checkOut: "2026-09-21",
      nights: 2,
      guests: 2,
      package: "Standard EP Stay",
      amount: 41300,
      status: "UPCOMING",
      paymentStatus: "PAY_AT_RESORT",
      specialRequest: "Airport transfer pickup at COK Terminal 3",
    },
  ]);

  const totalOccupancyPercent = 78;
  const averageDailyRate = 22400;
  const monthRevenue = 3450000;
  const sacGstCollected = Math.round(monthRevenue * 0.18);

  const toggleRoomStatus = (roomId: string) => {
    setRoomInventory((prev) =>
      prev.map((r) => {
        if (r.id === roomId) {
          const nextStatus = r.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          return { ...r, status: nextStatus };
        }
        return r;
      })
    );
  };

  return (
    <div
      id="resort-operator-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div
        id="resort-operator-modal-container"
        className="bg-slate-900 border border-teal-500/30 rounded-3xl w-full max-w-6xl max-h-[92vh] flex flex-col text-slate-100 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-950/90 border-b border-teal-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30">
              <Palmtree className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white">
                  Resort Operator Portal &amp; PMS Dashboard
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 border border-teal-400/30 text-[10px] font-bold">
                  Operator Management
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manage inventory, seasonal tariffs, curated packages, activities, and SAC 996311 GST compliance
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Property Selector */}
            <select
              value={selectedResortId}
              onChange={(e) => setSelectedResortId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-teal-300 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none"
            >
              {RESORTS_DATABASE.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.city})
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2.5 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview & Analytics" },
            { id: "inventory", label: "Villa Inventory & Allotment" },
            { id: "rates", label: "Rate Plans & Weekend Surge" },
            { id: "packages", label: "Curated Packages" },
            { id: "activities", label: "Activities & Spa Slots" },
            { id: "reservations", label: `Guest Bookings (${reservations.length})` },
            { id: "gst", label: "SAC 996311 Tax & Settlements" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? "bg-teal-500 text-slate-950 font-black shadow-md"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Occupancy Rate</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{totalOccupancyPercent}%</div>
                  <p className="text-[11px] text-emerald-400">+6.4% vs last month</p>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Average Daily Rate (ADR)</span>
                    <DollarSign className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    ₹{averageDailyRate.toLocaleString("en-IN")}
                  </div>
                  <p className="text-[11px] text-teal-300">Target: ₹20,000</p>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>Monthly Gross GMV</span>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white font-mono">
                    ₹{(monthRevenue / 100000).toFixed(1)} Lakhs
                  </div>
                  <p className="text-[11px] text-slate-400">142 total bookings</p>
                </div>

                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 space-y-1">
                  <div className="flex items-center justify-between text-slate-400 text-xs">
                    <span>GST SAC 996311 (18%)</span>
                    <FileText className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-black text-teal-300 font-mono">
                    ₹{(sacGstCollected / 100000).toFixed(2)}L
                  </div>
                  <p className="text-[11px] text-emerald-400">Auto-Filed Ready</p>
                </div>
              </div>

              {/* Property Details Snapshot */}
              <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold text-white">{currentResort.name}</h3>
                  <span className="text-xs text-teal-300">{currentResort.resortStyle}</span>
                </div>
                <p className="text-xs text-slate-300">{currentResort.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-2">
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Concierge Phone</span>
                    <span className="font-mono text-teal-300">{currentResort.conciergeContact.phone}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Manager In-Charge</span>
                    <span className="text-white font-bold">{currentResort.conciergeContact.managerName}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Operator Legal Entity</span>
                    <span className="text-slate-200 font-mono">GST: 32AABCR9912E1Z8</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY & ALLOTMENT */}
          {activeTab === "inventory" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Live Villa &amp; Room Inventory Allocation</h3>
                  <p className="text-xs text-slate-400">
                    Control real-time availability and block dates for maintenance or private VIP buyouts
                  </p>
                </div>
                <button className="px-3.5 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Room Category</span>
                </button>
              </div>

              <div className="space-y-3">
                {roomInventory.map((room) => (
                  <div
                    key={room.id}
                    className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1 text-center sm:text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{room.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            room.status === "ACTIVE"
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-rose-500/20 text-rose-400"
                          }`}
                        >
                          {room.status}
                        </span>
                      </div>
                      <p className="text-slate-400">
                        Total Units: <strong>{room.unitsTotal}</strong> • Booked:{" "}
                        <strong className="text-teal-300">{room.unitsBooked}</strong> • Available:{" "}
                        <strong className="text-emerald-400">{room.unitsTotal - room.unitsBooked}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Base Night Tariff</span>
                        <span className="font-mono font-bold text-white text-sm">
                          ₹{room.basePrice.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleRoomStatus(room.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                          room.status === "ACTIVE"
                            ? "bg-slate-700 hover:bg-slate-600 text-slate-200"
                            : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                        }`}
                      >
                        {room.status === "ACTIVE" ? "Pause Sales" : "Resume Sales"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RATE PLANS & SURGE */}
          {activeTab === "rates" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">Dynamic Pricing &amp; Meal Plans Configuration</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Weekend &amp; Peak Season Surge Rules
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900">
                      <span>Friday &amp; Saturday Night Surge</span>
                      <span className="font-mono text-teal-300 font-bold">+15% Auto-Applied</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900">
                      <span>Diwali &amp; New Year Festive Block</span>
                      <span className="font-mono text-teal-300 font-bold">+30% Auto-Applied</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900">
                      <span>Monsoon Kerala Ayurveda Special</span>
                      <span className="font-mono text-emerald-400 font-bold">-10% Promo Rebate</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-3">
                  <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
                    Meal Plan Tariffs (EP / CP / MAP / AP)
                  </h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                      <span>EP (Room Only)</span>
                      <span className="text-slate-300">Base Tariff</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                      <span>CP (With Buffet Breakfast)</span>
                      <span className="text-teal-300">+₹2,000 / night</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                      <span>MAP (Breakfast + Dinner)</span>
                      <span className="text-teal-300">+₹4,500 / night</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900">
                      <span>AP (All 3 Meals + Hi-Tea)</span>
                      <span className="text-teal-300">+₹7,000 / night</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CURATED PACKAGES */}
          {activeTab === "packages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">
                  Curated Packages &amp; Stay Upgrade Offers ({currentResort.curatedPackages.length})
                </h3>
                <button className="px-3 py-1 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs">
                  + Create New Package
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentResort.curatedPackages.map((pkg) => (
                  <div key={pkg.id} className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{pkg.name}</span>
                      <span className="text-xs font-mono font-bold text-teal-300">
                        +₹{pkg.priceDeltaPerNight.toLocaleString("en-IN")}/nt
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{pkg.description}</p>
                    <div className="pt-2 text-[10px] text-teal-400">
                      <strong>Inclusions:</strong> {pkg.inclusions.join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITIES */}
          {activeTab === "activities" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">
                Resort Experiences &amp; Spa Slot Allocation ({currentResort.resortActivities.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentResort.resortActivities.map((act) => (
                  <div key={act.id} className="bg-slate-800/40 p-3 rounded-2xl border border-slate-700 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{act.title}</span>
                      <span className="text-[10px] text-teal-300">{act.duration}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{act.category}</p>
                    <div className="text-[10px] text-slate-300 font-mono">
                      Slots: {act.slotsAvailable.join(", ")}
                    </div>
                    <div className="text-teal-400 font-bold pt-1">
                      {act.isComplimentary ? "Free for in-house guests" : `₹${act.pricePerPerson} / guest`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RESERVATIONS ROSTER */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Live Guest Reservations Roster</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Search guest or ID..."
                      className="bg-slate-800 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {reservations.map((res) => (
                  <div
                    key={res.id}
                    className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-white text-sm">{res.guestName}</span>
                        <span className="font-mono text-[10px] bg-slate-900 text-teal-300 px-2 py-0.5 rounded">
                          {res.id}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            res.status === "CONFIRMED"
                              ? "bg-teal-500/20 text-teal-300"
                              : res.status === "CHECKED_IN"
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-amber-500/20 text-amber-300"
                          }`}
                        >
                          {res.status}
                        </span>
                      </div>
                      <p className="text-slate-400">
                        {res.roomType} • {res.checkIn} to {res.checkOut} ({res.nights} Nights, {res.guests} Guests)
                      </p>
                      {res.specialRequest && (
                        <p className="text-[11px] text-amber-300 font-medium">★ Note: {res.specialRequest}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Total Tariff</span>
                        <span className="font-mono font-bold text-white">₹{res.amount.toLocaleString("en-IN")}</span>
                        <span className="text-[10px] text-emerald-400 block font-bold">{res.paymentStatus}</span>
                      </div>

                      <button className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs">
                        Check-in Pass
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: GST & TAX SETTLEMENTS */}
          {activeTab === "gst" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white">SAC 996311 GST Invoicing &amp; BSP Settlement</h3>
              <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Hospitality Service Classification</span>
                    <strong className="text-white text-sm">SAC 996311 - Resort &amp; Villa Accommodation Services</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Applicable Tax Rate</span>
                    <strong className="text-teal-300 text-sm">18% GST (9% CGST + 9% SGST)</strong>
                  </div>
                </div>

                <p className="text-slate-300 text-xs leading-relaxed">
                  All guest bookings through the India Travel platform auto-generate compliant B2B/B2C tax invoices under SAC 996311 with verified GSTR-1 output reports and direct weekly BSP bank payouts.
                </p>

                <div className="flex gap-3 pt-2">
                  <button className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs">
                    Download GSTR-1 Report (Excel)
                  </button>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs border border-slate-700">
                    Bank Account Settlement Details
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
