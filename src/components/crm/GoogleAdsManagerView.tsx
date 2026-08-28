import React, { useState } from "react";
import {
  TrendingUp,
  Search,
  Plus,
  Play,
  Pause,
  ExternalLink,
  Target,
  DollarSign,
  BarChart3,
  Globe,
  Radio,
  Tag,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Sliders,
  Filter,
  Check,
  Zap,
  ChevronDown,
  Trash2,
  Edit,
} from "lucide-react";
import {
  GoogleAdsCampaign,
  GoogleCampaignType,
  GoogleBidStrategy,
  GoogleKeyword,
  INITIAL_GOOGLE_ADS_CAMPAIGNS,
} from "../../data/googleAdsData";

interface GoogleAdsManagerViewProps {
  onToast: (msg: string) => void;
}

export function GoogleAdsManagerView({ onToast }: GoogleAdsManagerViewProps) {
  const [campaigns, setCampaigns] = useState<GoogleAdsCampaign[]>(INITIAL_GOOGLE_ADS_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<GoogleAdsCampaign>(INITIAL_GOOGLE_ADS_CAMPAIGNS[0]);
  const [subTab, setSubTab] = useState<"campaigns" | "keywords" | "ad_groups" | "utm_builder" | "account_health">("campaigns");

  // New Campaign Form Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampName, setNewCampName] = useState("");
  const [newCampType, setNewCampType] = useState<GoogleCampaignType>("Search");
  const [newCampDailyBudget, setNewCampDailyBudget] = useState("20000");
  const [newCampBidStrategy, setNewCampBidStrategy] = useState<GoogleBidStrategy>("Target CPA");
  const [newCampLandingUrl, setNewCampLandingUrl] = useState("https://bharatyatra.ai/flights/delhi-to-mumbai");

  // Keyword Management State
  const [newKeywordText, setNewKeywordText] = useState("");
  const [newKeywordMatchType, setNewKeywordMatchType] = useState<GoogleKeyword["matchType"]>('Phrase "keyword"');
  const [newNegativeKw, setNewNegativeKw] = useState("");

  // UTM Generator State
  const [utmBaseUrl, setUtmBaseUrl] = useState("https://bharatyatra.ai/yatra/kedarnath");
  const [utmSource, setUtmSource] = useState("google");
  const [utmMedium, setUtmMedium] = useState("cpc");
  const [utmCampaignTag, setUtmCampaignTag] = useState("kedarnath_vip_sept_sale");
  const [utmTerm, setUtmTerm] = useState("helicopter_booking");

  const generatedUtmUrl = `${utmBaseUrl}?utm_source=${encodeURIComponent(utmSource)}&utm_medium=${encodeURIComponent(
    utmMedium
  )}&utm_campaign=${encodeURIComponent(utmCampaignTag)}&utm_term=${encodeURIComponent(utmTerm)}`;

  // Summary Metrics
  const totalGoogleSpend = campaigns.reduce((acc, c) => acc + c.spendToDateINR, 0);
  const totalGoogleRevenue = campaigns.reduce((acc, c) => acc + c.revenueAttributedINR, 0);
  const totalGoogleConversions = campaigns.reduce((acc, c) => acc + c.conversions, 0);
  const averageRoas = (totalGoogleRevenue / totalGoogleSpend).toFixed(2);

  // Toggle Campaign Active / Paused
  const handleToggleStatus = (campId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campId ? { ...c, status: c.status === "Active" ? "Paused" : "Active" } : c))
    );
    if (selectedCampaign.id === campId) {
      setSelectedCampaign((prev) => ({
        ...prev,
        status: prev.status === "Active" ? "Paused" : "Active",
      }));
    }
    onToast(`Google Ads campaign status updated! 🔄`);
  };

  // Add Keyword
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeywordText.trim()) return;

    const newKw: GoogleKeyword = {
      id: `GKW-${Date.now().toString().slice(-4)}`,
      keyword: newKeywordText,
      matchType: newKeywordMatchType,
      avgCpcINR: Math.round(12 + Math.random() * 18),
      monthlySearches: Math.round(20000 + Math.random() * 150000),
      qualityScore: 9,
      clicks: 0,
      conversions: 0,
      costINR: 0,
      status: "Active",
    };

    const updated = campaigns.map((c) =>
      c.id === selectedCampaign.id ? { ...c, keywords: [newKw, ...c.keywords] } : c
    );
    setCampaigns(updated);
    const updatedSelected = updated.find((c) => c.id === selectedCampaign.id);
    if (updatedSelected) setSelectedCampaign(updatedSelected);
    setNewKeywordText("");
    onToast(`Keyword "${newKeywordText}" added to ${selectedCampaign.name}! 🎯`);
  };

  // Add Negative Keyword
  const handleAddNegativeKw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNegativeKw.trim()) return;

    const updated = campaigns.map((c) =>
      c.id === selectedCampaign.id
        ? { ...c, negativeKeywords: [...c.negativeKeywords, newNegativeKw.trim().toLowerCase()] }
        : c
    );
    setCampaigns(updated);
    const updatedSelected = updated.find((c) => c.id === selectedCampaign.id);
    if (updatedSelected) setSelectedCampaign(updatedSelected);
    setNewNegativeKw("");
    onToast(`Negative keyword added to prevent wasted spend! 🛡️`);
  };

  // Create Campaign
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetVal = parseInt(newCampDailyBudget) || 15000;
    const newCamp: GoogleAdsCampaign = {
      id: `GCAMP-00${campaigns.length + 1}`,
      campaignId: `GADS-${Math.floor(9810000 + Math.random() * 9000)}`,
      name: newCampName || "Search_Custom_Travel_Campaign",
      type: newCampType,
      status: "Active",
      dailyBudgetINR: budgetVal,
      monthlyBudgetINR: budgetVal * 30,
      spendToDateINR: 0,
      bidStrategy: newCampBidStrategy,
      targetCpaINR: 320,
      targetRoasMultiplier: 7.5,
      locations: ["All India Metros (Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata)"],
      languages: ["English", "Hindi"],
      audiences: ["In-Market Domestic Travel", "Frequent Business Flyers"],
      landingPageUrl: newCampLandingUrl,
      utmCampaign: newCampName.toLowerCase().replace(/\s+/g, "_"),
      utmSource: "google",
      utmMedium: "cpc",
      schedule: "Mon-Sun 06:00 - 23:59",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-11-30",
      adGroups: [
        {
          id: `GAG-${Date.now().toString().slice(-4)}`,
          name: "Main Ad Group (Responsive Search Ads)",
          headlines: ["Book Lowest Fares on BharatYatra", "Zero Convenience Fees", "Instant GST Invoice Download"],
          descriptions: ["Compare 600+ airlines, trains, hotels and VIP yatra packages in seconds with 24/7 support."],
          finalUrl: newCampLandingUrl,
          displayPath1: "Travel",
          displayPath2: "Deals",
          keywordsCount: 5,
          status: "Enabled",
        },
      ],
      keywords: [
        {
          id: `GKW-${Date.now().toString().slice(-4)}`,
          keyword: "best flight booking deals india",
          matchType: 'Phrase "keyword"',
          avgCpcINR: 15.4,
          monthlySearches: 98000,
          qualityScore: 9,
          clicks: 0,
          conversions: 0,
          costINR: 0,
          status: "Active",
        },
      ],
      negativeKeywords: ["free ticket hack", "complaint phone number"],
      impressions: 0,
      clicks: 0,
      ctr: 0,
      avgCpcINR: 0,
      conversions: 0,
      costPerLeadINR: 0,
      costPerBookingINR: 0,
      roas: 0,
      revenueAttributedINR: 0,
    };

    setCampaigns([newCamp, ...campaigns]);
    setSelectedCampaign(newCamp);
    setIsCreateModalOpen(false);
    setNewCampName("");
    onToast(`Google Ads campaign "${newCamp.name}" successfully created! 🚀`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Account Status */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">Google Ads Enterprise Manager (MCC)</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                MCC Live Connected (ID: 884-910-2841)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Search, Display, YouTube Video &amp; Performance Max (PMax) campaigns with automated conversion tracking and ROAS bidding.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-blue-600/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Google Campaign
          </button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Ad Spend</span>
          <div className="text-xl font-black text-white mt-1">₹{(totalGoogleSpend / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-slate-500">Across {campaigns.length} Active Campaigns</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Attributed Revenue</span>
          <div className="text-xl font-black text-emerald-400 mt-1">₹{(totalGoogleRevenue / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-emerald-400 font-bold">ROAS: {averageRoas}x</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Conversions</span>
          <div className="text-xl font-black text-indigo-300 mt-1">{totalGoogleConversions.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">Bookings &amp; High-Intent Inquiries</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Average CTR</span>
          <div className="text-xl font-black text-amber-300 mt-1">6.85%</div>
          <span className="text-[10px] text-slate-400">Industry benchmark: 3.2%</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Avg Cost Per Booking</span>
          <div className="text-xl font-black text-white mt-1">₹178.40</div>
          <span className="text-[10px] text-emerald-400 font-semibold">CPL: ₹142.10</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: "campaigns", label: "Campaigns Management", icon: Target },
          { id: "keywords", label: "Keywords & Match Types", icon: Search },
          { id: "ad_groups", label: "Ad Groups & Copy Assets", icon: Layers },
          { id: "utm_builder", label: "UTM Builder & Tagging", icon: Tag },
          { id: "account_health", label: "GAds Account Health", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* CAMPAIGNS SUB-TAB */}
      {subTab === "campaigns" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Campaigns List */}
            <div className="lg:col-span-1 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Google Campaigns ({campaigns.length})
              </span>
              {campaigns.map((camp) => {
                const isSelected = selectedCampaign.id === camp.id;
                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaign(camp)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-950/50 border-blue-500 ring-1 ring-blue-400 shadow-lg"
                        : "bg-slate-800/70 border-slate-700/80 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-blue-300 uppercase">
                        {camp.type}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          camp.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white mt-1.5 truncate">{camp.name}</h4>

                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-300">
                      <div>
                        <span className="text-slate-400 block text-[9px]">Spend:</span>
                        <strong>₹{(camp.spendToDateINR / 1000).toFixed(0)}k</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px]">ROAS:</span>
                        <strong className="text-emerald-400">{camp.roas}x</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Selected Campaign Details */}
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
                <div className="flex items-start justify-between flex-wrap gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/60 text-[10px] font-bold">
                        {selectedCampaign.type}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{selectedCampaign.campaignId}</span>
                    </div>
                    <h3 className="text-base font-black text-white mt-1">{selectedCampaign.name}</h3>
                    <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>Bid Strategy: <strong className="text-slate-200">{selectedCampaign.bidStrategy}</strong></span>
                      <span>•</span>
                      <span>Target CPA: <strong className="text-emerald-400">₹{selectedCampaign.targetCpaINR}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedCampaign.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        selectedCampaign.status === "Active"
                          ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {selectedCampaign.status === "Active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{selectedCampaign.status === "Active" ? "Pause Campaign" : "Resume Campaign"}</span>
                    </button>
                  </div>
                </div>

                {/* Campaign Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Impressions</span>
                    <div className="text-sm font-black text-white mt-0.5">
                      {selectedCampaign.impressions.toLocaleString("en-IN")}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Clicks / CTR</span>
                    <div className="text-sm font-black text-blue-300 mt-0.5">
                      {selectedCampaign.clicks.toLocaleString("en-IN")} ({selectedCampaign.ctr}%)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Avg CPC</span>
                    <div className="text-sm font-black text-amber-300 mt-0.5">₹{selectedCampaign.avgCpcINR}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Attributed Revenue</span>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      ₹{(selectedCampaign.revenueAttributedINR / 100000).toFixed(1)}L ({selectedCampaign.roas}x)
                    </div>
                  </div>
                </div>

                {/* Target Specs */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400">Target Locations:</span>
                    <span className="text-right font-medium">{selectedCampaign.locations.join(", ")}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400">Languages:</span>
                    <span className="text-right font-medium">{selectedCampaign.languages.join(", ")}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400">Target Audiences:</span>
                    <span className="text-right font-medium">{selectedCampaign.audiences.join(", ")}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-slate-400">Landing Page:</span>
                    <a
                      href={selectedCampaign.landingPageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      {selectedCampaign.landingPageUrl}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* KEYWORDS SUB-TAB */}
      {subTab === "keywords" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-black text-white">
                Keywords &amp; Negative Keywords for: {selectedCampaign.name}
              </h3>
              <p className="text-xs text-slate-400">
                Broad match, Phrase match, Exact match with automated Quality Score &amp; bid optimizer.
              </p>
            </div>
          </div>

          {/* Add Keyword Form */}
          <form onSubmit={handleAddKeyword} className="p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Enter new target keyword..."
                value={newKeywordText}
                onChange={(e) => setNewKeywordText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <select
              value={newKeywordMatchType}
              onChange={(e) => setNewKeywordMatchType(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none"
            >
              <option value='Phrase "keyword"'>Phrase Match ("...")</option>
              <option value="Exact [keyword]">Exact Match ([...])</option>
              <option value="Broad keyword">Broad Match</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold whitespace-nowrap cursor-pointer"
            >
              Add Keyword
            </button>
          </form>

          {/* Keywords Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Keyword</th>
                  <th className="p-3">Match Type</th>
                  <th className="p-3">Avg CPC</th>
                  <th className="p-3">Monthly Vol</th>
                  <th className="p-3">Quality Score</th>
                  <th className="p-3">Clicks</th>
                  <th className="p-3">Conversions</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {selectedCampaign.keywords.map((kw) => (
                  <tr key={kw.id} className="hover:bg-slate-800/50">
                    <td className="p-3 font-semibold text-white font-mono">{kw.keyword}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-blue-300 font-mono">
                        {kw.matchType}
                      </span>
                    </td>
                    <td className="p-3 text-slate-200">₹{kw.avgCpcINR}</td>
                    <td className="p-3 text-slate-400">{kw.monthlySearches.toLocaleString("en-IN")}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                        {kw.qualityScore}/10
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{kw.clicks}</td>
                    <td className="p-3 text-emerald-400 font-bold">{kw.conversions}</td>
                    <td className="p-3 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                        {kw.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Negative Keywords Box */}
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Campaign Negative Keywords ({selectedCampaign.negativeKeywords.length})
            </h4>
            <div className="flex items-center gap-1.5 flex-wrap">
              {selectedCampaign.negativeKeywords.map((neg, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono"
                >
                  -{neg}
                </span>
              ))}
            </div>

            <form onSubmit={handleAddNegativeKw} className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add negative keyword (e.g. 'free ticket')"
                value={newNegativeKw}
                onChange={(e) => setNewNegativeKw(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none"
              />
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 text-xs font-bold cursor-pointer"
              >
                Add Negative
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AD GROUPS SUB-TAB */}
      {subTab === "ad_groups" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">Responsive Search Ads &amp; Copy Assets</h3>
              <p className="text-xs text-slate-400">Headlines, descriptions, display paths, and URL mappings.</p>
            </div>
          </div>

          {selectedCampaign.adGroups.map((ag) => (
            <div key={ag.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-white">{ag.name}</h4>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                  {ag.status}
                </span>
              </div>

              {/* Google SERP Ad Preview */}
              <div className="p-4 rounded-xl bg-white text-slate-900 border border-slate-300 shadow-sm space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-900">Sponsored</span>
                  <span>•</span>
                  <span>bharatyatra.ai</span>
                  <span className="text-slate-400">› {ag.displayPath1} › {ag.displayPath2}</span>
                </div>
                <div className="text-base font-bold text-blue-700 hover:underline cursor-pointer">
                  {ag.headlines.join(" | ")}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{ag.descriptions.join(" ")}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>
                  Final URL: <code className="text-blue-300">{ag.finalUrl}</code>
                </span>
                <span>{ag.keywordsCount} Target Keywords Linked</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UTM BUILDER SUB-TAB */}
      {subTab === "utm_builder" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div>
              <h3 className="text-sm font-black text-white">Google Ads Campaign URL &amp; UTM Auto-Tagger</h3>
              <p className="text-xs text-slate-400">
                Generate tracking URLs to attribute revenue, bookings, and leads to specific keywords and ad copy.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Destination Landing Page URL</label>
                <input
                  type="text"
                  value={utmBaseUrl}
                  onChange={(e) => setUtmBaseUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">UTM Campaign Name</label>
                <input
                  type="text"
                  value={utmCampaignTag}
                  onChange={(e) => setUtmCampaignTag(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">UTM Source</label>
                <input
                  type="text"
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">UTM Term / Keyword</label>
                <input
                  type="text"
                  value={utmTerm}
                  onChange={(e) => setUtmTerm(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Generated URL Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Generated Tracking URL:
              </span>
              <div className="font-mono text-xs text-blue-300 break-all select-all">{generatedUtmUrl}</div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedUtmUrl);
                  onToast("Copied tracking UTM URL to clipboard! 📋");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Tagged URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GADS ACCOUNT HEALTH */}
      {subTab === "account_health" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-white">Google Ads API &amp; Conversion Linker Status</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                100% Operational
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Google Click ID (gclid) Sync:</span>
                <strong className="text-emerald-400 text-sm">Active &amp; Server Logged</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Offline Conversion Import:</span>
                <strong className="text-white text-sm">Hourly Cron Sync</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Enhanced Conversions:</span>
                <strong className="text-indigo-300 text-sm">SHA256 User-Hashed</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Google Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">Create New Google Ads Campaign</h3>
            <form onSubmit={handleCreateCampaign} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Search_Vande_Bharat_Sleeper_Advance_Booking"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Campaign Type</label>
                  <select
                    value={newCampType}
                    onChange={(e) => setNewCampType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Search">Search Campaign</option>
                    <option value="Performance Max (PMax)">Performance Max (PMax)</option>
                    <option value="Display">Display Network</option>
                    <option value="YouTube Video">YouTube Video</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Daily Budget (INR)</label>
                  <input
                    type="number"
                    value={newCampDailyBudget}
                    onChange={(e) => setNewCampDailyBudget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Bid Strategy</label>
                <select
                  value={newCampBidStrategy}
                  onChange={(e) => setNewCampBidStrategy(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="Target CPA">Target CPA</option>
                  <option value="Target ROAS">Target ROAS</option>
                  <option value="Maximize Conversions">Maximize Conversions</option>
                  <option value="Manual CPC">Manual CPC</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Landing Page URL</label>
                <input
                  type="url"
                  value={newCampLandingUrl}
                  onChange={(e) => setNewCampLandingUrl(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Publish Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
