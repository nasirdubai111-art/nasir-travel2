import React, { useState } from "react";
import {
  X,
  Tent,
  CheckCircle2,
  Upload,
  ShieldCheck,
  Building2,
  FileText,
  DollarSign,
  Camera,
  MapPin,
  Sparkles,
} from "lucide-react";

interface LodgeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LodgeOnboardingModal({ isOpen, onClose }: LodgeOnboardingModalProps) {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    lodgeName: "",
    destination: "Jim Corbett National Park",
    state: "Uttarakhand",
    lodgeType: "Jungle Wildlife Lodge",
    totalCottages: "6",
    hostName: "",
    hostPhone: "",
    hostEmail: "",
    panNumber: "",
    gstNumber: "",
    forestPermitAffiliation: "Buffer Zone Eco Homestay License",
    startingRate: "3500",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep((prev) => (prev + 1) as any);
    } else {
      setIsSubmitted(true);
      fetch("/api/lodges/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => {});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-900 via-stone-900 to-teal-950 p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
              Host Partnership &amp; KYC
            </span>
            <h2 className="text-xl font-black">List Your Wildlife, Eco or Heritage Lodge</h2>
            <p className="text-xs text-amber-200/90">Direct connection to verified travelers • Instant T+1 Payouts</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Steps Progress */}
            <div className="flex items-center justify-between border-b pb-4 text-xs font-bold text-slate-500">
              <span className={step >= 1 ? "text-amber-600 font-black" : ""}>1. Property Details</span>
              <span>➔</span>
              <span className={step >= 2 ? "text-amber-600 font-black" : ""}>2. KYC &amp; Forest Permits</span>
              <span>➔</span>
              <span className={step >= 3 ? "text-amber-600 font-black" : ""}>3. Rates &amp; Photos</span>
            </div>

            {step === 1 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Lodge / Property Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Corbett Whispering Pines Eco Lodge"
                    value={formData.lodgeName}
                    onChange={(e) => setFormData({ ...formData, lodgeName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold focus:outline-none focus:border-amber-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Lodge Classification</label>
                    <select
                      value={formData.lodgeType}
                      onChange={(e) => setFormData({ ...formData, lodgeType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold"
                    >
                      <option value="Jungle Wildlife Lodge">Jungle Wildlife Lodge</option>
                      <option value="Himalayan Eco Lodge">Himalayan Eco Lodge</option>
                      <option value="Tea Estate Heritage Lodge">Tea Estate Heritage Lodge</option>
                      <option value="Backwater River Lodge">Backwater River Lodge</option>
                      <option value="Forest Dak Bungalow">Forest Dak Bungalow</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Destination / Circuit</label>
                    <input
                      type="text"
                      required
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Host Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Col. / Mr. / Ms."
                      value={formData.hostName}
                      onChange={(e) => setFormData({ ...formData, hostName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Host Contact Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98..."
                      value={formData.hostPhone}
                      onChange={(e) => setFormData({ ...formData, hostPhone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Host PAN Number (Individual or Business)</label>
                  <input
                    type="text"
                    required
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">GST Identification Number (Optional for Homestays)</label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-mono font-semibold"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                  <span className="font-bold block">🌿 Forest / Tourism Department Certification:</span>
                  <p className="text-[11px]">
                    BharatYatra verifies local eco-tourism permissions, homestay registrations, or buffer-zone licenses to protect guests and local ecosystems.
                  </p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Total Rooms / Cottages</label>
                    <input
                      type="number"
                      value={formData.totalCottages}
                      onChange={(e) => setFormData({ ...formData, totalCottages: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Starting Base Rate (₹ / night)</label>
                    <input
                      type="number"
                      value={formData.startingRate}
                      onChange={(e) => setFormData({ ...formData, startingRate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-2">
                  <Camera className="w-8 h-8 text-amber-600 mx-auto" />
                  <span className="font-bold text-slate-800 block">Upload High-Res Property &amp; Cottage Photos</span>
                  <p className="text-[11px] text-slate-500">Attach exterior, room interior, bathroom, and scenery photos (JPEG/PNG up to 15MB).</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-teal-700 text-white font-black shadow-md hover:scale-105 transition-all"
              >
                {step === 3 ? "Submit Onboarding Application" : "Continue"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900">Application Submitted for Review!</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Our Lodge Verification &amp; Naturalist team will inspect the documentation and activate your live booking calendar within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md hover:bg-slate-800"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
