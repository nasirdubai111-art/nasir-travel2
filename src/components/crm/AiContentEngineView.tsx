import React, { useState } from "react";
import {
  Sparkles,
  Wand2,
  Copy,
  Check,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Send,
  Layers,
  FileText,
  Video,
  Hash,
  Search,
  Target,
  Sliders,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Zap,
  Tag,
  Share2,
  MessageSquare,
  Compass,
  Bookmark,
  ChevronRight,
  Eye,
  SlidersHorizontal,
} from "lucide-react";
import {
  AiContentPromptInput,
  ContentToolType,
  GeneratedContentItem,
  AiCampaignRecommendation,
  PredictiveCampaignForecast,
  SAMPLE_PROMPT_INPUTS,
  INITIAL_AI_RECOMMENDATIONS,
  PREDICTIVE_FORECASTS,
} from "../../data/aiContentEngineData";

interface AiContentEngineViewProps {
  onToast: (msg: string) => void;
}

export function AiContentEngineView({ onToast }: AiContentEngineViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<"generator" | "automation" | "predictive">("generator");
  const [selectedTool, setSelectedTool] = useState<ContentToolType>("ad_copy");
  
  // Prompt State
  const [promptInput, setPromptInput] = useState<AiContentPromptInput>(SAMPLE_PROMPT_INPUTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<GeneratedContentItem[]>([
    {
      id: "GEN-01",
      toolType: "ad_copy",
      title: "High-Converting Google Search & Meta Primary Ad Copy",
      content: `🔥 [SPECIAL OFFER] Sacred Varanasi Ganga Aarti & Kashi Vishwanath VIP Darshan 2026!
      
✨ Experience the spiritual heart of India with zero waiting lines. 
• 100% Guaranteed VIP Temple Entry Pass with Senior Vedic Priest Guide
• Private Evening Ganga Boat Cruise with live Shehnai music
• 4-Star Luxury Heritage Stay + Complimentary Satvik Breakfast
• Private AC Airport & Station Chauffeur Transfers

👉 Flat 25% Off for Family Bookings (Valid this week only). 
Book your divine pilgrimage now: https://bharatyatra.in/kashi-darshan`,
      metadata: {
        characterCount: 432,
        targetKeywords: ["Kashi Vishwanath VIP Darshan", "Varanasi Ganga Aarti Boat Booking", "Chardham Travel Agency"],
        recommendedChannels: ["Google Search", "Meta Feed Ad", "WhatsApp Broadcast"],
        estimatedEngagementScore: 94,
      },
      createdAt: "2026-08-28 09:30",
    },
    {
      id: "GEN-02",
      toolType: "reel_scripts",
      title: "50-Second Viral Travel Reel Script (9:16 Vertical)",
      content: `🎬 [0:00 - 0:03] HOOK (Fast Cut): 
"Stop booking normal Varanasi hotels before knowing this VIP Darshan hack! 🤯" (Fast visual zoom into Ganga Aarti fire embers)

🏛️ [0:03 - 0:15] PROBLEM / EXCITEMENT:
"Thousands stand in 4-hour temple queues under the sun... but with BharatYatra's VIP Sacred Pass, you walk straight into the Sanctum Sanctorum in under 12 minutes!"

✨ [0:15 - 0:35] EXPERIENCE HIGHLIGHTS:
"Next, an exclusive private wooden bajra boat takes you to the center of the Ganges for the world-famous evening Ganga Aarti. Pure bliss, no crowd chaos!"

🎟️ [0:35 - 0:50] CALL TO ACTION:
"Comment 'KASHI' below or tap the link in bio for flat 25% discount on VIP family packages today!"`,
      metadata: {
        suggestedHookTime: "0.8s",
        hookStyle: "Curiosity + Negative Contrast",
        recommendedChannels: ["Instagram Reels", "Facebook Reels", "YouTube Shorts"],
        estimatedEngagementScore: 98,
      },
      createdAt: "2026-08-28 09:15",
    },
  ]);

  // AI Campaign Recommendations
  const [recommendations, setRecommendations] = useState<AiCampaignRecommendation[]>(INITIAL_AI_RECOMMENDATIONS);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Tools Navigation
  const TOOLS: { id: ContentToolType; label: string; icon: any; category: string }[] = [
    { id: "campaign_ideas", label: "Campaign Ideas", icon: Sparkles, category: "Strategy" },
    { id: "travel_content", label: "Travel Content", icon: Compass, category: "Creative" },
    { id: "ad_copy", label: "Ad Copy Generator", icon: Target, category: "Paid Ads" },
    { id: "reel_scripts", label: "Reel Script Engine", icon: Video, category: "Social" },
    { id: "captions", label: "Viral Captions", icon: MessageSquare, category: "Social" },
    { id: "hashtags", label: "Hashtag Stacks", icon: Hash, category: "Social" },
    { id: "seo_titles", label: "SEO Titles (SERP)", icon: Search, category: "SEO" },
    { id: "meta_descriptions", label: "Meta Descriptions", icon: FileText, category: "SEO" },
    { id: "blog_articles", label: "Blog / Article Writer", icon: Layers, category: "Content" },
    { id: "cta_generator", label: "High-CTR CTAs", icon: Zap, category: "Conversion" },
    { id: "promo_content", label: "Flash Sale Promos", icon: Tag, category: "Offers" },
    { id: "audience_recs", label: "Audience Targeting", icon: Sliders, category: "Strategy" },
    { id: "content_repurposer", label: "Content Repurposer", icon: Share2, category: "Repurposing" },
  ];

  // Quick Preset Selection
  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setPromptInput(SAMPLE_PROMPT_INPUTS[idx]);
    onToast(`Loaded prompt preset: ${SAMPLE_PROMPT_INPUTS[idx].destination}`);
  };

  // Generate Content simulation with rich domain specific patterns
  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      let newTitle = "";
      let newContent = "";
      let meta: any = {
        characterCount: 0,
        targetKeywords: [promptInput.destination, promptInput.productName],
        recommendedChannels: ["Meta Ads", "Google Ads", "Instagram"],
        estimatedEngagementScore: Math.floor(Math.random() * 10) + 90,
      };

      switch (selectedTool) {
        case "campaign_ideas":
          newTitle = `360° Omnichannel Campaign Strategy: ${promptInput.destination}`;
          newContent = `🎯 CAMPAIGN THEME: "The Soul of ${promptInput.destination}"
          
📌 Pillar 1: High-Intent Google Search & PMax
- Target: "${promptInput.destination} VIP booking", "${promptInput.productName} 2026"
- Angle: Zero-hassle verified booking + ${promptInput.offerDetails}

📌 Pillar 2: Emotional Instagram & FB Reels Storytelling
- Angle: Contrast stressful DIY travel vs VIP peaceful concierge journey.
- Hook: "Everything they didn't tell you about visiting ${promptInput.destination} in 2026."

📌 Pillar 3: WhatsApp Drip & Telesales Fast Conversion
- Trigger: Instant quote PDF within 45 seconds of lead form submission.
- Offer Anchor: ${promptInput.offerDetails} with 48-hour validity timer.`;
          break;

        case "travel_content":
          newTitle = `Curated Destination Story & Experience Guide: ${promptInput.destination}`;
          newContent = `✨ Discover the Magic of ${promptInput.destination}
          
Nestled in timeless splendor, ${promptInput.destination} offers an intoxicating blend of spiritual tranquility, architectural marvels, and authentic Indian hospitality. 

🌟 Unmissable Highlights:
1. ${promptInput.productName} — curated exclusively for discerning travelers.
2. Handpicked luxury accommodations with breathtaking panoramic views.
3. Authentic local culinary trails paired with private licensed guides.

🎁 Special Privilege: ${promptInput.offerDetails} when reserved via BharatYatra Concierge.`;
          break;

        case "ad_copy":
          newTitle = `Conversion-Optimized Search & Social Ad Copy: ${promptInput.productName}`;
          newContent = `🚨 Exclusive ${promptInput.destination} Getaway Offer!
          
Experience ${promptInput.productName} with premium concierge privileges:
✅ ${promptInput.offerDetails}
✅ Instant Confirmed Booking & Verified Travel Partner
✅ 24/7 On-Ground Support & Chauffeur Services
✅ Easy Cancellation & Zero-Interest EMI Available

👉 Target Audience: ${promptInput.targetAudience}
👉 Tone: ${promptInput.tone}

🔥 Don't miss out — over 85% seats already reserved for upcoming travel dates!`;
          break;

        case "reel_scripts":
          newTitle = `Viral 9:16 Video Script for ${promptInput.destination}`;
          newContent = `🎬 [0-3s HOOK]:
"If you are planning to visit ${promptInput.destination} this season, WATCH THIS before you book anything! 🛑"

📸 [3-15s VISUAL ESTABLISHMENT]:
(Cinematic 4K drone shot of ${promptInput.destination} transitioning into lush suites and VIP darshan views)
"Most tourists spend 60% of their vacation standing in queues and bargaining with random vendors..."

✨ [15-35s THE VALUE]:
"Instead, book the ${promptInput.productName} — getting you:
• VIP Fast-Track Entry
• ${promptInput.offerDetails}
• Luxury chauffeur transfers and five-star satvik dining."

📲 [35-45s CTA]:
"Hit the link in bio to get your custom itinerary in 30 seconds!"`;
          break;

        case "captions":
          newTitle = `Instagram & Facebook High-Reach Captions`;
          newContent = `Some places stay in your memory; ${promptInput.destination} stays in your soul. ✨🕊️

Whether you are seeking serenity, adventure, or memories with loved ones, our ${promptInput.productName} ensures every moment is seamless.

✨ Privileges included:
• ${promptInput.offerDetails}
• 100% verified concierge care

👇 Drop a ✈️ in the comments to receive the full itinerary and discounted booking link directly in your DMs!

#${promptInput.destination.replace(/\s+/g, "")} #BharatYatra #LuxuryTravelIndia #IncredibleIndia`;
          break;

        case "hashtags":
          newTitle = `High-Yield 3-Tier Hashtag Stacks for ${promptInput.destination}`;
          newContent = `🔥 MEGA VIRAL (1M+ Posts):
#IncredibleIndia #TravelIndia #Wanderlust #ExploreIndia #TravelGram

💎 TARGETED GEO & NICHE (50k–500k Posts):
#${promptInput.destination.replace(/\s+/g, "")}Travel #${promptInput.destination.replace(/\s+/g, "")}Diaries #IndiaTourism #TravelPackagesIndia #${promptInput.category}

🚀 LOW COMPETITION CONVERSION TAGS (5k–50k Posts):
#${promptInput.destination.replace(/\s+/g, "")}VIPBooking #BharatYatra${promptInput.category} #${promptInput.productName.replace(/[^A-Za-z0-9]/g, "")} #BestTravelDealsIndia`;
          break;

        case "seo_titles":
          newTitle = `High-CTR Google SERP Titles (Within 60 Chars)`;
          newContent = `1️⃣ ${promptInput.destination} Packages 2026 - ${promptInput.offerDetails.slice(0, 25)}
2️⃣ Best ${promptInput.productName} | BharatYatra Verified
3️⃣ ${promptInput.destination} VIP Tour & Hotel Booking (Flat 25% Off)
4️⃣ Book ${promptInput.destination} Luxury Package 2026 | Instant Confirmation
5️⃣ Complete ${promptInput.destination} Yatra & Travel Guide | Best Price Guarantee`;
          break;

        case "meta_descriptions":
          newTitle = `Google Search Meta Descriptions (Within 155 Chars)`;
          newContent = `1️⃣ Book verified ${promptInput.productName} for ${promptInput.destination}. Enjoy ${promptInput.offerDetails}, VIP fast-track entry & 24/7 concierge. Check prices now!

2️⃣ Planning your trip to ${promptInput.destination}? Get instant quotes on top-rated ${promptInput.category} packages with guaranteed best rates. Book with BharatYatra today!`;
          break;

        case "blog_articles":
          newTitle = `Comprehensive Travel Guide: ${promptInput.destination} (2026 Edition)`;
          newContent = `# The Ultimate Traveler's Guide to ${promptInput.destination} (2026 Edition)

## Introduction
${promptInput.destination} is more than a holiday destination; it is an immersive journey into India's cultural tapestry. Whether you are traveling for spirituality, luxury, or adventure, this guide covers everything you need to know.

---

## Best Time to Visit & Climate
- **Peak Season**: October through March for pleasant breezes and clear skies.
- **Festival Highlights**: Experience sacred rituals and cultural festivals during autumn.

---

## Top Experiences Included in the ${promptInput.productName}
1. **VIP Fast-Track Access**: Skip the long queues with licensed local experts.
2. **Curated Luxury Accommodations**: Stay at heritage properties with traditional warm hospitality.
3. **Exclusive Privilege**: ${promptInput.offerDetails}.

---

## How to Book & Travel Safely
Ensure you book only through verified operators with live 24/7 helpline support. Plan at least 30 days in advance to secure peak-season slots.`;
          break;

        case "cta_generator":
          newTitle = `Conversion-Tested CTAs (Buttons & Copy Banners)`;
          newContent = `🔘 PRIMARY BUTTON LABELS:
- "Claim My 25% Off Voucher"
- "Book VIP ${promptInput.destination} Darshan"
- "Get Free Custom Itinerary on WhatsApp"
- "Lock In Early-Bird Price (₹0 Down)"

📣 AD HEADLINE PUNCHLINES:
- "Only 4 Luxury Slots Left for ${promptInput.destination} This Month"
- "Experience ${promptInput.destination} Like Royalty — Reserve Now"
- "Your Dream ${promptInput.category} Vacation Starts at Just ₹${(Math.floor(Math.random() * 5) + 12)},999"`;
          break;

        case "promo_content":
          newTitle = `Festival & Flash Sale Promotional Broadcast`;
          newContent = `⚡ FLASH SALE ALERT: 48 HOURS ONLY! ⚡

🌟 Destination: ${promptInput.destination}
🌟 Package: ${promptInput.productName}
🌟 Special Offer: ${promptInput.offerDetails}

Why Book Today?
✅ 100% Date Flexibility (Free Rescheduling)
✅ Dedicated Concierge & Private AC Transport
✅ Zero Convenience Fee on UPI/Card Payments

👉 Use Code: YATRA2026 at checkout or reply 'BOOK' to talk to our travel specialist right now!`;
          break;

        case "audience_recs":
          newTitle = `AI Meta & Google Ads Audience Recommendations`;
          newContent = `🎯 TARGET AUDIENCE BLUEPRINT:

📍 Demographics:
- Age: 25–58 years
- Target Locations: Delhi NCR, Mumbai, Bengaluru, Hyderabad, Pune, Ahmedabad, Kolkata
- Gender: All (60% Family decision makers)

🔍 Detailed Interests (Meta Ads):
- Luxury Travel, Spiritual Tourism, Heritage Hotels, IRCTC, MakeMyTrip frequent bookers, Ecotourism, Weekend Getaways.

💡 Lookalike Audience:
- 1% Lookalike of 2025–2026 Confirmed Booking Customers (High Lifetime Value).

📊 Google Ads Custom Intent Keywords:
- "${promptInput.destination} tour price", "best hotel in ${promptInput.destination}", "luxury packages ${promptInput.destination}".`;
          break;

        case "content_repurposer":
          newTitle = `1-Click Omnichannel Repurposing Matrix for ${promptInput.destination}`;
          newContent = `🔄 CONTENT REPURPOSING FLOW:

1️⃣ YouTube / Reel Script:
- Hook: "3 Mistakes people make when visiting ${promptInput.destination}"

2️⃣ WhatsApp Broadcast Message:
- "Namaste 🙏 Planning ${promptInput.destination}? Get ${promptInput.offerDetails} when you book before Friday."

3️⃣ Twitter / Threads Post:
- "Planning a trip to ${promptInput.destination}? Here's a 4-day VIP itinerary with ${promptInput.offerDetails} 🧵👇"

4️⃣ Google Business Profile Post:
- "Updated 2026 VIP packages for ${promptInput.destination} now live! Call now for instant booking."`;
          break;
      }

      meta.characterCount = newContent.length;

      const newItem: GeneratedContentItem = {
        id: `GEN-${Date.now().toString().slice(-4)}`,
        toolType: selectedTool,
        title: newTitle,
        content: newContent,
        metadata: meta,
        createdAt: "Just now",
      };

      setGeneratedItems((prev) => [newItem, ...prev]);
      onToast(`Generated high-converting ${selectedTool.replace("_", " ").toUpperCase()} with AI! ⚡`);
    }, 800);
  };

  // Handle Admin Financial Approval for Campaign Automations
  const handleApproveRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, approvalStatus: "approved" } : r))
    );
    onToast(`Admin Approved AI Recommendation ${recId}. Budget reallocated automatically! 🚀`);
  };

  const handleRejectRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, approvalStatus: "rejected" } : r))
    );
    onToast(`Admin Rejected AI Recommendation ${recId}.`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">AI Content Engine &amp; Campaign Automation</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
                13 AI Creation Tools
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                Admin Approval Vault
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated Ad-copy, Reel scripts, SEO metadata, blogs, anomaly detectors &amp; predictive budget optimization.
            </p>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-700/80 shrink-0">
          <button
            onClick={() => setActiveSubTab("generator")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "generator" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"
            }`}
          >
            AI Content Studio
          </button>
          <button
            onClick={() => setActiveSubTab("automation")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeSubTab === "automation" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Automation &amp; Alerts</span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          </button>
          <button
            onClick={() => setActiveSubTab("predictive")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === "predictive" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "text-slate-400 hover:text-white"
            }`}
          >
            Predictive Forecasts
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: AI CONTENT STUDIO */}
      {activeSubTab === "generator" && (
        <div className="space-y-6">
          {/* 13 AI Creation Tools Grid Ribbon */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-1">
              Select AI Marketing Tool:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
              {TOOLS.map((t) => {
                const Icon = t.icon;
                const isSel = selectedTool === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTool(t.id)}
                    className={`p-2 rounded-xl text-left transition-all border cursor-pointer flex items-center gap-2 ${
                      isSel
                        ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                        : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-indigo-300" />
                    <span className="text-xs font-bold truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main 2-Column: Input Engine & Generated Output */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left Prompt Input Box (5 Cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-indigo-400" />
                  <h4 className="text-sm font-black text-white">Campaign &amp; Travel Inputs</h4>
                </div>
                <span className="text-[10px] font-bold text-indigo-300 uppercase bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {selectedTool.replace("_", " ")}
                </span>
              </div>

              {/* Sample Presets */}
              <div>
                <span className="text-[10px] text-slate-400 font-bold block mb-1">Quick Travel Presets:</span>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                  {SAMPLE_PROMPT_INPUTS.map((sp, idx) => (
                    <button
                      key={sp.destination}
                      onClick={() => handleSelectPreset(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                        selectedPresetIndex === idx
                          ? "bg-indigo-600 text-white font-bold"
                          : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      {sp.destination.split("&")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Destination</label>
                  <input
                    type="text"
                    value={promptInput.destination}
                    onChange={(e) => setPromptInput({ ...promptInput, destination: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Kedarnath, Goa, Kashmir, Manali"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                    <select
                      value={promptInput.category}
                      onChange={(e) => setPromptInput({ ...promptInput, category: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                    >
                      <option>Pilgrimage</option>
                      <option>Hotels</option>
                      <option>Resorts</option>
                      <option>Flights</option>
                      <option>Trains</option>
                      <option>Tours</option>
                      <option>Houseboats</option>
                      <option>Cabs</option>
                      <option>Dining</option>
                      <option>General</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tone &amp; Style</label>
                    <select
                      value={promptInput.tone}
                      onChange={(e) => setPromptInput({ ...promptInput, tone: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white focus:outline-none"
                    >
                      <option>Spiritual &amp; Devotional</option>
                      <option>Luxury &amp; Exclusive</option>
                      <option>Adventurous &amp; Thrilling</option>
                      <option>Family &amp; Friendly</option>
                      <option>Budget &amp; Value</option>
                      <option>Urgent &amp; High-Converting</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Product / Tour Name</label>
                  <input
                    type="text"
                    value={promptInput.productName}
                    onChange={(e) => setPromptInput({ ...promptInput, productName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. Divine Ganga Aarti VIP Darshan"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Offer &amp; Promotion Details</label>
                  <textarea
                    rows={2}
                    value={promptInput.offerDetails}
                    onChange={(e) => setPromptInput({ ...promptInput, offerDetails: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. Flat 25% Off + Free Shikara Boat Ride"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Audience</label>
                  <input
                    type="text"
                    value={promptInput.targetAudience}
                    onChange={(e) => setPromptInput({ ...promptInput, targetAudience: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    placeholder="e.g. Families, Senior Citizens, Honeymoon Couples"
                  />
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing Travel AI Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate AI Content with 1-Click</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Generated Content Stream (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  AI Generated Outputs ({generatedItems.length})
                </h4>
                <span className="text-xs text-indigo-400 font-bold">100% Ready for Google, Meta &amp; SEO</span>
              </div>

              {generatedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3 shadow-lg"
                >
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 text-[10px] font-bold uppercase mr-2">
                        {item.toolType.replace("_", " ")}
                      </span>
                      <strong className="text-xs text-white font-bold">{item.title}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(item.content);
                          onToast("Copied generated AI content to clipboard! 📋");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3 h-3 text-indigo-400" />
                        Copy
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 whitespace-pre-wrap leading-relaxed font-sans">
                    {item.content}
                  </div>

                  {/* Metadata Chips */}
                  {item.metadata && (
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 flex-wrap gap-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-3">
                        {item.metadata.characterCount && <span>{item.metadata.characterCount} Characters</span>}
                        {item.metadata.estimatedEngagementScore && (
                          <span className="text-emerald-400 font-bold">
                            Engagement Score: {item.metadata.estimatedEngagementScore}/100
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {item.metadata.recommendedChannels?.map((ch) => (
                          <span key={ch} className="px-1.5 py-0.5 rounded bg-slate-900 text-[10px] text-indigo-300">
                            {ch}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AI CAMPAIGN AUTOMATION & ALERTS */}
      {activeSubTab === "automation" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-black text-white">Automated Campaign Optimization &amp; Anomaly Telemetry</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                AI continuously monitors ROAS, CPA, CTR, search impression share &amp; ad fatigue across Google, Meta and SEO.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              Zero-Risk: Financial Changes Require Admin Approval
            </span>
          </div>

          <div className="space-y-3">
            {recommendations.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  rec.approvalStatus === "approved"
                    ? "bg-slate-900/60 border-emerald-500/40"
                    : rec.approvalStatus === "rejected"
                    ? "bg-slate-900/40 border-rose-500/30 opacity-70"
                    : "bg-slate-800/90 border-amber-500/40 shadow-lg"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-bold uppercase">
                        {rec.platform}
                      </span>
                      <span className="text-xs font-bold text-slate-300">{rec.campaignName}</span>
                      {rec.requiresAdminApproval && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          Requires Admin Approval
                        </span>
                      )}
                    </div>
                    <h5 className="text-sm font-bold text-white">{rec.title}</h5>
                    <p className="text-xs text-slate-300 max-w-3xl">{rec.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs pt-1 flex-wrap">
                      <span className="text-slate-400">
                        Current Metric: <strong className="text-amber-400">{rec.currentMetric}</strong>
                      </span>
                      <span className="text-emerald-400 font-bold">
                        Expected Impact: {rec.projectedImprovement}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {rec.approvalStatus === "pending" ? (
                      <>
                        <button
                          onClick={() => handleApproveRecommendation(rec.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Change
                        </button>
                        <button
                          onClick={() => handleRejectRecommendation(rec.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </>
                    ) : rec.approvalStatus === "approved" ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-500/30">
                        <CheckCircle2 className="w-4 h-4" />
                        Change Applied
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PREDICTIVE FORECASTS */}
      {activeSubTab === "predictive" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h4 className="text-sm font-black text-white">AI Lead Volume &amp; Conversion Probability Engine</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Machine learning models trained on 15,000+ historical travel bookings predicting lead intake, optimal posting hours &amp; CPL.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PREDICTIVE_FORECASTS.map((pf) => (
              <div key={pf.campaignName} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4 shadow-xl">
                <div>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                    Forecast Model
                  </span>
                  <h4 className="text-sm font-black text-white mt-0.5">{pf.campaignName}</h4>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Predicted Leads:</span>
                    <strong className="text-indigo-300 font-mono">
                      {pf.predictedLeadsMin} – {pf.predictedLeadsMax} / week
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Conversion Probability:</span>
                    <strong className="text-emerald-400 font-mono">{pf.conversionProbabilityPercent}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated CPL:</span>
                    <strong className="text-white font-mono">₹{pf.estimatedCplINR}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">Optimal Posting / Bid Times:</span>
                  <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-semibold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{pf.recommendedBestTime}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">Recommended Omnichannel Channels:</span>
                  <div className="flex flex-wrap gap-1">
                    {pf.recommendedChannels.map((ch) => (
                      <span key={ch} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-medium border border-slate-800">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
