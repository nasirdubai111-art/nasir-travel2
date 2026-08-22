import React, { useState } from "react";
import {
  X,
  Luggage,
  UtensilsCrossed,
  Coffee,
  Zap,
  ShieldCheck,
  Truck,
  Leaf,
  Plus,
  Check,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  EXTRA_BAGGAGE_OPTIONS,
  INFLIGHT_MEALS,
  FLIGHT_ADDONS_LIST,
  FlightExtendedDeal,
  InFlightMeal,
} from "../../data/flightData";

export interface FlightAddonsSelection {
  selectedBaggageId?: string;
  selectedMeals: Record<number, string>; // passenger index -> meal id
  selectedAddonIds: string[];
}

interface FlightAddonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: FlightExtendedDeal;
  passengerNames: string[];
  initialSelection: FlightAddonsSelection;
  onConfirmAddons: (addons: FlightAddonsSelection, totalAddonCost: number) => void;
}

export function FlightAddonsModal({
  isOpen,
  onClose,
  flight,
  passengerNames,
  initialSelection,
  onConfirmAddons,
}: FlightAddonsModalProps) {
  const [activeTab, setActiveTab] = useState<"baggage" | "meals" | "services">("meals");
  const [activeMealPassenger, setActiveMealPassenger] = useState(0);

  const [selectedBaggageId, setSelectedBaggageId] = useState<string | undefined>(
    initialSelection?.selectedBaggageId
  );
  const [selectedMeals, setSelectedMeals] = useState<Record<number, string>>(
    initialSelection?.selectedMeals || {}
  );
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>(
    initialSelection?.selectedAddonIds || ["addon-zero-cancel"]
  );

  if (!isOpen) return null;

  // Toggle meal for passenger
  const handleToggleMeal = (mealId: string) => {
    if (selectedMeals[activeMealPassenger] === mealId) {
      const copy = { ...selectedMeals };
      delete copy[activeMealPassenger];
      setSelectedMeals(copy);
    } else {
      setSelectedMeals({ ...selectedMeals, [activeMealPassenger]: mealId });
    }
  };

  // Toggle service addon
  const handleToggleAddon = (addonId: string) => {
    if (selectedAddonIds.includes(addonId)) {
      setSelectedAddonIds(selectedAddonIds.filter((id) => id !== addonId));
    } else {
      setSelectedAddonIds([...selectedAddonIds, addonId]);
    }
  };

  // Calculate Total Cost
  const baggageCost = EXTRA_BAGGAGE_OPTIONS.find((b) => b.id === selectedBaggageId)?.price || 0;
  const mealsCost = Object.values(selectedMeals).reduce((acc, mId) => {
    const meal = INFLIGHT_MEALS.find((m) => m.id === mId);
    return acc + (meal ? meal.price : 0);
  }, 0);
  const servicesCost = selectedAddonIds.reduce((acc, aId) => {
    const addon = FLIGHT_ADDONS_LIST.find((a) => a.id === aId);
    return acc + (addon ? addon.price : 0);
  }, 0);

  const totalAddonCost = baggageCost + mealsCost + servicesCost;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 p-4 sm:p-6 text-white flex items-center justify-between shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-sky-500/30 border border-sky-400/30 text-sky-200 text-xs font-mono font-bold">
                {flight.airline} • {flight.flightNumber}
              </span>
              <span className="text-xs text-sky-200">Personalize Your In-Flight Experience</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              <span>Meals, Extra Baggage &amp; Travel Add-ons</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 shrink-0">
          {[
            { id: "meals", label: "In-Flight Meals", icon: UtensilsCrossed, count: Object.keys(selectedMeals).length },
            { id: "baggage", label: "Extra Check-in Baggage", icon: Luggage, count: selectedBaggageId ? 1 : 0 },
            { id: "services", label: "Lounge & Priority Add-ons", icon: Coffee, count: selectedAddonIds.length },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                  isActive
                    ? "border-sky-600 text-sky-600 bg-white rounded-t-xl"
                    : "border-transparent text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-700 text-[10px] font-black">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: MEALS */}
          {activeTab === "meals" && (
            <div className="space-y-6">
              {/* Passenger Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-bold text-slate-500">Select Meal For:</span>
                {passengerNames.map((name, idx) => {
                  const isSelected = activeMealPassenger === idx;
                  const assignedMealId = selectedMeals[idx];
                  const meal = INFLIGHT_MEALS.find((m) => m.id === assignedMealId);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveMealPassenger(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                        isSelected
                          ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span>{name || `Passenger ${idx + 1}`}</span>
                      {meal ? (
                        <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[10px]">
                          {meal.name.slice(0, 15)}...
                        </span>
                      ) : (
                        <span className="text-[10px] opacity-70">(No meal)</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Meals Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INFLIGHT_MEALS.map((meal) => {
                  const isAssigned = selectedMeals[activeMealPassenger] === meal.id;

                  return (
                    <div
                      key={meal.id}
                      className={`border rounded-2xl overflow-hidden transition-all flex flex-col justify-between ${
                        isAssigned
                          ? "border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="relative h-36 w-full overflow-hidden bg-slate-100">
                        <img
                          src={meal.image}
                          alt={meal.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              meal.diet === "veg"
                                ? "bg-emerald-600 text-white"
                                : meal.diet === "jain"
                                ? "bg-amber-500 text-white"
                                : meal.diet === "vegan"
                                ? "bg-teal-600 text-white"
                                : "bg-rose-600 text-white"
                            }`}
                          >
                            {meal.diet === "veg" ? "Pure Veg" : meal.diet === "jain" ? "Jain (No Root)" : meal.diet === "vegan" ? "Vegan" : "Non-Veg"}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-950/70 text-white text-[10px] font-mono">
                            {meal.calories}
                          </span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm">{meal.name}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{meal.description}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-base font-black text-slate-900">₹{meal.price}</span>
                          <button
                            type="button"
                            onClick={() => handleToggleMeal(meal.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                              isAssigned
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                            }`}
                          >
                            {isAssigned ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Meal</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: EXTRA BAGGAGE */}
          {activeTab === "baggage" && (
            <div className="space-y-6">
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Pre-Book Baggage &amp; Save up to 40%</h4>
                  <p className="text-xs text-slate-600">
                    Airport counter rates for excess baggage are ₹550/kg. Pre-booking online starts at just ₹300/kg.
                  </p>
                </div>
                <div className="text-xs font-bold text-sky-800 px-3 py-1 bg-sky-100 rounded-xl border border-sky-300 shrink-0">
                  Included: {flight.checkInBaggageKg} kg Free Check-in
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {EXTRA_BAGGAGE_OPTIONS.map((bag) => {
                  const isSelected = selectedBaggageId === bag.id;
                  const savings = bag.airportCounterPrice - bag.price;

                  return (
                    <div
                      key={bag.id}
                      onClick={() => setSelectedBaggageId(isSelected ? undefined : bag.id)}
                      className={`cursor-pointer border rounded-2xl p-5 transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                            <Luggage className="w-5 h-5" />
                          </div>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            Save ₹{savings}
                          </span>
                        </div>

                        <h4 className="font-extrabold text-slate-900 text-base">{bag.label}</h4>
                        <p className="text-xs text-slate-500">Instant allowance tagged to PNR ticket barcode</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 line-through">₹{bag.airportCounterPrice}</span>
                          <div className="text-lg font-black text-slate-900">₹{bag.price.toLocaleString("en-IN")}</div>
                        </div>

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            isSelected ? "bg-sky-600 border-sky-600 text-white" : "border-slate-300 bg-white"
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: SERVICES & LOUNGE */}
          {activeTab === "services" && (
            <div className="space-y-4">
              {FLIGHT_ADDONS_LIST.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);

                return (
                  <div
                    key={addon.id}
                    onClick={() => handleToggleAddon(addon.id)}
                    className={`cursor-pointer border rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? "border-sky-500 bg-sky-50/50 shadow-md ring-2 ring-sky-500/20"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 border border-sky-200">
                        {addon.id === "addon-lounge" && <Coffee className="w-6 h-6" />}
                        {addon.id === "addon-priority" && <Zap className="w-6 h-6" />}
                        {addon.id === "addon-zero-cancel" && <ShieldCheck className="w-6 h-6 text-emerald-600" />}
                        {addon.id === "addon-doorstep" && <Truck className="w-6 h-6" />}
                        {addon.id === "addon-carbon" && <Leaf className="w-6 h-6 text-emerald-600" />}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-slate-900 text-sm sm:text-base">{addon.name}</h4>
                          {addon.badge && (
                            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-black">
                              {addon.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 max-w-xl">{addon.description}</p>
                        <span className="text-[11px] text-emerald-700 font-bold block">{addon.benefit}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                      <div className="text-left sm:text-right">
                        <span className="text-lg font-black text-slate-900">₹{addon.price.toLocaleString("en-IN")}</span>
                        <span className="text-[10px] text-slate-400 block">per ticket</span>
                      </div>

                      <button
                        type="button"
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Included</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-slate-500 font-medium">Add-ons Subtotal</span>
            <div className="text-base sm:text-lg font-extrabold text-slate-900">
              ₹{totalAddonCost.toLocaleString("en-IN")}{" "}
              <span className="text-xs text-slate-400 font-normal">
                ({Object.keys(selectedMeals).length} meals, {selectedBaggageId ? "Extra bag" : "No bag"}, {selectedAddonIds.length} services)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-100 transition-colors"
            >
              Skip Add-ons
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirmAddons(
                  { selectedBaggageId, selectedMeals, selectedAddonIds },
                  totalAddonCost
                );
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Save &amp; Continue (₹{totalAddonCost})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
