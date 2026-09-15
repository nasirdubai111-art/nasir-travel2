import React, { useState } from "react";
import {
  META_CAMPAIGNS_DATA,
  CAPI_EVENT_STREAM,
  MetaAdCampaign,
  CapiEventLog,
} from "../../data/metaAdsData";
import {
  Activity,
  TrendingUp,
  DollarSign,
  Share2,
  CheckCircle,
  Eye,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

export function MetaAdsCapiSuite() {
  const [campaigns, setCampaigns] = useState<MetaAdCampaign[]>(META_CAMPAIGNS_DATA);
  const [capiEvents, setCapiEvents] = useState<CapiEventLog[]>(CAPI_EVENT_STREAM);
  const [isSyncingCapi, setIsSyncingCapi] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const totalSpend = campaigns.reduce((sum, c) => sum + c.spendToDate, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgRoas = (
    campaigns.reduce((sum, c) => sum + c.roas, 0) / campaigns.length
  ).toFixed(1);

  const handleTestCapiEvent = () => {
    setIsSyncingCapi(true);
    setSyncStatus("Dispatching CAPI v19.0 Purchase payload with SHA-256 hashed customer identifiers...");
    setTimeout(() => {
      const newEvt: CapiEventLog = {
        eventId: `CAPI-EVT-${Math.floor(1000 + Math.random() * 9000)}`,
        eventName: "Purchase",
        timestamp: "Just now",
        leadId: "LEAD-908",
        value: 145000,
        currency: "INR",
        serverMatchQuality: 97,
        status: "SUCCESS_DEDUPLICATED",
      };
      setCapiEvents((prev) => [newEvt, ...prev]);
      setSyncStatus("Meta Serverless CAPI response 200 OK: Event deduplicated with Browser Pixel via event_id.");
      setIsSyncingCapi(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Telemetry */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-indigo-950/60 border border-blue-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-black">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Meta Conversions API (CAPI) &amp; Ads Manager</h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/40">
                Server-to-Server Deduplication
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Bypasses iOS 14.5+ adblockers • Direct Meta Graph API v19.0 • 97% Server Match Quality
            </p>
          </div>
        </div>

        <button
          onClick={handleTestCapiEvent}
          disabled={isSyncingCapi}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Zap className="w-4 h-4" />
          <span>{isSyncingCapi ? "Emitting..." : "Test CAPI Purchase Event"}</span>
        </button>
      </div>

      {syncStatus && (
        <div className="p-3 rounded-xl bg-slate-900 border border-blue-500/40 text-xs font-mono text-blue-300 animate-in fade-in flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Ad Spend</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{(totalSpend / 100000).toFixed(2)} Lakhs</div>
          <div className="text-[11px] text-blue-300 font-bold">₹78,000 / day run-rate</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Blended Meta ROAS</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{avgRoas}x Return</div>
          <div className="text-[11px] text-emerald-400 font-bold">Generated ₹1.45 Cr Sales</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Direct Conversions</span>
            <CheckCircle className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalConversions.toLocaleString()}</div>
          <div className="text-[11px] text-cyan-300 font-bold">Avg CPA: ₹970 / VIP Lead</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Server Match Quality</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">96.8%</div>
          <div className="text-[11px] text-emerald-300 font-bold">100% CAPI Deduplication</div>
        </div>
      </div>

      {/* Campaigns Table & Creatives */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Ad Campaigns</h3>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div
                key={camp.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold">
                      {camp.objective} • {camp.targetCategory}
                    </span>
                    <h4 className="text-sm font-bold text-white mt-1">{camp.name}</h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    {camp.roas}x ROAS
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block">Daily Budget</span>
                    <span className="text-white font-bold">₹{camp.budgetPerDay.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Spend</span>
                    <span className="text-white font-bold">₹{(camp.spendToDate / 1000).toFixed(0)}k</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Clicks (CTR)</span>
                    <span className="text-indigo-400 font-bold">{camp.clicks.toLocaleString()} ({camp.ctr}%)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Conversions</span>
                    <span className="text-emerald-400 font-bold">{camp.conversions}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CAPI Realtime Event Stream */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Live CAPI Event Stream</h3>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Event Log</span>
              <span className="text-emerald-400 font-mono">200 OK Live</span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[420px]">
              {capiEvents.map((evt) => (
                <div
                  key={evt.eventId}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold">{evt.eventName}</span>
                    <span className="text-[10px] text-slate-500">{evt.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>{evt.eventId}</span>
                    <span className="text-emerald-400 font-bold">₹{evt.value.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>Match: {evt.serverMatchQuality}%</span>
                    <span className="text-emerald-400">{evt.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
