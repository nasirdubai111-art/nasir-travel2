import React, { useState, useEffect } from "react";
import {
  CrmNotificationSettings,
  CrmAgentNotificationLog,
  CrmLeadEntity,
} from "../../../types/crm";
import { CrmService, DEFAULT_CRM_SETTINGS } from "../../../services/crmService";
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  Send,
  Eye,
  Sliders,
  ShieldCheck,
  Zap,
  Info,
  ExternalLink,
  Trash2,
  ChevronRight,
  Clock,
  UserCheck,
} from "lucide-react";

interface CrmSettingsViewProps {
  onSelectLeadById?: (leadId: string) => void;
  onOpenLeads?: () => void;
}

export const CrmSettingsView: React.FC<CrmSettingsViewProps> = ({
  onSelectLeadById,
  onOpenLeads,
}) => {
  const [settings, setSettings] = useState<CrmNotificationSettings>(CrmService.getSettings());
  const [notifications, setNotifications] = useState<CrmAgentNotificationLog[]>(
    CrmService.getAgentNotifications()
  );
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [selectedPreviewLog, setSelectedPreviewLog] = useState<CrmAgentNotificationLog | null>(
    null
  );
  const [permissionState, setPermissionState] = useState<NotificationPermission>(
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "default"
  );
  const [isSimulating, setIsSimulating] = useState(false);

  const loadData = () => {
    setSettings(CrmService.getSettings());
    setNotifications(CrmService.getAgentNotifications());
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("bharatyatra:crm-updated", handleUpdate);
    return () => window.removeEventListener("bharatyatra:crm-updated", handleUpdate);
  }, []);

  const handleToggleEmail = () => {
    const updated: CrmNotificationSettings = {
      ...settings,
      agentEmailNotification: !settings.agentEmailNotification,
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    CrmService.saveSettings(updated);
    setSettings(updated);
    triggerSaveBanner();
  };

  const handleTogglePush = () => {
    const updated: CrmNotificationSettings = {
      ...settings,
      agentPushNotification: !settings.agentPushNotification,
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    CrmService.saveSettings(updated);
    setSettings(updated);
    triggerSaveBanner();
  };

  const handleToggleSound = () => {
    const updated: CrmNotificationSettings = {
      ...settings,
      soundAlertEnabled: !settings.soundAlertEnabled,
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    CrmService.saveSettings(updated);
    setSettings(updated);
    if (updated.soundAlertEnabled) {
      CrmService.playChimeSound();
    }
    triggerSaveBanner();
  };

  const handleCriteriaChange = (criteria: CrmNotificationSettings["highPriorityCriteria"]) => {
    const updated: CrmNotificationSettings = {
      ...settings,
      highPriorityCriteria: criteria,
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    CrmService.saveSettings(updated);
    setSettings(updated);
    triggerSaveBanner();
  };

  const handleToggleSms = () => {
    const updated: CrmNotificationSettings = {
      ...settings,
      smsAlertFallback: !settings.smsAlertFallback,
      updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
    };
    CrmService.saveSettings(updated);
    setSettings(updated);
    triggerSaveBanner();
  };

  const triggerSaveBanner = () => {
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const requestNotificationPermission = async () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      try {
        const perm = await Notification.requestPermission();
        setPermissionState(perm);
        if (perm === "granted") {
          CrmService.showBrowserPushNotification(
            "🔔 BharatYatra CRM Alerts Enabled",
            "You will now receive desktop notifications for high-priority lead assignments."
          );
        }
      } catch (e) {
        console.error("Error requesting permission", e);
      }
    }
  };

  const handleSimulateAlert = () => {
    setIsSimulating(true);

    const testLeads: CrmLeadEntity[] = [
      {
        lead_id: `LEAD-${Math.floor(1000 + Math.random() * 8999)}`,
        customer_id: `CUST-6001`,
        source: "WhatsApp",
        status: "New",
        assigned_to: "Rahul Sharma (Sr. Yatra Specialist)",
        priority: "Urgent",
        customer_name: "Maharaja Vikramaditya Singhal",
        customer_phone: "+91 98201 99888",
        customer_email: "vikramaditya.singhal@hni-estates.com",
        city: "Jaipur",
        destination: "Chardham By Helicopter VIP Private Charter",
        category: "Pilgrimage",
        deal_value: 480000,
        created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        score: 97,
      },
      {
        lead_id: `LEAD-${Math.floor(1000 + Math.random() * 8999)}`,
        customer_id: `CUST-6002`,
        source: "Meta Ads",
        status: "New",
        assigned_to: "Priya Patel (Luxury Lead)",
        priority: "High",
        customer_name: "Anita & Siddharth Oberoi",
        customer_phone: "+91 98100 77665",
        customer_email: "anita.oberoi@delhicapital.com",
        city: "New Delhi",
        destination: "Kerala Private Lagoon Villa & Luxury Yacht Cruise",
        category: "Resorts",
        deal_value: 340000,
        created_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        updated_at: new Date().toISOString().replace("T", " ").substring(0, 16),
        score: 91,
      },
    ];

    const randomLead = testLeads[Math.floor(Math.random() * testLeads.length)];
    CrmService.dispatchAutomatedAgentAlert(randomLead, settings, true);

    setTimeout(() => {
      setIsSimulating(false);
      loadData();
    }, 500);
  };

  const handleClearLogs = () => {
    if (window.confirm("Clear all dispatched agent notification records?")) {
      CrmService.clearAgentNotifications();
      setNotifications([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-mono mb-1">
            <span>CRM</span>
            <span>&gt;</span>
            <span className="text-white font-bold">suite_settings</span>
            <span>&gt;</span>
            <span className="text-indigo-300">automated_agent_alerts</span>
          </div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <span>Automated Agent Notification Settings</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">
              High-Priority Inbound
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure automated instant email dispatch and push alerts to assigned sales agents whenever a new high-priority lead is registered.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateAlert}
            disabled={isSimulating}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-purple-600/30 flex items-center gap-2 cursor-pointer"
          >
            <Zap className={`w-4 h-4 ${isSimulating ? "animate-spin" : ""}`} />
            <span>Simulate High-Priority Alert</span>
          </button>
        </div>
      </div>

      {/* Save Success Alert Banner */}
      {saveSuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>CRM notification settings updated and synced across all agent workspaces.</span>
        </div>
      )}

      {/* Dual Toggle Cards: Email & Push */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1. Automated Email Notifications for Assigned Agents */}
        <div className={`p-5 rounded-2xl border transition-all ${
          settings.agentEmailNotification
            ? "bg-slate-900/90 border-indigo-500/40 shadow-lg shadow-indigo-950/20"
            : "bg-slate-950/80 border-slate-800 opacity-80"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.agentEmailNotification
                  ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                  : "bg-slate-800 text-slate-500"
              }`}>
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Automated Email Notifications</span>
                  {settings.agentEmailNotification ? (
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                      DISABLED
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Send immediate travel inquiry dossier to assigned agent's inbox
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              id="toggle-crm-agent-email"
              onClick={handleToggleEmail}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.agentEmailNotification ? "bg-indigo-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.agentEmailNotification ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-2.5 text-slate-300">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Delivery Protocol:</span>
              <span className="text-white font-mono font-semibold">SMTP / Resend / AWS SES</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Target Recipient:</span>
              <span className="text-indigo-300 font-mono font-medium">{"{assigned_agent}"}@bharatyatra.com</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>Contents:</span>
              <span className="text-slate-200">Customer budget, itinerary, WhatsApp link, CRM deep link</span>
            </div>

            {/* Email Preview Snippet Card */}
            <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-sans text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center justify-between">
                <span>Sample Agent Email Preview</span>
                <span className="text-emerald-400 font-mono">200 OK</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 space-y-1">
                <div className="font-bold text-white text-[11px]">
                  ⚡ [HIGH-PRIORITY LEAD] New Travel Inquiry Assigned: Maharaja Vikramaditya
                </div>
                <div className="text-[10px] text-slate-400">
                  From: <span className="text-indigo-400">crm-alerts@bharatyatra.com</span> • To: <span className="text-indigo-400">rahul.sharma@bharatyatra.com</span>
                </div>
                <div className="text-[10px] text-slate-300 pt-1 border-t border-slate-800">
                  Package: <strong className="text-white">Chardham Helicopter Charter (₹4.8L)</strong> • Contact: <span className="text-cyan-400">+91 98201 99888</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Automated Push Notifications for Assigned Agents */}
        <div className={`p-5 rounded-2xl border transition-all ${
          settings.agentPushNotification
            ? "bg-slate-900/90 border-purple-500/40 shadow-lg shadow-purple-950/20"
            : "bg-slate-950/80 border-slate-800 opacity-80"
        }`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                settings.agentPushNotification
                  ? "bg-purple-600/20 text-purple-400 border border-purple-500/30"
                  : "bg-slate-800 text-slate-500"
              }`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Automated Push Notifications</span>
                  {settings.agentPushNotification ? (
                    <span className="px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                      ACTIVE
                    </span>
                  ) : (
                    <span className="px-2 py-0.2 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                      DISABLED
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant in-app floating banner &amp; browser push to active agent devices
                </p>
              </div>
            </div>

            {/* Switch Toggle */}
            <button
              id="toggle-crm-agent-push"
              onClick={handleTogglePush}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.agentPushNotification ? "bg-purple-600" : "bg-slate-700"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.agentPushNotification ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 text-xs space-y-3 text-slate-300">
            {/* Browser Permission Status */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="text-[11px] font-bold text-white">Browser Push Permission</div>
                  <div className="text-[10px] text-slate-400">
                    Status: <span className="font-mono text-purple-300 uppercase">{permissionState}</span>
                  </div>
                </div>
              </div>

              {permissionState !== "granted" ? (
                <button
                  onClick={requestNotificationPermission}
                  className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold cursor-pointer"
                >
                  Enable Permissions
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed</span>
                </span>
              )}
            </div>

            {/* Sound Chime Toggle */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center gap-2">
                {settings.soundAlertEnabled ? (
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                ) : (
                  <VolumeX className="w-4 h-4 text-slate-500" />
                )}
                <div>
                  <div className="text-[11px] font-bold text-white">Audible Alert Sound (Chime)</div>
                  <div className="text-[10px] text-slate-400">Plays gentle D5/A5 alert tone upon lead arrival</div>
                </div>
              </div>

              <button
                onClick={handleToggleSound}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  settings.soundAlertEnabled
                    ? "bg-cyan-600/20 text-cyan-300 border border-cyan-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {settings.soundAlertEnabled ? "Sound ON" : "Muted"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trigger Conditions & Thresholds */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>High-Priority Lead Trigger Criteria</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Specify the qualification rule that triggers automated agent notifications
            </p>
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Active: <span className="text-indigo-300 font-semibold">{settings.highPriorityCriteria}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: "high_or_urgent" as const,
              title: "Priority: High / Urgent",
              desc: "Explicit 'High' or 'Urgent' label or score ≥ 85",
              badge: "Recommended",
            },
            {
              id: "score_80" as const,
              title: "AI Score ≥ 80",
              desc: "Inbound travel inquiries with intent score 80-100",
              badge: "AI Powered",
            },
            {
              id: "deal_value_150k" as const,
              title: "Deal Value ≥ ₹1.5 Lakhs",
              desc: "Luxury packages & corporate MICE inquiries",
              badge: "High Value",
            },
            {
              id: "any_lead" as const,
              title: "All New Inquiries",
              desc: "Notify assigned agent on every newly generated lead",
              badge: "Omnichannel",
            },
          ].map((item) => {
            const isSelected = settings.highPriorityCriteria === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleCriteriaChange(item.id)}
                className={`p-3 rounded-xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? "bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                    : "bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-bold text-white">{item.title}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      isSelected
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Fallback SMS Setting */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Zap className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">SMS Alert Fallback (Twilio / Gupshup)</div>
              <div className="text-[11px] text-slate-400">
                Send emergency SMS alert if the agent is offline or push is unacknowledged within 10 minutes.
              </div>
            </div>
          </div>

          <button
            onClick={handleToggleSms}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              settings.smsAlertFallback
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold"
                : "bg-slate-800 text-slate-400 border border-slate-700"
            }`}
          >
            {settings.smsAlertFallback ? "SMS Enabled" : "SMS Disabled"}
          </button>
        </div>
      </div>

      {/* Dispatched Agent Notifications Audit Stream */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Automated Agent Dispatches Audit Stream</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                {notifications.length} Logs
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Live audit stream of all email and push notifications automatically delivered to assigned agents
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenLeads && (
              <button
                onClick={onOpenLeads}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>View Leads</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Logs</span>
              </button>
            )}
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-slate-400 text-xs">
            No agent notifications have been dispatched yet. Click "Simulate High-Priority Alert" or create a high-priority lead to test.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Assigned Agent</th>
                  <th className="px-4 py-3">Lead / Traveler</th>
                  <th className="px-4 py-3">Deal Value</th>
                  <th className="px-4 py-3">Channels</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {notifications.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {item.timestamp}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{item.assigned_to}</div>
                      <div className="text-[10px] text-indigo-400 font-mono">{item.agent_email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-200">{item.customer_name}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">{item.destination}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                      ₹{item.deal_value.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        item.channel === "Both"
                          ? "bg-purple-950 text-purple-300 border-purple-500/30"
                          : item.channel === "Email"
                          ? "bg-cyan-950 text-cyan-300 border-cyan-500/30"
                          : "bg-indigo-950 text-indigo-300 border-indigo-500/30"
                      }`}>
                        {item.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30 flex items-center gap-1 w-max">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span>{item.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setSelectedPreviewLog(item)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 text-[11px] font-semibold border border-slate-700 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect Notification Modal */}
      {selectedPreviewLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Mail className="w-5 h-5 text-indigo-400" />
                <span>Agent Notification Payload Details</span>
              </h4>
              <button
                onClick={() => setSelectedPreviewLog(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="text-[11px] text-slate-400">
                  Notification ID: <span className="text-white font-mono">{selectedPreviewLog.id}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Lead Reference: <span className="text-indigo-300 font-mono">{selectedPreviewLog.lead_id}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Recipient Agent: <span className="text-white font-bold">{selectedPreviewLog.assigned_to}</span> ({selectedPreviewLog.agent_email})
                </div>
                <div className="text-[11px] text-slate-400">
                  Channel: <span className="text-purple-300 font-semibold">{selectedPreviewLog.channel}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Timestamp: <span className="text-slate-200 font-mono">{selectedPreviewLog.timestamp}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Subject Header</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-[11px]">
                  {selectedPreviewLog.subject}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Message Body Payload</label>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans text-xs">
                  {selectedPreviewLog.preview_text}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-800">
              {onSelectLeadById && (
                <button
                  onClick={() => {
                    onSelectLeadById(selectedPreviewLog.lead_id);
                    setSelectedPreviewLog(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                >
                  Open Lead 360
                </button>
              )}
              <button
                onClick={() => setSelectedPreviewLog(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
