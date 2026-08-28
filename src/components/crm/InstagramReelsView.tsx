import React, { useState } from "react";
import {
  Instagram,
  Sparkles,
  Play,
  Calendar,
  Eye,
  Share2,
  Bookmark,
  MessageCircle,
  Heart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Copy,
  Download,
  Film,
  Zap,
  Sliders,
  Filter,
  Check,
  Send,
  ExternalLink,
  Layers,
  Music,
  TrendingUp,
  Tag,
  ArrowUpRight,
} from "lucide-react";
import {
  TravelReel,
  ReelTemplatePreset,
  INITIAL_REELS,
  REEL_TEMPLATE_PRESETS,
} from "../../data/reelsMarketingData";

interface InstagramReelsViewProps {
  onToast: (msg: string) => void;
}

export function InstagramReelsView({ onToast }: InstagramReelsViewProps) {
  const [reels, setReels] = useState<TravelReel[]>(
    INITIAL_REELS.filter((r) => r.platform === "Instagram" || r.platform === "Both (Cross-Post)")
  );
  const [selectedReel, setSelectedReel] = useState<TravelReel>(reels[0] || INITIAL_REELS[0]);
  const [templates] = useState<ReelTemplatePreset[]>(REEL_TEMPLATE_PRESETS);
  const [subTab, setSubTab] = useState<"feed_view" | "ai_idea_generator" | "templates_niche" | "calendar" | "analytics">(
    "feed_view"
  );

  // AI Idea Generator state
  const [targetCategory, setTargetCategory] = useState<
    "Travel packages" | "Hotels & Resorts" | "Pilgrimage & Yatra" | "Flights, Trains, Buses & Cabs"
  >("Pilgrimage & Yatra");
  const [targetDestination, setTargetDestination] = useState("Kedarnath Helicopter & VIP Darshan");
  const [trendingSound, setTrendingSound] = useState("🔱 Shiv Tandav x Lo-Fi Ambient Beat (Trending 3.4M Reels)");
  const [isGenerating, setIsGenerating] = useState(false);

  // Aggregate Metrics
  const totalViews = reels.reduce((acc, r) => acc + r.views, 0);
  const totalSaves = reels.reduce((acc, r) => acc + r.saves, 0);
  const totalLeads = reels.reduce((acc, r) => acc + r.leadsGenerated, 0);
  const totalBookings = reels.reduce((acc, r) => acc + r.bookingConversions, 0);
  const totalAttributedRevenue = reels.reduce((acc, r) => acc + r.revenueAttributedINR, 0);

  // Generate Instagram Reel
  const handleGenerateIgReel = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: TravelReel = {
        id: `REEL-IG-${Date.now().toString().slice(-4)}`,
        title: `How to do ${targetDestination} in Luxury with ZERO Queues 🏔️`,
        platform: "Instagram",
        category:
          targetCategory === "Pilgrimage & Yatra"
            ? "Spiritual Pilgrimage (Yatra)"
            : targetCategory === "Hotels & Resorts"
            ? "Luxury Hotels & Resorts"
            : targetCategory === "Travel packages"
            ? "Destination Highlights"
            : "Flights & Train Secrets",
        status: "Draft",
        scheduledDate: "2026-09-03 20:30",
        targetAudience: "Gen Z & Millennial Explorers, Solo Travelers, Luxury Spiritual Seekers (Age 21-42)",
        destination: targetDestination,
        thumbnailUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
        videoDurationSec: 38,
        aiConcept: `Fast-paced aesthetic vertical cut with sound synchronization. Shows how using the BharatYatra app guarantees verified UCADA helicopter barcode slots and heated 4-star stays.`,
        script: {
          hook0to3s: `POV: You booked your ${targetDestination} in 2 clicks while everyone else is stranded at the helipad... 🚁✨`,
          problemBody3to20s: `Fake agents take advance tokens and disappear with invalid barcodes. Real pilgrims end up trekking 18km in rain.`,
          solutionClimax20to45s: `Here's the secret: BharatYatra is direct-linked with official UCADA biometric check-in. Instant slot confirmation + heated cottage + priority darshan.`,
          callToAction45to60s: `Comment "YATRA" and our AI will DM you the direct 2026 VIP Booking Pass link with ₹1,000 instant cashback! 📲`,
          soundAudioSuggestion: trendingSound,
          visualSceneDirections: [
            "0-3s: Epic slow-motion heli takeoff from Phata helipad above snow-capped Himalayan peaks.",
            "3-15s: Text overlay 'Avoid Counterfeit Tickets' with quick red X alerts.",
            "15-30s: Glowing BharatYatra verification green tick on mobile screen.",
            "30-38s: Aesthetic morning Temple darshan bells with golden sunlight rays.",
          ],
        },
        caption: `Don't get scammed on your dream ${targetDestination} journey! 🕉️🏔️\n\n📌 SAVE this reel for your 2026 travel bucket list.\n\n✨ Why 150k+ pilgrims trust BharatYatra:\n• 100% Authorized UCADA Biometric QR Helipass\n• Heated luxury cottages with oxygen concentrators\n• VIP priority darshan line escort\n• 0% convenience fees on all bookings\n\n💬 Comment "YATRA" or "DARSHAN" below and we'll DM you the private reservation link + ₹1,000 voucher instantly! 👇\n\n🔗 Link in Bio for instant booking!`,
        hashtags: [
          "#BharatYatra",
          "#Kedarnath2026",
          "#CharDhamYatra",
          "#InstagramReels",
          "#ReelsIndia",
          "#LuxuryTravelIndia",
          "#TravelBucketlist",
        ],
        ctaButtonText: "Comment 'YATRA' for DM Link",
        landingPageUrl: `https://bharatyatra.ai/yatra/kedarnath?utm_source=ig_reels&utm_campaign=viral_heli_hack`,
        views: 0,
        reach: 0,
        engagementRate: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        leadsGenerated: 0,
        bookingConversions: 0,
        revenueAttributedINR: 0,
        author: "AI Instagram Creator (Gemini 2.5)",
      };

      setReels([generated, ...reels]);
      setSelectedReel(generated);
      setIsGenerating(false);
      setSubTab("feed_view");
      onToast(`Generated high-retention Instagram Reel package for ${targetDestination}! 🚀`);
    }, 900);
  };

  // Status progression
  const handleUpdateStatus = (reelId: string, newStatus: TravelReel["status"]) => {
    setReels((prev) => prev.map((r) => (r.id === reelId ? { ...r, status: newStatus } : r)));
    if (selectedReel.id === reelId) {
      setSelectedReel((prev) => ({ ...prev, status: newStatus }));
    }
    onToast(`Instagram Reel status updated to "${newStatus}"! ✅`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-pink-950 via-purple-950 to-slate-900 border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 via-rose-500 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg">
            <Instagram className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">Instagram Reels Studio &amp; AI Idea Generator</h3>
              <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-[10px] font-bold">
                @bharatyatra.official
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated trending sounds, high-retention 0-3s visual hooks, auto-DM keyword automation &amp; conversion analytics.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSubTab("ai_idea_generator")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Create Instagram Reel
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Instagram Views</span>
          <div className="text-xl font-black text-white mt-1">{(totalViews / 1000).toLocaleString("en-IN")}k</div>
          <span className="text-[10px] text-pink-400 font-semibold">9.4% Avg Engagement</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Saves &amp; Bookmarks</span>
          <div className="text-xl font-black text-amber-300 mt-1">{totalSaves.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">High Travel Intent</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">DM Auto-Replies &amp; Leads</span>
          <div className="text-xl font-black text-pink-300 mt-1">{totalLeads.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-emerald-400 font-bold">Auto Chatbot Qualified</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Attributed App Bookings</span>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {totalBookings} (₹{(totalAttributedRevenue / 100000).toFixed(1)}L)
          </div>
          <span className="text-[10px] text-slate-400">Direct App Conversions</span>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: "feed_view", label: "Reels Visual Grid & Preview", icon: Instagram, count: reels.length },
          { id: "ai_idea_generator", label: "AI Niche Idea Generator", icon: Sparkles },
          { id: "templates_niche", label: "4-Niche Travel Presets", icon: Layers },
          { id: "calendar", label: "Visual Content Calendar", icon: Calendar },
          { id: "analytics", label: "Reels ROAS Analytics", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md shadow-pink-600/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-700 text-slate-200">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* FEED VIEW SUB-TAB */}
      {subTab === "feed_view" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Reels Grid (Instagram Profile style) */}
            <div className="lg:col-span-1 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Reels Library ({reels.length})
              </span>
              <div className="grid grid-cols-2 gap-2">
                {reels.map((reel) => {
                  const isSelected = selectedReel.id === reel.id;
                  return (
                    <div
                      key={reel.id}
                      onClick={() => setSelectedReel(reel)}
                      className={`relative rounded-xl overflow-hidden aspect-[9/14] border transition-all cursor-pointer group ${
                        isSelected
                          ? "border-pink-500 ring-2 ring-pink-500 shadow-xl"
                          : "border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <img
                        src={reel.thumbnailUrl}
                        alt={reel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-2 flex flex-col justify-between">
                        <span
                          className={`self-start px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                            reel.status === "Published"
                              ? "bg-emerald-500/80 text-white"
                              : reel.status === "Scheduled"
                              ? "bg-blue-500/80 text-white"
                              : "bg-amber-500/80 text-white"
                          }`}
                        >
                          {reel.status}
                        </span>

                        <div>
                          <p className="text-[10px] font-bold text-white line-clamp-2">{reel.title}</p>
                          <div className="flex items-center justify-between text-[9px] text-pink-300 font-semibold mt-1">
                            <span>{(reel.views / 1000).toFixed(0)}k plays</span>
                            <span>{reel.saves} saves</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Reel Detailed Instagram Mockup */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-pink-900/60 text-pink-300 border border-pink-700/60 text-[10px] font-bold">
                        {selectedReel.category}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">Duration: {selectedReel.videoDurationSec}s</span>
                    </div>
                    <h3 className="text-base font-black text-white mt-1">{selectedReel.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={selectedReel.status}
                      onChange={(e) => handleUpdateStatus(selectedReel.id, e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none"
                    >
                      <option value="Draft">Draft</option>
                      <option value="In Review">In Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Trending Audio Tag */}
                <div className="p-2.5 rounded-xl bg-pink-950/40 border border-pink-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-pink-200">
                    <Music className="w-4 h-4 text-pink-400 shrink-0 animate-pulse" />
                    <span>Trending Audio: <strong className="text-white">{selectedReel.script.soundAudioSuggestion}</strong></span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-pink-900 text-[9px] font-bold text-pink-300 uppercase">
                    Viral Beat
                  </span>
                </div>

                {/* Script Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-black text-pink-400 uppercase">🔥 0-3s Visual Hook (Stop Scroll)</span>
                    <p className="font-semibold text-white">{selectedReel.script.hook0to3s}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-black text-indigo-300 uppercase">⚡ 3-20s High-Retention Story</span>
                    <p className="text-slate-300">{selectedReel.script.problemBody3to20s}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-black text-emerald-400 uppercase">💎 20-30s Secret / Reveal</span>
                    <p className="text-slate-300">{selectedReel.script.solutionClimax20to45s}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <span className="text-[10px] font-black text-amber-400 uppercase">📩 30-38s Auto-DM Trigger CTA</span>
                    <p className="font-semibold text-white">{selectedReel.script.callToAction45to60s}</p>
                  </div>
                </div>

                {/* Instagram Caption & Auto-DM Trigger */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Instagram Caption &amp; Micro-Copy</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${selectedReel.caption}\n\n${selectedReel.hashtags.join(" ")}`);
                        onToast("Copied Instagram caption & hashtags! 📋");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-pink-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy Caption
                    </button>
                  </div>
                  <pre className="text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {selectedReel.caption}
                  </pre>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {selectedReel.hashtags.map((h, i) => (
                      <span key={i} className="text-xs text-pink-400 font-semibold font-mono">
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI IDEA GENERATOR SUB-TAB */}
      {subTab === "ai_idea_generator" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-400" />
                AI Instagram Viral Reel Concept Generator
              </h3>
              <p className="text-xs text-slate-400">
                Tailored for high algorithmic reach on Indian travel Reels with viral sound hooks, automated DM lead triggers, and high conversion landing URLs.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Travel Niche Category</label>
                <select
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Pilgrimage & Yatra">1. Pilgrimage &amp; Yatra (Char Dham, Jyotirlinga, Temples)</option>
                  <option value="Hotels & Resorts">2. Hotels &amp; Resorts (Luxury, Heritage, Boutique, Villas)</option>
                  <option value="Travel packages">3. Travel Packages &amp; Secret Itineraries</option>
                  <option value="Flights, Trains, Buses & Cabs">4. Flights, Trains, Buses, Cabs &amp; Houseboats</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Destination / Experience</label>
                <input
                  type="text"
                  value={targetDestination}
                  onChange={(e) => setTargetDestination(e.target.value)}
                  placeholder="e.g. Udaipur Lake Pichola Luxury Palace Stay"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">Trending Instagram Audio Pairing</label>
                <input
                  type="text"
                  value={trendingSound}
                  onChange={(e) => setTrendingSound(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={isGenerating}
                onClick={handleGenerateIgReel}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Generating Viral Concept..." : "Generate Instagram Reel Package"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4-NICHE TRAVEL PRESETS SUB-TAB */}
      {subTab === "templates_niche" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-pink-300 uppercase">
                    {tpl.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{tpl.typicalDuration}</span>
                </div>

                <h4 className="text-sm font-black text-white">{tpl.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{tpl.description}</p>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] text-amber-400 font-bold block uppercase">Visual 3s Hook:</span>
                  <p className="text-slate-200 italic mt-0.5">"{tpl.exampleHook}"</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {tpl.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[9px] text-slate-300 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setTargetDestination(tpl.name);
                      setSubTab("ai_idea_generator");
                      onToast(`Preset "${tpl.name}" loaded into Instagram AI Studio!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Use Preset
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VISUAL CONTENT CALENDAR SUB-TAB */}
      {subTab === "calendar" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-white">Instagram Reels Content Calendar</h3>
                <p className="text-xs text-slate-400">Scheduled publishing dates across optimal evening peak engagement hours (7:30 PM - 9:30 PM IST).</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                Auto-Publishing Active
              </span>
            </div>

            <div className="space-y-3">
              {reels.map((reel) => (
                <div key={reel.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={reel.thumbnailUrl} alt={reel.title} className="w-12 h-16 rounded-lg object-cover shrink-0" />
                    <div>
                      <span className="text-[9px] text-pink-400 font-bold uppercase block">{reel.category}</span>
                      <h5 className="text-xs font-bold text-white">{reel.title}</h5>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-indigo-300" />
                        Scheduled: {reel.scheduledDate}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase shrink-0 ${
                      reel.status === "Published"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : reel.status === "Scheduled"
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {reel.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS SUB-TAB */}
      {subTab === "analytics" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Instagram Reel</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Likes &amp; Comments</th>
                  <th className="p-3">Saves (Intent)</th>
                  <th className="p-3">DM Leads</th>
                  <th className="p-3">Bookings</th>
                  <th className="p-3 text-right">Attributed Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reels.map((reel) => (
                  <tr key={reel.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white max-w-xs truncate">{reel.title}</td>
                    <td className="p-3 text-pink-300">{reel.category}</td>
                    <td className="p-3 font-mono">{(reel.views / 1000).toFixed(0)}k</td>
                    <td className="p-3 text-slate-300">
                      {reel.likes} / {reel.comments}
                    </td>
                    <td className="p-3 text-amber-300 font-bold">{reel.saves}</td>
                    <td className="p-3 text-pink-300 font-semibold">{reel.leadsGenerated}</td>
                    <td className="p-3 text-white font-bold">{reel.bookingConversions}</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">
                      ₹{(reel.revenueAttributedINR / 100000).toFixed(1)}L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
