import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  Users,
  Phone,
  Mail,
  Clock,
  Star,
  CheckCircle2,
  Compass,
  Bus,
  Building2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { TourOperatorProfile, UnifiedTourPackage } from "../../types";

interface TourOperatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  operator: TourOperatorProfile | null;
  packages: UnifiedTourPackage[];
  onSelectPackage: (tour: UnifiedTourPackage) => void;
}

export function TourOperatorProfileModal({
  isOpen,
  onClose,
  operator,
  packages,
  onSelectPackage,
}: TourOperatorProfileModalProps) {
  if (!isOpen || !operator) return null;

  const [activeTab, setActiveTab] = useState<"overview" | "packages" | "destinations" | "reviews">("overview");

  const operatorPackages = packages.filter((p) => p.operatorId === operator.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Banner Header */}
        <div className="relative h-48 sm:h-56 overflow-hidden">
          <img
            src={operator.coverImage}
            alt={operator.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
            <div className="flex items-center gap-3">
              <img
                src={operator.logo}
                alt={operator.brandName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/80 shadow-lg shrink-0 bg-slate-900"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Tour Operator
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold">
                    {operator.yearsInBusiness}+ Years in Travel
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white drop-shadow-sm mt-1">
                  {operator.name}
                </h2>
                <p className="text-xs text-slate-200">{operator.brandName} • Headquartered in {operator.destinationsCovered.cities[0] || "India"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-900/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 self-start sm:self-auto">
              <div className="text-center">
                <div className="flex items-center gap-1 text-amber-400 font-extrabold text-sm justify-center">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span>{operator.rating}</span>
                </div>
                <span className="text-[10px] text-slate-300">({operator.reviewsCount} Reviews)</span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-sm font-extrabold text-white">{operator.completedToursCount.toLocaleString("en-IN")}+</div>
                <span className="text-[10px] text-slate-300">Tours Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Operator Overview
          </button>
          <button
            onClick={() => setActiveTab("packages")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "packages"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Tour Packages ({operatorPackages.length})
          </button>
          <button
            onClick={() => setActiveTab("destinations")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "destinations"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Destinations &amp; Circuits
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "reviews"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Certificates &amp; Trust
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* About */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                  About {operator.name}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {operator.description}
                </p>
              </div>

              {/* Verified Badges */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Government Approvals &amp; Official Accreditations</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {operator.verifiedBadges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-emerald-800 font-medium bg-white/70 px-3 py-1.5 rounded-xl border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fleet & Team Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Certified Guides</span>
                  <span className="text-lg font-black text-slate-900">{operator.guidesCount}+</span>
                  <span className="text-[10px] text-slate-400 block">Govt. Licensed</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Dedicated Fleet</span>
                  <span className="text-lg font-black text-slate-900">{operator.fleetCount}+</span>
                  <span className="text-[10px] text-slate-400 block">AC Cabs &amp; Coaches</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Experience</span>
                  <span className="text-lg font-black text-slate-900">{operator.yearsInBusiness} Yrs</span>
                  <span className="text-[10px] text-slate-400 block">Since {2026 - operator.yearsInBusiness}</span>
                </div>
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Happy Guests</span>
                  <span className="text-lg font-black text-slate-900">{operator.completedToursCount.toLocaleString("en-IN")}+</span>
                  <span className="text-[10px] text-slate-400 block">Verified Travellers</span>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Specialties &amp; Tour Focus</h4>
                <div className="flex flex-wrap gap-2">
                  {operator.specialties.map((spec, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-fuchsia-50 text-fuchsia-900 border border-fuchsia-200 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-fuchsia-600" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customer Support & Emergency Contact */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Direct Customer Support &amp; Emergency Ops</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-fuchsia-400 shrink-0" />
                    <span>Booking Desk: <strong>{operator.contact.phone}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>WhatsApp Concierge: <strong>{operator.contact.whatsapp}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>Email: <strong>{operator.contact.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>24x7 Helpline: <strong>{operator.contact.emergencyHelpline}</strong></span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  <MapPin className="w-3.5 h-3.5 inline mr-1 text-slate-400" />
                  Office Address: {operator.contact.officeAddress}
                </div>
              </div>
            </div>
          )}

          {activeTab === "packages" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  Curated Packages by {operator.brandName}
                </h3>
                <span className="text-xs text-slate-500">{operatorPackages.length} Circuits Available</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {operatorPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-fuchsia-400 hover:shadow-lg transition-all flex flex-col"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img src={pkg.featuredImage} alt={pkg.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold">
                          {pkg.durationText}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-fuchsia-600 text-white text-[10px] font-bold">
                          {pkg.category}
                        </span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg text-xs font-bold text-slate-900 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{pkg.rating}</span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-fuchsia-600 uppercase tracking-wider block">
                          {pkg.destination}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 line-clamp-2 mt-0.5">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {pkg.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">Starting from</span>
                          <span className="text-base font-black text-slate-900">₹{pkg.pricePerAdult.toLocaleString("en-IN")}</span>
                          <span className="text-[10px] text-slate-400"> / Person</span>
                        </div>

                        <button
                          onClick={() => {
                            onClose();
                            onSelectPackage(pkg);
                          }}
                          className="px-4 py-2 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-xs"
                        >
                          <span>Explore &amp; Book</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "destinations" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">Destinations &amp; Circuits Covered</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {operator.name} operates certified private tours, holiday circuits, and luxury transfers across the following key regions:
                </p>

                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Major Cities &amp; Hubs:</span>
                    <div className="flex flex-wrap gap-2">
                      {operator.destinationsCovered.cities.map((city, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-fuchsia-600" />
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">States &amp; Territories:</span>
                    <div className="flex flex-wrap gap-2">
                      {operator.destinationsCovered.states.map((st, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-fuchsia-50 text-fuchsia-800 text-xs font-semibold">
                          🏛️ {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-700 block mb-2">Countries:</span>
                    <div className="flex flex-wrap gap-2">
                      {operator.destinationsCovered.countries.map((cntry, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold">
                          🌏 {cntry}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Award className="w-4 h-4 text-fuchsia-600" />
                  <span>Trust, Safety &amp; Legal Compliance Standards</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  As an accredited travel operator on BharatYatra, {operator.name} satisfies strict KYC verification, commercial transport licensing, guide certifications, and Ministry of Tourism statutory standards.
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">IATO Accreditation Status</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active Member
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Tourist Guide Licensing</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 100% Govt Licensed Historians
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">Commercial Chauffeur AIS-140 GPS Compliance</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fully Compliant Fleet
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-600">24x7 SOS &amp; Emergency Escalation Protocol</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active 24x7 Operations Desk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
