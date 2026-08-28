import React, { useState } from "react";
import {
  Sparkles,
  Play,
  Calendar,
  Eye,
  Share2,
  Bookmark,
  MessageCircle,
  ThumbsUp,
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
  Tag,
  TrendingUp,
} from "lucide-react";
import {
  TravelReel,
  ReelTemplatePreset,
  INITIAL_REELS,
  REEL_TEMPLATE_PRESETS,
} from "../../data/reelsMarketingData";

interface FacebookReelsViewProps {
  onToast: (msg: string) => void;
}

export function FacebookReelsView({ onToast }: FacebookReelsViewProps) {
  const [reels, setReels] = useState<TravelReel[]>(INITIAL_REELS.filter((r) => r.platform === "Facebook" || r.platform === "Both (Cross-Post)"));
  const [selectedReel, setSelectedReel] = useState<TravelReel>(reels[0] || INITIAL_REELS[0]);
  const [templates] = useState<ReelTemplatePreset[]>(REEL_TEMPLATE_PRESETS);
  const [subTab, setSubTab] = useState<"library" | "ai_studio" | "templates" | "performance">("library");

  // AI Reel Studio generator state
  const [promptDestination, setPromptDestination] = useState("Varanasi Ganga Aarti & Ghats");
  const [promptNiche, setPromptNiche] = useState<TravelReel["category"]>("Spiritual Pilgrimage (Yatra)");
  const [promptOffer, setPromptOffer] = useState("Flat ₹1,500 off on VIP Boat Aarti & 4-Star Heritage Stays");
  const [isGenerating, setIsGenerating] = useState(false);

  // Stats
  const totalViews = reels.reduce((acc, r) => acc + r.views, 0);
  const totalLeads = reels.reduce((acc, r) => acc + r.leadsGenerated, 0);
  const totalBookings = reels.reduce((acc, r) => acc + r.bookingConversions, 0);
  const totalAttributedRevenue = reels.reduce((acc, r) => acc + r.revenueAttributedINR, 0);

  // Generate AI Reel
  const handleGenerateAiReel = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: TravelReel = {
        id: `REEL-FB-${Date.now().toString().slice(-4)}`,
        title: `Experience ${promptDestination}: Insider VIP Guide`,
        platform: "Facebook",
        category: promptNiche,
        status: "Draft",
        scheduledDate: "2026-09-02 19:00",
        targetAudience: "Facebook Travel Community, Heritage Travelers, Family Groups (Age 25-58)",
        destination: promptDestination,
        thumbnailUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
        videoDurationSec: 52,
        aiConcept: `Cinematic drone opening of ${promptDestination} sunset rituals, focusing on avoiding crowded queues and booking verified VIP passes on BharatYatra.`,
        script: {
          hook0to3s: `Stop booking random boatmen in ${promptDestination}! Here is how to get front-row VIP Aarti view... 🪔✨`,
          problemBody3to20s: `Most tourists wait 3 hours in extreme crowds or pay 4x inflated prices at the ghat stairs without reserved seating.`,
          solutionClimax20to45s: `With BharatYatra's verified spiritual pass, you get a double-decker electric boat seat with Vedic scholar commentary and traditional Banarasi thali.`,
          callToAction45to60s: `Special Offer: ${promptOffer}! Tap the link below to book your verified VIP pass on the BharatYatra SuperApp today.`,
          soundAudioSuggestion: "Devotional Vedic Chants with Ambient Flute & Sitar Reverberation (110 BPM)",
          visualSceneDirections: [
            "0-3s: Thousand floating earthen diyas glowing in evening river currents.",
            "3-20s: Split view of crowded stairs vs clean double-decker VIP boat deck.",
            "20-42s: Close-up of brass Aarti lamps rotating in sacred rhythm.",
            "42-52s: BharatYatra App interface showing instant confirmed reservation badge.",
          ],
        },
        caption: `Save this before planning your spiritual trip to ${promptDestination}! 🕉️🌊\n\nExperience the ancient rituals in serenity with guaranteed VIP front-row seating:\n✨ Verified government authorized electric boats\n✨ 0% convenience fees & instant GST invoice\n✨ Complimentary traditional prasad & Vedic guide\n\n🎉 Limited Offer: ${promptOffer}!\n\nTap Learn More below to reserve direct on the BharatYatra App! 📲`,
        hashtags: ["#BharatYatra", "#IncredibleIndia", "#FacebookReels", "#SpiritualIndia", "#TravelReels", "#HeritageIndia"],
        ctaButtonText: "Book VIP Boat Pass",
        landingPageUrl: `https://bharatyatra.ai/tours?destination=${encodeURIComponent(promptDestination)}&utm_source=fb_reels`,
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
        author: "AI Reel Producer (Gemini 2.5)",
      };

      setReels([generated, ...reels]);
      setSelectedReel(generated);
      setIsGenerating(false);
      setSubTab("library");
      onToast(`AI generated complete Reel concept, script, caption & hashtags for ${promptDestination}! 🎬`);
    }, 900);
  };

  // Status progression
  const handleUpdateStatus = (reelId: string, newStatus: TravelReel["status"]) => {
    setReels((prev) => prev.map((r) => (r.id === reelId ? { ...r, status: newStatus } : r)));
    if (selectedReel.id === reelId) {
      setSelectedReel((prev) => ({ ...prev, status: newStatus }));
    }
    onToast(`Reel status moved to "${newStatus}"! ✅`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">Facebook Reels Studio &amp; Content Engine</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                Admin-Only Content Hub
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              AI-generated Reel concepts, viral 3s hooks, 60s script breakdowns, micro-blog captions, hashtags &amp; booking attribution.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSubTab("ai_studio")}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          AI Reel Generator
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Facebook Reel Views</span>
          <div className="text-xl font-black text-white mt-1">{(totalViews / 1000).toLocaleString("en-IN")}k</div>
          <span className="text-[10px] text-blue-400">Viral Reach</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Leads Generated</span>
          <div className="text-xl font-black text-pink-300 mt-1">{totalLeads.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">Direct Inquiries</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Attributed Bookings</span>
          <div className="text-xl font-black text-emerald-400 mt-1">{totalBookings.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-emerald-400">Confirmed PNRs</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Gross Attributed Revenue</span>
          <div className="text-xl font-black text-indigo-300 mt-1">₹{(totalAttributedRevenue / 100000).toFixed(1)}L</div>
          <span className="text-[10px] text-slate-400">Organic &amp; Boosted Reels</span>
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: "library", label: "Reels Library & Previews", icon: Film, count: reels.length },
          { id: "ai_studio", label: "AI Concept & Script Studio", icon: Sparkles },
          { id: "templates", label: "Travel Destination Templates", icon: Layers, count: templates.length },
          { id: "performance", label: "Lead & Conversion Attribution", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
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

      {/* REELS LIBRARY SUB-TAB */}
      {subTab === "library" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Reel Cards */}
            <div className="lg:col-span-1 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Facebook Reels Queue ({reels.length})
              </span>
              {reels.map((reel) => {
                const isSelected = selectedReel.id === reel.id;
                return (
                  <div
                    key={reel.id}
                    onClick={() => setSelectedReel(reel)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                      isSelected
                        ? "bg-blue-950/50 border-blue-500 ring-1 ring-blue-400 shadow-lg"
                        : "bg-slate-800/70 border-slate-700/80 hover:bg-slate-800"
                    }`}
                  >
                    <img
                      src={reel.thumbnailUrl}
                      alt={reel.title}
                      className="w-14 h-20 rounded-lg object-cover shrink-0 border border-slate-700 shadow-inner"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 rounded bg-slate-900 text-[9px] font-bold text-blue-300">
                          {reel.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
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
                      <h4 className="text-xs font-black text-white mt-1 line-clamp-1">{reel.title}</h4>
                      <span className="text-[10px] text-slate-400 mt-0.5 block truncate">
                        {reel.destination} • {reel.videoDurationSec}s
                      </span>
                      {reel.views > 0 && (
                        <span className="text-[10px] text-emerald-400 font-bold mt-1 block">
                          {(reel.views / 1000).toFixed(0)}k Views • {reel.bookingConversions} Bookings
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Reel Detailed View (9:16 Mockup & Full Script) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/60 text-[10px] font-bold">
                        {selectedReel.category}
                      </span>
                      <span className="text-xs text-slate-400">Created by {selectedReel.author}</span>
                    </div>
                    <h3 className="text-base font-black text-white mt-1">{selectedReel.title}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Target Audience: <strong className="text-slate-200">{selectedReel.targetAudience}</strong>
                    </div>
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

                {/* 4-Step Script Breakdown */}
                <div className="space-y-2.5 pt-1">
                  <h4 className="text-xs font-black text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Script Breakdown &amp; Directing Timings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs text-slate-300">
                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-black text-amber-400 uppercase">⚡ 0 - 3s (Viral Hook)</span>
                      <p className="font-semibold text-white">{selectedReel.script.hook0to3s}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-black text-indigo-300 uppercase">🎯 3 - 20s (Problem &amp; Context)</span>
                      <p className="text-slate-300">{selectedReel.script.problemBody3to20s}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-black text-emerald-400 uppercase">✨ 20 - 45s (Solution &amp; Climax)</span>
                      <p className="text-slate-300">{selectedReel.script.solutionClimax20to45s}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-black text-pink-400 uppercase">📲 45 - 60s (Call To Action CTA)</span>
                      <p className="font-semibold text-white">{selectedReel.script.callToAction45to60s}</p>
                    </div>
                  </div>
                </div>

                {/* Audio suggestion & visual directions */}
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Suggested Sound / Audio:</span>
                    <strong className="text-indigo-300">{selectedReel.script.soundAudioSuggestion}</strong>
                  </div>

                  <div className="border-t border-slate-800 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Scene-by-Scene Visual Directions:</span>
                    <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                      {selectedReel.script.visualSceneDirections.map((dir, i) => (
                        <li key={i}>{dir}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Caption & Hashtags */}
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Facebook Reel Caption &amp; Hashtags</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`${selectedReel.caption}\n\n${selectedReel.hashtags.join(" ")}`);
                        onToast("Copied caption and hashtags to clipboard! 📋");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
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
                      <span key={i} className="text-xs text-blue-400 font-semibold font-mono">
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

      {/* AI REEL GENERATOR STUDIO SUB-TAB */}
      {subTab === "ai_studio" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                AI Viral Reel Concept &amp; Script Generator
              </h3>
              <p className="text-xs text-slate-400">
                Generate 4-tier viral retention scripts, micro-blog captions, hashtag bundles, and scene camera directions tailored for Facebook travelers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Destination / Landmark</label>
                <input
                  type="text"
                  value={promptDestination}
                  onChange={(e) => setPromptDestination(e.target.value)}
                  placeholder="e.g. Kashmir Gulmarg Gondola Ride"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Travel Niche / Category</label>
                <select
                  value={promptNiche}
                  onChange={(e) => setPromptNiche(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Destination Highlights">Destination Highlights</option>
                  <option value="Spiritual Pilgrimage (Yatra)">Spiritual Pilgrimage (Yatra)</option>
                  <option value="Luxury Hotels & Resorts">Luxury Hotels &amp; Resorts</option>
                  <option value="Flash Deals & Offers">Flash Deals &amp; Offers</option>
                  <option value="Flights & Train Secrets">Flights &amp; Train Secrets</option>
                  <option value="Adventure & Trekking">Adventure &amp; Trekking</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-300 block mb-1">Promotional Offer / Incentive</label>
                <input
                  type="text"
                  value={promptOffer}
                  onChange={(e) => setPromptOffer(e.target.value)}
                  placeholder="e.g. Flat ₹1,200 Cashback + Free Airport Transfer on BharatYatra App"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                disabled={isGenerating}
                onClick={handleGenerateAiReel}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 transition-all shadow-lg cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
                {isGenerating ? "Synthesizing Viral Script..." : "Generate Facebook Reel Package"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES SUB-TAB */}
      {subTab === "templates" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div key={tpl.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-blue-300 uppercase">
                    {tpl.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{tpl.typicalDuration}</span>
                </div>

                <h4 className="text-sm font-black text-white">{tpl.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{tpl.description}</p>

                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                  <span className="text-[10px] text-amber-400 font-bold block uppercase">Example Hook:</span>
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
                      setPromptNiche(tpl.category);
                      setSubTab("ai_studio");
                      onToast(`Loaded template "${tpl.name}" into AI Studio!`);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Use Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PERFORMANCE SUB-TAB */}
      {subTab === "performance" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Reel Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Engagement</th>
                  <th className="p-3">Shares / Saves</th>
                  <th className="p-3">Leads</th>
                  <th className="p-3">Bookings</th>
                  <th className="p-3 text-right">Attributed Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reels.map((reel) => (
                  <tr key={reel.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-bold text-white max-w-xs truncate">{reel.title}</td>
                    <td className="p-3 text-blue-300">{reel.category}</td>
                    <td className="p-3 font-mono">{reel.views.toLocaleString("en-IN")}</td>
                    <td className="p-3 text-emerald-400 font-bold">{reel.engagementRate}%</td>
                    <td className="p-3 text-slate-400">
                      {reel.shares} / {reel.saves}
                    </td>
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
