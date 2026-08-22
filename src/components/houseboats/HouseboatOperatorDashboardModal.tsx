import React, { useState } from "react";
import {
  X,
  Ship,
  Anchor,
  Compass,
  Calendar,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  Utensils,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  MapPin,
  Percent,
  Download,
  Check,
  RefreshCw,
  Waves,
  LifeBuoy,
  Fuel,
  Wrench,
} from "lucide-react";
import { DETAILED_HOUSEBOATS } from "../../data/houseboatData";

interface HouseboatOperatorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HouseboatOperatorDashboardModal({
  isOpen,
  onClose,
}: HouseboatOperatorDashboardModalProps) {
  if (!isOpen) return null;

  const [selectedHouseboatId, setSelectedHouseboatId] = useState(DETAILED_HOUSEBOATS[0].id);
  const [activeTab, setActiveTab] = useState<
    "overview" | "inventory" | "routes" | "rates" | "meals" | "activities" | "reservations" | "maintenance" | "finance"
  >("overview");

  const currentHouseboat =
    DETAILED_HOUSEBOATS.find((h) => h.id === selectedHouseboatId) || DETAILED_HOUSEBOATS[0];

  // Operator dynamic state for demo
  const [cabinList, setCabinList] = useState(
    currentHouseboat.cabins.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      acTiming: c.acTiming,
      price: c.pricePerNight,
      status: "ACTIVE" as "ACTIVE" | "SOLD_OUT" | "MAINTENANCE",
    }))
  );

  const [surgeMultiplier, setSurgeMultiplier] = useState(1.15);
  const [weekendSurgeActive, setWeekendSurgeActive] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleToggleCabinStatus = (id: string) => {
    setCabinList((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: c.status === "ACTIVE" ? "SOLD_OUT" : c.status === "SOLD_OUT" ? "MAINTENANCE" : "ACTIVE",
            }
          : c
      )
    );
    triggerToast("Cabin inventory status updated successfully!");
  };

  // Mock Bookings Roster for this operator
  const [mockReservations, setMockReservations] = useState([
    {
      id: "HB-RES-9801",
      guestName: "Arun Krishnan",
      guestPhone: "+91 98450 44211",
      pnr: "PNR-HB7721",
      checkIn: "2026-08-25",
      checkOut: "2026-08-26",
      route: "Alleppey Classic Odyssey",
      charterType: "Private Full Boat",
      cabinsCount: 3,
      guestsCount: 6,
      mealPreference: "Non-Veg (Karimeen Feast)",
      specialRequest: "Honeymoon floral deck arrangement",
      amount: 17400,
      paymentStatus: "PAID" as "PAID" | "PENDING",
      boardingStatus: "CONFIRMED" as "CONFIRMED" | "BOARDED" | "COMPLETED",
    },
    {
      id: "HB-RES-9802",
      guestName: "Pooja Malhotra",
      guestPhone: "+91 98112 88400",
      pnr: "PNR-HB7729",
      checkIn: "2026-08-28",
      checkOut: "2026-08-28",
      route: "6-Hour Day Feast Cruise",
      charterType: "Private Full Boat",
      cabinsCount: 2,
      guestsCount: 4,
      mealPreference: "Pure Veg (Kerala Sadhya)",
      specialRequest: "Early boarding at 10:30 AM",
      amount: 10640,
      paymentStatus: "PAID" as "PAID" | "PENDING",
      boardingStatus: "CONFIRMED" as "CONFIRMED" | "BOARDED" | "COMPLETED",
    },
    {
      id: "HB-RES-9803",
      guestName: "Nitin Deshmukh",
      guestPhone: "+91 97654 33110",
      pnr: "PNR-HB7745",
      checkIn: "2026-09-02",
      checkOut: "2026-09-04",
      route: "2-Nights Grand Safari",
      charterType: "Private Full Boat",
      cabinsCount: 3,
      guestsCount: 8,
      mealPreference: "Mixed (Seafood & Veg)",
      specialRequest: "Ayurvedic massage setup on day 2",
      amount: 32500,
      paymentStatus: "PAID" as "PAID" | "PENDING",
      boardingStatus: "CONFIRMED" as "CONFIRMED" | "BOARDED" | "COMPLETED",
    },
  ]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 text-slate-100 rounded-3xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-cyan-500/30">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-cyan-950 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-400/30">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Houseboat PMS &amp; Fleet Operations
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  Reg: {currentHouseboat.portRegistrationNumber}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {currentHouseboat.operatorName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Houseboat Selector */}
            <select
              value={selectedHouseboatId}
              onChange={(e) => setSelectedHouseboatId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-bold text-cyan-300 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              {DETAILED_HOUSEBOATS.map((hb) => (
                <option key={hb.id} value={hb.id}>
                  {hb.name.slice(0, 32)}...
                </option>
              ))}
            </select>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 pt-3 border-b border-slate-800 overflow-x-auto bg-slate-950/60 scrollbar-none">
          {[
            { id: "overview", label: "Fleet Overview", icon: Compass },
            { id: "inventory", label: "Cabins & Inventory", icon: Ship },
            { id: "routes", label: "Routes & Cruising", icon: Waves },
            { id: "rates", label: "Tariff & Surge", icon: DollarSign },
            { id: "meals", label: "Meals & Stock", icon: Utensils },
            { id: "activities", label: "Activities & Addons", icon: Sparkles },
            { id: "reservations", label: "Guest Roster", icon: Users },
            { id: "maintenance", label: "Dry Dock / Block", icon: Wrench },
            { id: "finance", label: "GST & Settlements", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all whitespace-nowrap border-b-2 ${
                  isActive
                    ? "bg-slate-800/80 text-cyan-300 border-cyan-400"
                    : "text-slate-400 hover:text-slate-200 border-transparent hover:bg-slate-800/40"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Toast Notification */}
          {showToast && (
            <div className="p-3 bg-cyan-950 border border-cyan-400 text-cyan-200 rounded-2xl flex items-center justify-between text-xs font-bold animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>{toastMessage}</span>
              </div>
              <button onClick={() => setShowToast(false)} className="text-cyan-400">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-bold">Occupancy Rate</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">88.4%</div>
                  <span className="text-[10px] text-emerald-400 font-bold">+12% vs last month</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-bold">Average Charter Rate</span>
                    <DollarSign className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">
                    ₹{currentHouseboat.startingPricePerNight.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[10px] text-cyan-300 font-bold">Per night base</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-bold">Monthly GMV</span>
                    <DollarSign className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-white">₹4,82,500</div>
                  <span className="text-[10px] text-teal-300 font-bold">28 confirmed cruises</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center justify-between text-slate-400 mb-1">
                    <span className="text-xs font-bold">Port Compliance</span>
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-cyan-400">IRS Level 1</div>
                  <span className="text-[10px] text-slate-400">Valid till Dec 2027</span>
                </div>
              </div>

              {/* Vessel Specs & Crew */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
                  <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                    <Ship className="w-4 h-4" /> Vessel Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Vessel Name</span>
                      <span className="font-bold text-white">{currentHouseboat.name}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Port Registry ID</span>
                      <span className="font-bold text-cyan-300">{currentHouseboat.portRegistrationNumber}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Total Bedrooms</span>
                      <span className="font-bold text-white">{currentHouseboat.totalBedrooms} Luxury Bedrooms</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">Max Passenger Capacity</span>
                      <span className="font-bold text-white">{currentHouseboat.maxGuestCapacity || 9} Passengers</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-cyan-200">
                    <span className="font-bold">Hull &amp; Architecture: </span>
                    {currentHouseboat.boatTypeDescription}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
                  <h3 className="text-sm font-black text-cyan-300 flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4" /> Assigned Onboard Crew &amp; Safety
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-cyan-400 font-bold block">Certified Master Captain</span>
                        <span className="font-bold text-white">{currentHouseboat.captainBio?.name || "Captain Sasi Kumar V."}</span>
                        <span className="text-[10px] text-slate-400 block">
                          License: {currentHouseboat.captainBio?.licenseNumber || "KIV-MST-2011-884"} • {currentHouseboat.captainBio?.experienceYears || 18} Yrs Exp.
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-400/30">
                        Active on Board
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-teal-400 font-bold block">Executive Master Chef</span>
                        <span className="font-bold text-white">Chef Shaji Varghese (Traditional Kerala Karimeen Specialist)</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold text-[10px] border border-teal-400/30">
                        FSSAI Certified
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">Engine &amp; Deck Master</span>
                        <span className="font-bold text-white">Anil Kumar (IRS Life-saving &amp; Fire certified)</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-400/30">
                        Life-Guard Trained
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVENTORY */}
          {activeTab === "inventory" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Cabin Inventory &amp; Live Status</h3>
                  <p className="text-xs text-slate-400">
                    Manage individual bedroom allocations or toggle maintenance blocks
                  </p>
                </div>
                <button
                  onClick={() => triggerToast("New cabin specification draft created")}
                  className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Cabin
                </button>
              </div>

              <div className="space-y-3">
                {cabinList.map((cabin) => (
                  <div
                    key={cabin.id}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-white text-sm">{cabin.name}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-700 text-cyan-300">
                          {cabin.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>AC Mode: {cabin.acTiming}</span>
                        <span>•</span>
                        <span>Base Night: ₹{cabin.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black border ${
                          cabin.status === "ACTIVE"
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
                            : cabin.status === "SOLD_OUT"
                            ? "bg-rose-500/20 text-rose-300 border-rose-400/30"
                            : "bg-amber-500/20 text-amber-300 border-amber-400/30"
                        }`}
                      >
                        {cabin.status}
                      </span>

                      <button
                        onClick={() => handleToggleCabinStatus(cabin.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <RefreshCw className="w-3 h-3" /> Toggle State
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ROUTES & CRUISING */}
          {activeTab === "routes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Cruise Routes &amp; Canal Itineraries</h3>
                  <p className="text-xs text-slate-400">
                    Starting point jetty, canal waypoints, and government mandated 5:30 PM anchoring stops
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {currentHouseboat.routes.map((route) => (
                  <div key={route.id} className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700 pb-3">
                      <div>
                        <h4 className="text-sm font-black text-cyan-300">{route.name}</h4>
                        <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          <span>Boarding: {route.startPoint}</span>
                          <span>→</span>
                          <span>Disembark: {route.endPoint}</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold">
                        {route.cruiseDuration}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Hourly Timetable &amp; Cruising Waypoints
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {route.itinerary.map((item, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <div className="flex items-center justify-between">
                              <span className="font-black text-cyan-400">{item.time}</span>
                              <span className="font-bold text-white text-[11px]">{item.title}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{item.activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: RATES & SURGE */}
          {activeTab === "rates" && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-4">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-cyan-400" /> Dynamic Pricing &amp; Weekend Surge Rules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 block">Weekend Surge Multiplier</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="1.0"
                        max="1.5"
                        step="0.05"
                        value={surgeMultiplier}
                        onChange={(e) => setSurgeMultiplier(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <span className="font-black text-cyan-300 font-mono">+{Math.round((surgeMultiplier - 1) * 100)}%</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block">Applies on Friday &amp; Saturday departures</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 block">Port Environmental Safety Levy</label>
                    <input
                      type="number"
                      defaultValue={250}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500 block">Kerala Port / Dal Lake Conservation Fund</span>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 block">Applicable GST Tax Rate</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold focus:outline-none">
                      <option value="12">12% GST (SAC 996311 / 996412)</option>
                      <option value="5">5% GST (Composition Scheme)</option>
                      <option value="18">18% GST (Luxury Houseboat)</option>
                    </select>
                    <span className="text-[10px] text-slate-500 block">Auto-calculated in B2B Tax Invoices</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => triggerToast("Tariff & surge rules applied successfully to live booking engine!")}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                  >
                    Save Rate Parameters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MEALS */}
          {activeTab === "meals" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Culinary Menu &amp; Provisioning</h3>
                  <p className="text-xs text-slate-400">
                    Master chef live catch procurement and meal plan specifications
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <h4 className="text-xs font-black text-cyan-300 uppercase">Included Meal Courses</h4>
                  <ul className="space-y-2 text-xs">
                    {currentHouseboat.diningHighlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-200">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <h4 className="text-xs font-black text-teal-300 uppercase">Daily Fresh Inventory</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                      <span>Pearl Spot Fish (Karimeen Fresh Catch)</span>
                      <span className="font-bold text-emerald-400">12 Portions Ready</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                      <span>Tiger Prawns (Jumbo Marinated)</span>
                      <span className="font-bold text-emerald-400">8 Portions Ready</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                      <span>Fresh Tender Coconuts (Welcome Drinks)</span>
                      <span className="font-bold text-emerald-400">25 Units Stocked</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                      <span>Organic Banana Leaf Platter Stock</span>
                      <span className="font-bold text-emerald-400">50 Leaves</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITIES */}
          {activeTab === "activities" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white">Experiential Addons &amp; Equipment Inventory</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Village Row-Canoe Guide</span>
                    <span className="font-black text-cyan-400">₹950 / tour</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Hand-rowed canoe exploring narrow interior village canals.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-bold block">3 Boatmen On-Call</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Angling Rods &amp; Bait Kit</span>
                    <span className="font-black text-cyan-400">₹650 / session</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Traditional cane rods with master chef preparation of live catch.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-bold block">6 Rods Available</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Onboard Ayurvedic Foot Massage</span>
                    <span className="font-black text-cyan-400">₹1,800 / person</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ayurvedic therapist offering relaxation sessions while cruising.
                  </p>
                  <span className="text-[10px] text-cyan-300 font-bold block">Prior Booking Required</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Chauffeur Jetty Transfer (Cochin)</span>
                    <span className="font-black text-cyan-400">₹2,400 / trip</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    AC Sedan airport / railway station direct pickup to boat jetty.
                  </p>
                  <span className="text-[10px] text-emerald-400 font-bold block">Partner Cab Fleet</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: RESERVATIONS */}
          {activeTab === "reservations" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white">Active Guest Roster &amp; Boarding Manifest</h3>
                  <p className="text-xs text-slate-400">
                    Live reservations with dietary preferences, special requests, and payment settlement
                  </p>
                </div>
                <button
                  onClick={() => triggerToast("Guest manifest exported to PDF for Port Authority check")}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Export Manifest
                </button>
              </div>

              <div className="space-y-3">
                {mockReservations.map((res) => (
                  <div
                    key={res.id}
                    className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-sm">{res.guestName}</span>
                          <span className="font-mono text-xs text-cyan-300 font-bold">{res.pnr}</span>
                        </div>
                        <span className="text-xs text-slate-400">{res.guestPhone} • {res.guestsCount} Guests</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-black">
                          {res.paymentStatus} (₹{res.amount.toLocaleString("en-IN")})
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-xs font-black">
                          {res.boardingStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Cruise Route &amp; Dates</span>
                        <span className="font-bold">{res.route} ({res.checkIn})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Meal Preference</span>
                        <span className="font-bold text-amber-300">{res.mealPreference}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Special Request</span>
                        <span className="font-bold text-cyan-200">{res.specialRequest}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: MAINTENANCE */}
          {activeTab === "maintenance" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" /> Dry Dock Maintenance &amp; Calendar Block Dates
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <h4 className="font-black text-cyan-300">Engine &amp; Hull Inspection Schedule</h4>
                  <div className="space-y-2 text-slate-300">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                      <span>Engine Oil &amp; Fuel Filter Service</span>
                      <span className="font-bold text-emerald-400">Completed 12 Aug 2026</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                      <span>Bio-Digester Tank Sanitization</span>
                      <span className="font-bold text-emerald-400">Completed 18 Aug 2026</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex justify-between">
                      <span>Annual Dry Dock Hull Oiling &amp; Coir Sealing</span>
                      <span className="font-bold text-amber-400">Due Nov 15, 2026</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                  <h4 className="font-black text-cyan-300">Block Dates for Private Events / Repairs</h4>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white block">15 Nov 2026 - 18 Nov 2026</span>
                        <span className="text-[10px] text-slate-400">Annual Hull Coir Inspection</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-bold">
                        Blocked
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast("Date range blocked on customer search calendar")}
                    className="w-full py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs"
                  >
                    + Block Custom Date Range
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: FINANCE & GST */}
          {activeTab === "finance" && (
            <div className="space-y-4">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" /> GSTR Compliance &amp; Bank Settlements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Total Taxable Value (This Month)</span>
                  <span className="text-lg font-black text-white">₹4,30,800</span>
                  <span className="text-[10px] text-cyan-300 block">SAC Code 996412 / 996311</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Total GST Collected (12%)</span>
                  <span className="text-lg font-black text-emerald-400">₹51,700</span>
                  <span className="text-[10px] text-slate-400 block">CGST ₹25,850 • SGST ₹25,850</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-1">
                  <span className="text-[10px] text-slate-400 block">Platform Commission (8%)</span>
                  <span className="text-lg font-black text-teal-300">₹34,464</span>
                  <span className="text-[10px] text-slate-400 block">Net Payout to Bank: ₹3,96,336</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">Download GSTR-1 Automated Tax Schedule</h4>
                  <p className="text-[11px] text-slate-400">Includes all B2B invoices with customer GSTINs</p>
                </div>
                <button
                  onClick={() => triggerToast("GSTR-1 JSON and CSV schedule downloaded")}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Tax Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Sync with India Travel Central Booking Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
