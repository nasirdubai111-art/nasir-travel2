import React, { useState } from "react";
import {
  Image as ImageIcon,
  Sparkles,
  Sliders,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Download,
  Layers,
  Tag,
  Palette,
  Eye,
  Check,
  RotateCcw,
  Square,
  Smartphone,
  Tv,
  Layout,
  Plus,
  Share2,
  FolderDown,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";
import {
  ThumbnailCategory,
  AspectRatioType,
  ThumbnailCreativeItem,
  ThumbnailTemplatePreset,
  THUMBNAIL_TEMPLATES,
  INITIAL_CREATIVE_ITEMS,
} from "../../data/aiThumbnailData";

interface AiThumbnailGeneratorViewProps {
  onToast: (msg: string) => void;
}

export function AiThumbnailGeneratorView({ onToast }: AiThumbnailGeneratorViewProps) {
  const [creatives, setCreatives] = useState<ThumbnailCreativeItem[]>(INITIAL_CREATIVE_ITEMS);
  const [selectedCreative, setSelectedCreative] = useState<ThumbnailCreativeItem>(INITIAL_CREATIVE_ITEMS[0]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All");

  // Generator / Customizer Live State
  const [title, setTitle] = useState(selectedCreative.title);
  const [subtitle, setSubtitle] = useState(selectedCreative.subtitle);
  const [priceTag, setPriceTag] = useState(selectedCreative.priceTagText || "");
  const [discountBadge, setDiscountBadge] = useState(selectedCreative.discountBadgeText || "");
  const [ctaText, setCtaText] = useState(selectedCreative.ctaText);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>(selectedCreative.aspectRatio);
  const [themeStyle, setThemeStyle] = useState(selectedCreative.themeStyle);
  const [brandLogoVisible, setBrandLogoVisible] = useState(selectedCreative.brandLogoVisible);
  const [brandLogoPosition, setBrandLogoPosition] = useState(selectedCreative.brandLogoPosition);
  const [imageUrl, setImageUrl] = useState(selectedCreative.imageUrl);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Sync edits when selectedCreative changes
  const handleSelectCreative = (item: ThumbnailCreativeItem) => {
    setSelectedCreative(item);
    setTitle(item.title);
    setSubtitle(item.subtitle);
    setPriceTag(item.priceTagText || "");
    setDiscountBadge(item.discountBadgeText || "");
    setCtaText(item.ctaText);
    setAspectRatio(item.aspectRatio);
    setThemeStyle(item.themeStyle);
    setBrandLogoVisible(item.brandLogoVisible);
    setBrandLogoPosition(item.brandLogoPosition);
    setImageUrl(item.imageUrl);
  };

  // Apply template preset
  const handleApplyTemplate = (tmpl: ThumbnailTemplatePreset) => {
    setTitle(tmpl.headlinePattern);
    setDiscountBadge(tmpl.defaultBadge);
    setCtaText(tmpl.defaultCta);
    setAspectRatio(tmpl.recommendedAspectRatio);
    setThemeStyle(tmpl.defaultTheme);
    setImageUrl(tmpl.sampleImage);
    onToast(`Applied template: ${tmpl.name} 🎨`);
  };

  // Save current thumbnail changes
  const handleSaveAndSubmit = (status: "Pending_Approval" | "Approved" | "Draft") => {
    const updated: ThumbnailCreativeItem = {
      ...selectedCreative,
      title,
      subtitle,
      priceTagText: priceTag,
      discountBadgeText: discountBadge,
      ctaText,
      aspectRatio,
      themeStyle,
      brandLogoVisible,
      brandLogoPosition,
      imageUrl,
      status,
      versionsCount: selectedCreative.versionsCount + 1,
    };

    setCreatives((prev) => prev.map((c) => (c.id === selectedCreative.id ? updated : c)));
    setSelectedCreative(updated);
    onToast(`Creative ${updated.id} saved as ${status.replace("_", " ")}! 🚀`);
  };

  // AI Re-generation
  const handleAiRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      const randomImages = [
        "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
      ];
      const newImg = randomImages[Math.floor(Math.random() * randomImages.length)];
      setImageUrl(newImg);
      onToast("AI synthesized new visual layer & lighting composition! ✨");
    }, 600);
  };

  const categories = [
    "All",
    "Pilgrimage",
    "Resort",
    "Tour Package",
    "Instagram Reel Cover",
    "Facebook Reel Cover",
    "Flight Offer",
    "Train Offer",
    "Bus Offer",
    "Festival Creative",
    "Blog Thumbnail",
    "Advertisement Creative",
  ];

  const filteredCreatives = creatives.filter(
    (c) => selectedCategoryFilter === "All" || c.category === selectedCategoryFilter
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 border border-teal-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600/30 border border-teal-500/40 flex items-center justify-center text-teal-400 shrink-0">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">AI Travel Thumbnail &amp; Creative Studio</h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-bold">
                13 Categories &amp; Reel Covers
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated text overlays, brand logo placement, aspect ratio presets, version history &amp; admin approval pipeline.
            </p>
          </div>
        </div>

        {/* Pipeline Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-700/80 shrink-0">
          <span className="text-teal-400">Travel Data</span>
          <span>→</span>
          <span className="text-indigo-400">AI Creative Engine</span>
          <span>→</span>
          <span className="text-amber-400">Admin Preview</span>
          <span>→</span>
          <span className="text-emerald-400 font-black">Content Library</span>
        </div>
      </div>

      {/* Main Studio 2-Column: Left Customizer & Right Interactive Live Canvas Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Controls, Templates & Overlays (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Templates */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
              1-Click Creative Templates:
            </span>
            <div className="grid grid-cols-2 gap-2">
              {THUMBNAIL_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => handleApplyTemplate(tmpl)}
                  className="p-2 rounded-xl bg-slate-900/90 hover:bg-slate-700 border border-slate-700 text-left transition-colors cursor-pointer"
                >
                  <span className="text-[9px] font-bold uppercase text-teal-400 block truncate">{tmpl.category}</span>
                  <strong className="text-xs text-white font-semibold block truncate">{tmpl.name}</strong>
                </button>
              ))}
            </div>
          </div>

          {/* Form Controls */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-teal-400" />
                <span>Creative Overlay Controls</span>
              </h4>
              <button
                onClick={handleAiRegenerate}
                disabled={isRegenerating}
                className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRegenerating ? "animate-spin" : ""}`} />
                <span>AI Regenerate</span>
              </button>
            </div>

            {/* Aspect Ratio Presets */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Aspect Ratio Format</label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { ratio: "1:1", label: "1:1 Feed" },
                  { ratio: "9:16", label: "9:16 Reel" },
                  { ratio: "4:5", label: "4:5 Port." },
                  { ratio: "16:9", label: "16:9 Ban." },
                  { ratio: "1.91:1", label: "Meta Ad" },
                ].map((r) => (
                  <button
                    key={r.ratio}
                    onClick={() => setAspectRatio(r.ratio as any)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer ${
                      aspectRatio === r.ratio
                        ? "bg-teal-600 text-white shadow-md shadow-teal-600/30"
                        : "bg-slate-900 text-slate-400 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Main Headline Text</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Subtitle / Key Inclusions</label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Price Badge (e.g. ₹24,999)</label>
                <input
                  type="text"
                  value={priceTag}
                  onChange={(e) => setPriceTag(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Discount Tag (e.g. 25% OFF)</label>
                <input
                  type="text"
                  value={discountBadge}
                  onChange={(e) => setDiscountBadge(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">Theme Palette</label>
                <select
                  value={themeStyle}
                  onChange={(e) => setThemeStyle(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="spiritual_saffron">Spiritual Saffron &amp; Gold</option>
                  <option value="luxury_gold">Luxury 5-Star Gold</option>
                  <option value="gradient_dark">Cyber Dark Gradient</option>
                  <option value="adventure_neon">Adventure Neon Emerald</option>
                  <option value="vibrant_festival">Vibrant Festival Crimson</option>
                  <option value="minimal_clean">Minimalist Modern White</option>
                </select>
              </div>
            </div>

            {/* Brand Logo Toggle */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <div>
                  <span className="text-xs font-bold text-white block">Official BharatYatra Brand Seal</span>
                  <span className="text-[10px] text-slate-400">Embed verified holographic watermark</span>
                </div>
              </div>
              <button
                onClick={() => setBrandLogoVisible(!brandLogoVisible)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  brandLogoVisible ? "bg-teal-600 text-white" : "bg-slate-800 text-slate-400"
                }`}
              >
                {brandLogoVisible ? "ON" : "OFF"}
              </button>
            </div>

            {/* Save / Approve Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleSaveAndSubmit("Approved")}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Check className="w-4 h-4" />
                <span>Admin Approve &amp; Push</span>
              </button>
              <button
                onClick={() => handleSaveAndSubmit("Draft")}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Save Draft
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Interactive Thumbnail Canvas & Library (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                  Live Canvas Preview ({aspectRatio})
                </h4>
                <span className="text-[11px] text-slate-400">{selectedCreative.destination} • Version v{selectedCreative.versionsCount}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                selectedCreative.status === "Approved"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}>
                {selectedCreative.status.replace("_", " ")}
              </span>
            </div>

            {/* LIVE CANVAS CONTAINER */}
            <div className="w-full flex justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 overflow-hidden">
              <div
                className={`relative overflow-hidden rounded-2xl shadow-2xl transition-all ${
                  aspectRatio === "9:16"
                    ? "w-64 h-[440px]"
                    : aspectRatio === "4:5"
                    ? "w-72 h-[360px]"
                    : aspectRatio === "16:9"
                    ? "w-full max-w-md h-[250px]"
                    : aspectRatio === "1.91:1"
                    ? "w-full max-w-md h-[225px]"
                    : "w-80 h-80"
                }`}
              >
                {/* Background Image */}
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-full object-cover filter brightness-90 transform hover:scale-105 transition-transform duration-700"
                />

                {/* Theme Overlay Gradients */}
                <div
                  className={`absolute inset-0 ${
                    themeStyle === "spiritual_saffron"
                      ? "bg-gradient-to-t from-orange-950 via-slate-950/60 to-transparent"
                      : themeStyle === "luxury_gold"
                      ? "bg-gradient-to-t from-amber-950 via-slate-950/60 to-transparent"
                      : themeStyle === "adventure_neon"
                      ? "bg-gradient-to-t from-emerald-950 via-slate-950/60 to-transparent"
                      : themeStyle === "vibrant_festival"
                      ? "bg-gradient-to-t from-rose-950 via-slate-950/60 to-transparent"
                      : "bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"
                  }`}
                />

                {/* Brand Logo Watermark */}
                {brandLogoVisible && (
                  <div
                    className={`absolute p-2.5 z-10 ${
                      brandLogoPosition === "top_left"
                        ? "top-2 left-2"
                        : brandLogoPosition === "top_right"
                        ? "top-2 right-2"
                        : brandLogoPosition === "bottom_left"
                        ? "bottom-2 left-2"
                        : "bottom-2 right-2"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/20 text-white text-[10px] font-black tracking-wider">
                      <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-[8px] font-bold">
                        BY
                      </div>
                      <span>BHARAT YATRA</span>
                    </div>
                  </div>
                )}

                {/* Discount Badge Tag */}
                {discountBadge && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                      {discountBadge}
                    </span>
                  </div>
                )}

                {/* Bottom Overlay Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 z-10 space-y-1.5">
                  {priceTag && (
                    <div className="inline-block px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] uppercase shadow">
                      {priceTag}
                    </div>
                  )}

                  <h3 className="text-white font-black text-sm sm:text-base leading-snug drop-shadow-md line-clamp-2">
                    {title}
                  </h3>

                  {subtitle && (
                    <p className="text-[11px] text-slate-200 font-medium line-clamp-1 drop-shadow">
                      {subtitle}
                    </p>
                  )}

                  {ctaText && (
                    <div className="pt-1">
                      <button className="px-3.5 py-1.5 rounded-lg bg-white text-slate-950 font-extrabold text-xs shadow-xl flex items-center gap-1">
                        <span>{ctaText}</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Creative Metadata ribbon */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs text-slate-300 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <span>Dimensions: <strong className="text-white font-mono">{selectedCreative.dimensions}</strong></span>
                <span>Format: <strong className="text-teal-400">PNG (Lossless 4K)</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToast("Exported High-Res PNG creative to Content Library! 📁")}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-teal-400" />
                  Download PNG
                </button>
              </div>
            </div>
          </div>

          {/* CREATIVE ASSET LIBRARY */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-300">
                Creative Asset Library ({filteredCreatives.length})
              </h4>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      selectedCategoryFilter === cat
                        ? "bg-teal-600 text-white"
                        : "bg-slate-900 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredCreatives.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectCreative(item)}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    selectedCreative.id === item.id
                      ? "bg-teal-950/40 border-teal-500 shadow-md"
                      : "bg-slate-900/90 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="relative h-24 rounded-lg overflow-hidden mb-2">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-white text-[9px] font-bold">
                      {item.aspectRatio}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-teal-400 uppercase block truncate">{item.category}</span>
                  <strong className="text-xs text-white font-semibold block truncate">{item.title}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
