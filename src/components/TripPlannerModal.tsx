import React, { useState } from "react";
import {
  X,
  Compass,
  Sparkles,
  Plane,
  Train,
  Building2,
  Car,
  Landmark,
  UtensilsCrossed,
  Map,
  CheckCircle2,
  Calendar,
  IndianRupee,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Plus,
} from "lucide-react";
import { ServiceCategory, UserProfile } from "../types";
import { MULTI_TRIP_TEMPLATES, MultiTripPlanTemplate } from "../data/travelExperienceData";

interface TripPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookCompletePackage: (pkg: MultiTripPlanTemplate) => void;
  onOpenAIDrawer: () => void;
}

export function TripPlannerModal({
  isOpen,
  onClose,
  onBookCompletePackage,
  onOpenAIDrawer,
}: TripPlannerModalProps) {
  const [selectedTrip, setSelectedTrip] = useState<MultiTripPlanTemplate>(MULTI_TRIP_TEMPLATES[0]);
  const [includedSteps, setIncludedSteps] = useState<Record<string, boolean>>({
    "0": true,
    "1": true,
    "2": true,
    "3": true,
  });

  if (!isOpen) return null;

  const toggleStep = (index: number) => {
    setIncludedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const calculateCustomTotal = () => {
    let sum = 0;
    selectedTrip.steps.forEach((step, idx) => {
      if (includedSteps[idx]) {
        sum += step.cost;
      }
    });
    return sum;
  };

  const getServiceIcon = (cat: ServiceCategory) => {
    switch (cat) {
      case "flights": return <Plane className="w-4 h-4 text-sky-600" />;
      case "trains": return <Train className="w-4 h-4 text-amber-600" />;
      case "hotels": case "resorts": return <Building2 className="w-4 h-4 text-indigo-600" />;
      case "cabs": return <Car className="w-4 h-4 text-cyan-600" />;
      case "pilgrimage": return <Landmark className="w-4 h-4 text-amber-700" />;
      case "dining": return <UtensilsCrossed className="w-4 h-4 text-orange-600" />;
      default: return <Map className="w-4 h-4 text-fuchsia-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-amber-400 font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Multi-Service Journey Planner</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase">
                  All-in-One Booking
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Plan, bundle and book Transit + Stay + Local Cab + Dining in a single checkout
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Selector Bar */}
        <div className="bg-slate-100 px-6 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Curated Itineraries:</span>
            {MULTI_TRIP_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => {
                  setSelectedTrip(tpl);
                  setIncludedSteps({ "0": true, "1": true, "2": true, "3": true });
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTrip.id === tpl.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                }`}
              >
                {tpl.destination.split(",")[0]} ({tpl.duration})
              </button>
            ))}
          </div>

          <button
            onClick={onOpenAIDrawer}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl hover:bg-indigo-100 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Generate Custom AI Plan</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Trip Overview & Modular Steps */}
          <div className="lg:col-span-2 space-y-5">
            {/* Banner Card */}
            <div className="relative rounded-2xl overflow-hidden shadow-sm border border-slate-200">
              <img
                src={selectedTrip.image}
                alt={selectedTrip.title}
                className="w-full h-44 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-5 flex flex-col justify-end text-white">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase w-max mb-1">
                  {selectedTrip.tag}
                </span>
                <h3 className="text-xl font-extrabold text-white leading-tight">
                  {selectedTrip.title}
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  {selectedTrip.destination} • {selectedTrip.duration} • {selectedTrip.theme}
                </p>
              </div>
            </div>

            {/* Inclusions / Highlights */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Included Experiences & Amenities
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedTrip.highlights.map((h, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modular Package Legs / Steps */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Customize Journey Components
                </h4>
                <span className="text-xs text-slate-500">Toggle items to adjust package</span>
              </div>

              <div className="space-y-3">
                {selectedTrip.steps.map((step, idx) => {
                  const isChecked = !!includedSteps[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleStep(idx)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? "bg-white border-indigo-500 shadow-xs"
                          : "bg-slate-100/70 border-slate-200 opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-100 shrink-0">
                          {getServiceIcon(step.service)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-bold text-slate-900 text-xs sm:text-sm">{step.name}</h5>
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              {step.service}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{step.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-bold text-slate-900">
                          ₹{step.cost.toLocaleString("en-IN")}
                        </span>
                        <div className="mt-1">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isChecked
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {isChecked ? "Included" : "Excluded"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Col: Price Summary & 1-Click Checkout */}
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl space-y-4">
              <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
                Unified Booking Summary
              </h4>

              <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Selected Services:</span>
                  <span className="font-bold text-white">
                    {Object.values(includedSteps).filter(Boolean).length} of {selectedTrip.steps.length}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Individual Price Total:</span>
                  <span className="line-through">₹{selectedTrip.totalEstimatedPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>BharatYatra Bundle Discount:</span>
                  <span>-₹2,501</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <p className="text-xs text-slate-400">All-Inclusive Package Price</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-2xl font-black text-amber-400">
                    ₹{calculateCustomTotal().toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs text-slate-400">for entire journey</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onBookCompletePackage(selectedTrip);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all"
              >
                <span>Book Complete Journey</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Single PNR for Flight/Train + Hotel + Cab with 24x7 Trip Concierge</span>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-xs text-indigo-950">
              <h5 className="font-bold text-indigo-900 mb-1">Flexibility Guaranteed</h5>
              <p className="text-slate-600 leading-relaxed">
                Free reschedule up to 24 hours prior to departure. Instant cancellation refund credited directly to BharatYatra wallet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
