import React, { useState } from "react";
import {
  AUTOMATION_DRIP_FLOWS_DATA,
  AutomationDripFlow,
} from "../../data/aiCrmMarketingData";
import {
  Play,
  Pause,
  Plus,
  ArrowRight,
  Sparkles,
  Zap,
  Clock,
  Send,
  Users,
  Percent,
  Coins,
  CheckCircle,
} from "lucide-react";

export function AiAutomationDripEngine() {
  const [flows, setFlows] = useState<AutomationDripFlow[]>(AUTOMATION_DRIP_FLOWS_DATA);
  const [selectedFlowId, setSelectedFlowId] = useState<string>(flows[0].id);
  const [isSimulatingTrigger, setIsSimulatingTrigger] = useState(false);
  const [simulationLog, setSimulationLog] = useState<string | null>(null);

  const selectedFlow = flows.find((f) => f.id === selectedFlowId) || flows[0];

  const toggleFlowStatus = (flowId: string) => {
    setFlows((prev) =>
      prev.map((f) => {
        if (f.id === flowId) {
          const newStatus = f.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          return { ...f, status: newStatus };
        }
        return f;
      })
    );
  };

  const handleSimulateTrigger = () => {
    setIsSimulatingTrigger(true);
    setSimulationLog("Evaluating cart timeout condition: Event matched for Lead #LEAD-901 (+15m threshold)...");
    setTimeout(() => {
      setSimulationLog(
        "WhatsApp Business Cloud API trigger executed successfully: Message template 'kashmir_winter_hold_v2' delivered with 200 OK. Dynamic token replaced: [Name: Dr. Arvind Subramanian, Destination: Gulmarg]."
      );
      setIsSimulatingTrigger(false);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Automated Flows</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {flows.filter((f) => f.status === "ACTIVE").length} of {flows.length}
          </div>
          <div className="text-[11px] text-emerald-400 font-bold">24/7 Autonomous Triggers</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Enrolled Travelers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">20,970</div>
          <div className="text-[11px] text-cyan-300 font-bold">+18.4% this week</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Avg Omnichannel Open Rate</span>
            <Percent className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">92.9%</div>
          <div className="text-[11px] text-emerald-300 font-bold">WhatsApp Green-Tick Tier</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Drip Attribution Revenue</span>
            <Coins className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">₹70.45 Lakhs</div>
          <div className="text-[11px] text-purple-300 font-bold">Closed via automated sequences</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Flow list column */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Automated Sequences</h3>
            <span className="text-xs text-slate-400">3 Pre-configured</span>
          </div>

          <div className="space-y-2">
            {flows.map((flow) => {
              const isSelected = flow.id === selectedFlowId;
              return (
                <div
                  key={flow.id}
                  onClick={() => setSelectedFlowId(flow.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10"
                      : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                        {flow.channel}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1.5 line-clamp-1">{flow.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">Trigger: {flow.triggerEvent}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFlowStatus(flow.id);
                      }}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        flow.status === "ACTIVE"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                      }`}
                      title={flow.status === "ACTIVE" ? "Pause Workflow" : "Activate Workflow"}
                    >
                      {flow.status === "ACTIVE" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px]">
                    <div>
                      <span className="text-slate-500 block">Enrolled</span>
                      <span className="text-white font-bold">{flow.enrolledCount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Open Rate</span>
                      <span className="text-emerald-400 font-bold">{flow.openRate}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Conversion</span>
                      <span className="text-indigo-400 font-bold">{flow.conversionRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected flow canvas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider font-mono">
                  Visual Flow Designer ({selectedFlow.channel})
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">{selectedFlow.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Trigger condition: <span className="text-slate-200 font-medium">{selectedFlow.triggerEvent}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSimulateTrigger}
                  disabled={isSimulatingTrigger}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSimulatingTrigger ? "Triggering..." : "Simulate Event"}</span>
                </button>
              </div>
            </div>

            {simulationLog && (
              <div className="p-3 rounded-xl bg-slate-950 border border-indigo-500/40 text-xs font-mono text-indigo-300 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Webhook Simulator Output</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{simulationLog}</p>
              </div>
            )}

            {/* Step Sequence Timeline */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Execution Steps &amp; Fallback Rules</span>
              </div>

              <div className="space-y-3 relative before:absolute before:top-4 before:bottom-4 before:left-5 before:w-0.5 before:bg-slate-800">
                {selectedFlow.steps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0 z-10 shadow-md group-hover:scale-105 transition-transform">
                      {step.stepNumber}
                    </div>

                    <div className="flex-1 p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-1.5">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-white tracking-tight flex items-center gap-2">
                          <Send className="w-3.5 h-3.5 text-indigo-400" />
                          {step.actionType.replace(/_/g, " ")}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold">
                          Delay: {step.delay}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 bg-slate-900/90 p-2.5 rounded-lg border border-slate-800/60 font-mono leading-relaxed">
                        {step.previewText}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
