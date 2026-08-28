import React, { useState } from "react";
import {
  Search,
  TrendingUp,
  Globe,
  FileCode,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  Code,
  Cpu,
  Smartphone,
  Sliders,
  Filter,
  Check,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Database,
  Tag,
  ShieldCheck,
} from "lucide-react";
import {
  TravelSeoCategory,
  DestinationSeoRecord,
  TechnicalSeoAudit,
  INITIAL_SEO_RECORDS,
  INITIAL_TECHNICAL_SEO_AUDIT,
} from "../../data/seoBackendData";

interface SeoBackendViewProps {
  onToast: (msg: string) => void;
}

export function SeoBackendView({ onToast }: SeoBackendViewProps) {
  const [seoRecords, setSeoRecords] = useState<DestinationSeoRecord[]>(INITIAL_SEO_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<DestinationSeoRecord>(INITIAL_SEO_RECORDS[0]);
  const [audit] = useState<TechnicalSeoAudit>(INITIAL_TECHNICAL_SEO_AUDIT);
  const [subTab, setSubTab] = useState<
    "keyword_tracker" | "landing_editor" | "competitor_spy" | "schema_markup" | "technical_audit"
  >("keyword_tracker");

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");

  // Editable Meta fields for selected record
  const [editMetaTitle, setEditMetaTitle] = useState(selectedRecord.metaTitle);
  const [editMetaDesc, setEditMetaDesc] = useState(selectedRecord.metaDescription);
  const [editH1, setEditH1] = useState(selectedRecord.h1Tag);

  // Sync edits when selectedRecord changes
  const handleSelectRecord = (rec: DestinationSeoRecord) => {
    setSelectedRecord(rec);
    setEditMetaTitle(rec.metaTitle);
    setEditMetaDesc(rec.metaDescription);
    setEditH1(rec.h1Tag);
  };

  // Save Meta Updates
  const handleSaveMeta = (e: React.FormEvent) => {
    e.preventDefault();
    setSeoRecords((prev) =>
      prev.map((r) =>
        r.id === selectedRecord.id
          ? {
              ...r,
              metaTitle: editMetaTitle,
              metaDescription: editMetaDesc,
              h1Tag: editH1,
            }
          : r
      )
    );
    setSelectedRecord((prev) => ({
      ...prev,
      metaTitle: editMetaTitle,
      metaDescription: editMetaDesc,
      h1Tag: editH1,
    }));
    onToast(`SEO On-Page metadata updated & deployed to SSR Edge Cache! 🚀`);
  };

  const categories: string[] = [
    "All Categories",
    "Pilgrimage",
    "Hotels",
    "Resorts",
    "Flights",
    "Trains",
    "Houseboats",
    "India destinations",
    "Cities",
    "Tours",
    "Buses",
    "Cabs",
    "Restaurants",
    "Travel packages",
  ];

  const filteredRecords = seoRecords.filter(
    (r) => selectedCategory === "All Categories" || r.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-white">Organic SEO &amp; Destination Ranking Engine</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                15k+ Indexed Pages
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Automated ranking tracking vs MakeMyTrip/Yatra, JSON-LD Schema markup, Core Web Vitals audit &amp; on-page metadata generator.
            </p>
          </div>
        </div>

        <button
          onClick={() => onToast("Triggered automated sitemap.xml rebuild & Google Search Console ping! 🌐")}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-600/20 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          Rebuild Sitemap XML
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Total Indexed URLs</span>
          <div className="text-xl font-black text-white mt-1">{audit.indexedPages.toLocaleString("en-IN")}</div>
          <span className="text-[10px] text-emerald-400 font-semibold">100% Google Green Index</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">#1 Rank Keywords</span>
          <div className="text-xl font-black text-emerald-400 mt-1">428 Keywords</div>
          <span className="text-[10px] text-slate-400">Outranking MMT &amp; Yatra</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Monthly Organic Reach</span>
          <div className="text-xl font-black text-indigo-300 mt-1">1.84M Visits</div>
          <span className="text-[10px] text-slate-400">Zero Ad Spend Value: ₹52L</span>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700">
          <span className="text-[11px] text-slate-400 font-semibold block">Avg Core Web Vitals</span>
          <div className="text-xl font-black text-teal-300 mt-1">98 / 100</div>
          <span className="text-[10px] text-emerald-400">LCP 1.4s • CLS 0.02</span>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto scrollbar-thin">
        {[
          { id: "keyword_tracker", label: "Keyword Tracker & 13 Travel Categories", icon: Database },
          { id: "landing_editor", label: "Landing-Page SEO & SERP Preview", icon: FileCode },
          { id: "competitor_spy", label: "MMT & Yatra Competitor Ranks", icon: TrendingUp },
          { id: "schema_markup", label: "JSON-LD Schema Markup", icon: Code },
          { id: "technical_audit", label: "Core Web Vitals & Robots.txt", icon: Cpu },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = subTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* KEYWORD TRACKER SUB-TAB */}
      {subTab === "keyword_tracker" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Keywords Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-700 bg-slate-900/90 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/90 text-slate-400 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-700">
                <tr>
                  <th className="p-3">Category &amp; Destination</th>
                  <th className="p-3">Primary Target Keyword</th>
                  <th className="p-3">Google Rank</th>
                  <th className="p-3">Monthly Vol</th>
                  <th className="p-3">CPC Value</th>
                  <th className="p-3">Intent</th>
                  <th className="p-3">Core Vitals</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredRecords.map((rec) => (
                  <tr
                    key={rec.id}
                    onClick={() => handleSelectRecord(rec)}
                    className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      selectedRecord.id === rec.id ? "bg-emerald-950/30" : ""
                    }`}
                  >
                    <td className="p-3">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-bold text-emerald-300 uppercase block w-fit mb-0.5">
                        {rec.category}
                      </span>
                      <strong className="text-white font-semibold">{rec.destination}</strong>
                    </td>
                    <td className="p-3 font-mono text-emerald-200">{rec.primaryKeyword}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black text-xs">
                        #{rec.currentRank}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300 font-mono">{(rec.monthlySearchVolume / 1000).toFixed(0)}k</td>
                    <td className="p-3 text-slate-400">₹{rec.cpcValueINR}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-300">
                        {rec.searchIntent}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-400 font-bold">{rec.coreWebVitalsScore}/100</span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectRecord(rec);
                          setSubTab("landing_editor");
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 text-xs font-bold"
                      >
                        Edit SEO
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* LANDING PAGE SEO EDITOR SUB-TAB */}
      {subTab === "landing_editor" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Editor */}
            <form onSubmit={handleSaveMeta} className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 text-[10px] font-bold uppercase">
                    {selectedRecord.category}
                  </span>
                  <h3 className="text-sm font-black text-white mt-1">{selectedRecord.destination}</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">Target: {selectedRecord.targetUrl}</span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Meta Title (Max 60 chars)</span>
                  <span className={editMetaTitle.length > 60 ? "text-amber-400" : "text-emerald-400"}>
                    {editMetaTitle.length}/60 chars
                  </span>
                </div>
                <input
                  type="text"
                  value={editMetaTitle}
                  onChange={(e) => setEditMetaTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Meta Description (Max 160 chars)</span>
                  <span className={editMetaDesc.length > 160 ? "text-amber-400" : "text-emerald-400"}>
                    {editMetaDesc.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={editMetaDesc}
                  onChange={(e) => setEditMetaDesc(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">H1 Heading Tag</label>
                <input
                  type="text"
                  value={editH1}
                  onChange={(e) => setEditH1(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Save &amp; Deploy On-Page SEO
                </button>
              </div>
            </form>

            {/* Right Live Google SERP Preview */}
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
                Live Google Search Desktop &amp; Mobile SERP Preview
              </span>

              <div className="p-4 rounded-xl bg-white text-slate-900 shadow-lg space-y-1.5 border border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[9px]">
                    BY
                  </div>
                  <div className="text-[11px] leading-tight">
                    <span className="font-bold text-slate-800">BharatYatra</span>
                    <span className="text-slate-500 block truncate">{selectedRecord.targetUrl}</span>
                  </div>
                </div>

                <h4 className="text-base text-blue-800 hover:underline cursor-pointer font-medium leading-snug">
                  {editMetaTitle}
                </h4>

                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">{editMetaDesc}</p>
              </div>

              {/* Technical tags */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Canonical Tag:</span>
                  <span className="font-mono text-emerald-300 text-[11px]">{selectedRecord.canonicalUrl}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Internal Links:</span>
                  <span>{selectedRecord.internalLinksCount} Contextual Links</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Image Alt Tags:</span>
                  <span>{selectedRecord.imageAltTagsCount} Images Fully Tagged</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPETITOR SPY SUB-TAB */}
      {subTab === "competitor_spy" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">Competitor Ranking Comparison Engine</h3>
                <p className="text-xs text-slate-400">
                  Daily automated ranking crawler comparing BharatYatra vs MakeMyTrip, Yatra &amp; EaseMyTrip.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                Daily SERP Scraping: Active
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/90 text-slate-400 font-extrabold uppercase text-[10px] border-b border-slate-700">
                  <tr>
                    <th className="p-3">Target Keyword</th>
                    <th className="p-3 text-emerald-400 font-bold">BharatYatra (Us)</th>
                    <th className="p-3">MakeMyTrip</th>
                    <th className="p-3">Yatra.com</th>
                    <th className="p-3">EaseMyTrip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {seoRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/50">
                      <td className="p-3 font-semibold text-white font-mono">{r.primaryKeyword}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black">
                          #{r.currentRank}
                        </span>
                      </td>
                      <td className="p-3 text-slate-300">#{r.competitorRanks.makeMyTripRank}</td>
                      <td className="p-3 text-slate-300">#{r.competitorRanks.yatraRank}</td>
                      <td className="p-3 text-slate-300">#{r.competitorRanks.easeMyTripRank}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SCHEMA MARKUP SUB-TAB */}
      {subTab === "schema_markup" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">JSON-LD Structured Data Schema Markup</h3>
                <p className="text-xs text-slate-400">
                  TouristDestination, Hotel, Trip &amp; TravelAgency schemas for Google Rich Snippets &amp; Knowledge Graph.
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedRecord.structuredDataJsonLd);
                  onToast("Copied Schema JSON-LD code to clipboard! 📋");
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Schema
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 whitespace-pre overflow-x-auto">
              {selectedRecord.structuredDataJsonLd}
            </div>
          </div>
        </div>
      )}

      {/* TECHNICAL AUDIT SUB-TAB */}
      {subTab === "technical_audit" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white">Core Web Vitals &amp; Server Robots.txt Audit</h3>
                <p className="text-xs text-slate-400">Automated Google Bot crawler health, LCP, FID, CLS scores.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Robots.txt Healthy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Largest Contentful Paint (LCP)</span>
                <strong className="text-emerald-400 text-base">{audit.averageLcpSeconds}s (Fast)</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Cumulative Layout Shift (CLS)</span>
                <strong className="text-emerald-400 text-base">{audit.averageClsScore} (Stable)</strong>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Mobile Usability Pass Rate</span>
                <strong className="text-teal-300 text-base">{audit.mobileUsabilityPercent}%</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
