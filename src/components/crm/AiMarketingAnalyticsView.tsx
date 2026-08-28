import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Search,
  Video,
  Share2,
  FileText,
  Sparkles,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Calendar,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  PieChart as PieChartIcon,
  RefreshCw,
  Compass,
} from "lucide-react";

interface AiMarketingAnalyticsViewProps {
  onToast: (msg: string) => void;
}

export function AiMarketingAnalyticsView({ onToast }: AiMarketingAnalyticsViewProps) {
  const [activeReportTab, setActiveReportTab] = useState<
    "executive_overview" | "marketing_kpis" | "content_kpis" | "seo_kpis" | "attribution" | "ai_reports"
  >("executive_overview");

  const [attributionModel, setAttributionModel] = useState<"First_Touch" | "Last_Touch" | "Linear" | "Position_Based" | "Time_Decay">("Position_Based");

  const [dateRange, setDateRange] = useState<"Today" | "Last_7_Days" | "This_Month" | "Quarterly">("This_Month");

  // Summary KPIs
  const MARKETING_METRICS = {
    totalSpendINR: 428000,
    leadsCount: 1420,
    bookingsCount: 298,
    revenueGMVINR: 3840000,
    cacINR: 1436,
    cplINR: 301,
    cpaINR: 1436,
    roas: 8.97,
    conversionRate: 20.98,
  };

  const CONTENT_METRICS = {
    totalReach: 3840000,
    videoViews: 2450000,
    avgEngagementRate: 8.42,
    totalShares: 48200,
    totalSaves: 32600,
    followersGained: 18400,
    leadsFromContent: 412,
  };

  const SEO_METRICS = {
    organicVisitorsMonthly: 1840000,
    indexedKeywordsCount: 1240,
    avgRankPosition: 2.8,
    organicCtrPercent: 6.84,
    organicConversionsCount: 384,
    organicRevenueINR: 1480000,
  };

  const CHANNEL_BREAKDOWN = [
    { channel: "Google Ads (Search & PMax)", spend: 180000, leads: 580, bookings: 132, revenue: 1680000, roas: 9.33, cpa: 1363 },
    { channel: "Meta Ads (Facebook & IG)", spend: 140000, leads: 490, bookings: 98, revenue: 1220000, roas: 8.71, cpa: 1428 },
    { channel: "Instagram & FB Reels (Organic)", spend: 35000, leads: 210, bookings: 44, revenue: 580000, roas: 16.57, cpa: 795 },
    { channel: "Organic SEO (Content Engine)", spend: 45000, leads: 140, bookings: 24, revenue: 360000, roas: 8.0, cpa: 1875 },
    { channel: "WhatsApp Concierge Broadcast", spend: 28000, leads: 95, bookings: 28, revenue: 380000, roas: 13.57, cpa: 1000 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">AI Marketing Analytics &amp; Revenue Attribution</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-bold">
                ROAS 8.97x
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Full-funnel telemetry across Google Ads, Meta, Reels, SEO &amp; Telesales with automated AI executive reporting.
            </p>
          </div>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-700">
            {(["Today", "Last_7_Days", "This_Month", "Quarterly"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDateRange(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  dateRange === d ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                }`}
              >
                {d.replace(/_/g, " ")}
              </button>
            ))}
          </div>

          <button
            onClick={() => onToast("Downloaded AI Executive Performance Report PDF! 📊")}
            className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: "executive_overview", label: "Executive Dashboard", icon: BarChart3 },
          { id: "marketing_kpis", label: "Paid Marketing (Google & Meta)", icon: Target },
          { id: "content_kpis", label: "Social & Reels Engagement", icon: Video },
          { id: "seo_kpis", label: "Organic SEO & Traffic", icon: Search },
          { id: "attribution", label: "Multi-Touch Attribution", icon: Layers },
          { id: "ai_reports", label: "AI Automated Reports", icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isAct = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isAct
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

      {/* 1. EXECUTIVE DASHBOARD OVERVIEW */}
      {activeReportTab === "executive_overview" && (
        <div className="space-y-6">
          {/* Top 4 Hero KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block">Total Marketing Spend</span>
              <div className="text-xl font-black text-white mt-1">₹{(MARKETING_METRICS.totalSpendINR / 1000).toFixed(0)}k</div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> Within Target Budget
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block">Total Attributed GMV</span>
              <div className="text-xl font-black text-emerald-400 mt-1">₹{(MARKETING_METRICS.revenueGMVINR / 100000).toFixed(2)}L</div>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +28.4% MoM
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block">Blended ROAS</span>
              <div className="text-xl font-black text-indigo-300 mt-1">{MARKETING_METRICS.roas}x</div>
              <span className="text-[10px] text-slate-400">Target Benchmark: 6.0x</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 block">Lead → Booking Conv.</span>
              <div className="text-xl font-black text-teal-300 mt-1">{MARKETING_METRICS.conversionRate}%</div>
              <span className="text-[10px] text-teal-400 font-semibold">{MARKETING_METRICS.bookingsCount} Total Bookings</span>
            </div>
          </div>

          {/* Channel Comparison Table */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-white">Omnichannel Performance Comparison</h4>
                <p className="text-xs text-slate-400">Comparing spend, lead quality, booking take-rate and blended ROAS.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold">
                5 Active Channels
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/90 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-700">
                  <tr>
                    <th className="p-3">Campaign Channel</th>
                    <th className="p-3">Spend (INR)</th>
                    <th className="p-3">Leads</th>
                    <th className="p-3">Bookings</th>
                    <th className="p-3">Revenue (GMV)</th>
                    <th className="p-3">CPA</th>
                    <th className="p-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {CHANNEL_BREAKDOWN.map((ch) => (
                    <tr key={ch.channel} className="hover:bg-slate-800/60 transition-colors">
                      <td className="p-3 font-bold text-white">{ch.channel}</td>
                      <td className="p-3 font-mono">₹{ch.spend.toLocaleString("en-IN")}</td>
                      <td className="p-3 font-mono text-indigo-300">{ch.leads}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{ch.bookings}</td>
                      <td className="p-3 font-mono font-bold text-white">₹{(ch.revenue / 100000).toFixed(2)}L</td>
                      <td className="p-3 font-mono text-slate-400">₹{ch.cpa}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs">
                          {ch.roas}x
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAID MARKETING KPIS */}
      {activeReportTab === "marketing_kpis" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Cost Per Lead (CPL)</span>
              <div className="text-xl font-black text-white mt-1">₹{MARKETING_METRICS.cplINR}</div>
              <span className="text-[10px] text-emerald-400">-14% vs Last Month</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Cost Per Acquisition (CPA)</span>
              <div className="text-xl font-black text-white mt-1">₹{MARKETING_METRICS.cpaINR}</div>
              <span className="text-[10px] text-emerald-400">Target ₹1,800 Met</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Total Leads Generated</span>
              <div className="text-xl font-black text-indigo-300 mt-1">{MARKETING_METRICS.leadsCount}</div>
              <span className="text-[10px] text-slate-400">Qualified: 84.2%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Customer Acquisition Cost (CAC)</span>
              <div className="text-xl font-black text-teal-300 mt-1">₹{MARKETING_METRICS.cacINR}</div>
              <span className="text-[10px] text-teal-400">High LTV to CAC: 12.4x</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. CONTENT KPIS */}
      {activeReportTab === "content_kpis" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Organic Video Views</span>
              <div className="text-xl font-black text-white mt-1">{(CONTENT_METRICS.videoViews / 1000000).toFixed(2)}M</div>
              <span className="text-[10px] text-emerald-400">Reels &amp; Shorts</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Avg Engagement Rate</span>
              <div className="text-xl font-black text-emerald-400 mt-1">{CONTENT_METRICS.avgEngagementRate}%</div>
              <span className="text-[10px] text-slate-400">Industry Avg: 3.2%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Shares &amp; Saves</span>
              <div className="text-xl font-black text-indigo-300 mt-1">80.8k Total</div>
              <span className="text-[10px] text-indigo-300">{CONTENT_METRICS.totalSaves} Saves</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Direct Leads From Reels</span>
              <div className="text-xl font-black text-teal-300 mt-1">{CONTENT_METRICS.leadsFromContent}</div>
              <span className="text-[10px] text-emerald-400">₹0 Paid Spend</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. SEO KPIS */}
      {activeReportTab === "seo_kpis" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Organic Search Traffic</span>
              <div className="text-xl font-black text-white mt-1">{(SEO_METRICS.organicVisitorsMonthly / 1000000).toFixed(2)}M</div>
              <span className="text-[10px] text-emerald-400">Google India Index</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Rank 1-3 Keywords</span>
              <div className="text-xl font-black text-emerald-400 mt-1">428 Keywords</div>
              <span className="text-[10px] text-slate-400">Outranking Competitors</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Organic CTR</span>
              <div className="text-xl font-black text-indigo-300 mt-1">{SEO_METRICS.organicCtrPercent}%</div>
              <span className="text-[10px] text-slate-400">Rich Snippets Enabled</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
              <span className="text-[11px] text-slate-400 font-semibold block">Organic Booking GMV</span>
              <div className="text-xl font-black text-teal-300 mt-1">₹{(SEO_METRICS.organicRevenueINR / 100000).toFixed(2)}L</div>
              <span className="text-[10px] text-emerald-400">Zero Ad Cost</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. MULTI-TOUCH REVENUE ATTRIBUTION */}
      {activeReportTab === "attribution" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-white">Full-Funnel Multi-Touch Attribution Engine</h4>
                <p className="text-xs text-slate-400">
                  Select model to analyze credit distribution across First Touch, Mid-Funnel Re-engagement &amp; Telesales Closing Touch.
                </p>
              </div>

              {/* Attribution Model Switcher */}
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                {(["First_Touch", "Last_Touch", "Linear", "Position_Based", "Time_Decay"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setAttributionModel(m);
                      onToast(`Switched attribution model to ${m.replace("_", " ")}`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      attributionModel === m ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {m.replace("_", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* Attribution Diagram */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                Lead Touchpoint Journey Sample (Lead ID: META-2026-000145):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-blue-400 font-bold block">1. First Touch (40% Weight)</span>
                  <strong className="text-white">Instagram Reel Video</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Watched 100% of Manali Guide</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-indigo-400 font-bold block">2. Consideration Touch (10%)</span>
                  <strong className="text-white">Google Search Ad</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Clicked 'Manali VIP Packages'</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-amber-400 font-bold block">3. Engagement Touch (10%)</span>
                  <strong className="text-white">WhatsApp Bot Chat</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Received Custom Itinerary PDF</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-emerald-400 font-bold block">4. Closing Touch (40% Weight)</span>
                  <strong className="text-white">Telesales Call Close</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Executive Priya Sharma (₹52k GMV)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. AI AUTOMATED REPORTS */}
      {activeReportTab === "ai_reports" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-black text-white">AI Automated Executive Marketing Reports</h4>
              </div>
              <button
                onClick={() => onToast("Refreshed AI Deep Attribution & Budget Efficiency analysis! ⚡")}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Re-Generate AI Analysis
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white font-bold">1. Daily Executive Performance Summary (28 Aug 2026)</strong>
                  <span className="text-[10px] text-emerald-400 font-bold">100% Target Met</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  • Total marketing investment today: ₹14,200 generating 48 high-intent leads and 9 confirmed bookings (₹1,18,000 GMV).
                  <br />• Top performing vector: Google Search PMax campaign for Chardham Darshan delivered 8.8x ROAS with ₹260 CPL.
                  <br />• Telesales team achieved 18.7% call-to-close conversion rate with average call duration of 4.6 minutes.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <strong className="text-xs text-white font-bold">2. Budget Efficiency &amp; Scaling Recommendation</strong>
                  <span className="text-[10px] text-indigo-400 font-bold">Growth Opportunity</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  • Shift ₹25,000 from Meta Broad Display ad sets (CTR 0.9%) to Instagram Reels High-Intent Lookalikes and Google Search high-intent keywords.
                  <br />• Expected outcome: Increase weekly lead volume by +24% with projected additional ₹4.2L in partner travel GMV.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
