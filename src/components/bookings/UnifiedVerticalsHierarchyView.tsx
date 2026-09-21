import React, { useState } from "react";
import {
  Ship,
  TreePine,
  Car,
  Database,
  ArrowRight,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
  FileText,
  Eye,
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  Search,
  Compass,
  Palmtree,
  Building2,
  UserCheck,
  Star,
  MapPin,
  Clock,
  Bed,
} from "lucide-react";
import { HouseboatFunnelModal } from "../houseboats/HouseboatFunnelModal";
import { WildlifeSafariExplorer } from "../safari/WildlifeSafariExplorer";
import { CabFleetRelationalModal } from "../cabs/CabFleetRelationalModal";
import { TourRelationalHierarchyModal } from "../tours/TourRelationalHierarchyModal";
import { ResortRelationalHierarchyModal } from "../resorts/ResortRelationalHierarchyModal";
import { LodgeFunnelRelationalModal } from "../lodges/LodgeFunnelRelationalModal";
import { Hotel3TierRelationalModal } from "../hotels/Hotel3TierRelationalModal";
import { Customer360HierarchyModal } from "../crm/enterprise/Customer360HierarchyModal";
import { travelVerticalsService } from "../../services/travelVerticalsService";

export function UnifiedVerticalsHierarchyView() {
  const [selectedVertical, setSelectedVertical] = useState<
    | "houseboats"
    | "safari"
    | "cabs"
    | "tours"
    | "resorts"
    | "lodges"
    | "hotels"
    | "customer_360"
    | "sql_schema"
    | "rest_api"
  >("houseboats");

  // Sub-modal triggers
  const [isHouseboatModalOpen, setIsHouseboatModalOpen] = useState(false);
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);
  const [isTourModalOpen, setIsTourModalOpen] = useState(false);
  const [isResortModalOpen, setIsResortModalOpen] = useState(false);
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [isHotelModalOpen, setIsHotelModalOpen] = useState(false);
  const [isCustomer360ModalOpen, setIsCustomer360ModalOpen] = useState(false);

  const [preSelectedCabId, setPreSelectedCabId] = useState<string>("CAB-INNOVA-001");
  const [preSelectedTourId, setPreSelectedTourId] = useState<string>("tour-golden-triangle-01");
  const [preSelectedResortId, setPreSelectedResortId] = useState<string>("RST-KL-KUMARAKOM-01");
  const [preSelectedLodgeId, setPreSelectedLodgeId] = useState<string>("LDG-BANDHAVGARH-01");
  const [preSelectedHotelId, setPreSelectedHotelId] = useState<string>("HTL-DELHI-AEROCITY-01");

  const houseboats = travelVerticalsService.getHouseboats();
  const houseboatBookings = travelVerticalsService.getHouseboatBookings();
  const safariPackages = travelVerticalsService.getSafariPackages();
  const safariBookings = travelVerticalsService.getSafariBookings();
  const cabs = travelVerticalsService.getCabs();
  const cabBookings = travelVerticalsService.getAllCabBookings();

  const tours = travelVerticalsService.getTours();
  const tourBookings = travelVerticalsService.getTourBookings();
  const resorts = travelVerticalsService.getResorts();
  const resortBookings = travelVerticalsService.getResortBookings();
  const lodges = travelVerticalsService.getLodges();
  const lodgeBookings = travelVerticalsService.getLodgeBookings();
  const hotelProperties = travelVerticalsService.getHotelProperties();
  const hotelBookings = travelVerticalsService.getHotelBookings();
  const customer360List = travelVerticalsService.getCustomer360List();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Layers className="w-5 h-5" />
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Relational Architecture &amp; Booking Funnels
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Unified Travel Verticals &amp; Relational Architecture
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Production schema mapping: Houseboats, Wildlife Safari, Cabs (1:Many), Tours, Luxury Resorts, Lodges (8-step funnel), Hotels (3-Tier hierarchy), and Customer 360 CRM.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Houseboats</span>
              <span className="font-bold text-cyan-300">
                {houseboats.length} Vessels • {houseboatBookings.length} Trips
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Safari</span>
              <span className="font-bold text-emerald-300">
                {safariPackages.length} Pkgs • {safariBookings.length} Permits
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Cabs (1:N)</span>
              <span className="font-bold text-amber-300">
                {cabs.length} Cabs • {cabBookings.length} Dispatches
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Tours</span>
              <span className="font-bold text-orange-400">
                {tours.length} Tours • {tourBookings.length} Bookings
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Resorts</span>
              <span className="font-bold text-sky-400">
                {resorts.length} Resorts • {resortBookings.length} Stays
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Lodges</span>
              <span className="font-bold text-teal-400">
                {lodges.length} Lodges • {lodgeBookings.length} Funnels
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Hotels (3-Tier)</span>
              <span className="font-bold text-indigo-400">
                {hotelProperties.length} Props • {hotelBookings.length} Manifests
              </span>
            </div>
            <div className="p-2 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[9px] text-slate-500 block uppercase font-bold">Customer 360</span>
              <span className="font-bold text-purple-400">
                {customer360List.length} Profiles • 7 Sub-Tables
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setSelectedVertical("houseboats")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "houseboats"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Ship className="w-3.5 h-3.5" />
            <span>1. Houseboats</span>
          </button>
          <button
            onClick={() => setSelectedVertical("safari")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "safari"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>2. Safari</span>
          </button>
          <button
            onClick={() => setSelectedVertical("cabs")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "cabs"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>3. Cabs (1:N)</span>
          </button>
          <button
            onClick={() => setSelectedVertical("tours")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "tours"
                ? "bg-orange-500 text-slate-950 font-black shadow-md shadow-orange-500/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>4. Tour ➔ Bookings</span>
          </button>
          <button
            onClick={() => setSelectedVertical("resorts")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "resorts"
                ? "bg-sky-500 text-slate-950 font-black shadow-md shadow-sky-500/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Palmtree className="w-3.5 h-3.5" />
            <span>5. Resort ➔ Bookings</span>
          </button>
          <button
            onClick={() => setSelectedVertical("lodges")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "lodges"
                ? "bg-teal-500 text-slate-950 font-black shadow-md shadow-teal-500/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <TreePine className="w-3.5 h-3.5" />
            <span>6. Lodge (8-Step Funnel)</span>
          </button>
          <button
            onClick={() => setSelectedVertical("hotels")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "hotels"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>7. Hotels (3-Tier)</span>
          </button>
          <button
            onClick={() => setSelectedVertical("customer_360")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "customer_360"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>8. Customer 360</span>
          </button>
          <button
            onClick={() => setSelectedVertical("sql_schema")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "sql_schema"
                ? "bg-slate-700 text-white shadow-md"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>PostgreSQL Schema (DDL)</span>
          </button>
          <button
            onClick={() => setSelectedVertical("rest_api")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
              selectedVertical === "rest_api"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>9. REST API Console</span>
          </button>
        </div>
      </div>

      {/* 1. HOUSEBOATS TAB */}
      {selectedVertical === "houseboats" && (
        <div className="space-y-6 animate-in fade-in">
          {/* Schema & Funnel Summary Box */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Ship className="w-4 h-4 text-cyan-400" />
                  <span>Houseboats Relational Hierarchy &amp; 9-Step Funnel</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Customer ➔ Houseboat Search ➔ Houseboat Details ➔ Select Dates ➔ Guest Details ➔ Booking ➔ Payment ➔ Confirmed Booking ➔ Houseboat Ticket / Invoice
                </p>
              </div>
              <button
                onClick={() => setIsHouseboatModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 cursor-pointer"
              >
                <span>Launch Interactive 9-Step Funnel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Visual Funnel Pathway */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-x-auto">
              <div className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
                {[
                  "Customer",
                  "Houseboat Search",
                  "Houseboat Details",
                  "Select Dates",
                  "Guest Details",
                  "Booking",
                  "Payment",
                  "Confirmed Booking",
                  "Houseboat Ticket / Invoice",
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 text-[11px]">
                      {idx + 1}. {step}
                    </span>
                    {idx < 8 && <span className="text-slate-600 font-bold">➔</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Houseboat Vessels Grid */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Ship className="w-4 h-4 text-cyan-400" />
              <span>Registered Houseboat Vessels (`houseboats` table)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {houseboats.map((hb) => (
                <div
                  key={hb.houseboatId}
                  className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="h-40 rounded-2xl overflow-hidden relative">
                      <img
                        src={hb.image}
                        alt={hb.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[10px] font-mono text-cyan-300 font-bold">
                        {hb.houseboatId}
                      </span>
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-sm">{hb.name}</h5>
                      <p className="text-xs text-slate-400">
                        {hb.destination} • {hb.waterbody}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">Partner ID</span>
                        <span className="font-mono text-purple-300 font-bold">{hb.partnerId}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                        <span className="text-slate-500 block text-[9px] uppercase">Starting Fare</span>
                        <span className="font-bold text-white">₹{hb.startingPricePerNight}/night</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsHouseboatModalOpen(true)}
                    className="w-full py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600 text-cyan-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-cyan-500/30 transition-all"
                  >
                    <span>Reserve via Funnel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings linked with customer_id, partner_id, payment_id */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>
                Persisted Bookings (`houseboat_bookings` with `customer_id`, `partner_id`, `payment_id`)
              </span>
            </h4>

            <div className="space-y-3">
              {houseboatBookings.map((b) => (
                <div
                  key={b.bookingId}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-300">{b.bookingId}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 uppercase">
                        {b.bookingStatus}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400">
                        Ticket: <strong className="font-mono text-white">{b.ticketNumber}</strong>
                      </span>
                      <span className="text-slate-400">
                        Invoice: <strong className="font-mono text-white">{b.taxInvoiceNumber}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">houseboat_id</span>
                      <span className="font-mono text-cyan-300 font-bold">{b.houseboatId}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">customer_id</span>
                      <span className="font-mono text-purple-300 font-bold">{b.customerId}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">partner_id</span>
                      <span className="font-mono text-amber-300 font-bold">{b.partnerId}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block">payment_id</span>
                      <span className="font-mono text-emerald-300 font-bold">{b.paymentId}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[11px] text-slate-300 pt-1">
                    <span>
                      Customer: <strong>{b.customer.name}</strong> • Dates: {b.checkInDate} to {b.checkOutDate}
                    </span>
                    <span className="font-bold text-white text-sm">
                      ₹{b.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. WILDLIFE SAFARI TAB */}
      {selectedVertical === "safari" && (
        <div className="animate-in fade-in">
          <WildlifeSafariExplorer />
        </div>
      )}

      {/* 3. CABS TAB */}
      {selectedVertical === "cabs" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Car className="w-4 h-4 text-amber-400" />
                  <span>Cab Relational Hierarchy: cab (1) ➔ cab_bookings (many)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Each physical taxi vehicle (cab_id) maintains a collection of sequential customer trips
                  and dispatches.
                </p>
              </div>
              <button
                onClick={() => setIsCabModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <span>Inspect 1:Many Cab Dispatches</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tree Structure Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-amber-300">
{`cab
 │
 │ 1
 │
 │ many
 ▼
cab_bookings`}
            </div>
          </div>

          {/* Cabs List with their count of many bookings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cabs.map((cab) => (
              <div
                key={cab.cabId}
                onClick={() => {
                  setPreSelectedCabId(cab.cabId);
                  setIsCabModalOpen(true);
                }}
                className="p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-300">{cab.cabId}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300">
                    {cab.allCabBookingsCount || 0} Trips Attached
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm">{cab.vehicleModel}</h4>
                <p className="text-xs text-slate-400">
                  Plate: <span className="font-mono text-cyan-300">{cab.registrationNumber}</span>
                </p>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-xs">
                  <span className="text-slate-400">Rate/km:</span>
                  <span className="font-bold text-white">₹{cab.baseFarePerKm}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TOURS TAB (tour ➔ tour_bookings) */}
      {selectedVertical === "tours" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Compass className="w-4 h-4 text-orange-400" />
                  <span>Tour Relational Hierarchy: tour (id) ➔ tour_bookings (tour_id, customer_id)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Fixed departure circuits, daily itineraries, and multi-passenger manifests.
                </p>
              </div>
              <button
                onClick={() => setIsTourModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 cursor-pointer"
              >
                <span>Open Tour Booking Funnel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Tree Structure */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-orange-300">
{`tour (id, tour_code, title, destination, itinerary, pricing, availability, operator)
  │
  └──► tour_bookings (booking_reference, tour_id ──► tour.id, customer_id ──► auth.users.id, travel_date, passengers, total_amount)`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map((t) => (
              <div key={t.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-500/20 text-orange-300">
                    {t.tour_code}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    ₹{t.pricing.base_price_adult.toLocaleString("en-IN")}/pax
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{t.title}</h4>
                <p className="text-xs text-slate-400">{t.destination} • {t.duration_days} Days / {t.duration_nights} Nights</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-500 font-mono">Seats left: {t.availability.available_seats}</span>
                  <button
                    onClick={() => {
                      setPreSelectedTourId(t.id);
                      setIsTourModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-500/20 text-orange-300 hover:bg-orange-500 hover:text-slate-950 font-bold text-xs transition"
                  >
                    Book Tour ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. RESORTS TAB (resort ➔ resort_bookings) */}
      {selectedVertical === "resorts" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Palmtree className="w-4 h-4 text-sky-400" />
                  <span>Resort Relational Hierarchy: resort ➔ resort_bookings</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Luxury properties, pool villas, guest manifests, and check-in / check-out dates.
                </p>
              </div>
              <button
                onClick={() => setIsResortModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 cursor-pointer"
              >
                <span>Open Resort Booking Funnel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300">
{`resort (Resort ID, Resort Name, Location, Rooms, Amenities, Images, Pricing, Status)
  │
  └──► resort_bookings (Booking Reference, Resort, Customer, Guest Details, Check-in / Check-out, Room, Amount)`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resorts.map((r) => (
              <div key={r.resort_id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300">
                    {r.resort_id}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    ₹{r.pricing.starting_price_per_night.toLocaleString("en-IN")}/night
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{r.resort_name}</h4>
                <p className="text-xs text-slate-400">{r.location.destination}, {r.location.state}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-500">{r.rooms.length} Luxury Room Categories</span>
                  <button
                    onClick={() => {
                      setPreSelectedResortId(r.resort_id);
                      setIsResortModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500 hover:text-slate-950 font-bold text-xs transition"
                  >
                    Select Villa ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. LODGES TAB (8-Step Customer Funnel) */}
      {selectedVertical === "lodges" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <TreePine className="w-4 h-4 text-teal-400" />
                  <span>Lodge 8-Step Funnel: auth.users ──► lodge_bookings (lodge_id) ──► lodge</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Search ➔ Details ➔ Select Room ➔ Check-in/Out ➔ Guest Details ➔ Payment ➔ Booking Confirmation ➔ Ticket/Invoice
                </p>
              </div>
              <button
                onClick={() => setIsLodgeModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-teal-500/20 cursor-pointer"
              >
                <span>Launch 8-Step Lodge Funnel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-x-auto">
              <div className="flex items-center gap-2 text-xs font-semibold whitespace-nowrap">
                {[
                  "Search",
                  "Details",
                  "Select Room",
                  "Check-in/Out",
                  "Guest Details",
                  "Payment",
                  "Booking Confirmation",
                  "Ticket/Invoice",
                ].map((step, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-teal-300 text-[11px]">
                      {idx + 1}. {step}
                    </span>
                    {idx < 7 && <span className="text-slate-600 font-bold">➔</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lodges.map((l) => (
              <div key={l.lodge_id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300">
                    {l.lodge_id}
                  </span>
                  <span className="text-xs font-bold text-white font-mono">
                    ₹{l.starting_price.toLocaleString("en-IN")}/night
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{l.name}</h4>
                <p className="text-xs text-slate-400">{l.destination} • {l.lodge_type}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-500 font-mono">{l.rooms.length} Chalets available</span>
                  <button
                    onClick={() => {
                      setPreSelectedLodgeId(l.lodge_id);
                      setIsLodgeModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-teal-500/20 text-teal-300 hover:bg-teal-500 hover:text-slate-950 font-bold text-xs transition"
                  >
                    Start 8-Step Funnel ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. HOTELS TAB (HOTELS ➔ HOTELS_ROOMS ➔ HOTELS_BOOKINGS) */}
      {selectedVertical === "hotels" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>Hotels 3-Tier Hierarchy: HOTELS ➔ HOTELS_ROOMS ➔ HOTELS_BOOKINGS</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Tier 1 Hotel Properties • Tier 2 Room Types, Inventory &amp; Pricing • Tier 3 Customer Bookings &amp; Check-ins
                </p>
              </div>
              <button
                onClick={() => setIsHotelModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 cursor-pointer"
              >
                <span>Open 3-Tier Hotel Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-300">
{`HOTELS (hotels.id)
  │
  ▼
HOTELS_ROOMS (hotels_rooms.hotel_id)
  │
  ▼
HOTELS_BOOKINGS (hotel_id, room_id)`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hotelProperties.map((h) => (
              <div key={h.id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300">
                    {h.id}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {h.rating_score}
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{h.property_name}</h4>
                <p className="text-xs text-slate-400">{h.city}, {h.state} • {h.total_rooms_count} Total Rooms</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-500 font-mono">{hotelBookings.filter(b => b.hotel_id === h.id).length} Active Reservations</span>
                  <button
                    onClick={() => {
                      setPreSelectedHotelId(h.id);
                      setIsHotelModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-bold text-xs transition"
                  >
                    Inspect 3-Tier Tables ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. CUSTOMER 360 ARCHITECTURE TAB */}
      {selectedVertical === "customer_360" && (
        <div className="space-y-6 animate-in fade-in">
          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-400" />
                  <span>Customer 360 Architecture: auth.users ──► customers ──► 7 Child Sub-Tables</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Unified identity layer joining profiles, documents, addresses, bookings, payments, tickets, and CRM notes.
                </p>
              </div>
              <button
                onClick={() => setIsCustomer360ModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 cursor-pointer"
              >
                <span>Open Customer 360 Explorer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-300">
{`auth.users
  │
  ▼
customers
  ├── customer_profiles
  ├── customer_documents
  ├── customer_addresses
  ├── bookings
  ├── payments
  ├── tickets
  └── customer_notes / CRM`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer360List.map((c) => (
              <div key={c.customer_id} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300">
                    {c.customer_id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300">
                    {c.profile.loyalty_tier}
                  </span>
                </div>
                <h4 className="font-bold text-white text-base">{c.profile.full_name}</h4>
                <p className="text-xs text-slate-400">{c.profile.email} • {c.profile.phone}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-500 font-mono">
                    Spend: ₹{c.profile.total_lifetime_spend.toLocaleString("en-IN")} • {c.recent_bookings.length} Bookings
                  </span>
                  <button
                    onClick={() => setIsCustomer360ModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-500 font-bold text-xs transition"
                  >
                    View 360 Record ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POSTGRESQL SCHEMA (DDL) TAB */}
      {selectedVertical === "sql_schema" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Supabase PostgreSQL Migration (Complete Relational Verticals &amp; Customer 360)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Primary Keys, Foreign Keys, Indexes, and Constraints for all travel verticals.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
              Ready to Deploy
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-purple-200 overflow-x-auto leading-relaxed max-h-96">
{`-- 1. HOUSEBOATS & BOOKINGS
CREATE TABLE public.houseboats (
    houseboat_id TEXT PRIMARY KEY,
    partner_id TEXT NOT NULL,
    partner_name TEXT NOT NULL,
    name TEXT NOT NULL,
    vessel_registration_number TEXT NOT NULL UNIQUE,
    waterbody TEXT NOT NULL,
    destination TEXT NOT NULL,
    starting_price_per_night NUMERIC(10, 2) NOT NULL
);

CREATE TABLE public.houseboat_bookings (
    booking_id TEXT PRIMARY KEY,
    houseboat_id TEXT NOT NULL REFERENCES public.houseboats(houseboat_id),
    customer_id TEXT NOT NULL,
    partner_id TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    ticket_number TEXT NOT NULL UNIQUE,
    tax_invoice_number TEXT NOT NULL UNIQUE
);

-- 2. TOURS (tour -> tour_bookings)
CREATE TABLE public.tour (
    id TEXT PRIMARY KEY,
    tour_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    itinerary JSONB NOT NULL,
    pricing JSONB NOT NULL,
    availability JSONB NOT NULL,
    operator JSONB NOT NULL
);

CREATE TABLE public.tour_bookings (
    booking_reference TEXT PRIMARY KEY,
    tour_id TEXT NOT NULL REFERENCES public.tour(id),
    customer_id TEXT NOT NULL,
    travel_date DATE NOT NULL,
    passengers JSONB NOT NULL,
    payment_status TEXT NOT NULL,
    booking_status TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL
);

-- 3. RESORTS (resort -> resort_bookings)
CREATE TABLE public.resort (
    resort_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location JSONB NOT NULL,
    rooms JSONB NOT NULL,
    amenities TEXT[] NOT NULL,
    images TEXT[] NOT NULL,
    pricing JSONB NOT NULL,
    status TEXT NOT NULL
);

CREATE TABLE public.resort_bookings (
    booking_reference TEXT PRIMARY KEY,
    resort_id TEXT NOT NULL REFERENCES public.resort(resort_id),
    customer_id TEXT NOT NULL,
    guest_details JSONB NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    room JSONB NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL,
    booking_status TEXT NOT NULL
);

-- 4. LODGES (auth.users -> lodge_bookings (lodge_id) -> lodge)
CREATE TABLE public.lodge (
    lodge_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    destination TEXT NOT NULL,
    region TEXT NOT NULL,
    starting_price NUMERIC(10, 2) NOT NULL,
    rooms JSONB NOT NULL
);

CREATE TABLE public.lodge_bookings (
    booking_reference TEXT PRIMARY KEY,
    lodge_id TEXT NOT NULL REFERENCES public.lodge(lodge_id),
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    nights INT NOT NULL,
    selected_room_id TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT NOT NULL,
    ticket_invoice_number TEXT NOT NULL UNIQUE
);

-- 5. HOTELS 3-TIER HIERARCHY
CREATE TABLE public.hotels (
    id TEXT PRIMARY KEY,
    property_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    total_rooms_count INT NOT NULL
);

CREATE TABLE public.hotels_rooms (
    id TEXT PRIMARY KEY,
    hotel_id TEXT NOT NULL REFERENCES public.hotels(id) ON DELETE CASCADE,
    room_code TEXT NOT NULL,
    room_name TEXT NOT NULL,
    base_price_per_night NUMERIC(10, 2) NOT NULL,
    available_inventory INT NOT NULL
);

CREATE TABLE public.hotels_bookings (
    id TEXT PRIMARY KEY,
    booking_reference TEXT NOT NULL UNIQUE,
    hotel_id TEXT NOT NULL REFERENCES public.hotels(id),
    room_id TEXT NOT NULL REFERENCES public.hotels_rooms(id),
    customer_id TEXT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    tax_invoice_number TEXT NOT NULL UNIQUE
);

-- 6. CUSTOMER 360
CREATE TABLE public.customers (
    customer_id TEXT PRIMARY KEY,
    auth_user_id TEXT NOT NULL UNIQUE,
    profile JSONB NOT NULL,
    documents JSONB NOT NULL,
    addresses JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`}
          </div>
        </div>
      )}

      {/* REST API CONSOLE TAB */}
      {selectedVertical === "rest_api" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Code2 className="w-4 h-4 text-blue-400" />
              <span>Travel Verticals REST Endpoints (`/api/verticals/*`)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Live Express routes powering mobile apps and frontend client integrations
            </p>
          </div>

          <div className="space-y-3">
            {[
              { method: "GET", path: "/api/verticals/houseboats", desc: "List all houseboats filtered by waterbody/destination" },
              { method: "POST", path: "/api/verticals/houseboat-bookings", desc: "Execute 9-step funnel completion and generate invoice" },
              { method: "GET", path: "/api/verticals/tours", desc: "List active circuits and tour departure packages" },
              { method: "POST", path: "/api/verticals/tours/bookings", desc: "Insert tour_bookings record with passengers manifest" },
              { method: "GET", path: "/api/verticals/resorts", desc: "Retrieve luxury resorts with villa inventory" },
              { method: "POST", path: "/api/verticals/resorts/bookings", desc: "Create resort_bookings reservation" },
              { method: "GET", path: "/api/verticals/lodges", desc: "Query eco-lodges with 8-step customer funnel" },
              { method: "POST", path: "/api/verticals/lodges/bookings", desc: "Create lodge_bookings with tax invoice" },
              { method: "GET", path: "/api/verticals/hotels", desc: "Query 3-tier hotel properties and room inventories" },
              { method: "POST", path: "/api/verticals/hotels/bookings", desc: "Create hotels_bookings record linking hotel_id and room_id" },
              { method: "GET", path: "/api/crm/customers/360/:id", desc: "Fetch Customer 360 composite data (profiles, docs, bookings, crm notes)" },
            ].map((ep, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      ep.method === "GET"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                  >
                    {ep.method}
                  </span>
                  <code className="font-mono text-cyan-300 font-bold">{ep.path}</code>
                </div>
                <span className="text-slate-400 text-[11px]">{ep.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <HouseboatFunnelModal
        isOpen={isHouseboatModalOpen}
        onClose={() => setIsHouseboatModalOpen(false)}
      />

      <CabFleetRelationalModal
        isOpen={isCabModalOpen}
        onClose={() => setIsCabModalOpen(false)}
        preSelectedCabId={preSelectedCabId}
      />

      <TourRelationalHierarchyModal
        isOpen={isTourModalOpen}
        onClose={() => setIsTourModalOpen(false)}
        preSelectedTourId={preSelectedTourId}
      />

      <ResortRelationalHierarchyModal
        isOpen={isResortModalOpen}
        onClose={() => setIsResortModalOpen(false)}
        preSelectedResortId={preSelectedResortId}
      />

      <LodgeFunnelRelationalModal
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
        preSelectedLodgeId={preSelectedLodgeId}
      />

      <Hotel3TierRelationalModal
        isOpen={isHotelModalOpen}
        onClose={() => setIsHotelModalOpen(false)}
        preSelectedHotelId={preSelectedHotelId}
      />

      <Customer360HierarchyModal
        isOpen={isCustomer360ModalOpen}
        onClose={() => setIsCustomer360ModalOpen(false)}
      />
    </div>
  );
}
