import React, { useState, useEffect } from "react";
import {
  BellRing,
  Mail,
  Smartphone,
  X,
  ExternalLink,
  Sparkles,
  DollarSign,
  UserCheck,
  CheckCircle,
} from "lucide-react";
import { CrmLeadEntity, CrmAgentNotificationLog } from "../../../types/crm";

interface CrmAgentAlertToastProps {
  onSelectLead?: (lead: CrmLeadEntity) => void;
}

interface AlertItem {
  id: string;
  lead: CrmLeadEntity;
  notification: CrmAgentNotificationLog;
  timestamp: number;
  isSimulated?: boolean;
}

export const CrmAgentAlertToast: React.FC<CrmAgentAlertToastProps> = ({
  onSelectLead,
}) => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  useEffect(() => {
    const handleAlert = (e: Event) => {
      const customEvent = e as CustomEvent<{
        lead: CrmLeadEntity;
        notification: CrmAgentNotificationLog;
        isSimulated?: boolean;
      }>;
      if (!customEvent.detail || !customEvent.detail.lead) return;

      const newAlert: AlertItem = {
        id: `alert-${Date.now()}-${Math.random()}`,
        lead: customEvent.detail.lead,
        notification: customEvent.detail.notification,
        timestamp: Date.now(),
        isSimulated: customEvent.detail.isSimulated,
      };

      setAlerts((prev) => [newAlert, ...prev.slice(0, 2)]);

      // Auto dismiss after 9 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== newAlert.id));
      }, 9000);
    };

    window.addEventListener("bharatyatra:crm-agent-alert", handleAlert);
    return () => window.removeEventListener("bharatyatra:crm-agent-alert", handleAlert);
  }, []);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="pointer-events-auto p-4 rounded-2xl bg-slate-950/95 border border-purple-500/40 shadow-2xl shadow-purple-950/50 backdrop-blur-xl animate-in slide-in-from-top-4 duration-200 text-white"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 pb-2.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 animate-pulse">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-purple-300 uppercase tracking-wider">
                    High-Priority Lead Alert
                  </span>
                  {alert.isSimulated && (
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono border border-amber-500/30">
                      Simulated Test
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  Assigned to <span className="text-white font-semibold">{alert.lead.assigned_to}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleDismiss(alert.id)}
              className="text-slate-500 hover:text-white transition-all p-1"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Lead Details */}
          <div className="py-2.5 space-y-1.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-white text-sm">{alert.lead.customer_name}</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold font-mono text-[11px] border border-emerald-500/30">
                ₹{alert.lead.deal_value.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] line-clamp-1">
              📍 <span className="font-medium">{alert.lead.destination}</span>
            </p>

            <div className="flex items-center gap-2 pt-1 flex-wrap text-[10px]">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                {alert.lead.lead_id}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-900/40 border border-purple-500/30 text-purple-300 font-semibold">
                Priority: {alert.lead.priority || "High"}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-medium flex items-center gap-1">
                <Mail className="w-3 h-3" />
                <span>{alert.notification.channel === "Both" || alert.notification.channel === "Email" ? "Email Sent" : "Push Sent"}</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30 text-indigo-300 font-medium flex items-center gap-1">
                <Smartphone className="w-3 h-3" />
                <span>Push Dispatched</span>
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/80">
            <span className="text-[10px] text-slate-500 font-mono">
              To: {alert.notification.agent_email}
            </span>

            <div className="flex items-center gap-2">
              {onSelectLead && (
                <button
                  onClick={() => {
                    onSelectLead(alert.lead);
                    handleDismiss(alert.id);
                  }}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-md shadow-purple-600/30 cursor-pointer"
                >
                  <span>Open Lead 360</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
