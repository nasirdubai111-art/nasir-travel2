import React, { useState } from "react";
import { CRM_LEADS_DATA, CrmLead } from "../../data/aiCrmMarketingData";
import {
  Kanban,
  DollarSign,
  TrendingUp,
  Flame,
  ArrowRight,
  Filter,
  Plus,
  Phone,
  Mail,
  User,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const STAGES: { key: CrmLead["stage"]; label: string; color: string }[] = [
  { key: "NEW_LEAD", label: "New Leads", color: "border-blue-500/50 text-blue-400 bg-blue-500/10" },
  { key: "QUALIFIED", label: "Qualified", color: "border-indigo-500/50 text-indigo-400 bg-indigo-500/10" },
  { key: "PROPOSAL_SENT", label: "Proposal Sent", color: "border-purple-500/50 text-purple-400 bg-purple-500/10" },
  { key: "NEGOTIATION", label: "Negotiation", color: "border-amber-500/50 text-amber-400 bg-amber-500/10" },
  { key: "CLOSED_WON", label: "Closed Won", color: "border-emerald-500/50 text-emerald-400 bg-emerald-500/10" },
];

export function CrmDealPipelineKanban() {
  const [leads, setLeads] = useState<CrmLead[]>(CRM_LEADS_DATA);
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);

  const totalPipelineValue = leads.reduce((sum, l) => sum + l.dealValue, 0);
  const closedWonValue = leads
    .filter((l) => l.stage === "CLOSED_WON")
    .reduce((sum, l) => sum + l.dealValue, 0);

  const moveStage = (leadId: string, nextStage: CrmLead["stage"]) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === leadId ? { ...lead, stage: nextStage } : lead))
    );
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Active Pipeline</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{(totalPipelineValue / 100000).toFixed(2)} Lakhs</div>
          <div className="text-[11px] text-emerald-400 font-bold">{leads.length} Active Deals</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Closed Won Revenue</span>
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">₹{(closedWonValue / 100000).toFixed(2)} Lakhs</div>
          <div className="text-[11px] text-cyan-300 font-bold">100% Realized via Split Pay</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Average AI Intent Score</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">92.8 / 100</div>
          <div className="text-[11px] text-amber-400 font-bold">High intent luxury travel leads</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Pipeline Win Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">34.2%</div>
          <div className="text-[11px] text-purple-300 font-bold">Industry benchmark: 18%</div>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colLeads = leads.filter((l) => l.stage === col.key);
          const colValue = colLeads.reduce((sum, l) => sum + l.dealValue, 0);

          return (
            <div key={col.key} className="flex flex-col min-w-[260px] bg-slate-950/60 rounded-2xl border border-slate-800/80 p-3 space-y-3">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${col.color}`}>
                    {col.label}
                  </span>
                  <span className="text-xs font-bold text-slate-400">({colLeads.length})</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">
                  ₹{(colValue / 1000).toFixed(0)}k
                </span>
              </div>

              {/* Deals in this column */}
              <div className="flex-1 space-y-3 overflow-y-auto">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-2 group shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400">{lead.id}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          lead.intent === "HIGH"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        AI {lead.aiScore}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                      {lead.name}
                    </h4>

                    <div className="text-[11px] text-slate-300 flex items-center justify-between">
                      <span className="text-indigo-400 font-medium truncate max-w-[130px]">
                        {lead.destination}
                      </span>
                      <span className="font-bold text-white font-mono">
                        ₹{(lead.dealValue / 1000).toFixed(0)}k
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed bg-slate-950/60 p-1.5 rounded">
                      {lead.notes}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{lead.city}</span>
                      <span>{lead.lastContacted}</span>
                    </div>

                    {/* Quick Move Stage Actions */}
                    <div className="pt-2 flex items-center justify-end gap-1 border-t border-slate-800/80">
                      {col.key !== "CLOSED_WON" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextIdx = STAGES.findIndex((s) => s.key === col.key) + 1;
                            if (nextIdx < STAGES.length) {
                              moveStage(lead.id, STAGES[nextIdx].key);
                            }
                          }}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-[10px] font-bold flex items-center gap-1 transition-all"
                        >
                          <span>Next</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Lead Modal Detail */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold">{selectedLead.id}</span>
                <h3 className="text-lg font-bold text-white">{selectedLead.name}</h3>
              </div>
              <span className="text-lg font-black text-emerald-400 font-mono">
                ₹{selectedLead.dealValue.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Phone &amp; Location</span>
                <span className="text-white font-bold block">{selectedLead.phone}</span>
                <span className="text-slate-400 block">{selectedLead.city}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">AI Intent Score</span>
                <span className="text-emerald-400 font-bold text-base block">{selectedLead.aiScore} / 100</span>
                <span className="text-slate-400 block">Source: {selectedLead.source}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1 text-xs">
              <span className="text-slate-500 block">Travel Notes &amp; Special Requirements</span>
              <p className="text-slate-200 leading-relaxed">{selectedLead.notes}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
