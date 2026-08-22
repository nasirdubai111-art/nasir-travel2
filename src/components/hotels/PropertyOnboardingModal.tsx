import React, { useState } from "react";
import {
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Upload,
  Percent,
  TrendingUp,
} from "lucide-react";

interface PropertyOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyOnboardingModal({
  isOpen,
  onClose,
}: PropertyOnboardingModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [propertyName, setPropertyName] = useState("");
  const [propertyType, setPropertyType] = useState("Heritage Haveli");
  const [city, setCity] = useState("Udaipur");
  const [state, setState] = useState("Rajasthan");
  const [totalRooms, setTotalRooms] = useState("18");
  const [startingPrice, setStartingPrice] = useState("4500");
  const [ownerName, setOwnerName] = useState("Rana Digvijay Singh");
  const [ownerPhone, setOwnerPhone] = useState("+91 94140 12345");
  const [ownerEmail, setOwnerEmail] = useState("palace.stay@udaipur.com");
  const [panGstNumber, setPanGstNumber] = useState("08AAACH1234F1Z5");
  const [coupleFriendly, setCoupleFriendly] = useState(true);
  const [freeBreakfast, setFreeBreakfast] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold">List Your Property on BharatYatra</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Zero Onboarding Fee
                </span>
              </div>
              <p className="text-xs text-slate-400">Join 80,000+ Indian Hoteliers, Havelis, Homestays &amp; Luxury Resorts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
            {/* Value Props */}
            <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
              <div>
                <span className="font-extrabold text-indigo-900 block text-sm">10-12%</span>
                <span className="text-[10px] text-slate-500">Lowest Commission</span>
              </div>
              <div>
                <span className="font-extrabold text-emerald-800 block text-sm">T+1 Day</span>
                <span className="text-[10px] text-slate-500">Instant UPI Payouts</span>
              </div>
              <div>
                <span className="font-extrabold text-purple-900 block text-sm">10M+</span>
                <span className="text-[10px] text-slate-500">Active Travellers</span>
              </div>
            </div>

            {/* Property Basic Info */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                1. Property Profile &amp; Location:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Property Name</label>
                  <input
                    type="text"
                    required
                    value={propertyName}
                    onChange={(e) => setPropertyName(e.target.value)}
                    placeholder="e.g. Mewar Heritage Palace"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Property Type</label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="Heritage Haveli">Heritage Haveli / Fort</option>
                    <option value="Hotel">Boutique Hotel</option>
                    <option value="Luxury Resort">Luxury Resort / Villa</option>
                    <option value="Eco Lodge">Eco Stay / Treehouse</option>
                    <option value="Homestay">B&amp;B / Homestay</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">City / Town</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>
            </div>

            {/* Inventory & Pricing */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                2. Inventory &amp; Tariff:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Total Room Count</label>
                  <input
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Starting Base Tariff (₹ / Night)</label>
                  <input
                    type="number"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={coupleFriendly}
                    onChange={(e) => setCoupleFriendly(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Couple Friendly (Local IDs Allowed)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={freeBreakfast}
                    onChange={(e) => setFreeBreakfast(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>Include Complimentary Breakfast</span>
                </label>
              </div>
            </div>

            {/* Owner KYC Details */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                3. Partner KYC &amp; Settlement:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Owner / GM Name</label>
                  <input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Contact Mobile</label>
                  <input
                    type="text"
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">GSTIN / PAN</label>
                  <input
                    type="text"
                    value={panGstNumber}
                    onChange={(e) => setPanGstNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Verifying Property KYC..." : "Submit Property for Instant Listing"}
            </button>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">Property Registration Approved!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Your property <strong>{propertyName || "Mewar Heritage Palace"}</strong> has been pre-approved on the BharatYatra Global Extranet. Your dedicated account manager will connect within 2 business hours.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
            >
              Back to BharatYatra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
