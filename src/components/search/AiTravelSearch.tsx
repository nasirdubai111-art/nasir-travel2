import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  ArrowRight,
  MapPin,
  Calendar,
  X,
  Plane,
  Train,
  Bus,
  Building2,
  TreePine,
  Palmtree,
  Landmark,
  Compass,
  Zap,
} from "lucide-react";
import { ServiceCategory } from "../../types";
import {
  parseNaturalLanguageTravelQuery,
  SAMPLE_AI_QUERIES,
  ParsedTravelIntent,
} from "../../utils/aiIntentParser";

export interface AiTravelSearchProps {
  onExecuteIntent: (intent: ParsedTravelIntent) => void;
  onOpenAIDrawer: (initialPrompt?: string) => void;
  activeCategory?: ServiceCategory;
  onSelectCategory?: (category: ServiceCategory) => void;
  currentLocationName?: string;
  className?: string;
}

export function AiTravelSearch({
  onExecuteIntent,
  onOpenAIDrawer,
  activeCategory = "all",
  onSelectCategory,
  currentLocationName = "New Delhi",
  className = "",
}: AiTravelSearchProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [liveIntent, setLiveIntent] = useState<ParsedTravelIntent | null>(null);

  useEffect(() => {
    if (query.trim().length > 3) {
      const parsed = parseNaturalLanguageTravelQuery(query);
      setLiveIntent(parsed);
    } else {
      setLiveIntent(null);
    }
  }, [query]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) {
      // Default: open AI Drawer with general prompt
      onOpenAIDrawer();
      return;
    }

    const intent = parseNaturalLanguageTravelQuery(query);
    onExecuteIntent(intent);
  };

  const handleSelectSampleQuery = (sampleText: string) => {
    setQuery(sampleText);
    const intent = parseNaturalLanguageTravelQuery(sampleText);
    setLiveIntent(intent);
    onExecuteIntent(intent);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-3 ${className}`}>
      {/* Search Input Container */}
      <form
        onSubmit={handleSearchSubmit}
        className={`relative bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 shadow-lg ${
          isFocused
            ? "border-[#1B4332] ring-4 ring-[#1B4332]/10 shadow-xl"
            : "border-[#E8E5DD] hover:border-[#2D6A4F]/60"
        }`}
      >
        <div className="flex items-center px-4 sm:px-6 py-3.5 sm:py-4 gap-3">
          {/* AI Sparkle Icon Indicator */}
          <div className="w-10 h-10 rounded-xl bg-[#E8F5E9] border border-[#C8E6C9] flex items-center justify-center text-[#1B4332] shrink-0">
            <Sparkles className="w-5 h-5 text-[#2D6A4F] animate-pulse" />
          </div>

          {/* Text Input */}
          <div className="flex-1 min-w-0">
            <label htmlFor="ai-travel-search-input" className="block text-[11px] font-bold text-[#2D6A4F] uppercase tracking-wider">
              Travel Search • Natural Language
            </label>
            <input
              id="ai-travel-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Where do you want to go? e.g. Find a bus from Bangalore to Chennai, hotels in Goa..."
              className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#1B4332] placeholder:text-[#8A978E] placeholder:font-normal focus:outline-none truncate"
            />
          </div>

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setLiveIntent(null);
              }}
              className="p-1 rounded-full text-[#6A786E] hover:text-[#1B4332] hover:bg-[#FAF9F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Action CTA Button */}
          <button
            type="submit"
            className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#1B4332] hover:bg-[#143225] text-white text-xs sm:text-sm font-bold shadow-md shadow-[#1B4332]/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Live Detected Intent Feedback Banner */}
        {liveIntent && (
          <div className="px-4 sm:px-6 py-2.5 bg-[#FAF9F5] border-t border-[#F0EDE6] rounded-b-2xl sm:rounded-b-3xl flex flex-wrap items-center justify-between gap-2 text-xs text-[#1B4332]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping" />
              <span className="font-semibold text-[#6A786E]">Detected Intent:</span>
              <span className="font-bold text-[#1B4332] bg-white px-2 py-0.5 rounded border border-[#E8E5DD]">
                {liveIntent.displayText}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleSearchSubmit()}
              className="text-[11px] font-bold text-[#2D6A4F] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Go to {liveIntent.category ? liveIntent.category.toUpperCase() : "PAGE"}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </form>

      {/* Instant Prompt Inspiration Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
        <span className="text-[11px] font-bold text-[#6A786E] shrink-0 uppercase tracking-wider flex items-center gap-1">
          <Zap className="w-3 h-3 text-[#2D6A4F]" />
          Try asking:
        </span>
        {SAMPLE_AI_QUERIES.map((sample, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleSelectSampleQuery(sample)}
            className="px-3 py-1 rounded-full bg-white/90 hover:bg-[#E8F5E9] hover:border-[#2D6A4F] text-[#2D3A30] hover:text-[#1B4332] text-[11px] font-medium border border-[#E8E5DD] whitespace-nowrap transition-all shadow-2xs cursor-pointer"
          >
            &quot;{sample}&quot;
          </button>
        ))}
      </div>
    </div>
  );
}
