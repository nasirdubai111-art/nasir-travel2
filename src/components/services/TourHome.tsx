import React, { useState } from "react";
import {
  Map,
  Calendar,
  Users,
  CheckCircle2,
  Star,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Compass,
  Heart,
  Camera,
} from "lucide-react";
import { CityLocation, BookingItem } from "../../types";
import { DETAILED_TOURS, DetailedTourItem } from "../../data/tourData";
import { TourItineraryBuilderModal } from "../tours/TourItineraryBuilderModal";

interface TourHomeProps {
  currentLocation: CityLocation;
  onBookTour: (tour: any) => void;
  onOpenAIDrawer: () => void;
}

export function TourHome({
  currentLocation,
  onBookTour,
  onOpenAIDrawer,
}: TourHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTour, setSelectedTour] = useState<DetailedTourItem | null>(null);
  const [expandedTourId, setExpandedTourId] = useState<string | null>(null);

  const categories = [
    { id: "all", label: "All Circuits" },
    { id: "Heritage", label: "🏰 Heritage & Forts" },
    { id: "Honeymoon", label: "🌹 Honeymoon & Romance" },
    { id: "Beach", label: "🏖️ Beach & Islands" },
    { id: "Wildlife", label: "🐅 Wildlife & Safaris" },
    { id: "Adventure", label: "🏔️ Himalayan Adventure" },
    { id: "Cultural", label: "🪔 Spiritual & Cultural" },
  ];

  const filteredTours = DETAILED_TOURS.filter((t) => {
    if (selectedCategory === "all") return true;
    return t.theme.toLowerCase() === selectedCategory.toLowerCase();
  });

  const toggleExpand = (id: string) => {
    setExpandedTourId(expandedTourId === id ? null : id);
  };

  const handleBookingSuccess = (newBooking: BookingItem) => {
    onBookTour(selectedTour);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-fuchsia-900 via-pink-950 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-4xl space-y-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">
              <Map className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Curated Holiday Packages &amp; Circuit Itineraries
              </h1>
              <p className="text-xs text-fuchsia-200">Pre-booked 4-Star Stays • Private AC Chauffeur • Govt Licensed Guide • Custom Itinerary Builder</p>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                  selectedCategory === cat.id
                    ? "bg-fuchsia-500 text-white border-fuchsia-400 shadow-xs"
                    : "bg-white/10 text-fuchsia-200 border-white/10 hover:bg-white/20"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tours List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Featured Holiday Packages ({filteredTours.length})</h2>
          <span className="text-xs text-slate-500">100% Customizable with AI Builder</span>
        </div>

        <div className="space-y-6">
          {filteredTours.map((tour) => {
            const isExpanded = expandedTourId === tour.id;
            return (
              <div
                key={tour.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-fuchsia-400 hover:shadow-xl transition-all"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Tour Image */}
                  <div className="lg:w-1/3 relative h-64 lg:h-auto overflow-hidden">
                    <img
                      src={tour.featuredImage}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold">
                        {tour.duration}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-600/90 text-white text-[10px] font-bold">
                        {tour.theme}
                      </span>
                    </div>
                  </div>

                  {/* Content Overview */}
                  <div className="p-6 lg:w-2/3 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-fuchsia-600 uppercase tracking-wider">
                          {tour.destination}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{tour.rating}</span>
                          <span className="text-slate-400 font-normal">({tour.reviewsCount} reviews)</span>
                        </div>
                      </div>

                      <h3 className="text-lg font-extrabold text-slate-900 mt-1">{tour.title}</h3>

                      {/* Highlights */}
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {tour.highlights.map((h, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-600 shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>

                      {/* Inclusions */}
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {tour.inclusions.map((inc, idx) => (
                          <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-fuchsia-50 text-fuchsia-800 text-[10px] font-bold">
                            ✓ {inc}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-2xl font-black text-slate-900">
                          ₹{tour.pricePerAdult.toLocaleString("en-IN")}
                        </div>
                        <span className="text-[11px] text-slate-400">/ Person (Includes 4-Star Stay, AC Cab &amp; Breakfast)</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => toggleExpand(tour.id)}
                          className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center justify-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? "Hide Itinerary" : "Quick Schedule"}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedTour(tour)}
                          className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-fuchsia-600 hover:bg-fuchsia-700 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          <span>Customize &amp; Book</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day-by-Day Itinerary Dropdown */}
                {isExpanded && (
                  <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4 animate-in fade-in">
                    <h4 className="text-sm font-bold text-slate-900">Day-Wise Plan Overview</h4>
                    <div className="space-y-3">
                      {tour.itinerary.map((day) => (
                        <div key={day.dayNumber} className="flex gap-3 text-xs bg-white p-4 rounded-2xl border border-slate-200">
                          <span className="px-2.5 py-1 rounded-xl bg-fuchsia-600 text-white font-black text-xs h-fit">
                            Day {day.dayNumber}
                          </span>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h5 className="font-bold text-slate-900">{day.title}</h5>
                              {day.stayHotel && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-semibold">
                                  🏨 {day.stayHotel}
                                </span>
                              )}
                            </div>
                            <p className="text-slate-600 leading-relaxed">{day.activities.join(" • ")}</p>
                            {day.mealsIncluded && day.mealsIncluded.length > 0 && (
                              <p className="text-[10px] text-fuchsia-700 font-bold">
                                Included Meals: {day.mealsIncluded.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tour Itinerary Customizer & Booking Modal */}
      <TourItineraryBuilderModal
        isOpen={!!selectedTour}
        onClose={() => setSelectedTour(null)}
        tour={selectedTour}
        onBookingSuccess={handleBookingSuccess}
      />
    </div>
  );
}

