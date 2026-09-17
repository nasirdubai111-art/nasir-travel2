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
} from "lucide-react";
import { HouseboatFunnelModal } from "../houseboats/HouseboatFunnelModal";
import { WildlifeSafariExplorer } from "../safari/WildlifeSafariExplorer";
import { CabFleetRelationalModal } from "../cabs/CabFleetRelationalModal";
import { travelVerticalsService } from "../../services/travelVerticalsService";

export function UnifiedVerticalsHierarchyView() {
  const [selectedVertical, setSelectedVertical] = useState<
    "houseboats" | "safari" | "cabs" | "sql_schema" | "rest_api"
  >("houseboats");

  // Sub-modal triggers
  const [isHouseboatModalOpen, setIsHouseboatModalOpen] = useState(false);
  const [isCabModalOpen, setIsCabModalOpen] = useState(false);
  const [preSelectedCabId, setPreSelectedCabId] = useState<string>("CAB-INNOVA-001");

  const houseboats = travelVerticalsService.getHouseboats();
  const houseboatBookings = travelVerticalsService.getHouseboatBookings();
  const safariPackages = travelVerticalsService.getSafariPackages();
  const safariBookings = travelVerticalsService.getSafariBookings();
  const cabs = travelVerticalsService.getCabs();
  const cabBookings = travelVerticalsService.getAllCabBookings();

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
              Houseboats, Wildlife Safari &amp; Cab Verticals
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-3xl">
              Production schema mapping: Houseboat 9-step customer funnel &amp; invoice generation,
              Wildlife Safari packages &amp; permit QR verification, and Cab 1-to-many booking dispatch.
            </p>
          </div>

          {/* Quick Stats Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Houseboats</span>
              <span className="font-bold text-cyan-300">
                {houseboats.length} Vessels • {houseboatBookings.length} Bookings
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Safari</span>
              <span className="font-bold text-emerald-300">
                {safariPackages.length} Pkgs • {safariBookings.length} Permits
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">Cab (1:Many)</span>
              <span className="font-bold text-amber-300">
                {cabs.length} Cabs • {cabBookings.length} Trips
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-800/80 scrollbar-none">
          <button
            onClick={() => setSelectedVertical("houseboats")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedVertical === "houseboats"
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Ship className="w-4 h-4" />
            <span>1. Houseboats &amp; Funnel</span>
          </button>
          <button
            onClick={() => setSelectedVertical("safari")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedVertical === "safari"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <TreePine className="w-4 h-4" />
            <span>2. Wildlife Safari Packages</span>
          </button>
          <button
            onClick={() => setSelectedVertical("cabs")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedVertical === "cabs"
                ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>3. Cab (1) ➔ Cab Bookings (Many)</span>
          </button>
          <button
            onClick={() => setSelectedVertical("sql_schema")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedVertical === "sql_schema"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>PostgreSQL Schema (DDL)</span>
          </button>
          <button
            onClick={() => setSelectedVertical("rest_api")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              selectedVertical === "rest_api"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>REST API Console</span>
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

      {/* 4. POSTGRESQL SCHEMA (DDL) TAB */}
      {selectedVertical === "sql_schema" && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Supabase PostgreSQL Migration (20260918_create_houseboats_safari_cabs.sql)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Primary Keys, Foreign Keys, Indexes and Constraints for Houseboats, Safari, and Cabs
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
    starting_price_per_night NUMERIC(10, 2) NOT NULL,
    ...
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

-- 2. SAFARI PACKAGES & BOOKINGS (8 ATTRIBUTES EACH)
CREATE TABLE public.safari_packages (
    package_id TEXT PRIMARY KEY,
    package_name TEXT NOT NULL,
    national_park TEXT NOT NULL,
    zone TEXT NOT NULL,
    safari_type TEXT NOT NULL,
    vehicle TEXT NOT NULL,
    season_name TEXT NOT NULL,
    total_estimated_price NUMERIC(10, 2) NOT NULL,
    remaining_permits_today INT NOT NULL
);

CREATE TABLE public.safari_bookings (
    booking_id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    safari_package_id TEXT NOT NULL REFERENCES public.safari_packages(package_id),
    safari_date DATE NOT NULL,
    total_passengers INT NOT NULL,
    assigned_vehicle_number TEXT NOT NULL,
    payment_id TEXT NOT NULL,
    booking_status TEXT NOT NULL DEFAULT 'permit_issued',
    ticket_number TEXT NOT NULL UNIQUE,
    qr_code_data TEXT NOT NULL
);

-- 3. CAB (1) -> CAB BOOKINGS (MANY)
CREATE TABLE public.cab (
    cab_id TEXT PRIMARY KEY,
    vehicle_model TEXT NOT NULL,
    registration_number TEXT NOT NULL UNIQUE,
    base_fare_per_km NUMERIC(6, 2) NOT NULL
);

CREATE TABLE public.cab_bookings (
    cab_booking_id TEXT PRIMARY KEY,
    cab_id TEXT NOT NULL REFERENCES public.cab(cab_id) ON DELETE CASCADE, -- 1:Many
    customer_id TEXT NOT NULL,
    pickup_location TEXT NOT NULL,
    drop_location TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    tax_invoice_number TEXT NOT NULL UNIQUE
);`}
          </div>
        </div>
      )}

      {/* 5. REST API CONSOLE TAB */}
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
              { method: "GET", path: "/api/verticals/houseboats/:houseboatId", desc: "Retrieve single vessel with its associated bookings" },
              { method: "POST", path: "/api/verticals/houseboat-bookings", desc: "Execute 9-step funnel completion and generate invoice" },
              { method: "GET", path: "/api/verticals/safari-packages", desc: "Query safari packages by National Park & Zone" },
              { method: "POST", path: "/api/verticals/safari-bookings", desc: "Issue official Forest Department QR Entry Permit" },
              { method: "GET", path: "/api/verticals/cabs", desc: "Retrieve all cabs with 1:many booking relations" },
              { method: "GET", path: "/api/verticals/cabs/:cabId/bookings", desc: "Inspect all attached bookings for 1 specific cab" },
              { method: "POST", path: "/api/verticals/cabs/:cabId/bookings", desc: "Dispatch new booking linked to cab_id" },
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
    </div>
  );
}
