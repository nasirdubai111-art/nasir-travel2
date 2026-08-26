import React, { useState } from "react";
import {
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Plane,
  Train,
  Bus,
  Building2,
  Palmtree,
  Car,
  Ship,
  Star,
  Tag,
  ShieldCheck,
  Coffee,
  CreditCard,
  Calendar,
  MapPin,
  Utensils,
} from "lucide-react";
import { TravelCheckbox } from "./TravelCheckbox";
import { ServiceCategory } from "../../types";

export interface TravelFilterState {
  serviceTypes: string[];
  stayTypes: string[];
  transportTypes: string[];
  amenities: string[];
  priceRanges: string[];
  ratings: string[];
  destinations: string[];
  timings: string[];
  cancellationPolicies: string[];
  mealOptions: string[];
  paymentOptions: string[];
}

export const INITIAL_TRAVEL_FILTERS: TravelFilterState = {
  serviceTypes: [],
  stayTypes: [],
  transportTypes: [],
  amenities: [],
  priceRanges: [],
  ratings: [],
  destinations: [],
  timings: [],
  cancellationPolicies: [],
  mealOptions: [],
  paymentOptions: [],
};

interface TravelFilterSidebarProps {
  currentCategory?: ServiceCategory;
  activeFilters: TravelFilterState;
  onFilterChange: (filters: TravelFilterState) => void;
  onResetFilters: () => void;
  resultCount?: number;
  className?: string;
  isMobileDrawer?: boolean;
  onCloseMobile?: () => void;
}

export const TravelFilterSidebar: React.FC<TravelFilterSidebarProps> = ({
  currentCategory = "all",
  activeFilters,
  onFilterChange,
  onResetFilters,
  resultCount,
  className = "",
  isMobileDrawer = false,
  onCloseMobile,
}) => {
  // Accordion open states
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    services: true,
    stay: true,
    price: true,
    rating: true,
    amenities: true,
    cancellation: true,
    meals: true,
    payment: true,
    timing: false,
    destinations: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCheckboxToggle = (
    category: keyof TravelFilterState,
    value: string,
    checked: boolean
  ) => {
    const currentList = activeFilters[category];
    const updatedList = checked
      ? [...currentList, value]
      : currentList.filter((item) => item !== value);

    onFilterChange({
      ...activeFilters,
      [category]: updatedList,
    });
  };

  const totalActiveFilterCount =
    activeFilters.serviceTypes.length +
    activeFilters.stayTypes.length +
    activeFilters.transportTypes.length +
    activeFilters.amenities.length +
    activeFilters.priceRanges.length +
    activeFilters.ratings.length +
    activeFilters.destinations.length +
    activeFilters.timings.length +
    activeFilters.cancellationPolicies.length +
    activeFilters.mealOptions.length +
    activeFilters.paymentOptions.length;

  return (
    <aside
      className={`w-full lg:w-[256px] shrink-0 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-5 text-[#172033] ${className}`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#0B5ED7]/10 flex items-center justify-center text-[#0B5ED7]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[16px] font-bold tracking-tight text-[#172033] leading-none">
              Filter Stays &amp; Trips
            </h2>
            {resultCount !== undefined && (
              <span className="text-[12px] text-[#64748B]">
                {resultCount} results matched
              </span>
            )}
          </div>
        </div>

        {totalActiveFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="text-[12px] font-semibold text-[#0B5ED7] hover:text-[#094eb3] flex items-center gap-1 transition-colors px-2 py-1 rounded-md hover:bg-[#F0F7FF]"
            title="Reset All Filters"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Clear ({totalActiveFilterCount})</span>
          </button>
        )}
      </div>

      {/* 1. Travel Mode / Service Type Filter */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <button
          onClick={() => toggleSection("services")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <Plane className="w-4 h-4 text-[#0B5ED7]" /> Travel Modes
          </span>
          {openSections.services ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.services && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="filter-flight"
              checked={activeFilters.serviceTypes.includes("flight")}
              onChange={(c) => handleCheckboxToggle("serviceTypes", "flight", c)}
              label="Flights (Domestic &amp; Intl)"
              count="140+"
            />
            <TravelCheckbox
              id="filter-train"
              checked={activeFilters.serviceTypes.includes("train")}
              onChange={(c) => handleCheckboxToggle("serviceTypes", "train", c)}
              label="Vande Bharat &amp; IRCTC Trains"
              count="85"
            />
            <TravelCheckbox
              id="filter-bus"
              checked={activeFilters.serviceTypes.includes("bus")}
              onChange={(c) => handleCheckboxToggle("serviceTypes", "bus", c)}
              label="Volvo &amp; Electric Buses"
              count="220"
            />
            <TravelCheckbox
              id="filter-cab"
              checked={activeFilters.transportTypes.includes("cab")}
              onChange={(c) => handleCheckboxToggle("transportTypes", "cab", c)}
              label="Chauffeur Cabs &amp; Rentals"
              count="50+"
            />
            <TravelCheckbox
              id="filter-houseboat"
              checked={activeFilters.transportTypes.includes("houseboat")}
              onChange={(c) => handleCheckboxToggle("transportTypes", "houseboat", c)}
              label="Private Luxury Houseboats"
              count="18"
            />
          </div>
        )}
      </div>

      {/* 2. Stay & Accommodation Type Filter */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <button
          onClick={() => toggleSection("stay")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#0B5ED7]" /> Stay Category
          </span>
          {openSections.stay ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.stay && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="stay-hotel"
              checked={activeFilters.stayTypes.includes("hotels")}
              onChange={(c) => handleCheckboxToggle("stayTypes", "hotels", c)}
              label="Hotels &amp; Heritage Havelis"
              count="420"
            />
            <TravelCheckbox
              id="stay-resort"
              checked={activeFilters.stayTypes.includes("resorts")}
              onChange={(c) => handleCheckboxToggle("stayTypes", "resorts", c)}
              label="Beach &amp; Hill Luxury Resorts"
              count="180"
            />
            <TravelCheckbox
              id="stay-lodge"
              checked={activeFilters.stayTypes.includes("lodges")}
              onChange={(c) => handleCheckboxToggle("stayTypes", "lodges", c)}
              label="Wildlife &amp; Forest Safari Lodges"
              count="64"
            />
          </div>
        )}
      </div>

      {/* 3. Price Range Filter */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <button
          onClick={() => toggleSection("price")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <Tag className="w-4 h-4 text-[#0B5ED7]" /> Price Range (Per Night)
          </span>
          {openSections.price ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.price && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="price-budget"
              checked={activeFilters.priceRanges.includes("under_2000")}
              onChange={(c) => handleCheckboxToggle("priceRanges", "under_2000", c)}
              label="Budget: Under ₹2,000"
              count="110"
            />
            <TravelCheckbox
              id="price-mid"
              checked={activeFilters.priceRanges.includes("2000_5000")}
              onChange={(c) => handleCheckboxToggle("priceRanges", "2000_5000", c)}
              label="Standard: ₹2,000 - ₹5,000"
              count="285"
            />
            <TravelCheckbox
              id="price-premium"
              checked={activeFilters.priceRanges.includes("5000_10000")}
              onChange={(c) => handleCheckboxToggle("priceRanges", "5000_10000", c)}
              label="Premium: ₹5,000 - ₹10,000"
              count="145"
            />
            <TravelCheckbox
              id="price-luxury"
              checked={activeFilters.priceRanges.includes("above_10000")}
              onChange={(c) => handleCheckboxToggle("priceRanges", "above_10000", c)}
              label="Luxury: ₹10,000+"
              count="72"
            />
          </div>
        )}
      </div>

      {/* 4. Guest Rating Filter */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <button
          onClick={() => toggleSection("rating")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#FF8A00]" /> Star Rating &amp; Reviews
          </span>
          {openSections.rating ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.rating && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="rating-45"
              checked={activeFilters.ratings.includes("4.5")}
              onChange={(c) => handleCheckboxToggle("ratings", "4.5", c)}
              label="4.5+ Top Rated / Exceptional"
              count="94"
            />
            <TravelCheckbox
              id="rating-40"
              checked={activeFilters.ratings.includes("4.0")}
              onChange={(c) => handleCheckboxToggle("ratings", "4.0", c)}
              label="4.0+ Very Good"
              count="210"
            />
            <TravelCheckbox
              id="rating-35"
              checked={activeFilters.ratings.includes("3.5")}
              onChange={(c) => handleCheckboxToggle("ratings", "3.5", c)}
              label="3.5+ Good &amp; Value"
              count="85"
            />
          </div>
        )}
      </div>

      {/* 5. Amenities & Facilities */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <button
          onClick={() => toggleSection("amenities")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#10B981]" /> Amenities &amp; Stays
          </span>
          {openSections.amenities ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.amenities && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="amenity-wifi"
              checked={activeFilters.amenities.includes("wifi")}
              onChange={(c) => handleCheckboxToggle("amenities", "wifi", c)}
              label="High-Speed Wi-Fi"
            />
            <TravelCheckbox
              id="amenity-pool"
              checked={activeFilters.amenities.includes("pool")}
              onChange={(c) => handleCheckboxToggle("amenities", "pool", c)}
              label="Swimming Pool"
            />
            <TravelCheckbox
              id="amenity-couple"
              checked={activeFilters.amenities.includes("couple")}
              onChange={(c) => handleCheckboxToggle("amenities", "couple", c)}
              label="Couple Friendly (Local IDs)"
            />
            <TravelCheckbox
              id="amenity-spa"
              checked={activeFilters.amenities.includes("spa")}
              onChange={(c) => handleCheckboxToggle("amenities", "spa", c)}
              label="Ayurvedic Spa &amp; Wellness"
            />
            <TravelCheckbox
              id="amenity-ev"
              checked={activeFilters.amenities.includes("ev")}
              onChange={(c) => handleCheckboxToggle("amenities", "ev", c)}
              label="EV Charging Station"
            />
            <TravelCheckbox
              id="amenity-view"
              checked={activeFilters.amenities.includes("river_view")}
              onChange={(c) => handleCheckboxToggle("amenities", "river_view", c)}
              label="River / Mountain View"
            />
          </div>
        )}
      </div>

      {/* 6. Cancellation Policy */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <button
          onClick={() => toggleSection("cancellation")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#16A34A]" /> Cancellation Policy
          </span>
          {openSections.cancellation ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.cancellation && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="policy-free"
              checked={activeFilters.cancellationPolicies.includes("free_cancellation")}
              onChange={(c) =>
                handleCheckboxToggle("cancellationPolicies", "free_cancellation", c)
              }
              label="100% Free Cancellation"
              subLabel="Full refund up to 24 hours prior"
            />
            <TravelCheckbox
              id="policy-flexi"
              checked={activeFilters.cancellationPolicies.includes("flexible_date")}
              onChange={(c) =>
                handleCheckboxToggle("cancellationPolicies", "flexible_date", c)
              }
              label="Zero Date-Change Fee"
              subLabel="Reschedule anytime with no penalty"
            />
          </div>
        )}
      </div>

      {/* 7. Meal Options */}
      <div className="space-y-3 pb-4 border-b border-[#E2E8F0]">
        <button
          onClick={() => toggleSection("meals")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <Coffee className="w-4 h-4 text-[#FF8A00]" /> Meal Options
          </span>
          {openSections.meals ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.meals && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="meal-breakfast"
              checked={activeFilters.mealOptions.includes("breakfast")}
              onChange={(c) => handleCheckboxToggle("mealOptions", "breakfast", c)}
              label="Free Breakfast Included"
            />
            <TravelCheckbox
              id="meal-all"
              checked={activeFilters.mealOptions.includes("all_meals")}
              onChange={(c) => handleCheckboxToggle("mealOptions", "all_meals", c)}
              label="All Meals (Breakfast + Lunch + Dinner)"
            />
            <TravelCheckbox
              id="meal-pure-veg"
              checked={activeFilters.mealOptions.includes("pure_veg")}
              onChange={(c) => handleCheckboxToggle("mealOptions", "pure_veg", c)}
              label="100% Pure Veg / Jain Kitchen"
            />
          </div>
        )}
      </div>

      {/* 8. Payment Options */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection("payment")}
          className="w-full flex items-center justify-between text-left text-[14px] font-semibold text-[#172033]"
        >
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-[#0B5ED7]" /> Payment Options
          </span>
          {openSections.payment ? (
            <ChevronUp className="w-4 h-4 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#64748B]" />
          )}
        </button>

        {openSections.payment && (
          <div className="space-y-2.5 pt-1">
            <TravelCheckbox
              id="pay-at-hotel"
              checked={activeFilters.paymentOptions.includes("pay_at_hotel")}
              onChange={(c) => handleCheckboxToggle("paymentOptions", "pay_at_hotel", c)}
              label="Pay at Hotel / Check-In"
              subLabel="Reserve with ₹0 upfront"
            />
            <TravelCheckbox
              id="pay-upi-card"
              checked={activeFilters.paymentOptions.includes("instant_upi")}
              onChange={(c) => handleCheckboxToggle("paymentOptions", "instant_upi", c)}
              label="Instant UPI / Credit Card"
              subLabel="Flat 10% instant discount"
            />
            <TravelCheckbox
              id="pay-gst"
              checked={activeFilters.paymentOptions.includes("gst_invoice")}
              onChange={(c) => handleCheckboxToggle("paymentOptions", "gst_invoice", c)}
              label="GST Invoice Included"
              subLabel="Save up to 18% with input credit"
            />
          </div>
        )}
      </div>
    </aside>
  );
};
