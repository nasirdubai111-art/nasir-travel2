import React, { useState } from "react";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Bus,
  UtensilsCrossed,
  Sparkles,
  Camera,
  ChevronDown,
  ChevronUp,
  Tag,
  ArrowRight,
  Info,
  Phone,
  MessageCircle,
  Mail,
  Compass,
  FileText,
  AlertCircle,
  ChevronRight,
  Heart,
  Share2,
} from "lucide-react";
import { UnifiedTourPackage, TourOperatorProfile } from "../../types";

interface TourPackageDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tour: UnifiedTourPackage | null;
  operator: TourOperatorProfile | null;
  onStartBooking: (tour: UnifiedTourPackage) => void;
  onViewOperator: (operator: TourOperatorProfile) => void;
}

export function TourPackageDetailModal({
  isOpen,
  onClose,
  tour,
  operator,
  onStartBooking,
  onViewOperator,
}: TourPackageDetailModalProps) {
  if (!isOpen || !tour) return null;

  const [activeTab, setActiveTab] = useState<
    "itinerary" | "stay_transport" | "meals_activities" | "guide_gallery" | "policies_reviews"
  >("itinerary");
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [selectedBatchDate, setSelectedBatchDate] = useState<string>(
    tour.departureBatches[0]?.departureDate || "2026-09-12"
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const toggleDay = (dayNum: number) => {
    setExpandedDay(expandedDay === dayNum ? null : dayNum);
  };

  const allPhotos = [tour.featuredImage, ...tour.gallery];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header with Hero Banner */}
        <div className="relative h-60 sm:h-72 shrink-0 overflow-hidden">
          <img
            src={allPhotos[selectedPhotoIndex] || tour.featuredImage}
            alt={tour.title}
            className="w-full h-full object-cover transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Actions */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-black">
                {tour.durationText}
              </span>
              <span className="px-3 py-1 rounded-full bg-fuchsia-600/90 text-white text-xs font-bold shadow-xs">
                {tour.category} Circuit
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                {tour.rating} ({tour.reviewsCount} reviews)
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo Gallery Thumbnails */}
          <div className="absolute bottom-4 right-4 flex items-center gap-1.5 z-10">
            {allPhotos.slice(0, 4).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedPhotoIndex(idx)}
                className={`w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedPhotoIndex === idx ? "border-fuchsia-400 scale-105" : "border-white/60 opacity-80"
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* Bottom Title & Operator Credit */}
          <div className="absolute bottom-4 left-4 max-w-2xl text-white z-10">
            <div className="flex items-center gap-2 mb-1">
              {operator && (
                <button
                  onClick={() => onViewOperator(operator)}
                  className="flex items-center gap-1.5 text-xs text-fuchsia-300 font-bold hover:text-white transition-colors bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Curated by {operator.brandName}</span>
                </button>
              )}
              <span className="text-xs text-slate-300">• Min {tour.minGroupSize} - Max {tour.maxGroupSize} Travellers</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white drop-shadow-md leading-tight">
              {tour.title}
            </h1>
            <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">{tour.subtitle}</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-slate-200 bg-slate-50 overflow-x-auto text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("itinerary")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "itinerary"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Day-by-Day Plan ({tour.itinerary.length} Days)
          </button>
          <button
            onClick={() => setActiveTab("stay_transport")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "stay_transport"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Hotel &amp; Transport
          </button>
          <button
            onClick={() => setActiveTab("meals_activities")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "meals_activities"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Meals &amp; Sightseeing
          </button>
          <button
            onClick={() => setActiveTab("guide_gallery")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "guide_gallery"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Tour Guide &amp; Gallery
          </button>
          <button
            onClick={() => setActiveTab("policies_reviews")}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === "policies_reviews"
                ? "bg-fuchsia-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-200/60"
            }`}
          >
            Policies &amp; Reviews ({tour.reviews.length})
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Highlights Row (Always visible) */}
          <div className="bg-gradient-to-r from-fuchsia-50 via-purple-50 to-pink-50 border border-fuchsia-100 rounded-2xl p-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-fuchsia-950 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-fuchsia-600" />
              <span>Tour Circuit Key Highlights</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {tour.highlights.map((hl, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-600 shrink-0 mt-0.5" />
                  <span>{hl}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TAB 1: DAY-BY-DAY ITINERARY */}
          {activeTab === "itinerary" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900">Detailed Day-Wise Travel Program</h3>
                  <p className="text-xs text-slate-500">Includes planned transfers, sightseeing passes, and curated meal stops.</p>
                </div>
                <button
                  onClick={() => setExpandedDay(expandedDay ? null : 1)}
                  className="text-xs font-bold text-fuchsia-600 hover:text-fuchsia-800"
                >
                  {expandedDay ? "Collapse All" : "Expand Day 1"}
                </button>
              </div>

              <div className="space-y-3">
                {tour.itinerary.map((day) => {
                  const isExp = expandedDay === day.dayNumber;
                  return (
                    <div
                      key={day.dayNumber}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all"
                    >
                      <button
                        onClick={() => toggleDay(day.dayNumber)}
                        className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-xl bg-fuchsia-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            D{day.dayNumber}
                          </span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                                {day.title}
                              </h4>
                              {day.stayHotel && (
                                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                                  <Building2 className="w-3 h-3 text-slate-500" />
                                  {day.stayHotel}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-500 block mt-0.5">
                              {day.activities.length} Key Activities • {day.transferType}
                            </span>
                          </div>
                        </div>

                        <div className="p-1 rounded-lg text-slate-400">
                          {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </button>

                      {isExp && (
                        <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in">
                          <div className="space-y-2 mt-3">
                            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                              Day Schedule &amp; Attractions:
                            </span>
                            <ul className="space-y-1.5">
                              {day.activities.map((act, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2 text-xs text-slate-700">
                                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-600 shrink-0 mt-1.5" />
                                  <span>{act}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 text-xs border-t border-slate-200/60">
                            <div className="flex items-center gap-2">
                              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
                              <span className="font-semibold text-slate-800">
                                Meals Included: {day.mealsIncluded.join(", ") || "None / Personal expense"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Bus className="w-3.5 h-3.5 text-sky-600" />
                              <span className="text-slate-600">Transit: {day.transferType}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Included in Package Price</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-emerald-900">
                    {tour.inclusions.map((inc, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-rose-50/50 border border-rose-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-rose-950 flex items-center gap-1.5">
                    <X className="w-4 h-4 text-rose-600" />
                    <span>Exclusions (Not Included)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-rose-900">
                    {tour.exclusions.map((exc, e) => (
                      <li key={e} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold">✕</span>
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STAY & TRANSPORT */}
          {activeTab === "stay_transport" && (
            <div className="space-y-6">
              {/* Accommodation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Accommodation Standards &amp; Properties</h3>
                    <span className="text-xs text-slate-500">Tier: {tour.accommodation.tier}</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-fuchsia-50 text-fuchsia-700 font-bold text-xs">
                    {tour.accommodation.tier}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tour.accommodation.hotelsList.map((hotel, hIdx) => (
                    <div key={hIdx} className="border border-slate-200 rounded-2xl overflow-hidden bg-white p-3.5 flex gap-3.5">
                      <img
                        src={hotel.photos[0] || tour.featuredImage}
                        alt={hotel.hotelName}
                        className="w-24 h-24 rounded-xl object-cover shrink-0"
                      />
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-extrabold uppercase text-fuchsia-600 block">{hotel.city}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">{hotel.hotelName}</h4>
                        <p className="text-[11px] text-slate-600">{hotel.roomCategory}</p>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 pt-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{hotel.rating} / 5.0 Rating</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Available Room Layouts: </span>
                  {tour.accommodation.roomConfigurations.join(" • ")}
                </div>
              </div>

              {/* Transport */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-black text-slate-900">Transit, Vehicles &amp; Chauffeur Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Primary Travel Mode</span>
                    <p className="text-xs font-extrabold text-slate-900">{tour.transport.primaryMode}</p>
                    <p className="text-[11px] text-slate-500">Fleet: {tour.transport.vehicleTypes.join(", ")}</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Transfer Inclusions</span>
                    <p className="text-xs font-extrabold text-emerald-700">
                      ✓ Airport / Railway Pickup &amp; Drop Included
                    </p>
                    <p className="text-[11px] text-slate-500">All Tolls, State Border Permits &amp; Driver Allowance covered</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MEALS & SIGHTSEEING */}
          {activeTab === "meals_activities" && (
            <div className="space-y-6">
              {/* Meals */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">Dining &amp; Culinary Meal Plan</h3>
                  <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold">
                    {tour.meals.mealPlan}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                      Dietary Choices Accommodated:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tour.meals.dietaryOptions.map((d, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-semibold text-slate-700">
                          🌱 {d}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <span className="font-bold text-slate-800 uppercase text-[10px] tracking-wider block">
                      Signature Regional Delicacies:
                    </span>
                    <ul className="space-y-1 text-slate-700">
                      {tour.meals.signatureMeals.map((sm, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-amber-500">★</span>
                          <span>{sm}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Sightseeing & Activities */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="text-sm font-black text-slate-900">Included Sightseeing, Passes &amp; Safaris</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tour.activities.map((act, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl text-xs flex items-center gap-2">
                      <Compass className="w-4 h-4 text-fuchsia-600 shrink-0" />
                      <span className="font-semibold text-slate-800">{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GUIDE & GALLERY */}
          {activeTab === "guide_gallery" && (
            <div className="space-y-6">
              {/* Tour Guide Profile */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 flex flex-col sm:flex-row items-center gap-5">
                <img
                  src={tour.guideInfo.photo}
                  alt={tour.guideInfo.name}
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-fuchsia-400 shrink-0"
                />
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500/30 text-fuchsia-300 border border-fuchsia-400/30 text-[10px] font-bold">
                      Govt Licensed Historian Guide
                    </span>
                    <span className="text-amber-400 text-xs font-bold flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      {tour.guideInfo.rating} Rating
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">{tour.guideInfo.name}</h4>
                  <p className="text-xs text-slate-300">{tour.guideInfo.speciality}</p>
                  <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                    <span>Languages: <strong>{tour.guideInfo.languages.join(", ")}</strong></span>
                    <span>Experience: <strong>{tour.guideInfo.experienceYears} Years</strong></span>
                    <span>License: <strong>{tour.guideInfo.licenseNumber}</strong></span>
                  </div>
                </div>
              </div>

              {/* Photo Gallery Grid */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900">Destination Gallery</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {allPhotos.map((p, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`h-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedPhotoIndex === idx ? "border-fuchsia-500 scale-105 shadow-md" : "border-transparent hover:opacity-90"
                      }`}
                    >
                      <img src={p} alt="gallery" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: POLICIES & REVIEWS */}
          {activeTab === "policies_reviews" && (
            <div className="space-y-6">
              {/* Cancellation Policy */}
              <div className="space-y-3">
                <h3 className="text-sm font-black text-slate-900">Cancellation &amp; Refund Policy</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {tour.policies.cancellationRules.map((rule, rIdx) => (
                    <div key={rIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="font-bold text-slate-800">{rule.daysBefore}</span>
                      <div className="flex items-center justify-between">
                        <span className="text-emerald-700 font-extrabold">{rule.refundPercentage}% Refund</span>
                        <span className="text-[11px] text-slate-500">{rule.penalty}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                  <p><strong>Child Policy:</strong> {tour.policies.childPolicy}</p>
                  <p><strong>Payment Terms:</strong> {tour.policies.paymentTerms}</p>
                  <p><strong>ID Requirements:</strong> {tour.policies.identificationRequired}</p>
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-900">Verified Customer Reviews ({tour.reviews.length})</h3>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{tour.rating} Overall Score</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {tour.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-fuchsia-600 text-white font-bold flex items-center justify-center text-xs">
                            {rev.userName.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block">{rev.userName}</span>
                            <span className="text-[10px] text-slate-400">{rev.userCity} • {rev.travelGroup} • {rev.travelDate}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Traveller
                        </div>
                      </div>
                      <p className="text-slate-700 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer Bar with Departure Batch & Book Now */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 shadow-lg">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div>
              <span className="text-[11px] text-slate-400 line-through block">
                ₹{tour.originalPrice.toLocaleString("en-IN")}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">
                  ₹{tour.pricePerAdult.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-500 font-semibold">/ Person</span>
              </div>
              <span className="text-[10px] text-emerald-600 font-bold block">Save ₹{(tour.originalPrice - tour.pricePerAdult).toLocaleString("en-IN")} (Includes Stay + Cab + Meals)</span>
            </div>

            {/* Departure Batch Quick Select */}
            <div className="hidden md:block">
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Departure Batch</label>
              <select
                value={selectedBatchDate}
                onChange={(e) => setSelectedBatchDate(e.target.value)}
                className="text-xs font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-hidden focus:border-fuchsia-500"
              >
                {tour.departureBatches.map((b) => (
                  <option key={b.id} value={b.departureDate}>
                    {b.departureDate} ({b.status} • {b.totalSeats - b.bookedSeats} seats left)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {operator && (
              <button
                type="button"
                onClick={() => onViewOperator(operator)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors hidden sm:flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Operator Profile</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onClose();
                onStartBooking(tour);
              }}
              className="flex-1 sm:flex-none px-8 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-700 hover:to-rose-700 text-white text-sm font-extrabold shadow-lg shadow-fuchsia-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Book Tour Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
