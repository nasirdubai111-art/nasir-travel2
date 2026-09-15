import React, { useState } from "react";
import { GOOGLE_ADS_DATA, GoogleAdsPMaxCampaign } from "../../data/googleAdsData";
import {
  Globe,
  TrendingUp,
  Search,
  CheckCircle,
  Tag,
  Ban,
  ArrowUpRight,
  Target,
  BarChart3,
} from "lucide-react";

export function GoogleAdsPerformanceMax() {
  const [campaigns] = useState<GoogleAdsPMaxCampaign[]>(GOOGLE_ADS_DATA);
  const [activeTab, setActiveTab] = useState<"CAMPAIGNS" | "KEYWORDS" | "NEGATIVES">("CAMPAIGNS");

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 via-slate-900 to-amber-950/60 border border-red-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center font-black">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Google Ads Performance Max &amp; High-Intent Search</h3>
              <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/40">
                PMax 5-Channel Sync
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Omnipresent coverage across Google Search, Google Maps, YouTube, Gmail &amp; Display Network
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("CAMPAIGNS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "CAMPAIGNS" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            Campaigns
          </button>
          <button
            onClick={() => setActiveTab("KEYWORDS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "KEYWORDS" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            High-Intent Queries
          </button>
          <button
            onClick={() => setActiveTab("NEGATIVES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "NEGATIVES" ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400"
            }`}
          >
            Negative Keywords
          </button>
        </div>
      </div>

      {/* Campaign Cards */}
      {activeTab === "CAMPAIGNS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                    {c.type.replace(/_/g, " ")}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1.5">{c.name}</h4>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                  {c.currentRoas}% ROAS
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                <div>
                  <span className="text-slate-500 block">Daily Budget</span>
                  <span className="text-white font-bold">₹{c.dailyBudget.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Avg CPC</span>
                  <span className="text-emerald-400 font-bold">₹{c.avgCpc}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Conversions</span>
                  <span className="text-indigo-400 font-bold">{c.conversions.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-bold">Top Performing Search Queries:</span>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {c.highIntentKeywords.slice(0, 3).map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-[11px] font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Keywords Tab */}
      {activeTab === "KEYWORDS" && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h4 className="text-sm font-bold text-white">Target High-Intent Search Queries</h4>
          <p className="text-xs text-slate-400">
            Automated Google Ads PMax bid adjustments prioritized for bottom-of-funnel transactions.
          </p>
          <div className="divide-y divide-slate-800">
            {campaigns[0].highIntentKeywords.map((kw, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <span className="font-mono text-slate-200">{kw}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                  Avg CPC ₹12.50 • Quality Score 10/10
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Negatives Tab */}
      {activeTab === "NEGATIVES" && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <Ban className="w-4 h-4" />
            <span>Active Negative Keyword Guardrails</span>
          </div>
          <p className="text-xs text-slate-400">
            Guarantees zero ad budget wastage on job seekers, piracy, or complaints.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {[...campaigns[0].negativeKeywords, ...campaigns[1].negativeKeywords].map((neg, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs font-mono"
              >
                -{neg}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
