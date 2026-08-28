import React, { useState } from "react";
import {
  TrendingUp,
  Target,
  Plus,
  Play,
  Pause,
  ExternalLink,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  DollarSign,
  BarChart3,
  Globe,
  Radio,
  Sliders,
  Filter,
  Image as ImageIcon,
  Check,
  Zap,
  Smartphone,
  Eye,
  Share2,
} from "lucide-react";
import {
  MetaCampaign,
  MetaCustomAudience,
  MetaAdCreative,
  INITIAL_META_CAMPAIGNS,
  INITIAL_META_AUDIENCES,
} from "../../data/metaAdsData";

interface MetaAdsManagerViewProps {
  onToast: (msg: string) => void;
}

export function MetaAdsManagerView({ onToast }: MetaAdsManagerViewProps) {
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>(INITIAL_META_CAMPAIGNS);
  const [selectedCampaign, setSelectedCampaign] = useState<MetaCampaign>(INITIAL_META_CAMPAIGNS[0]);
  const [audiences, setAudiences] = useState<MetaCustomAudience[]>(INITIAL_META_AUDIENCES);
  const [subTab, setSubTab] = useState<"campaigns" | "ad_sets" | "audiences" | "lead_forms" | "capi_status">("campaigns");

  // Create Campaign Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampName, setNewCampName] = useState("");
  const [newCampObjective, setNewCampObjective] = useState<MetaCampaign["objective"]>("CONVERSIONS");
  const [newCampBudget, setNewCampBudget] = useState("300000");

  // Metrics
  const totalMetaSpend = campaigns.reduce((acc, c) => acc + c.spendINR, 0);
  const totalMetaRevenue = campaigns.reduce((acc, c) => acc + c.revenueAttributedINR, 0);
  const totalMetaLeads = campaigns.reduce((acc, c) => acc + c.leadsCount, 0);
  const totalMetaBookings = campaigns.reduce((acc, c) => acc + c.bookingsCount, 0);
  const metaAvgRoas = (totalMetaRevenue / totalMetaSpend).toFixed(2);

  // Toggle status
  const handleToggleStatus = (campId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campId ? { ...c, status: c.status === "ACTIVE" ? "PAUSED" : "ACTIVE" } : c))
    );
    if (selectedCampaign.id === campId) {
      setSelectedCampaign((prev) => ({
        ...prev,
        status: prev.status === "ACTIVE" ? "PAUSED" : "ACTIVE",
      }));
    }
    onToast(`Meta advertising campaign status updated! 🔄`);
  };

  // Create Meta Campaign
  const handleCreateMetaCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetVal = parseInt(newCampBudget) || 200000;
    const newCamp: MetaCampaign = {
      id: `MCAMP-00${campaigns.length + 1}`,
      name: newCampName || "Meta_Advantage_Custom_Campaign",
      businessAccountId: "ACT-BIZ-7719284",
      adAccountId: "act_884910283749",
      objective: newCampObjective,
      status: "ACTIVE",
      budgetType: "CBO (Campaign Budget Optimization)",
      totalBudgetINR: budgetVal,
      spendINR: 0,
      impressions: 0,
      reach: 0,
      frequency: 1.0,
      clicks: 0,
      ctr: 0,
      cpcINR: 0,
      leadsCount: 0,
      bookingsCount: 0,
      costPerLeadINR: 0,
      costPerBookingINR: 0,
      roas: 0,
      revenueAttributedINR: 0,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2026-11-30",
      pixelId: "PIXEL-8849102847",
      capiStatus: "HEALTHY (Server-Side 100%)",
      adSets: [
        {
          id: `MAS-${Date.now().toString().slice(-4)}`,
          name: "Advantage+ Placements (IG Reels & FB Feed)",
          dailyBudgetINR: Math.round(budgetVal / 30),
          placements: ["Instagram Reels", "Instagram Feed", "Facebook Feed"],
          locations: ["India (Metros & Tier 1/2)"],
          ageRange: "21 - 58",
          gender: "All",
          interests: ["Travel & Tourism", "Domestic Flights", "Weekend Getaways"],
          customAudienceId: "AUD-02",
          bidStrategy: "LOWEST_COST",
          status: "ACTIVE",
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cpaINR: 0,
          creatives: [
            {
              id: `CR-${Date.now().toString().slice(-4)}`,
              headline: "Discover Incredible Bharat - Book Direct with 0% Convenience Fee",
              primaryText: "Explore handpicked luxury resorts, verified Kedarnath VIP passes and instant GST travel invoices.",
              callToAction: "BOOK_NOW",
              format: "Reel Video (9:16)",
              assetUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80",
              previewUrl: "https://bharatyatra.ai",
              leadsCaptured: 0,
              bookingsAttributed: 0,
            },
          ],
        },
      ],
    };

    setCampaigns([newCamp, ...campaigns]);
    setSelectedCampaign(newCamp);
    setIsCreateModalOpen(false);
    setNewCampName("");
    onToast(`Meta Campaign "${newCamp.name}" published to Meta Graph API! 🚀`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Account Status */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950 via-slate-900 to-pink-950 border border-pink-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg">
            <Radio className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">Meta Advertising Suite (Facebook &amp; Instagram)</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Meta Business Account Connected (ID: 771-928-44)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Facebook Feed, Instagram Reels, Instant Lead Forms, Lookalike Audiences &amp; Meta Conversions API (CAPI).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-lg shadow-pink-600/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Meta Campaign
          </button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Meta Spend</span>
          <div className="text-xl font-black text-white mt-1">₹{(totalMetaSpend / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-slate-500">FB &amp; IG Advantage+</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Attributed Revenue</span>
          <div className="text-xl font-black text-emerald-400 mt-1">₹{(totalMetaRevenue / 100000).toFixed(2)}L</div>
          <span className="text-[10px] text-emerald-400 font-bold">ROAS: {metaAvgRoas}x</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Instant Leads Captured</span>
          <div className="text-xl font-black text-pink-300 mt-1">{totalMetaLeads.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">Avg CPL: ₹140.80</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Booking Conversions</span>
          <div className="text-xl font-black text-indigo-300 mt-1">{totalMetaBookings.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-slate-400">Direct App Bookings</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 col-span-2 sm:col-span-1">
          <span className="text-[11px] text-slate-400 font-semibold block">Meta CAPI Sync Health</span>
          <div className="text-xl font-black text-emerald-400 mt-1">100%</div>
          <span className="text-[10px] text-emerald-400 font-semibold">Zero Event Dropoff</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: "campaigns", label: "Meta Campaigns", icon: Target },
          { id: "ad_sets", label: "Ad Sets & Creatives", icon: Layers },
          { id: "audiences", label: "Custom & Lookalike Audiences", icon: Users, count: audiences.length },
          { id: "lead_forms", label: "Instant Lead Forms", icon: Smartphone },
          { id: "capi_status", label: "Conversions API (CAPI)", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
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

      {/* CAMPAIGNS SUB-TAB */}
      {subTab === "campaigns" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Campaigns List */}
            <div className="lg:col-span-1 space-y-2.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Active Meta Campaigns ({campaigns.length})
              </span>
              {campaigns.map((camp) => {
                const isSelected = selectedCampaign.id === camp.id;
                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaign(camp)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "bg-purple-950/50 border-pink-500 ring-1 ring-pink-400 shadow-lg"
                        : "bg-slate-800/70 border-slate-700/80 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-[10px] font-bold text-pink-300 uppercase">
                        {camp.objective}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          camp.status === "ACTIVE"
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
                        <span className="text-slate-400 block text-[9px]">Leads Captured:</span>
                        <strong>{camp.leadsCount}</strong>
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
                      <span className="px-2 py-0.5 rounded bg-pink-900/60 text-pink-300 border border-pink-700/60 text-[10px] font-bold">
                        {selectedCampaign.objective}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{selectedCampaign.adAccountId}</span>
                    </div>
                    <h3 className="text-base font-black text-white mt-1">{selectedCampaign.name}</h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Budget: <strong className="text-emerald-400">₹{(selectedCampaign.totalBudgetINR / 1000).toFixed(0)}k ({selectedCampaign.budgetType})</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedCampaign.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        selectedCampaign.status === "ACTIVE"
                          ? "bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40"
                          : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40"
                      }`}
                    >
                      {selectedCampaign.status === "ACTIVE" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{selectedCampaign.status === "ACTIVE" ? "Pause Ad" : "Resume Ad"}</span>
                    </button>
                  </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Reach / Frequency</span>
                    <div className="text-sm font-black text-white mt-0.5">
                      {selectedCampaign.reach.toLocaleString("en-IN")} ({selectedCampaign.frequency}x)
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">CTR / CPC</span>
                    <div className="text-sm font-black text-pink-300 mt-0.5">
                      {selectedCampaign.ctr}% (₹{selectedCampaign.cpcINR})
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">Cost Per Lead</span>
                    <div className="text-sm font-black text-amber-300 mt-0.5">₹{selectedCampaign.costPerLeadINR}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-semibold">ROAS / Revenue</span>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      {selectedCampaign.roas}x (₹{(selectedCampaign.revenueAttributedINR / 100000).toFixed(1)}L)
                    </div>
                  </div>
                </div>

                {/* Ad Set Details */}
                {selectedCampaign.adSets.map((as) => (
                  <div key={as.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">{as.name}</h4>
                      <span className="text-[10px] text-indigo-300 font-mono">₹{as.dailyBudgetINR}/day</span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {as.placements.map((pl, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">
                          {pl}
                        </span>
                      ))}
                    </div>

                    {/* Creative preview */}
                    {as.creatives.map((cr) => (
                      <div key={cr.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3">
                        <img src={cr.assetUrl} alt="Creative" className="w-16 h-20 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] text-pink-400 font-bold uppercase tracking-wider block">
                            {cr.format} • CTA: {cr.callToAction}
                          </span>
                          <h5 className="text-xs font-black text-white mt-0.5">{cr.headline}</h5>
                          <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{cr.primaryText}</p>
                          <div className="text-[10px] text-emerald-400 font-semibold mt-1">
                            {cr.leadsCaptured} Leads • {cr.bookingsAttributed} Bookings
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AUDIENCES SUB-TAB */}
      {subTab === "audiences" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-sm font-black text-white">Meta Custom &amp; Lookalike Audiences</h3>
              <p className="text-xs text-slate-400">
                Segmented CRM lists, 1% top travel spender lookalikes, and cart abandoner retargeting pools.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audiences.map((aud) => (
              <div key={aud.id} className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-bold text-pink-300 uppercase">
                    {aud.type.replace(/_/g, " ")}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                    {aud.matchRatePercent}% Match Rate
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{aud.name}</h4>
                  <span className="text-xs text-slate-400 mt-0.5 block">
                    Audience Size: <strong className="text-white">{(aud.size / 1000).toLocaleString("en-IN")}k People</strong>
                  </span>
                </div>

                <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/80 flex items-center justify-between">
                  <span>Source: <strong className="text-slate-300">{aud.source}</strong></span>
                  <span>Sync: <strong className="text-indigo-300">{aud.lastUpdated}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LEAD FORMS SUB-TAB */}
      {subTab === "lead_forms" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">Meta Instant Forms &amp; CRM Webhook Ingestion</h3>
                <p className="text-xs text-slate-400">
                  Instant lead sync into live CRM with automatic AI lead scoring and WhatsApp greeting trigger.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                Webhook Sync: Active (0s delay)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-white block">Active Form: 'Char Dham VIP Helicopter Inquiries 2026'</span>
              <p className="text-xs text-slate-400">
                Form Fields: Full Name, WhatsApp Mobile Number, City, Travel Month, Passenger Count, Helicopter Helipad Preference.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onToast("Test lead simulated and pushed to CRM pipeline! 📨")}
                  className="px-3.5 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Simulate Test Lead Ingestion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CAPI STATUS SUB-TAB */}
      {subTab === "capi_status" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-black text-white">Meta Conversions API (CAPI) Server Health</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                Redundant Dual-Tagging
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Server Event Quality Score:</span>
                <strong className="text-emerald-400 text-sm">9.8 / 10.0 (Excellent)</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Deduplication Rate:</span>
                <strong className="text-white text-sm">100.0% Match with Browser Pixel</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Server Response Latency:</span>
                <strong className="text-pink-300 text-sm">34ms (Direct Graph Endpoint)</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Meta Campaign Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white">Create New Meta Advertising Campaign</h3>
            <form onSubmit={handleCreateMetaCampaign} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meta_Reels_Goa_Beachfront_Luxury_Villas"
                  value={newCampName}
                  onChange={(e) => setNewCampName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Campaign Objective</label>
                  <select
                    value={newCampObjective}
                    onChange={(e) => setNewCampObjective(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="CONVERSIONS">Sales &amp; Conversions</option>
                    <option value="LEAD_GENERATION">Lead Generation (Instant Form)</option>
                    <option value="TRAFFIC">Traffic to Landing Page</option>
                    <option value="VIDEO_VIEWS">Video / Reels Views</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Total Budget (INR)</label>
                  <input
                    type="number"
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
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
                  className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold"
                >
                  Launch Meta Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
