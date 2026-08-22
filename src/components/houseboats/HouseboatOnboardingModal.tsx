import React, { useState } from "react";
import {
  X,
  Ship,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Anchor,
  Upload,
  Building2,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

interface HouseboatOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HouseboatOnboardingModal({ isOpen, onClose }: HouseboatOnboardingModalProps) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    contactMobile: "",
    email: "",
    destination: "Alleppey (Alappuzha)",
    waterbody: "Vembanad Lake & Punnamada",
    portRegistrationNo: "",
    vesselCategory: "Luxury",
    totalBedrooms: 3,
    crewCount: 3,
    hasPrivateChef: true,
    hasBioToilet: true,
    hasIRSInsurance: true,
    panNumber: "",
    gstNumber: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch("/api/houseboats/onboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((r) => r.json())
      .catch(() => ({}))
      .finally(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-950 to-slate-950 p-5 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center justify-center font-bold">
              <Anchor className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black">Houseboat Partner Onboarding Portal</h2>
              <p className="text-xs text-cyan-200">List Your Kerala, Kashmir or Goa Charters on BharatYatra Network</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Fleet / Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Backwater Royale Cruises"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Boat Owner / Master Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. V. K. Madhavan"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Contact Mobile (+91) *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98450 XXXXX"
                  value={formData.contactMobile}
                  onChange={(e) => setFormData({ ...formData, contactMobile: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Destination Circuit *</label>
                <select
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                >
                  <option value="Alleppey (Alappuzha)">Alleppey (Kerala Backwaters)</option>
                  <option value="Kumarakom">Kumarakom (Vembanad Lake)</option>
                  <option value="Srinagar (Dal Lake)">Srinagar (Dal Lake Kashmir)</option>
                  <option value="Srinagar (Nigeen Lake)">Srinagar (Nigeen Lake Kashmir)</option>
                  <option value="Goa (Chapora Backwaters)">Goa (Chapora River)</option>
                  <option value="Goa (Mandovi River)">Goa (Mandovi River)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Port Reg. Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KIV-ALP-HB-0891"
                  value={formData.portRegistrationNo}
                  onChange={(e) => setFormData({ ...formData, portRegistrationNo: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-medium font-mono"
                />
              </div>
            </div>

            {/* Compliance Checkboxes */}
            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-2xl space-y-2">
              <span className="font-black text-cyan-900 block text-xs">Port &amp; Environmental Safety Standards:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.hasBioToilet}
                    onChange={(e) => setFormData({ ...formData, hasBioToilet: e.target.checked })}
                    className="rounded text-cyan-600 w-4 h-4"
                  />
                  <span>Bio-Toilet Certified</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.hasIRSInsurance}
                    onChange={(e) => setFormData({ ...formData, hasIRSInsurance: e.target.checked })}
                    className="rounded text-cyan-600 w-4 h-4"
                  />
                  <span>IRS Marine Insurance</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.hasPrivateChef}
                    onChange={(e) => setFormData({ ...formData, hasPrivateChef: e.target.checked })}
                    className="rounded text-cyan-600 w-4 h-4"
                  />
                  <span>In-House Master Chef</span>
                </label>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center space-y-1">
              <Upload className="w-5 h-5 text-slate-400 mx-auto" />
              <span className="font-bold text-slate-700 block">Upload Port Registration &amp; Insurance Copy</span>
              <span className="text-[10px] text-slate-400">PDF, JPG up to 10MB</span>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center -mx-5 -mb-5 sm:-mx-6 sm:-mb-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-slate-900 text-white font-black shadow-md hover:scale-[1.02] transition-all"
              >
                {isSubmitting ? "Submitting Application..." : "Submit for Verification"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Our maritime compliance desk will verify your port registration #{formData.portRegistrationNo} and activate your listing within 24 hours.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
